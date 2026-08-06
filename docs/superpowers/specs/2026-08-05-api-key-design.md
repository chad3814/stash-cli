# API Key Authentication — Design

## Goal

Let `stash` talk to a stash server that requires authentication, by sending an API key,
without the key ever passing through the shell history, the process table, or the CLI's
own output.

## Current State

The CLI sends no credentials of any kind.

- `src/graphql.ts:49-55` sets only `content-type` and `accept`.
- `src/download.ts:33` is a bare `fetch(url)`.
- `src/stash.ts:19` reads one environment variable, `STASH_ENDPOINT`. There is no
  `--api-key` flag and no username/password anywhere in the surface.

Against a server with authentication enabled, every command fails. It fails *readably*
now — a non-2xx response is an `OperationalError`, so it prints a sentence rather than a
stack — but the message says only "failed with status 401", which does not tell the user
what to do about it.

## Decision: API Key Only

stash offers two mechanisms. This design implements one.

**API key** — the `ApiKey` request header. Stateless, revocable from stash's UI, and one
header on a request the CLI already makes.

**Session cookie** — `POST /login` with `username` and `password` form fields, then carry
the returned cookie. Rejected, for two independent reasons:

1. `stash` runs once and exits. A cookie cannot outlive the process, so every invocation
   would pay a login round trip before doing any work and then discard the session. That
   also means storing a *password* — a credential that grants everything and cannot be
   revoked independently — rather than a scoped, revocable key.
2. stash's own documentation marks session authentication obsolete as of v0.7 and
   recommends the API key.

The header name is `ApiKey`, verified against <https://docs.stashapp.cc/api/> rather than
assumed. Capitalisation is as written; the key is generated in stash under
**Settings → Security → Authentication**.

> *Note on sources:* the mechanisms were originally quoted from stash-box's README, but
> this CLI talks to **stashapp/stash**, not stash-box. Confirmed from the schema generated
> off the live server — `metadataScan`, `jobQueue`, `metadataGenerate`, and
> `ConfigGeneralResult` are present, while stash-box's `submitSceneDraft`, `queryEdits`,
> `querySites`, and `tagCategories` are absent — and from the default port, 9999. The two
> products happen to agree on both mechanisms, but the header name was re-verified against
> stash's own documentation before being written down here.

## Where the Key Is Resolved

The key is a property of the **transport**, not of any operation. It is therefore resolved
at the point of the outbound request, not threaded through the nine operations in
`src/stash.ts`.

This is not only less plumbing — it is what makes `scripts/codegen.ts` work. Codegen
reaches the server through the same `request()` function (`scripts/codegen.ts:16`), so
authenticating the transport authenticates schema regeneration with no change to the
codegen script at all. Threading an `apiKey` parameter through the operations would leave
codegen broken against an authenticated server until it was separately updated.

### New module: `src/auth.ts`

```ts
/**
 * Resolves the key from `override`, else `STASH_API_KEY`. Trims it, and treats unset,
 * empty, and whitespace-only alike as absent.
 */
export function resolveApiKey(override?: string): string | undefined;

/** `{ ApiKey: key }`, or `{}` when there is no key. */
export function authHeaders(apiKey?: string): Record<string, string>;

/** An actionable message for 401/403, or undefined for any other status. */
export function authFailureMessage(status: number, target: string, apiKey?: string): string | undefined;
```

`resolveApiKey` **trims**, and a value that is only whitespace counts as no key at all,
because `STASH_API_KEY=$(cat key.txt)` picks up a trailing newline.

> *Correction, made after implementation.* This section originally justified the trim by
> claiming a header value with a stray newline "is at best rejected and at worst refused
> outright by the HTTP layer — a failure whose cause would be invisible in the message".
> The second half is false, and dangerously so: undici quotes the offending value **in
> full** in its `TypeError`. Because that is not an `OperationalError`, it reached stderr
> with a stack trace, printing the key. The cause was not invisible — the key was.
>
> Trimming never addressed this, because it only touches the ends and the damaging case is
> a break in the *middle*, which is exactly what a wrapped or multi-line key file yields.
> Two things now cover it: `authHeaders` refuses a key containing NUL, CR, or LF before it
> reaches `fetch`, naming the variable and never the value; and `index.ts` renders every
> error through `redactApiKey`, so a message this code did not write — undici's, or a
> `caused by:` chain — cannot disclose the key either. Both were verified to work
> independently of the other.

`target` is the URL the request was made to, passed by the caller. `src/graphql.ts` has an
endpoint and `src/download.ts` has a download URL; both are useful to name in the message,
and neither module should have to know how the other phrases it.

`src/auth.ts` depends on nothing but `node:process`. `src/graphql.ts` and
`src/download.ts` both import it. No cycle: `stash.ts → graphql.ts → auth.ts`.

The `override` parameter exists for testability and follows the precedent already set by
`formatEta`'s injected `now`. Without it, an in-process test would inherit whatever
`STASH_API_KEY` happens to be exported in the developer's shell, and a test asserting
"no header is sent when no key is set" would fail on a machine that has one — the same
class of ambient-environment dependency that `runCli`'s `STASH_ENDPOINT` default fixed.

## Behaviour

**Key set.** `ApiKey: <value>` is added to the GraphQL request and to the download
request. A server that authenticates one authenticates the
other; without this, `backup --download` would run the mutation successfully and then fail
to fetch the result, leaving the user with a completed job and no file.

**Key unset or empty.** No `ApiKey` header is sent, and the request is byte-for-byte what
the CLI sends today. An unauthenticated server keeps working with no configuration.

**Rejected.** A 401 or 403 produces one of two messages, because the remedy differs:

| Condition | Message |
|---|---|
| no key was sent | `<target> requires authentication; set STASH_API_KEY (stash: Settings > Security > Authentication)` |
| a key was sent | `<target> rejected the API key in STASH_API_KEY; it may be revoked, or from a different server` |

Both are `OperationalError`, so they print as a sentence with no stack. Any other non-2xx
status keeps the existing generic message.

## Secret Hygiene

These are requirements, not conventions.

- **No CLI flag.** A `--api-key` option would put the secret in shell history and in `ps`
  output for every other user on the machine. The key comes from `STASH_API_KEY` only.
  This also composes with `op run` and `direnv` without the CLI knowing anything about a
  secret store.
- **The key never appears in output.** No message may interpolate it. This needs enforcing
  rather than assuming, because two existing behaviours push the other way: error messages
  already interpolate the response body and the endpoint URL, and
  `describeOperationalError` now prints a cause chain, which is a second path by which an
  underlying error's text reaches the terminal.
- **A test asserts it.** A distinctive fake key is set, every failure path is exercised,
  and both stdout and stderr are searched for the value. This is the guarantee that
  survives a future refactor; a comment is not.

## Non-Goals

- Session/cookie authentication (obsolete upstream; see above).
- Storing, generating, or rotating keys. `generateAPIKey` exists in the schema and is
  deliberately not exposed — this CLI reads a key, it does not manage one.
- A credential per endpoint. One key for one server; someone with two servers exports a
  different value.
- **Restricting which origin receives the key.** This was originally listed as
  "authenticating anything but stash's own origin", implying a boundary the code enforces.
  It does not, and cannot cheaply: the download link stash returns is an **absolute** URL
  (a real one is `http://127.0.0.1:9999/downloads/2276383b/stash-go.sqlite.anonymous...`),
  so the server chooses the host, and neither transport pins `redirect`.

  A strict same-origin check is not viable — the real link's `127.0.0.1:9999` and the
  default endpoint's `localhost:9999` are different origins to `URL`, so it would reject
  the ordinary case. Accepting this is the right call on the merits rather than only for
  convenience: any host that can hand out a link or a redirect **already holds the key**,
  having received it on the request that produced the link, so redirecting it elsewhere
  grants an attacker nothing new. If defence in depth is ever wanted, the shape that works
  is a loopback-normalised comparison — treat `localhost`, `127.0.0.1`, and `::1` as one
  host and compare host and port.

## Files

| File | Change |
|---|---|
| `src/auth.ts` | **new** — the three functions above |
| `src/graphql.ts` | spread `authHeaders()` into the request headers; consult `authFailureMessage` on a non-ok status |
| `src/download.ts` | pass `authHeaders()` to `fetch`; consult `authFailureMessage` on a non-ok status |
| `tests/auth.test.ts` | **new** — unit tests for resolution and message selection |
| `tests/cli.test.ts` | header presence/absence and the redaction assertion, end to end |
| `README.md` | document `STASH_API_KEY` alongside `STASH_ENDPOINT` |
| `scripts/codegen.ts` | **none** — authenticated for free via `request()` |

## Testing

- `resolveApiKey`: unset, empty string, whitespace-only, present; explicit override wins
  over the environment.
- `authHeaders`: exact key name `ApiKey` and casing; `{}` when absent.
- `authFailureMessage`: 401 and 403 with and without a key; `undefined` for 200, 404, 500.
- End to end against a stub that inspects the received header: the header is present with
  a key and absent without one; a stub returning 401 produces the right one of the two
  messages.
- `--download` against a stub that requires the header, proving the download path carries
  it — the failure this prevents is a successful backup with no local file.
- Redaction: a distinctive fake key across every failure path, asserting it appears in
  neither stdout nor stderr.
- No test may reach a real server; `runCli` already defaults `STASH_ENDPOINT` to a dead
  port.

## Risks

The change is in the transport, so a mistake affects every command. Two failure modes are
worth naming: a wrong header name means every request against an authenticated server
fails with a confusing 401 while working fine unauthenticated (mitigated by verifying the
name against stash's documentation, and by an end-to-end test asserting the exact header a
stub receives); and a leaked key would be printed, logged, and possibly committed
(mitigated by the redaction test and by refusing a CLI flag).

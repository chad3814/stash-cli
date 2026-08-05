# stash-cli: Subcommands and Argument Parsing

**Date:** 2026-08-04 (revised 2026-08-05)
**Status:** Approved, not yet planned

> **Revised after the schema codegen work landed.** This spec was written before
> `src/generated/schema.d.ts` existed. The revision adds one material decision — inputs
> move to GraphQL variables so the generated input types actually check them — and
> corrects claims that the codegen and release work made false. Every schema fact below
> was re-verified against the generated types and still holds.

## Goal

Replace the single `--rescan` flag with a subcommand surface covering the stash
maintenance tasks, parsed properly so that unknown input fails instead of being ignored.

Today's parsing is five lines and has three holes: an unrecognised flag is silently
ignored and exits 0 (`stash --resacn` prints the queue), only `argv[2]` is examined (so
`stash foo --rescan` drops the `--rescan`), and there is no `--help` or `--version`, so
nothing in the tool documents `STASH_ENDPOINT` or the one flag it accepts.

## Schema Facts

These are now available as generated types in `src/generated/schema.d.ts` rather than
prose to be trusted — the table below is a summary, and the file is the authority. All of
it was re-verified against the generated output. **The mutation names are British where the
CLI is American** — `anonymiseDatabase` and `optimiseDatabase` — which is easy to mistake
for a typo.

The generated operation map states each signature exactly:

```ts
metadataScan: { args: { input: ScanMetadataInput }; result: string };
optimiseDatabase: { args: Record<string, never>; result: string };
backupDatabase: { args: { input: BackupDatabaseInput }; result: string | null };
```

Note `backupDatabase` and `anonymiseDatabase` are the only two whose `result` is
`string | null` — the generated types encode the synchronous/asynchronous split described
below, so it is checkable rather than remembered.

| Mutation | Input | Returns |
|---|---|---|
| `metadataScan` | `ScanMetadataInput!` | `ID!` — job id |
| `metadataIdentify` | `IdentifyMetadataInput!` | `ID!` — job id |
| `metadataGenerate` | `GenerateMetadataInput!` | `ID!` — job id |
| `metadataCleanGenerated` | `CleanGeneratedInput!` | `ID!` — job id |
| `optimiseDatabase` | none | `ID!` — job id |
| `metadataExport` | none | `ID!` — job id |
| `backupDatabase` | `BackupDatabaseInput!` | `String` — nullable link |
| `anonymiseDatabase` | `AnonymiseDatabaseInput!` | `String` — nullable link |

**The critical distinction is the return type.** Six mutations queue an asynchronous job
and hand back its id. `backupDatabase` and `anonymiseDatabase` are synchronous: they do
the work during the request and return *"Optionally … a link to download the database
file"*, or null when no download was asked for. They never appear in the job queue, so
printing the queue after them — which is what `--rescan` does today — would be
meaningless.

Relevant input fields:

- `BackupDatabaseInput`: `download: Boolean`, `includeBlobs: Boolean`
- `AnonymiseDatabaseInput`: `download: Boolean`
- `CleanGeneratedInput`: `blobFiles`, `sprites`, `screenshots`, `transcodes`, `markers`,
  `imageThumbnails`, `dryRun` — all optional `Boolean`
- `ScanMetadataInput` has its own `rescan: Boolean`, which is **not** what the CLI's old
  `--rescan` meant and stays unset.

## Command Surface

| Command | Action | Output |
|---|---|---|
| `stash` | query `jobQueue` | the queue, unchanged from today |
| `stash sig` | `metadataScan` + `metadataIdentify` + `metadataGenerate` in one document | 3 job ids, then the queue |
| `stash scan` | `metadataScan` | job id, then the queue |
| `stash identify` | `metadataIdentify` | job id, then the queue |
| `stash generate` | `metadataGenerate` | job id, then the queue |
| `stash clean-generated` | `metadataCleanGenerated` | job id, then the queue |
| `stash optimize-db` | `optimiseDatabase` | job id, then the queue |
| `stash export` | `metadataExport` | job id, then the queue |
| `stash backup [--download] [--include-blobs]` | `backupDatabase` | link, or a completion line |
| `stash anonymize [--download]` | `anonymiseDatabase` | link, or a completion line |

`sig` is short for scan-identify-generate and replaces `--rescan` outright — no alias.
It keeps today's behavior of composing all three mutations into a single GraphQL
document, so the three jobs are queued in one round trip.

Every job command prints the queue afterwards, preserving what `--rescan` does today.

### Global options

- `--endpoint URL` — overrides the endpoint. Precedence: flag, then `STASH_ENDPOINT`,
  then `http://localhost:9999/graphql`.
- `--help`, `-h` — usage, exit 0.
- `--version`, `-V` — version, exit 0.

### Deliberately absent

- **`clean`** (`metadataClean`) — omitted for now. It is the only operation that is
  irreversible, and its `dryRun` field is `Boolean!`, i.e. stash forces every caller to
  state explicitly whether the run is real. It deserves a guard, and the guard should
  arrive with it.
- **Confirmation prompts, `--yes`, `--dry-run`** — with `clean` absent nothing left is
  irreversible. `clean-generated` deletes regenerable files, and everything else is
  additive. A prompt plus a `--yes` escape hatch plus non-TTY handling would be
  machinery guarding nothing. `CleanGeneratedInput.dryRun` exists in the schema but the
  stash web UI does not expose it, so neither does this.
- **Watch mode and interactive search** — wanted later, out of scope here.

## Argument Parsing

`node:util`'s `parseArgs`. It handles long and short flags, `--flag=value`, positionals,
and strict rejection of unknown options, and costs nothing in the bundle — which matters
for a project whose `dependencies` is `{}` and whose artifact is 4,896 bytes against a
15,000-byte ceiling enforced by `tests/bundle.test.ts`.

Parsing is **two-stage**, which is what makes per-command flag validation fall out for
free rather than needing hand-written checks:

1. Take `process.argv.slice(2)`. If the first token does not begin with `-`, it is the
   command name. Resolve it against the command table; an unknown name is an error
   listing the valid commands.
2. Parse the remaining arguments with `strict: true` against **only that command's**
   option spec, plus the globals. So `stash scan --download` fails with "unknown option
   --download" without anyone writing a rule for it.

`--help`/`-h` and `--version`/`-V` are honoured with or without a command, and both are
accepted in every command's spec so `stash backup --help` works.

Failure modes, all exiting 1 with a message on stderr:

- unknown command
- unknown option for the given command
- more than one positional — one operation per invocation, by design
- a missing value for `--endpoint`

## Architecture

`ENDPOINT` is currently a module-level `const` in `src/stash.ts`, evaluated at import.
A `--endpoint` flag cannot work that way: the value is not known until arguments are
parsed. The endpoint therefore becomes an explicit parameter threaded from the CLI into
each operation, and the module-level constant becomes a default-resolution function.

| File | Responsibility |
|---|---|
| `index.ts` | entry point only: call the CLI, wire `process.exit` |
| `src/cli.ts` | argument parsing, command table, dispatch, help and version text |
| `src/stash.ts` | the GraphQL documents and one function per operation, each taking an endpoint |
| `src/graphql.ts` | gains an optional `variables` argument — see below |
| `src/format.ts` | unchanged by this work |
| `src/generated/schema.d.ts` | unchanged — consumed, never edited. Regenerate with `npm run codegen` |

The command table is the single place a command's name, its mutation, its options, and
its help line live together, so adding `clean` later is one entry plus one function.

`src/stash.ts` already composes its response types from the generated operation map
(`Mutations['metadataScan']['result']`), and each new command's response type is declared
the same way rather than hand-written.

### Inputs go through GraphQL variables

This is the one design change the codegen work forces, and it is the reason that work was
worth doing.

Today's documents inline their input as a literal inside a template string:

```ts
const doc = gql`mutation { metadataScan(input: { scanGenerateCovers: true }) }`;
```

A misspelled field there is invisible to `tsc`, because it is text inside a string. That
was the stated justification for a test asserting on the posted document's contents — and
with generated input types available, it is no longer the best available guarantee.

Inputs therefore move to variables:

```ts
const scanDocument = gql`
mutation($input: ScanMetadataInput!) {
  metadataScan(input: $input)
}
`;

const input: ScanMetadataInput = { scanGenerateCovers: true /* a typo here fails tsc */ };
await request<ScanResponse>(endpoint, scanDocument, { input });
```

`request<T>(endpoint, query)` gains an optional third parameter and sends
`{ query, variables }` instead of `{ query }`. Omitting it must send a body identical to
today's, so nothing about the existing query path changes — there is a test for that,
because `src/graphql.ts` is the one piece of infrastructure every command depends on.

The eight mutations with inputs all move. `sig` composes three in one document and declares
three variables:

```
mutation($scan: ScanMetadataInput!, $identify: IdentifyMetadataInput!, $generate: GenerateMetadataInput!)
```

`optimiseDatabase` and `metadataExport` take no arguments and need no variables.

The consequence for testing is that a wrong input field becomes a compile error rather than
something a stub test has to notice — see Testing below.

### `--version` in a standalone bundle

The artifact is one file with no `node_modules`, so it cannot read `package.json` at
runtime. The version is injected at build time via esbuild's `define`, from the version
already in `package.json`. A test asserts the built bundle reports the same version the
manifest declares, so the two cannot drift.

**The tag/manifest drift this section was written to warn about has already been closed.**
When this spec was drafted, `package.json` said `1.0.0` while the newest tag was `v1.0.1`,
so a naive injection would have shipped a `v1.0.1` release reporting `1.0.0`. `release.yml`
now fails a release whose tag does not match `package.json` (`f0ad668`), and the manifest
is aligned at `1.0.2`. Build-time injection is therefore safe: the version it injects
cannot disagree with the tag being released, because the release would not have run.

### `--download`

`backupDatabase` and `anonymiseDatabase` return a server-relative link. The CLI resolves
it against the endpoint's origin (`new URL(link, endpoint)`) and streams it to a file in
the working directory. Without `--download` the mutation is called with `download: false`
and stash writes the file server-side; the CLI reports completion.

The local filename is the basename of the resolved URL's path. If that is empty or would
escape the working directory, the CLI falls back to `stash-backup-<tag>` or
`stash-anonymised-<tag>`, where `<tag>` is the operation's own name — no timestamp, so
the name is deterministic and testable. **An existing file is never overwritten**: the
CLI reports the collision and exits 1, so a second backup cannot silently destroy the
first. A download that fails partway deletes the partial file before exiting 1, so a
truncated database is never left looking like a complete one.

## Error Handling

Unchanged in shape: `main()` rejections are caught at the top level, logged, and exit 1;
success exits 0. GraphQL and transport failures already throw from `src/graphql.ts` with
the server's own message.

Argument errors are distinguished from operational failures by being reported as a usage
error — message plus a pointer to `--help` — rather than a stack trace.

## Testing

All tests run against the `node:http` stub server already used by
`tests/stash.test.ts`. **No destructive or side-effecting mutation is ever sent to a real
stash server during development or testing**, including from a manual check.

- **Parsing** (`tests/cli.test.ts`): each command dispatches to the right operation; an
  unknown command exits 1; an unknown option for a command exits 1; a per-command option
  rejected on the wrong command; `--endpoint` beating `STASH_ENDPOINT`; `--help` and
  `--version` exiting 0; two positionals rejected.
- **Operations** (`tests/stash.test.ts`): for each command, assert the posted body names
  the expected mutation and carries the expected variables. **Input field names no longer
  need asserting** — they are declared against the generated input types, so a wrong one is
  a compile error rather than something a test must catch. What the tests still earn is the
  wiring: that the right command sends the right mutation, that variables arrive under the
  right names, that job commands print the queue afterwards, and that the two synchronous
  ones do not.
- **`request()` compatibility** (`tests/graphql.test.ts`): calling it without variables must
  post a body byte-identical to today's `{ "query": … }`. It is the one module every command
  depends on, so its existing contract needs pinning before a parameter is added to it.
- **`--download`**: the stub returns a link; assert the CLI fetches it and writes the
  file, and that a failed download exits 1.
- **Version**: the built bundle's `--version` matches `package.json`.

## Known Limitations

- `backupDatabase` on a large database holds the HTTP request open for the whole
  operation, and `src/graphql.ts` sets no timeout. A long backup will appear to hang.
  Adding a timeout is not in scope; it is recorded here so the behavior is not a
  surprise.
- The two synchronous operations give no progress indication, because the API offers
  none for them.

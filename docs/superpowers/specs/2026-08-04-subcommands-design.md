# stash-cli: Subcommands and Argument Parsing

**Date:** 2026-08-04
**Status:** Approved, not yet planned

## Goal

Replace the single `--rescan` flag with a subcommand surface covering the stash
maintenance tasks, parsed properly so that unknown input fails instead of being ignored.

Today's parsing is five lines and has three holes: an unrecognised flag is silently
ignored and exits 0 (`stash --resacn` prints the queue), only `argv[2]` is examined (so
`stash foo --rescan` drops the `--rescan`), and there is no `--help` or `--version`, so
nothing in the tool documents `STASH_ENDPOINT` or the one flag it accepts.

## Schema Facts

These were introspected from a live stash server rather than assumed, and they drive the
design. **The mutation names are British where the CLI is American** — `anonymiseDatabase`
and `optimiseDatabase` — which is easy to mistake for a typo.

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
for a project whose `dependencies` is `{}` and whose artifact is 4.6 KB.

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
| `src/graphql.ts` | unchanged — `request<T>(endpoint, query)` already takes an endpoint |
| `src/format.ts` | unchanged |

The command table is the single place a command's name, its mutation, its options, and
its help line live together, so adding `clean` later is one entry plus one function.

### `--version` in a standalone bundle

The artifact is one file with no `node_modules`, so it cannot read `package.json` at
runtime. The version is injected at build time via esbuild's `define`, from the version
already in `package.json`. A test asserts the built bundle reports the same version the
manifest declares, so the two cannot drift.

**`package.json` and the release tag can still drift, and already have:** at the time of
writing, `package.json` says `1.0.0` while the newest tag is `v1.0.1`, so a naive
injection would have shipped a `v1.0.1` release whose `--version` reported `1.0.0`. A
release asserting the wrong version is worse than one asserting none. `release.yml`
therefore gains a check that `package.json`'s version matches the tag being built
(`v${version}` === `$GITHUB_REF_NAME`) and fails the release when it does not, which is
free to enforce and turns a silent lie into a red run before anything is published.

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
- **Operations** (`tests/stash.test.ts`): for each command, assert the document actually
  posted contains the expected mutation and input fields, since a wrong input field is
  invisible to a type check and would only fail against a real server. Assert job
  commands print the queue afterwards and the two synchronous ones do not.
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

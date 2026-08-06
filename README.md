# stash-cli

A small command-line view of a local [stashdb](https://github.com/stashapp/stash)
instance's job queue. It queries the server's GraphQL API and prints each job
with a progress bar, a percentage, an ETA, and its current subtasks.

## Usage

```sh
stash              # print the job queue
stash <command>    # run a maintenance task, then print the queue
```

| Command | What it does |
|---|---|
| `sig` | scan, identify and generate in one pass — replaces the old `--rescan` |
| `scan` | scan for new and changed files |
| `identify` | identify scenes using scrapers |
| `generate` | generate covers, previews, sprites and phashes |
| `clean-generated` | delete generated files with no matching scene |
| `optimize-db` | optimise the database |
| `export` | export metadata to the metadata directory |
| `backup` | back up the database |
| `anonymize` | write an anonymised copy of the database |

Options:

```sh
--endpoint <url>   override the GraphQL endpoint
-h, --help         show usage
-V, --version      show the version
```

`backup` and `anonymize` accept `--download`, which fetches the file stash produces into
the current directory, named after the link stash returns. An existing file is never
overwritten — the CLI reports the collision and exits 1 — and a transfer that fails partway
is deleted rather than left looking like a complete database. Without `--download`, stash
writes the file server-side and the CLI reports the link it was given.

`backup` also accepts `--include-blobs`.

An unrecognised command or flag exits 1 rather than being ignored, and a failed task exits
nonzero, so `stash sig && ...` behaves as expected.

The endpoint is taken from `--endpoint`, then `STASH_ENDPOINT`, then
`http://localhost:9999/graphql`:

```sh
STASH_ENDPOINT=http://media.local:9999/graphql stash
stash --endpoint http://media.local:9999/graphql
```

If the server requires authentication, set `STASH_API_KEY` to the key from stash's
**Settings > Security > Authentication**. It's optional — omitting it sends no `ApiKey`
header at all, which is how an unauthenticated stash expects to be talked to. There is no
`--api-key` flag: the key is read from the environment only, so it need not land in shell
history or shows up in `ps` output for every other user on the machine. Pull it from a
secret manager instead of typing it directly:

```sh
STASH_API_KEY=$(op read 'op://Personal/stash/api key') stash sig
```

## Build and install

```sh
npm install
npm run build
cp dist/stash.js ~/bin/stash
```

Or download it from a tagged release instead of building. GitHub release assets do
not keep the executable bit, so it needs `chmod`:

```sh
curl -L -o ~/bin/stash \
  https://github.com/chad3814/stash-cli/releases/latest/download/stash
chmod +x ~/bin/stash
```

`npm run build` produces a single executable file at `dist/stash.js`, around 14 KB.
The CLI has no runtime dependencies — it talks to the GraphQL API over `fetch`
directly — so copy the file anywhere on your `PATH`. It needs no `node_modules` beside
it, but it does need Node installed to run.

## Generated schema types

`src/generated/schema.d.ts` holds TypeScript types for the whole stash GraphQL schema.
`npm run codegen` regenerates it by introspecting a running stash server, so it needs a
reachable one (`STASH_ENDPOINT` applies here too). The file is committed because CI has no
server. Never hand-edit anything under `src/generated`; change the printer in
`scripts/codegen/` and regenerate.

`npm run codegen:check` proves the committed file matches the server. Note that it
**rewrites the file** and then diffs, so a failure leaves the drift in your working tree —
`git checkout -- src/generated/schema.d.ts` to discard it. It diffs against the index, not
`HEAD`, so a staged change to the file will not be reported.

If codegen fails with `unmapped custom scalar`, a newer stash has introduced a scalar the
generator does not know. Add a deliberate entry to `SCALAR_MAP` in
`scripts/codegen/print.ts`; there is no default, on purpose.

The generated file carries no version stamp — that keeps regeneration byte-identical for
an unchanged schema — so when you regenerate, put the stash version you introspected in
the commit message.

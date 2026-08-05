# stash-cli

A small command-line view of a local [stashdb](https://github.com/stashapp/stash)
instance's job queue. It queries the server's GraphQL API and prints each job
with a progress bar, a percentage, an ETA, and its current subtasks.

## Usage

```sh
stash            # print the job queue
stash --rescan   # trigger a scan, identify, and generate pass, then print the queue
```

A failed rescan exits nonzero, so `stash --rescan && ...` behaves as expected.

`STASH_ENDPOINT` overrides the default endpoint, `http://localhost:9999/graphql`:

```sh
STASH_ENDPOINT=http://media.local:9999/graphql stash
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

`npm run build` produces a single executable file at `dist/stash.js`, around 4.5 KB.
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

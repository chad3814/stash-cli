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

`npm run build` produces a single executable file at `dist/stash.js`, around 4.5 KB.
The CLI has no runtime dependencies — it talks to the GraphQL API over `fetch`
directly — so copy the file anywhere on your `PATH`. It needs no `node_modules` beside
it, but it does need Node installed to run.

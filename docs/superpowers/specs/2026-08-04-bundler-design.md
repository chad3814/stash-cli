# stash-cli: Bundled Standalone Build

**Date:** 2026-08-04
**Status:** Approved

## Goal

Produce a single file, `dist/stash.js`, that runs the stash-cli with no `node_modules`
present. Copying that one file onto `PATH` must be sufficient to use the tool:

```
$ npm run build
$ cp dist/stash.js ~/bin/stash
$ stash            # show job queue status
$ stash --rescan   # trigger a rescan, then show status
```

Node must be installed on the target machine. Bundling a Node runtime into the
artifact is explicitly out of scope.

## Constraints Discovered

Two facts about the current environment shaped this design and were verified before
writing it:

1. **`typescript@7.0.2` (the native Go compiler) does not expose the JS compiler
   API.** `ts.createSourceFile`, `ts.createProgram`, and `ts.ScriptTarget` are all
   `undefined`. `typescript-eslint@8.66` declares a peer range of
   `typescript: >=4.8.4 <6.1.0`. ESLint's TypeScript support therefore cannot run
   against the installed compiler. **Resolution:** use `oxlint`, which parses
   TypeScript itself and has no dependency on the `typescript` package, so TS 7 is
   retained. The cost is no type-aware lint rules; `tsc --noEmit` against the
   already-strict tsconfig covers that ground.
2. **`tsc --noEmit` passes clean under TS 7** with the existing tsconfig, so
   typechecking needs no compiler change.

## Bundle Format: ESM Source, CJS Output

The source tree stays ESM end to end. `package.json` keeps `"type": "module"`,
tsconfig keeps `module: NodeNext` and `verbatimModuleSyntax`, and all files use
`import`/`export`. Development via `tsx` runs genuine ESM.

The bundled artifact is CJS. This is a build-time transformation applied by esbuild's
`format: 'cjs'`; no source file is written as CJS, and nothing imports `dist/stash.js`
— it is a terminal executable.

The reason is portability of the artifact. Node decides ESM-vs-CJS from the file
extension and the nearest `package.json` `"type"` field. Once `dist/stash.js` is
copied to `~/bin/stash` it has neither: no `.js` extension and no enclosing package
manifest. Node 22 enables module syntax detection by default, so an ESM bundle would
likely work there, but a CJS bundle works unconditionally — any Node version, any
filename, any directory. `index.ts` contains no top-level `await`, so CJS output
costs nothing.

A consequence of NodeNext ESM source: relative imports carry a `.js` extension even
though the file on disk is `.ts` (`import { truncate } from './src/format.js'`). Both
tsx and esbuild resolve this TypeScript convention correctly.

## Architecture

`index.ts` currently mixes pure display formatting, GraphQL I/O, and process entry in
one module, and calls `main()` at import time. Nothing is exported, so nothing is
reachable from a test. The split below is the minimum needed to make the pure logic
testable; the entry point remains `index.ts`.

| File | Responsibility | Depends on |
|---|---|---|
| `src/format.ts` | `getBarString(fraction, width?)`, `truncate(str, width?)`, `formatEta(startTime: string \| null, progress: number)` — pure string formatting, no I/O | nothing |
| `src/stash.ts` | `ENDPOINT`, both GraphQL documents, response types, `getStatus`, `rescan` | `graphql-request`, `src/format.ts` |
| `index.ts` | argv parsing, `main()`, `process.exit` wiring | `src/stash.ts` |
| `scripts/build.ts` | esbuild invocation, shebang banner, `chmod` | `esbuild` |

Each unit is usable without reading the others' internals: `src/format.ts` is a set of
total functions over primitives, `src/stash.ts` exposes two async operations that
print to stdout, and `index.ts` is dispatch only.

### Build Script

```ts
// scripts/build.ts
await esbuild.build({
  entryPoints: ['index.ts'],
  bundle: true,
  platform: 'node',
  format: 'cjs',
  target: 'node22',
  outfile: 'dist/stash.js',
  banner: { js: '#!/usr/bin/env node' },
});
await chmod('dist/stash.js', 0o755);
```

`bundle: true` with no `external` entries is what inlines `graphql-request`,
`graphql`, and `@graphql-typed-document-node/core` into the output.

## Defects Fixed

Both are in code this refactor already moves, and both are pinned by tests:

1. **Divide-by-zero in the ETA calculation.** `duration = Math.floor(used / job.progress)`
   yields `Infinity` when `progress` is `0`, so a freshly-queued job renders
   `ETA: Infinity:NaN`. `formatEta` returns an empty string when progress is zero or
   negative.
2. **Misnamed parameter.** `getBarString(percentage)` receives a 0–1 fraction, not a
   percentage — `getStatus` computes the display percentage separately. The parameter
   is renamed `fraction`.

## Error Handling

Behavior is preserved: `main()` rejections are caught at the top level, logged via
`console.error`, and exit with code 1; success exits 0. `rescan` already logs and
returns early when any of the three mutation fields is absent from the response.
`formatEta` degrades to an empty string rather than throwing or printing `NaN` when
progress data is unusable.

## Testing

Test runner is Node's built-in `node:test` with tsx providing TypeScript support, so
no test framework dependency is added.

### `tests/format.test.ts` — unit

- `getBarString`: 0%, 50%, 100%; fractions above 1 clamp to full width; custom widths;
  output length always equals `width`.
- `truncate`: string shorter than width passes through unchanged; a string whose length
  equals `width` is truncated (documenting existing `<` behavior, not changing it); a
  longer string is cut to exactly `width` characters ending in `...`.
- `formatEta`: zero progress returns `''` (the divide-by-zero regression); a `null`
  startTime returns `''`; mid-progress returns `mm:ss`; seconds below 10 are
  zero-padded.

### `tests/bundle.test.ts` — integration

This is the test that substantiates the word "standalone":

1. Run the build.
2. Assert `dist/stash.js` exists, begins with `#!/usr/bin/env node`, and is executable.
3. Copy the file alone into a temp directory containing **no `node_modules`** and no
   `package.json`, then execute it.
4. Assert the process fails with a **connection error** reaching `localhost:9999`, and
   specifically **not** `MODULE_NOT_FOUND` / `ERR_MODULE_NOT_FOUND`.

Step 4 is the crux: a connection refusal proves the module graph resolved and the
GraphQL dependencies were inlined, and it requires no running stashdb to assert.

## Housekeeping

- `typescript` moves from `dependencies` to `devDependencies` — it is a build tool, not
  a runtime dependency. `graphql-request` stays in `dependencies`, since the source
  genuinely imports it; it is inlined at build time, so **`dist/stash.js` itself has no
  runtime dependencies**.
- `tsconfig.json` gains `include` (`index.ts`, `src`, `scripts`, `tests`) and `exclude`
  (`dist`) so `tsc` does not typecheck build output.
- The unused `"jsx": "react-jsx"` option is removed; there is no JSX in this project.
- `dist` is added to the existing `.gitignore` (which currently lists `node_modules`).
- `package.json` `"main": "index.js"` points at a nonexistent file; it is removed, as
  this package is a CLI and not an importable library.

## npm Scripts

| Script | Command |
|---|---|
| `build` | `tsx scripts/build.ts` |
| `typecheck` | `tsc --noEmit` |
| `lint` | `oxlint` |
| `test` | `node --import tsx --test tests/*.test.ts` |
| `verify` | `npm run lint && npm run typecheck && npm run test && npm run build` |

`verify` is the single command that satisfies the project's standing rule that a change
is not done until lint, typecheck, tests, and build all pass.

## Dependency Changes

| Package | Change | Reason |
|---|---|---|
| `esbuild` | add to `devDependencies` | bundler |
| `oxlint` | add to `devDependencies` | linter compatible with TS 7 |
| `typescript` | move to `devDependencies` | build tool, not runtime |

## Out of Scope

- Bundling a Node runtime (single-executable-application / Bun compile).
- Publishing to npm or a `bin` entry for global install.
- Making `ENDPOINT` configurable; it stays hardcoded to `http://localhost:9999/graphql`.
- Any change to the GraphQL queries or the `--rescan` behavior.

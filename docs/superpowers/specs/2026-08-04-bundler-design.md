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
| `src/format.ts` | `getBarString(fraction, width?)`, `truncate(str, width?)`, `formatEta(startTime: string \| null, progress: number, now?: number)` — string formatting, no imports and no side effects; `now` defaults to `Date.now()` so the clock read is injectable and every case is testable without mocking. Also `renderJob(job: JobDisplay, now?: number)`, which assembles one job's full display block — emoji, bar, percentage, ETA, indented subtasks. `JobDisplay` is declared structurally here rather than imported, so this module stays import-free | nothing |
| `src/stash.ts` | `ENDPOINT`, both GraphQL documents, response types, `getStatus`, `rescan` | `graphql-request`, `src/format.ts` |
| `index.ts` | argv parsing, `main()`, `process.exit` wiring | `src/stash.ts` |
| `scripts/build.ts` | esbuild invocation, shebang banner, `chmod` | `esbuild` |

Each unit is usable without reading the others' internals: `src/format.ts` is a set of
total functions over primitives, `src/stash.ts` exposes two async operations that
print to stdout, and `index.ts` is dispatch only.

### Build Script

```ts
// scripts/build.ts
const result = await esbuild.build({
  entryPoints: ['index.ts'],
  bundle: true,
  platform: 'node',
  format: 'cjs',
  target: 'node22',
  mainFields: ['module', 'main'],
  outfile: 'dist/stash.js',
  banner: { js: '#!/usr/bin/env node' },
});
if (result.warnings.length > 0) {
  process.exit(1);
}
await chmod('dist/stash.js', 0o755);
```

`bundle: true` with no `external` entries is what inlines `graphql-request`,
`graphql`, and `@graphql-typed-document-node/core` into the output.

`mainFields: ['module', 'main']` is load-bearing for size. `graphql` ships CJS at `main`
and ESM at `module`, and esbuild's default for `platform: 'node'` prefers `main`. A CJS
barrel cannot be tree-shaken, so the default pulls in all 41 validation rules and the
entire execution engine even though this CLI only ever reaches `parse` and `print`.
Preferring the ESM entry takes the artifact from 731,777 bytes to 126,558 — an 83%
reduction with byte-identical rendered output. `minify` is deliberately not enabled: the
top-level handler logs raw errors, and mangled frames from `graphql-request` internals
would make real failures harder to read.

Failing on warnings is also load-bearing. `esbuild.build()` rejects only on errors, so
without the check a warning exits 0. The CJS format choice makes exactly one class of
warning dangerous — `import.meta` in a CJS bundle compiles to `{}` — and this is what
catches it.

## Defects Fixed

All three are in code this refactor already moves, and all three are pinned by tests:

1. **Divide-by-zero in the ETA calculation.** `duration = Math.floor(used / job.progress)`
   yields `Infinity` when `progress` is `0`, so a freshly-queued job renders
   `ETA: Infinity:NaN`. `formatEta` returns an empty string when progress is zero or
   negative.
2. **Misnamed parameter.** `getBarString(percentage)` receives a 0–1 fraction, not a
   percentage — `getStatus` computes the display percentage separately. The parameter
   is renamed `fraction`.
3. **Off-by-one in `truncate`.** The `str.length < width` comparison ellipsizes a string
   that fits the width exactly, so a 10-character subtask at `width` 10 renders as
   `abcdefg...` despite fitting. The comparison becomes `<=`.

## Endpoint Override

`ENDPOINT` resolves as `process.env['STASH_ENDPOINT'] ?? 'http://localhost:9999/graphql'`,
so behavior is unchanged when the variable is unset. Bracket indexing is required rather
than property access, because `noPropertyAccessFromIndexSignature` is enabled and
`process.env` is an index signature.

This exists so the standalone bundle test can aim the executable at a guaranteed-closed
port and assert one deterministic outcome, rather than depending on no stashdb being
reachable. It is a side benefit that a CLI otherwise hardcoded to `localhost` can now be
pointed at a remote or tunneled instance.

## Error Handling

`main()` rejections are caught at the top level, logged via `console.error`, and exit
with code 1; success exits 0. The catch annotates its parameter as `unknown`, not
`Error` — `Promise.prototype.catch`'s reason is `any`, so an `Error` annotation would
assert something TypeScript never checks.

**A failed rescan throws.** Originally `rescan` logged `Rescan failed` and returned, so
`main()` resolved and the process exited 0 — making a failed rescan indistinguishable
from success to `stash --rescan && next` or to a cron wrapper. It now throws an `Error`
carrying the response payload, which the existing top-level catch turns into exit 1. No
change to the exit wiring was needed.

`formatEta` degrades to an empty string rather than throwing or printing `NaN` when
progress data is unusable.

## Testing

Test runner is Node's built-in `node:test` with tsx providing TypeScript support, so
no test framework dependency is added.

### `tests/format.test.ts` — unit

- `getBarString`: 0%, 50%, 100%; fractions above 1 clamp to full width; custom widths;
  output length always equals `width`.
- `truncate`: a string shorter than width passes through unchanged; a string whose
  length equals `width` also passes through unchanged; a longer string is cut to exactly
  `width` characters ending in `...`.
- `formatEta`: zero progress returns `''` (the divide-by-zero regression); a `null`
  startTime returns `''`; an unparseable date returns `''`; mid-progress returns `mm:ss`;
  seconds below 10 are zero-padded. Every case passes an explicit `now`, so the
  assertions are exact rather than clock-dependent, and no timer mocking is needed. One
  further test omits `now` to cover the default, asserting shape rather than a value.

### `tests/bundle.test.ts` — integration

This is the test that substantiates the word "standalone":

1. Run the build.
2. Assert `dist/stash.js` exists, begins with `#!/usr/bin/env node`, and is executable.
3. Copy the file alone into a temp directory containing **no `node_modules`** and no
   `package.json`, then execute it with `STASH_ENDPOINT=http://127.0.0.1:1/graphql`.
4. Assert the process fails with a **connection error**, and specifically **not**
   `MODULE_NOT_FOUND` / `ERR_MODULE_NOT_FOUND`.

Step 4 is the crux: a connection refusal proves the module graph resolved and the GraphQL
dependencies were inlined, and it requires no running stashdb to assert. The test also
asserts a positive marker (`GraphQLError`) is present in the bundle, so it cannot pass
against an empty or truncated artifact — without that, the "no external requires" check
reduces to comparing two empty lists.

### `tests/stash.test.ts` — integration

A `node:http` stub on an ephemeral port, with `STASH_ENDPOINT` aimed at it, exercises the
full path with no live stashdb: status rendering (ETA present for an in-progress job,
absent for one at 0%, subtasks truncated), a failed rescan exiting 1, and a successful
rescan exiting 0. The CLI runs as a subprocess through `tsx` rather than the bundle, so
these tests do not depend on a build.

Port 1 is privileged and cannot be bound, so the refusal is deterministic. An earlier
draft of this test asserted a refusal on the default `localhost:9999` instead, which fails
on any machine that actually has a stashdb reachable — the normal state of a development
machine for this tool, and the reason the endpoint override below exists.

## Housekeeping

- `typescript` moves from `dependencies` to `devDependencies` — it is a build tool, not
  a runtime dependency. `graphql-request` stays in `dependencies`, since the source
  genuinely imports it; it is inlined at build time, so **`dist/stash.js` itself has no
  runtime dependencies**.
- `tsconfig.json` gains `include` (`index.ts`, `src`, `scripts`, `tests`) and `exclude`
  (`dist`) so `tsc` does not typecheck build output.
- The unused `"jsx": "react-jsx"` option is removed; there is no JSX in this project.
- `dist` is added to the existing `.gitignore` (which currently lists `node_modules`).
- A short `README.md` covers the build, installing to `PATH`, both invocations, and
  `STASH_ENDPOINT`. Documenting the env var only inside this dated spec would bury it in
  the least discoverable place in the repo.
- The `lint` script runs `oxlint --deny-warnings`. Without the flag oxlint exits nonzero
  only on errors, so the `suspicious` category in `.oxlintrc.json` would never gate
  anything inside `verify`.
- Test discovery is recursive, so a future nested file such as `tests/format/eta.test.ts`
  cannot be silently skipped.
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
| `graphql` | add to `dependencies` | `graphql-request` declares it only as a **peer** dependency, so it is present purely because npm 7+ auto-installs peers. The build statically requires it, so `npm ci --legacy-peer-deps`, pnpm without `auto-install-peers`, or yarn classic would fail to build without this declaration. |
| `esbuild` | add to `devDependencies` | bundler |
| `oxlint` | add to `devDependencies` | linter compatible with TS 7 |
| `typescript` | move to `devDependencies` | build tool, not runtime |

## Out of Scope

- Bundling a Node runtime (single-executable-application / Bun compile).
- Publishing to npm or a `bin` entry for global install.
- Any CLI flag or config file for the endpoint. The `STASH_ENDPOINT` environment variable
  (see Endpoint Override above) is the only override; the default URL is unchanged.
- Any change to the GraphQL queries or the `--rescan` behavior.

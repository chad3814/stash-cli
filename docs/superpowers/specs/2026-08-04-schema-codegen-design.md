# stash-cli: Schema Type Generation

**Date:** 2026-08-04
**Status:** Approved, not yet planned

## Goal

A dev script that introspects a live stash server and generates TypeScript definitions
for its schema — object fields, input objects, enums, unions, and the argument and result
types of every query and mutation — then rewire `src/stash.ts` to consume them instead of
hand-written response types.

## Why: the hand-written types are already wrong

This is not speculative. Comparing an introspection of `Job` against the types written by
hand in `src/stash.ts`:

| Field | Hand-written | Schema | Consequence |
|---|---|---|---|
| `status` | `'RUNNING' \| 'READY'` | `JobStatus!` = `READY \| RUNNING \| FINISHED \| STOPPING \| CANCELLED \| FAILED` | `renderJob` renders anything not `RUNNING` as 🧍 queued, so a `FAILED` or `CANCELLED` job is displayed as waiting. **Still outstanding.** |
| `progress` | `number` | `Float` (nullable) | `progress * 100` and `getBarString(progress)` receive `null`; it coerces to 0 and degrades to `0.00%` by luck, not design. **Still outstanding.** |
| `subTasks` | `string[]` | `[String!]` (nullable) | `renderJob` called `.map` on it and threw `Cannot read properties of null (reading 'map')`. **Already fixed in `aa1f5d8`** — the type and the guard are correct now, so this work only adopts the generated type. |
| `jobQueue` | `[…] \| null` | `[Job!]` (nullable) | Crashed in production; fixed by hand in `56277e0`. The schema described it all along. |

Two of these four were found by reading the schema rather than by being hit, and one of
those (`subTasks`) was a live crash on every job queued without subtasks — which is every
job `sig` starts.

That is the argument for generation in one line: hand-transcribing 1,275 input fields and
1,043 output fields is a typo farm, and the type system cannot help because the types are
the thing being transcribed.

## Scale

Measured from a live server: 301 named types — 158 input objects (1,275 fields), 102
objects (1,043 fields), 25 enums (116 values), 2 unions, 1 interface — plus 74 query
fields and 125 mutation fields. Custom scalars: `Any`, `BoolMap`, `Int64`, `Map`,
`PluginConfigMap`, `Time`, `Timestamp`, `Upload`.

Expected output is roughly 3,000 lines. **This costs zero bytes in the artifact** —
TypeScript types erase entirely — so the whole schema is generated rather than a subset.
A subset would need a hand-maintained operation list that breaks the moment a command is
added, and would require a live server to regenerate before the code could typecheck.

## Output: `src/generated/schema.d.ts`

A declaration file, not a `.ts`. Both resolve correctly under `module: NodeNext` with
esbuild — verified, since `import type` is erased before resolution — so the choice rests
on the guarantee: a `.d.ts` **cannot** contain runtime code, so the generated file can
never contribute a byte to the bundle. That matters in a project with a 15 KB size
ceiling test. If generated runtime values are ever wanted (enum value arrays for input
validation, say), they belong in a separate `src/generated/enums.ts`, not a rename.

**The file is committed.** This is a constraint, not a preference: CI runs `tsc --noEmit`
and has no stash server, so a git-ignored generated file breaks `verify` on every push.

## Architecture

Split so the generator's logic is testable without a server:

| File | Responsibility |
|---|---|
| `scripts/codegen.ts` | shell: fetch introspection, call the printer, write the file |
| `scripts/codegen/print.ts` | **pure**: `introspectionToTypeScript(schema): string`. No I/O, no network |
| `scripts/codegen/introspection.ts` | the introspection query text and the types describing its response |
| `src/generated/schema.d.ts` | output, committed, never hand-edited |

The pure printer is the whole point of the split: it is unit-testable in CI against
synthetic introspection fragments, even though *running* the generator needs a server.

The printer lives under `scripts/`, not `src/`. `src/` is the shipped program; a code
generator is build tooling, and putting it there would make it the one thing in `src/`
that never reaches the artifact. `tsconfig.json` already includes `scripts/**/*.ts`, so
it is typechecked either way, and tests can import from it.

## Emitted Forms

| GraphQL | TypeScript | Rationale |
|---|---|---|
| `enum E { A B }` | `export type E = 'A' \| 'B'` | a TS `enum` emits runtime code, which a `.d.ts` cannot contain and a types-only file should not want |
| `type T { f: F! }` | `export type T = { f: F }` | |
| output field `f: F` (nullable) | `f: F \| null` | present in a response when selected, possibly null |
| input field `f: F` (nullable) | `f?: F \| null` | omittable *or* explicitly null — accurate under `exactOptionalPropertyTypes` |
| input field `f: F!` | `f: F` | required |
| `[F!]!` | `F[]` | |
| `[F!]` | `F[] \| null` | |
| `[F]!` | `(F \| null)[]` | |
| `[F]` | `(F \| null)[] \| null` | printed recursively, arbitrarily nested |
| `union U = A \| B` | `export type U = A \| B` | |
| `interface I` | `export type I = { … }` | fields only; implementors are separate types |

Three further emission rules:

- **The root `Query` and `Mutation` types are not emitted as object types.** They appear
  only as the `Queries` and `Mutations` operation maps below. Emitting both would produce
  a 74-field `Query` object type that no caller can use, since a plain object type cannot
  carry field arguments.
- **Deprecated fields are emitted**, each preceded by `/** @deprecated <reason> */`, so
  using one is a visible choice rather than an invisible one. Omitting them would make the
  generated type quietly narrower than the schema.
- **Descriptions become JSDoc comments** where the schema provides them. This is what puts
  *"Returns the job ID"* on hover at the call site, and it is the cheapest documentation
  available — it is already written, on the server.

Scalar mapping, in one table at the top of the printer so it is configurable:

```
ID, String        -> string
Int, Float, Int64 -> number
Boolean           -> boolean
Time, Timestamp   -> string
BoolMap           -> Record<string, boolean>
Map               -> Record<string, unknown>
PluginConfigMap   -> Record<string, unknown>
Any               -> unknown
Upload            -> never
```

`unknown` appears only where the schema genuinely promises nothing. Mapping `Any` to a
concrete shape would let a field typed `string` that is actually a number typecheck and
fail at runtime, which is worse than an honest `unknown`.

### Operation maps

A plain object type cannot express field arguments, so queries and mutations are emitted
as maps:

```ts
export type Mutations = {
  metadataScan: { args: { input: ScanMetadataInput }; result: string };
  optimiseDatabase: { args: Record<string, never>; result: string };
};

export type Queries = {
  jobQueue: { args: Record<string, never>; result: Job[] | null };
};
```

This is what lets a caller write `request<Mutations['metadataScan']['result']>(…)` and get
the input type checked, which is the payoff for the subcommands work where eight mutation
inputs would otherwise be transcribed by hand.

## Determinism

Types are emitted sorted by name, and the banner carries **no timestamp and no version**.
Regenerating against an unchanged schema must produce a byte-identical file, so a diff is
always a real schema change and never noise. A test asserts this by running the printer
twice over the same fixture and comparing.

The banner names the file as generated and gives the command to regenerate it.

## Rewiring `src/stash.ts`

`src/generated/schema.d.ts` must exist before this step; the generator lands first.

Response types stop being transcribed and become compositions of generated types. A
selection set is still hand-written — deriving result types from a document would require
parsing GraphQL, which this project deliberately no longer can — but `Pick` makes every
field name in the selection set a checked reference:

```ts
import type { Job, Mutations } from './generated/schema.js';

type StatusResponse = {
  jobQueue: Pick<
    Job,
    'id' | 'progress' | 'status' | 'description' | 'subTasks' | 'error' | 'endTime' | 'addTime' | 'startTime'
  >[] | null;
};

type SigResponse = {
  metadataScan: Mutations['metadataScan']['result'];
  metadataIdentify: Mutations['metadataIdentify']['result'];
  metadataGenerate: Mutations['metadataGenerate']['result'];
};
```

A misspelled field in the `Pick` is now a compile error. Adding a field to the GraphQL
document without adding it to the `Pick` is not caught — that asymmetry is accepted, since
the failure mode is an unused response field rather than a wrong one.

Note that `statusQuery` currently selects **all nine** `Job` fields, so this `Pick` is
today equivalent to `Job` itself, and `Queries['jobQueue']['result']` would be exactly
correct with less typing. The `Pick` is still written out on purpose: if a stash upgrade
adds a field to `Job`, the generated type gains it, our document does not select it, and
the shorter form would then claim a field the server was never asked for. The `Pick` turns
that into a deliberate edit.

### Corrections the rewiring forces

Adopting the true types breaks the build in two places, and each break is a real bug.
(`subTasks` was the third; it was fixed in `aa1f5d8` and its type is already correct, so
adopting the generated type is a no-op there.)

1. **`progress` may be null.** `renderJob` and `formatEta` must treat null as zero
   progress explicitly rather than relying on `null` coercing to `0` in arithmetic. Today
   a null-progress job renders `0.00%` with an empty bar and no ETA, which is the right
   output reached by the wrong route — nothing states the intent, so a refactor could
   change it silently.
2. **`status` has six values, not two.** `renderJob` currently shows anything that is not
   `RUNNING` as 🧍 queued. All six are handled explicitly, with a lookup keyed by
   `JobStatus` so adding a seventh status to stash becomes a compile error rather than a
   silently mislabelled job:

   | Status | Glyph |
   |---|---|
   | `RUNNING` | 🏃‍➡️ (unchanged) |
   | `READY` | ⏳ (was 🧍) |
   | `FINISHED` | ✅ |
   | `FAILED` | ❌ |
   | `CANCELLED` | 🚫 |
   | `STOPPING` | 🛑 |

   `READY` moves from 🧍 to ⏳: the inherited glyph read as "a person standing around"
   rather than "queued", and it was the only non-signal glyph in the set. Every glyph
   here is a single code point except `RUNNING`, which keeps its existing ZWJ sequence.

   The structural requirement is exhaustiveness — the glyphs are one table to edit. Note
   that changing `READY` alters the most commonly seen output, so the existing tests that
   assert on 🧍 must be updated deliberately rather than incidentally.

`JobDisplay` in `src/format.ts` is currently a hand-written structural type whose field
types were invented independently of the schema. It becomes a `Pick` of the generated
`Job`, listing only the fields `renderJob` actually reads:

```ts
import type { Job } from '../generated/schema.js';

export type JobDisplay = Pick<Job, 'status' | 'description' | 'progress' | 'subTasks' | 'startTime'>;
```

A `Pick` rather than `Job` itself, so `renderJob` does not demand fields it ignores. The
import is type-only, so `src/format.ts` keeps the property that matters — nothing it
imports survives to runtime — while its field types stop being independently invented.

## Scripts

- `npm run codegen` — regenerate `src/generated/schema.d.ts` from `STASH_ENDPOINT` (or
  the default endpoint). Requires a reachable stash server.
- `npm run codegen:check` — regenerate to a temp file and diff against the committed one,
  exiting nonzero on drift. **Cannot run in CI**, which has no stash server, so schema
  drift is a local discipline rather than an enforced gate. The script exists so the check
  is one command rather than a remembered procedure.

`src/generated` is added to `.oxlintrc.json`'s `ignorePatterns`: lint has no business
grading generated output, while `tsc` very much does and continues to check it.

## Testing

The generator's printer is pure, so most of this needs no server:

- **Printer unit tests** (`tests/codegen.test.ts`), against synthetic introspection
  fragments: scalar mapping including every custom scalar; nullable and non-null fields;
  all four list/nullability permutations; nested lists; enums to string-literal unions;
  input-field optionality under `exactOptionalPropertyTypes`; unions; interfaces;
  operation maps with and without arguments; a field whose type is a custom scalar.
- **Determinism**: printing the same fixture twice is byte-identical, and output is
  sorted by type name.
- **Output validity**: a test writes the printer's output for a fixture to a temp file and
  runs `tsc --noEmit` over it, so the generator cannot emit TypeScript that does not
  compile. This is the test that would catch a malformed emission that unit assertions on
  strings would miss.
- **The committed file** is checked by `npm run typecheck` like any other source, which is
  what keeps the real 3,000-line output honest.
- **The rewiring** is covered by the existing `tests/stash.test.ts` and
  `tests/format.test.ts`, extended for the two outstanding corrections: a job with null
  `progress`, and a job in each of the six statuses. Null `subTasks` is already covered at
  both levels by `aa1f5d8` and those tests must keep passing unchanged.
- **The `READY` glyph change** breaks the existing assertions on 🧍 in
  `tests/format.test.ts` (a `QUEUED_EMOJI` constant) and `tests/stash.test.ts` (a `/🧍/u`
  match). Updating them is part of the change, not incidental cleanup — a test whose
  expectation shifts to match new output should shift because that was the intent.

No test requires a live stash server, and none is added that would.

## Out of Scope

- Deriving result types from selection sets. That needs a GraphQL parser, which was
  deliberately removed; `Pick` compositions are the substitute.
- Generating runtime values such as enum arrays. A separate `src/generated/enums.ts` if
  ever wanted.
- Enforcing schema freshness in CI. Impossible without a server reachable from the runner.
- Any change to the CLI's argument surface — that is the separate subcommands spec.

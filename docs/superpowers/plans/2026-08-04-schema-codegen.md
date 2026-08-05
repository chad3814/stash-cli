# Schema Type Generation Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Generate TypeScript definitions from a live stash GraphQL schema into a committed `src/generated/schema.d.ts`, then rewire `src/format.ts` and `src/stash.ts` to use them instead of hand-written types.

**Architecture:** A pure printer (`scripts/codegen/print.ts`) turns an introspection response into TypeScript source with no I/O, so it is unit-testable in CI without a stash server. A thin shell (`scripts/codegen.ts`) fetches introspection and writes the file. The generated file is a `.d.ts`, so it cannot contain runtime code and can never enter the bundle.

**Tech Stack:** TypeScript 7 (tsgo), `node:test` via tsx, esbuild, oxlint. Zero runtime dependencies — the generator reuses the project's own `src/graphql.ts` client.

**Spec:** `docs/superpowers/specs/2026-08-04-schema-codegen-design.md`

## Global Constraints

- **Commits require Chad's explicit approval.** Stop at each commit step, show `git diff --stat`, and wait. Do not push.
- Commits are ssh-signed via a 1Password agent that re-prompts every 15 minutes; `git commit` may pause for a device approval. That is expected.
- Never use the `any` type. Use `unknown` only where TypeScript forces it or where the schema genuinely promises nothing, narrowed immediately where possible.
- 2-space indentation. Always terminate statements with a semicolon.
- Relative imports carry a `.js` extension though files on disk are `.ts` (`./codegen/print.js`). Type-only imports use `import type`.
- `noUncheckedIndexedAccess`, `noPropertyAccessFromIndexSignature`, `noUnusedLocals`, `strict`, `exactOptionalPropertyTypes` are all enabled. Indexed access yields `T | undefined`; `process.env` must be bracket-indexed.
- **The spec omits one thing: stash has a `Subscription` root type as well as `Query` and `Mutation`.** All three are handled. This plan is authoritative over the spec on that point.
- Sorting must use codepoint comparison, never `localeCompare`, which is locale-dependent and would break byte-identical regeneration.
- No test may require a live stash server. Running `npm run codegen` does; nothing in `npm run verify` may.
- Never invoke a destructive or side-effecting stash mutation. This work only reads `__schema`.

## File Structure

| File | Status | Responsibility |
|---|---|---|
| `scripts/codegen/introspection.ts` | create | the introspection query text and the types describing its response |
| `scripts/codegen/print.ts` | create | pure printer: introspection → TypeScript source |
| `scripts/codegen.ts` | create | shell: fetch, print, write |
| `tests/codegen.test.ts` | create | printer unit tests against synthetic fragments |
| `src/generated/schema.d.ts` | create (generated) | output, committed, never hand-edited |
| `src/format.ts` | modify | `JobDisplay` becomes a `Pick<Job, …>`; exhaustive status glyphs; nullable `progress` |
| `src/stash.ts` | modify | response types composed from generated types |
| `tests/format.test.ts` | modify | 🧍 → ⏳; new status and null-progress cases |
| `tests/stash.test.ts` | modify | `/🧍/u` → `/⏳/u` |
| `package.json` | modify | `codegen` and `codegen:check` scripts |
| `.oxlintrc.json` | modify | ignore `src/generated` |

Tasks 1–3 build the printer bottom-up, each independently testable with no server. Task 4 runs it for real and commits the output. Task 5 consumes it.

---

### Task 1: Type-reference printing

The hardest pure logic in the project: turning a nested GraphQL type reference into a TypeScript type with correct nullability. Everything else depends on it.

**Files:**
- Create: `scripts/codegen/introspection.ts`
- Create: `scripts/codegen/print.ts`
- Create: `tests/codegen.test.ts`

**Interfaces:**
- Consumes: nothing.
- Produces: `scripts/codegen/introspection.ts` exports `TypeKind`, `TypeRef`, `IntrospectionInputValue`, `IntrospectionField`, `IntrospectionEnumValue`, `IntrospectionType`, `IntrospectionSchema`, and `INTROSPECTION_QUERY: string`. `scripts/codegen/print.ts` exports `SCALAR_MAP: Record<string, string>` and `printTypeRef(ref: TypeRef): string`. Tasks 2 and 3 add more exports to `print.ts`.

- [ ] **Step 1: Write the introspection types and query**

`scripts/codegen/introspection.ts`. The `ofType` chain is nested seven deep, which is what the standard introspection query uses and covers any list nesting stash could have.

```ts
export type TypeKind =
  | 'SCALAR'
  | 'OBJECT'
  | 'INTERFACE'
  | 'UNION'
  | 'ENUM'
  | 'INPUT_OBJECT'
  | 'LIST'
  | 'NON_NULL';

export type TypeRef = {
  kind: TypeKind;
  name: string | null;
  ofType?: TypeRef | null;
};

export type IntrospectionInputValue = {
  name: string;
  description?: string | null;
  defaultValue?: string | null;
  type: TypeRef;
};

export type IntrospectionField = {
  name: string;
  description?: string | null;
  isDeprecated?: boolean;
  deprecationReason?: string | null;
  args?: IntrospectionInputValue[];
  type: TypeRef;
};

export type IntrospectionEnumValue = {
  name: string;
  description?: string | null;
  isDeprecated?: boolean;
  deprecationReason?: string | null;
};

export type IntrospectionType = {
  kind: TypeKind;
  name: string;
  description?: string | null;
  fields?: IntrospectionField[] | null;
  inputFields?: IntrospectionInputValue[] | null;
  enumValues?: IntrospectionEnumValue[] | null;
  possibleTypes?: TypeRef[] | null;
};

export type IntrospectionSchema = {
  queryType: { name: string } | null;
  mutationType: { name: string } | null;
  subscriptionType: { name: string } | null;
  types: IntrospectionType[];
};

export const INTROSPECTION_QUERY = `
query {
  __schema {
    queryType { name }
    mutationType { name }
    subscriptionType { name }
    types {
      kind
      name
      description
      fields(includeDeprecated: true) {
        name
        description
        isDeprecated
        deprecationReason
        args { ...InputValue }
        type { ...TypeRef }
      }
      inputFields { ...InputValue }
      enumValues(includeDeprecated: true) {
        name
        description
        isDeprecated
        deprecationReason
      }
      possibleTypes { ...TypeRef }
    }
  }
}

fragment InputValue on __InputValue {
  name
  description
  defaultValue
  type { ...TypeRef }
}

fragment TypeRef on __Type {
  kind
  name
  ofType { kind name
    ofType { kind name
      ofType { kind name
        ofType { kind name
          ofType { kind name
            ofType { kind name
              ofType { kind name }
            }
          }
        }
      }
    }
  }
}
`;
```

- [ ] **Step 2: Write the failing type-reference tests**

`tests/codegen.test.ts`. These cover every list-and-nullability permutation, which is where this logic goes wrong.

```ts
import assert from 'node:assert/strict';
import test from 'node:test';
import type { TypeRef } from '../scripts/codegen/introspection.js';
import { printTypeRef } from '../scripts/codegen/print.js';

function named(kind: 'SCALAR' | 'OBJECT' | 'ENUM' | 'INPUT_OBJECT', name: string): TypeRef {
  return { kind, name, ofType: null };
}

function nonNull(of: TypeRef): TypeRef {
  return { kind: 'NON_NULL', name: null, ofType: of };
}

function list(of: TypeRef): TypeRef {
  return { kind: 'LIST', name: null, ofType: of };
}

const STRING = named('SCALAR', 'String');
const JOB = named('OBJECT', 'Job');

test('printTypeRef maps a nullable scalar', () => {
  assert.equal(printTypeRef(STRING), 'string | null');
});

test('printTypeRef maps a non-null scalar', () => {
  assert.equal(printTypeRef(nonNull(STRING)), 'string');
});

test('printTypeRef maps a non-null list of non-null', () => {
  assert.equal(printTypeRef(nonNull(list(nonNull(JOB)))), 'Job[]');
});

test('printTypeRef maps a nullable list of non-null', () => {
  assert.equal(printTypeRef(list(nonNull(JOB))), 'Job[] | null');
});

test('printTypeRef maps a non-null list of nullable', () => {
  assert.equal(printTypeRef(nonNull(list(JOB))), '(Job | null)[]');
});

test('printTypeRef maps a nullable list of nullable', () => {
  assert.equal(printTypeRef(list(JOB)), '(Job | null)[] | null');
});

test('printTypeRef maps a nested list', () => {
  assert.equal(printTypeRef(nonNull(list(nonNull(list(nonNull(JOB)))))), 'Job[][]');
});

test('printTypeRef parenthesises a nullable inner list', () => {
  assert.equal(printTypeRef(nonNull(list(list(nonNull(JOB))))), '(Job[] | null)[]');
});

test('printTypeRef maps every custom scalar', () => {
  const expected: Record<string, string> = {
    ID: 'string',
    String: 'string',
    Int: 'number',
    Float: 'number',
    Int64: 'number',
    Boolean: 'boolean',
    Time: 'string',
    Timestamp: 'string',
    BoolMap: 'Record<string, boolean>',
    Map: 'Record<string, unknown>',
    PluginConfigMap: 'Record<string, unknown>',
    Any: 'unknown',
    Upload: 'never',
  };
  for (const [scalar, ts] of Object.entries(expected)) {
    assert.equal(printTypeRef(nonNull(named('SCALAR', scalar))), ts, `scalar ${scalar}`);
  }
});

test('printTypeRef throws on an unmapped scalar rather than guessing', () => {
  assert.throws(
    () => printTypeRef(nonNull(named('SCALAR', 'Decimal'))),
    /Decimal/,
    'a new custom scalar must fail loudly, not silently become unknown',
  );
});

test('printTypeRef maps a Record-typed scalar inside a list without parenthesising', () => {
  assert.equal(printTypeRef(nonNull(list(nonNull(named('SCALAR', 'Map'))))), 'Record<string, unknown>[]');
});
```

- [ ] **Step 3: Run the tests to verify they fail**

Run: `npm test`

Expected: FAIL — `scripts/codegen/print.js` cannot be resolved because it does not exist yet.

- [ ] **Step 4: Write the type-reference printer**

`scripts/codegen/print.ts`.

An unmapped scalar **throws**. A new custom scalar in a stash upgrade should stop the generator and demand a mapping decision, not silently degrade a field to `unknown` — silence there would be indistinguishable from a scalar we deliberately mapped to `unknown`.

```ts
import type { TypeRef } from './introspection.js';

export const SCALAR_MAP: Record<string, string> = {
  ID: 'string',
  String: 'string',
  Int: 'number',
  Float: 'number',
  Int64: 'number',
  Boolean: 'boolean',
  Time: 'string',
  Timestamp: 'string',
  BoolMap: 'Record<string, boolean>',
  Map: 'Record<string, unknown>',
  PluginConfigMap: 'Record<string, unknown>',
  Any: 'unknown',
  Upload: 'never',
};

function expectOfType(ref: TypeRef): TypeRef {
  const inner = ref.ofType;
  if (inner === undefined || inner === null) {
    throw new Error(`${ref.kind} type reference has no ofType`);
  }
  return inner;
}

function printNonNull(ref: TypeRef): string {
  if (ref.kind === 'LIST') {
    const inner = printTypeRef(expectOfType(ref));
    // A union inside a list must be parenthesised: (A | null)[] , not A | null[].
    return inner.includes(' | ') ? `(${inner})[]` : `${inner}[]`;
  }
  if (ref.kind === 'SCALAR') {
    const mapped = SCALAR_MAP[ref.name ?? ''];
    if (mapped === undefined) {
      throw new Error(
        `unmapped custom scalar '${ref.name ?? '<unnamed>'}' — add it to SCALAR_MAP in scripts/codegen/print.ts`,
      );
    }
    return mapped;
  }
  if (ref.name === null) {
    throw new Error(`unnamed ${ref.kind} type reference`);
  }
  return ref.name;
}

/** Prints a GraphQL type reference as a TypeScript type, nullable unless NON_NULL. */
export function printTypeRef(ref: TypeRef): string {
  if (ref.kind === 'NON_NULL') {
    return printNonNull(expectOfType(ref));
  }
  return `${printNonNull(ref)} | null`;
}
```

- [ ] **Step 5: Run the tests to verify they pass**

Run: `npm test`

Expected: PASS. All 12 new tests plus the existing 42.

- [ ] **Step 6: Verify**

Run: `npm run verify`

Expected: exit 0. `tsc` is what catches a missing `.js` extension on the new imports.

- [ ] **Step 7: Commit (ask Chad first)**

```bash
git add scripts/codegen/introspection.ts scripts/codegen/print.ts tests/codegen.test.ts
git commit -m "feat: add graphql type-reference printing for schema codegen"
```

---

### Task 2: Type declaration printing

Turns each named type into an exported TypeScript declaration, with JSDoc from schema descriptions and `@deprecated` markers.

**Files:**
- Modify: `scripts/codegen/print.ts`
- Modify: `tests/codegen.test.ts`

**Interfaces:**
- Consumes: `printTypeRef(ref: TypeRef): string` and the introspection types from Task 1.
- Produces: `print.ts` additionally exports `printJsDoc(subject, indent): string`, `printObjectType(type): string`, `printInputObjectType(type): string`, `printEnumType(type): string`, and `printUnionType(type): string`, each taking an `IntrospectionType` (except `printJsDoc`) and returning source text ending in a newline. Task 3 assembles them.

- [ ] **Step 1: Write the failing declaration tests**

Append to `tests/codegen.test.ts`. Add these imports to the existing import block:

```ts
import type { IntrospectionType } from '../scripts/codegen/introspection.js';
import {
  printEnumType,
  printInputObjectType,
  printJsDoc,
  printObjectType,
  printUnionType,
} from '../scripts/codegen/print.js';
```

```ts
test('printJsDoc returns nothing when there is no description or deprecation', () => {
  assert.equal(printJsDoc({}, ''), '');
});

test('printJsDoc writes a single-line comment', () => {
  assert.equal(printJsDoc({ description: 'Returns the job ID' }, ''), '/** Returns the job ID */\n');
});

test('printJsDoc writes a multi-line comment', () => {
  assert.equal(
    printJsDoc({ description: 'First line\nSecond line' }, ''),
    '/**\n * First line\n * Second line\n */\n',
  );
});

test('printJsDoc indents', () => {
  assert.equal(printJsDoc({ description: 'Indented' }, '  '), '  /** Indented */\n');
});

test('printJsDoc marks deprecation with its reason', () => {
  assert.equal(
    printJsDoc({ isDeprecated: true, deprecationReason: 'Use parent_folder instead' }, ''),
    '/** @deprecated Use parent_folder instead */\n',
  );
});

test('printJsDoc combines a description with a deprecation', () => {
  assert.equal(
    printJsDoc({ description: 'Old field', isDeprecated: true, deprecationReason: 'gone' }, ''),
    '/**\n * Old field\n *\n * @deprecated gone\n */\n',
  );
});

test('printJsDoc escapes a comment terminator in a description', () => {
  const printed = printJsDoc({ description: 'ends with */ inside' }, '');
  assert.doesNotMatch(printed.slice(3, -4), /\*\//, 'an unescaped */ would end the comment early');
});

test('printObjectType prints fields with schema nullability', () => {
  const job: IntrospectionType = {
    kind: 'OBJECT',
    name: 'Job',
    fields: [
      { name: 'id', type: nonNull(named('SCALAR', 'ID')) },
      { name: 'progress', type: named('SCALAR', 'Float') },
      { name: 'subTasks', type: list(nonNull(STRING)) },
    ],
  };
  assert.equal(
    printObjectType(job),
    'export type Job = {\n  id: string;\n  progress: number | null;\n  subTasks: string[] | null;\n};\n',
  );
});

test('printInputObjectType makes nullable fields optional', () => {
  const input: IntrospectionType = {
    kind: 'INPUT_OBJECT',
    name: 'CleanMetadataInput',
    inputFields: [
      { name: 'dryRun', type: nonNull(named('SCALAR', 'Boolean')) },
      { name: 'paths', type: list(nonNull(STRING)) },
    ],
  };
  assert.equal(
    printInputObjectType(input),
    'export type CleanMetadataInput = {\n  dryRun: boolean;\n  paths?: string[] | null;\n};\n',
  );
});

test('printInputObjectType makes a non-null field with a default optional', () => {
  const input: IntrospectionType = {
    kind: 'INPUT_OBJECT',
    name: 'WithDefault',
    inputFields: [{ name: 'count', type: nonNull(named('SCALAR', 'Int')), defaultValue: '10' }],
  };
  assert.equal(printInputObjectType(input), 'export type WithDefault = {\n  count?: number;\n};\n');
});

test('printEnumType prints a string-literal union', () => {
  const status: IntrospectionType = {
    kind: 'ENUM',
    name: 'JobStatus',
    enumValues: [{ name: 'READY' }, { name: 'RUNNING' }],
  };
  assert.equal(printEnumType(status), "export type JobStatus =\n  | 'READY'\n  | 'RUNNING';\n");
});

test('printObjectType handles an interface the same as an object', () => {
  const iface: IntrospectionType = {
    kind: 'INTERFACE',
    name: 'BaseFile',
    fields: [{ name: 'path', type: nonNull(STRING) }],
  };
  assert.equal(printObjectType(iface), 'export type BaseFile = {\n  path: string;\n};\n');
});

test('printUnionType prints its members', () => {
  const union: IntrospectionType = {
    kind: 'UNION',
    name: 'Result',
    possibleTypes: [named('OBJECT', 'Scene'), named('OBJECT', 'Image')],
  };
  assert.equal(printUnionType(union), 'export type Result = Scene | Image;\n');
});

test('printObjectType carries field descriptions and deprecations into the declaration', () => {
  // The standalone printJsDoc tests do not prove the container wires indent and
  // placement correctly; this asserts the composed result.
  const folder: IntrospectionType = {
    kind: 'OBJECT',
    name: 'Folder',
    fields: [
      { name: 'path', description: 'Absolute path on disk', type: nonNull(STRING) },
      {
        name: 'parent_folder_id',
        isDeprecated: true,
        deprecationReason: 'Use parent_folder instead',
        type: named('SCALAR', 'ID'),
      },
    ],
  };
  assert.equal(
    printObjectType(folder),
    'export type Folder = {\n' +
      '  /** Absolute path on disk */\n' +
      '  path: string;\n' +
      '  /** @deprecated Use parent_folder instead */\n' +
      '  parent_folder_id: string | null;\n' +
      '};\n',
  );
});

test('printObjectType emits an empty object rather than a blank body', () => {
  assert.equal(printObjectType({ kind: 'OBJECT', name: 'Empty', fields: [] }), 'export type Empty = {};\n');
});

test('printInputObjectType emits an empty object when inputFields is absent', () => {
  assert.equal(
    printInputObjectType({ kind: 'INPUT_OBJECT', name: 'EmptyInput', inputFields: null }),
    'export type EmptyInput = {};\n',
  );
});

test('printEnumType emits never for an enum with no values', () => {
  // `export type X =\n;` would not compile — a type with no inhabitants is `never`.
  assert.equal(printEnumType({ kind: 'ENUM', name: 'Empty', enumValues: [] }), 'export type Empty = never;\n');
});

test('printUnionType emits never for a union with no members', () => {
  assert.equal(printUnionType({ kind: 'UNION', name: 'Empty', possibleTypes: [] }), 'export type Empty = never;\n');
});
```

- [ ] **Step 2: Run the tests to verify they fail**

Run: `npm test`

Expected: FAIL — `printJsDoc`, `printObjectType`, `printInputObjectType`, `printEnumType`, and `printUnionType` are not exported.

- [ ] **Step 3: Write the declaration printers**

Append to `scripts/codegen/print.ts`, and add `IntrospectionInputValue`, `IntrospectionType` to its `import type` from `./introspection.js`.

```ts
type Documented = {
  description?: string | null;
  isDeprecated?: boolean;
  deprecationReason?: string | null;
};

/** Prints a JSDoc block, or '' when there is nothing to say. */
export function printJsDoc(subject: Documented, indent: string): string {
  const lines: string[] = [];
  if (subject.description !== undefined && subject.description !== null && subject.description !== '') {
    lines.push(...subject.description.split('\n'));
  }
  if (subject.isDeprecated === true) {
    if (lines.length > 0) {
      lines.push('');
    }
    lines.push(`@deprecated ${subject.deprecationReason ?? ''}`.trimEnd());
  }
  if (lines.length === 0) {
    return '';
  }
  // An unescaped */ inside a description would terminate the comment early.
  const safe = lines.map((line) => line.replace(/\*\//g, '*\\/'));
  if (safe.length === 1) {
    return `${indent}/** ${safe[0] ?? ''} */\n`;
  }
  const body = safe.map((line) => `${indent} * ${line}`.trimEnd()).join('\n');
  return `${indent}/**\n${body}\n${indent} */\n`;
}

function isOptionalInput(field: IntrospectionInputValue): boolean {
  // Nullable inputs may be omitted; so may non-null inputs that carry a default.
  const hasDefault = field.defaultValue !== undefined && field.defaultValue !== null;
  return field.type.kind !== 'NON_NULL' || hasDefault;
}

export function printObjectType(type: IntrospectionType): string {
  const fields = type.fields ?? [];
  if (fields.length === 0) {
    return `${printJsDoc(type, '')}export type ${type.name} = {};\n`;
  }
  const body = fields
    .map((field) => `${printJsDoc(field, '  ')}  ${field.name}: ${printTypeRef(field.type)};`)
    .join('\n');
  return `${printJsDoc(type, '')}export type ${type.name} = {\n${body}\n};\n`;
}

export function printInputObjectType(type: IntrospectionType): string {
  const fields = type.inputFields ?? [];
  if (fields.length === 0) {
    return `${printJsDoc(type, '')}export type ${type.name} = {};\n`;
  }
  const body = fields
    .map((field) => {
      const optional = isOptionalInput(field) ? '?' : '';
      return `${printJsDoc(field, '  ')}  ${field.name}${optional}: ${printTypeRef(field.type)};`;
    })
    .join('\n');
  return `${printJsDoc(type, '')}export type ${type.name} = {\n${body}\n};\n`;
}

export function printEnumType(type: IntrospectionType): string {
  const values = type.enumValues ?? [];
  // A type with no inhabitants is `never`. Emitting the empty body instead would
  // produce `export type X =\n;` — a dangling `=` that does not compile.
  if (values.length === 0) {
    return `${printJsDoc(type, '')}export type ${type.name} = never;\n`;
  }
  const body = values.map((value) => `${printJsDoc(value, '  ')}  | '${value.name}'`).join('\n');
  return `${printJsDoc(type, '')}export type ${type.name} =\n${body};\n`;
}

export function printUnionType(type: IntrospectionType): string {
  const members = (type.possibleTypes ?? []).map((member) => member.name ?? 'never');
  // Same reasoning as the empty enum: `export type X = ;` does not compile.
  if (members.length === 0) {
    return `${printJsDoc(type, '')}export type ${type.name} = never;\n`;
  }
  return `${printJsDoc(type, '')}export type ${type.name} = ${members.join(' | ')};\n`;
}
```

- [ ] **Step 4: Run the tests to verify they pass**

Run: `npm test`

Expected: PASS.

- [ ] **Step 5: Verify**

Run: `npm run verify`

Expected: exit 0.

- [ ] **Step 6: Commit (ask Chad first)**

```bash
git add scripts/codegen/print.ts tests/codegen.test.ts
git commit -m "feat: print graphql type declarations with jsdoc and deprecations"
```

---

### Task 3: Document assembly and operation maps

Assembles the whole file: banner, sorted declarations, and the three operation maps. This is where determinism is established.

**Files:**
- Modify: `scripts/codegen/print.ts`
- Modify: `tests/codegen.test.ts`

**Interfaces:**
- Consumes: every printer from Tasks 1 and 2.
- Produces: `print.ts` exports `introspectionToTypeScript(schema: IntrospectionSchema): string`, returning the complete file contents. Task 4's shell calls exactly this.

- [ ] **Step 1: Write the failing assembly tests**

Append to `tests/codegen.test.ts`, adding `IntrospectionSchema` to the type imports and `introspectionToTypeScript` to the value imports.

```ts
function schemaFixture(): IntrospectionSchema {
  return {
    queryType: { name: 'Query' },
    mutationType: { name: 'Mutation' },
    subscriptionType: { name: 'Subscription' },
    types: [
      {
        kind: 'OBJECT',
        name: 'Query',
        fields: [
          { name: 'jobQueue', type: list(nonNull(named('OBJECT', 'Job'))) },
          {
            name: 'findScene',
            args: [{ name: 'id', type: nonNull(named('SCALAR', 'ID')) }],
            type: named('OBJECT', 'Job'),
          },
        ],
      },
      {
        kind: 'OBJECT',
        name: 'Mutation',
        fields: [
          {
            name: 'metadataScan',
            description: 'Start a scan. Returns the job ID',
            args: [{ name: 'input', type: nonNull(named('INPUT_OBJECT', 'ScanMetadataInput')) }],
            type: nonNull(named('SCALAR', 'ID')),
          },
          { name: 'optimiseDatabase', args: [], type: nonNull(named('SCALAR', 'ID')) },
        ],
      },
      { kind: 'OBJECT', name: 'Subscription', fields: [{ name: 'jobsSubscribe', type: named('OBJECT', 'Job') }] },
      { kind: 'OBJECT', name: 'Zebra', fields: [{ name: 'id', type: nonNull(named('SCALAR', 'ID')) }] },
      { kind: 'OBJECT', name: 'Job', fields: [{ name: 'id', type: nonNull(named('SCALAR', 'ID')) }] },
      { kind: 'INPUT_OBJECT', name: 'ScanMetadataInput', inputFields: [{ name: 'rescan', type: named('SCALAR', 'Boolean') }] },
      { kind: 'SCALAR', name: 'ID' },
      { kind: 'OBJECT', name: '__Type', fields: [{ name: 'kind', type: nonNull(named('SCALAR', 'String')) }] },
    ],
  };
}

test('introspectionToTypeScript emits a do-not-edit banner naming the regen command', () => {
  const out = introspectionToTypeScript(schemaFixture());
  assert.match(out, /Do not edit/i);
  assert.match(out, /npm run codegen/);
});

test('introspectionToTypeScript sorts declarations by codepoint', () => {
  const out = introspectionToTypeScript(schemaFixture());
  assert.ok(out.indexOf('export type Job =') < out.indexOf('export type Zebra ='), 'Job must precede Zebra');
});

test('introspectionToTypeScript omits introspection types and scalars', () => {
  const out = introspectionToTypeScript(schemaFixture());
  assert.doesNotMatch(out, /__Type/, 'introspection meta-types must not be emitted');
  assert.doesNotMatch(out, /export type ID =/, 'scalars map to primitives, they get no declaration');
});

test('introspectionToTypeScript does not emit the root types as object types', () => {
  const out = introspectionToTypeScript(schemaFixture());
  assert.doesNotMatch(out, /export type Query = \{/);
  assert.doesNotMatch(out, /export type Mutation = \{/);
  assert.doesNotMatch(out, /export type Subscription = \{/);
});

test('introspectionToTypeScript emits operation maps for all three roots', () => {
  const out = introspectionToTypeScript(schemaFixture());
  assert.match(out, /export type Queries = \{/);
  assert.match(out, /export type Mutations = \{/);
  assert.match(out, /export type Subscriptions = \{/);
});

test('introspectionToTypeScript gives an argument-free operation an empty args type', () => {
  const out = introspectionToTypeScript(schemaFixture());
  assert.match(out, /optimiseDatabase: \{ args: Record<string, never>; result: string \};/);
});

test('introspectionToTypeScript types operation args and results', () => {
  const out = introspectionToTypeScript(schemaFixture());
  assert.match(out, /metadataScan: \{ args: \{ input: ScanMetadataInput \}; result: string \};/);
  assert.match(out, /jobQueue: \{ args: Record<string, never>; result: Job\[\] \| null \};/);
  assert.match(out, /findScene: \{ args: \{ id: string \}; result: Job \| null \};/);
});

test('introspectionToTypeScript carries operation descriptions into the map', () => {
  const out = introspectionToTypeScript(schemaFixture());
  assert.match(out, /Start a scan\. Returns the job ID/);
});

test('introspectionToTypeScript is deterministic', () => {
  const first = introspectionToTypeScript(schemaFixture());
  const second = introspectionToTypeScript(schemaFixture());
  assert.equal(first, second, 'regeneration must be byte-identical or every diff is noise');
});

test('introspectionToTypeScript output compiles', async () => {
  const dir = await mkdtemp(join(tmpdir(), 'stash-codegen-'));
  const file = join(dir, 'schema.d.ts');
  await writeFile(file, introspectionToTypeScript(schemaFixture()), 'utf8');
  const result = await run(
    'npx',
    ['tsc', '--noEmit', '--strict', '--exactOptionalPropertyTypes', '--skipLibCheck', file],
    process.cwd(),
  );
  assert.equal(result.code, 0, `generated output does not compile:\n${result.stdout}\n${result.stderr}`);
});
```

**TypeScript 7's native CLI does reject that ad-hoc single-file invocation** — an explicit
file argument alongside flags conflicts with the ambient project `tsconfig.json` — so use
this form: write a minimal `tsconfig.json` beside the file in the temp directory and
invoke `npx tsc --noEmit --project <dir>/tsconfig.json`:

```json
{
  "compilerOptions": { "strict": true, "exactOptionalPropertyTypes": true, "skipLibCheck": true, "noEmit": true },
  "include": ["schema.d.ts"]
}
```

Either form satisfies the requirement, which is that the generated output is fed to a real
compiler rather than only to string assertions.

The last test needs these additional imports at the top of the file:

```ts
import { mkdtemp, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { run } from './helpers/run.js';
```

- [ ] **Step 2: Run the tests to verify they fail**

Run: `npm test`

Expected: FAIL — `introspectionToTypeScript` is not exported.

- [ ] **Step 3: Write the assembly function**

Append to `scripts/codegen/print.ts`, adding `IntrospectionField` and `IntrospectionSchema` to the type imports.

```ts
const BANNER = `/**
 * Generated from the stash GraphQL schema. Do not edit.
 *
 * Regenerate with: npm run codegen
 */
`;

function printArgs(args: IntrospectionInputValue[]): string {
  if (args.length === 0) {
    return 'Record<string, never>';
  }
  const body = args
    .map((arg) => `${arg.name}${isOptionalInput(arg) ? '?' : ''}: ${printTypeRef(arg.type)}`)
    .join('; ');
  return `{ ${body} }`;
}

function printOperationMap(mapName: string, fields: IntrospectionField[]): string {
  const body = fields
    .map(
      (field) =>
        `${printJsDoc(field, '  ')}  ${field.name}: { args: ${printArgs(field.args ?? [])}; result: ${printTypeRef(field.type)} };`,
    )
    .join('\n');
  return `export type ${mapName} = {\n${body}\n};\n`;
}

function printDeclaration(type: IntrospectionType): string {
  switch (type.kind) {
    case 'OBJECT':
    case 'INTERFACE':
      return printObjectType(type);
    case 'INPUT_OBJECT':
      return printInputObjectType(type);
    case 'ENUM':
      return printEnumType(type);
    case 'UNION':
      return printUnionType(type);
    default:
      throw new Error(`no declaration printer for kind ${type.kind}`);
  }
}

/** Renders a whole introspection response as the contents of schema.d.ts. */
export function introspectionToTypeScript(schema: IntrospectionSchema): string {
  const roots = new Map<string, string>();
  for (const [mapName, root] of [
    ['Queries', schema.queryType],
    ['Mutations', schema.mutationType],
    ['Subscriptions', schema.subscriptionType],
  ] as const) {
    if (root !== null) {
      roots.set(root.name, mapName);
    }
  }

  const declarable = schema.types
    .filter((type) => !type.name.startsWith('__'))
    .filter((type) => !roots.has(type.name))
    // Scalars become primitives via SCALAR_MAP; they get no declaration of their own.
    .filter((type) => type.kind !== 'SCALAR')
    // Codepoint order, not localeCompare, which varies by locale and would break
    // byte-identical regeneration. `toSorted` rather than `sort` because oxlint's
    // unicorn(no-array-sort) rule is a warning and `lint` runs --deny-warnings; the
    // array is freshly built by the filters above, so not mutating in place costs
    // nothing.
    .toSorted((a, b) => (a.name < b.name ? -1 : a.name > b.name ? 1 : 0));

  const sections = [BANNER, ...declarable.map(printDeclaration)];

  for (const [rootName, mapName] of roots) {
    const root = schema.types.find((type) => type.name === rootName);
    if (root === undefined) {
      throw new Error(`root type ${rootName} is missing from the schema types`);
    }
    sections.push(printOperationMap(mapName, root.fields ?? []));
  }

  return sections.join('\n');
}
```

- [ ] **Step 4: Run the tests to verify they pass**

Run: `npm test`

Expected: PASS. The "output compiles" test is the important one — string assertions cannot tell you the emitted TypeScript is valid.

- [ ] **Step 5: Verify**

Run: `npm run verify`

Expected: exit 0.

- [ ] **Step 6: Commit (ask Chad first)**

```bash
git add scripts/codegen/print.ts tests/codegen.test.ts
git commit -m "feat: assemble the generated schema document with operation maps"
```

---

### Task 4: The generator shell, scripts, and the real generated file

Runs the printer against a live server and commits its output. **This task requires a reachable stash server**; the earlier tasks did not.

**Files:**
- Create: `scripts/codegen.ts`
- Create: `src/generated/schema.d.ts` (generated output)
- Modify: `package.json`
- Modify: `.oxlintrc.json`

**Interfaces:**
- Consumes: `introspectionToTypeScript(schema)` from Task 3, `INTROSPECTION_QUERY` and `IntrospectionSchema` from Task 1, and `request<T>(endpoint, query)` from `src/graphql.ts`.
- Produces: `src/generated/schema.d.ts` exporting one type per schema type plus `Queries`, `Mutations`, `Subscriptions`. Task 5 imports `Job` and `JobStatus` from it.

- [ ] **Step 1: Write the generator shell**

`scripts/codegen.ts`. It reuses the project's own GraphQL client rather than a second fetch implementation.

```ts
import { mkdir, writeFile } from 'node:fs/promises';
import { dirname, resolve } from 'node:path';
import { request } from '../src/graphql.js';
import { INTROSPECTION_QUERY, type IntrospectionSchema } from './codegen/introspection.js';
import { introspectionToTypeScript } from './codegen/print.js';

const endpoint = process.env['STASH_ENDPOINT'] ?? 'http://localhost:9999/graphql';
const outfile = resolve(import.meta.dirname, '..', 'src', 'generated', 'schema.d.ts');

// src/graphql.ts checks the envelope but asserts the payload's shape rather than
// validating it, and a transport failure rejects before its wrapping applies. Both
// failures land here, so both are named here rather than surfacing as a TypeError from
// inside the printer or an undici error with the endpoint buried in a cause chain.
let payload: { __schema?: IntrospectionSchema | null };
try {
  payload = await request<{ __schema?: IntrospectionSchema | null }>(endpoint, INTROSPECTION_QUERY);
} catch (error: unknown) {
  const detail = error instanceof Error ? error.message : String(error);
  throw new Error(`introspecting ${endpoint} failed: ${detail}`, { cause: error });
}

// Destructured rather than `payload.__schema`, which trips oxlint's
// no-underscore-dangle under --deny-warnings. Semantically identical.
const { __schema: schema } = payload;
if (schema === undefined || schema === null) {
  throw new Error(
    `the response from ${endpoint} contained no __schema — is introspection enabled on this stash server?`,
  );
}

const source = introspectionToTypeScript(schema);

await mkdir(dirname(outfile), { recursive: true });
await writeFile(outfile, source, 'utf8');

console.log(`wrote ${outfile} (${source.split('\n').length} lines, ${schema.types.length} schema types)`);
```

- [ ] **Step 2: Add the scripts and the lint exclusion**

In `package.json`, add to `scripts`:

```json
    "codegen": "tsx scripts/codegen.ts",
    "codegen:check": "npm run codegen && git diff --exit-code -- src/generated/schema.d.ts",
```

`codegen:check` needs no separate script: regenerating and asking git whether anything moved is the whole check. It cannot run in CI, which has no stash server.

In `.oxlintrc.json`, add `"src/generated"` to `ignorePatterns`. Lint has no business grading generated output; `tsc` continues to check it.

- [ ] **Step 3: Generate the file**

Run: `npm run codegen`

Expected: it reports roughly 301 schema types and writes several thousand lines. If it throws `unmapped custom scalar`, a stash version has introduced a scalar the map does not know — add it to `SCALAR_MAP` with a deliberate choice rather than defaulting it to `unknown`, and say so in your report.

- [ ] **Step 4: Verify the generated file typechecks and is stable**

Run: `npm run typecheck`

Expected: exit 0. Note that this does not prove the real output *compiles*: the project sets `skipLibCheck: true`, which suppresses every semantic error in a `.d.ts`, so `npm run typecheck` only syntax-checks the committed file. The semantic check is the dedicated test in `tests/codegen.test.ts` that copies the committed artifact into a temp directory as a `.ts` and typechecks it without `skipLibCheck`.

Run: `npm run codegen:check`

Expected: exit 0, proving a second run reproduces the file byte-for-byte. A nonzero exit here means the printer is nondeterministic and must be fixed before committing.

- [ ] **Step 5: Confirm the bundle did not grow**

Run: `npm run build && wc -c dist/stash.js`

Expected: unchanged from before this task (about 4,737 bytes), because nothing imports the generated file yet and a `.d.ts` cannot contribute runtime code. The size-ceiling test in `tests/bundle.test.ts` also guards this.

- [ ] **Step 6: Verify**

Run: `npm run verify`

Expected: exit 0.

- [ ] **Step 7: Commit (ask Chad first)**

The generated file is large. Show `git diff --stat` and note its line count in your report.

```bash
git add scripts/codegen.ts package.json .oxlintrc.json src/generated/schema.d.ts
git commit -m "feat: generate schema types from a live stash server"
```

---

### Task 5: Rewire `src/format.ts` and `src/stash.ts`

Replaces hand-written types with generated ones, which forces two real bug fixes and one display change.

**Files:**
- Modify: `src/format.ts`
- Modify: `src/stash.ts`
- Modify: `tests/format.test.ts`
- Modify: `tests/stash.test.ts`

**Interfaces:**
- Consumes: `Job`, `JobStatus`, `Queries`, `Mutations` from `src/generated/schema.d.ts` (Task 4).
- Produces: `JobDisplay` becomes `Pick<Job, 'status' | 'description' | 'progress' | 'subTasks' | 'startTime'>`. `renderJob(job: JobDisplay, now?: number): string` keeps its signature.

- [ ] **Step 1: Write the failing tests**

In `tests/format.test.ts`, change the queued-emoji constant and add the new cases. The existing constant is `QUEUED_EMOJI`; its value changes from `'🧍'` to `'⏳'`. This is a deliberate output change, not a test being bent to fit.

```ts
const QUEUED_EMOJI = '⏳';
```

Add these tests:

```ts
test('renderJob renders a distinct glyph for every job status', () => {
  // Typed as JobStatus, not string: `job({ status })` takes JobStatus once JobDisplay
  // is a Pick of the generated Job, so a plain string would not compile.
  const glyphs: [JobStatus, string][] = [
    ['RUNNING', '🏃‍➡️'],
    ['READY', '⏳'],
    ['FINISHED', '✅'],
    ['FAILED', '❌'],
    ['CANCELLED', '🚫'],
    ['STOPPING', '🛑'],
  ];
  const seen = new Set<string>();
  for (const [status, glyph] of glyphs) {
    const rendered = renderJob(job({ status, description: status }), NOON + 300_000);
    assert.ok(rendered.startsWith(`${glyph} ${status}`), `${status} should render as ${glyph}:\n${rendered}`);
    seen.add(glyph);
  }
  assert.equal(seen.size, glyphs.length, 'every status needs its own glyph');
});

test('renderJob treats null progress as zero', () => {
  const rendered = renderJob(job({ progress: null, startTime: null }), NOON);
  assert.equal(rendered, renderJob(job({ progress: 0, startTime: null }), NOON));
  assert.match(rendered, /0\.00%/);
  assert.doesNotMatch(rendered, /NaN/);
});
```

Add `JobStatus` to the test file's type imports:

```ts
import type { JobStatus } from '../src/generated/schema.js';
```

The `job()` helper's `status` field currently defaults to `'RUNNING'` typed as `string`; once `JobDisplay` is a `Pick<Job, …>` its type becomes `JobStatus`, so the helper's `Partial<JobDisplay>` override accepts only valid statuses — which is the point.

In `tests/stash.test.ts`, the queued-job assertion changes:

```ts
    assert.match(result.stdout, /⏳/u, 'missing the queued job emoji');
```

- [ ] **Step 2: Run the tests to verify they fail**

Run: `npm test`

Expected: FAIL — the status test fails because every non-`RUNNING` status currently renders 🧍, and the null-progress test fails because `job()` cannot yet take `progress: null`.

- [ ] **Step 3: Rewire `src/format.ts`**

Replace the hand-written `JobDisplay` and the two-way emoji ternary. The `Record<JobStatus, string>` is what makes this exhaustive: if a stash upgrade adds a seventh status, this stops compiling instead of silently mislabelling it.

```ts
import type { Job, JobStatus } from './generated/schema.js';

export type JobDisplay = Pick<Job, 'status' | 'description' | 'progress' | 'subTasks' | 'startTime'>;

const STATUS_GLYPHS: Record<JobStatus, string> = {
  RUNNING: '🏃‍➡️',
  READY: '⏳',
  FINISHED: '✅',
  FAILED: '❌',
  CANCELLED: '🚫',
  STOPPING: '🛑',
};
```

Delete the local `JobDisplay` type definition. In `renderJob`, replace the emoji line and normalise `progress`:

```ts
export function renderJob(job: JobDisplay, now = Date.now()): string {
  const emoji = STATUS_GLYPHS[job.status];
  // Job.progress is Float in the schema — nullable. Treat absent progress as zero
  // explicitly rather than relying on null coercing to 0 in arithmetic.
  const progress = job.progress ?? 0;
  const percentage = progress * 100;
  const eta = formatEta(job.startTime, progress, now);
  const etaSuffix = eta === '' ? '' : ` ${eta}`;
  return `${emoji} ${job.description}
${getBarString(progress)} ${percentage.toFixed(2)}%${etaSuffix}
${(job.subTasks ?? []).map((subTask) => `   ${truncate(subTask, 57)}`).join('\n')}
`;
}
```

`formatEta` keeps its `progress: number` parameter — the null is normalised by its caller, so the pure formatter does not grow a nullable input.

- [ ] **Step 4: Rewire `src/stash.ts`**

Replace the two hand-written response types with compositions of generated ones:

```ts
import type { Job, Mutations } from './generated/schema.js';
```

```ts
type StatusResponse = {
  jobQueue: Pick<
    Job,
    'id' | 'progress' | 'status' | 'description' | 'subTasks' | 'error' | 'endTime' | 'addTime' | 'startTime'
  >[] | null;
};

type RescanResponse = {
  metadataScan: Mutations['metadataScan']['result'];
  metadataIdentify: Mutations['metadataIdentify']['result'];
  metadataGenerate: Mutations['metadataGenerate']['result'];
};
```

Delete the old inline shapes. The `Pick` currently lists every `Job` field, so it is equivalent to `Job` today — it is written out on purpose, so that a field added by a stash upgrade does not silently join our response type when our query never selected it.

- [ ] **Step 5: Run the tests to verify they pass**

Run: `npm test`

Expected: PASS. If `tsc` complains that `status` is not assignable, the test helper is passing a string where `JobStatus` is required — that is the generated type doing its job; fix the helper, not the type.

- [ ] **Step 6: Verify**

Run: `npm run verify`

Expected: exit 0 across all four stages.

- [ ] **Step 7: Confirm against the real server**

```bash
npm run build
./dist/stash.js
```

Expected: the job queue renders with ⏳ for queued jobs instead of 🧍. Report the bundle size — it must not have grown meaningfully, since the only new imports are type-only.

- [ ] **Step 8: Commit (ask Chad first)**

```bash
git add src/format.ts src/stash.ts tests/format.test.ts tests/stash.test.ts
git commit -m "refactor: type the job queue from the generated schema"
```

---

## Done When

- `npm run verify` passes: oxlint, `tsc --noEmit`, tests, build.
- `npm run codegen` regenerates `src/generated/schema.d.ts`, and `npm run codegen:check` exits 0 immediately afterwards.
- No hand-written GraphQL response field types remain in `src/stash.ts` or `src/format.ts`.
- All six `JobStatus` values render a distinct glyph, and a seventh would fail to compile.
- A job with null `progress` renders `0.00%` with no `NaN`.
- `dist/stash.js` has not grown beyond the 15 KB ceiling — generated types contribute nothing.

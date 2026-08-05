import assert from 'node:assert/strict';
import { mkdtemp, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import test from 'node:test';
import type { IntrospectionSchema, IntrospectionType, TypeRef } from '../scripts/codegen/introspection.js';
import {
  introspectionToTypeScript,
  printEnumType,
  printInputObjectType,
  printJsDoc,
  printObjectType,
  printTypeRef,
  printUnionType,
} from '../scripts/codegen/print.js';
import { run } from './helpers/run.js';

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
  // TypeScript 7's native CLI rejects the ad-hoc single-file invocation (an explicit
  // file argument alongside flags conflicts with the ambient project tsconfig.json),
  // so a minimal project is used instead.
  const tsconfigPath = join(dir, 'tsconfig.json');
  await writeFile(
    tsconfigPath,
    JSON.stringify({
      compilerOptions: { strict: true, exactOptionalPropertyTypes: true, skipLibCheck: true, noEmit: true },
      include: ['schema.d.ts'],
    }),
    'utf8',
  );
  const result = await run('npx', ['tsc', '--noEmit', '--project', tsconfigPath], process.cwd());
  assert.equal(result.code, 0, `generated output does not compile:\n${result.stdout}\n${result.stderr}`);
});

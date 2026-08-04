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

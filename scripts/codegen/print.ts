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

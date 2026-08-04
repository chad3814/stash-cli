import type { IntrospectionInputValue, IntrospectionType, TypeRef } from './introspection.js';

// ─── Scalar mapping ─────────────────────────────────────────────────────────

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

// ─── Type reference printing ────────────────────────────────────────────────

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

// ─── Declaration printing ───────────────────────────────────────────────────

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

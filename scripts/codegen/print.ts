import type {
  IntrospectionField,
  IntrospectionInputValue,
  IntrospectionSchema,
  IntrospectionType,
  TypeRef,
} from './introspection.js';

// ─── Scalar mapping ─────────────────────────────────────────────────────────

/** The name of the JSON alias the printer emits; see JSON_VALUE_ALIAS. */
const JSON_VALUE = 'JsonValue';

export const SCALAR_MAP: Record<string, string> = {
  ID: 'string',
  String: 'string',
  Int: 'number',
  Float: 'number',
  Int64: 'number',
  Boolean: 'boolean',
  Time: 'string',
  Timestamp: 'string',
  // BoolMap stays specific: the schema says the values are booleans.
  BoolMap: 'Record<string, boolean>',
  Map: `Record<string, ${JSON_VALUE}>`,
  PluginConfigMap: `Record<string, ${JSON_VALUE}>`,
  Any: JSON_VALUE,
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

/**
 * Codepoint comparison — never `localeCompare`, which is locale-dependent and would make
 * regeneration produce different output on different machines.
 *
 * Every collection this printer emits is sorted with this. Introspection returns members
 * in the schema's own declaration order, which is stable for a given schema version but
 * reshuffles whenever the schema is reordered upstream. Sorting means a regeneration diff
 * says "the schema changed" rather than "someone moved a field", which is the difference
 * between a reviewable diff and 4,500 lines of noise. Member order carries no meaning in
 * TypeScript: object members and union members are unordered sets.
 */
function byName(a: { name: string }, b: { name: string }): number {
  return a.name < b.name ? -1 : a.name > b.name ? 1 : 0;
}

export function printObjectType(type: IntrospectionType): string {
  const fields = (type.fields ?? []).toSorted(byName);
  if (fields.length === 0) {
    return `${printJsDoc(type, '')}export type ${type.name} = {};\n`;
  }
  const body = fields
    .map((field) => `${printJsDoc(field, '  ')}  ${field.name}: ${printTypeRef(field.type)};`)
    .join('\n');
  return `${printJsDoc(type, '')}export type ${type.name} = {\n${body}\n};\n`;
}

export function printInputObjectType(type: IntrospectionType): string {
  const fields = (type.inputFields ?? []).toSorted(byName);
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
  const values = (type.enumValues ?? []).toSorted(byName);
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

// ─── Document assembly ──────────────────────────────────────────────────────

const BANNER = `/**
 * Generated from the stash GraphQL schema. Do not edit.
 *
 * Regenerate with: npm run codegen
 */
`;

// The JSON scalars (Any, Map, PluginConfigMap) really are JSON, not arbitrary values.
// A recursive alias says so, and still forces narrowing at the use site.
const JSON_VALUE_ALIAS = `export type ${JSON_VALUE} =
  | string
  | number
  | boolean
  | null
  | ${JSON_VALUE}[]
  | { [key: string]: ${JSON_VALUE} };
`;

function printArgs(args: IntrospectionInputValue[]): string {
  if (args.length === 0) {
    return 'Record<string, never>';
  }
  // Args are printed inline inside the operation maps, where a JSDoc block cannot go,
  // so a deprecated argument carries no @deprecated marker. Deliberate: the alternative
  // is a per-argument declaration for every operation. Input object fields and output
  // fields do get markers.
  const body = args
    .toSorted(byName)
    .map((arg) => `${arg.name}${isOptionalInput(arg) ? '?' : ''}: ${printTypeRef(arg.type)}`)
    .join('; ');
  return `{ ${body} }`;
}

function printOperationMap(mapName: string, fields: IntrospectionField[]): string {
  const body = fields
    .toSorted(byName)
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
    // byte-identical regeneration.
    .toSorted(byName);

  // JsonValue is the printer's own name in the generated file's namespace. No stash type
  // uses it today; if one ever does, two `export type JsonValue` declarations would be
  // emitted, so say which name collided rather than leaving tsc to report a duplicate
  // identifier somewhere in several thousand lines.
  if (declarable.some((type) => type.name === JSON_VALUE)) {
    throw new Error(
      `the schema declares a type named '${JSON_VALUE}', which collides with the printer's JSON alias — rename the alias in scripts/codegen/print.ts`,
    );
  }

  const sections = [BANNER, JSON_VALUE_ALIAS, ...declarable.map(printDeclaration)];

  for (const [rootName, mapName] of roots) {
    const root = schema.types.find((type) => type.name === rootName);
    if (root === undefined) {
      throw new Error(`root type ${rootName} is missing from the schema types`);
    }
    sections.push(printOperationMap(mapName, root.fields ?? []));
  }

  return sections.join('\n');
}

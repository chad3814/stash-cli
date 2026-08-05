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

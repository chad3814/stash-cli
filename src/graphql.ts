// A minimal GraphQL-over-HTTP client. Replaces graphql-request and its `graphql`
// peer dependency, which together added ~600 KB to the bundle to send two hardcoded
// documents. Named operations are deliberately unsupported: every document here is a
// single anonymous operation, so `operationName` is never needed.

const ACCEPT = 'application/graphql-response+json, application/json';

/**
 * Identity template tag. Does no parsing — it exists so documents keep GraphQL
 * syntax highlighting in editors that key off a `gql` tag.
 */
export function gql(strings: TemplateStringsArray, ...values: string[]): string {
  return strings.reduce((out, chunk, index) => out + chunk + (values[index] ?? ''), '');
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null;
}

function describeErrors(errors: unknown): string {
  if (!Array.isArray(errors)) {
    return JSON.stringify(errors);
  }
  return errors
    .map((entry) => {
      if (isRecord(entry) && typeof entry['message'] === 'string') {
        return entry['message'];
      }
      return JSON.stringify(entry);
    })
    .join('; ');
}

/**
 * POSTs `query` to `endpoint` and returns the response's `data` field. `variables`
 * is sent alongside the query only when supplied; omitting it keeps the posted body
 * exactly as it has always been, with no `variables` key at all.
 *
 * The returned value is asserted to `T` rather than validated — the envelope is
 * checked, the payload's shape is not. Throws on a non-2xx status, a non-JSON body,
 * a GraphQL `errors` array, or a missing `data` field.
 */
export async function request<T>(
  endpoint: string,
  query: string,
  variables?: Record<string, unknown>,
): Promise<T> {
  const response = await fetch(endpoint, {
    method: 'POST',
    headers: {
      'content-type': 'application/json',
      accept: ACCEPT,
    },
    // Omitting variables must post the exact body this client has always posted —
    // `{ query, variables: undefined }` would serialise the same, but building the
    // object conditionally states the guarantee instead of relying on it.
    body: JSON.stringify(variables === undefined ? { query } : { query, variables }),
  });

  const text = await response.text();

  if (!response.ok) {
    throw new Error(`GraphQL request to ${endpoint} failed with status ${response.status}: ${text}`);
  }

  let payload: unknown;
  try {
    payload = JSON.parse(text);
  } catch {
    throw new Error(`GraphQL response from ${endpoint} was not JSON: ${text}`);
  }

  if (!isRecord(payload)) {
    throw new Error(`GraphQL response from ${endpoint} was not an object: ${text}`);
  }

  if (payload['errors'] !== undefined) {
    throw new Error(`GraphQL request failed: ${describeErrors(payload['errors'])}`);
  }

  const data = payload['data'];
  if (data === undefined || data === null) {
    throw new Error(`GraphQL response from ${endpoint} contained no data field: ${text}`);
  }

  return data as T;
}

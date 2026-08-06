// A minimal GraphQL-over-HTTP client. Replaces graphql-request and its `graphql`
// peer dependency, which together added ~600 KB to the bundle to send two hardcoded
// documents. Named operations are deliberately unsupported: every document here is a
// single anonymous operation, so `operationName` is never needed.
import { OperationalError } from './errors.js';
import { authFailureMessage, authHeaders, resolveApiKey } from './auth.js';

const ACCEPT = 'application/graphql-response+json, application/json';

/**
 * Removes the API key from a response body before it can be interpolated into a message.
 *
 * Every request here goes out carrying the `ApiKey` header, and the messages below quote the
 * body back to the user because that is how you see a server's actual complaint — an HTML
 * login page, or a GraphQL error returned as a 500. A server that echoed request state into
 * that body would otherwise put the key on the screen and into any log capturing stderr.
 *
 * Redacting where the body is read, rather than at each message, is deliberate: no
 * unredacted body is ever in scope, so a message added later cannot reintroduce the leak.
 */
function redactApiKey(body: string): string {
  const key = resolveApiKey();
  return key === undefined ? body : body.replaceAll(key, '[redacted]');
}

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
      ...authHeaders(),
    },
    // Omitting variables must post the exact body this client has always posted —
    // `{ query, variables: undefined }` would serialise the same, but building the
    // object conditionally states the guarantee instead of relying on it.
    body: JSON.stringify(variables === undefined ? { query } : { query, variables }),
  });

  const text = redactApiKey(await response.text());

  if (!response.ok) {
    // Checked before the generic message because "failed with status 401" tells the user
    // nothing they can act on. This one deliberately omits the body: a 401 body is
    // typically an HTML login page, and the remedy is in the message already.
    const authFailure = authFailureMessage(response.status, endpoint);
    if (authFailure !== undefined) {
      throw new OperationalError(authFailure);
    }
    throw new OperationalError(`GraphQL request to ${endpoint} failed with status ${response.status}: ${text}`);
  }

  let payload: unknown;
  try {
    payload = JSON.parse(text);
  } catch {
    throw new OperationalError(`GraphQL response from ${endpoint} was not JSON: ${text}`);
  }

  if (!isRecord(payload)) {
    throw new OperationalError(`GraphQL response from ${endpoint} was not an object: ${text}`);
  }

  if (payload['errors'] !== undefined) {
    throw new OperationalError(`GraphQL request failed: ${describeErrors(payload['errors'])}`);
  }

  const data = payload['data'];
  if (data === undefined || data === null) {
    throw new OperationalError(`GraphQL response from ${endpoint} contained no data field: ${text}`);
  }

  return data as T;
}

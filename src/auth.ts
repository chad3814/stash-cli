/**
 * Authentication for stash's GraphQL API and its download endpoints.
 *
 * stash offers an API key or a session cookie. Only the key is implemented: a session
 * cannot outlive a process that runs once and exits, and stash marks cookie auth obsolete
 * as of v0.7. See docs/superpowers/specs/2026-08-05-api-key-design.md.
 *
 * The key is read from the environment rather than accepted as a flag. A flag would put it
 * in shell history and in `ps` output for every other user on the machine.
 */
import { OperationalError } from './errors.js';

/** NUL, LF and CR cannot appear in a header value. See `authHeaders` for why this matters. */
const INVALID_IN_HEADER = /[\0\r\n]/;

/**
 * The shortest key worth redacting. A one- or two-character key would rewrite every
 * occurrence of those characters in a response body, shredding the diagnostic the message
 * exists to show. Real stash keys are JWTs, so this floor never applies to one.
 */
const MIN_REDACTABLE_LENGTH = 8;

/**
 * Resolves the API key from `override`, else `STASH_API_KEY`.
 *
 * Trims, and treats unset, empty, and whitespace-only alike as absent, because
 * `STASH_API_KEY=$(cat key.txt)` picks up a trailing newline. Trimming handles only the
 * ends; `authHeaders` deals with a break in the middle.
 *
 * `??` deliberately does not fall through on an empty string, so an explicit `''` means
 * "no key" rather than "consult the environment".
 *
 * Never throws. `redactApiKey` depends on that — a redactor that could fail would be
 * useless in exactly the error paths it exists to protect.
 */
export function resolveApiKey(override?: string): string | undefined {
  const key = (override ?? process.env['STASH_API_KEY'])?.trim();
  return key === undefined || key === '' ? undefined : key;
}

/**
 * The header to add to a request, or an empty object when there is no key. Returning `{}`
 * rather than `{ ApiKey: '' }` keeps the anonymous case byte-identical to what the CLI
 * sent before authentication existed.
 *
 * Rejects a key containing a line break or NUL before it reaches `fetch`. This is not
 * defensive tidiness: undici validates header values itself and quotes the offending value
 * **in full** in its `TypeError`, which is not an `OperationalError` and so reaches stderr
 * with a stack trace. Trimming does not cover it, because the problem is a break in the
 * middle — exactly what reading a wrapped or multi-line key file produces.
 */
export function authHeaders(apiKey?: string): Record<string, string> {
  const key = resolveApiKey(apiKey);
  if (key === undefined) {
    return {};
  }
  if (INVALID_IN_HEADER.test(key)) {
    // The value is deliberately not interpolated. Quoting it is the disclosure this
    // check exists to prevent.
    throw new OperationalError(
      'STASH_API_KEY contains a line break or control character and cannot be sent as a header; check for a wrapped or multi-line value',
    );
  }
  return { ApiKey: key };
}

/**
 * Replaces the API key wherever it appears in `text`.
 *
 * Applied at the two points where text becomes user-visible: a response body as it is read
 * (`src/graphql.ts`), and the rendering of any error at all (`index.ts`). The second is the
 * backstop — it covers a message this code did not write, such as undici quoting request
 * state back, and the `caused by:` chain, neither of which any local check can anticipate.
 */
export function redactApiKey(text: string): string {
  const key = resolveApiKey();
  if (key === undefined || key.length < MIN_REDACTABLE_LENGTH) {
    return text;
  }
  return text.replaceAll(key, '[redacted]');
}

/**
 * An actionable message for an authentication failure, or `undefined` for any status that
 * is not one. The two cases are worded differently because the remedy differs: with no key
 * the user needs to set one, and with a key the key itself is the problem.
 *
 * Deliberately interpolates the target and nothing else — never the key, and never the
 * response body, which for a 401 is usually an HTML login page.
 */
export function authFailureMessage(
  status: number,
  target: string,
  apiKey?: string,
): string | undefined {
  if (status !== 401 && status !== 403) {
    return undefined;
  }
  return resolveApiKey(apiKey) === undefined
    ? `${target} requires authentication; set STASH_API_KEY (stash: Settings > Security > Authentication)`
    : `${target} rejected the API key in STASH_API_KEY; it may be revoked, or from a different server`;
}

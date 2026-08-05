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

/**
 * Resolves the API key from `override`, else `STASH_API_KEY`.
 *
 * Trims, and treats unset, empty, and whitespace-only alike as absent. Both halves matter:
 * `STASH_API_KEY=$(cat key.txt)` picks up a trailing newline, and a header value carrying
 * one is rejected by the HTTP layer with nothing in the message to say why.
 *
 * `??` deliberately does not fall through on an empty string, so an explicit `''` means
 * "no key" rather than "consult the environment".
 */
export function resolveApiKey(override?: string): string | undefined {
  const key = (override ?? process.env['STASH_API_KEY'])?.trim();
  return key === undefined || key === '' ? undefined : key;
}

/**
 * The header to add to a request, or an empty object when there is no key. Returning `{}`
 * rather than `{ ApiKey: '' }` keeps the anonymous case byte-identical to what the CLI
 * sent before authentication existed.
 */
export function authHeaders(apiKey?: string): Record<string, string> {
  const key = resolveApiKey(apiKey);
  return key === undefined ? {} : { ApiKey: key };
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

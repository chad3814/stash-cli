import assert from 'node:assert/strict';
import test from 'node:test';
import { authFailureMessage, authHeaders, resolveApiKey } from '../src/auth.js';

test('an explicit key is returned as given', () => {
  assert.equal(resolveApiKey('abc123'), 'abc123');
});

test('a key is trimmed', () => {
  // STASH_API_KEY=$(cat key.txt) picks up a trailing newline, and a header value
  // containing one is rejected with nothing in the message to explain why.
  assert.equal(resolveApiKey('  abc123\n'), 'abc123');
});

test('an empty or whitespace-only key counts as absent', () => {
  assert.equal(resolveApiKey(''), undefined);
  assert.equal(resolveApiKey('   '), undefined);
  assert.equal(resolveApiKey('\n\t '), undefined);
});

test('an explicit empty override does not fall through to the environment', () => {
  // `??` only falls through on null/undefined, so '' means "no key" rather than
  // "consult STASH_API_KEY". Asserted so nobody changes it to `||`.
  const restore = process.env['STASH_API_KEY'];
  process.env['STASH_API_KEY'] = 'from-the-environment';
  try {
    assert.equal(resolveApiKey(''), undefined);
  } finally {
    if (restore === undefined) { delete process.env['STASH_API_KEY']; } else { process.env['STASH_API_KEY'] = restore; }
  }
});

test('the environment supplies the key when no override is given', () => {
  const restore = process.env['STASH_API_KEY'];
  process.env['STASH_API_KEY'] = 'from-the-environment';
  try {
    assert.equal(resolveApiKey(), 'from-the-environment');
  } finally {
    if (restore === undefined) { delete process.env['STASH_API_KEY']; } else { process.env['STASH_API_KEY'] = restore; }
  }
});

test('no key means no header at all, not an empty one', () => {
  // An `ApiKey: ''` header would be sent on every request and could be rejected by a
  // server that accepts anonymous access, breaking the unauthenticated case.
  assert.deepEqual(authHeaders(''), {});
});

test('a key becomes exactly one header, named ApiKey', () => {
  assert.deepEqual(authHeaders('abc123'), { ApiKey: 'abc123' });
});

test('a 401 with no key tells the user to set one', () => {
  const message = authFailureMessage(401, 'http://stash/graphql', '');
  assert.ok(message !== undefined);
  assert.match(message, /requires authentication/);
  assert.match(message, /STASH_API_KEY/);
  assert.match(message, /http:\/\/stash\/graphql/);
});

test('a 401 with a key says the key was rejected', () => {
  const message = authFailureMessage(401, 'http://stash/graphql', 'abc123');
  assert.ok(message !== undefined);
  assert.match(message, /rejected/);
  // The remedy differs from the no-key case, so the wording must too.
  assert.doesNotMatch(message, /requires authentication/);
});

test('a 403 is treated as an authentication failure too', () => {
  assert.ok(authFailureMessage(403, 'http://stash/graphql', 'abc123') !== undefined);
});

test('any other status is not an authentication failure', () => {
  for (const status of [200, 400, 404, 500, 502]) {
    assert.equal(authFailureMessage(status, 'http://stash/graphql', 'abc123'), undefined);
  }
});

test('no message ever contains the key itself', () => {
  // The one invariant that must not regress: a message is printed, so anything it
  // interpolates is disclosed.
  for (const status of [401, 403]) {
    const message = authFailureMessage(status, 'http://stash/graphql', 'super-secret-value');
    assert.ok(message !== undefined);
    assert.doesNotMatch(message, /super-secret-value/);
  }
});

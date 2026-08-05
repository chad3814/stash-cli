import assert from 'node:assert/strict';
import test from 'node:test';
import { describeOperationalError, OperationalError, UsageError } from '../src/errors.js';

test('an operational error renders as its message alone when it has no cause', () => {
  const error = new OperationalError('nothing to do');
  assert.equal(describeOperationalError(error), 'nothing to do');
});

test('a cause is rendered beneath the message, indented', () => {
  const error = new OperationalError('the transfer failed', { cause: new Error('terminated') });
  assert.equal(describeOperationalError(error), 'the transfer failed\n  caused by: terminated');
});

test('a chain of causes is rendered in order', () => {
  const root = new Error('ECONNRESET');
  const middle = new Error('socket hang up', { cause: root });
  const error = new OperationalError('the transfer failed', { cause: middle });
  assert.equal(
    describeOperationalError(error),
    'the transfer failed\n  caused by: socket hang up\n  caused by: ECONNRESET',
  );
});

test('a non-Error cause is stringified rather than dropped', () => {
  const error = new OperationalError('the server complained', { cause: 'HTTP 503' });
  assert.equal(describeOperationalError(error), 'the server complained\n  caused by: HTTP 503');
});

test('a cause chain that loops terminates instead of hanging', () => {
  // Reachable in principle from any code that sets `cause` from a shared error, and a CLI
  // that hangs while printing an error message is worse than the error it was reporting.
  const a = new Error('a');
  const b = new Error('b', { cause: a });
  (a as { cause?: unknown }).cause = b;
  const rendered = describeOperationalError(new OperationalError('top', { cause: a }));
  const lines = rendered.split('\n');
  assert.equal(lines[0], 'top');
  assert.ok(lines.length <= 6, `expected the chain to be bounded, got ${lines.length.toString(10)} lines`);
});

test('a usage error is an operational error, so one check covers both', () => {
  // index.ts tests `instanceof UsageError` first and `instanceof OperationalError`
  // second. If this subclassing were ever broken, usage errors would fall through to
  // the generic branch and start printing stack traces.
  const error = new UsageError('unknown command');
  assert.ok(error instanceof UsageError);
  assert.ok(error instanceof OperationalError);
  assert.ok(error instanceof Error);
});

test('a plain Error is not operational, so it keeps its stack', () => {
  // The inverse guarantee: a bug in this program must not be mistaken for an expected
  // failure and have its stack suppressed.
  assert.ok(!(new Error('a bug') instanceof OperationalError));
  assert.ok(!(new TypeError('a bug') instanceof OperationalError));
});

test('errors carry a name that identifies the class', () => {
  assert.equal(new OperationalError('x').name, 'OperationalError');
  assert.equal(new UsageError('x').name, 'UsageError');
});

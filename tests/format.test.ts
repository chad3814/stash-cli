import assert from 'node:assert/strict';
import test from 'node:test';
import { formatEta, getBarString, truncate } from '../src/format.js';

const DONE = '█';
const UNDONE = '░';

test('getBarString renders an empty bar at zero', () => {
  assert.equal(getBarString(0, 4), UNDONE.repeat(4));
});

test('getBarString renders a half bar at one half', () => {
  assert.equal(getBarString(0.5, 4), DONE.repeat(2) + UNDONE.repeat(2));
});

test('getBarString renders a full bar at one', () => {
  assert.equal(getBarString(1, 4), DONE.repeat(4));
});

test('getBarString clamps fractions above one to the full width', () => {
  assert.equal(getBarString(1.5, 4), DONE.repeat(4));
});

test('getBarString clamps negative fractions to empty', () => {
  assert.equal(getBarString(-1, 4), UNDONE.repeat(4));
});

test('getBarString always returns exactly width characters', () => {
  for (const fraction of [0, 0.13, 0.5, 0.87, 1]) {
    assert.equal([...getBarString(fraction, 40)].length, 40, `wrong width at ${fraction}`);
  }
});

test('truncate passes through a string shorter than the width', () => {
  assert.equal(truncate('abc', 10), 'abc');
});

test('truncate passes through a string whose length equals the width', () => {
  assert.equal(truncate('abcdefghij', 10), 'abcdefghij');
});

test('truncate cuts a longer string to exactly the width', () => {
  const result = truncate('abcdefghijklmnop', 10);
  assert.equal(result, 'abcdefg...');
  assert.equal(result.length, 10);
});

const NOON = Date.parse('2026-08-04T12:00:00Z');

test('formatEta returns empty string at zero progress', () => {
  assert.equal(formatEta('2026-08-04T12:00:00Z', 0, NOON + 30_000), '');
});

test('formatEta returns empty string when there is no start time', () => {
  assert.equal(formatEta(null, 0.5, NOON + 30_000), '');
});

test('formatEta returns empty string for an unparseable start time', () => {
  assert.equal(formatEta('not a date', 0.5, NOON + 30_000), '');
});

test('formatEta estimates remaining time from elapsed time and progress', () => {
  assert.equal(formatEta('2026-08-04T12:00:00Z', 0.5, NOON + 60_000), 'ETA: 1:00');
});

test('formatEta zero-pads seconds below ten', () => {
  assert.equal(formatEta('2026-08-04T12:00:00Z', 0.5, NOON + 9_000), 'ETA: 0:09');
});

test('formatEta defaults now to the current clock', () => {
  const startedAMinuteAgo = new Date(Date.now() - 60_000).toISOString();
  assert.match(formatEta(startedAMinuteAgo, 0.5), /^ETA: \d+:\d{2}$/);
});

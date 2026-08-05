import assert from 'node:assert/strict';
import test from 'node:test';
import type { JobDisplay } from '../src/format.js';
import { formatEta, getBarString, renderJob, truncate } from '../src/format.js';
import type { JobStatus } from '../src/generated/schema.js';

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

test('getBarString returns exactly width characters across representative fractions', () => {
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

const RUNNING_EMOJI = '🏃‍➡️';
const QUEUED_EMOJI = '⏳';

function job(overrides: Partial<JobDisplay> = {}): JobDisplay {
  return {
    status: 'RUNNING',
    description: 'Scanning',
    progress: 0.5,
    subTasks: [],
    startTime: '2026-08-04T12:00:00Z',
    ...overrides,
  };
}

test('renderJob renders a running job with a bar, percentage and eta', () => {
  const rendered = renderJob(job({ subTasks: ['scanning file'] }), NOON + 300_000);
  assert.equal(
    rendered,
    `${RUNNING_EMOJI} Scanning\n${DONE.repeat(20)}${UNDONE.repeat(20)} 50.00% ETA: 5:00\n   scanning file\n`,
  );
});

test('renderJob omits the eta for a job at zero progress', () => {
  const rendered = renderJob(
    job({ status: 'READY', description: 'Queued', progress: 0, startTime: null }),
    NOON,
  );
  assert.equal(rendered, `${QUEUED_EMOJI} Queued\n${UNDONE.repeat(40)} 0.00%\n\n`);
  assert.doesNotMatch(rendered, /ETA/);
  assert.doesNotMatch(rendered, / \n/, 'no line should end with a trailing space');
});

test('renderJob treats null subTasks as no subtasks', () => {
  // Job.subTasks is [String!] in the schema, i.e. nullable, and stash returns null
  // rather than [] for absent collections — the same shape that crashed on jobQueue.
  const rendered = renderJob(job({ subTasks: null }), NOON + 300_000);
  assert.equal(rendered, renderJob(job({ subTasks: [] }), NOON + 300_000));
  assert.ok(rendered.includes('Scanning'), `expected the job to still render:\n${rendered}`);
});

test('renderJob passes through a subtask exactly at the 57 character boundary', () => {
  const exact = 'a'.repeat(57);
  const rendered = renderJob(job({ subTasks: [exact] }), NOON + 300_000);
  assert.ok(rendered.includes(`\n   ${exact}\n`), 'subtask was altered at the boundary');
});

test('renderJob truncates a subtask one character past the boundary', () => {
  const rendered = renderJob(job({ subTasks: ['b'.repeat(58)] }), NOON + 300_000);
  const expected = `${'b'.repeat(54)}...`;
  assert.ok(rendered.includes(`\n   ${expected}\n`), `unexpected subtask line: ${rendered}`);
  assert.equal(expected.length, 57);
});

test('renderJob indents every subtask by three spaces', () => {
  const rendered = renderJob(job({ subTasks: ['one', 'two'] }), NOON + 300_000);
  assert.ok(rendered.endsWith('\n   one\n   two\n'), `unexpected subtask block: ${rendered}`);
});

test('renderJob picks a different emoji for running and non-running jobs', () => {
  const running = renderJob(job({ status: 'RUNNING' }), NOON + 300_000);
  const queued = renderJob(job({ status: 'READY' }), NOON + 300_000);
  assert.ok(running.startsWith(`${RUNNING_EMOJI} `), 'wrong emoji for RUNNING');
  assert.ok(queued.startsWith(`${QUEUED_EMOJI} `), 'wrong emoji for READY');
  assert.notEqual(RUNNING_EMOJI, QUEUED_EMOJI);
});

test('renderJob renders a distinct glyph for every job status', () => {
  // Typed as JobStatus, not string: `job({ status })` takes JobStatus once JobDisplay
  // is a Pick of the generated Job, so a plain string would not compile.
  const glyphs: [JobStatus, string][] = [
    ['RUNNING', '🏃‍➡️'],
    ['READY', '⏳'],
    ['FINISHED', '✅'],
    ['FAILED', '❌'],
    ['CANCELLED', '🚫'],
    ['STOPPING', '🛑'],
  ];
  const seen = new Set<string>();
  for (const [status, glyph] of glyphs) {
    const rendered = renderJob(job({ status, description: status }), NOON + 300_000);
    assert.ok(rendered.startsWith(`${glyph} ${status}`), `${status} should render as ${glyph}:\n${rendered}`);
    seen.add(glyph);
  }
  assert.equal(seen.size, glyphs.length, 'every status needs its own glyph');
});

test('renderJob treats null progress as zero', () => {
  const rendered = renderJob(job({ progress: null, startTime: null }), NOON);
  assert.equal(rendered, renderJob(job({ progress: 0, startTime: null }), NOON));
  assert.match(rendered, /0\.00%/);
  assert.doesNotMatch(rendered, /NaN/);
});

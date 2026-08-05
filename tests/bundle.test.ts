import assert from 'node:assert/strict';
import { access, chmod, constants, copyFile, mkdtemp, readFile } from 'node:fs/promises';
import { isBuiltin } from 'node:module';
import { tmpdir } from 'node:os';
import { join, resolve } from 'node:path';
import test from 'node:test';
import { run } from './helpers/run.js';

const root = resolve(import.meta.dirname, '..');
const bundlePath = join(root, 'dist', 'stash.js');

const build = await run('npm', ['run', 'build'], root);
assert.equal(build.code, 0, `build failed:\n${build.stderr}`);

test('bundle is an executable with a node shebang', async () => {
  const source = await readFile(bundlePath, 'utf8');
  assert.ok(source.startsWith('#!/usr/bin/env node\n'), 'missing shebang');
  await access(bundlePath, constants.X_OK);
});

test('bundle inlines every non-builtin dependency', async () => {
  const source = await readFile(bundlePath, 'utf8');
  const ids = [...source.matchAll(/require\(["']([^"']+)["']\)/g)].map((match) => match[1] ?? '');
  const external = ids.filter((id) => id !== '' && !isBuiltin(id));
  assert.deepEqual(external, [], `bundle still requires external packages: ${external.join(', ')}`);

  // The absence of require() calls alone would also hold for an empty or truncated
  // file, so assert a marker proving the program itself is present.
  assert.match(source, /jobQueue/, 'bundle does not appear to contain the CLI source');
});

// This replaced a 15,000-byte ceiling on the artifact. The ceiling was a proxy for
// "no dependency crept back in" — the graphql-request and graphql pair it was written
// after cost 727 KB to send two hardcoded documents. But a byte budget also fails when
// the CLI legitimately grows, and by the ninth subcommand it had 306 bytes left, which
// would have started rejecting real work for the wrong reason. So assert the property
// directly instead of a number that correlates with it.
test('package.json declares no runtime dependencies', async () => {
  const manifest: unknown = JSON.parse(await readFile(join(root, 'package.json'), 'utf8'));
  assert.ok(typeof manifest === 'object' && manifest !== null, 'package.json is not an object');
  const declared = 'dependencies' in manifest ? manifest.dependencies : undefined;
  const names =
    typeof declared === 'object' && declared !== null ? Object.keys(declared) : [];
  assert.deepEqual(
    names,
    [],
    `the bundle must stay self-contained, but package.json now declares: ${names.join(', ')}. ` +
      'A runtime dependency would be inlined into dist/stash.js, which ships as a single ' +
      'file with no node_modules beside it.',
  );
});

test('bundle runs standalone with no node_modules', async () => {
  const dir = await mkdtemp(join(tmpdir(), 'stash-cli-bundle-'));
  const standalone = join(dir, 'stash');
  await copyFile(bundlePath, standalone);
  await chmod(standalone, 0o755);

  // Port 1 is privileged and cannot be bound, so the connection refuses
  // deterministically — whether or not a real stashdb is up on this machine.
  const result = await run(standalone, [], dir, {
    ...process.env,
    STASH_ENDPOINT: 'http://127.0.0.1:1/graphql',
  });

  assert.doesNotMatch(
    result.stderr,
    /MODULE_NOT_FOUND|ERR_MODULE_NOT_FOUND|Cannot find module/,
    `bundle has unresolved imports:\n${result.stderr}`,
  );
  assert.match(
    result.stderr,
    /ECONNREFUSED|fetch failed/i,
    `expected a connection failure to the dead endpoint, got:\n${result.stderr}`,
  );
  assert.equal(result.code, 1);
});

test('the bundle reports the version from package.json', async () => {
  const manifest: unknown = JSON.parse(await readFile(join(root, 'package.json'), 'utf8'));
  assert.ok(
    typeof manifest === 'object' && manifest !== null && 'version' in manifest && typeof manifest.version === 'string',
    'package.json has no string version',
  );
  const result = await run(bundlePath, ['--version'], root);
  assert.equal(result.code, 0, result.stderr);
  assert.equal(result.stdout.trim(), manifest.version);
});

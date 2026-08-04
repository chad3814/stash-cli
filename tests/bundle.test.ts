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

  // The absence of require() calls alone would also hold for an empty or
  // truncated file, so assert a marker proving the dependency's code is present.
  assert.match(source, /GraphQLError/, 'graphql does not appear to be inlined');
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

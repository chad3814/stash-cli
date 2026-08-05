import { chmod, mkdir, readFile, writeFile } from 'node:fs/promises';
import { dirname, resolve } from 'node:path';
import * as esbuild from 'esbuild';

const root = resolve(import.meta.dirname, '..');
const outfile = resolve(root, 'dist', 'stash.js');

await mkdir(dirname(outfile), { recursive: true });

const manifest: unknown = JSON.parse(await readFile(resolve(root, 'package.json'), 'utf8'));
if (typeof manifest !== 'object' || manifest === null || !('version' in manifest) || typeof manifest.version !== 'string') {
  throw new Error('package.json has no string version');
}
const version: string = manifest.version;

const result = await esbuild.build({
  entryPoints: [resolve(root, 'index.ts')],
  bundle: true,
  platform: 'node',
  format: 'cjs',
  target: 'node22',
  outfile,
  banner: { js: '#!/usr/bin/env node' },
  logLevel: 'warning',
  // The bundle is one file with no node_modules, so it cannot read package.json at
  // runtime. release.yml refuses to publish a tag that disagrees with this version.
  define: { __STASH_VERSION__: JSON.stringify(version) },
});

// esbuild.build() only rejects on errors. The cjs output format means a stray
// import.meta anywhere in the bundled graph compiles to {} with a warning, so
// warnings have to fail the build explicitly or that breakage ships silently.
if (result.warnings.length > 0) {
  console.error(`build produced ${result.warnings.length} warning(s)`);
  process.exit(1);
}

await chmod(outfile, 0o755);

// node:util's parseArgs (added for the subcommand surface) is the first node builtin
// import anywhere in the bundle, which makes esbuild emit a require() call in this
// cjs-format output. The root package.json declares "type": "module", so without this
// file Node would load dist/stash.js as ESM — where require is undefined — and the
// bundle would throw on the very first line. This file makes the nearest package.json
// say otherwise for anything under dist/.
await writeFile(resolve(dirname(outfile), 'package.json'), '{"type":"commonjs"}\n');

console.log(`built ${outfile}`);

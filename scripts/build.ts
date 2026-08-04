import { chmod, mkdir } from 'node:fs/promises';
import { dirname, resolve } from 'node:path';
import * as esbuild from 'esbuild';

const root = resolve(import.meta.dirname, '..');
const outfile = resolve(root, 'dist', 'stash.js');

await mkdir(dirname(outfile), { recursive: true });

const result = await esbuild.build({
  entryPoints: [resolve(root, 'index.ts')],
  bundle: true,
  platform: 'node',
  format: 'cjs',
  target: 'node22',
  // graphql ships CJS at `main` and ESM at `module`. esbuild defaults to `main`
  // for platform: 'node', and a CJS barrel cannot be tree-shaken, so preferring
  // `module` keeps the unused validation and execution engines out of the bundle.
  outfile,
  banner: { js: '#!/usr/bin/env node' },
  logLevel: 'warning',
});

// esbuild.build() only rejects on errors. The cjs output format means a stray
// import.meta anywhere in the bundled graph compiles to {} with a warning, so
// warnings have to fail the build explicitly or that breakage ships silently.
if (result.warnings.length > 0) {
  console.error(`build produced ${result.warnings.length} warning(s)`);
  process.exit(1);
}

await chmod(outfile, 0o755);

console.log(`built ${outfile}`);

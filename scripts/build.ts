import { chmod, mkdir } from 'node:fs/promises';
import { dirname, resolve } from 'node:path';
import * as esbuild from 'esbuild';

const root = resolve(import.meta.dirname, '..');
const outfile = resolve(root, 'dist', 'stash.js');

await mkdir(dirname(outfile), { recursive: true });

await esbuild.build({
  entryPoints: [resolve(root, 'index.ts')],
  bundle: true,
  platform: 'node',
  format: 'cjs',
  target: 'node22',
  outfile,
  banner: { js: '#!/usr/bin/env node' },
  logLevel: 'warning',
});

await chmod(outfile, 0o755);

console.log(`built ${outfile}`);

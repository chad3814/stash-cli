import { createWriteStream } from 'node:fs';
import { unlink } from 'node:fs/promises';
import { basename, isAbsolute, join, resolve } from 'node:path';
import { Readable } from 'node:stream';
import { pipeline } from 'node:stream/promises';

/**
 * Fetches `link` — resolved against `endpoint`'s origin, since stash returns a
 * server-relative path — and streams it into `directory`.
 *
 * The name is the link's basename, or `fallbackName` when that is empty or would escape
 * the directory. An existing file is never overwritten, and a transfer that fails partway
 * is deleted rather than left looking like a complete database.
 */
export async function downloadTo(
  link: string,
  endpoint: string,
  directory: string,
  fallbackName: string,
): Promise<string> {
  const url = new URL(link, endpoint);
  const candidate = basename(url.pathname);
  const name = candidate === '' || candidate === '.' || candidate === '..' || isAbsolute(candidate)
    ? fallbackName
    : candidate;
  const target = resolve(join(directory, name));

  if (!target.startsWith(resolve(directory))) {
    throw new Error(`refusing to write outside ${directory}: ${name}`);
  }

  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`downloading ${url.href} failed with status ${response.status.toString(10)}`);
  }
  if (response.body === null) {
    throw new Error(`downloading ${url.href} returned no body`);
  }

  // 'wx' fails when the target exists rather than truncating it, so a second backup
  // cannot silently destroy the first.
  const sink = createWriteStream(target, { flags: 'wx' });
  try {
    await pipeline(Readable.fromWeb(response.body), sink);
  } catch (error: unknown) {
    const alreadyExists = error instanceof Error && 'code' in error && error.code === 'EEXIST';
    if (!alreadyExists) {
      // Remove the partial file before rethrowing. A truncated database that looks
      // complete is worse than no file at all. 'wx' rejecting with EEXIST means the
      // open never succeeded, so there is nothing of ours to clean up — unlinking here
      // would delete the pre-existing file the flag was protecting.
      await unlink(target).catch(() => undefined);
    }
    if (alreadyExists) {
      throw new Error(`${target} already exists; refusing to overwrite it`, { cause: error });
    }
    throw error;
  }
  return target;
}

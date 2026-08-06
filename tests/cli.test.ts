import assert from 'node:assert/strict';
import { mkdtemp, readdir, readFile, writeFile } from 'node:fs/promises';
import { createServer, type IncomingMessage, type ServerResponse } from 'node:http';
import type { AddressInfo } from 'node:net';
import { tmpdir } from 'node:os';
import { join, resolve } from 'node:path';
import test from 'node:test';
import { run, type RunResult } from './helpers/run.js';

const root = resolve(import.meta.dirname, '..');
// The download tests spawn the CLI with its cwd set to a scratch directory outside the
// project tree (so the file lands next to the assertions), which means node's ESM
// resolver — which walks up from cwd looking for node_modules — never reaches this
// project's node_modules and a bare `--import tsx` fails with ERR_MODULE_NOT_FOUND.
// Importing the loader by absolute path sidesteps that resolution walk entirely.
const tsxLoader = resolve(root, 'node_modules', 'tsx', 'dist', 'loader.mjs');

type Stub = { url: string; requests: string[]; close: () => Promise<void> };

/**
 * A handler either returns a GraphQL envelope, which the stub serialises with a 200, or
 * takes control of the status and the exact bytes. The second form exists for
 * authentication and malformed-body tests; the first keeps every older caller unchanged.
 */
type StubReply = { data: Record<string, unknown> } | { status?: number; raw: string };

async function startStub(
  respond: (body: string, req: IncomingMessage) => StubReply,
): Promise<Stub> {
  const requests: string[] = [];
  const server = createServer((req: IncomingMessage, res: ServerResponse) => {
    let body = '';
    req.setEncoding('utf8');
    req.on('data', (chunk: string) => {
      body += chunk;
    });
    req.on('end', () => {
      requests.push(body);
      const reply = respond(body, req);
      if ('raw' in reply) {
        res.writeHead(reply.status ?? 200, { 'content-type': 'application/json' });
        res.end(reply.raw);
        return;
      }
      res.writeHead(200, { 'content-type': 'application/json' });
      res.end(JSON.stringify(reply));
    });
  });
  await new Promise<void>((ready) => {
    server.listen(0, '127.0.0.1', ready);
  });
  const address: AddressInfo | string | null = server.address();
  if (address === null || typeof address === 'string') {
    throw new Error('stub server did not bind to a tcp port');
  }
  return {
    url: `http://127.0.0.1:${address.port.toString(10)}/graphql`,
    requests,
    close: () =>
      new Promise<void>((closed, failed) => {
        server.close((error) => {
          if (error === undefined || error === null) {
            closed();
            return;
          }
          failed(error);
        });
      }),
  };
}

// Port 1 refuses connections deterministically, so any test that forgets to stub (or
// override) STASH_ENDPOINT still cannot reach a real server — regardless of what the
// developer's own environment or live tunnel happens to have set. Mirrors the same
// guard in tests/bundle.test.ts.
const DEAD_ENDPOINT = 'http://127.0.0.1:1/graphql';

function runCli(args: string[], env: Record<string, string | undefined> = {}): Promise<RunResult> {
  return run(process.execPath, ['--import', 'tsx', 'index.ts', ...args], root, {
    ...process.env,
    STASH_ENDPOINT: DEAD_ENDPOINT,
    ...env,
  });
}

const IDLE = () => ({ data: { jobQueue: null } });

test('bare invocation prints the queue', async () => {
  const stub = await startStub(IDLE);
  try {
    const result = await runCli([], { STASH_ENDPOINT: stub.url });
    assert.equal(result.code, 0, result.stderr);
    assert.match(result.stdout, /Task Queue is empty/);
    assert.match(stub.requests[0] ?? '', /jobQueue/);
  } finally {
    await stub.close();
  }
});

test('each command dispatches to its own mutation', async () => {
  const expected: [string, string][] = [
    ['sig', 'metadataScan'],
    ['scan', 'metadataScan'],
    ['identify', 'metadataIdentify'],
    ['generate', 'metadataGenerate'],
    ['clean-generated', 'metadataCleanGenerated'],
    ['optimize-db', 'optimiseDatabase'],
    ['export', 'metadataExport'],
  ];
  for (const [command, mutation] of expected) {
    const stub = await startStub((body) =>
      body.includes('jobQueue')
        ? { data: { jobQueue: null } }
        : {
            data: {
              metadataScan: 'j', metadataIdentify: 'j', metadataGenerate: 'j',
              metadataCleanGenerated: 'j', optimiseDatabase: 'j', metadataExport: 'j',
            },
          },
    );
    try {
      const result = await runCli([command], { STASH_ENDPOINT: stub.url });
      assert.equal(result.code, 0, `${command} failed:\n${result.stderr}`);
      assert.match(stub.requests[0] ?? '', new RegExp(mutation), `${command} posted the wrong mutation`);
    } finally {
      await stub.close();
    }
  }
});

test('an unknown command exits 1 and lists the valid ones', async () => {
  const result = await runCli(['bogus']);
  assert.equal(result.code, 1);
  assert.match(result.stderr, /unknown command 'bogus'/);
  assert.match(result.stderr, /sig/);
  assert.doesNotMatch(result.stderr, /at Object\./, 'a usage error should not print a stack trace');
});

test('a misspelled flag exits 1 rather than being ignored', async () => {
  // The whole reason this work exists: `stash --resacn` used to print the queue and exit 0.
  const result = await runCli(['--resacn']);
  assert.equal(result.code, 1);
  assert.match(result.stderr, /--resacn/);
});

test('an option belonging to another command is rejected', async () => {
  const result = await runCli(['scan', '--download']);
  assert.equal(result.code, 1);
  assert.match(result.stderr, /download/);
});

test('two commands in one invocation are rejected', async () => {
  const result = await runCli(['scan', 'generate']);
  assert.equal(result.code, 1);
  assert.match(result.stderr, /one command/i);
});

test('--endpoint beats STASH_ENDPOINT', async () => {
  const chosen = await startStub(IDLE);
  const ignored = await startStub(IDLE);
  try {
    const result = await runCli(['--endpoint', chosen.url], { STASH_ENDPOINT: ignored.url });
    assert.equal(result.code, 0, result.stderr);
    assert.equal(chosen.requests.length, 1, 'the flag endpoint should have been used');
    assert.equal(ignored.requests.length, 0, 'the env endpoint should have been ignored');
  } finally {
    await chosen.close();
    await ignored.close();
  }
});

test('--endpoint without a value exits 1', async () => {
  const result = await runCli(['--endpoint']);
  assert.equal(result.code, 1);
  assert.match(result.stderr, /endpoint/);
});

test('--help lists every command and exits 0', async () => {
  const result = await runCli(['--help']);
  assert.equal(result.code, 0, result.stderr);
  for (const command of ['sig', 'scan', 'identify', 'generate', 'clean-generated', 'optimize-db', 'export', 'backup', 'anonymize']) {
    assert.ok(result.stdout.includes(command), `--help should mention ${command}:\n${result.stdout}`);
  }
  assert.match(result.stdout, /STASH_ENDPOINT/);
});

test('-h works and a command-level --help does too', async () => {
  const short = await runCli(['-h']);
  assert.equal(short.code, 0, short.stderr);
  const scoped = await runCli(['backup', '--help']);
  assert.equal(scoped.code, 0, scoped.stderr);
  assert.match(scoped.stdout, /backup/);
  // Not just that "backup" appears in the command list — its own options must be
  // documented too, so adding an option to COMMANDS can't silently drift from --help.
  assert.match(scoped.stdout, /--download/);
  assert.match(scoped.stdout, /--include-blobs/);
  assert.match(scoped.stdout, /anonymize.*--download/);
});

test('--version prints a version and exits 0', async () => {
  const result = await runCli(['--version']);
  assert.equal(result.code, 0, result.stderr);
  assert.match(result.stdout.trim(), /^\d+\.\d+\.\d+$|^dev$/);
});

test('--help and --version make no network request', async () => {
  const stub = await startStub(IDLE);
  try {
    await runCli(['--help'], { STASH_ENDPOINT: stub.url });
    await runCli(['--version'], { STASH_ENDPOINT: stub.url });
    // A command-level --help (e.g. `backup --help`) must short-circuit before dispatch
    // too — this is the case that would otherwise run a real backupDatabase mutation.
    await runCli(['backup', '--help'], { STASH_ENDPOINT: stub.url });
    assert.equal(stub.requests.length, 0, 'informational flags should not contact the server');
  } finally {
    await stub.close();
  }
});

test('backup --download writes the file named after the link', async () => {
  const directory = await mkdtemp(join(tmpdir(), 'stash-download-'));
  const server = createServer((req, res) => {
    if (req.url === '/graphql') {
      let body = '';
      req.on('data', (c: Buffer) => { body += c.toString('utf8'); });
      req.on('end', () => {
        res.writeHead(200, { 'content-type': 'application/json' });
        res.end(JSON.stringify({ data: { backupDatabase: '/downloadBackup/stash-go.sqlite' } }));
      });
      return;
    }
    res.writeHead(200, { 'content-type': 'application/octet-stream' });
    res.end('SQLITE-BYTES');
  });
  await new Promise<void>((ready) => { server.listen(0, '127.0.0.1', ready); });
  const address = server.address();
  if (address === null || typeof address === 'string') { throw new Error('no port'); }
  const endpoint = `http://127.0.0.1:${address.port.toString(10)}/graphql`;
  try {
    const result = await run(process.execPath, ['--import', tsxLoader, resolve(root, 'index.ts'), 'backup', '--download'], directory, { ...process.env, STASH_ENDPOINT: endpoint });
    assert.equal(result.code, 0, result.stderr);
    assert.equal(await readFile(join(directory, 'stash-go.sqlite'), 'utf8'), 'SQLITE-BYTES');
    assert.match(result.stdout, /stash-go\.sqlite/);
  } finally {
    await new Promise<void>((closed) => { server.close(() => { closed(); }); });
  }
});

test('backup --download refuses to overwrite an existing file', async () => {
  const directory = await mkdtemp(join(tmpdir(), 'stash-download-'));
  await writeFile(join(directory, 'stash-go.sqlite'), 'ORIGINAL', 'utf8');
  const server = createServer((req, res) => {
    if (req.url === '/graphql') {
      req.on('data', () => {});
      req.on('end', () => {
        res.writeHead(200, { 'content-type': 'application/json' });
        res.end(JSON.stringify({ data: { backupDatabase: '/downloadBackup/stash-go.sqlite' } }));
      });
      return;
    }
    res.writeHead(200);
    res.end('REPLACEMENT');
  });
  await new Promise<void>((ready) => { server.listen(0, '127.0.0.1', ready); });
  const address = server.address();
  if (address === null || typeof address === 'string') { throw new Error('no port'); }
  try {
    const result = await run(process.execPath, ['--import', tsxLoader, resolve(root, 'index.ts'), 'backup', '--download'], directory, { ...process.env, STASH_ENDPOINT: `http://127.0.0.1:${address.port.toString(10)}/graphql` });
    assert.equal(result.code, 1);
    assert.match(result.stderr, /exists/);
    // Refusing to overwrite is an expected outcome, not a crash. Before OperationalError
    // existed this printed the right sentence buried in a stack dump and a [cause] block.
    assert.doesNotMatch(result.stderr, /at Object\.|at async|\[cause\]/, `expected a plain message, got:\n${result.stderr}`);
    // The point of refusing: a second backup must not destroy the first.
    assert.equal(await readFile(join(directory, 'stash-go.sqlite'), 'utf8'), 'ORIGINAL');
  } finally {
    await new Promise<void>((closed) => { server.close(() => { closed(); }); });
  }
});

test('backup without --download reports server-side completion and writes nothing', async () => {
  const directory = await mkdtemp(join(tmpdir(), 'stash-download-'));
  const server = createServer((req, res) => {
    req.on('data', () => {});
    req.on('end', () => {
      res.writeHead(200, { 'content-type': 'application/json' });
      res.end(JSON.stringify({ data: { backupDatabase: null } }));
    });
  });
  await new Promise<void>((ready) => { server.listen(0, '127.0.0.1', ready); });
  const address = server.address();
  if (address === null || typeof address === 'string') { throw new Error('no port'); }
  try {
    const result = await run(process.execPath, ['--import', tsxLoader, resolve(root, 'index.ts'), 'backup'], directory, { ...process.env, STASH_ENDPOINT: `http://127.0.0.1:${address.port.toString(10)}/graphql` });
    assert.equal(result.code, 0, result.stderr);
    assert.match(result.stdout, /server-side/);
    assert.deepEqual(await readdir(directory), []);
  } finally {
    await new Promise<void>((closed) => { server.close(() => { closed(); }); });
  }
});

test('backup --download exits 1 and writes nothing when the server returns no link', async () => {
  // A user who asked for a local file must not be told "complete" and get exit 0 with
  // no file and no diagnostic — the same shape of bug --rescan used to have on failure.
  const directory = await mkdtemp(join(tmpdir(), 'stash-download-'));
  const server = createServer((req, res) => {
    req.on('data', () => {});
    req.on('end', () => {
      res.writeHead(200, { 'content-type': 'application/json' });
      res.end(JSON.stringify({ data: { backupDatabase: null } }));
    });
  });
  await new Promise<void>((ready) => { server.listen(0, '127.0.0.1', ready); });
  const address = server.address();
  if (address === null || typeof address === 'string') { throw new Error('no port'); }
  try {
    const result = await run(process.execPath, ['--import', tsxLoader, resolve(root, 'index.ts'), 'backup', '--download'], directory, { ...process.env, STASH_ENDPOINT: `http://127.0.0.1:${address.port.toString(10)}/graphql` });
    assert.equal(result.code, 1);
    assert.match(result.stderr, /no download link/);
    assert.doesNotMatch(result.stderr, /at Object\.|at async/, `expected a plain message, got:\n${result.stderr}`);
    assert.deepEqual(await readdir(directory), []);
  } finally {
    await new Promise<void>((closed) => { server.close(() => { closed(); }); });
  }
});

test('a download that fails mid-transfer leaves no partial file', async () => {
  const directory = await mkdtemp(join(tmpdir(), 'stash-download-'));
  const server = createServer((req, res) => {
    if (req.url === '/graphql') {
      req.on('data', () => {});
      req.on('end', () => {
        res.writeHead(200, { 'content-type': 'application/json' });
        res.end(JSON.stringify({ data: { backupDatabase: '/downloadBackup/stash-go.sqlite' } }));
      });
      return;
    }
    // Announce more bytes than are sent, then hang up: the client sees a truncated body.
    // The destroy is deferred a tick so the client actually receives the response headers
    // and the partial body first — destroying in the same tick as the write races the
    // client's connection setup and can abort before fetch() even resolves, which would
    // exit 1 without ever creating a file and so would not exercise the cleanup path
    // this test exists to cover.
    res.writeHead(200, { 'content-length': '999999' });
    res.write('PARTIAL');
    setImmediate(() => { res.destroy(); });
  });
  await new Promise<void>((ready) => { server.listen(0, '127.0.0.1', ready); });
  const address = server.address();
  if (address === null || typeof address === 'string') { throw new Error('no port'); }
  try {
    const result = await run(process.execPath, ['--import', tsxLoader, resolve(root, 'index.ts'), 'backup', '--download'], directory, { ...process.env, STASH_ENDPOINT: `http://127.0.0.1:${address.port.toString(10)}/graphql` });
    assert.equal(result.code, 1);
    // A truncated database that looks like a complete one is worse than no file.
    assert.deepEqual(await readdir(directory), []);
    // Says what was attempted and that cleanup happened, instead of the bare
    // `TypeError: terminated` undici throws, and keeps the underlying reason as a cause.
    assert.match(result.stderr, /failed partway; the incomplete file was removed/);
    assert.match(result.stderr, /^ {2}caused by: /m, `expected a cause line, got:\n${result.stderr}`);
    assert.doesNotMatch(result.stderr, /at Object\.|at async/, `expected a plain message, got:\n${result.stderr}`);
  } finally {
    await new Promise<void>((closed) => { server.close(() => { closed(); }); });
  }
});

test('a graphql request carries the ApiKey header when STASH_API_KEY is set', async () => {
  let sentName: string | undefined;
  let sentValue: string | undefined;
  const stub = await startStub((_body, req) => {
    // req.headers lowercases every name, so it cannot distinguish ApiKey from APIKEY.
    // rawHeaders preserves the name as sent, which is the whole point of this test.
    const index = req.rawHeaders.findIndex((entry) => entry.toLowerCase() === 'apikey');
    if (index >= 0) {
      sentName = req.rawHeaders[index];
      sentValue = req.rawHeaders[index + 1];
    }
    return { data: { jobQueue: [] } };
  });
  try {
    const result = await runCli([], { STASH_ENDPOINT: stub.url, STASH_API_KEY: 'test-key-value' });
    assert.equal(result.code, 0, result.stderr);
    assert.equal(sentName, 'ApiKey', 'the header name must match stash exactly, including casing');
    assert.equal(sentValue, 'test-key-value');
  } finally {
    await stub.close();
  }
});

test('no ApiKey header is sent when STASH_API_KEY is unset', async () => {
  let present = false;
  const stub = await startStub((_body, req) => {
    present = req.rawHeaders.some((entry) => entry.toLowerCase() === 'apikey');
    return { data: { jobQueue: [] } };
  });
  try {
    // STASH_API_KEY: '' overrides any value in the developer's own shell, so this test
    // asserts the anonymous path regardless of the machine it runs on.
    const result = await runCli([], { STASH_ENDPOINT: stub.url, STASH_API_KEY: '' });
    assert.equal(result.code, 0, result.stderr);
    assert.equal(present, false, 'an unauthenticated request must look exactly as it did before');
  } finally {
    await stub.close();
  }
});

test('a 401 with no key tells the user to set STASH_API_KEY', async () => {
  const stub = await startStub(() => ({ status: 401, raw: 'Unauthorized' }));
  try {
    const result = await runCli([], { STASH_ENDPOINT: stub.url, STASH_API_KEY: '' });
    assert.equal(result.code, 1);
    assert.match(result.stderr, /requires authentication/);
    assert.match(result.stderr, /STASH_API_KEY/);
    assert.doesNotMatch(result.stderr, /at Object\.|at async/, `expected a plain message, got:\n${result.stderr}`);
  } finally {
    await stub.close();
  }
});

test('a 401 with a key says the key was rejected', async () => {
  const stub = await startStub(() => ({ status: 401, raw: 'Unauthorized' }));
  try {
    const result = await runCli([], { STASH_ENDPOINT: stub.url, STASH_API_KEY: 'test-key-value' });
    assert.equal(result.code, 1);
    assert.match(result.stderr, /rejected the API key/);
    assert.doesNotMatch(result.stderr, /requires authentication/);
  } finally {
    await stub.close();
  }
});

test('a download carries the ApiKey header', async () => {
  const directory = await mkdtemp(join(tmpdir(), 'stash-download-'));
  let downloadSawKey = false;
  const server = createServer((req, res) => {
    if (req.url === '/graphql') {
      req.on('data', () => {});
      req.on('end', () => {
        res.writeHead(200, { 'content-type': 'application/json' });
        res.end(JSON.stringify({ data: { backupDatabase: '/downloadBackup/stash-go.sqlite' } }));
      });
      return;
    }
    // The download is a second request to the same origin. A server that authenticates
    // the mutation authenticates this too, so refuse it without the header.
    downloadSawKey = req.rawHeaders.some((entry) => entry.toLowerCase() === 'apikey');
    if (!downloadSawKey) {
      res.writeHead(401);
      res.end('Unauthorized');
      return;
    }
    res.writeHead(200);
    res.end('BACKUP');
  });
  await new Promise<void>((ready) => { server.listen(0, '127.0.0.1', ready); });
  const address = server.address();
  if (address === null || typeof address === 'string') { throw new Error('no port'); }
  try {
    const result = await run(process.execPath, ['--import', tsxLoader, resolve(root, 'index.ts'), 'backup', '--download'], directory, { ...process.env, STASH_ENDPOINT: `http://127.0.0.1:${address.port.toString(10)}/graphql`, STASH_API_KEY: 'test-key-value' });
    assert.equal(result.code, 0, result.stderr);
    assert.ok(downloadSawKey, 'the download request must carry the key, not just the mutation');
    assert.equal(await readFile(join(directory, 'stash-go.sqlite'), 'utf8'), 'BACKUP');
  } finally {
    await new Promise<void>((closed) => { server.close(() => { closed(); }); });
  }
});

test('the api key never reaches stdout or stderr, on any path', async () => {
  const SECRET = 'zzz-unmistakable-key-value-9f3a-zzz';
  // Each case is a different way the CLI can fail while holding the key. A server that
  // echoes the key back is included deliberately: the CLI interpolates response bodies
  // into its error messages, so this is the most plausible route to a disclosure.
  const cases: { name: string; handler: () => StubReply }[] = [
    { name: '401', handler: () => ({ status: 401, raw: 'Unauthorized' }) },
    { name: '500 with the key echoed back', handler: () => ({ status: 500, raw: `rejected key ${SECRET}` }) },
    { name: 'non-JSON body', handler: () => ({ raw: '<html>login</html>' }) },
    { name: 'graphql errors array', handler: () => ({ raw: JSON.stringify({ errors: [{ message: 'nope' }] }) }) },
  ];

  for (const { name, handler } of cases) {
    const stub = await startStub(handler);
    try {
      const result = await runCli([], { STASH_ENDPOINT: stub.url, STASH_API_KEY: SECRET });
      assert.equal(result.code, 1, `${name}: expected a failure`);
      assert.doesNotMatch(result.stdout, new RegExp(SECRET), `${name}: the key leaked to stdout`);
      assert.doesNotMatch(result.stderr, new RegExp(SECRET), `${name}: the key leaked to stderr`);
    } finally {
      await stub.close();
    }
  }
});

test('a download rejected for auth explains it and writes nothing', async () => {
  const directory = await mkdtemp(join(tmpdir(), 'stash-download-'));
  const server = createServer((req, res) => {
    if (req.url === '/graphql') {
      req.on('data', () => {});
      req.on('end', () => {
        res.writeHead(200, { 'content-type': 'application/json' });
        res.end(JSON.stringify({ data: { backupDatabase: '/downloadBackup/stash-go.sqlite' } }));
      });
      return;
    }
    res.writeHead(401);
    res.end('Unauthorized');
  });
  await new Promise<void>((ready) => { server.listen(0, '127.0.0.1', ready); });
  const address = server.address();
  if (address === null || typeof address === 'string') { throw new Error('no port'); }
  try {
    const result = await run(process.execPath, ['--import', tsxLoader, resolve(root, 'index.ts'), 'backup', '--download'], directory, { ...process.env, STASH_ENDPOINT: `http://127.0.0.1:${address.port.toString(10)}/graphql`, STASH_API_KEY: 'test-key-value' });
    assert.equal(result.code, 1);
    assert.match(result.stderr, /rejected the API key/);
    // No half-written file from a refused download.
    assert.deepEqual(await readdir(directory), []);
  } finally {
    await new Promise<void>((closed) => { server.close(() => { closed(); }); });
  }
});

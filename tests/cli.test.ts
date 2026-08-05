import assert from 'node:assert/strict';
import { createServer, type IncomingMessage, type ServerResponse } from 'node:http';
import type { AddressInfo } from 'node:net';
import { resolve } from 'node:path';
import test from 'node:test';
import { run, type RunResult } from './helpers/run.js';

const root = resolve(import.meta.dirname, '..');

type Stub = { url: string; requests: string[]; close: () => Promise<void> };

async function startStub(respond: (body: string) => { data: Record<string, unknown> }): Promise<Stub> {
  const requests: string[] = [];
  const server = createServer((req: IncomingMessage, res: ServerResponse) => {
    let body = '';
    req.setEncoding('utf8');
    req.on('data', (chunk: string) => {
      body += chunk;
    });
    req.on('end', () => {
      requests.push(body);
      res.writeHead(200, { 'content-type': 'application/json' });
      res.end(JSON.stringify(respond(body)));
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

function runCli(args: string[], env: Record<string, string | undefined> = {}): Promise<RunResult> {
  return run(process.execPath, ['--import', 'tsx', 'index.ts', ...args], root, {
    ...process.env,
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
    assert.equal(stub.requests.length, 0, 'informational flags should not contact the server');
  } finally {
    await stub.close();
  }
});

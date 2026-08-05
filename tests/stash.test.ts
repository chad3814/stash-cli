import assert from 'node:assert/strict';
import { createServer, type IncomingMessage, type ServerResponse } from 'node:http';
import type { AddressInfo } from 'node:net';
import { resolve } from 'node:path';
import test from 'node:test';
import { run, type RunResult } from './helpers/run.js';
import {
  anonymize,
  backup,
  cleanGenerated,
  exportMetadata,
  generate,
  identify,
  optimizeDb,
  scan,
  GENERATE_INPUT,
  IDENTIFY_INPUT,
  SCAN_INPUT,
} from '../src/stash.js';

const root = resolve(import.meta.dirname, '..');

type GraphqlEnvelope = { data: Record<string, unknown> };

type Stub = {
  url: string;
  requests: string[];
  close: () => Promise<void>;
};

/**
 * Starts a stub graphql server on an ephemeral port. `respond` receives the raw
 * request body so a test can answer a mutation and a query differently.
 */
async function startStub(respond: (body: string) => GraphqlEnvelope): Promise<Stub> {
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

// Running the source through tsx keeps these tests independent of dist/.
function runCli(args: string[], endpoint: string): Promise<RunResult> {
  return run(process.execPath, ['--import', 'tsx', 'index.ts', ...args], root, {
    ...process.env,
    STASH_ENDPOINT: endpoint,
  });
}

function isMutation(body: string): boolean {
  return body.includes('metadataScan');
}

type SentBody = {
  query: string;
  variables?: Record<string, unknown>;
};

/** Parses a captured request body to a declared shape rather than `any`. */
function sentBody(raw: string | undefined): SentBody {
  return JSON.parse(raw ?? '{}') as SentBody;
}

function findLine(stdout: string, label: string, matches: (line: string) => boolean): string {
  const line = stdout.split('\n').find(matches);
  if (line === undefined) {
    return assert.fail(`no ${label} line in stdout:\n${stdout}`);
  }
  return line;
}

const LONG_SUBTASK = 'x'.repeat(80);

function jobQueue(): Record<string, unknown>[] {
  return [
    {
      id: '1',
      // A minute of elapsed time at half progress yields a roughly one minute
      // eta. The exact seconds depend on subprocess startup, so tests match a
      // pattern rather than a literal.
      progress: 0.5,
      status: 'RUNNING',
      description: 'Scanning',
      subTasks: [LONG_SUBTASK],
      error: null,
      endTime: null,
      addTime: '2026-08-04T11:59:00Z',
      startTime: new Date(Date.now() - 60_000).toISOString(),
    },
    {
      id: '2',
      progress: 0,
      status: 'READY',
      description: 'Generating',
      subTasks: [],
      error: null,
      endTime: null,
      addTime: '2026-08-04T11:59:30Z',
      startTime: null,
    },
  ];
}

test('prints the job queue and exits zero', async () => {
  const stub = await startStub(() => ({ data: { jobQueue: jobQueue() } }));
  try {
    const result = await runCli([], stub.url);

    assert.equal(result.code, 0, `expected a clean exit, stderr:\n${result.stderr}`);
    assert.equal(stub.requests.length, 1);
    assert.match(stub.requests[0] ?? '', /jobQueue/);

    assert.match(result.stdout, /🏃/u, 'missing the running job emoji');
    assert.match(result.stdout, /⏳/u, 'missing the queued job emoji');
    assert.ok(result.stdout.includes('Scanning'), 'missing the running job description');
    assert.ok(result.stdout.includes('Generating'), 'missing the queued job description');

    const running = findLine(result.stdout, 'running progress', (line) => line.includes('50.00%'));
    assert.ok(running.includes('█'), `progress line has no filled bar: ${running}`);
    assert.ok(running.includes('░'), `progress line has no empty bar: ${running}`);
    assert.match(running, /ETA: \d+:\d{2}/, `expected an eta on the running job: ${running}`);

    const queued = findLine(
      result.stdout,
      'zero progress',
      (line) => line.includes('0.00%') && !line.includes('50.00%'),
    );
    assert.doesNotMatch(queued, /ETA/, `a job at zero progress should have no eta: ${queued}`);

    assert.ok(
      result.stdout.includes(`   ${'x'.repeat(54)}...`),
      `expected the long subtask truncated and indented:\n${result.stdout}`,
    );
    assert.ok(!result.stdout.includes(LONG_SUBTASK), 'subtask was printed untruncated');
  } finally {
    await stub.close();
  }
});

// stashdb answers with jobQueue: null rather than [] when nothing is queued, and
// iterating that threw "is not iterable" and exited 1 on an idle server. An empty
// array reports the same way rather than printing nothing at all.
const emptyQueues: { label: string; value: null | Record<string, unknown>[] }[] = [
  { label: 'null', value: null },
  { label: 'an empty array', value: [] },
];

for (const { label, value } of emptyQueues) {
  test(`reports an empty queue when the server returns ${label}`, async () => {
    const stub = await startStub(() => ({ data: { jobQueue: value } }));
    try {
      const result = await runCli([], stub.url);

      assert.equal(result.code, 0, `an idle queue is not an error, stderr:\n${result.stderr}`);
      assert.match(result.stdout, /Task Queue is empty/);
      assert.doesNotMatch(result.stdout, /[█░]/u, 'nothing should render a progress bar');
      assert.equal(result.stderr, '', `expected no diagnostics, got:\n${result.stderr}`);
    } finally {
      await stub.close();
    }
  });
}

test('renders a job whose subTasks come back null', async () => {
  // Job.subTasks is nullable in the schema and stash sends null for absent
  // collections, which threw "Cannot read properties of null (reading 'map')".
  const stub = await startStub(() => ({
    data: {
      jobQueue: [
        {
          id: '1',
          progress: 0.25,
          status: 'RUNNING',
          description: 'Scanning',
          subTasks: null,
          error: null,
          endTime: null,
          addTime: '2026-08-04T11:59:00Z',
          startTime: new Date(Date.now() - 60_000).toISOString(),
        },
      ],
    },
  }));
  try {
    const result = await runCli([], stub.url);

    assert.equal(result.code, 0, `null subTasks is not an error, stderr:\n${result.stderr}`);
    assert.ok(result.stdout.includes('Scanning'), `expected the job to render:\n${result.stdout}`);
    assert.match(result.stdout, /25\.00%/);
    assert.doesNotMatch(result.stderr, /Cannot read properties/);
  } finally {
    await stub.close();
  }
});

test('exits nonzero when a rescan mutation comes back incomplete', async () => {
  const stub = await startStub((body) => {
    if (isMutation(body)) {
      // metadataGenerate is absent, which is how a rejected rescan presents.
      return { data: { metadataScan: 'scan-1', metadataIdentify: 'identify-1' } };
    }
    return { data: { jobQueue: jobQueue() } };
  });
  try {
    const result = await runCli(['sig'], stub.url);

    assert.equal(result.code, 1, `expected exit 1, got ${String(result.code)}`);
    assert.match(result.stderr, /sig failed/, `expected a diagnostic, got:\n${result.stderr}`);
    assert.match(result.stderr, /metadataScan/, 'diagnostic should carry the response payload');
    // The failure short-circuits before the follow-up status query.
    assert.equal(stub.requests.length, 1);
  } finally {
    await stub.close();
  }
});

test('sig sends its inputs as graphql variables, not inline literals', async () => {
  const stub = await startStub((body) => {
    if (isMutation(body)) {
      return {
        data: { metadataScan: 'scan-1', metadataIdentify: 'identify-1', metadataGenerate: 'generate-1' },
      };
    }
    return { data: { jobQueue: jobQueue() } };
  });
  try {
    const result = await runCli(['sig'], stub.url);
    assert.equal(result.code, 0, `expected a clean exit, stderr:\n${result.stderr}`);

    const sent = sentBody(stub.requests[0]);
    assert.ok(sent.variables, `the mutation should carry variables:\n${stub.requests[0] ?? ''}`);
    // deepEqual against the constants, not a spot-check: this asserts each variable
    // arrives unmangled, and tsc separately checks the constants' field names against
    // the generated schema.
    assert.deepEqual(sent.variables['scan'], SCAN_INPUT);
    assert.deepEqual(sent.variables['identify'], IDENTIFY_INPUT);
    assert.deepEqual(sent.variables['generate'], GENERATE_INPUT);
    // The document declares variables and no longer embeds the input object.
    assert.match(sent.query, /mutation\(\$scan: ScanMetadataInput!/);
    assert.doesNotMatch(sent.query, /scanGenerateCovers/);
  } finally {
    await stub.close();
  }
});

test('exits zero when a rescan succeeds and prints the resulting queue', async () => {
  const stub = await startStub((body) => {
    if (isMutation(body)) {
      return {
        data: {
          metadataScan: 'scan-1',
          metadataIdentify: 'identify-1',
          metadataGenerate: 'generate-1',
        },
      };
    }
    return { data: { jobQueue: jobQueue() } };
  });
  try {
    const result = await runCli(['sig'], stub.url);

    assert.equal(result.code, 0, `expected a clean exit, stderr:\n${result.stderr}`);
    assert.equal(stub.requests.length, 2, 'rescan should be followed by a status query');
    assert.match(stub.requests[0] ?? '', /metadataScan/);
    assert.match(stub.requests[1] ?? '', /jobQueue/);
    assert.ok(result.stdout.includes('Scanning'), `expected the queue to print:\n${result.stdout}`);
  } finally {
    await stub.close();
  }
});

test('each job operation posts its own mutation and then the status query', async () => {
  const operations: { name: string; run: (endpoint: string) => Promise<void>; mutation: string }[] = [
    { name: 'scan', run: scan, mutation: 'metadataScan' },
    { name: 'identify', run: identify, mutation: 'metadataIdentify' },
    { name: 'generate', run: generate, mutation: 'metadataGenerate' },
    { name: 'cleanGenerated', run: cleanGenerated, mutation: 'metadataCleanGenerated' },
    { name: 'optimizeDb', run: optimizeDb, mutation: 'optimiseDatabase' },
    { name: 'exportMetadata', run: exportMetadata, mutation: 'metadataExport' },
  ];

  for (const operation of operations) {
    const stub = await startStub((body) => {
      if (body.includes(operation.mutation)) {
        return { data: { [operation.mutation]: 'job-1' } };
      }
      return { data: { jobQueue: null } };
    });
    try {
      await operation.run(stub.url);
      assert.equal(stub.requests.length, 2, `${operation.name} should post the mutation then the queue`);
      assert.match(stub.requests[0] ?? '', new RegExp(operation.mutation), `${operation.name} posted the wrong mutation`);
      assert.match(stub.requests[1] ?? '', /jobQueue/, `${operation.name} should print the queue afterwards`);
    } finally {
      await stub.close();
    }
  }
});

test('the argument-free operations send no variables', async () => {
  for (const [name, operation] of [['optimizeDb', optimizeDb], ['exportMetadata', exportMetadata]] as const) {
    const stub = await startStub((body) => {
      if (body.includes('jobQueue')) {
        return { data: { jobQueue: null } };
      }
      return { data: { optimiseDatabase: 'job-1', metadataExport: 'job-1' } };
    });
    try {
      await operation(stub.url);
      const sent = sentBody(stub.requests[0]);
      assert.equal(sent.variables, undefined, `${name} takes no input, so it should send no variables`);
    } finally {
      await stub.close();
    }
  }
});

test('cleanGenerated asks for every generated category and never a dry run', async () => {
  const stub = await startStub((body) =>
    body.includes('jobQueue')
      ? { data: { jobQueue: null } }
      : { data: { metadataCleanGenerated: 'job-1' } },
  );
  try {
    await cleanGenerated(stub.url);
    const sent = sentBody(stub.requests[0]);
    // deepEqual against the exact object is what proves dryRun is *absent* rather than
    // false: any extra key fails the comparison. The stash web UI exposes no dry run for
    // this operation, so sending the field either way would imply an opinion the CLI has
    // not been given.
    assert.deepEqual(sent.variables?.['input'], {
      blobFiles: true,
      imageThumbnails: true,
      markers: true,
      screenshots: true,
      sprites: true,
      transcodes: true,
    });
  } finally {
    await stub.close();
  }
});

test('backup returns the link the server gives and posts the download flag', async () => {
  const stub = await startStub(() => ({ data: { backupDatabase: '/downloadBackup?key=abc' } }));
  try {
    const link = await backup(stub.url, { download: true, includeBlobs: false });
    assert.equal(link, '/downloadBackup?key=abc');
    const sent = sentBody(stub.requests[0]);
    assert.deepEqual(sent.variables?.['input'], { download: true, includeBlobs: false });
    // Synchronous: no follow-up status query, because it never enters the job queue.
    assert.equal(stub.requests.length, 1);
  } finally {
    await stub.close();
  }
});

test('backup returns null when the server sends no link', async () => {
  const stub = await startStub(() => ({ data: { backupDatabase: null } }));
  try {
    assert.equal(await backup(stub.url, { download: false, includeBlobs: false }), null);
  } finally {
    await stub.close();
  }
});

test('anonymize returns the link and posts only the download flag', async () => {
  const stub = await startStub(() => ({ data: { anonymiseDatabase: '/downloadAnon?key=abc' } }));
  try {
    const link = await anonymize(stub.url, { download: true });
    assert.equal(link, '/downloadAnon?key=abc');
    const sent = sentBody(stub.requests[0]);
    assert.deepEqual(sent.variables?.['input'], { download: true });
    assert.equal(stub.requests.length, 1);
  } finally {
    await stub.close();
  }
});

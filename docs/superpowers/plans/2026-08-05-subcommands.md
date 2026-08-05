# Subcommands and Argument Parsing Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the single `--rescan` flag with a subcommand surface over the stash maintenance mutations, parsed with `node:util`'s `parseArgs` so unknown input fails instead of being silently ignored.

**Architecture:** `src/cli.ts` owns a command table — name, summary, per-command options, and handler in one place — and dispatches after a two-stage `parseArgs`. `src/stash.ts` gains one function per operation, each taking an endpoint. Mutation inputs move from literals inlined in document strings to GraphQL variables declared against the generated schema types, which makes a misspelled input field a compile error.

**Tech Stack:** TypeScript 7 (tsgo), `node:util` `parseArgs`, `node:test` via tsx, esbuild, oxlint. Zero runtime dependencies.

**Spec:** `docs/superpowers/specs/2026-08-04-subcommands-design.md`

## Global Constraints

- **Commits require Chad's explicit approval.** Stop at each commit step, show `git diff --stat`, and wait. Do not push.
- Commits are ssh-signed via a 1Password agent that re-prompts every 15 minutes; `git commit` may pause for device approval, and has intermittently failed with "communication with agent failed". If that happens, report it plainly — do not retry in a loop.
- Never use the `any` type. `unknown` only where TypeScript forces it, narrowed immediately.
- 2-space indentation; semicolons always.
- **Relative imports carry a `.js` extension though files on disk are `.ts`.** Type-only imports use `import type`.
- `noUncheckedIndexedAccess`, `noPropertyAccessFromIndexSignature`, `noUnusedLocals`, `strict`, `exactOptionalPropertyTypes` all enabled. `process.env` must be bracket-indexed.
- **`npm run lint` is `oxlint --deny-warnings`, so a warning fails the build.** Three rules have bitten on this project: `unicorn(no-array-sort)` on `.sort()` (use `.toSorted()`), `no-underscore-dangle` on a property access like `payload.__schema` (destructure with a rename), and warnings from the `suspicious` category. Expect the gate to be strict.
- Never modify `src/generated/schema.d.ts` or regenerate it. It is consumed, never edited.
- **Never send a destructive or side-effecting mutation to a real stash server**, including from a manual check. Every operation in this plan is exercised against the `node:http` stub only. `clean` is deliberately not implemented.
- `tests/bundle.test.ts` enforces a 15,000-byte ceiling on `dist/stash.js`. It is currently 4,896 bytes.
- Command names are American (`optimize-db`, `anonymize`) over British mutation names (`optimiseDatabase`, `anonymiseDatabase`). This is not a typo; note it where the mapping happens.

## File Structure

| File | Status | Responsibility |
|---|---|---|
| `src/graphql.ts` | modify | `request` gains an optional `variables` argument |
| `src/stash.ts` | modify | endpoint as a parameter; one function per operation; inputs as typed variables |
| `src/cli.ts` | create | `parseArgs`, the command table, dispatch, help and version text |
| `src/download.ts` | create | fetch a link to a local file: naming, collision refusal, partial cleanup |
| `index.ts` | modify | thin entry: call the CLI, wire `process.exit` |
| `scripts/build.ts` | modify | inject the version via esbuild `define`; delete a stale comment |
| `tests/graphql.test.ts` | modify | variables posted; body unchanged when omitted |
| `tests/stash.test.ts` | modify | per-operation wiring against the stub |
| `tests/cli.test.ts` | create | parsing, dispatch, rejection, help and version |
| `tests/bundle.test.ts` | modify | the built bundle's `--version` matches `package.json` |
| `README.md` | modify | document the command surface |

Task 1 is foundational and touches the module every command depends on. Task 2 converts the existing operation to the new style while keeping `--rescan` working, so the refactor is verified before any new surface is added. Task 3 adds the remaining operations. Task 4 replaces the flag with the subcommand surface. Task 5 adds `--download`.

---

### Task 1: `request` accepts GraphQL variables

**Files:**
- Modify: `src/graphql.ts`
- Modify: `tests/graphql.test.ts`

**Interfaces:**
- Consumes: nothing.
- Produces: `request<T>(endpoint: string, query: string, variables?: Record<string, unknown>): Promise<T>`. When `variables` is omitted the posted body is exactly `{"query":…}` as before; when given it is `{"query":…,"variables":{…}}`. Tasks 2, 3 and 5 call it with variables.

- [ ] **Step 1: Write the failing tests**

Append to `tests/graphql.test.ts`. The existing test `request sends only a query field, never an operation name` already asserts `Object.keys(...)` is exactly `['query']` — that is the backward-compatibility pin and **must keep passing unchanged**.

```ts
test('request posts variables alongside the query when given', async () => {
  const stub = await startStub({ body: JSON.stringify({ data: { ok: true } }) });
  try {
    await request(stub.url, 'mutation($input: ScanMetadataInput!) { metadataScan(input: $input) }', {
      input: { scanGenerateCovers: true },
    });

    const sent = stub.requests[0];
    assert.ok(sent, 'no request reached the server');
    assert.deepEqual(JSON.parse(sent.body), {
      query: 'mutation($input: ScanMetadataInput!) { metadataScan(input: $input) }',
      variables: { input: { scanGenerateCovers: true } },
    });
  } finally {
    await stub.close();
  }
});

```

Do **not** add a test asserting the body when variables are omitted. The pre-existing
`request sends only a query field, never an operation name` already asserts both
`Object.keys(...) === ['query']` and a full `deepEqual` of the body, so it is a strictly
stronger pin than any new test for that case could be — a second one could not fail
independently, and a test that cannot fail alone is noise.

```ts
test('request sends an empty variables object when explicitly given one', async () => {
  const stub = await startStub({ body: JSON.stringify({ data: { ok: true } }) });
  try {
    await request(stub.url, 'query { ok }', {});

    const sent = stub.requests[0];
    assert.ok(sent, 'no request reached the server');
    assert.deepEqual(JSON.parse(sent.body), { query: 'query { ok }', variables: {} });
  } finally {
    await stub.close();
  }
});
```

- [ ] **Step 2: Run the tests to verify they fail**

Run: `npm test`

Expected: FAIL — `request` takes two parameters, so the variables are dropped and the posted body has no `variables` key.

- [ ] **Step 3: Add the parameter**

In `src/graphql.ts`, change the signature and the body construction. Everything else in the function is untouched.

```ts
export async function request<T>(
  endpoint: string,
  query: string,
  variables?: Record<string, unknown>,
): Promise<T> {
  const response = await fetch(endpoint, {
    method: 'POST',
    headers: {
      'content-type': 'application/json',
      accept: ACCEPT,
    },
    // Omitting variables must post the exact body this client has always posted —
    // `{ query, variables: undefined }` would serialise the same, but building the
    // object conditionally states the guarantee instead of relying on it.
    body: JSON.stringify(variables === undefined ? { query } : { query, variables }),
  });
```

Update the doc comment above the function: it currently says "POSTs `query` to `endpoint`"; say that variables are sent only when supplied.

- [ ] **Step 4: Run the tests to verify they pass**

Run: `npm test`

Expected: PASS, including the pre-existing `only a query field` test.

- [ ] **Step 5: Verify**

Run: `npm run verify`

Expected: exit 0.

- [ ] **Step 6: Commit (ask Chad first)**

```bash
git add src/graphql.ts tests/graphql.test.ts
git commit -m "feat: let request send graphql variables"
```

---

### Task 2: Endpoint as a parameter, and `sig` through typed variables

Converts the one existing operation to the target style without changing the CLI. `--rescan` keeps working, so the refactor is proven before any new surface is built on it.

**Files:**
- Modify: `src/stash.ts`
- Modify: `index.ts`
- Modify: `tests/stash.test.ts`

**Interfaces:**
- Consumes: `request<T>(endpoint, query, variables?)` from Task 1.
- Produces: `src/stash.ts` exports `DEFAULT_ENDPOINT: string`, `resolveEndpoint(override?: string): string`, `getStatus(endpoint: string): Promise<void>`, and `sig(endpoint: string): Promise<void>`. It also exports the three input constants `SCAN_INPUT`, `IDENTIFY_INPUT`, `GENERATE_INPUT` so Task 3's single-operation commands reuse them rather than redeclaring them. `rescan` no longer exists.

- [ ] **Step 1: Update the failing tests**

In `tests/stash.test.ts`, three changes.

The rescan-failure test asserts `/Rescan failed/`. The function is now `sig`, so the message becomes `sig failed`:

```ts
    assert.match(result.stderr, /sig failed/, `expected a diagnostic, got:\n${result.stderr}`);
```

Add a typed parse helper near the top of the file, below the existing helpers. Every test
that inspects a posted body uses it — Task 3 reuses it too. `JSON.parse` returns `any`, so
without this every assertion path below it is unchecked, and a misspelled path compares
`undefined` to `undefined` and passes:

```ts
type SentBody = {
  query: string;
  variables?: Record<string, unknown>;
};

/** Parses a captured request body to a declared shape rather than `any`. */
function sentBody(raw: string | undefined): SentBody {
  return JSON.parse(raw ?? '{}') as SentBody;
}
```

Then add a test that the mutation travels as variables rather than inline literals. Note it
asserts each variable with `deepEqual` against the exported input constant rather than
poking at individual fields — `Record<string, unknown>` values cannot be dotted into, which
is what forces the stronger assertion. Import the three constants:

```ts
import { GENERATE_INPUT, IDENTIFY_INPUT, SCAN_INPUT } from '../src/stash.js';
```

```ts
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
    const result = await runCli(['--rescan'], stub.url);
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
```

`isMutation(body)` currently tests `body.includes('metadataScan')`, which still holds — the document names the mutation even with variables.

- [ ] **Step 2: Run the tests to verify they fail**

Run: `npm test`

Expected: FAIL — the new test finds no `variables` key, and the message test finds `Rescan failed`.

- [ ] **Step 3: Rewrite `src/stash.ts`**

Replace the endpoint constant, the mutation document, and the two functions. The query document and `getStatus`'s rendering are unchanged apart from taking an endpoint.

```ts
import type {
  GenerateMetadataInput,
  IdentifyMetadataInput,
  Job,
  Mutations,
  ScanMetadataInput,
} from './generated/schema.js';
import { gql, request } from './graphql.js';
import { renderJob } from './format.js';

export const DEFAULT_ENDPOINT = 'http://localhost:9999/graphql';

/** Precedence: an explicit override (the `--endpoint` flag), then the environment, then the default. */
export function resolveEndpoint(override?: string): string {
  return override ?? process.env['STASH_ENDPOINT'] ?? DEFAULT_ENDPOINT;
}
```

Keep `statusQuery` exactly as it is. Replace `scanMutation` with:

```ts
const sigDocument = gql`
mutation($scan: ScanMetadataInput!, $identify: IdentifyMetadataInput!, $generate: GenerateMetadataInput!) {
  metadataScan(input: $scan)
  metadataIdentify(input: $identify)
  metadataGenerate(input: $generate)
}
`;
```

Add the input constants. Every field name here is checked against the generated types, which is the point of the change:

```ts
export const SCAN_INPUT: ScanMetadataInput = {
  scanGenerateClipPreviews: true,
  scanGenerateCovers: true,
  scanGenerateImagePhashes: true,
  scanGenerateImagePreviews: true,
  scanGeneratePhashes: true,
  scanGeneratePreviews: true,
  scanGenerateSprites: true,
  scanGenerateThumbnails: true,
};

// `sources` is IdentifySourceInput[]. The old inline document wrote
// `sources: { source: { } }` and relied on GraphQL coercing a single value to a list;
// a typed value has to be an explicit one-element array. Same request, stated properly.
export const IDENTIFY_INPUT: IdentifyMetadataInput = { sources: [{ source: {} }] };

export const GENERATE_INPUT: GenerateMetadataInput = {
  covers: true,
  imagePreviews: true,
  markerImagePreviews: true,
  phashes: true,
  previewOptions: {},
  previews: true,
  sprites: true,
};
```

Then the two functions:

```ts
type StatusResponse = {
  jobQueue: Pick<
    Job,
    'id' | 'progress' | 'status' | 'description' | 'subTasks' | 'error' | 'endTime' | 'addTime' | 'startTime'
  >[] | null;
};

type SigResponse = {
  metadataScan: Mutations['metadataScan']['result'];
  metadataIdentify: Mutations['metadataIdentify']['result'];
  metadataGenerate: Mutations['metadataGenerate']['result'];
};

export async function getStatus(endpoint: string): Promise<void> {
  const response: StatusResponse = await request(endpoint, statusQuery);
  // stashdb answers with null rather than [] for an idle queue, but treat both the
  // same way — an empty array would otherwise print nothing at all.
  if (response.jobQueue == null || response.jobQueue.length === 0) {
    console.log('Task Queue is empty');
    return;
  }
  for (const job of response.jobQueue) {
    console.log(renderJob(job));
  }
}

export async function sig(endpoint: string): Promise<void> {
  const response = await request<SigResponse>(endpoint, sigDocument, {
    scan: SCAN_INPUT,
    identify: IDENTIFY_INPUT,
    generate: GENERATE_INPUT,
  });
  if (!response.metadataScan || !response.metadataIdentify || !response.metadataGenerate) {
    // Throwing rather than logging: index.ts's top-level catch exits 1, so a failed
    // run is distinguishable from success by `stash sig && next`.
    throw new Error(`sig failed: ${JSON.stringify(response, null, 2)}`);
  }
  return getStatus(endpoint);
}
```

- [ ] **Step 4: Update `index.ts` to pass an endpoint**

Still `--rescan` at this stage; Task 4 replaces this file.

```ts
import { getStatus, resolveEndpoint, sig } from './src/stash.js';

function main(): Promise<void> {
  const endpoint = resolveEndpoint();
  if (process.argv.length > 2 && process.argv[2] === '--rescan') {
    return sig(endpoint);
  }
  return getStatus(endpoint);
}

main().then(() => process.exit(0)).catch((err: unknown) => {
  console.error(err);
  process.exit(1);
});
```

- [ ] **Step 5: Run the tests to verify they pass**

Run: `npm test`

Expected: PASS. The existing status-rendering, empty-queue, null-`subTasks`, and rescan-success tests must all still pass — this task changes how the input travels, not what is requested.

- [ ] **Step 6: Verify**

Run: `npm run verify`

Expected: exit 0. `tsc` is what proves the three input constants use real field names.

- [ ] **Step 7: Commit (ask Chad first)**

```bash
git add src/stash.ts index.ts tests/stash.test.ts
git commit -m "refactor: send sig inputs as typed graphql variables"
```

---

### Task 3: The remaining eight operations

**Files:**
- Modify: `src/stash.ts`
- Modify: `tests/stash.test.ts`

**Interfaces:**
- Consumes: `request`, `resolveEndpoint`, `getStatus`, `SCAN_INPUT`, `IDENTIFY_INPUT`, `GENERATE_INPUT` from Task 2.
- Produces: six job operations `scan`, `identify`, `generate`, `cleanGenerated`, `optimizeDb`, `exportMetadata`, each `(endpoint: string) => Promise<void>` and each printing the queue afterwards; and two immediate operations `backup(endpoint: string, options: { download: boolean; includeBlobs: boolean }) => Promise<string | null>` and `anonymize(endpoint: string, options: { download: boolean }) => Promise<string | null>`, each returning the link the server gave or `null`. Task 4 dispatches to all eight; Task 5 consumes the two return values.

- [ ] **Step 1: Write the failing tests**

Append to `tests/stash.test.ts`. The six job operations are covered by one table-driven test rather than six copies of the same body — the table is declared inside that test, below.

These tests call the operations directly rather than through the CLI, because the CLI does not exist until Task 4.

The `SentBody` type and the `sentBody(raw)` helper **already exist in this file** — Task 2 added them. Reuse them; do not redeclare them, and do not go back to a bare `JSON.parse`, which returns `any` and leaves every assertion path below it unchecked.

Add a static import at the top of the file:

```ts
import {
  anonymize,
  backup,
  cleanGenerated,
  exportMetadata,
  generate,
  identify,
  optimizeDb,
  scan,
} from '../src/stash.js';
```

```ts
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
  // Not named `run`: this file imports `run` from ./helpers/run.js, and shadowing it
  // trips oxlint's no-shadow under --deny-warnings.
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
```

`startStub`'s `respond` callback receives the raw body, so `body.includes(...)` distinguishes the mutation from the follow-up query.

- [ ] **Step 2: Run the tests to verify they fail**

Run: `npm test`

Expected: FAIL — none of the eight operations is exported yet.

- [ ] **Step 3: Add the operations to `src/stash.ts`**

Add the imports for the two new input types to the existing `import type` block:

```ts
import type {
  AnonymiseDatabaseInput,
  BackupDatabaseInput,
  CleanGeneratedInput,
  GenerateMetadataInput,
  IdentifyMetadataInput,
  Job,
  Mutations,
  ScanMetadataInput,
} from './generated/schema.js';
```

The `CleanGeneratedInput` value. **This is a decision the spec left open**: it lists the input's fields but not which the CLI sets. Every generated category is requested, and `dryRun` is omitted rather than set to `false`, because the stash web UI exposes no dry run for this operation:

```ts
const CLEAN_GENERATED_INPUT: CleanGeneratedInput = {
  blobFiles: true,
  imageThumbnails: true,
  markers: true,
  screenshots: true,
  sprites: true,
  transcodes: true,
};
```

The six job operations. Each posts one mutation, checks the job id came back, then prints the queue:

```ts
async function runJob(endpoint: string, document: string, field: string, variables?: Record<string, unknown>): Promise<void> {
  const response = await request<Record<string, string | null>>(endpoint, document, variables);
  const id = response[field];
  if (id === undefined || id === null || id === '') {
    throw new Error(`${field} returned no job id: ${JSON.stringify(response, null, 2)}`);
  }
  console.log(`${field} queued as job ${id}`);
  return getStatus(endpoint);
}

const scanDocument = gql`
mutation($input: ScanMetadataInput!) {
  metadataScan(input: $input)
}
`;

export function scan(endpoint: string): Promise<void> {
  return runJob(endpoint, scanDocument, 'metadataScan', { input: SCAN_INPUT });
}

const identifyDocument = gql`
mutation($input: IdentifyMetadataInput!) {
  metadataIdentify(input: $input)
}
`;

export function identify(endpoint: string): Promise<void> {
  return runJob(endpoint, identifyDocument, 'metadataIdentify', { input: IDENTIFY_INPUT });
}

const generateDocument = gql`
mutation($input: GenerateMetadataInput!) {
  metadataGenerate(input: $input)
}
`;

export function generate(endpoint: string): Promise<void> {
  return runJob(endpoint, generateDocument, 'metadataGenerate', { input: GENERATE_INPUT });
}

const cleanGeneratedDocument = gql`
mutation($input: CleanGeneratedInput!) {
  metadataCleanGenerated(input: $input)
}
`;

export function cleanGenerated(endpoint: string): Promise<void> {
  return runJob(endpoint, cleanGeneratedDocument, 'metadataCleanGenerated', { input: CLEAN_GENERATED_INPUT });
}

// British in the schema, American on the command line. Not a typo.
const optimizeDbDocument = gql`
mutation {
  optimiseDatabase
}
`;

export function optimizeDb(endpoint: string): Promise<void> {
  return runJob(endpoint, optimizeDbDocument, 'optimiseDatabase');
}

const exportDocument = gql`
mutation {
  metadataExport
}
`;

export function exportMetadata(endpoint: string): Promise<void> {
  return runJob(endpoint, exportDocument, 'metadataExport');
}
```

The two immediate operations. They return the link rather than printing it, so Task 5 can download it; `null` means the server wrote the file server-side:

```ts
// backupDatabase and anonymiseDatabase are synchronous: they do the work during the
// request and return an optional download link. They never enter the job queue, so
// unlike every operation above there is no follow-up status query.

const backupDocument = gql`
mutation($input: BackupDatabaseInput!) {
  backupDatabase(input: $input)
}
`;

export async function backup(
  endpoint: string,
  options: { download: boolean; includeBlobs: boolean },
): Promise<Mutations['backupDatabase']['result']> {
  const input: BackupDatabaseInput = { download: options.download, includeBlobs: options.includeBlobs };
  const response = await request<{ backupDatabase: Mutations['backupDatabase']['result'] }>(
    endpoint,
    backupDocument,
    { input },
  );
  return response.backupDatabase;
}

const anonymizeDocument = gql`
mutation($input: AnonymiseDatabaseInput!) {
  anonymiseDatabase(input: $input)
}
`;

export async function anonymize(
  endpoint: string,
  options: { download: boolean },
): Promise<Mutations['anonymiseDatabase']['result']> {
  const input: AnonymiseDatabaseInput = { download: options.download };
  const response = await request<{ anonymiseDatabase: Mutations['anonymiseDatabase']['result'] }>(
    endpoint,
    anonymizeDocument,
    { input },
  );
  return response.anonymiseDatabase;
}
```

- [ ] **Step 4: Run the tests to verify they pass**

Run: `npm test`

Expected: PASS.

- [ ] **Step 5: Verify**

Run: `npm run verify`

Expected: exit 0.

- [ ] **Step 6: Commit (ask Chad first)**

```bash
git add src/stash.ts tests/stash.test.ts
git commit -m "feat: add the remaining stash maintenance operations"
```

---

### Task 4: The subcommand surface

Replaces `--rescan` with the command table, `parseArgs`, `--endpoint`, `--help` and `--version`.

**Files:**
- Create: `src/cli.ts`
- Create: `tests/cli.test.ts`
- Modify: `index.ts`
- Modify: `scripts/build.ts`
- Modify: `tests/bundle.test.ts`
- Modify: `tests/stash.test.ts`
- Modify: `README.md`

**Interfaces:**
- Consumes: every operation from Tasks 2 and 3, plus `resolveEndpoint`.
- Produces: `src/cli.ts` exports `run(argv: string[]): Promise<void>`, where `argv` is the arguments **after** the node executable and script — i.e. `process.argv.slice(2)`. It throws `UsageError` for argument problems; `index.ts` distinguishes that from an operational failure.

- [ ] **Step 1: Write the failing tests**

Create `tests/cli.test.ts`. It drives the real CLI as a subprocess against the stub, reusing the helpers already in `tests/stash.test.ts` — copy `startStub`, `runCli` and `jobQueue` into this file rather than exporting them across test files, since `node:test` files are independent entry points.

```ts
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
```

In `tests/stash.test.ts`, the two tests invoking `['--rescan']` must become `['sig']`, since the flag no longer exists.

- [ ] **Step 2: Run the tests to verify they fail**

Run: `npm test`

Expected: FAIL — `src/cli.ts` does not exist, and `index.ts` still recognises only `--rescan`.

- [ ] **Step 3: Write `src/cli.ts`**

```ts
import { parseArgs, type ParseArgsOptionsConfig } from 'node:util';
import {
  anonymize,
  backup,
  cleanGenerated,
  exportMetadata,
  generate,
  getStatus,
  identify,
  optimizeDb,
  resolveEndpoint,
  scan,
  sig,
} from './stash.js';

// Replaced at build time by esbuild's `define`. Running from source under tsx leaves
// the identifier undefined, hence the `typeof` guard rather than a bare reference.
declare const __STASH_VERSION__: string | undefined;
const VERSION = typeof __STASH_VERSION__ === 'string' ? __STASH_VERSION__ : 'dev';

/** An argument problem rather than an operational failure. index.ts reports it without a stack. */
export class UsageError extends Error {}

const GLOBAL_OPTIONS: ParseArgsOptionsConfig = {
  endpoint: { type: 'string' },
  help: { type: 'boolean', short: 'h' },
  version: { type: 'boolean', short: 'V' },
};

type Values = Record<string, string | boolean | (string | boolean)[] | undefined>;

type Command = {
  summary: string;
  options: ParseArgsOptionsConfig;
  run: (endpoint: string, values: Values) => Promise<void>;
};

function flag(values: Values, name: string): boolean {
  return values[name] === true;
}

const COMMANDS: Record<string, Command> = {
  sig: {
    summary: 'scan, identify and generate in one pass',
    options: {},
    run: (endpoint) => sig(endpoint),
  },
  scan: { summary: 'scan for new and changed files', options: {}, run: (endpoint) => scan(endpoint) },
  identify: { summary: 'identify scenes using scrapers', options: {}, run: (endpoint) => identify(endpoint) },
  generate: { summary: 'generate covers, previews, sprites and phashes', options: {}, run: (endpoint) => generate(endpoint) },
  'clean-generated': {
    summary: 'delete generated files with no matching scene',
    options: {},
    run: (endpoint) => cleanGenerated(endpoint),
  },
  // American on the command line, British in the schema.
  'optimize-db': { summary: 'optimise the database', options: {}, run: (endpoint) => optimizeDb(endpoint) },
  export: { summary: 'export metadata to the metadata directory', options: {}, run: (endpoint) => exportMetadata(endpoint) },
  backup: {
    summary: 'back up the database',
    options: { download: { type: 'boolean' }, 'include-blobs': { type: 'boolean' } },
    run: async (endpoint, values) => {
      const link = await backup(endpoint, {
        download: flag(values, 'download'),
        includeBlobs: flag(values, 'include-blobs'),
      });
      reportLink('backup', link);
    },
  },
  anonymize: {
    summary: 'write an anonymised copy of the database',
    options: { download: { type: 'boolean' } },
    run: async (endpoint, values) => {
      const link = await anonymize(endpoint, { download: flag(values, 'download') });
      reportLink('anonymize', link);
    },
  },
};

function reportLink(operation: string, link: string | null): void {
  if (link === null || link === '') {
    console.log(`${operation} complete; stash wrote the file server-side`);
    return;
  }
  console.log(`${operation} complete: ${link}`);
}

function helpText(): string {
  const width = Math.max(...Object.keys(COMMANDS).map((name) => name.length));
  const commands = Object.entries(COMMANDS)
    .map(([name, command]) => `  ${name.padEnd(width)}  ${command.summary}`)
    .join('\n');
  return `stash — a command-line view of a stashdb job queue

Usage:
  stash [options]            print the job queue
  stash <command> [options]

Commands:
${commands}

Options:
  --endpoint <url>  override the GraphQL endpoint
  -h, --help        show this help
  -V, --version     show the version

The endpoint is taken from --endpoint, then STASH_ENDPOINT, then
http://localhost:9999/graphql.`;
}

export async function run(argv: string[]): Promise<void> {
  const first = argv[0];
  const isCommand = first !== undefined && !first.startsWith('-');
  const name = isCommand ? first : undefined;
  const rest = isCommand ? argv.slice(1) : argv;

  if (name !== undefined && COMMANDS[name] === undefined) {
    throw new UsageError(
      `unknown command '${name}'. Valid commands: ${Object.keys(COMMANDS).join(', ')}`,
    );
  }

  const command = name === undefined ? undefined : COMMANDS[name];

  let values: Values;
  let positionals: string[];
  try {
    // strict:true is what makes an unknown option fail, and scoping `options` to this
    // command is what makes `stash scan --download` fail without a hand-written rule.
    ({ values, positionals } = parseArgs({
      args: rest,
      options: { ...GLOBAL_OPTIONS, ...(command?.options ?? {}) },
      allowPositionals: true,
      strict: true,
    }));
  } catch (error: unknown) {
    throw new UsageError(error instanceof Error ? error.message : String(error));
  }

  if (values['help'] === true) {
    console.log(helpText());
    return;
  }

  if (values['version'] === true) {
    console.log(VERSION);
    return;
  }

  if (positionals.length > 0) {
    throw new UsageError(`only one command may be given; got an extra argument '${positionals[0] ?? ''}'`);
  }

  const endpointValue = values['endpoint'];
  const endpoint = resolveEndpoint(typeof endpointValue === 'string' ? endpointValue : undefined);

  if (command === undefined) {
    return getStatus(endpoint);
  }
  return command.run(endpoint, values);
}
```

- [ ] **Step 4: Rewrite `index.ts`**

```ts
import { run, UsageError } from './src/cli.js';

run(process.argv.slice(2))
  .then(() => process.exit(0))
  .catch((err: unknown) => {
    // A usage error is the user's typo, not a crash: message and a pointer, no stack.
    if (err instanceof UsageError) {
      console.error(err.message);
      console.error("Run 'stash --help' for usage.");
      process.exit(1);
    }
    console.error(err);
    process.exit(1);
  });
```

- [ ] **Step 5: Inject the version at build time**

In `scripts/build.ts`, read the version and pass it to esbuild. Also **delete the stale comment** on the lines above `outfile`: it explains a `mainFields` option that was removed when the graphql dependency was dropped, so it now documents nothing.

```ts
import { chmod, mkdir, readFile } from 'node:fs/promises';
```

```ts
const manifest: unknown = JSON.parse(await readFile(resolve(root, 'package.json'), 'utf8'));
if (typeof manifest !== 'object' || manifest === null || !('version' in manifest) || typeof manifest.version !== 'string') {
  throw new Error('package.json has no string version');
}
const version: string = manifest.version;
```

and inside the `esbuild.build({...})` options:

```ts
  // The bundle is one file with no node_modules, so it cannot read package.json at
  // runtime. release.yml refuses to publish a tag that disagrees with this version.
  define: { __STASH_VERSION__: JSON.stringify(version) },
```

- [ ] **Step 6: Assert the bundle reports the manifest version**

Append to `tests/bundle.test.ts`:

```ts
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
```

`readFile` is already imported in that file; add it to the import if not.

- [ ] **Step 7: Document the commands in `README.md`**

Replace the whole `## Usage` section — from the `## Usage` heading down to the line before `## Build and install` — with exactly this:

````markdown
## Usage

```sh
stash              # print the job queue
stash <command>    # run a maintenance task, then print the queue
```

| Command | What it does |
|---|---|
| `sig` | scan, identify and generate in one pass — replaces the old `--rescan` |
| `scan` | scan for new and changed files |
| `identify` | identify scenes using scrapers |
| `generate` | generate covers, previews, sprites and phashes |
| `clean-generated` | delete generated files with no matching scene |
| `optimize-db` | optimise the database |
| `export` | export metadata to the metadata directory |
| `backup` | back up the database |
| `anonymize` | write an anonymised copy of the database |

Options:

```sh
--endpoint <url>   override the GraphQL endpoint
-h, --help         show usage
-V, --version      show the version
```

An unrecognised command or flag exits 1 rather than being ignored, and a failed task exits
nonzero, so `stash sig && ...` behaves as expected.

The endpoint is taken from `--endpoint`, then `STASH_ENDPOINT`, then
`http://localhost:9999/graphql`:

```sh
STASH_ENDPOINT=http://media.local:9999/graphql stash
stash --endpoint http://media.local:9999/graphql
```
````

The command names are American where the underlying mutations are British
(`optimiseDatabase`, `anonymiseDatabase`); no need to mention that in the README, it is
noted in the code.

- [ ] **Step 8: Run the tests to verify they pass**

Run: `npm test`

Expected: PASS. The `--version` test asserts the built bundle, so `npm test` builds first via the existing bundle test.

- [ ] **Step 9: Verify**

Run: `npm run verify`

Expected: exit 0.

- [ ] **Step 10: Confirm by hand**

```bash
npm run build
./dist/stash.js --help
./dist/stash.js --version
./dist/stash.js
./dist/stash.js --resacn ; echo "exit=$?"
```

Expected: help lists all nine commands; version matches `package.json`; the bare call prints the queue; the typo exits 1 with a message and no stack trace. Report the bundle size — it must stay well under 15,000 bytes.

- [ ] **Step 11: Commit (ask Chad first)**

```bash
git add src/cli.ts index.ts scripts/build.ts tests/cli.test.ts tests/bundle.test.ts tests/stash.test.ts README.md
git commit -m "feat: replace --rescan with a subcommand surface"
```

---

### Task 5: `--download` writes the file locally

**Files:**
- Create: `src/download.ts`
- Modify: `src/cli.ts`
- Modify: `tests/cli.test.ts`

**Interfaces:**
- Consumes: `backup`/`anonymize` from Task 3, which return the server's link or `null`; `UsageError` from Task 4.
- Produces: `src/download.ts` exports `downloadTo(link: string, endpoint: string, directory: string, fallbackName: string): Promise<string>`, returning the absolute path written. Throws if the target exists, and deletes a partial file before rethrowing on a mid-transfer failure.

- [ ] **Step 1: Write the failing tests**

Append to `tests/cli.test.ts`. These drive the CLI end to end: the stub serves both the GraphQL mutation and the file the returned link points at.

```ts
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
    const result = await run(process.execPath, ['--import', 'tsx', resolve(root, 'index.ts'), 'backup', '--download'], directory, { ...process.env, STASH_ENDPOINT: endpoint });
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
    const result = await run(process.execPath, ['--import', 'tsx', resolve(root, 'index.ts'), 'backup', '--download'], directory, { ...process.env, STASH_ENDPOINT: `http://127.0.0.1:${address.port.toString(10)}/graphql` });
    assert.equal(result.code, 1);
    assert.match(result.stderr, /exists/);
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
    const result = await run(process.execPath, ['--import', 'tsx', resolve(root, 'index.ts'), 'backup'], directory, { ...process.env, STASH_ENDPOINT: `http://127.0.0.1:${address.port.toString(10)}/graphql` });
    assert.equal(result.code, 0, result.stderr);
    assert.match(result.stdout, /server-side/);
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
    res.writeHead(200, { 'content-length': '999999' });
    res.write('PARTIAL');
    res.destroy();
  });
  await new Promise<void>((ready) => { server.listen(0, '127.0.0.1', ready); });
  const address = server.address();
  if (address === null || typeof address === 'string') { throw new Error('no port'); }
  try {
    const result = await run(process.execPath, ['--import', 'tsx', resolve(root, 'index.ts'), 'backup', '--download'], directory, { ...process.env, STASH_ENDPOINT: `http://127.0.0.1:${address.port.toString(10)}/graphql` });
    assert.equal(result.code, 1);
    // A truncated database that looks like a complete one is worse than no file.
    assert.deepEqual(await readdir(directory), []);
  } finally {
    await new Promise<void>((closed) => { server.close(() => { closed(); }); });
  }
});
```

Add these imports to `tests/cli.test.ts`:

```ts
import { mkdtemp, readdir, readFile, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
```

- [ ] **Step 2: Run the tests to verify they fail**

Run: `npm test`

Expected: FAIL — `--download` is accepted but nothing is written, so the file assertions fail.

- [ ] **Step 3: Write `src/download.ts`**

```ts
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
    // Remove the partial file before rethrowing. A truncated database that looks
    // complete is worse than no file at all.
    await unlink(target).catch(() => undefined);
    if (error instanceof Error && 'code' in error && error.code === 'EEXIST') {
      throw new Error(`${target} already exists; refusing to overwrite it`);
    }
    throw error;
  }
  return target;
}
```

`createWriteStream` with `flags: 'wx'` surfaces `EEXIST` through the `pipeline` rejection, which is why the `EEXIST` check lives in the catch.

- [ ] **Step 4: Wire it into `src/cli.ts`**

Add the import:

```ts
import { downloadTo } from './download.js';
```

Replace `reportLink` with a version that downloads when asked. The fallback names come from the spec: `stash-backup` and `stash-anonymised`, with no timestamp so the name is deterministic and testable.

```ts
async function reportResult(
  operation: string,
  link: string | null,
  endpoint: string,
  download: boolean,
  fallbackName: string,
): Promise<void> {
  if (link === null || link === '') {
    console.log(`${operation} complete; stash wrote the file server-side`);
    return;
  }
  if (!download) {
    console.log(`${operation} complete: ${link}`);
    return;
  }
  const written = await downloadTo(link, endpoint, process.cwd(), fallbackName);
  console.log(`${operation} complete: wrote ${written}`);
}
```

and the two command handlers become:

```ts
  backup: {
    summary: 'back up the database',
    options: { download: { type: 'boolean' }, 'include-blobs': { type: 'boolean' } },
    run: async (endpoint, values) => {
      const download = flag(values, 'download');
      const link = await backup(endpoint, { download, includeBlobs: flag(values, 'include-blobs') });
      await reportResult('backup', link, endpoint, download, 'stash-backup');
    },
  },
  anonymize: {
    summary: 'write an anonymised copy of the database',
    options: { download: { type: 'boolean' } },
    run: async (endpoint, values) => {
      const download = flag(values, 'download');
      const link = await anonymize(endpoint, { download });
      await reportResult('anonymize', link, endpoint, download, 'stash-anonymised');
    },
  },
```

- [ ] **Step 5: Run the tests to verify they pass**

Run: `npm test`

Expected: PASS, including the partial-file test — that one is the reason this task exists rather than a one-line `writeFile`.

- [ ] **Step 6: Verify**

Run: `npm run verify`

Expected: exit 0. Report the bundle size; the streaming imports add runtime code, and it must stay under 15,000 bytes.

- [ ] **Step 7: Document `--download` in `README.md`**

Insert this immediately after the Options block in the Usage section:

````markdown
`backup` and `anonymize` accept `--download`, which fetches the file stash produces into
the current directory, named after the link stash returns. An existing file is never
overwritten — the CLI reports the collision and exits 1 — and a transfer that fails partway
is deleted rather than left looking like a complete database. Without `--download`, stash
writes the file server-side and the CLI reports the link it was given.

`backup` also accepts `--include-blobs`.
````

Also correct the stale size figure further down: the Build and install section says the
artifact is "around 4.5 KB". Replace that figure with the size you measured in Step 6.

- [ ] **Step 8: Commit (ask Chad first)**

```bash
git add src/download.ts src/cli.ts tests/cli.test.ts README.md
git commit -m "feat: download backups and anonymised copies locally"
```

---

## Done When

- `npm run verify` passes: oxlint, `tsc --noEmit`, tests, build.
- `stash --resacn` exits 1 with a message and no stack trace, where it used to print the queue and exit 0.
- All nine commands dispatch to their own mutation, and `stash scan --download` is rejected without a hand-written rule.
- `--endpoint` beats `STASH_ENDPOINT` beats the default.
- `--help` lists every command; `--version` matches `package.json`; neither contacts the server.
- Every mutation input is declared against a generated type, so a misspelled field is a compile error.
- `backup --download` writes a file named after the link, refuses to overwrite, and leaves nothing behind when a transfer fails.
- `dist/stash.js` stays under the 15,000-byte ceiling.
- No test requires a live stash server, and no destructive mutation is ever sent to one.

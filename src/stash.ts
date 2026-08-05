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
import { OperationalError } from './errors.js';
import { gql, request } from './graphql.js';
import { renderJob } from './format.js';

export const DEFAULT_ENDPOINT = 'http://localhost:9999/graphql';

/** Precedence: an explicit override (the `--endpoint` flag), then the environment, then the default. */
export function resolveEndpoint(override?: string): string {
  return override ?? process.env['STASH_ENDPOINT'] ?? DEFAULT_ENDPOINT;
}

const statusQuery = gql`
query {
  jobQueue {
    id
    progress
    status
    description
    subTasks
    error
    endTime
    addTime
    startTime
  }
}
`;

const sigDocument = gql`
mutation($scan: ScanMetadataInput!, $identify: IdentifyMetadataInput!, $generate: GenerateMetadataInput!) {
  metadataScan(input: $scan)
  metadataIdentify(input: $identify)
  metadataGenerate(input: $generate)
}
`;

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
    throw new OperationalError(`sig failed: ${JSON.stringify(response, null, 2)}`);
  }
  // Three jobs, three ids — matches the single-job message shape used by runJob below
  // so `sig`'s output reads consistently with its six siblings.
  console.log(`metadataScan queued as job ${response.metadataScan}`);
  console.log(`metadataIdentify queued as job ${response.metadataIdentify}`);
  console.log(`metadataGenerate queued as job ${response.metadataGenerate}`);
  return getStatus(endpoint);
}

// This is a decision the spec left open: CleanGeneratedInput lists seven fields but
// the spec never said which the CLI sets. Every generated category is requested, and
// dryRun is omitted rather than set to false, because the stash web UI exposes no dry
// run for this operation — sending the field either way would imply an opinion the
// CLI has not been given.
const CLEAN_GENERATED_INPUT: CleanGeneratedInput = {
  blobFiles: true,
  imageThumbnails: true,
  markers: true,
  screenshots: true,
  sprites: true,
  transcodes: true,
};

async function runJob<F extends keyof Mutations>(
  endpoint: string,
  document: string,
  field: F,
  variables?: Mutations[F]['args'],
): Promise<void> {
  // `field` is checked against the schema, so a mutation that does not exist cannot
  // compile. `variables` is checked only as far as the schema allows: every field of
  // every *Input type is optional, which makes them weak types, so tsc rejects a wrong
  // input object only when it shares no field name at all with the right one. Passing
  // IdentifyMetadataInput where ScanMetadataInput belongs still compiles, because both
  // declare `paths`. The tests assert the wire payload for exactly this reason.
  const response = await request<Record<F, Mutations[F]['result']>>(endpoint, document, variables);
  const id = response[field];
  if (id === undefined || id === null || id === '') {
    throw new OperationalError(`${field} returned no job id: ${JSON.stringify(response, null, 2)}`);
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

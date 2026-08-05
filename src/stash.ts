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
    throw new Error(`sig failed: ${JSON.stringify(response, null, 2)}`);
  }
  return getStatus(endpoint);
}

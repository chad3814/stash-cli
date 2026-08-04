import { gql, request } from './graphql.js';
import { renderJob } from './format.js';

const ENDPOINT = process.env['STASH_ENDPOINT'] ?? 'http://localhost:9999/graphql';

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

const scanMutation = gql`
mutation {
  metadataScan(
    input: {
      scanGenerateClipPreviews: true
      scanGenerateCovers: true
      scanGenerateImagePhashes: true
      scanGenerateImagePreviews: true
      scanGeneratePhashes: true
      scanGeneratePreviews: true
      scanGenerateSprites: true
      scanGenerateThumbnails: true
    }
  )
  metadataIdentify(input: { sources: { source: {  } } })
  metadataGenerate(
    input: {
      covers: true
      previews: true
      markerImagePreviews: true
      phashes: true
      previewOptions: {  }
      imagePreviews: true
      sprites: true
    }
  )
}
`;

type StatusResponse = {
  jobQueue: {
    id: string;
    progress: number;
    status: 'RUNNING' | 'READY';
    description: string;
    subTasks: string[];
    error: string | null;
    endTime: string | null;
    addTime: string;
    startTime: string | null;
  }[];
};

type RescanResponse = {
  metadataScan: string;
  metadataIdentify: string;
  metadataGenerate: string;
};

export async function getStatus(): Promise<void> {
  const response: StatusResponse = await request(ENDPOINT, statusQuery);
  for (const job of response.jobQueue) {
    console.log(renderJob(job));
  }
}

export async function rescan(): Promise<void> {
  const response: RescanResponse = await request(ENDPOINT, scanMutation);
  if (!response.metadataScan || !response.metadataIdentify || !response.metadataGenerate) {
    // Throwing rather than logging: index.ts's top-level catch exits 1, so a
    // failed rescan is distinguishable from success by `stash --rescan && next`.
    throw new Error(`Rescan failed: ${JSON.stringify(response, null, 2)}`);
  }
  return getStatus();
}

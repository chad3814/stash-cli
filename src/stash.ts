import { gql, request } from 'graphql-request';
import { formatEta, getBarString, truncate } from './format.js';

const ENDPOINT = process.env['STASH_ENDPOINT'] ?? 'http://localhost:9999/graphql';

const statusQuery = gql`
query MyQuery {
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
    const emoji = job.status === 'RUNNING' ? '🏃‍➡️' : '🧍';
    const percentage = job.progress * 100;
    const eta = formatEta(job.startTime, job.progress);
    console.log(`${emoji} ${job.description}
${getBarString(job.progress)} ${percentage.toFixed(2)}% ${eta}
${job.subTasks.map((subTask) => `   ${truncate(subTask, 57)}`).join('\n')}
`);
  }
}

export async function rescan(): Promise<void> {
  const response: RescanResponse = await request(ENDPOINT, scanMutation);
  if (!response.metadataScan || !response.metadataIdentify || !response.metadataGenerate) {
    console.error('Rescan failed', JSON.stringify(response, null, 2));
    return;
  }
  return getStatus();
}

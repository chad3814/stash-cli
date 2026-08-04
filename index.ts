import { gql, request } from 'graphql-request';

const ENDPOINT = 'http://localhost:9999/graphql';

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
`

type StatusResponse = {
    jobQueue: {
        id: string;
        progress: number;
        status: "RUNNING" | "READY";
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

function getBarString(percentage: number, width = 40): string {
    const doneChar = '\u2588';
    const undoneChar = '\u2591';
    const doneCount = Math.min(width, Math.floor(percentage * width));
    const done = doneChar.repeat(doneCount);
    const undone = undoneChar.repeat(width - doneCount);
    return done + undone;
}

function truncate(str: string, width = 60): string {
    if (str.length < width) {
        return str;
    }
    return str.substring(0, width - 3) + '...';
}

async function getStatus(): Promise<void> {
    const response: StatusResponse = await request(ENDPOINT, statusQuery);
    for (const job of response.jobQueue) {
        let emoji = '🧍';
        if (job.status === 'RUNNING') {
            emoji = '🏃‍➡️';
        }
        const percentage = job.progress * 100;
        let eta = '';
        if (job.startTime) {
            const startTime = new Date(job.startTime);
            const used = Date.now() - startTime.getTime();
            const duration = Math.floor(used / job.progress);
            const etaMs = startTime.getTime() + duration - Date.now();
            const etaS = Math.floor(etaMs / 1000);
            eta = `ETA: ${Math.floor(etaS / 60).toString(10)}:${(etaS % 60).toString(10).padStart(2, '0')}`;
        }
        console.log(`${emoji} ${job.description}
${getBarString(job.progress)} ${percentage.toFixed(2)}% ${eta}
${job.subTasks.map(s => `   ${truncate(s, 57)}`).join('\n')}
`);
    }
}

async function rescan(): Promise<void> {
    const response: RescanResponse = await request(ENDPOINT, scanMutation);
    if (!response.metadataScan || !response.metadataIdentify || !response.metadataGenerate) {
        console.error('Rescan failed', JSON.stringify(response, null, 2));
        return;
    }
    return getStatus();
}

function main() {
    if (process.argv.length > 2 && process.argv[2] === '--rescan') {
        return rescan();
    }
    return getStatus();
}

main().then(() => process.exit(0)).catch(err => {
    console.error(err);
    process.exit(1);
});

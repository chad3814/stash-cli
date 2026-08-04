const DONE_CHAR = '█';
const UNDONE_CHAR = '░';

export function getBarString(fraction: number, width = 40): string {
  const clamped = Math.min(1, Math.max(0, fraction));
  const doneCount = Math.floor(clamped * width);
  return DONE_CHAR.repeat(doneCount) + UNDONE_CHAR.repeat(width - doneCount);
}

export function truncate(str: string, width = 60): string {
  if (str.length <= width) {
    return str;
  }
  return str.substring(0, width - 3) + '...';
}

/**
 * The subset of a job queue entry that rendering depends on. Declared
 * structurally rather than imported so this module stays dependency-free.
 */
export type JobDisplay = {
  status: string;
  description: string;
  progress: number;
  subTasks: string[];
  startTime: string | null;
};

export function formatEta(
  startTime: string | null,
  progress: number,
  now = Date.now(),
): string {
  if (startTime === null || progress <= 0) {
    return '';
  }
  const started = new Date(startTime).getTime();
  if (Number.isNaN(started)) {
    return '';
  }
  const used = now - started;
  const remainingMs = used / progress - used;
  const remainingS = Math.max(0, Math.floor(remainingMs / 1000));
  const minutes = Math.floor(remainingS / 60);
  const seconds = remainingS % 60;
  return `ETA: ${minutes.toString(10)}:${seconds.toString(10).padStart(2, '0')}`;
}

/**
 * Renders one job queue entry as the multi-line block the CLI prints.
 *
 * Note: when there is no ETA the progress line ends with a trailing space.
 * That is pre-existing behavior, preserved deliberately.
 */
export function renderJob(job: JobDisplay, now = Date.now()): string {
  const emoji = job.status === 'RUNNING' ? '🏃‍➡️' : '🧍';
  const percentage = job.progress * 100;
  const eta = formatEta(job.startTime, job.progress, now);
  return `${emoji} ${job.description}
${getBarString(job.progress)} ${percentage.toFixed(2)}% ${eta}
${job.subTasks.map((subTask) => `   ${truncate(subTask, 57)}`).join('\n')}
`;
}

import type { Job, JobStatus } from './generated/schema.js';

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
 * The subset of a job queue entry that rendering depends on.
 */
export type JobDisplay = Pick<Job, 'status' | 'description' | 'progress' | 'subTasks' | 'startTime'>;

const STATUS_GLYPHS: Record<JobStatus, string> = {
  RUNNING: '🏃‍➡️',
  READY: '⏳',
  FINISHED: '✅',
  FAILED: '❌',
  CANCELLED: '🚫',
  STOPPING: '🛑',
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
  const emoji = STATUS_GLYPHS[job.status];
  // Job.progress is Float in the schema — nullable. Treat absent progress as zero
  // explicitly rather than relying on null coercing to 0 in arithmetic.
  const progress = job.progress ?? 0;
  const percentage = progress * 100;
  const eta = formatEta(job.startTime, progress, now);
  // Only pad before the eta when there is one, so a job without an estimate does
  // not leave a trailing space on the line.
  const etaSuffix = eta === '' ? '' : ` ${eta}`;
  return `${emoji} ${job.description}
${getBarString(progress)} ${percentage.toFixed(2)}%${etaSuffix}
${(job.subTasks ?? []).map((subTask) => `   ${truncate(subTask, 57)}`).join('\n')}
`;
}

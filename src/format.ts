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

/**
 * The line this file draws: an error this program throws on purpose is something the user
 * can read and act on — a file that already exists, a server that answered with an error,
 * a connection that died partway. An error the runtime throws is a bug in this program,
 * and whoever sees it needs the stack trace. `index.ts` prints the first kind as a plain
 * message and the second kind in full.
 *
 * Before this split, a refused overwrite printed its careful message wrapped in a stack
 * dump, because the only recognised class was `UsageError`.
 */
export class OperationalError extends Error {
  constructor(message: string, options?: ErrorOptions) {
    super(message, options);
    this.name = 'OperationalError';
  }
}

/**
 * A mistake in what the user typed, rather than something that went wrong while doing
 * what they asked. Handled like any other operational error, plus a pointer at --help.
 */
export class UsageError extends OperationalError {
  constructor(message: string) {
    super(message);
    this.name = 'UsageError';
  }
}

/**
 * Renders an operational error for the terminal: its own message, then each `cause` in the
 * chain indented beneath it. The chain matters because the useful detail is often in the
 * cause — a mid-download failure says "the transfer failed", and its cause says why.
 */
export function describeOperationalError(error: OperationalError): string {
  const lines = [error.message];
  let cause: unknown = error.cause;
  // A cause chain is a linked list, and a malformed one can loop. Bound it rather than
  // hanging the CLI while printing an error message.
  for (let depth = 0; cause !== undefined && cause !== null && depth < 5; depth += 1) {
    lines.push(`  caused by: ${cause instanceof Error ? cause.message : String(cause)}`);
    cause = cause instanceof Error ? cause.cause : undefined;
  }
  return lines.join('\n');
}

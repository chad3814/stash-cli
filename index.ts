import { inspect } from 'node:util';
import { redactApiKey } from './src/auth.js';
import { run } from './src/cli.js';
import { describeOperationalError, OperationalError, UsageError } from './src/errors.js';

run(process.argv.slice(2))
  .then(() => process.exit(0))
  .catch((err: unknown) => {
    // Every branch goes through redactApiKey. The first two are safe by construction, but
    // routing them through it anyway means the guarantee lives in one place rather than
    // depending on each message staying careful. The third branch is where it earns its
    // keep: `inspect` renders an arbitrary error, including one this code did not write.
    // undici's header validation, for instance, rejects a key containing a line break by
    // quoting the whole value back — a disclosure no amount of care in our own messages
    // would prevent.
    if (err instanceof UsageError) {
      console.error(redactApiKey(err.message));
      console.error("Run 'stash --help' for usage.");
    } else if (err instanceof OperationalError) {
      console.error(redactApiKey(describeOperationalError(err)));
    } else {
      console.error(redactApiKey(inspect(err)));
    }
    process.exit(1);
  });

import { run } from './src/cli.js';
import { describeOperationalError, OperationalError, UsageError } from './src/errors.js';

run(process.argv.slice(2))
  .then(() => process.exit(0))
  .catch((err: unknown) => {
    // Three tiers, narrowest first. A usage error is the user's typo, so it earns a
    // pointer at --help. Any other operational error is a real failure the user can act
    // on, so it prints as a message with its cause chain. Anything else is a bug in this
    // program, and the stack is the whole point of showing it.
    if (err instanceof UsageError) {
      console.error(err.message);
      console.error("Run 'stash --help' for usage.");
    } else if (err instanceof OperationalError) {
      console.error(describeOperationalError(err));
    } else {
      console.error(err);
    }
    process.exit(1);
  });

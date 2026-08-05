import { run, UsageError } from './src/cli.js';

run(process.argv.slice(2))
  .then(() => process.exit(0))
  .catch((err: unknown) => {
    // A usage error is the user's typo, not a crash: message and a pointer, no stack.
    if (err instanceof UsageError) {
      console.error(err.message);
      console.error("Run 'stash --help' for usage.");
      process.exit(1);
    }
    console.error(err);
    process.exit(1);
  });

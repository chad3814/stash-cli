import { getStatus, rescan } from './src/stash.js';

function main(): Promise<void> {
  if (process.argv.length > 2 && process.argv[2] === '--rescan') {
    return rescan();
  }
  return getStatus();
}

main().then(() => process.exit(0)).catch((err: Error) => {
  console.error(err);
  process.exit(1);
});

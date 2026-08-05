import { getStatus, resolveEndpoint, sig } from './src/stash.js';

function main(): Promise<void> {
  const endpoint = resolveEndpoint();
  if (process.argv.length > 2 && process.argv[2] === '--rescan') {
    return sig(endpoint);
  }
  return getStatus(endpoint);
}

main().then(() => process.exit(0)).catch((err: unknown) => {
  console.error(err);
  process.exit(1);
});

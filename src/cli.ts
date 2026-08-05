import { parseArgs, type ParseArgsOptionsConfig } from 'node:util';
import {
  anonymize,
  backup,
  cleanGenerated,
  exportMetadata,
  generate,
  getStatus,
  identify,
  optimizeDb,
  resolveEndpoint,
  scan,
  sig,
} from './stash.js';

// Replaced at build time by esbuild's `define`. Running from source under tsx leaves
// the identifier undefined, hence the `typeof` guard rather than a bare reference.
// oxlint-disable-next-line no-underscore-dangle -- name is fixed by esbuild's `define` key in scripts/build.ts.
declare const __STASH_VERSION__: string | undefined;
const VERSION = typeof __STASH_VERSION__ === 'string' ? __STASH_VERSION__ : 'dev';

/** An argument problem rather than an operational failure. index.ts reports it without a stack. */
export class UsageError extends Error {}

const GLOBAL_OPTIONS: ParseArgsOptionsConfig = {
  endpoint: { type: 'string' },
  help: { type: 'boolean', short: 'h' },
  version: { type: 'boolean', short: 'V' },
};

type Values = Record<string, string | boolean | (string | boolean)[] | undefined>;

type Command = {
  summary: string;
  options: ParseArgsOptionsConfig;
  run: (endpoint: string, values: Values) => Promise<void>;
};

function flag(values: Values, name: string): boolean {
  return values[name] === true;
}

const COMMANDS: Record<string, Command> = {
  sig: {
    summary: 'scan, identify and generate in one pass',
    options: {},
    run: (endpoint) => sig(endpoint),
  },
  scan: { summary: 'scan for new and changed files', options: {}, run: (endpoint) => scan(endpoint) },
  identify: { summary: 'identify scenes using scrapers', options: {}, run: (endpoint) => identify(endpoint) },
  generate: { summary: 'generate covers, previews, sprites and phashes', options: {}, run: (endpoint) => generate(endpoint) },
  'clean-generated': {
    summary: 'delete generated files with no matching scene',
    options: {},
    run: (endpoint) => cleanGenerated(endpoint),
  },
  // American on the command line, British in the schema.
  'optimize-db': { summary: 'optimise the database', options: {}, run: (endpoint) => optimizeDb(endpoint) },
  export: { summary: 'export metadata to the metadata directory', options: {}, run: (endpoint) => exportMetadata(endpoint) },
  backup: {
    summary: 'back up the database',
    options: { download: { type: 'boolean' }, 'include-blobs': { type: 'boolean' } },
    run: async (endpoint, values) => {
      const link = await backup(endpoint, {
        download: flag(values, 'download'),
        includeBlobs: flag(values, 'include-blobs'),
      });
      reportLink('backup', link);
    },
  },
  anonymize: {
    summary: 'write an anonymised copy of the database',
    options: { download: { type: 'boolean' } },
    run: async (endpoint, values) => {
      const link = await anonymize(endpoint, { download: flag(values, 'download') });
      reportLink('anonymize', link);
    },
  },
};

function reportLink(operation: string, link: string | null): void {
  if (link === null || link === '') {
    console.log(`${operation} complete; stash wrote the file server-side`);
    return;
  }
  console.log(`${operation} complete: ${link}`);
}

function helpText(): string {
  const width = Math.max(...Object.keys(COMMANDS).map((name) => name.length));
  const commands = Object.entries(COMMANDS)
    .map(([name, command]) => `  ${name.padEnd(width)}  ${command.summary}`)
    .join('\n');
  return `stash — a command-line view of a stashdb job queue

Usage:
  stash [options]            print the job queue
  stash <command> [options]

Commands:
${commands}

Options:
  --endpoint <url>  override the GraphQL endpoint
  -h, --help        show this help
  -V, --version     show the version

The endpoint is taken from --endpoint, then STASH_ENDPOINT, then
http://localhost:9999/graphql.`;
}

export async function run(argv: string[]): Promise<void> {
  const first = argv[0];
  const isCommand = first !== undefined && !first.startsWith('-');
  const name = isCommand ? first : undefined;
  const rest = isCommand ? argv.slice(1) : argv;

  if (name !== undefined && COMMANDS[name] === undefined) {
    throw new UsageError(
      `unknown command '${name}'. Valid commands: ${Object.keys(COMMANDS).join(', ')}`,
    );
  }

  const command = name === undefined ? undefined : COMMANDS[name];

  let values: Values;
  let positionals: string[];
  try {
    // strict:true is what makes an unknown option fail, and scoping `options` to this
    // command is what makes `stash scan --download` fail without a hand-written rule.
    ({ values, positionals } = parseArgs({
      args: rest,
      options: { ...GLOBAL_OPTIONS, ...command?.options },
      allowPositionals: true,
      strict: true,
    }));
  } catch (error: unknown) {
    throw new UsageError(error instanceof Error ? error.message : String(error));
  }

  if (values['help'] === true) {
    console.log(helpText());
    return;
  }

  if (values['version'] === true) {
    console.log(VERSION);
    return;
  }

  if (positionals.length > 0) {
    throw new UsageError(`only one command may be given; got an extra argument '${positionals[0] ?? ''}'`);
  }

  const endpointValue = values['endpoint'];
  const endpoint = resolveEndpoint(typeof endpointValue === 'string' ? endpointValue : undefined);

  if (command === undefined) {
    return getStatus(endpoint);
  }
  return command.run(endpoint, values);
}

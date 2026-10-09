#!/usr/bin/env node
import { runCli } from '../lib/cli.mjs';

try {
  const code = await runCli(process.argv.slice(2));
  process.exit(code ?? 0);
} catch (error) {
  console.error(error instanceof Error ? error.message : error);
  process.exit(1);
}

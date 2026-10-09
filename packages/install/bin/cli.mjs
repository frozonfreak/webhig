#!/usr/bin/env node
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { run } from '../lib/install.mjs';

const packageRoot = path.join(path.dirname(fileURLToPath(import.meta.url)), '..');

try {
  const code = await run(process.argv.slice(2), { packageRoot });
  process.exit(code ?? 0);
} catch (error) {
  console.error(error instanceof Error ? error.message : error);
  process.exit(1);
}

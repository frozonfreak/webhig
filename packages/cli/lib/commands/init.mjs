import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { run } from '@web-hig/install/lib/install.mjs';

export async function runInit(argv) {
  const packageRoot = path.dirname(
    fileURLToPath(import.meta.resolve('@web-hig/install/package.json')),
  );
  return run(argv, { packageRoot });
}

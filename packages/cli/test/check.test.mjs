import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { runCheck } from '../lib/commands/check.mjs';

const repoRoot = path.join(path.dirname(fileURLToPath(import.meta.url)), '..', '..', '..');

const tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'web-hig-check-'));
const srcDir = path.join(tmp, 'src');
fs.mkdirSync(srcDir, { recursive: true });
fs.writeFileSync(
  path.join(srcDir, 'bad.css'),
  '.btn { transition: all 200ms ease; }\n',
  'utf8',
);
fs.writeFileSync(
  path.join(tmp, 'web-hig.yaml'),
  `version: "1.13.0"\nprofile: practical\narchetype: application\n`,
  'utf8',
);

process.env.WEB_HIG_ROOT = repoRoot;
const prevCwd = process.cwd();
process.chdir(tmp);
try {
  const code = await runCheck([]);
  assert.equal(code, 1, 'expected blocking finding to fail check');
} finally {
  process.chdir(prevCwd);
  delete process.env.WEB_HIG_ROOT;
  fs.rmSync(tmp, { recursive: true, force: true });
}

console.log('check.test.mjs passed');

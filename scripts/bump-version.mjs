#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.join(path.dirname(fileURLToPath(import.meta.url)), '..');
const from = process.argv[2];
const to = process.argv[3];
if (!from || !to) {
  console.error('Usage: node scripts/bump-version.mjs <from> <to>');
  process.exit(1);
}

const skipDir = new Set(['.git', 'node_modules', 'vendor']);
const skipFiles = new Set([
  'CHANGELOG.md',
  'RELEASE_NOTES.md',
  'HIG.md',
  'content/devto/introducing-the-web-hig.md',
]);

function walk(dir, out = []) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    if (skipDir.has(entry.name)) continue;
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) walk(full, out);
    else out.push(full);
  }
  return out;
}

let count = 0;
for (const filePath of walk(root)) {
  const rel = path.relative(root, filePath).split(path.sep).join('/');
  if (skipFiles.has(rel)) continue;
  if (rel === 'VERSION' || rel.endsWith('/VERSION')) {
    let text = fs.readFileSync(filePath, 'utf8');
    if (text.includes(from)) {
      text = text.split(from).join(to);
      fs.writeFileSync(filePath, text, 'utf8');
      count += 1;
    }
    continue;
  }
  if (!/\.(md|yaml|yml|json|html|mjs)$/i.test(rel)) continue;
  if (rel.includes('node_modules')) continue;
  let text = fs.readFileSync(filePath, 'utf8');
  if (!text.includes(from)) continue;
  text = text.split(from).join(to);
  fs.writeFileSync(filePath, text, 'utf8');
  count += 1;
}

fs.writeFileSync(path.join(root, 'VERSION'), `${to}\n`, 'utf8');
console.log(`Bumped ${from} → ${to} in ${count} files (+ VERSION)`);

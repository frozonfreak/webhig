#!/usr/bin/env node
/**
 * Build a changelog summary + release notes draft from CHANGELOG.md and RELEASE_NOTES.md.
 * Usage:
 *   node scripts/release-notes.mjs
 *   node scripts/release-notes.mjs --version 1.10.1 --write release-body.md
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.join(path.dirname(fileURLToPath(import.meta.url)), '..');

function arg(name, fallback = '') {
  const index = process.argv.indexOf(name);
  if (index === -1 || !process.argv[index + 1]) return fallback;
  return process.argv[index + 1];
}

function read(file) {
  return fs.readFileSync(path.join(root, file), 'utf8');
}

function normalizeVersion(value) {
  return String(value || '')
    .trim()
    .replace(/^v/, '');
}

function extractSection(markdown, headingPattern) {
  const lines = markdown.split(/\r?\n/);
  const start = lines.findIndex((line) => headingPattern.test(line));
  if (start === -1) return '';
  let end = lines.length;
  for (let i = start + 1; i < lines.length; i += 1) {
    if (/^##\s+/.test(lines[i])) {
      end = i;
      break;
    }
  }
  return lines
    .slice(start + 1, end)
    .join('\n')
    .trim();
}

const versionFile = normalizeVersion(read('VERSION'));
const requested = normalizeVersion(arg('--version', process.env.GITHUB_REF_NAME || versionFile));
if (!/^\d+\.\d+\.\d+$/.test(requested)) {
  console.error(`Invalid version: ${requested || '(empty)'}`);
  process.exit(1);
}

const changelog = extractSection(read('CHANGELOG.md'), new RegExp(`^## \\[${requested}\\]`));
const releaseNotes = extractSection(read('RELEASE_NOTES.md'), new RegExp(`^## \\[v?${requested}\\]`));

if (!changelog) {
  console.error(`CHANGELOG.md has no ## [${requested}] section`);
  process.exit(1);
}

const body = [
  `## Changelog summary`,
  '',
  changelog,
  '',
  `## Release notes`,
  '',
  releaseNotes || `_No adoption notes in RELEASE_NOTES.md for v${requested}. Use the changelog summary above._`,
  '',
  '---',
  '',
  `Pin: [HIG-QUICK.md](https://github.com/frozonfreak/webhig/blob/v${requested}/HIG-QUICK.md) · Contract: [VERSION](https://github.com/frozonfreak/webhig/blob/v${requested}/VERSION)`,
  '',
].join('\n');

const output = arg('--write');
if (output) {
  fs.writeFileSync(path.resolve(output), body, 'utf8');
}

process.stdout.write(body);

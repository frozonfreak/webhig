import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import {
  extractQuickNumberedRules,
  extractRuleIds,
  parseQuickRuleMapYaml,
} from '../lib/contract-parse.mjs';

const root = path.join(path.dirname(fileURLToPath(import.meta.url)), '..', '..');

function read(file) {
  return fs.readFileSync(path.join(root, file), 'utf8');
}

function sortedIds(text) {
  return [...extractRuleIds(text)].sort();
}

const seoRange = ['HIG-SEO-001', 'HIG-SEO-002', 'HIG-SEO-003'];

assert.deepEqual(sortedIds('HIG-SEO-001\u2013003'), seoRange, 'en dash range expands');
assert.deepEqual(sortedIds('HIG-SEO-001-003'), seoRange, 'hyphen range expands');
assert.deepEqual(
  sortedIds('**HIG-SEO-001**\u2013**003**'),
  seoRange,
  'Markdown-bold en dash range expands',
);
assert.deepEqual(
  sortedIds('cite **HIG-SEO-001**-**003** in prose'),
  seoRange,
  'hyphen range with Markdown bold expands',
);
assert.deepEqual(sortedIds('HIG-SEO-001'), ['HIG-SEO-001'], 'a single ID is not a range');
assert.deepEqual(
  sortedIds('**HIG-SEO-001**, **HIG-SEO-003**'),
  ['HIG-SEO-001', 'HIG-SEO-003'],
  'separate IDs are not filled in as a range',
);
assert.deepEqual(
  sortedIds('HIG-SEO-003-001'),
  ['HIG-SEO-003'],
  'a descending span does not expand',
);
assert.ok(
  sortedIds('tiers **HIG-EXP-001**\u2013**014**').includes('HIG-EXP-007'),
  'wider en dash ranges include interior IDs',
);

const quick29 = extractQuickNumberedRules(read('HIG-QUICK.md')).find((row) => row.number === 29);
assert.ok(quick29, 'HIG-QUICK.md should include Quick #29');
assert.deepEqual(
  sortedIds(quick29.line),
  seoRange,
  'Quick #29 citation expands to HIG-SEO-001–003',
);

const mapYaml = read('rules/quick-rule-map.yaml');
const { entries } = parseQuickRuleMapYaml(mapYaml);
const byNumber = new Map(entries.map((entry) => [entry.number, entry]));

assert.equal(byNumber.get(21).quick_only, true, 'Quick #21 is quick_only');
assert.deepEqual(byNumber.get(21).ids, [], 'Quick #21 lists no IDs');
assert.equal(byNumber.get(22).quick_only, true, 'Quick #22 is quick_only');
assert.deepEqual(byNumber.get(22).ids, [], 'Quick #22 lists no IDs');
assert.match(
  mapYaml,
  /number: 21\n {4}quick_only: true\n {4}# canonical ID pending \(F4\)/,
  'Quick #21 keeps the pending-ID comment',
);
assert.match(
  mapYaml,
  /number: 22\n {4}quick_only: true\n {4}# canonical ID pending \(F4\)/,
  'Quick #22 keeps the pending-ID comment',
);
assert.deepEqual(byNumber.get(29).ids, seoRange, 'Quick #29 maps to all three SEO IDs');
assert.deepEqual(byNumber.get(83).ids, ['HIG-DOC-005'], 'Quick #83 maps only to HIG-DOC-005');
assert.equal(byNumber.get(84).quick_only, true, 'Quick #84 stays unmapped');
assert.deepEqual(byNumber.get(84).ids, [], 'Quick #84 lists no IDs');

console.log('extract-rule-ids.test.mjs passed');

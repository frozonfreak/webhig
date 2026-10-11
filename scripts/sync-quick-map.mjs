#!/usr/bin/env node
/**
 * Build rules/quick-rule-map.yaml from HIG-QUICK.md + curated ID links.
 * Run: node scripts/sync-quick-map.mjs
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { extractQuickNumberedRules, extractRuleIds } from './lib/contract-parse.mjs';

const root = path.join(path.dirname(fileURLToPath(import.meta.url)), '..');

/** Curated Quick # → canonical IDs (when prose does not inline the ID). */
const MANUAL_IDS = {
  1: ['HIG-EXP-001'],
  31: ['HIG-LOD-001'],
  32: ['HIG-LOD-001'],
  33: ['HIG-EMP-001'],
  34: ['HIG-ERR-001'],
  39: ['HIG-NTF-001'],
  41: ['HIG-MUT-001'],
  43: ['HIG-MUT-001'],
  45: ['HIG-SSR-003'],
  46: ['HIG-MUT-002'],
  50: ['HIG-FRM-001'],
  58: ['HIG-TOK-001'],
  59: ['HIG-TOK-002'],
  66: ['HIG-A11Y-002'],
  67: ['HIG-A11Y-003'],
  68: ['HIG-A11Y-003'],
  69: ['HIG-A11Y-004'],
  70: ['HIG-A11Y-005'],
  72: ['HIG-A11Y-006'],
  73: ['HIG-A11Y-008'],
  76: ['HIG-A11Y-001'],
  81: ['HIG-SSR-001'],
  85: ['HIG-MOT-001'],
  86: ['HIG-MOT-004'],
  87: ['HIG-MOT-002'],
  91: ['HIG-SEC-001'],
  92: ['HIG-SEC-002'],
  93: ['HIG-SEC-003'],
  94: ['HIG-SEC-004'],
  30: ['HIG-SRCH-003'],
  82: ['HIG-PERF-001', 'HIG-PERF-002'],
  83: ['HIG-DOC-005'],
};

/**
 * Quick bullets that stay quick_only until a canonical ID exists.
 * Emitted as YAML comments (the map parser and validator have no note field).
 */
const QUICK_ONLY_NOTES = {
  21: 'canonical ID pending (F4)',
  22: 'canonical ID pending (F4)',
};

function read(file) {
  return fs.readFileSync(path.join(root, file), 'utf8');
}

const version = read('VERSION').trim();
const quickText = read('HIG-QUICK.md');
const numbered = extractQuickNumberedRules(quickText);

const lines = [
  '# The Web HIG — Layer 1 Quick rule ↔ rule ID map',
  `# Version: ${version}`,
  '# Normative Quick prose: HIG-QUICK.md · IDs: rules/registry.yaml',
  '# Regenerate: npm run sync:quick-map',
  '',
  `version: "${version}"`,
  '',
  'entries:',
];

/** Meta bullets that mention IDs only as examples — do not treat as mappings. */
const SKIP_INLINE_IDS = new Set([5]);

for (const { number, line } of numbered) {
  const inline = SKIP_INLINE_IDS.has(number) ? [] : [...extractRuleIds(line)];
  const manual = MANUAL_IDS[number] ?? [];
  const ids = [...new Set([...inline, ...manual])].sort();
  const quickOnly = ids.length === 0;

  lines.push(`  - number: ${number}`);
  if (quickOnly) {
    lines.push('    quick_only: true');
    const note = QUICK_ONLY_NOTES[number];
    if (note) lines.push(`    # ${note}`);
  } else {
    lines.push('    ids:');
    for (const id of ids) lines.push(`      - ${id}`);
  }
}

const outPath = path.join(root, 'rules/quick-rule-map.yaml');
fs.writeFileSync(outPath, `${lines.join('\n')}\n`, 'utf8');
console.log(`Wrote ${path.relative(root, outPath)} (${numbered.length} Quick rules)`);

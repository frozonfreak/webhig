#!/usr/bin/env node
/**
 * Build rules/quick-rule-map.yaml from HIG-QUICK.md + reviewed section/ID links.
 * Run: node scripts/sync-quick-map.mjs           (write the map)
 *      node scripts/sync-quick-map.mjs --check   (exit 1 if the committed map is stale)
 *
 * How links are made (never by position or order):
 * 1. IDs written in the bullet text (`HIG-SEO-001–003` ranges expanded).
 * 2. Reviewed `ids` in QUICK_REVIEW below, for bullets whose prose has no inline ID.
 * Every linked bullet carries a reviewed `section`: the HIG.md section whose prose
 * states the bullet's obligation. When HIG.md states an obligation only in the
 * §7.2 agent-guardrail YAML, the section HIG-LITE.md and the Level 2 module file it
 * under is used. Each link must match the ID's registry hig_section, or be listed in
 * SECTION_EXCEPTIONS with a reason; otherwise this script fails.
 * Each review row carries an `anchor` that must appear in that bullet's text, so a
 * renumbered Quick list fails loudly instead of shifting links onto other bullets.
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import YAML from 'yaml';
import { extractQuickNumberedRules } from './lib/contract-parse.mjs';
import { PENDING_ID_NOTE, buildQuickMap } from './lib/quick-map.mjs';

const root = path.join(path.dirname(fileURLToPath(import.meta.url)), '..');

/**
 * Reviewed Quick bullets, keyed by Quick #.
 * - anchor: text that must appear in the bullet (guards against renumbering)
 * - section: HIG.md section of the bullet's obligation (required when linked)
 * - ids: canonical IDs linked although the bullet does not inline them
 * - note: quick_only with this YAML comment (no canonical ID yet)
 * - skipInlineIds: bullet mentions IDs only as examples
 */
export const QUICK_REVIEW = {
  1: { anchor: 'Resolve the page archetype', section: '§0.1', ids: ['HIG-EXP-001'] },
  4: { anchor: 'Prefer the simplest implementation', section: 'Exception System' },
  5: { anchor: 'When a rule has a canonical ID', skipInlineIds: true },
  21: { anchor: 'URL must be the single source of truth', note: PENDING_ID_NOTE },
  22: { anchor: 'Deep links must restore', note: PENDING_ID_NOTE },
  25: { anchor: 'exactly one primary `<main>` landmark', section: '§2.1' },
  26: { anchor: '`<html lang=', section: '§2.1' },
  27: { anchor: 'unique, descriptive `<title>`', section: '§2.1' },
  29: { anchor: 'SEO-critical pages', section: '§2.1' },
  30: { anchor: 'Search results must be keyboard-navigable', section: '§2.9' },
  31: { anchor: 'Every asynchronous operation must have a defined state', note: PENDING_ID_NOTE },
  32: { anchor: 'loading taxonomy', section: '§2.7', ids: ['HIG-LOD-001'] },
  33: { anchor: 'Empty states must explain', section: '§2.6', ids: ['HIG-EMP-001'] },
  34: { anchor: 'Error states must say what failed', section: '§2.5', ids: ['HIG-ERR-001'] },
  39: { anchor: 'Notifications must follow the taxonomy', section: '§2.10', ids: ['HIG-NTF-001'] },
  41: {
    anchor: 'confirmation proportional to severity',
    section: '§2.4',
    note: PENDING_ID_NOTE,
  },
  43: {
    anchor: 'Never use optimistic UI for destructive confirmation',
    section: '§2.4',
    ids: ['HIG-MUT-001'],
  },
  45: { anchor: 'Server mutations must show pending UI', section: '§4.2', ids: ['HIG-SSR-003'] },
  46: { anchor: 'Optimistic updates are allowed only', section: '§4.2', note: PENDING_ID_NOTE },
  50: { anchor: 'associated visible label', section: '§2.11', ids: ['HIG-FRM-001'] },
  58: { anchor: 'no raw hex in component code', section: '§3.1', ids: ['HIG-TOK-001'] },
  59: { anchor: 'semantic or component tokens', section: '§3.1', ids: ['HIG-TOK-002'] },
  65: { anchor: 'container queries', section: '§3.2' },
  66: { anchor: 'Target WCAG 2.2 Level AA', section: '§5.1', ids: ['HIG-A11Y-002'] },
  67: {
    anchor: 'native HTML elements before reaching for ARIA',
    section: '§5.2',
    ids: ['HIG-A11Y-003'],
  },
  68: { anchor: 'Never use `<div onClick>`', section: '§5.2', ids: ['HIG-A11Y-003'] },
  69: {
    anchor: 'Every control must have an accessible name',
    section: '§5.2',
    ids: ['HIG-A11Y-004'],
  },
  70: { anchor: 'meaningful `alt` text', section: '§5.2', ids: ['HIG-A11Y-005'] },
  72: { anchor: 'Focus must be visible', section: '§5.3', ids: ['HIG-A11Y-006'] },
  73: { anchor: 'Modals must trap focus', section: '§5.3', ids: ['HIG-A11Y-008'] },
  75: { anchor: 'at least 24×24 CSS px', section: '§5.4' },
  76: { anchor: 'Respect `prefers-reduced-motion`', section: '§1.3', ids: ['HIG-A11Y-001'] },
  81: { anchor: 'Default to server rendering', section: '§4.1', ids: ['HIG-SSR-001'] },
  82: { anchor: 'Protect Core Web Vitals', section: '§6.1' },
  83: { anchor: 'Images must declare dimensions', section: '§2.1', ids: ['HIG-DOC-005'] },
  85: { anchor: 'must not use `transition: all`', section: '§1.1', ids: ['HIG-MOT-001'] },
  86: { anchor: 'must complete within 300 ms', section: '§1.4', ids: ['HIG-MOT-004'] },
  87: { anchor: 'Use motion duration tokens', section: '§1.4', ids: ['HIG-MOT-002'] },
  88: { anchor: 'virtual scrolling', section: '§3.3' },
  91: { anchor: 'Never embed secrets', section: '§9.4', ids: ['HIG-SEC-001'] },
  92: { anchor: 'Content Security Policy', section: '§9.1', ids: ['HIG-SEC-002'] },
  93: {
    anchor: 'Sanitize all user-generated content',
    section: '§9.2',
    note: PENDING_ID_NOTE,
  },
  94: { anchor: 'CSRF protection', section: '§9.2', note: PENDING_ID_NOTE },
};

/** Reviewed cross-section links. Each entry needs a reason; validate fails on any other mismatch. */
export const SECTION_EXCEPTIONS = [
  {
    quick: 1,
    id: 'HIG-EXP-001',
    reason:
      'Quick #1 covers two Layer 0 steps: resolve the archetype (§0.1) and, for content, resolve the surface (§0.3). It cites HIG-EXP-* inline for the surface step, and HIG-EXP-001 (declare surface in scope) is that step.',
  },
  {
    quick: 65,
    id: 'HIG-SIM-001',
    reason:
      'Quick #65 is a §3.2 container-query bullet that cites HIG-SIM-001 inline to forbid adding containers only to satisfy the rule. HIG.md states that guard in the Exception System agent rule (registry: Exception System, §7.2).',
  },
  {
    quick: 82,
    id: 'HIG-PERF-002',
    reason:
      'Quick #82 states the §6.1 Core Web Vitals thresholds and cites HIG-PERF-002 inline because INP is judged in the field. The lab/field gate split it points to is §6.2–6.3.',
  },
  {
    quick: 87,
    id: 'HIG-MOT-002',
    reason:
      'Quick #87 restates the §1.4 "Tokenized timing" rule (do not invent per-component millisecond values). HIG-MOT-002 is filed under §3.1, where the motion duration tokens are defined.',
  },
];

function read(file) {
  return fs.readFileSync(path.join(root, file), 'utf8');
}

export function registrySectionsFrom(registryYamlText) {
  const doc = YAML.parse(registryYamlText);
  return new Map(Object.entries(doc.rules ?? {}).map(([id, rule]) => [id, rule.hig_section]));
}

function main() {
  const version = read('VERSION').trim();
  const numbered = extractQuickNumberedRules(read('HIG-QUICK.md'));
  const registrySections = registrySectionsFrom(read('rules/registry.yaml'));
  const { yaml } = buildQuickMap({
    version,
    numbered,
    review: QUICK_REVIEW,
    sectionExceptions: SECTION_EXCEPTIONS,
    registrySections,
  });

  const outPath = path.join(root, 'rules/quick-rule-map.yaml');
  const rel = path.relative(root, outPath);
  if (process.argv.includes('--check')) {
    const current = fs.existsSync(outPath) ? fs.readFileSync(outPath, 'utf8') : '';
    if (current !== yaml) {
      console.error(`${rel} is out of date; run npm run sync:quick-map`);
      process.exit(1);
    }
    console.log(`${rel} is up to date (${numbered.length} Quick rules)`);
    return;
  }
  fs.writeFileSync(outPath, yaml, 'utf8');
  console.log(`Wrote ${rel} (${numbered.length} Quick rules)`);
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  try {
    main();
  } catch (err) {
    console.error(err.message);
    process.exit(1);
  }
}

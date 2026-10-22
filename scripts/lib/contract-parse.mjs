/**
 * Shared parsers for HIG contract validation and tests.
 */
import fs from 'node:fs';
import path from 'node:path';
import YAML from 'yaml';

/**
 * Collect canonical rule IDs from prose.
 * A citation range expands to every ID in the inclusive span:
 * `HIG-SEO-001–003` (en dash) and `HIG-SEO-001-003` (hyphen), including
 * Markdown bold on either side (`**HIG-SEO-001**–**003**`).
 */
export function extractRuleIds(text) {
  const ids = new Set();
  for (const match of text.matchAll(/HIG-[A-Z0-9]+-\d+/g)) {
    ids.add(match[0]);
  }

  // Keep the span on one line so a YAML list marker on the next line is not a range dash.
  const rangeRe = /HIG-([A-Z0-9]+)-(\d+)\*{0,2}[ \t]*[\u2013-][ \t]*\*{0,2}(\d+)/g;
  for (const match of text.matchAll(rangeRe)) {
    const moduleCode = match[1];
    const startRaw = match[2];
    const endRaw = match[3];
    const start = Number(startRaw);
    const end = Number(endRaw);
    if (!Number.isInteger(start) || !Number.isInteger(end) || end < start || end - start > 30) {
      continue;
    }
    const width = Math.max(startRaw.length, endRaw.length);
    for (let n = start; n <= end; n += 1) {
      ids.add(`HIG-${moduleCode}-${String(n).padStart(width, '0')}`);
    }
  }

  return ids;
}

export function extractQuickNumberedRules(text) {
  const rules = [];
  for (const line of text.split(/\r?\n/)) {
    const match = line.match(/^(\d+)\.\s+(.+)$/);
    if (!match) continue;
    rules.push({ number: Number(match[1]), line: match[2].trim() });
  }
  return rules;
}

export function extractIndexRegistry(text) {
  const block =
    text.split('## Complete rule ID registry')[1]?.split('## Archetype applicability')[0] ?? '';
  const rows = [];
  const seen = new Set();
  for (const line of block.split(/\r?\n/)) {
    const match = line.match(/^\|\s*(HIG-[A-Z0-9]+-\d+)\s*\|\s*([^|]+)\|\s*([^|]+)\|\s*([^|]+)\|/);
    if (!match) continue;
    const id = match[1];
    if (seen.has(id)) {
      throw new Error(`INDEX.md duplicate rule ID: ${id}`);
    }
    seen.add(id);
    rows.push({
      id,
      summary: match[2].trim(),
      module: match[3].trim(),
      hig_section: match[4].trim(),
    });
  }
  return rows;
}

export function parseQuickRuleMapYaml(text) {
  const doc = YAML.parse(text) ?? {};
  const version = doc.version === undefined ? undefined : String(doc.version);
  const entries = (Array.isArray(doc.entries) ? doc.entries : []).map((raw) => {
    const entry = {
      number: Number(raw?.number),
      ids: Array.isArray(raw?.ids) ? raw.ids.map(String) : [],
      quick_only: raw?.quick_only === true,
    };
    if (raw?.hig_section !== undefined && raw?.hig_section !== null) {
      entry.hig_section = String(raw.hig_section);
    }
    return entry;
  });
  const sectionExceptions = (
    Array.isArray(doc.section_exceptions) ? doc.section_exceptions : []
  ).map((raw) => ({
    quick: Number(raw?.quick),
    id: String(raw?.id ?? ''),
    reason: raw?.reason === undefined || raw?.reason === null ? '' : String(raw.reason),
  }));
  return { version, entries, sectionExceptions };
}

export function readRepoFile(root, file) {
  return fs.readFileSync(path.join(root, file), 'utf8');
}

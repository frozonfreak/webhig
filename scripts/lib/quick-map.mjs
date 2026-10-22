/**
 * Quick rule ↔ rule ID map: section matching shared by the generator
 * (scripts/sync-quick-map.mjs), the validator, and tests.
 *
 * A Quick bullet's section is the HIG.md section whose prose states the
 * bullet's obligation. HIG-QUICK.md groups bullets by topic, not by HIG.md
 * section, so the section cannot be derived from the Quick file. It is a
 * reviewed field (`hig_section`) recorded per bullet in the generator and
 * emitted into rules/quick-rule-map.yaml.
 *
 * A link (Quick # → HIG-* ID) is accepted only when the ID's registry
 * `hig_section` includes the bullet's section, or when the pair is listed in
 * `section_exceptions` with a written reason. Links never come from position
 * or order.
 */
import { extractRuleIds } from './contract-parse.mjs';

export const PENDING_ID_NOTE = 'canonical ID pending (F4)';

/**
 * Split a registry or bullet `hig_section` into comparable section keys.
 * `§2.1` → ['§2.1']; `§6.2–6.3` → ['§6.2', '§6.3'];
 * `Exception System, §7.2` → ['Exception System', '§7.2'].
 */
export function sectionKeys(value) {
  const keys = [];
  for (const rawPart of String(value ?? '').split(',')) {
    const part = rawPart.trim();
    if (!part) continue;
    const range = part.match(/^§(\d+)\.(\d+)\s*[\u2013-]\s*(?:§?(\d+)\.)?(\d+)$/);
    if (range) {
      const major = range[1];
      const endMajor = range[3] ?? major;
      const start = Number(range[2]);
      const end = Number(range[4]);
      if (endMajor !== major || end < start) {
        keys.push(part);
        continue;
      }
      for (let n = start; n <= end; n += 1) keys.push(`§${major}.${n}`);
      continue;
    }
    keys.push(part);
  }
  return keys;
}

/** True when the bullet's single section is one of the registry entry's sections. */
export function sectionMatches(bulletSection, registrySection) {
  const bullet = sectionKeys(bulletSection);
  if (bullet.length !== 1) return false;
  return sectionKeys(registrySection).includes(bullet[0]);
}

/** True when HIG.md has a heading for the section key (`### 9.2 …` or `## Exception System`). */
export function higHasSection(higText, section) {
  const keys = sectionKeys(section);
  if (keys.length !== 1) return false;
  const key = keys[0];
  const numbered = key.match(/^§(\d+(?:\.\d+)*)$/);
  const lines = higText.split(/\r?\n/);
  if (numbered) {
    const escaped = numbered[1].replace(/\./g, '\\.');
    const re = new RegExp(`^#{2,4}\\s+${escaped}\\s`);
    return lines.some((line) => re.test(line));
  }
  return lines.some((line) => /^#{2,4}\s+/.test(line) && line.replace(/^#+\s+/, '').trim() === key);
}

/**
 * Check Quick map entries against registry sections.
 * @param {object} input
 * @param {Array<{number:number, ids:string[], quick_only:boolean, hig_section?:string}>} input.entries
 * @param {Array<{quick:number, id:string, reason:string}>} input.sectionExceptions
 * @param {Map<string,string>} input.registrySections ID → registry hig_section
 * @param {string} [input.higText] HIG.md text; when given, bullet sections must exist as headings
 * @returns {string[]} error messages (empty when the map is consistent)
 */
export function checkQuickMapSections({
  entries,
  sectionExceptions = [],
  registrySections,
  higText,
}) {
  const errors = [];
  const byNumber = new Map(entries.map((entry) => [entry.number, entry]));
  const exceptionKeys = new Map();

  for (const exception of sectionExceptions) {
    const key = `${exception.quick} ${exception.id}`;
    if (exceptionKeys.has(key)) {
      errors.push(
        `section_exceptions: duplicate entry for Quick #${exception.quick} → ${exception.id}`,
      );
      continue;
    }
    exceptionKeys.set(key, exception);
    if (!String(exception.reason ?? '').trim()) {
      errors.push(`section_exceptions: Quick #${exception.quick} → ${exception.id} needs a reason`);
    }
    const entry = byNumber.get(exception.quick);
    if (!entry || !entry.ids.includes(exception.id)) {
      errors.push(
        `section_exceptions: Quick #${exception.quick} does not link ${exception.id}; remove the stale exception`,
      );
      continue;
    }
    const registrySection = registrySections.get(exception.id);
    if (
      entry.hig_section &&
      registrySection &&
      sectionMatches(entry.hig_section, registrySection)
    ) {
      errors.push(
        `section_exceptions: Quick #${exception.quick} → ${exception.id} is not cross-section (${entry.hig_section}); remove the exception`,
      );
    }
  }

  for (const entry of entries) {
    if (entry.hig_section !== undefined) {
      if (sectionKeys(entry.hig_section).length !== 1) {
        errors.push(
          `Quick #${entry.number}: hig_section must name exactly one section (${entry.hig_section})`,
        );
      } else if (higText && !higHasSection(higText, entry.hig_section)) {
        errors.push(
          `Quick #${entry.number}: hig_section ${entry.hig_section} is not a HIG.md section`,
        );
      }
    }
    if (!entry.ids.length) continue;
    if (!entry.hig_section) {
      errors.push(`Quick #${entry.number}: linked entries must declare hig_section`);
      continue;
    }
    for (const id of entry.ids) {
      const registrySection = registrySections.get(id);
      if (registrySection === undefined) continue; // unknown IDs are reported elsewhere
      if (sectionMatches(entry.hig_section, registrySection)) continue;
      if (exceptionKeys.has(`${entry.number} ${id}`)) continue;
      errors.push(
        `Quick #${entry.number} (${entry.hig_section}) → ${id} (${registrySection}): section mismatch; fix the link or add a section_exceptions entry with a reason`,
      );
    }
  }
  return errors;
}

/**
 * Build rules/quick-rule-map.yaml text.
 * Links per bullet = IDs written in the bullet (ranges expanded) ∪ reviewed `ids`.
 * Throws when a reviewed anchor no longer matches its bullet, when a linked bullet
 * has no reviewed section, or when any link fails the section check.
 */
export function buildQuickMap({ version, numbered, review, sectionExceptions, registrySections }) {
  const problems = [];
  const byNumber = new Map(numbered.map((row) => [row.number, row]));

  for (const [key, item] of Object.entries(review)) {
    const number = Number(key);
    const row = byNumber.get(number);
    if (!row) {
      problems.push(`review: Quick #${number} does not exist in HIG-QUICK.md`);
    } else if (!item.anchor || !row.line.includes(item.anchor)) {
      problems.push(
        `review: Quick #${number} anchor ${JSON.stringify(item.anchor)} not found in bullet text (was the Quick list renumbered?)`,
      );
    }
    if (item.note && item.ids?.length) {
      problems.push(`review: Quick #${number} cannot carry both ids and a quick_only note`);
    }
  }

  const entries = [];
  for (const { number, line } of numbered) {
    const item = review[number] ?? {};
    const inline = item.skipInlineIds ? [] : [...extractRuleIds(line)];
    const ids = item.note ? [] : [...new Set([...inline, ...(item.ids ?? [])])].sort();
    if (item.note && inline.length) {
      problems.push(
        `review: Quick #${number} names ${inline.join(', ')} inline but is marked quick_only`,
      );
    }
    entries.push({
      number,
      ids,
      quick_only: ids.length === 0,
      hig_section: item.section,
      note: ids.length === 0 ? item.note : undefined,
    });
  }

  problems.push(...checkQuickMapSections({ entries, sectionExceptions, registrySections }));
  if (problems.length) {
    const err = new Error(`Quick map review failed:\n  - ${problems.join('\n  - ')}`);
    err.problems = problems;
    throw err;
  }

  const lines = [
    '# The Web HIG — Layer 1 Quick rule ↔ rule ID map',
    `# Version: ${version}`,
    '# Normative Quick prose: HIG-QUICK.md · IDs: rules/registry.yaml',
    '# Regenerate: npm run sync:quick-map',
    '#',
    "# hig_section: the HIG.md section whose prose states the Quick bullet's obligation",
    '# (reviewed in scripts/sync-quick-map.mjs; required on linked entries). Every linked',
    "# ID's registry hig_section must include it. Cross-section links are allowed only",
    '# when listed in section_exceptions with a reason (npm run validate enforces this).',
    '',
    `version: "${version}"`,
    '',
    'section_exceptions:',
  ];
  for (const exception of sectionExceptions) {
    lines.push(`  - quick: ${exception.quick}`);
    lines.push(`    id: ${exception.id}`);
    lines.push(`    reason: ${JSON.stringify(exception.reason)}`);
  }
  lines.push('', 'entries:');
  for (const entry of entries) {
    lines.push(`  - number: ${entry.number}`);
    if (entry.hig_section) lines.push(`    hig_section: ${JSON.stringify(entry.hig_section)}`);
    if (entry.quick_only) {
      lines.push('    quick_only: true');
      if (entry.note) lines.push(`    # ${entry.note}`);
    } else {
      lines.push('    ids:');
      for (const id of entry.ids) lines.push(`      - ${id}`);
    }
  }
  return { yaml: `${lines.join('\n')}\n`, entries };
}

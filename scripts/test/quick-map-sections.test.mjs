import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { extractQuickNumberedRules, parseQuickRuleMapYaml } from '../lib/contract-parse.mjs';
import {
  PENDING_ID_NOTE,
  buildQuickMap,
  checkQuickMapSections,
  higHasSection,
  sectionKeys,
  sectionMatches,
} from '../lib/quick-map.mjs';
import { QUICK_REVIEW, SECTION_EXCEPTIONS, registrySectionsFrom } from '../sync-quick-map.mjs';

const root = path.join(path.dirname(fileURLToPath(import.meta.url)), '..', '..');

function read(file) {
  return fs.readFileSync(path.join(root, file), 'utf8');
}

const higText = read('HIG.md');
const registrySections = registrySectionsFrom(read('rules/registry.yaml'));
const numbered = extractQuickNumberedRules(read('HIG-QUICK.md'));
const mapYaml = read('rules/quick-rule-map.yaml');
const map = parseQuickRuleMapYaml(mapYaml);

function clone(value) {
  return structuredClone(value);
}

function withEntry(entries, number, patch) {
  return entries.map((entry) => (entry.number === number ? { ...entry, ...patch } : entry));
}

function check(entries, sectionExceptions = map.sectionExceptions) {
  return checkQuickMapSections({ entries, sectionExceptions, registrySections, higText });
}

// --- Section keys ---
assert.deepEqual(sectionKeys('§2.1'), ['§2.1'], 'single section');
assert.deepEqual(sectionKeys('§6.2–6.3'), ['§6.2', '§6.3'], 'en dash section range expands');
assert.deepEqual(
  sectionKeys('Exception System, §7.2'),
  ['Exception System', '§7.2'],
  'lists split',
);
assert.ok(sectionMatches('§9.4', '§9.4'), 'same section matches');
assert.ok(!sectionMatches('§9.2', '§9.4'), '§9.2 does not match §9.4');
assert.ok(!sectionMatches('§2.1', '§2.10'), '§2.1 does not match §2.10');
assert.ok(sectionMatches('§6.3', '§6.2–6.3'), 'range member matches');
assert.ok(sectionMatches('Exception System', 'Exception System, §7.2'), 'named section matches');
assert.ok(higHasSection(higText, '§9.2'), 'HIG.md has §9.2');
assert.ok(higHasSection(higText, '§7.2'), 'HIG.md has §7.2');
assert.ok(higHasSection(higText, 'Exception System'), 'HIG.md has the Exception System section');
assert.ok(!higHasSection(higText, '§9.9'), 'HIG.md has no §9.9');

// --- Committed map passes ---
assert.deepEqual(check(map.entries), [], 'committed quick-rule-map.yaml passes the section check');

const byNumber = new Map(map.entries.map((entry) => [entry.number, entry]));
assert.deepEqual(byNumber.get(91).ids, ['HIG-SEC-001'], 'Quick #91 keeps HIG-SEC-001');
assert.equal(byNumber.get(91).hig_section, '§7.2', 'Quick #91 is filed under §7.2');
assert.ok(
  map.sectionExceptions.some((e) => e.quick === 91 && e.id === 'HIG-SEC-001'),
  'Quick #91 → HIG-SEC-001 is a reviewed section exception',
);
assert.deepEqual(byNumber.get(92).ids, ['HIG-SEC-002'], 'Quick #92 keeps HIG-SEC-002');
for (const n of [93, 94]) {
  assert.equal(byNumber.get(n).quick_only, true, `Quick #${n} is quick_only`);
  assert.deepEqual(byNumber.get(n).ids, [], `Quick #${n} lists no IDs`);
  assert.equal(byNumber.get(n).hig_section, '§9.2', `Quick #${n} is filed under §9.2`);
  assert.match(
    mapYaml,
    new RegExp(
      `number: ${n}\\n {4}hig_section: "§9\\.2"\\n {4}quick_only: true\\n {4}# canonical ID pending \\(F4\\)`,
    ),
    `Quick #${n} keeps the pending-ID comment`,
  );
}
for (const entry of map.entries) {
  if (entry.ids.length)
    assert.ok(entry.hig_section, `linked Quick #${entry.number} has hig_section`);
}

// --- Old #93 → HIG-SEC-003 / #94 → HIG-SEC-004 links fail ---
let oldLinks = withEntry(map.entries, 93, { ids: ['HIG-SEC-003'], quick_only: false });
oldLinks = withEntry(oldLinks, 94, { ids: ['HIG-SEC-004'], quick_only: false });
const oldErrors = check(oldLinks);
assert.equal(oldErrors.length, 2, `old links give two errors: ${oldErrors.join(' | ')}`);
assert.ok(
  oldErrors.some((e) => e.includes('Quick #93 (§9.2) → HIG-SEC-003 (§9.4)')),
  '#93 fails',
);
assert.ok(
  oldErrors.some((e) => e.includes('Quick #94 (§9.2) → HIG-SEC-004 (§9.3)')),
  '#94 fails',
);

// The generator refuses the old hard-coded links too.
const oldReview = clone(QUICK_REVIEW);
oldReview[93] = { anchor: QUICK_REVIEW[93].anchor, section: '§9.2', ids: ['HIG-SEC-003'] };
oldReview[94] = { anchor: QUICK_REVIEW[94].anchor, section: '§9.2', ids: ['HIG-SEC-004'] };
assert.throws(
  () =>
    buildQuickMap({
      version: '0.0.0',
      numbered,
      review: oldReview,
      sectionExceptions: SECTION_EXCEPTIONS,
      registrySections,
    }),
  (err) => err.problems.length === 2 && err.problems.every((p) => p.includes('section mismatch')),
  'sync-quick-map refuses #93 → HIG-SEC-003 and #94 → HIG-SEC-004',
);

// --- Linked entries must declare a section ---
const noSection = withEntry(map.entries, 92, { hig_section: undefined });
assert.ok(
  check(noSection).some((e) => e.includes('Quick #92: linked entries must declare hig_section')),
  'a linked entry without hig_section fails',
);
assert.ok(
  check(withEntry(map.entries, 92, { hig_section: '§9.9' })).some((e) =>
    e.includes('not a HIG.md section'),
  ),
  'an unknown HIG.md section fails',
);

// --- Exceptions: reason required, no stale or same-section entries ---
assert.ok(SECTION_EXCEPTIONS.length > 0, 'the map has reviewed exceptions');
const withoutExceptions = check(map.entries, []);
assert.equal(
  withoutExceptions.length,
  map.sectionExceptions.length,
  'every exception is needed: removing them all fails one link each',
);
const noReason = map.sectionExceptions.map((e, i) => (i === 0 ? { ...e, reason: ' ' } : e));
assert.ok(
  check(map.entries, noReason).some((e) => e.includes('needs a reason')),
  'reason required',
);
const stale = [...map.sectionExceptions, { quick: 92, id: 'HIG-SEC-003', reason: 'stale' }];
assert.ok(
  check(map.entries, stale).some((e) => e.includes('stale exception')),
  'stale fails',
);
const sameSection = [...map.sectionExceptions, { quick: 92, id: 'HIG-SEC-002', reason: 'x' }];
assert.ok(
  check(map.entries, sameSection).some((e) => e.includes('is not cross-section')),
  'an exception for a same-section link fails',
);

// --- Reviewed rows are anchored to bullet text, not to position ---
const swapped = numbered.map((row) => {
  if (row.number === 93) return { ...row, line: numbered.find((r) => r.number === 94).line };
  if (row.number === 94) return { ...row, line: numbered.find((r) => r.number === 93).line };
  return row;
});
assert.throws(
  () =>
    buildQuickMap({
      version: '0.0.0',
      numbered: swapped,
      review: QUICK_REVIEW,
      sectionExceptions: SECTION_EXCEPTIONS,
      registrySections,
    }),
  (err) => err.problems.some((p) => p.includes('Quick #93 anchor')),
  'a renumbered Quick list fails instead of shifting links',
);
assert.equal(QUICK_REVIEW[93].note, PENDING_ID_NOTE, 'Quick #93 carries the pending-ID note');

// --- Committed map is what the generator writes ---
const syncCheck = spawnSync(process.execPath, ['scripts/sync-quick-map.mjs', '--check'], {
  cwd: root,
  encoding: 'utf8',
});
assert.equal(syncCheck.status, 0, syncCheck.stderr || syncCheck.stdout);

// --- End to end: validate-hig fails on a copy carrying the old links ---
const tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'hig-quick-map-'));
try {
  fs.cpSync(root, tmp, {
    recursive: true,
    filter: (src) => !/[\\/](node_modules|\.git)$/.test(src),
  });
  fs.symlinkSync(path.join(root, 'node_modules'), path.join(tmp, 'node_modules'), 'dir');
  const pending = `    quick_only: true\n    # ${PENDING_ID_NOTE}`;
  const oldMap = mapYaml
    .replace(
      `  - number: 93\n    hig_section: "§9.2"\n${pending}`,
      '  - number: 93\n    hig_section: "§9.2"\n    ids:\n      - HIG-SEC-003',
    )
    .replace(
      `  - number: 94\n    hig_section: "§9.2"\n${pending}`,
      '  - number: 94\n    hig_section: "§9.2"\n    ids:\n      - HIG-SEC-004',
    );
  assert.notEqual(oldMap, mapYaml, 'fixture rewrites #93/#94');
  fs.writeFileSync(path.join(tmp, 'rules/quick-rule-map.yaml'), oldMap, 'utf8');
  const run = spawnSync(process.execPath, ['scripts/validate-hig.mjs'], {
    cwd: tmp,
    encoding: 'utf8',
  });
  assert.notEqual(run.status, 0, 'validate-hig fails with the old #93/#94 links');
  assert.match(run.stderr, /Quick #93 \(§9\.2\) → HIG-SEC-003 \(§9\.4\): section mismatch/);
  assert.match(run.stderr, /Quick #94 \(§9\.2\) → HIG-SEC-004 \(§9\.3\): section mismatch/);
} finally {
  fs.rmSync(tmp, { recursive: true, force: true });
}

console.log('quick-map-sections.test.mjs passed');

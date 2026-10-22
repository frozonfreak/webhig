#!/usr/bin/env node
/**
 * The Web HIG — contract validation (Phase 3)
 * Run: node scripts/validate-hig.mjs
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { PUBLIC_DOC_PAGES, SITE, SITEMAP_PATHS } from './doc-site.mjs';
import {
  extractIndexRegistry,
  extractQuickNumberedRules,
  extractRuleIds,
  parseQuickRuleMapYaml,
} from './lib/contract-parse.mjs';
import { checkQuickMapSections } from './lib/quick-map.mjs';

const root = path.join(path.dirname(fileURLToPath(import.meta.url)), '..');
const errors = [];
const warnings = [];

function read(file) {
  return fs.readFileSync(path.join(root, file), 'utf8');
}

function exists(file) {
  return fs.existsSync(path.join(root, file));
}

function fail(msg) {
  errors.push(msg);
}

function warn(msg) {
  warnings.push(msg);
}

function extractManifestFiles(yaml) {
  const files = new Set();
  for (const match of yaml.matchAll(/^\s+file:\s+(\S+)/gm)) {
    files.add(match[1].replace(/#.*$/, '').trim());
  }
  return files;
}

function extractVersionFromTitle(md) {
  const m = md.match(/^#\s+.+\s+v(\d+\.\d+\.\d+)/m);
  return m ? m[1] : null;
}

function repoPath(filePath) {
  return path.relative(root, filePath).split(path.sep).join('/');
}

function walkFiles(dir, predicate, out = []) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    if (entry.name === '.git' || entry.name === 'node_modules') continue;
    const filePath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      walkFiles(filePath, predicate, out);
    } else if (predicate(filePath)) {
      out.push(filePath);
    }
  }
  return out;
}

function githubSlug(heading) {
  return heading
    .trim()
    .replace(/<[^>]*>/g, '')
    .replace(/[`*_~[\]]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9\- ]/g, '')
    .replace(/ /g, '-');
}

function markdownHeadingSlugs(filePath) {
  const slugs = new Map();
  const occurrences = new Map();
  for (const line of fs.readFileSync(filePath, 'utf8').split(/\r?\n/)) {
    const match = line.match(/^(#{1,6})\s+(.+)$/);
    if (!match) continue;
    const base = githubSlug(match[2]);
    const index = occurrences.get(base) ?? 0;
    occurrences.set(base, index + 1);
    slugs.set(index ? `${base}-${index}` : base, true);
  }
  return slugs;
}

// --- VERSION sync ---
const versionFile = read('VERSION').trim();
const manifestYaml = read('rules/manifest.yaml');
const manifestVersion = manifestYaml.match(/^version:\s*"([^"]+)"/m)?.[1];
const higVersion = extractVersionFromTitle(read('HIG.md'));
const liteVersion = read('HIG-LITE.md').match(/\*\*Version:\*\*\s+v(\d+\.\d+\.\d+)/)?.[1];
const coreVersion = read('HIG-CORE.md').match(/\*\*Version:\*\*\s+v(\d+\.\d+\.\d+)/)?.[1];
const quickVersion = read('HIG-QUICK.md').match(/\*\*Version:\*\*\s+v(\d+\.\d+\.\d+)/)?.[1];

if (!manifestVersion) fail('manifest.yaml: missing version field');
if (versionFile !== manifestVersion) {
  fail(`VERSION (${versionFile}) !== manifest.yaml (${manifestVersion})`);
}
if (higVersion !== versionFile) {
  fail(`HIG.md title (${higVersion}) !== VERSION (${versionFile})`);
}
if (liteVersion !== versionFile) {
  fail(`HIG-LITE.md (${liteVersion}) !== VERSION (${versionFile})`);
}
if (coreVersion !== versionFile) {
  fail(`HIG-CORE.md (${coreVersion}) !== VERSION (${versionFile})`);
}
if (quickVersion !== versionFile) {
  fail(`HIG-QUICK.md (${quickVersion}) !== VERSION (${versionFile})`);
}
if (!exists('HIG-QUICK.md')) {
  fail('missing HIG-QUICK.md (Layer 1 Quick Reference)');
}

for (const pkgRel of ['packages/install/package.json', 'packages/core/package.json', 'packages/cli/package.json']) {
  if (!exists(pkgRel)) continue;
  const pkg = JSON.parse(read(pkgRel));
  if (pkg.version !== versionFile) {
    fail(`${pkgRel} (${pkg.version}) !== VERSION (${versionFile})`);
  }
}

// --- Explicit version headers ---
for (const filePath of walkFiles(root, (file) => /\.(md|ya?ml)$/i.test(file))) {
  const rel = repoPath(filePath);
  const text = fs.readFileSync(filePath, 'utf8');
  for (const match of text.matchAll(/(?:\*\*Version:\*\*|# Version:)\s*v?(\d+\.\d+\.\d+)/g)) {
    if (match[1] !== versionFile) {
      fail(`${rel}: version header (${match[1]}) !== VERSION (${versionFile})`);
    }
  }
}

// --- Referenced files exist ---
for (const file of extractManifestFiles(manifestYaml)) {
  if (!exists(file)) {
    fail(`manifest references missing file: ${file}`);
  }
}

for (const match of manifestYaml.matchAll(/^\s+-\s+(rules\/[^\s#]+)/gm)) {
  const registryFile = match[1].trim();
  if (registryFile.startsWith('rules/') && registryFile.endsWith('.yaml') && !exists(registryFile)) {
    fail(`manifest registries references missing file: ${registryFile}`);
  }
}

// --- Archetype packs ---
const archetypeIds = ['content', 'commerce', 'application', 'auth'];
for (const id of archetypeIds) {
  const pack = `rules/archetypes/${id}.md`;
  if (!exists(pack)) fail(`missing archetype pack: ${pack}`);
}

if (!exists('rules/applicability.md')) {
  fail('missing rules/applicability.md');
}

if (!exists('rules/motion-tiers.yaml')) {
  fail('missing rules/motion-tiers.yaml');
}

for (const file of [
  'rules/evaluator-dimensions.yaml',
  'schema/evaluator-report.schema.json',
  'examples/evaluator-report.example.json',
  'EVALUATOR.md',
]) {
  if (!exists(file)) fail(`missing ${file}`);
}

const evalDimVersion = read('rules/evaluator-dimensions.yaml').match(/^version:\s*"([^"]+)"/m)?.[1];
if (evalDimVersion && evalDimVersion !== versionFile) {
  fail(`evaluator-dimensions.yaml (${evalDimVersion}) !== VERSION (${versionFile})`);
}

const motionTiersVersion = read('rules/motion-tiers.yaml').match(/^version:\s*"([^"]+)"/m)?.[1];
if (motionTiersVersion && motionTiersVersion !== versionFile) {
  fail(`motion-tiers.yaml (${motionTiersVersion}) !== VERSION (${versionFile})`);
}

// --- Module files registered in manifest ---
const rulesDir = path.join(root, 'rules');
const moduleFiles = fs
  .readdirSync(rulesDir)
  .filter((f) => f.endsWith('.md') && f !== 'INDEX.md' && f !== 'applicability.md')
  .map((f) => `rules/${f}`);

for (const file of moduleFiles) {
  if (!manifestYaml.includes(file)) {
    warn(`rules module not referenced in manifest: ${file}`);
  }
}

// --- Rule IDs: INDEX registry, manifest, HIG.md, modules ---
const indexText = read('rules/INDEX.md');
const higText = read('HIG.md');
const manifestRuleIds = extractRuleIds(manifestYaml);

let registry;
try {
  registry = extractIndexRegistry(indexText);
} catch (err) {
  fail(err.message);
  registry = [];
}
if (!registry.length) fail('INDEX.md complete rule ID registry is missing or empty');

const registryIds = new Set(registry.map((row) => row.id));

for (const { id, module } of registry) {
  if (!higText.includes(id)) {
    fail(`rule ID in INDEX registry but not HIG.md: ${id}`);
  }
  const moduleFile = `rules/${module}.md`;
  if (!exists(moduleFile)) {
    fail(`${id}: INDEX module file missing (${moduleFile})`);
  } else if (!read(moduleFile).includes(id)) {
    fail(`${id} not found in claimed module ${moduleFile}`);
  }
  if (!manifestRuleIds.has(id)) {
    fail(`rule ID in INDEX registry but not manifest.yaml: ${id}`);
  }
}

for (const id of manifestRuleIds) {
  if (!registryIds.has(id)) {
    fail(`rule ID in manifest.yaml but not INDEX.md registry: ${id}`);
  }
}

// --- Machine-readable rule registry (rules/registry.yaml) ---
function parseRegistryYaml(yaml) {
  const version = yaml.match(/^version:\s*"([^"]+)"/m)?.[1];
  const rules = new Map();
  for (const match of yaml.matchAll(/^  (HIG-[A-Z0-9]+-\d+):\r?\n((?:    .+\r?\n)*)/gm)) {
    const id = match[1];
    const body = match[2];
    const pick = (key) => body.match(new RegExp(`^    ${key}:\\s*(.+)$`, 'm'))?.[1]?.trim();
    const profiles = [...body.matchAll(/^    profiles:\r?\n((?:      - \S+\r?\n)*)/gm)][0];
    const profileList = profiles
      ? [...profiles[1].matchAll(/^      - (\S+)/gm)].map((m) => m[1])
      : [];
    const archetypeBlock = [...body.matchAll(/^    archetypes:\r?\n((?:      - \S+\r?\n)*)/gm)][0];
    const archetypeList = archetypeBlock
      ? [...archetypeBlock[1].matchAll(/^      - (\S+)/gm)].map((m) => m[1])
      : [];
    const evalBlock = [...body.matchAll(/^    evaluation:\r?\n((?:      - \S+\r?\n)*)/gm)][0];
    const evaluationList = evalBlock
      ? [...evalBlock[1].matchAll(/^      - (\S+)/gm)].map((m) => m[1])
      : [];

    rules.set(id, {
      severity: pick('severity'),
      requirement: pick('requirement')?.replace(/^"|"$/g, ''),
      profiles: profileList,
      archetypes: archetypeList,
      evaluation: evaluationList,
      autofix: pick('autofix'),
      module: pick('module'),
      hig_section: pick('hig_section')?.replace(/^"|"$/g, ''),
    });
  }
  return { version, rules };
}

const registryPath = 'rules/registry.yaml';
if (!exists(registryPath)) {
  fail(`missing ${registryPath}`);
} else {
  const registryYaml = read(registryPath);
  const { version: registryVersion, rules: registryRules } = parseRegistryYaml(registryYaml);
  if (!registryVersion) fail('registry.yaml: missing version field');
  if (registryVersion !== versionFile) {
    fail(`registry.yaml (${registryVersion}) !== VERSION (${versionFile})`);
  }
  if (!registryRules.size) fail('registry.yaml: no rules parsed');

  const allowedSeverity = new Set(['error', 'warning', 'info']);
  const allowedAutofix = new Set(['safe', 'unsafe', 'none']);
  const allowedEvaluation = new Set(['static', 'runtime', 'manual', 'observation']);
  const allowedProfiles = new Set(['quick', 'practical', 'full']);

  const indexById = new Map(registry.map((row) => [row.id, row]));

  for (const id of registryIds) {
    if (!registryRules.has(id)) {
      fail(`rule ID in INDEX.md but not registry.yaml: ${id}`);
    }
  }
  for (const id of registryRules.keys()) {
    if (!registryIds.has(id)) {
      fail(`rule ID in registry.yaml but not INDEX.md: ${id}`);
    }
  }

  for (const [id, row] of registryRules) {
    const indexRow = indexById.get(id);
    if (!row.severity || !allowedSeverity.has(row.severity)) {
      fail(`${id}: registry invalid or missing severity`);
    }
    if (!row.requirement) fail(`${id}: registry missing requirement`);
    if (!row.profiles?.length || row.profiles.some((p) => !allowedProfiles.has(p))) {
      fail(`${id}: registry invalid profiles`);
    }
    if (!row.archetypes?.length) fail(`${id}: registry missing archetypes`);
    if (!row.evaluation?.length || row.evaluation.some((e) => !allowedEvaluation.has(e))) {
      fail(`${id}: registry invalid evaluation`);
    }
    if (!row.autofix || !allowedAutofix.has(row.autofix)) {
      fail(`${id}: registry invalid autofix`);
    }
    if (row.module !== indexRow.module) {
      fail(`${id}: registry module (${row.module}) !== INDEX (${indexRow.module})`);
    }
    if (row.hig_section !== indexRow.hig_section) {
      fail(`${id}: registry hig_section (${row.hig_section}) !== INDEX (${indexRow.hig_section})`);
    }
  }
}

// --- Layer 1 Quick rules ↔ quick-rule-map.yaml ---
const quickText = read('HIG-QUICK.md');
const quickNumbered = extractQuickNumberedRules(quickText);
if (quickNumbered.length !== 98) {
  fail(`HIG-QUICK.md must contain exactly 98 numbered rules (found ${quickNumbered.length})`);
}
const quickNumbers = new Set(quickNumbered.map((row) => row.number));
for (let n = 1; n <= 98; n += 1) {
  if (!quickNumbers.has(n)) fail(`HIG-QUICK.md missing numbered rule ${n}`);
}

const quickMapPath = 'rules/quick-rule-map.yaml';
if (!exists(quickMapPath)) {
  fail(`missing ${quickMapPath}`);
} else {
  const quickMapYaml = read(quickMapPath);
  let parsedQuickMap = { version: undefined, entries: [], sectionExceptions: [] };
  try {
    parsedQuickMap = parseQuickRuleMapYaml(quickMapYaml);
  } catch (err) {
    fail(`quick-rule-map.yaml: ${err.message}`);
  }
  const { version: quickMapVersion, entries: quickMapEntries, sectionExceptions } = parsedQuickMap;
  if (!quickMapVersion) fail('quick-rule-map.yaml: missing version field');
  if (quickMapVersion !== versionFile) {
    fail(`quick-rule-map.yaml (${quickMapVersion}) !== VERSION (${versionFile})`);
  }
  if (quickMapEntries.length !== 98) {
    fail(`quick-rule-map.yaml must list 98 entries (found ${quickMapEntries.length})`);
  }
  const mapNumbers = new Set();
  for (const entry of quickMapEntries) {
    if (mapNumbers.has(entry.number)) {
      fail(`quick-rule-map.yaml duplicate Quick number: ${entry.number}`);
    }
    mapNumbers.add(entry.number);
    if (entry.quick_only && entry.ids.length) {
      fail(`quick-rule-map.yaml #${entry.number}: quick_only cannot list ids`);
    }
    if (!entry.quick_only && !entry.ids.length) {
      fail(`quick-rule-map.yaml #${entry.number}: must list ids or set quick_only: true`);
    }
    for (const id of entry.ids) {
      if (!registryIds.has(id)) {
        fail(`quick-rule-map.yaml #${entry.number}: unknown rule ID ${id}`);
      }
    }
  }
  for (let n = 1; n <= 98; n += 1) {
    if (!mapNumbers.has(n)) fail(`quick-rule-map.yaml missing Quick number ${n}`);
  }

  // Each linked ID's hig_section must match the Quick bullet's reviewed hig_section,
  // unless the pair is listed in section_exceptions with a reason.
  const sectionErrors = checkQuickMapSections({
    entries: quickMapEntries,
    sectionExceptions,
    registrySections: new Map(registry.map((row) => [row.id, row.hig_section])),
    higText,
  });
  for (const message of sectionErrors) fail(`quick-rule-map.yaml: ${message}`);
}

// --- HIG-LITE rule ID links ---
const liteText = read('HIG-LITE.md');
for (const id of registryIds) {
  if (!liteText.includes(id) && !['HIG-VT-001', 'HIG-I18N-001'].includes(id)) {
    warn(`rule ID not mentioned in HIG-LITE.md: ${id}`);
  }
}

// --- Documentation site version sync ---
const docsIndex = exists('docs/index.html') ? read('docs/index.html') : '';
const docsVersionLabel = `v${versionFile}`;
if (docsIndex) {
  if (!docsIndex.includes(`class="version-badge">${docsVersionLabel}<`)) {
    fail(`docs/index.html version-badge must show ${docsVersionLabel}`);
  }
  if (!docsIndex.includes(`The Web HIG ${docsVersionLabel}`)) {
    fail(`docs/index.html footer must include "The Web HIG ${docsVersionLabel}"`);
  }
  if (!docsIndex.includes('rel="canonical"')) {
    fail('docs/index.html must include a canonical URL (HIG-SEO-001)');
  }
  if (!docsIndex.includes('property="og:image"')) {
    fail('docs/index.html must include Open Graph image metadata (HIG-SEO-002)');
  }
  if (!docsIndex.includes('type="application/ld+json"')) {
    fail('docs/index.html must include JSON-LD structured data (HIG-SEO-003)');
  }
  if (!docsIndex.includes(`"version": "${versionFile}"`)) {
    fail(`docs/index.html JSON-LD must include version ${versionFile}`);
  }
  const jsonLd = docsIndex.match(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/);
  if (jsonLd) {
    try {
      JSON.parse(jsonLd[1]);
    } catch {
      fail('docs/index.html JSON-LD is not valid JSON');
    }
  }
  for (const page of PUBLIC_DOC_PAGES) {
    if (!docsIndex.includes(`href="${page}"`)) {
      fail(`docs/index.html must link to ${page}`);
    }
    const pagePath = `docs/${page}`;
    if (!exists(pagePath)) {
      fail(`missing ${pagePath}`);
      continue;
    }
    const html = read(pagePath);
    if (!html.includes(`class="version-badge">${docsVersionLabel}<`)) {
      fail(`${pagePath} version-badge must show ${docsVersionLabel}`);
    }
    if (!html.includes(`The Web HIG ${docsVersionLabel}`)) {
      fail(`${pagePath} footer must include "The Web HIG ${docsVersionLabel}"`);
    }
  }
}

const sitemapText = exists('docs/sitemap.xml') ? read('docs/sitemap.xml') : '';
if (sitemapText) {
  for (const { path: sitePath } of SITEMAP_PATHS) {
    const loc = sitePath === '/' ? `${SITE.origin}/` : `${SITE.origin}${sitePath}`;
    if (!sitemapText.includes(`<loc>${loc}</loc>`)) {
      fail(`docs/sitemap.xml must include ${loc}`);
    }
  }
}

for (const file of ['docs/robots.txt', 'docs/sitemap.xml', 'docs/404.html', 'docs/social/og-image.png']) {
  if (!exists(file)) fail(`missing ${file}`);
}

// --- Live “current release” pins (not version-history archives) ---
const readmeText = read('README.md');
if (!readmeText.includes(`**Current release:** [v${versionFile}]`)) {
  fail(`README.md Current release must link v${versionFile}`);
}
const devtoIntro = 'content/devto/introducing-the-web-hig.md';
if (exists(devtoIntro)) {
  const devtoText = read(devtoIntro);
  if (!devtoText.includes(`Current release: **v${versionFile}**`)) {
    fail(`${devtoIntro} must declare Current release: **v${versionFile}**`);
  }
}

// --- Adopters reference implementations pin current VERSION ---
const adoptersText = exists('ADOPTERS.md') ? read('ADOPTERS.md') : '';
if (adoptersText) {
  const refBlock = adoptersText.split('## Community adopters')[0] ?? adoptersText;
  for (const label of ['HIG documentation site', 'Live demo (Aruvi Flow)', 'This repository']) {
    const row = refBlock.split('\n').find((line) => line.includes(label));
    if (row && !row.includes(docsVersionLabel)) {
      fail(`ADOPTERS.md reference row "${label}" must pin ${docsVersionLabel}`);
    }
  }
}

// --- Manifest schema (structural draft checks) ---
const manifestSchema = exists('schema/manifest.schema.json')
  ? JSON.parse(read('schema/manifest.schema.json'))
  : null;
if (manifestSchema?.required) {
  for (const key of manifestSchema.required) {
    if (!manifestYaml.match(new RegExp(`^${key}:`, 'm'))) {
      fail(`manifest.yaml missing required key (schema): ${key}`);
    }
  }
}

const archetypePackSchema =
  manifestSchema?.properties?.archetype_packs?.additionalProperties?.properties ?? {};
for (const key of ['file', 'id', 'default_modules', 'conditional_modules']) {
  if (!Object.hasOwn(archetypePackSchema, key)) {
    fail(`manifest.schema.json archetype_packs missing property: ${key}`);
  }
}

// --- Agent distribution ---
if (!exists('skills/web-hig/SKILL.md')) {
  fail('missing skills/web-hig/SKILL.md');
} else {
  const skillText = read('skills/web-hig/SKILL.md');
  const skillFrontmatter = skillText.match(/^---\r?\n([\s\S]*?)\r?\n---/);
  if (!skillFrontmatter || !/^name:\s*web-hig\b/m.test(skillFrontmatter[1])) {
    fail('skills/web-hig/SKILL.md must declare name: web-hig in YAML frontmatter');
  }
  if (!skillFrontmatter || !/^description:/m.test(skillFrontmatter[1])) {
    fail('skills/web-hig/SKILL.md must declare description in YAML frontmatter');
  }
}

if (!exists('examples/agent-rules/windsurf-hig.md')) {
  fail('missing examples/agent-rules/windsurf-hig.md');
} else if (!read('examples/agent-rules/windsurf-hig.md').includes('trigger: always_on')) {
  fail('examples/agent-rules/windsurf-hig.md must set trigger: always_on');
}

if (!exists('examples/agent-rules/copilot-hig.instructions.md')) {
  fail('missing examples/agent-rules/copilot-hig.instructions.md');
} else if (!read('examples/agent-rules/copilot-hig.instructions.md').includes('applyTo:')) {
  fail('examples/agent-rules/copilot-hig.instructions.md must set applyTo');
}

if (!exists('packages/install/package.json')) {
  fail('missing packages/install/package.json');
} else {
  const installPkg = JSON.parse(read('packages/install/package.json'));
  if (installPkg.name !== '@web-hig/install') {
    fail(`packages/install/package.json name (${installPkg.name}) !== @web-hig/install`);
  }
  if (installPkg.version !== versionFile) {
    fail(`packages/install/package.json (${installPkg.version}) !== VERSION (${versionFile})`);
  }
}

// --- Local Markdown links and anchors ---
const markdownFiles = walkFiles(root, (file) => file.endsWith('.md'));
const headingSlugCache = new Map();

for (const filePath of markdownFiles) {
  const rel = repoPath(filePath);
  const text = fs.readFileSync(filePath, 'utf8');
  for (const match of text.matchAll(/\[[^\]]+\]\(([^)]+)\)/g)) {
    let href = match[1].trim().split(/\s+/)[0].replace(/^<|>$/g, '');
    if (!href || href.startsWith('#')) continue;
    if (/^[a-z][a-z0-9+.-]*:/i.test(href)) continue;

    const [target, fragment] = href.split('#');
    if (!target) continue;

    const targetPath = path.normalize(path.join(path.dirname(filePath), target));
    if (!targetPath.startsWith(root) || !fs.existsSync(targetPath)) {
      fail(`${rel}: local link target missing: ${href}`);
      continue;
    }

    if (fragment && targetPath.endsWith('.md')) {
      if (!headingSlugCache.has(targetPath)) {
        headingSlugCache.set(targetPath, markdownHeadingSlugs(targetPath));
      }
      if (!headingSlugCache.get(targetPath).has(fragment)) {
        fail(`${rel}: local link anchor missing: ${href}`);
      }
    }
  }
}

// --- Report ---
if (warnings.length) {
  console.warn('Warnings:');
  for (const w of warnings) console.warn(`  ⚠ ${w}`);
}

if (errors.length) {
  console.error('Validation failed:');
  for (const e of errors) console.error(`  ✗ ${e}`);
  process.exit(1);
}

console.log(
  `✓ The Web HIG v${versionFile} validation passed (${quickNumbered.length} Quick rules, ${registryIds.size} rule IDs, ${moduleFiles.length} modules, ${archetypeIds.length} archetype packs)`,
);

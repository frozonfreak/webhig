import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import Ajv from 'ajv/dist/2020.js';
import { parse } from 'yaml';
import { loadProjectConfig, resolveHigRoot } from '@web-hig/core';
import { runCheck } from '../lib/commands/check.mjs';
import { runCoverage } from '../lib/commands/coverage.mjs';
import { runDoctor } from '../lib/commands/doctor.mjs';
import { runUpgrade } from '../lib/commands/upgrade.mjs';
import { runInit } from '../lib/commands/init.mjs';
import { collectScopedFiles } from '../lib/static-checks.mjs';
import { run } from '../../install/lib/install.mjs';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../../..');
const packageRoot = path.join(root, 'packages/install');
const version = fs.readFileSync(path.join(root, 'VERSION'), 'utf8').trim();
const schema = JSON.parse(
  fs.readFileSync(path.join(root, 'packages/core/lib/verification-report.schema.json'), 'utf8'),
);
const validate = new Ajv().compile(schema);
const originalCwd = process.cwd();
const originalEnv = process.env.WEB_HIG_ROOT;
const originalLog = console.log;
const tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'hig-readiness-'));
async function capture(fn) {
  const lines = [];
  console.log = (line) => lines.push(line);
  try {
    return { code: await fn(), output: lines.join('\n') };
  } finally {
    console.log = originalLog;
  }
}
function config(text) {
  fs.writeFileSync(path.join(tmp, 'web-hig.yaml'), text);
}
try {
  process.chdir(tmp);
  process.env.WEB_HIG_ROOT = root;
  config(
    `version: "${version}"\nprofile: quick\nscope:\n  files: ["src/**/*.css"]\n  exclude: ["src/legacy/**"]\n`,
  );
  fs.mkdirSync('src/legacy', { recursive: true });
  fs.mkdirSync('src/nested', { recursive: true });
  fs.writeFileSync('src/main.css', '.a { color: red; }');
  fs.writeFileSync('src/nested/bad.css', '.a { transition: all 100ms; }');
  fs.writeFileSync('src/legacy/ignored.css', '.a { transition: all 100ms; }');
  const loaded = loadProjectConfig(tmp).config;
  assert.deepEqual(loaded.scope.files, ['src/**/*.css'], 'explicit scope must replace defaults');
  assert.equal(collectScopedFiles(tmp, loaded.scope).length, 2, 'glob and recursive exclusion');
  assert.equal(
    collectScopedFiles(tmp, { files: [] }).length,
    0,
    'empty scope must not expand to the entire project',
  );
  assert.equal(
    collectScopedFiles(tmp, { files: ['src/main.css', 'src/**'] }).length,
    3,
    'single-file scope and deduplication',
  );
  let report = JSON.parse((await capture(() => runCheck(['--json', '--strict']))).output);
  assert.ok(validate(report), JSON.stringify(validate.errors));
  assert.equal(report.summary.passed, 0);
  assert.equal(report.summary.failed, 2);
  assert.ok(report.summary.not_assessed > 0);
  assert.ok(report.findings.every((f) => !f.location.includes(tmp.replaceAll('\\', '/'))));
  fs.writeFileSync('src/nested/bad.css', '.a { color: red; }');
  report = JSON.parse((await capture(() => runCheck(['--json', '--strict']))).output);
  assert.equal(
    report.summary.passed,
    0,
    'clean static scan must never imply full behavioral conformance',
  );
  const inventory = JSON.parse(
    (await capture(() => runCoverage(['--format', 'json', '--profile', 'full']))).output,
  );
  assert.ok(validate(inventory), JSON.stringify(validate.errors));
  assert.ok(inventory.assessments.length > 50);
  assert.ok(inventory.assessments.every((r) => r.verification_modes.length));
  config(`version: "${version}"\nprofile: typo\n`);
  await assert.rejects(runCheck(['--json']), /Unknown profile/);
  config(`version: "${version}"\nscope:\n  files: ["missing/**"]\n`);
  await assert.rejects(runCheck(['--strict']), /no source files/);
  config('version: "0.0.1"\n');
  await assert.rejects(runCheck(['--strict']), /matching/);
  assert.equal((await capture(() => runDoctor(['--json']))).code, 1, 'doctor catches pin mismatch');
  config(`version: "${version}"\nscope: [invalid]\n`);
  assert.throws(() => loadProjectConfig(tmp), /mapping/);
  config(`version: "${version}"\nscope:\n  files: []\n  files: [src/**]\n`);
  assert.throws(() => loadProjectConfig(tmp), /unique/);
  config(`version: "${version}"\n`);
  await assert.rejects(runCheck(['--unknown']), /Unknown option/);
  await assert.rejects(runCheck(['--profile']), /requires a value/);
  await assert.rejects(runCoverage(['--format', 'yaml']), /json or text/);
  const invalidEvidence = structuredClone(inventory);
  invalidEvidence.assessments[0].result = 'passed';
  assert.equal(
    validate(invalidEvidence),
    false,
    'passing requires full coverage and affirmative evidence',
  );
  process.env.WEB_HIG_ROOT = path.join(tmp, 'missing');
  assert.equal(
    resolveHigRoot(tmp),
    null,
    'explicit broken environment override must not silently fall back',
  );
  delete process.env.WEB_HIG_ROOT;
  await run(['--dir', tmp, '--editors', 'cursor', '--no-scope'], { packageRoot, log: () => {} });
  assert.equal(resolveHigRoot(tmp), path.join(tmp, 'docs/hig'));
  // Clean-project installation and idempotence across source layouts, not full framework builds.
  for (const [stack, source, file] of [
    ['react', 'src', 'App.tsx'],
    ['vue', 'src', 'App.vue'],
    ['next', 'app', 'page.tsx'],
    ['livewire', 'resources/views', 'form.blade.php'],
    ['html', '', 'index.html'],
  ]) {
    const project = path.join(tmp, stack);
    fs.mkdirSync(path.join(project, source), { recursive: true });
    fs.writeFileSync(path.join(project, source, file), '<main>Hello</main>');
    fs.writeFileSync(path.join(project, 'AGENTS.md'), 'User instructions\n');
    const install = () =>
      run(['--dir', project, '--editors', 'agents'], { packageRoot, log: () => {} });
    await install();
    const before = fs.readFileSync(path.join(project, 'AGENTS.md'), 'utf8');
    const savedConfig =
      fs.readFileSync(path.join(project, 'web-hig.yaml'), 'utf8') + '# User-maintained settings\n';
    fs.writeFileSync(path.join(project, 'web-hig.yaml'), savedConfig);
    const projectConfig = parse(fs.readFileSync(path.join(project, 'web-hig.yaml'), 'utf8'));
    assert.equal(collectScopedFiles(project, projectConfig.scope).length, 1);
    await install();
    assert.equal(fs.readFileSync(path.join(project, 'AGENTS.md'), 'utf8'), before);
    assert.equal(fs.readFileSync(path.join(project, 'web-hig.yaml'), 'utf8'), savedConfig);
    assert.ok(before.startsWith('User instructions'));
    process.chdir(project);
    const health = await capture(() => runDoctor(['--json']));
    assert.equal(health.code, 0, health.output);
    assert.equal((await capture(() => runCheck(['--strict', '--json']))).code, 0);
    process.chdir(tmp);
    fs.writeFileSync(path.join(project, 'docs/hig/VERSION'), '0.0.1\n');
    await assert.rejects(install(), /Existing HIG pin differs/);
    assert.equal(fs.readFileSync(path.join(project, 'docs/hig/VERSION'), 'utf8'), '0.0.1\n');
  }
  const upgradeProject = path.join(tmp, 'upgrade');
  fs.mkdirSync(upgradeProject);
  process.chdir(upgradeProject);
  await capture(() => runInit(['--editors', 'agents', '--profile', 'practical']));
  const configPath = path.join(upgradeProject, 'web-hig.yaml');
  fs.writeFileSync(configPath, 'version: "0.0.1"\nprofile: practical\n');
  fs.writeFileSync('docs/hig/VERSION', '0.0.1\n');
  const previousRegistry = fs
    .readFileSync('docs/hig/rules/registry.yaml', 'utf8')
    .replaceAll(version, '0.0.1')
    .replace('requirement: Prefer simplest compliant implementation', 'requirement: Old wording');
  fs.writeFileSync('docs/hig/rules/registry.yaml', previousRegistry);
  process.env.WEB_HIG_ROOT = root;
  const preview = await capture(() => runUpgrade(['--dry-run']));
  assert.equal(preview.code, 0);
  assert.match(preview.output, /Changed: 1.*HIG-SIM-001/);
  assert.equal(
    fs.readFileSync('docs/hig/rules/registry.yaml', 'utf8'),
    previousRegistry,
    'preview must not write',
  );
  assert.equal(fs.readFileSync(configPath, 'utf8'), 'version: "0.0.1"\nprofile: practical\n');
  const malformed = path.join(tmp, 'malformed');
  fs.mkdirSync(malformed);
  fs.writeFileSync(path.join(malformed, 'AGENTS.md'), '<!-- web-hig:start -->\nuser text');
  await assert.rejects(
    run(['--dir', malformed, '--editors', 'agents'], { packageRoot, log: () => {} }),
    /markers/,
  );
  assert.equal(
    fs.existsSync(path.join(malformed, 'docs')),
    false,
    'preflight must fail before writing pins',
  );
} finally {
  console.log = originalLog;
  process.chdir(originalCwd);
  if (originalEnv === undefined) delete process.env.WEB_HIG_ROOT;
  else process.env.WEB_HIG_ROOT = originalEnv;
  fs.rmSync(tmp, { recursive: true, force: true });
}
console.log('readiness.test.mjs passed');

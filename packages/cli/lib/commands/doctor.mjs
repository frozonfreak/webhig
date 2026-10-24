import fs from 'node:fs';
import path from 'node:path';
import { parse } from 'yaml';
import { loadProjectConfig, loadRegistry, resolveHigRoot } from '@web-hig/core';
import { parseOptions } from '../options.mjs';

export async function runDoctor(argv) {
  const flags = parseOptions(argv, ['--config'], ['--json']);
  const cwd = process.cwd();
  const diagnostics = [];
  const add = (status, message) => diagnostics.push({ status, message });
  const root = resolveHigRoot(cwd);
  let registry;
  let loaded;
  try {
    if (!root)
      throw new Error('Missing registry: install the practical profile or set WEB_HIG_ROOT.');
    registry = loadRegistry(root);
    if (!registry.version || !registry.rules.size)
      throw new Error('Registry is empty or has no version.');
    add('ok', `Registry v${registry.version}`);
    const manifest = parse(fs.readFileSync(path.join(root, 'rules', 'manifest.yaml'), 'utf8'));
    if (
      !manifest ||
      typeof manifest !== 'object' ||
      manifest.version !== registry.version ||
      !manifest.layers ||
      !manifest.modules
    )
      throw new Error('Invalid manifest: expected matching version, layers, and modules.');
    add(
      'ok',
      'Manifest parses as YAML. Run npm run validate in the standard repository for full schema validation.',
    );
  } catch (error) {
    add('error', error.message);
  }
  try {
    loaded = loadProjectConfig(cwd, flags.config);
    add(
      loaded.exists ? 'ok' : 'warning',
      loaded.exists ? 'Project configuration is valid.' : 'No web-hig.yaml: check uses defaults.',
    );
  } catch (error) {
    add('error', error.message);
  }
  const pins = [];
  if (loaded?.config?.version) pins.push(['web-hig.yaml', loaded.config.version]);
  for (const dir of new Set([path.join(cwd, 'docs', 'hig'), root].filter(Boolean))) {
    const file = path.join(dir, 'VERSION');
    if (fs.existsSync(file))
      pins.push([path.relative(cwd, file), fs.readFileSync(file, 'utf8').trim()]);
  }
  for (const [source, version] of pins) {
    if (!/^\d+\.\d+\.\d+$/.test(version)) add('error', `Invalid version in ${source}: ${version}`);
    else if (registry && version !== registry.version)
      add('error', `${source} pins ${version}; registry is ${registry.version}.`);
  }
  const integrationFiles = [
    'AGENTS.md',
    'CLAUDE.md',
    '.github/copilot-instructions.md',
    '.cursor/rules/hig.mdc',
    '.windsurf/rules/hig.md',
  ];
  let integrations = 0;
  for (const file of integrationFiles) {
    const absolute = path.join(cwd, file);
    if (!fs.existsSync(absolute)) continue;
    const text = fs.readFileSync(absolute, 'utf8');
    if (!/web-hig|Web HIG/.test(text)) continue;
    integrations += 1;
    const agentPin = text.match(/Pinned contract:\s*The Web HIG v(\d+\.\d+\.\d+)/)?.[1];
    if (agentPin && registry && agentPin !== registry.version)
      add('error', `${file} references HIG v${agentPin}; registry is ${registry.version}.`);
    const starts = text.split('<!-- web-hig:start -->').length - 1;
    const ends = text.split('<!-- web-hig:end -->').length - 1;
    if (
      starts !== ends ||
      starts > 1 ||
      (starts && text.indexOf('<!-- web-hig:end -->') < text.indexOf('<!-- web-hig:start -->'))
    )
      add('error', `Broken HIG markers in ${file}.`);
    for (const match of text.matchAll(/docs\/hig\/[A-Za-z0-9_./-]+\.(?:md|yaml)/g)) {
      if (!fs.existsSync(path.join(cwd, match[0]))) {
        const required = /HIG-(?:QUICK|CORE)\.md$/.test(match[0]);
        add(
          required ? 'error' : 'warning',
          `${file} references missing ${match[0]}${required ? '.' : ' (may require a fuller installation profile).'}`,
        );
      }
    }
  }
  for (const editor of ['.cursor', '.claude', '.github', '.windsurf']) {
    const skill = path.join(cwd, editor, 'skills', 'web-hig', 'SKILL.md');
    if (!fs.existsSync(skill)) continue;
    const text = fs.readFileSync(skill, 'utf8');
    const frontmatter = text.match(/^---\r?\n([\s\S]*?)\r?\n---/);
    try {
      if (!frontmatter || parse(frontmatter[1])?.name !== 'web-hig')
        throw new Error('expected name: web-hig frontmatter');
    } catch (error) {
      add('error', `${path.relative(cwd, skill)}: ${error.message}`);
    }
  }
  if (!integrations) add('warning', 'No recognized HIG agent integration found.');
  const ok = !diagnostics.some((d) => d.status === 'error');
  if (flags.json) console.log(JSON.stringify({ ok, diagnostics }, null, 2));
  else for (const item of diagnostics) console.log(`[${item.status}] ${item.message}`);
  return ok ? 0 : 1;
}

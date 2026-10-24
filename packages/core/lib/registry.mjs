import fs from 'node:fs';
import path from 'node:path';
import { parse } from 'yaml';

export function parseRegistryYaml(yaml) {
  const data = parse(yaml);
  if (
    !data ||
    typeof data.version !== 'string' ||
    !/^\d+\.\d+\.\d+$/.test(data.version) ||
    !data.rules ||
    typeof data.rules !== 'object' ||
    !Object.keys(data.rules).length
  ) {
    throw new Error('Invalid registry: expected version and a nonempty rules mapping.');
  }
  const rules = new Map();
  for (const [id, row] of Object.entries(data.rules)) {
    if (
      !/^HIG-[A-Z0-9]+-\d+$/.test(id) ||
      !row ||
      typeof row.requirement !== 'string' ||
      !row.requirement.trim() ||
      !['error', 'warning', 'info'].includes(row.severity)
    )
      throw new Error(`Invalid registry rule: ${id}`);
    for (const [key, allowed] of Object.entries({
      profiles: ['quick', 'practical', 'full'],
      archetypes: ['content', 'commerce', 'application', 'auth'],
      evaluation: ['static', 'runtime', 'manual', 'observation'],
    })) {
      if (
        !Array.isArray(row[key]) ||
        !row[key].length ||
        row[key].some((v) => !allowed.includes(v))
      )
        throw new Error(`${id}: invalid ${key}`);
    }
    rules.set(id, { ...row, id });
  }
  return { version: data.version, rules };
}

export function loadRegistry(higRoot) {
  return parseRegistryYaml(fs.readFileSync(path.join(higRoot, 'rules', 'registry.yaml'), 'utf8'));
}

export function filterRulesByContract(registry, { profile, archetype, evaluation = 'static' }) {
  return [...registry.rules.values()].filter(
    (rule) =>
      rule.profiles.includes(profile) &&
      rule.archetypes.includes(archetype) &&
      (!evaluation || rule.evaluation.includes(evaluation)),
  );
}

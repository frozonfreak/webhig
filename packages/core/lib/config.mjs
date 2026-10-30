import fs from 'node:fs';
import path from 'node:path';
import { parse } from 'yaml';

const PROFILES = ['quick', 'practical', 'full'];
const ARCHETYPES = ['content', 'commerce', 'application', 'auth'];
const DEFAULTS = {
  profile: 'practical',
  archetype: 'application',
  framework: { name: null },
  scope: { files: ['src/**'], exclude: [], routes: ['/**'] },
  gates: { blocking: 'fail', warnings: 'report', observations: 'report' },
};
export function defaultProjectConfig(version) {
  return { version, ...structuredClone(DEFAULTS) };
}

export function validateProjectConfig(input) {
  const object = (value) => value && typeof value === 'object' && !Array.isArray(value);
  if (!object(input)) throw new Error('web-hig.yaml must contain a YAML mapping.');
  for (const key of Object.keys(input)) {
    if (!['version', ...Object.keys(DEFAULTS)].includes(key))
      throw new Error(`Unknown configuration key: ${key}`);
  }
  if (typeof input.version !== 'string' || !/^\d+\.\d+\.\d+$/.test(input.version)) {
    throw new Error('version must be a quoted stable semver, e.g. "1.16.0".');
  }
  const config = { ...defaultProjectConfig(input.version), ...input };
  if (!PROFILES.includes(config.profile)) throw new Error(`Unknown profile: ${config.profile}`);
  if (!ARCHETYPES.includes(config.archetype))
    throw new Error(`Unknown archetype: ${config.archetype}`);
  for (const section of ['framework', 'scope', 'gates']) {
    if (input[section] === undefined) continue;
    if (!object(input[section])) throw new Error(`${section} must be a mapping.`);
    for (const key of Object.keys(input[section])) {
      if (!Object.hasOwn(DEFAULTS[section], key)) throw new Error(`Unknown ${section} key: ${key}`);
    }
    config[section] = { ...structuredClone(DEFAULTS[section]), ...input[section] };
  }
  if (config.framework.name !== null && typeof config.framework.name !== 'string') {
    throw new Error('framework.name must be a string or null.');
  }
  for (const [key, value] of Object.entries(config.scope)) {
    if (!Array.isArray(value) || value.some((v) => typeof v !== 'string' || !v.trim())) {
      throw new Error(`scope.${key} must be an array of nonempty strings.`);
    }
  }
  for (const [key, value] of Object.entries(config.gates)) {
    if (!['fail', 'report'].includes(value))
      throw new Error(`gates.${key} must be fail or report.`);
  }
  return config;
}

export function loadProjectConfig(cwd, fileName = 'web-hig.yaml') {
  const configPath = path.resolve(cwd, fileName);
  if (!fs.existsSync(configPath)) return { configPath, config: null, exists: false };
  try {
    const input = parse(fs.readFileSync(configPath, 'utf8'));
    return { configPath, exists: true, config: validateProjectConfig(input) };
  } catch (error) {
    throw new Error(`${configPath}: ${error.message}`);
  }
}

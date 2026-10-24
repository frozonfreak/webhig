import {
  createAssessments,
  filterRulesByContract,
  loadProjectConfig,
  defaultProjectConfig,
  loadRegistry,
  resolveHigRoot,
  summarizeAssessments,
  validateProjectConfig,
} from '@web-hig/core';
import { STATIC_CHECKS } from '../static-checks.mjs';
import { parseOptions } from '../options.mjs';

export async function runCoverage(argv) {
  const flags = parseOptions(argv, ['--config', '--profile', '--format']);
  if (flags.format && !['json', 'text'].includes(flags.format))
    throw new Error('--format must be json or text.');
  const root = resolveHigRoot();
  if (!root)
    throw new Error(
      'Cannot find rules/registry.yaml. Install the practical profile or set WEB_HIG_ROOT.',
    );
  const registry = loadRegistry(root);
  const loaded = loadProjectConfig(process.cwd(), flags.config);
  const config = validateProjectConfig({
    ...(loaded.config ?? defaultProjectConfig(registry.version)),
    ...(flags.profile ? { profile: flags.profile } : {}),
  });
  const rules = filterRulesByContract(registry, { ...config, evaluation: null });
  const assessments = createAssessments({ rules, checks: STATIC_CHECKS });
  const report = {
    schema_version: '1.0.0',
    hig_version: registry.version,
    profile: config.profile,
    archetype: config.archetype,
    summary: summarizeAssessments(assessments),
    assessments,
  };
  if (flags.format === 'json') console.log(JSON.stringify(report, null, 2));
  else {
    console.log(`Web HIG v${registry.version} · ${rules.length} applicable rules`);
    for (const rule of assessments)
      console.log(
        `${rule.rule_id}: ${rule.verification_modes.join(', ')} · ${rule.coverage} coverage · ${rule.result}`,
      );
    console.log('\nCoverage inventory only: no source or browser checks performed.');
  }
  return 0;
}

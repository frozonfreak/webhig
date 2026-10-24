import { loadRegistry, resolveHigRoot } from '@web-hig/core';

export async function runExplain(argv) {
  if (argv.length !== 1 || argv[0].startsWith('-'))
    throw new Error('Usage: web-hig explain <rule-id>');
  const ruleId = argv.find((a) => !a.startsWith('-'));
  if (!ruleId || argv.includes('--help')) {
    console.log('Usage: web-hig explain <rule-id>\n\nExample: web-hig explain HIG-A11Y-004');
    return ruleId ? 0 : 1;
  }

  const higRoot = resolveHigRoot(process.cwd());
  if (!higRoot) {
    console.error('Cannot find rules/registry.yaml. Run from a HIG checkout or set WEB_HIG_ROOT.');
    return 1;
  }

  const registry = loadRegistry(higRoot);
  const rule = registry.rules.get(ruleId);
  if (!rule) {
    console.error(`Unknown rule ID: ${ruleId}`);
    return 1;
  }

  const lines = [
    ruleId,
    '',
    'Requirement',
    rule.requirement,
    '',
    'Severity',
    rule.severity,
    '',
    'Applicable profiles',
    rule.profiles.map(capitalize).join(', '),
    '',
    'Applicable archetypes',
    rule.archetypes.map(capitalize).join(', '),
    '',
    'Evaluation',
    rule.evaluation.map(capitalize).join(', '),
    '',
    'Autofix',
    rule.autofix,
    '',
    'Specification',
    rule.hig_section,
  ];
  if (rule.eslint_rule) {
    lines.push('', 'ESLint rule (planned)', rule.eslint_rule);
  }

  console.log(lines.join('\n'));
  return 0;
}

function capitalize(value) {
  return value.charAt(0).toUpperCase() + value.slice(1);
}

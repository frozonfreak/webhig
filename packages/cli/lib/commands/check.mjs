import {
  createReport,
  createAssessments,
  summarizeAssessments,
  defaultProjectConfig,
  filterRulesByContract,
  loadProjectConfig,
  loadRegistry,
  printTerminalReport,
  resolveHigRoot,
  severityBucketForRule,
  validateProjectConfig,
} from '@web-hig/core';
import path from 'node:path';
import fs from 'node:fs';
import { collectScopedFiles, runStaticChecks, STATIC_CHECKS } from '../static-checks.mjs';
import { parseOptions } from '../options.mjs';

function parseFlags(argv) {
  return parseOptions(argv, ['--profile', '--config'], ['--json', '--strict']);
}

export async function runCheck(argv) {
  if (argv.includes('--help')) {
    console.log(`Usage: web-hig check [options]

Options:
  --profile <quick|practical|full>   Override web-hig.yaml profile
  --config <path>                    Config file (default: web-hig.yaml)
  --json                             JSON evaluator output
  --strict                           Require a config, matching pin, and nonempty file scope
`);
    return 0;
  }

  const flags = parseFlags(argv);
  const cwd = process.cwd();
  const higRoot = resolveHigRoot(cwd);
  if (!higRoot) {
    console.error(
      'Cannot find rules/registry.yaml. Set WEB_HIG_ROOT or run from the HIG repository.',
    );
    return 1;
  }

  const registry = loadRegistry(higRoot);
  const loaded = loadProjectConfig(cwd, flags.config);
  let config = loaded.exists ? loaded.config : defaultProjectConfig(registry.version);

  if (flags.profile) config.profile = flags.profile;
  config = validateProjectConfig(config);
  if (flags.strict && (!loaded.exists || config.version !== registry.version)) {
    throw new Error(
      'Strict check requires web-hig.yaml with a version matching the resolved registry. Run web-hig doctor.',
    );
  }
  if (flags.strict) {
    for (const dir of new Set([higRoot, path.join(cwd, 'docs/hig')])) {
      const pin = path.join(dir, 'VERSION');
      if (fs.existsSync(pin) && fs.readFileSync(pin, 'utf8').trim() !== registry.version) {
        throw new Error('Strict check: VERSION and registry disagree. Run web-hig doctor.');
      }
    }
  }

  const applicableRules = filterRulesByContract(registry, {
    profile: config.profile,
    archetype: config.archetype,
  });

  const files = collectScopedFiles(cwd, config.scope);
  if (flags.strict && !files.length)
    throw new Error('Strict check: no source files matched scope.files.');
  const rawFindings = runStaticChecks(files, {
    applicableRuleIds: new Set(applicableRules.map((r) => r.id)),
  });
  const findings = rawFindings.map((f) => {
    const rule = registry.rules.get(f.rule_id);
    return {
      rule_id: f.rule_id,
      dimension: dimensionForRule(f.rule_id),
      severity_bucket: severityBucketForRule(rule?.severity ?? 'error'),
      message: f.message,
      location: f.location.replace(cwd.split(path.sep).join('/') + '/', ''),
      evaluation: 'static',
    };
  });

  const report = createReport({
    higVersion: registry.version,
    profile: config.profile,
    archetype: config.archetype,
    framework: config.framework?.name,
    findings,
  });
  report.schema_version = '1.0.0';
  report.assessments = createAssessments({
    rules: filterRulesByContract(registry, { ...config, evaluation: null }),
    checks: STATIC_CHECKS,
    findings,
    files,
  });
  report.summary = summarizeAssessments(report.assessments);

  if (flags.json) {
    console.log(JSON.stringify(report, null, 2));
  } else {
    console.log(printTerminalReport(report));
    if (!loaded.exists) {
      console.log('\nNote: no web-hig.yaml found — using default contract.');
    }
    console.log(
      `\nStatic-eligible rules: ${applicableRules.length} · Implemented detectors: ${STATIC_CHECKS.filter((c) => applicableRules.some((r) => r.id === c.rule_id)).length} · Files scanned: ${files.length}`,
    );
    console.log(
      `Verified passed: ${report.summary.passed} · Failed: ${report.summary.failed} · Manual review: ${report.summary.manual_review} · Not assessed: ${report.summary.not_assessed}`,
    );
  }

  if (
    Object.entries(report.severity_counts).some(
      ([bucket, count]) => count > 0 && config.gates[bucket] === 'fail',
    )
  )
    return 1;
  return 0;
}

function dimensionForRule(ruleId) {
  if (ruleId.startsWith('HIG-A11Y')) return 'accessibility';
  if (ruleId.startsWith('HIG-MOT') || ruleId.startsWith('HIG-VT')) return 'motion';
  if (ruleId.startsWith('HIG-CQ')) return 'responsive';
  if (ruleId.startsWith('HIG-TOK')) return 'ux';
  return 'ux';
}

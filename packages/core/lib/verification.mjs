import { severityBucketForRule } from './report.mjs';

/** Shared evidence contract. Detectors never imply a pass from silence. */
export function createAssessments({ rules, checks = [], findings = [], files = [] }) {
  return rules.map((rule) => {
    const detectors = checks.filter((check) => check.rule_id === rule.id);
    const evidence = findings
      .filter((finding) => finding.rule_id === rule.id)
      .map((finding) => ({
        mode: finding.evaluation,
        message: finding.message,
        location: finding.location,
      }));
    const manualOnly = rule.evaluation.every((mode) => mode === 'manual');
    return {
      rule_id: rule.id,
      severity_bucket: severityBucketForRule(rule.severity),
      verification_modes: rule.evaluation,
      coverage: detectors.length ? 'partial' : 'none',
      result: evidence.length ? 'failed' : manualOnly ? 'manual_review' : 'not_assessed',
      reason: evidence.length
        ? 'A detector observed a potential violation; review its evidence.'
        : manualOnly
          ? 'Requires human judgment.'
          : !detectors.length
            ? 'No implemented detector for this rule.'
            : !files.length
              ? 'No source files matched the configured scope.'
              : 'Partial static checks found no violation; full behavior remains unverified.',
      evidence,
    };
  });
}

export function summarizeAssessments(assessments) {
  const summary = { passed: 0, failed: 0, manual_review: 0, not_assessed: 0 };
  for (const assessment of assessments) summary[assessment.result] += 1;
  return summary;
}

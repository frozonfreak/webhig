import { runAudit } from './commands/audit.mjs';
import { runCheck } from './commands/check.mjs';
import { runExplain } from './commands/explain.mjs';
import { runInit } from './commands/init.mjs';
import { runUpgrade } from './commands/upgrade.mjs';
import { runDoctor } from './commands/doctor.mjs';
import { runCoverage } from './commands/coverage.mjs';

const HELP = `Usage: web-hig <command> [options]

Commands:
  init       Initialize HIG in the current project (wraps @web-hig/install)
  check      Static evaluation against web-hig.yaml (primary conformance command)
  audit      Runtime evaluation (experimental — not shipped; use check)
  explain    Show documentation for a rule ID
  upgrade    Report outdated pins; use --dry-run for upgrade checklist
  doctor     Diagnose project configuration, pins, and agent integrations
  coverage   Inventory applicable rules and implemented verification coverage

Options:
  --help     Show help

Examples:
  web-hig init
  web-hig check
  web-hig explain HIG-A11Y-004
`;

export async function runCli(argv) {
  if (!argv.length || argv.includes('--help') || argv.includes('-h')) {
    console.log(HELP);
    return 0;
  }

  const [command, ...rest] = argv;
  switch (command) {
    case 'init':
      return runInit(rest);
    case 'doctor':
      return runDoctor(rest);
    case 'coverage':
      return runCoverage(rest);
    case 'check':
      return runCheck(rest);
    case 'audit':
      return runAudit(rest);
    case 'explain':
      return runExplain(rest);
    case 'upgrade':
      return runUpgrade(rest);
    default:
      console.error(`Unknown command: ${command}\n`);
      console.log(HELP);
      return 1;
  }
}

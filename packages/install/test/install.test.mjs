import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { run } from '../lib/install.mjs';
import { MARKER_START, MARKER_END } from '../lib/files.mjs';

const packageRoot = path.join(path.dirname(fileURLToPath(import.meta.url)), '..');

function assert(condition, message) {
  if (!condition) throw new Error(message);
}

function exists(root, rel) {
  return fs.existsSync(path.join(root, ...rel.split('/')));
}

function read(root, rel) {
  return fs.readFileSync(path.join(root, ...rel.split('/')), 'utf8');
}

function countFiles(dir) {
  if (!fs.existsSync(dir)) return 0;
  let count = 0;
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const filePath = path.join(dir, entry.name);
    count += entry.isDirectory() ? countFiles(filePath) : 1;
  }
  return count;
}

async function withTemp(fn) {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'web-hig-install-'));
  try {
    await fn(dir);
  } finally {
    fs.rmSync(dir, { recursive: true, force: true });
  }
}

async function install(dir, extra = []) {
  const lines = [];
  await run(['--dir', dir, ...extra], {
    packageRoot,
    log: (line) => lines.push(String(line)),
  });
  return lines;
}

const tests = [
  [
    'default install writes pins, scope, rules, and skills',
    async () => {
      await withTemp(async (dir) => {
        await install(dir);
        const expected = [
          'docs/hig/VERSION',
          'docs/hig/HIG-QUICK.md',
          'docs/hig/HIG-CORE.md',
          'docs/hig-scope.md',
          '.cursor/rules/hig.mdc',
          '.cursor/skills/web-hig/SKILL.md',
          'CLAUDE.md',
          '.claude/skills/web-hig/SKILL.md',
          '.github/copilot-instructions.md',
          '.github/instructions/hig.instructions.md',
          '.github/skills/web-hig/SKILL.md',
          '.windsurf/rules/hig.md',
          '.windsurf/skills/web-hig/SKILL.md',
          'AGENTS.md',
        ];
        for (const file of expected) {
          assert(exists(dir, file), `missing ${file}`);
        }
        assert(!exists(dir, 'docs/hig/HIG-LITE.md'), 'quick profile should not copy HIG-LITE.md');
        assert(!exists(dir, 'docs/hig/HIG.md'), 'quick profile should not copy HIG.md');
        assert(read(dir, 'docs/hig/VERSION').trim() === '1.13.0', 'VERSION pin mismatch');
        assert(read(dir, '.cursor/skills/web-hig/SKILL.md').includes('name: web-hig'), 'skill missing name');
        assert(read(dir, '.windsurf/rules/hig.md').includes('trigger: always_on'), 'windsurf rule missing trigger');
        assert(read(dir, 'CLAUDE.md').includes(MARKER_START), 'CLAUDE.md missing merge markers');
      });
    },
  ],
  [
    '--editors cursor does not install other editors',
    async () => {
      await withTemp(async (dir) => {
        await install(dir, ['--editors', 'cursor']);
        assert(exists(dir, '.cursor/rules/hig.mdc'), 'missing cursor rule');
        assert(exists(dir, '.cursor/skills/web-hig/SKILL.md'), 'missing cursor skill');
        assert(exists(dir, 'docs/hig/HIG-QUICK.md'), 'missing quick pin');
        assert(!exists(dir, 'CLAUDE.md'), 'should not write CLAUDE.md');
        assert(!exists(dir, 'AGENTS.md'), 'should not write AGENTS.md');
        assert(!exists(dir, '.github/copilot-instructions.md'), 'should not write copilot instructions');
        assert(!exists(dir, '.windsurf/rules/hig.md'), 'should not write windsurf rule');
      });
    },
  ],
  [
    'CLAUDE.md merge is idempotent and preserves existing notes',
    async () => {
      await withTemp(async (dir) => {
        fs.writeFileSync(path.join(dir, 'CLAUDE.md'), 'Project notes\n', 'utf8');
        await install(dir, ['--editors', 'claude', '--no-scope']);
        const first = read(dir, 'CLAUDE.md');
        assert(first.startsWith('Project notes'), 'existing CLAUDE.md notes were lost');
        assert(first.includes(MARKER_START) && first.includes(MARKER_END), 'missing markers after merge');
        await install(dir, ['--editors', 'claude', '--no-scope']);
        const second = read(dir, 'CLAUDE.md');
        const starts = second.split(MARKER_START).length - 1;
        assert(starts === 1, `expected one HIG block, found ${starts}`);
        assert(second.includes('Project notes'), 'notes lost on second merge');
      });
    },
  ],
  [
    '--dry-run writes nothing',
    async () => {
      await withTemp(async (dir) => {
        const lines = await install(dir, ['--dry-run']);
        assert(countFiles(dir) === 0, 'dry-run created files');
        assert(lines.some((line) => line.includes('dry run')), 'missing dry-run summary');
      });
    },
  ],
  [
    '--profile practical copies lite and rules',
    async () => {
      await withTemp(async (dir) => {
        await install(dir, ['--profile', 'practical', '--editors', 'agents', '--no-scope']);
        assert(exists(dir, 'docs/hig/HIG-LITE.md'), 'missing HIG-LITE.md');
        assert(exists(dir, 'docs/hig/rules/manifest.yaml'), 'missing rules/manifest.yaml');
        assert(exists(dir, 'docs/hig/framework/react.md'), 'missing framework adapter');
        assert(!exists(dir, 'docs/hig/HIG.md'), 'practical should not copy HIG.md');
      });
    },
  ],
  [
    'dedicated files are skipped unless --force',
    async () => {
      await withTemp(async (dir) => {
        await install(dir, ['--editors', 'cursor']);
        const dest = path.join(dir, '.cursor', 'rules', 'hig.mdc');
        fs.writeFileSync(dest, 'custom\n', 'utf8');
        await install(dir, ['--editors', 'cursor']);
        assert(read(dir, '.cursor/rules/hig.mdc') === 'custom\n', 'overwrote without --force');
        await install(dir, ['--editors', 'cursor', '--force']);
        assert(read(dir, '.cursor/rules/hig.mdc').includes('alwaysApply: true'), '--force did not replace rule');
      });
    },
  ],
];

let failed = 0;
for (const [name, fn] of tests) {
  try {
    await fn();
    console.log(`ok ${name}`);
  } catch (error) {
    failed += 1;
    console.error(`not ok ${name}`);
    console.error(`  ${error instanceof Error ? error.stack : error}`);
  }
}

if (failed) {
  console.error(`\n${failed} failed`);
  process.exit(1);
}

console.log(`\n${tests.length} passed`);

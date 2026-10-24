import fs from 'node:fs';
import path from 'node:path';

const SOURCE_EXTENSIONS = new Set([
  '.css',
  '.scss',
  '.vue',
  '.jsx',
  '.tsx',
  '.js',
  '.ts',
  '.html',
  '.astro',
  '.php',
]);

// These detectors cover only part of each rule; absence of a match is not a pass.
export const STATIC_CHECKS = [
  {
    rule_id: 'HIG-MOT-001',
    mode: 'static',
    coverage: 'partial',
    description: 'Detects transition: all in source text.',
  },
  {
    rule_id: 'HIG-A11Y-001',
    mode: 'static',
    coverage: 'partial',
    description: 'Detects motion styles without a reduced-motion query in the same file.',
  },
];

export function collectScopedFiles(projectRoot, scope) {
  const patterns = scope?.files ?? ['**/*'];
  const excludes = scope?.exclude ?? [];
  const files = [];

  for (const pattern of patterns) {
    const segments = pattern.split('/');
    const wildcard = segments.findIndex((s) => /[*?]/.test(s));
    const base = wildcard < 0 ? pattern : segments.slice(0, wildcard).join('/');
    const scanRoot = path.resolve(projectRoot, base);
    const relative = path.relative(projectRoot, scanRoot);
    if (relative.startsWith('..') || path.isAbsolute(relative))
      throw new Error(`Scope escapes project: ${pattern}`);
    if (!fs.existsSync(scanRoot)) continue;
    if (fs.lstatSync(scanRoot).isSymbolicLink()) continue;
    if (fs.statSync(scanRoot).isDirectory()) walk(scanRoot, files);
    else files.push(scanRoot);
  }

  return [...new Set(files)]
    .filter((file) => {
      const rel = path.relative(projectRoot, file).split(path.sep).join('/');
      if (!SOURCE_EXTENSIONS.has(path.extname(file))) return false;
      if (!patterns.some((pattern) => matchGlob(rel, pattern))) return false;
      return !excludes.some((ex) => matchGlob(rel, ex));
    })
    .sort();
}

function walk(dir, out) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    if (entry.name === 'node_modules' || entry.name === '.git') continue;
    const filePath = path.join(dir, entry.name);
    if (entry.isSymbolicLink()) continue;
    if (entry.isDirectory()) walk(filePath, out);
    else out.push(filePath);
  }
}

function matchGlob(rel, pattern) {
  let expression = '';
  for (let i = 0; i < pattern.length; i += 1) {
    const char = pattern[i];
    if (char === '*' && pattern[i + 1] === '*') {
      i += 1;
      if (pattern[i + 1] === '/') {
        expression += '(?:.*/)?';
        i += 1;
      } else expression += '.*';
    } else if (char === '*') expression += '[^/]*';
    else if (char === '?') expression += '[^/]';
    else expression += char.replace(/[.+^${}()|[\]\\]/g, '\\$&');
  }
  return new RegExp(`^${expression}$`).test(rel);
}

export function runStaticChecks(files, { applicableRuleIds }) {
  const findings = [];
  for (const filePath of files) {
    const text = fs.readFileSync(filePath, 'utf8');
    const rel = filePath.split(path.sep).join('/');

    if (applicableRuleIds.has('HIG-MOT-001')) {
      for (const match of text.matchAll(/transition\s*:\s*[^;\n]*\ball\b/gi)) {
        findings.push({
          rule_id: 'HIG-MOT-001',
          message: 'Application CSS uses transition: all — enumerate properties instead.',
          location: `${rel}:${lineNumberAt(text, match.index)}`,
        });
      }
    }

    if (applicableRuleIds.has('HIG-A11Y-001')) {
      const hasReducedMotion =
        /@media\s*\(\s*prefers-reduced-motion\s*:\s*reduce\s*\)/i.test(text) ||
        /@media\s*\(\s*prefers-reduced-motion\s*:\s*no-preference\s*\)/i.test(text);
      const mentionsMotion =
        /transition\s*:|animation\s*:|@keyframes/i.test(text) ||
        (path.extname(filePath) === '.vue' && /<transition/i.test(text));
      if (mentionsMotion && !hasReducedMotion && isStylesheetLike(filePath)) {
        findings.push({
          rule_id: 'HIG-A11Y-001',
          message: 'Motion styles without a prefers-reduced-motion media query.',
          location: rel,
        });
      }
    }
  }
  return findings;
}

function isStylesheetLike(filePath) {
  const ext = path.extname(filePath);
  return ext === '.css' || ext === '.scss' || ext === '.vue' || ext === '.astro';
}

function lineNumberAt(text, index) {
  return text.slice(0, index).split(/\r?\n/).length;
}

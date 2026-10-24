import fs from 'node:fs';
import path from 'node:path';

export const MARKER_START = '<!-- web-hig:start -->';
export const MARKER_END = '<!-- web-hig:end -->';

export function posixRel(from, to) {
  return path.relative(from, to).split(path.sep).join('/');
}

export function readText(filePath) {
  return fs.readFileSync(filePath, 'utf8');
}

export function mergeMarked(existing, incoming) {
  const starts = existing.split(MARKER_START).length - 1;
  const ends = existing.split(MARKER_END).length - 1;
  if (
    starts !== ends ||
    starts > 1 ||
    (starts && existing.indexOf(MARKER_END) < existing.indexOf(MARKER_START))
  ) {
    throw new Error(
      'Broken or duplicate web-hig merge markers. Repair the integration file before reinstalling.',
    );
  }
  const block = `${MARKER_START}\n${incoming.trim()}\n${MARKER_END}`;
  if (!existing) return `${block}\n`;
  if (existing.includes(MARKER_START) && existing.includes(MARKER_END)) {
    const pattern = new RegExp(
      `${escapeRegExp(MARKER_START)}[\\s\\S]*?${escapeRegExp(MARKER_END)}`,
    );
    return existing.replace(pattern, block);
  }
  return `${existing.replace(/\s*$/, '')}\n\n${block}\n`;
}

export function walkFiles(dir, out = []) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const filePath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      walkFiles(filePath, out);
    } else {
      out.push(filePath);
    }
  }
  return out;
}

function escapeRegExp(value) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

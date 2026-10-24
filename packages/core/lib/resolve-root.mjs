import fs from 'node:fs';
import path from 'node:path';

export function resolveHigRoot(startDir = process.cwd()) {
  if (process.env.WEB_HIG_ROOT) {
    const root = path.resolve(process.env.WEB_HIG_ROOT);
    if (fs.existsSync(path.join(root, 'rules', 'registry.yaml'))) return root;
    return null;
  }

  let dir = path.resolve(startDir);
  for (let i = 0; i < 12; i += 1) {
    if (fs.existsSync(path.join(dir, 'rules', 'registry.yaml'))) return dir;
    const vendored = path.join(dir, 'docs', 'hig');
    if (fs.existsSync(path.join(vendored, 'rules', 'registry.yaml'))) return vendored;
    const parent = path.dirname(dir);
    if (parent === dir) break;
    dir = parent;
  }

  return null;
}

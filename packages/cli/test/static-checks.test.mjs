import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { runStaticChecks } from '../lib/static-checks.mjs';

const applicableRuleIds = new Set(['HIG-A11Y-001']);
const tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'web-hig-scroll-'));

function check(name, css) {
  const file = path.join(tmp, name);
  fs.writeFileSync(file, css, 'utf8');
  return runStaticChecks([file], { applicableRuleIds });
}

function scrollMessages(findings) {
  return findings.filter((finding) => finding.message.startsWith('Scroll-driven'));
}

const bare = scrollMessages(check('bare.css', '.hero { animation-timeline: scroll(); }\n'));
assert.equal(bare.length, 1, 'unguarded scroll() should be reported');

const durationOnly = scrollMessages(
  check(
    'duration.css',
    `.card { animation-timeline: view(); }
@media (prefers-reduced-motion: reduce) {
  .card { animation-duration: 0.01ms; }
}
`,
  ),
);
assert.equal(durationOnly.length, 1, 'duration-only reduced motion should still be reported');

const noPreference = scrollMessages(
  check(
    'preference.css',
    `@media (prefers-reduced-motion: no-preference) {
  .card { animation-timeline: view(); }
}
`,
  ),
);
assert.equal(noPreference.length, 0, 'scroll-driven rules only inside no-preference are guarded');

const reset = scrollMessages(
  check(
    'reset.css',
    `.card { animation-name: rise; animation-timeline: --pane; }
@media (prefers-reduced-motion: reduce) {
  .card { animation-timeline: auto; }
}
`,
  ),
);
assert.equal(reset.length, 0, 'animation-timeline: auto inside reduce is a guard');

const disabled = scrollMessages(
  check(
    'disabled.css',
    `.card { animation-timeline: scroll(nearest); }
@media (prefers-reduced-motion: reduce) {
  .card { animation: none; }
}
`,
  ),
);
assert.equal(disabled.length, 0, 'animation: none inside reduce is a guard');

const comment = scrollMessages(
  check('comment.css', '/* animation-timeline: scroll(); */\n.card { color: CanvasText; }\n'),
);
assert.equal(comment.length, 0, 'comments are not scroll-driven animation');

const documentTimeline = scrollMessages(check('auto.css', '.card { animation-timeline: auto; }\n'));
assert.equal(documentTimeline.length, 0, 'animation-timeline: auto is not scroll-driven');

const fixture = path.join(
  path.dirname(fileURLToPath(import.meta.url)),
  '../../../examples/audit-fixtures/scroll-driven-motion/fixture.css',
);
const fixtureFindings = runStaticChecks([fixture], { applicableRuleIds });
assert.equal(
  scrollMessages(fixtureFindings).length,
  0,
  'the scroll-driven audit fixture must stay guarded',
);

fs.rmSync(tmp, { recursive: true, force: true });
console.log('static-checks.test.mjs passed');

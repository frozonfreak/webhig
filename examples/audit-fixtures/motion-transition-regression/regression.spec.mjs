import assert from 'node:assert/strict';
import { spawn, spawnSync } from 'node:child_process';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

// Node 20 exposes the WebSocket client only with --experimental-websocket.
// Node 22+ provides globalThis.WebSocket without that flag. CI invokes this
// file as `node regression.spec.mjs`, so relaunch once when the constructor
// is missing. The env guard stops a loop if the flag does not enable it.
if (typeof globalThis.WebSocket !== 'function') {
  if (process.env.WEB_HIG_EXPERIMENTAL_WEBSOCKET === '1') {
    throw new Error(
      'globalThis.WebSocket is not a constructor. Use Node 22+, or Node 20.10+ with --experimental-websocket.',
    );
  }
  const relaunched = spawnSync(
    process.execPath,
    ['--experimental-websocket', ...process.execArgv, ...process.argv.slice(1)],
    {
      stdio: 'inherit',
      env: { ...process.env, WEB_HIG_EXPERIMENTAL_WEBSOCKET: '1' },
    },
  );
  process.exit(relaunched.status === null ? 1 : relaunched.status);
}

const fixedDir = path.dirname(fileURLToPath(import.meta.url));
const css = fs.readFileSync(path.join(fixedDir, 'fixture.css'), 'utf8');
const html = fs.readFileSync(path.join(fixedDir, 'index.html'), 'utf8');
const script = fs.readFileSync(path.join(fixedDir, 'fixture.js'), 'utf8');
const readme = fs.readFileSync(path.join(fixedDir, 'README.md'), 'utf8');

function ruleBodies(source, selector) {
  const bodies = [];
  const re = /(^|\n)\s*([^{}]+)\{([^}]*)\}/g;
  let match = re.exec(source);
  while (match) {
    const selectors = match[2].split(',').map((item) => item.trim());
    if (selectors.includes(selector)) bodies.push(match[3]);
    match = re.exec(source);
  }
  return bodies;
}

function tokenMap(block) {
  const map = new Map();
  for (const match of block.matchAll(/--([a-z0-9-]+)\s*:\s*([^;]+);/g)) {
    map.set(`--${match[1]}`, match[2].trim());
  }
  return map;
}

function resolveToken(map, value, depth = 0) {
  if (depth > 8) throw new Error(`token cycle at ${value}`);
  const varMatch = value.match(/^var\((--[a-z0-9-]+)\)$/);
  if (!varMatch) return value;
  const next = map.get(varMatch[1]);
  if (!next) throw new Error(`missing token ${varMatch[1]}`);
  return resolveToken(map, next, depth + 1);
}

function channel(value) {
  const scaled = value / 255;
  return scaled <= 0.04045 ? scaled / 12.92 : ((scaled + 0.055) / 1.055) ** 2.4;
}

function luminance(hex) {
  const normalized = hex.replace('#', '');
  const red = Number.parseInt(normalized.slice(0, 2), 16);
  const green = Number.parseInt(normalized.slice(2, 4), 16);
  const blue = Number.parseInt(normalized.slice(4, 6), 16);
  return 0.2126 * channel(red) + 0.7152 * channel(green) + 0.0722 * channel(blue);
}

function contrast(foreground, background) {
  const lighter = Math.max(luminance(foreground), luminance(background));
  const darker = Math.min(luminance(foreground), luminance(background));
  return (lighter + 0.05) / (darker + 0.05);
}

function assertSource() {
  assert.match(readme, /illustrative/i);
  assert.match(readme, /normative/i);
  assert.doesNotMatch(readme, /https?:\/\/\S*1human/i);
  assert.doesNotMatch(html + script + css, /aria-live|role="alert"|role="status"/);

  const conforming = ruleBodies(css, '.fixture-button').join('\n');
  assert.match(conforming, /transition-property:\s*background-color,\s*transform;/);
  assert.doesNotMatch(conforming, /transition\s*:\s*[^;\n]*\ball\b/);

  const negative = ruleBodies(css, '.fixture-button--negative').join('\n');
  assert.match(negative, /transition\s*:\s*all\s+var\(--motion-duration-fast\)/);

  const shorthand = [...css.matchAll(/transition\s*:\s*[^;\n]*\ball\b/gi)];
  assert.equal(shorthand.length, 1, 'planted unscoped transition must appear once');
  assert.match(css, /@media\s*\(\s*prefers-reduced-motion\s*:\s*reduce\s*\)/);
  assert.match(css, /inline-size:\s*var\(--fixture-button-inline-rest\)/);
  assert.match(css, /inline-size:\s*var\(--fixture-button-inline-invalid\)/);

  for (const line of css.split(/\r?\n/)) {
    if (line.includes('#') && !line.includes('--')) {
      throw new Error(`hex outside a token declaration: ${line.trim()}`);
    }
  }

  assert.match(html, /<button[\s\S]*id="conform-button"/);
  assert.match(html, /<button[\s\S]*id="negative-button"/);
  assert.match(html, /<label[^>]*for="reference-code"/);
  assert.match(html, /aria-describedby="reference-code-error"/);
  assert.match(html, /Error: Enter the 6-digit reference code\./);
  assert.match(html, /Deliberately non-conformant/);
  assert.match(html, /fixture instrumentation/);
  assert.doesNotMatch(script, /innerHTML|insertAdjacentHTML/);

  const rootBlocks = [...css.matchAll(/:root\s*\{([^}]*)\}/g)].map((match) => match[1]);
  assert.ok(rootBlocks.length >= 2, 'light and dark token blocks');
  const light = tokenMap(rootBlocks[0]);
  const dark = new Map(light);
  for (const [key, value] of tokenMap(rootBlocks[1])) dark.set(key, value);

  const pairs = [
    ['--button-fg', '--button-bg', 4.5],
    ['--button-fg', '--button-bg-active', 4.5],
    ['--status-danger-text', '--surface-base', 4.5],
    ['--text-primary', '--surface-base', 4.5],
    ['--text-secondary', '--surface-base', 4.5],
    ['--focus-ring', '--surface-base', 3],
  ];
  for (const [theme, map] of [
    ['light', light],
    ['dark', dark],
  ]) {
    for (const [foreground, background, minimum] of pairs) {
      const ratio = contrast(
        resolveToken(map, `var(${foreground})`),
        resolveToken(map, `var(${background})`),
      );
      assert.ok(
        ratio >= minimum,
        `${theme} ${foreground} on ${background} contrast ${ratio.toFixed(2)} < ${minimum}`,
      );
    }
  }
}

function which(command) {
  const finder = process.platform === 'win32' ? 'where.exe' : 'which';
  const result = spawnSync(finder, [command], { encoding: 'utf8' });
  if (result.status !== 0) return null;
  return (
    result.stdout
      .split(/\r?\n/)
      .map((line) => line.trim())
      .find(Boolean) || null
  );
}

function findBrowser() {
  const fromEnv = process.env.WEB_HIG_BROWSER;
  if (fromEnv && fs.existsSync(fromEnv)) return fromEnv;
  if (fromEnv) {
    const resolved = which(fromEnv);
    if (resolved) return resolved;
  }
  const candidates =
    process.platform === 'win32'
      ? [
          'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe',
          'C:\\Program Files\\Microsoft\\Edge\\Application\\msedge.exe',
          'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
        ]
      : [
          '/usr/bin/google-chrome-stable',
          '/usr/bin/google-chrome',
          '/usr/bin/chromium',
          '/usr/bin/chromium-browser',
        ];
  for (const candidate of candidates) {
    if (fs.existsSync(candidate)) return candidate;
  }
  for (const command of ['msedge', 'google-chrome-stable', 'google-chrome', 'chromium', 'chrome']) {
    const resolved = which(command);
    if (resolved && fs.existsSync(resolved)) return resolved;
  }
  throw new Error('No Chromium-family browser found. Set WEB_HIG_BROWSER to a browser executable.');
}

function killTree(child) {
  if (!child?.pid) return;
  if (process.platform === 'win32') {
    spawnSync('taskkill', ['/pid', String(child.pid), '/T', '/F'], { stdio: 'ignore' });
  } else {
    child.kill('SIGKILL');
  }
}

class Browser {
  constructor(executable) {
    this.executable = executable;
    this.userData = fs.mkdtempSync(path.join(os.tmpdir(), 'hig-motion-'));
    this.child = null;
    this.ws = null;
    this.nextId = 0;
    this.pending = new Map();
    this.listeners = [];
  }

  async launch() {
    const args = [
      '--headless=new',
      '--disable-gpu',
      '--no-first-run',
      '--no-default-browser-check',
      '--disable-extensions',
      '--disable-sync',
      '--remote-debugging-port=0',
      '--remote-allow-origins=*',
      `--user-data-dir=${this.userData}`,
      'about:blank',
    ];
    if (process.env.CI) args.splice(1, 0, '--no-sandbox', '--disable-dev-shm-usage');
    this.child = spawn(this.executable, args, { stdio: ['ignore', 'pipe', 'pipe'] });
    const endpoint = await new Promise((resolve, reject) => {
      let buffer = '';
      const timer = setTimeout(
        () => reject(new Error('browser did not open a debugging port')),
        20000,
      );
      const onData = (chunk) => {
        buffer += chunk.toString();
        const match = buffer.match(/DevTools listening on (ws:\/\/\S+)/);
        if (match) {
          clearTimeout(timer);
          resolve(match[1]);
        }
      };
      this.child.stderr.on('data', onData);
      this.child.stdout.on('data', onData);
      this.child.once('exit', (code) => {
        clearTimeout(timer);
        reject(new Error(`browser exited before debugging port was ready (${code})`));
      });
    });
    this.ws = new globalThis.WebSocket(endpoint);
    await new Promise((resolve, reject) => {
      this.ws.addEventListener('open', resolve, { once: true });
      this.ws.addEventListener(
        'error',
        () => reject(new Error('browser debugging socket failed')),
        {
          once: true,
        },
      );
    });
    this.ws.addEventListener('message', (event) => {
      const text = typeof event.data === 'string' ? event.data : String(event.data);
      const message = JSON.parse(text);
      if (message.id && this.pending.has(message.id)) {
        const { resolve, reject } = this.pending.get(message.id);
        this.pending.delete(message.id);
        if (message.error) reject(new Error(message.error.message));
        else resolve(message.result ?? {});
        return;
      }
      for (const listener of this.listeners) listener(message);
    });
  }

  send(method, params = {}, sessionId) {
    const id = ++this.nextId;
    const payload = { id, method, params };
    if (sessionId) payload.sessionId = sessionId;
    return new Promise((resolve, reject) => {
      this.pending.set(id, { resolve, reject });
      this.ws.send(JSON.stringify(payload));
    });
  }

  waitFor(sessionId, method, timeoutMs = 10000) {
    return new Promise((resolve, reject) => {
      const timer = setTimeout(() => {
        this.listeners = this.listeners.filter((item) => item !== onMessage);
        reject(new Error(`timeout waiting for ${method}`));
      }, timeoutMs);
      const onMessage = (message) => {
        if (message.method === method && message.sessionId === sessionId) {
          clearTimeout(timer);
          this.listeners = this.listeners.filter((item) => item !== onMessage);
          resolve(message.params ?? {});
        }
      };
      this.listeners.push(onMessage);
    });
  }

  async open(reducedMotion) {
    const { targetId } = await this.send('Target.createTarget', { url: 'about:blank' });
    const { sessionId } = await this.send('Target.attachToTarget', { targetId, flatten: true });
    await this.send('Page.enable', {}, sessionId);
    await this.send('Runtime.enable', {}, sessionId);
    await this.send('Accessibility.enable', {}, sessionId);
    await this.send(
      'Emulation.setDeviceMetricsOverride',
      { width: 1280, height: 900, deviceScaleFactor: 1, mobile: false },
      sessionId,
    );
    await this.send(
      'Emulation.setEmulatedMedia',
      {
        features: [
          { name: 'prefers-reduced-motion', value: reducedMotion },
          { name: 'prefers-color-scheme', value: 'light' },
        ],
      },
      sessionId,
    );
    const loaded = this.waitFor(sessionId, 'Page.loadEventFired');
    const url = pathToFileURL(path.join(fixedDir, 'index.html')).href;
    await this.send('Page.navigate', { url }, sessionId);
    await loaded;
    await this.send('Target.activateTarget', { targetId });
    return new Page(this, sessionId, targetId);
  }

  async close() {
    if (this.ws) {
      this.ws.close();
      this.ws = null;
    }
    killTree(this.child);
    this.child = null;
    for (let attempt = 0; attempt < 8; attempt += 1) {
      try {
        fs.rmSync(this.userData, { recursive: true, force: true });
        return;
      } catch {
        await new Promise((resolve) => setTimeout(resolve, 250));
      }
    }
  }
}

class Page {
  constructor(browser, sessionId, targetId) {
    this.browser = browser;
    this.sessionId = sessionId;
    this.targetId = targetId;
  }

  send(method, params) {
    return this.browser.send(method, params, this.sessionId);
  }

  async evaluate(expression, { awaitPromise = false } = {}) {
    const result = await this.send('Runtime.evaluate', {
      expression,
      awaitPromise,
      returnByValue: true,
    });
    if (result.exceptionDetails) {
      const text = result.exceptionDetails.text || 'evaluation failed';
      const description = result.exceptionDetails.exception?.description || '';
      throw new Error(`${text} ${description}`.trim());
    }
    return result.result?.value;
  }

  async reload() {
    const loaded = this.browser.waitFor(this.sessionId, 'Page.loadEventFired');
    await this.send('Page.reload', { ignoreCache: true });
    await loaded;
  }

  async box(id) {
    return this.evaluate(`(() => {
      const el = document.getElementById(${JSON.stringify(id)});
      const rect = el.getBoundingClientRect();
      return { x: rect.x + rect.width / 2, y: rect.y + rect.height / 2, width: rect.width };
    })()`);
  }

  async key(keyName, code, virtualKey, text = '') {
    const base = {
      key: keyName,
      code,
      windowsVirtualKeyCode: virtualKey,
      nativeVirtualKeyCode: virtualKey,
    };
    await this.send('Input.dispatchKeyEvent', {
      ...base,
      type: 'keyDown',
      text,
      unmodifiedText: text,
    });
    await this.send('Input.dispatchKeyEvent', { ...base, type: 'keyUp' });
  }

  async axNodes() {
    const tree = await this.send('Accessibility.getFullAXTree');
    return tree.nodes ?? [];
  }
}

function near(actual, expected, tolerance = 1.5) {
  assert.ok(
    Math.abs(actual - expected) <= tolerance,
    `expected ${expected}px ± ${tolerance}, received ${actual}`,
  );
}

function assertNoDimensionInterpolation(samples) {
  const between = samples.filter((value) => value > 148 && value < 232);
  assert.deepEqual(between, [], `width interpolated: ${samples.join(', ')}`);
}

async function readButton(page, id) {
  return page.evaluate(`(() => {
    const el = document.getElementById(${JSON.stringify(id)});
    const style = getComputedStyle(el);
    return {
      transitionProperty: style.transitionProperty,
      transitionDuration: style.transitionDuration,
      width: el.getBoundingClientRect().width,
      invalid: el.classList.contains('is-invalid'),
    };
  })()`);
}

async function pressSnapshot(page, id) {
  const target = await page.box(id);
  const before = await page.evaluate(`(() => {
    const el = document.getElementById(${JSON.stringify(id)});
    const style = getComputedStyle(el);
    return { background: style.backgroundColor, transform: style.transform };
  })()`);
  const pointer = {
    x: target.x,
    y: target.y,
    button: 'left',
    pointerType: 'mouse',
  };
  await page.send('Input.dispatchMouseEvent', { type: 'mouseMoved', ...pointer, buttons: 0 });
  await page.send('Input.dispatchMouseEvent', {
    type: 'mousePressed',
    ...pointer,
    buttons: 1,
    clickCount: 1,
  });
  const during = await page.evaluate(`(() => {
    const el = document.getElementById(${JSON.stringify(id)});
    for (const animation of el.getAnimations()) {
      const timing = animation.effect && animation.effect.getComputedTiming();
      if (!timing || typeof timing.duration !== 'number') continue;
      animation.pause();
      animation.currentTime = timing.duration;
    }
    const style = getComputedStyle(el);
    const hit = document.elementFromPoint(${target.x}, ${target.y});
    return {
      background: style.backgroundColor,
      transform: style.transform,
      active: el.matches(':active'),
      hit: hit && hit.id,
    };
  })()`);
  await page.send('Input.dispatchMouseEvent', {
    type: 'mouseReleased',
    ...pointer,
    buttons: 0,
    clickCount: 1,
  });
  return { before, during, target };
}

async function activateAndMeasure(page, id) {
  return page.evaluate(
    `(() => new Promise((resolve) => {
      const el = document.getElementById(${JSON.stringify(id)});
      const samples = [];
      const dimRuns = [];
      let mid = null;
      let atStart = null;
      const onRun = (event) => {
        if (event.target !== el) return;
        if (!['inline-size', 'width', 'block-size', 'height'].includes(event.propertyName)) return;
        dimRuns.push(event.propertyName);
        const animation = el.getAnimations().find((item) => item.transitionProperty === event.propertyName);
        if (!animation || mid !== null) return;
        animation.pause();
        const duration = animation.effect.getComputedTiming().duration;
        animation.currentTime = 0;
        atStart = el.getBoundingClientRect().width;
        for (let step = 1; step < 20 && mid === null; step += 1) {
          animation.currentTime = (duration * step) / 20;
          const width = el.getBoundingClientRect().width;
          if (width > atStart + 8 && width < atStart + 92) mid = width;
        }
        animation.currentTime = duration;
      };
      el.addEventListener('transitionrun', onRun);
      el.click();
      const started = performance.now();
      let settled = false;
      const finish = () => {
        if (settled) return;
        settled = true;
        el.removeEventListener('transitionrun', onRun);
        resolve({
          samples,
          dimRuns,
          mid,
          atStart,
          width: el.getBoundingClientRect().width,
        });
      };
      const tick = () => {
        samples.push(Number(el.getBoundingClientRect().width.toFixed(2)));
        if (performance.now() - started < 280) requestAnimationFrame(tick);
        else finish();
      };
      requestAnimationFrame(tick);
      setTimeout(finish, 1000);
    }))()`,
    { awaitPromise: true },
  );
}

async function armDimensionSeek(page, id) {
  await page.evaluate(`(() => {
    const el = document.getElementById(${JSON.stringify(id)});
    window.__dimensionSeek = new Promise((resolve) => {
      const timer = setTimeout(() => resolve({ fired: false, mid: null }), 600);
      el.addEventListener('transitionrun', (event) => {
        if (event.propertyName !== 'inline-size' && event.propertyName !== 'width') return;
        clearTimeout(timer);
        const animation = el.getAnimations().find((item) => item.transitionProperty === event.propertyName);
        let mid = null;
        if (animation) {
          animation.pause();
          const duration = animation.effect.getComputedTiming().duration;
          animation.currentTime = 0;
          const atStart = el.getBoundingClientRect().width;
          for (let step = 1; step < 20 && mid === null; step += 1) {
            animation.currentTime = (duration * step) / 20;
            const width = el.getBoundingClientRect().width;
            if (width > atStart + 8 && width < atStart + 92) mid = width;
          }
          animation.currentTime = duration;
        }
        resolve({ fired: true, property: event.propertyName, mid });
      });
    });
  })()`);
}

async function validationState(page) {
  return page.evaluate(`(() => {
    const field = document.getElementById('reference-code');
    const error = document.getElementById('reference-code-error');
    return {
      activeId: document.activeElement && document.activeElement.id,
      invalid: field.getAttribute('aria-invalid'),
      describedBy: field.getAttribute('aria-describedby'),
      hidden: error.hidden,
      text: error.textContent.trim(),
      liveCount: document.querySelectorAll('[aria-live], [role="alert"], [role="status"]').length,
    };
  })()`);
}

function assertValidation(state) {
  assert.equal(state.hidden, false);
  assert.equal(state.invalid, 'true');
  assert.equal(state.describedBy, 'reference-code-error');
  assert.equal(state.text, 'Error: Enter the 6-digit reference code.');
  assert.equal(state.liveCount, 0);
  assert.equal(state.activeId, 'reference-code');
}

async function runBrowser() {
  const browser = new Browser(findBrowser());
  await browser.launch();
  let failure = null;
  try {
    const normal = await browser.open('no-preference');
    const initial = await readButton(normal, 'conform-button');
    const initialNegative = await readButton(normal, 'negative-button');
    const initialValidation = await validationState(normal);
    near(initial.width, 140);
    near(initialNegative.width, 140);
    assert.equal(initial.invalid, false);
    assert.equal(initial.transitionProperty, 'background-color, transform');
    assert.equal(initial.transitionDuration, '0.1s');
    assert.equal(initialNegative.transitionProperty, 'all');
    assert.doesNotMatch(initial.transitionProperty, /\ball\b|\bwidth\b|\bheight\b|\binline-size\b/);
    assert.equal(initialValidation.hidden, true);
    assert.equal(initialValidation.invalid, 'false');

    const conformPress = await pressSnapshot(normal, 'conform-button');
    assert.equal(conformPress.during.active, true, JSON.stringify(conformPress));
    assert.notEqual(
      conformPress.during.background,
      conformPress.before.background,
      JSON.stringify(conformPress),
    );
    assert.notEqual(conformPress.during.transform, 'none', JSON.stringify(conformPress));
    assert.match(conformPress.during.transform, /matrix\(0\.9/, JSON.stringify(conformPress));
    assert.notEqual(
      conformPress.during.transform,
      conformPress.before.transform,
      JSON.stringify(conformPress),
    );

    await normal.reload();
    const conformWatch = await activateAndMeasure(normal, 'conform-button');
    near(conformWatch.width, 240);
    assert.equal(conformWatch.mid, null);
    assert.deepEqual(conformWatch.dimRuns, []);
    assertNoDimensionInterpolation(conformWatch.samples);
    assertValidation(await validationState(normal));

    await normal.reload();
    const sought = await activateAndMeasure(normal, 'negative-button');
    near(sought.width, 240);
    near(sought.atStart, 140);
    assert.ok(
      sought.dimRuns.includes('inline-size') || sought.dimRuns.includes('width'),
      `dimension transition did not run: ${JSON.stringify(sought)}`,
    );
    assert.ok(
      sought.mid > 148 && sought.mid < 232,
      `expected an intermediate width, received ${sought.mid} from ${JSON.stringify(sought)}`,
    );

    await normal.reload();
    await normal.evaluate(`document.getElementById('reference-code').focus()`);
    await normal.key('Tab', 'Tab', 9);
    const focused = await normal.evaluate(`(() => {
      const el = document.activeElement;
      const style = getComputedStyle(el);
      return { id: el.id, outlineStyle: style.outlineStyle, outlineWidth: style.outlineWidth };
    })()`);
    assert.equal(focused.id, 'conform-button');
    assert.notEqual(focused.outlineStyle, 'none');
    assert.ok(Number.parseFloat(focused.outlineWidth) >= 3, focused.outlineWidth);
    await normal.key('Enter', 'Enter', 13, '\r');
    const afterEnter = await readButton(normal, 'conform-button');
    near(afterEnter.width, 240);
    assert.equal(afterEnter.invalid, true);
    assertValidation(await validationState(normal));
    const negativeUntouched = await readButton(normal, 'negative-button');
    near(negativeUntouched.width, 140);

    await normal.reload();
    await normal.evaluate(`document.getElementById('conform-button').focus()`);
    await normal.key('Tab', 'Tab', 9);
    const negativeFocus = await normal.evaluate('document.activeElement.id');
    assert.equal(negativeFocus, 'negative-button');
    await armDimensionSeek(normal, 'negative-button');
    await normal.key(' ', 'Space', 32, ' ');
    const spaceSeek = await normal.evaluate('window.__dimensionSeek', { awaitPromise: true });
    const afterSpace = await readButton(normal, 'negative-button');
    near(afterSpace.width, 240);
    assert.equal(spaceSeek.fired, true, JSON.stringify(spaceSeek));
    assert.ok(spaceSeek.mid > 148 && spaceSeek.mid < 232, JSON.stringify(spaceSeek));
    assertValidation(await validationState(normal));

    const reduced = await browser.open('reduce');
    const reducedButton = await readButton(reduced, 'conform-button');
    assert.equal(reducedButton.transitionDuration, '0s');
    const reducedPress = await pressSnapshot(reduced, 'conform-button');
    assert.equal(reducedPress.during.active, true, JSON.stringify(reducedPress));
    assert.equal(reducedPress.during.transform, 'none', JSON.stringify(reducedPress));
    assert.notEqual(
      reducedPress.during.background,
      reducedPress.before.background,
      JSON.stringify(reducedPress),
    );
    await reduced.reload();
    const reducedWatch = await activateAndMeasure(reduced, 'conform-button');
    near(reducedWatch.width, 240);
    assert.equal(reducedWatch.mid, null);
    assert.deepEqual(reducedWatch.dimRuns, []);
    assertNoDimensionInterpolation(reducedWatch.samples);
    assertValidation(await validationState(reduced));

    const nodes = await reduced.axNodes();
    const textbox = nodes.find(
      (node) =>
        node.role?.value === 'textbox' && (node.name?.value || '').includes('Reference code'),
    );
    assert.ok(textbox, 'accessibility tree is missing the reference code field');
    const invalid = (textbox.properties || []).find((property) => property.name === 'invalid');
    assert.equal(invalid?.value?.value, 'true');
    const described = `${textbox.description?.value || ''} ${(textbox.properties || [])
      .map((property) => JSON.stringify(property.value?.value ?? ''))
      .join(' ')}`;
    assert.match(described, /6-digit reference code/);
    const alerts = nodes.filter(
      (node) => node.role?.value === 'alert' || node.role?.value === 'status',
    );
    assert.deepEqual(alerts, []);
    const conformNode = nodes.find(
      (node) =>
        node.role?.value === 'button' && (node.name?.value || '').includes('Conforming control'),
    );
    const negativeNode = nodes.find(
      (node) =>
        node.role?.value === 'button' &&
        (node.name?.value || '').includes('Deliberately non-conformant'),
    );
    assert.ok(conformNode, 'conforming button name missing from the accessibility tree');
    assert.ok(negativeNode, 'comparison button name missing from the accessibility tree');
    assert.match(conformNode.name.value, /Check code/);
    assert.match(negativeNode.name.value, /Check code/);
    console.log(
      `observed rest ${initial.width}px → invalid ${conformWatch.width}px; negative interior ${sought.mid}px; keyboard interior ${spaceSeek.mid}px`,
    );
  } catch (error) {
    failure = error;
  } finally {
    await browser.close();
  }
  if (failure) throw failure;
}

assertSource();
await runBrowser();
console.log('motion-transition-regression passed');

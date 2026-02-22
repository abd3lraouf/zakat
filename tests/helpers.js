/**
 * Test helper — loads index.html into a JSDOM instance.
 * External JS files (js/*.js) are inlined so JSDOM can execute them.
 * External scripts (Google API) are stripped so tests run offline.
 */
import { JSDOM } from 'jsdom';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const rootDir = path.resolve(__dirname, '..');

/** Script load order — matches index.html */
const JS_FILES = [
  'js/config.js',
  'js/state.js',
  'js/i18n.js',
  'js/ui.js',
  'js/calculator.js',
  'js/tracker.js',
  'js/google.js',
  'js/profile.js',
  'js/app.js',
];

let cachedHtml;

function getCleanHtml() {
  if (!cachedHtml) {
    let html = fs.readFileSync(path.resolve(rootDir, 'index.html'), 'utf-8');

    // Strip external CDN script tags (Google API)
    html = html.replace(/<script\s+src="https:\/\/[^"]*"[^>]*><\/script>/g, '');

    // Replace <script src="js/xxx.js"></script> with inline <script>…</script>
    for (const file of JS_FILES) {
      const srcPattern = new RegExp(
        '<script\\s+src="' + file.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') + '"\\s*>\\s*</script>',
        'g'
      );
      const code = fs.readFileSync(path.resolve(rootDir, file), 'utf-8');
      html = html.replace(srcPattern, '<script>\n' + code + '\n</script>');
    }

    cachedHtml = html;
  }
  return cachedHtml;
}

/**
 * Read and concatenate all CSS files for CSS-level tests.
 */
export function getAllCss() {
  const cssFiles = ['css/tokens.css', 'css/base.css', 'css/components.css', 'css/views.css', 'css/utilities.css'];
  return cssFiles.map(f => fs.readFileSync(path.resolve(rootDir, f), 'utf-8')).join('\n');
}

/**
 * Create a fresh app instance in JSDOM.
 * Returns { dom, window, document, app } where app contains module-scoped constants.
 *
 * The scripts use `const` declarations (state, i18n, CONFIG, etc.) which
 * live in the global lexical scope but are NOT properties of `window`. To access
 * them, we inject a tiny script that captures references onto window._app.
 */
export function createApp() {
  const dom = new JSDOM(getCleanHtml(), {
    url: 'http://localhost:8080',
    runScripts: 'dangerously',
    pretendToBeVisual: true,
  });

  const { window } = dom;

  // Stub APIs not implemented in JSDOM
  window.HTMLElement.prototype.scrollIntoView = function () {};

  // Inject a script to expose const/let variables from the global lexical scope
  const expose = window.document.createElement('script');
  expose.textContent = `
    window._app = {
      state, i18n, CONFIG, TRANSLATIONS, CATEGORIES, ASSET_DEFS,
      saveTimer, syncTimer,
    };
  `;
  window.document.body.appendChild(expose);

  return {
    dom,
    window,
    document: window.document,
    app: window._app,
  };
}

/**
 * Reset app state to defaults without recreating the JSDOM.
 */
export function resetState(app, window) {
  const { state, i18n } = app;

  state.calculator.prices = { gold24PerGram: 4625, silverPerGram: 48.50 };
  state.calculator.assets = {
    gold24g: 0, gold21g: 0, gold18g: 0, silverG: 0,
    cash: 0, inventory: 0, receivables: 0, investments: 0, otherAssets: 0,
  };
  state.calculator.deductions = { immediateDebts: 0, otherLiabilities: 0 };
  state.calculator.customAssets = [];
  state.tracker.payments = [];
  state.zakatDue = 0;
  state.nisabMet = false;

  i18n.lang = 'en';
  window.localStorage.clear();
}

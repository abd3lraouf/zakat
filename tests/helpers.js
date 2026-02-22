/**
 * Test helper — loads index.html into a JSDOM instance with inline scripts executed.
 * External scripts (Google API) are stripped so tests run offline.
 */
import { JSDOM } from 'jsdom';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const htmlPath = path.resolve(__dirname, '..', 'index.html');

let cachedHtml;

function getCleanHtml() {
  if (!cachedHtml) {
    let html = fs.readFileSync(htmlPath, 'utf-8');
    // Strip external script tags (Google API) to prevent network requests
    html = html.replace(/<script\s+src="https:\/\/[^"]*"[^>]*><\/script>/g, '');
    cachedHtml = html;
  }
  return cachedHtml;
}

/**
 * Create a fresh app instance in JSDOM.
 * Returns { dom, window, document, app } where app contains module-scoped constants.
 *
 * The inline script uses `const` declarations (state, i18n, CONFIG, etc.) which
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

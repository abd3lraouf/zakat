/* ═══════════════════════════════════════════════════════════
   APP STATE
   Depends on: config.js (CONFIG, TRANSLATIONS)
═══════════════════════════════════════════════════════════ */
const state = {
  calculator: {
    prices: { gold24PerGram: 4625, silverPerGram: 48.50 },
    assets: {
      gold24g: 0, gold21g: 0, gold18g: 0, silverG: 0,
      cash: 0, inventory: 0, receivables: 0, investments: 0, otherAssets: 0
    },
    deductions: { immediateDebts: 0, otherLiabilities: 0 },
    customAssets: [] // [{id, label, amount}]
  },
  tracker: {
    payments: []
  },
  zakatDue: 0,
  nisabMet: false,
};

window.zakatState = { get totalDue() { return state.zakatDue; } };

/* ═══════════════════════════════════════════════════════════
   STORAGE / PERSISTENCE
═══════════════════════════════════════════════════════════ */
var saveTimer = null;
var syncTimer = null;

function saveLocal() {
  clearTimeout(saveTimer);
  saveTimer = setTimeout(function() {
    var data = buildExportData();
    try {
      localStorage.setItem('zakat_app_data', JSON.stringify(data));
    } catch (e) {
      showToast('\u26A0 ' + i18n.t('save.failed'), 'error');
      return;
    }
    if (!googleAccessToken) flashSaveIndicator();
    scheduleSync();
  }, CONFIG.DEBOUNCE_SAVE);
}

function loadLocal() {
  try {
    var raw = localStorage.getItem('zakat_app_data');
    if (!raw) return;
    var data = JSON.parse(raw);
    applyImportData(data, false);
  } catch (e) {
    console.warn('Failed to load local data:', e);
  }
}

function buildExportData() {
  return {
    version: CONFIG.APP_VERSION,
    exportedAt: new Date().toISOString(),
    lastModified: new Date().toISOString(),
    language: i18n.lang,
    calculator: JSON.parse(JSON.stringify(state.calculator)),
    tracker: JSON.parse(JSON.stringify(state.tracker)),
  };
}

function applyImportData(data, rerender) {
  if (rerender === undefined) rerender = true;
  if (data.calculator && typeof data.calculator === 'object') {
    if (data.calculator.prices && typeof data.calculator.prices === 'object')
      Object.assign(state.calculator.prices, data.calculator.prices);
    if (data.calculator.assets && typeof data.calculator.assets === 'object')
      Object.assign(state.calculator.assets, data.calculator.assets);
    if (data.calculator.deductions && typeof data.calculator.deductions === 'object')
      Object.assign(state.calculator.deductions, data.calculator.deductions);
    if (Array.isArray(data.calculator.customAssets))
      state.calculator.customAssets = data.calculator.customAssets;
  }
  if (data.tracker && typeof data.tracker === 'object') {
    if (Array.isArray(data.tracker.payments))
      state.tracker.payments = data.tracker.payments;
  }
  if (rerender) {
    syncInputsFromState();
    renderAssetRows();
    renderTrackerTable();
    calcZakat();
    updateTrackerSummary();
  }
}

function syncInputsFromState() {
  var p = state.calculator.prices;
  var a = state.calculator.assets;
  var d = state.calculator.deductions;

  setInputVal('price-gold24', p.gold24PerGram);
  setInputVal('price-silver', p.silverPerGram);
  setInputVal('asset-gold24g', a.gold24g);
  setInputVal('asset-gold21g', a.gold21g);
  setInputVal('asset-gold18g', a.gold18g);
  setInputVal('asset-silverg', a.silverG);
  setInputVal('asset-cash', a.cash);
  setInputVal('asset-inventory', a.inventory);
  setInputVal('asset-receivables', a.receivables);
  setInputVal('asset-investments', a.investments);
  setInputVal('asset-otherassets', a.otherAssets);
  setInputVal('asset-immediatedebts', d.immediateDebts);
  setInputVal('asset-otherliabilities', d.otherLiabilities);
}

function setInputVal(id, val) {
  var el = document.getElementById(id);
  if (el && val !== undefined && val !== null) el.value = val || '';
}

/* ═══════════════════════════════════════════════════════════
   FORMATTING UTILITIES
═══════════════════════════════════════════════════════════ */
function fmtEGP(val) {
  var n = safeNum(val);
  if (i18n.lang === 'ar') {
    return '\u062c.\u0645 ' + n.toLocaleString('ar-EG', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  }
  return 'EGP ' + n.toLocaleString('en-EG', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

function fmtPct(n) {
  return (i18n.lang === 'ar')
    ? n.toFixed(1).toLocaleString('ar-EG') + '%'
    : n.toFixed(1) + '%';
}

function setElem(id, text) {
  var el = document.getElementById(id);
  if (el) el.textContent = text;
}

function safeNum(val) {
  var n = Number(val);
  return Number.isFinite(n) ? n : 0;
}

function escapeHtml(str) {
  return (str || '').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;').replace(/'/g,'&#39;');
}

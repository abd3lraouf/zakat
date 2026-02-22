/* ═══════════════════════════════════════════════════════════
   CALCULATOR — ASSET ROW DEFINITIONS
   Depends on: config.js, state.js, i18n.js, ui.js
═══════════════════════════════════════════════════════════ */
const ASSET_DEFS = {
  gold: [
    { id: 'gold24g',    key: 'calc.gold24',  unit: 'g', stateKey: 'gold24g',   formula: function(v, p) { return v * p.gold24PerGram; } },
    { id: 'gold21g',    key: 'calc.gold21',  unit: 'g', stateKey: 'gold21g',   formula: function(v, p) { return v * p.gold24PerGram * (21/24); } },
    { id: 'gold18g',    key: 'calc.gold18',  unit: 'g', stateKey: 'gold18g',   formula: function(v, p) { return v * p.gold24PerGram * (18/24); } },
    { id: 'silverg',    key: 'calc.silver',  unit: 'g', stateKey: 'silverG',   formula: function(v, p) { return v * p.silverPerGram; } },
  ],
  other: [
    { id: 'cash',        key: 'calc.cash',        unit: 'EGP', stateKey: 'cash',        formula: function(v) { return v; } },
    { id: 'inventory',   key: 'calc.inventory',   unit: 'EGP', stateKey: 'inventory',   formula: function(v) { return v; } },
    { id: 'receivables', key: 'calc.receivables', unit: 'EGP', stateKey: 'receivables', formula: function(v) { return v; } },
    { id: 'investments', key: 'calc.investments', unit: 'EGP', stateKey: 'investments', formula: function(v) { return v; } },
    { id: 'otherassets', key: 'calc.other',       unit: 'EGP', stateKey: 'otherAssets', formula: function(v) { return v; } },
  ],
  deductions: [
    { id: 'immediatedebts',    key: 'calc.debts',       unit: 'EGP', stateKey: 'immediateDebts',    formula: function(v) { return v; } },
    { id: 'otherliabilities',  key: 'calc.liabilities', unit: 'EGP', stateKey: 'otherLiabilities',  formula: function(v) { return v; } },
  ]
};

function renderAssetRows() {
  renderRowGroup('asset-gold', ASSET_DEFS.gold, 'assets');
  renderRowGroup('asset-other', ASSET_DEFS.other, 'assets');
  renderRowGroup('asset-deductions', ASSET_DEFS.deductions, 'deductions');
  renderCustomAssets();
  syncInputsFromState();
}

function renderRowGroup(containerId, defs, stateGroup) {
  var container = document.getElementById(containerId);
  if (!container) return;
  container.innerHTML = '';

  defs.forEach(function(def) {
    var row = document.createElement('div');
    row.className = 'form-row';
    if (stateGroup === 'deductions') row.style.background = 'rgba(192,57,43,0.04)';

    var inputId = 'asset-' + def.id;
    var valueId = 'val-' + def.id;

    var isWeight = def.unit === 'g';
    var stepVal = isWeight ? '0.001' : '0.01';
    var maxVal = isWeight ? '999999' : '999999999';
    row.innerHTML = '<label class="form-label" for="' + inputId + '"><strong>' + i18n.t(def.key) + '</strong></label>' +
      '<input type="number" id="' + inputId + '" min="0" max="' + maxVal + '" step="' + stepVal + '"' +
      ' placeholder="0" value="' + getStateVal(stateGroup, def.stateKey) + '"' +
      ' aria-label="' + i18n.t(def.key) + '"' +
      ' oninput="onAssetInput(\'' + stateGroup + '\',\'' + def.stateKey + '\',this.value)"' +
      ' style="width:140px; flex-shrink:0;"/>' +
      '<span class="input-unit">' + def.unit + '</span>' +
      '<span class="input-value" id="' + valueId + '">EGP 0.00</span>';
    container.appendChild(row);
  });
}

function getStateVal(group, key) {
  var src = group === 'deductions' ? state.calculator.deductions : state.calculator.assets;
  var v = src[key];
  return v ? v : '';
}

function onAssetInput(group, key, rawVal) {
  var val = safeNum(rawVal);
  if (group === 'deductions') {
    state.calculator.deductions[key] = val;
  } else {
    state.calculator.assets[key] = val;
  }
  calcZakat();
  saveLocal();
}

function onPriceInput(key, rawVal) {
  state.calculator.prices[key] = safeNum(rawVal);
  calcZakat();
  saveLocal();
}

/* ═══════════════════════════════════════════════════════════
   CUSTOM ASSETS
═══════════════════════════════════════════════════════════ */
function addCustomAsset() {
  var id = 'custom_' + Date.now();
  state.calculator.customAssets.push({ id: id, label: '', amount: 0 });
  renderCustomAssets();
  saveLocal();
  // focus the new label input
  setTimeout(function() {
    var el = document.getElementById('custom-label-' + id);
    if (el) el.focus();
  }, 50);
}

function renderCustomAssets() {
  var container = document.getElementById('custom-assets-container');
  var section = document.getElementById('custom-assets-section');
  if (!container) return;

  container.innerHTML = '';
  var assets = state.calculator.customAssets;
  if (section) section.style.display = assets.length ? '' : 'none';

  assets.forEach(function(asset, idx) {
    var row = document.createElement('div');
    row.className = 'custom-row';
    row.id = 'custom-row-' + asset.id;
    row.innerHTML = '<input type="text" id="custom-label-' + asset.id + '" placeholder="' + i18n.t('calc.customLabel') + '"' +
      ' value="' + escapeHtml(asset.label) + '" style="width:100%;"' +
      ' oninput="updateCustomLabel(\'' + asset.id + '\', this.value)"' +
      ' aria-label="Custom asset name"/>' +
      '<span class="input-unit">EGP</span>' +
      '<input type="number" id="custom-val-' + asset.id + '" placeholder="0"' +
      ' value="' + (asset.amount || '') + '" min="0" max="999999999" step="0.01"' +
      ' oninput="updateCustomAmount(\'' + asset.id + '\', this.value)"' +
      ' style="width:120px;" aria-label="Custom asset amount"/>' +
      '<span class="input-value" id="custom-display-' + asset.id + '">' + fmtEGP(asset.amount) + '</span>' +
      '<button class="btn-del-row" onclick="removeCustomAsset(\'' + asset.id + '\')"' +
      ' aria-label="Remove this asset">\u00d7</button>';
    container.appendChild(row);
  });
}

function updateCustomLabel(id, label) {
  var a = state.calculator.customAssets.find(function(a) { return a.id === id; });
  if (a) { a.label = label; saveLocal(); calcZakat(); }
}

function updateCustomAmount(id, rawVal) {
  var a = state.calculator.customAssets.find(function(a) { return a.id === id; });
  if (a) {
    a.amount = safeNum(rawVal);
    var disp = document.getElementById('custom-display-' + id);
    if (disp) disp.textContent = fmtEGP(a.amount);
    calcZakat(); saveLocal();
  }
}

function removeCustomAsset(id) {
  var row = document.getElementById('custom-row-' + id);
  if (row) {
    row.style.animation = 'rowDelete 0.2s ease forwards';
    setTimeout(function() {
      state.calculator.customAssets = state.calculator.customAssets.filter(function(a) { return a.id !== id; });
      renderCustomAssets(); calcZakat(); saveLocal();
    }, 200);
  }
}

/* ═══════════════════════════════════════════════════════════
   CALCULATOR ENGINE
═══════════════════════════════════════════════════════════ */
function calcZakat() {
  var p = state.calculator.prices;
  var a = state.calculator.assets;
  var d = state.calculator.deductions;

  // Calculate individual values
  var values = {
    gold24: a.gold24g * p.gold24PerGram,
    gold21: a.gold21g * p.gold24PerGram * (21/24),
    gold18: a.gold18g * p.gold24PerGram * (18/24),
    silver: a.silverG * p.silverPerGram,
    cash:        a.cash,
    inventory:   a.inventory,
    receivables: a.receivables,
    investments: a.investments,
    otherAssets: a.otherAssets,
  };

  // Map stateKey to calculated value for display
  var valueByStateKey = {
    gold24g: values.gold24, gold21g: values.gold21, gold18g: values.gold18,
    silverG: values.silver, cash: values.cash, inventory: values.inventory,
    receivables: values.receivables, investments: values.investments, otherAssets: values.otherAssets,
  };

  // Update row value displays
  var allDefs = ASSET_DEFS.gold.concat(ASSET_DEFS.other);
  allDefs.forEach(function(def) {
    var el = document.getElementById('val-' + def.id);
    if (el) el.textContent = fmtEGP(valueByStateKey[def.stateKey] || 0);
  });

  // Custom asset displays
  state.calculator.customAssets.forEach(function(ca) {
    var el = document.getElementById('custom-display-' + ca.id);
    if (el) el.textContent = fmtEGP(ca.amount);
  });

  var customTotal = state.calculator.customAssets.reduce(function(s, a) { return s + safeNum(a.amount); }, 0);

  var grossAssets = Object.values(values).reduce(function(s, v) { return s + v; }, 0) + customTotal;

  var deductVals = {
    immediateDebts:   d.immediateDebts,
    otherLiabilities: d.otherLiabilities,
  };
  var el1 = document.getElementById('val-immediatedebts');
  var el2 = document.getElementById('val-otherliabilities');
  if (el1) el1.textContent = fmtEGP(d.immediateDebts);
  if (el2) el2.textContent = fmtEGP(d.otherLiabilities);

  var totalDeductions = Object.values(deductVals).reduce(function(s, v) { return s + v; }, 0);
  var netWealth = Math.max(grossAssets - totalDeductions, 0);

  // Nisab
  var nisabGold   = CONFIG.NISAB_GOLD_GRAMS   * p.gold24PerGram;
  var nisabSilver = CONFIG.NISAB_SILVER_GRAMS  * p.silverPerGram;
  var nisab       = Math.min(nisabGold, nisabSilver);
  var nisabMet    = netWealth >= nisab;

  var zakatDue = nisabMet ? netWealth * CONFIG.ZAKAT_RATE : 0;

  state.zakatDue  = zakatDue;
  state.nisabMet  = nisabMet;
  window.zakatState.nisabMet = nisabMet;

  // Update summary panel
  updateSummaryPanel({
    values: values, customTotal: customTotal, grossAssets: grossAssets,
    totalDeductions: totalDeductions, netWealth: netWealth,
    nisabGold: nisabGold, nisabSilver: nisabSilver, nisab: nisab,
    nisabMet: nisabMet, zakatDue: zakatDue
  });

  // Update tracker
  updateTrackerSummary();
}

function updateSummaryPanel(r) {
  var lines = document.getElementById('summary-lines');
  if (!lines) return;

  var allAssetDefs = ASSET_DEFS.gold.map(function(d) { return Object.assign({}, d, { group: 'assets' }); })
    .concat(ASSET_DEFS.other.map(function(d) { return Object.assign({}, d, { group: 'assets' }); }));

  var html = '';

  // Individual assets with value > 0
  var hasAssets = false;
  var valueByKey2 = {
    gold24g: r.values.gold24, gold21g: r.values.gold21, gold18g: r.values.gold18,
    silverG: r.values.silver, cash: r.values.cash, inventory: r.values.inventory,
    receivables: r.values.receivables, investments: r.values.investments, otherAssets: r.values.otherAssets,
  };
  allAssetDefs.forEach(function(def) {
    var val = valueByKey2[def.stateKey] || 0;
    if (val > 0) {
      hasAssets = true;
      html += sumLine(i18n.t(def.key), fmtEGP(val), 'positive');
    }
  });

  // Custom assets
  state.calculator.customAssets.forEach(function(ca) {
    if (ca.amount > 0) {
      hasAssets = true;
      html += sumLine(escapeHtml(ca.label) || i18n.t('calc.customLabel'), fmtEGP(ca.amount), 'positive');
    }
  });

  if (!hasAssets) {
    html += '<div class="calc-empty"><div class="ce-icon">\uD83C\uDFE6</div><p>' + i18n.t('calc.empty') + '</p></div>';
  }

  // Totals
  html += '<div class="menu-divider" style="border-top:1px solid rgba(255,255,255,0.08); margin:8px 0;"></div>';
  html += sumLine(i18n.t('calc.grossAssets'), fmtEGP(r.grossAssets), 'positive');
  if (r.totalDeductions > 0) {
    html += sumLine(i18n.t('calc.totalDeductions'), '- ' + fmtEGP(r.totalDeductions), 'negative');
  }
  html += sumLine(i18n.t('calc.netWealth'), fmtEGP(r.netWealth), '', true);

  // Nisab
  html += '<div class="menu-divider" style="border-top:1px solid rgba(255,255,255,0.08); margin:8px 0;"></div>';
  html += sumLine(i18n.t('calc.nisabGold'),   fmtEGP(r.nisabGold),   '');
  html += sumLine(i18n.t('calc.nisabSilver'), fmtEGP(r.nisabSilver), '');
  html += sumLine(i18n.t('calc.nisabThreshold'), fmtEGP(r.nisab), '', true);

  lines.innerHTML = html;

  // Nisab badge
  var badge = document.getElementById('nisab-badge');
  var nisabText = document.getElementById('nisab-text');
  if (badge && nisabText) {
    if (r.nisabMet) {
      badge.className = 'nisab-badge met';
      nisabText.textContent = i18n.t('calc.met');
    } else {
      badge.className = 'nisab-badge not-met';
      nisabText.textContent = i18n.t('calc.notMet');
    }
  }

  // Zakat result
  var zakatDisplay = document.getElementById('zakat-due-display');
  if (zakatDisplay) zakatDisplay.textContent = fmtEGP(r.zakatDue);
}

function sumLine(label, value, cls, bold) {
  if (cls === undefined) cls = '';
  if (bold === undefined) bold = false;
  return '<div class="sum-line' + (bold ? ' total' : '') + '">' +
    '<span class="sum-line-label">' + label + '</span>' +
    '<span class="sum-line-value ' + cls + '">' + value + '</span>' +
    '</div>';
}

/* ═══════════════════════════════════════════════════════════
   WIRE PRICE INPUTS
   (deferred — runs when DOM is ready, handled by app.js init
    or inline here with a guard)
═══════════════════════════════════════════════════════════ */
document.addEventListener('DOMContentLoaded', function() {
  var priceGold = document.getElementById('price-gold24');
  if (priceGold) {
    priceGold.addEventListener('input', function() {
      onPriceInput('gold24PerGram', this.value);
    });
  }
  var priceSilver = document.getElementById('price-silver');
  if (priceSilver) {
    priceSilver.addEventListener('input', function() {
      onPriceInput('silverPerGram', this.value);
    });
  }
});

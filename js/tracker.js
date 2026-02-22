/* ═══════════════════════════════════════════════════════════
   TRACKER MODULE
   Depends on: config.js, state.js, i18n.js, ui.js
═══════════════════════════════════════════════════════════ */
const CATEGORIES = [
  'cat.faqir', 'cat.miskin', 'cat.amil', 'cat.muallaf',
  'cat.gharim', 'cat.sabilillah', 'cat.ibnsabil', 'cat.org', 'cat.other'
];

function addTrackerRow(count) {
  if (count === undefined) count = 1;
  for (var i = 0; i < count; i++) {
    state.tracker.payments.push({
      id: 'pay_' + Date.now() + '_' + Math.random().toString(36).slice(2),
      date: '', recipient: '', category: '', amount: 0, notes: ''
    });
  }
  renderTrackerTable();
  updateTrackerSummary();
  saveLocal();

  // Scroll & focus new row
  setTimeout(function() {
    var rows = document.querySelectorAll('#tracker-body tr');
    if (rows.length > 0) {
      var last = rows[rows.length - 1];
      last.scrollIntoView({ behavior: 'smooth', block: 'center' });
      var inp = last.querySelector('input');
      if (inp) inp.focus();
    }
  }, 60);

  if (count === 1) showToast(i18n.t('tracker.addRow') + ' \u2713', 'success');
}

function deleteTrackerRow(id) {
  var row = document.getElementById('trow-' + id);
  if (row) {
    row.style.transition = 'opacity 0.2s, transform 0.2s';
    row.style.opacity = '0';
    row.style.transform = 'translateX(20px)';
    setTimeout(function() {
      state.tracker.payments = state.tracker.payments.filter(function(p) { return p.id !== id; });
      renderTrackerTable();
      updateTrackerSummary();
      saveLocal();
    }, 200);
  }
}

function updatePaymentField(id, field, value) {
  var pay = state.tracker.payments.find(function(p) { return p.id === id; });
  if (pay) {
    pay[field] = field === 'amount' ? safeNum(value) : value;
    if (field === 'amount') updateTrackerSummary();
    saveLocal();
  }
}

function renderTrackerTable() {
  var tbody = document.getElementById('tracker-body');
  var empty = document.getElementById('tracker-empty');
  var rowCount = document.getElementById('row-count');
  if (!tbody) return;

  var payments = state.tracker.payments;

  if (payments.length === 0) {
    tbody.innerHTML = '';
    if (empty) empty.style.display = '';
    if (rowCount) rowCount.textContent = i18n.t('tracker.empty.title').indexOf('No') >= 0 ? '0 payments' : '\u0660 \u0645\u062f\u0641\u0648\u0639\u0627\u062a';
    return;
  }

  if (empty) empty.style.display = 'none';
  var count = payments.length;
  if (rowCount) {
    rowCount.textContent = i18n.lang === 'ar'
      ? count.toLocaleString('ar-EG') + ' ' + (count === 1 ? '\u062f\u0641\u0639\u0629' : '\u062f\u0641\u0639\u0627\u062a')
      : count + ' payment' + (count !== 1 ? 's' : '');
  }

  var todayStr = new Date().toISOString().slice(0, 10);
  tbody.innerHTML = payments.map(function(pay, idx) {
    return '<tr id="trow-' + pay.id + '" style="animation: slideDown 0.2s ease both; animation-delay: ' + Math.min(idx * 0.02, 0.3) + 's">' +
      '<td>' + (i18n.lang === 'ar' ? (idx+1).toLocaleString('ar-EG') : idx+1) + '</td>' +
      '<td>' +
        '<input type="date" value="' + (pay.date || '') + '" max="' + todayStr + '"' +
        ' onchange="updatePaymentField(\'' + pay.id + '\',\'date\',this.value)"' +
        ' aria-label="' + i18n.t('tracker.date') + '"/>' +
      '</td>' +
      '<td>' +
        '<input type="text" value="' + escapeHtml(pay.recipient || '') + '"' +
        ' placeholder="' + i18n.t('tracker.recipient') + '\u2026"' +
        ' onchange="updatePaymentField(\'' + pay.id + '\',\'recipient\',this.value)"' +
        ' style="min-width:140px;"' +
        ' aria-label="' + i18n.t('tracker.recipient') + '"/>' +
      '</td>' +
      '<td>' +
        '<select onchange="updatePaymentField(\'' + pay.id + '\',\'category\',this.value)"' +
        ' aria-label="' + i18n.t('tracker.category') + '">' +
          '<option value="">' + i18n.t('tracker.category') + '\u2026</option>' +
          CATEGORIES.map(function(k) { return '<option value="' + k + '"' + (pay.category === k ? ' selected' : '') + '>' + i18n.t(k) + '</option>'; }).join('') +
        '</select>' +
      '</td>' +
      '<td class="amount-col">' +
        '<input type="number" value="' + (pay.amount || '') + '"' +
        ' placeholder="0" min="0" max="999999999" step="0.01"' +
        ' oninput="updatePaymentField(\'' + pay.id + '\',\'amount\',this.value)"' +
        ' style="min-width:110px; text-align:end;"' +
        ' aria-label="' + i18n.t('tracker.amount') + '"/>' +
      '</td>' +
      '<td>' +
        '<input type="text" value="' + escapeHtml(pay.notes || '') + '"' +
        ' placeholder="' + i18n.t('tracker.notes') + '\u2026"' +
        ' onchange="updatePaymentField(\'' + pay.id + '\',\'notes\',this.value)"' +
        ' style="min-width:140px;"' +
        ' aria-label="' + i18n.t('tracker.notes') + '"/>' +
      '</td>' +
      '<td style="text-align:center;">' +
        '<button class="btn-del-row" onclick="deleteTrackerRow(\'' + pay.id + '\')"' +
        ' aria-label="Delete payment row" title="Delete">\u00d7</button>' +
      '</td>' +
    '</tr>';
  }).join('');
}

function updateTrackerSummary() {
  var due  = state.zakatDue;
  var paid = state.tracker.payments.reduce(function(s, p) { return s + safeNum(p.amount); }, 0);
  var remaining = Math.max(due - paid, 0);
  var pct  = due > 0 ? Math.min((paid / due) * 100, 100) : 0;

  setElem('tr-due',       fmtEGP(due));
  setElem('tr-paid',      fmtEGP(paid));
  setElem('tr-remaining', fmtEGP(remaining));
  setElem('footer-paid',      fmtEGP(paid));
  setElem('footer-remaining', fmtEGP(remaining));

  // Sync to calculator summary panel
  setElem('calc-paid',      fmtEGP(paid));
  setElem('calc-remaining', fmtEGP(remaining));
  var calcProgress = document.getElementById('calc-progress');
  if (calcProgress) calcProgress.style.width = pct + '%';
  var calcRemEl = document.getElementById('calc-remaining');
  if (calcRemEl) calcRemEl.style.color = remaining <= 0 && due > 0 ? 'var(--g-600)' : '';

  var pctEl = document.getElementById('tr-pct');
  if (pctEl) {
    pctEl.textContent = i18n.lang === 'ar'
      ? pct.toFixed(1).toLocaleString('ar-EG') + '%'
      : pct.toFixed(1) + '%';
  }

  requestAnimationFrame(function() {
    var bar = document.getElementById('tr-progress');
    if (bar) bar.style.width = pct + '%';
  });

  // Banners
  var paidBanner    = document.getElementById('paid-banner');
  var noZakatBanner = document.getElementById('no-zakat-banner');
  var footerRem     = document.getElementById('footer-remaining');

  if (paidBanner && noZakatBanner) {
    if (!state.nisabMet && due === 0) {
      paidBanner.classList.remove('show');
      noZakatBanner.classList.remove('hidden');
    } else if (due > 0 && remaining <= 0 && paid > 0) {
      paidBanner.classList.add('show');
      noZakatBanner.classList.add('hidden');
      if (footerRem) { footerRem.textContent = fmtEGP(0); footerRem.classList.remove('footer-value-red'); footerRem.classList.add('footer-value-green'); }
    } else {
      paidBanner.classList.remove('show');
      noZakatBanner.classList.add('hidden');
      if (footerRem) { footerRem.classList.remove('footer-value-green'); footerRem.classList.add('footer-value-red'); }
    }
  }

  // Remaining card color
  var remCard = document.querySelector('.sum-card.red .sum-value');
  if (remCard) {
    remCard.style.color = remaining <= 0 ? 'var(--g-600)' : '';
  }
}

function clearAllPayments() {
  if (!state.tracker.payments.length) return;
  if (!confirm(i18n.t('tracker.clearAll.confirm'))) return;
  state.tracker.payments = [];
  renderTrackerTable();
  updateTrackerSummary();
  saveLocal();
}

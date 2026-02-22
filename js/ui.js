/* ═══════════════════════════════════════════════════════════
   NAVIGATION
   Depends on: config.js, state.js, i18n.js
═══════════════════════════════════════════════════════════ */
function showView(name) {
  document.querySelectorAll('.view').forEach(function(v) { v.classList.remove('active'); });
  document.querySelectorAll('.nav-link').forEach(function(l) { l.classList.remove('active'); });
  document.querySelectorAll('.bnav-btn').forEach(function(b) { b.classList.remove('active'); });

  var view = document.getElementById('view-' + name);
  if (view) view.classList.add('active');

  var navBtn = document.getElementById('nav-' + name + '-btn');
  if (navBtn) navBtn.classList.add('active');

  var bnavBtn = document.getElementById('bnav-' + name);
  if (bnavBtn) bnavBtn.classList.add('active');

  // Recalc when switching views
  if (name === 'tracker') updateTrackerSummary();
  if (name === 'calculator') calcZakat();
  if (name === 'profile') updateProfileView();

  // Toggle landing page CTA states based on sign-in
  var guestCta = document.getElementById('guest-cta');
  var userCta = document.getElementById('user-cta');
  if (guestCta && userCta) {
    if (typeof googleUser !== 'undefined' && googleUser) {
      guestCta.classList.add('hidden');
      userCta.classList.remove('hidden');
    } else {
      guestCta.classList.remove('hidden');
      userCta.classList.add('hidden');
    }
  }
}

function skipSignIn() {
  var landing = document.getElementById('view-landing');
  if (landing && landing.classList.contains('active')) {
    var done = false;
    landing.classList.add('view-exit');
    function onDone() {
      if (done) return;
      done = true;
      landing.classList.remove('view-exit');
      showView('calculator');
      window.scrollTo({ top: 0, behavior: 'instant' });
    }
    landing.addEventListener('animationend', onDone, { once: true });
    setTimeout(onDone, 350);
  } else {
    showView('calculator');
    window.scrollTo({ top: 0, behavior: 'instant' });
  }
}

/* ═══════════════════════════════════════════════════════════
   TOAST NOTIFICATIONS
═══════════════════════════════════════════════════════════ */
function showToast(msg, type, duration) {
  if (type === undefined) type = '';
  if (duration === undefined) duration = 2500;
  var container = document.getElementById('toast-container');
  var toast = document.createElement('div');
  toast.className = 'toast ' + type;
  toast.textContent = msg;
  container.appendChild(toast);

  requestAnimationFrame(function() {
    requestAnimationFrame(function() { toast.classList.add('show'); });
  });

  setTimeout(function() {
    toast.classList.remove('show');
    setTimeout(function() { toast.remove(); }, 400);
  }, duration);
}

/* ═══════════════════════════════════════════════════════════
   MODALS
═══════════════════════════════════════════════════════════ */
var previousFocusEl = null;

function openModal(id) {
  var el = document.getElementById(id);
  if (!el) return;
  previousFocusEl = document.activeElement;
  el.classList.add('open');
  trapFocus(el);
}

function closeModal(id) {
  var el = document.getElementById(id);
  if (el) el.classList.remove('open');
  if (previousFocusEl) {
    previousFocusEl.focus();
    previousFocusEl = null;
  }
}

function trapFocus(modal) {
  var focusable = modal.querySelectorAll('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])');
  if (!focusable.length) return;
  var first = focusable[0];
  var last = focusable[focusable.length - 1];
  first.focus();

  modal._trapHandler = function(e) {
    if (e.key !== 'Tab') return;
    if (e.shiftKey) {
      if (document.activeElement === first) { e.preventDefault(); last.focus(); }
    } else {
      if (document.activeElement === last) { e.preventDefault(); first.focus(); }
    }
  };
  modal.addEventListener('keydown', modal._trapHandler);
}

/* ═══════════════════════════════════════════════════════════
   EXPORT / IMPORT
═══════════════════════════════════════════════════════════ */
function doExport() {
  var data = buildExportData();
  var json = JSON.stringify(data, null, 2);
  var blob = new Blob([json], { type: 'application/json' });
  var url  = URL.createObjectURL(blob);
  var a    = document.createElement('a');
  var date = new Date().toISOString().slice(0, 10);
  a.href = url;
  a.download = 'zakat-data-' + date + '.json';
  a.click();
  URL.revokeObjectURL(url);
  showToast('\u2B07 ' + i18n.t('export.success'), 'success');
}

function triggerImport() {
  document.getElementById('import-file-input').click();
}

var pendingImportData = null;

function handleImportFile(event) {
  var file = event.target.files[0];
  if (!file) return;
  event.target.value = '';

  var reader = new FileReader();
  reader.onload = function(e) {
    try {
      var data = JSON.parse(e.target.result);
      if (!data.version) throw new Error('missing version');
      if (data.version !== CONFIG.APP_VERSION) {
        showToast('\u26A0 ' + i18n.t('import.versionError'), 'warning'); return;
      }
      pendingImportData = data;
      var dateStr = data.exportedAt
        ? new Date(data.exportedAt).toLocaleString(i18n.lang === 'ar' ? 'ar-EG' : 'en-GB')
        : '?';
      document.getElementById('import-modal-date').textContent = i18n.t('import.from') + ' ' + dateStr;
      openModal('import-modal');
    } catch (err) {
      showToast('\u2715 ' + i18n.t('import.error'), 'error');
    }
  };
  reader.onerror = function() {
    showToast('\u2715 ' + i18n.t('import.error'), 'error');
  };
  reader.readAsText(file);
}

function confirmImport() {
  if (!pendingImportData) return;
  applyImportData(pendingImportData, true);
  saveLocal();
  closeModal('import-modal');
  pendingImportData = null;
  showToast('\u2713 ' + i18n.t('import.success'), 'success');
}

/* ═══════════════════════════════════════════════════════════
   EVENT LISTENERS (set up on DOMContentLoaded via init)
═══════════════════════════════════════════════════════════ */

// Close on Escape
document.addEventListener('keydown', function(e) {
  if (e.key === 'Escape') {
    document.querySelectorAll('.modal-overlay.open').forEach(function(m) {
      if (m._trapHandler) { m.removeEventListener('keydown', m._trapHandler); m._trapHandler = null; }
      closeModal(m.id);
    });
  }
});

// Close modal on overlay click
document.addEventListener('click', function(e) {
  if (e.target.classList && e.target.classList.contains('modal-overlay') && e.target.classList.contains('open')) {
    closeModal(e.target.id);
  }
});

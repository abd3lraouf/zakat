/* ═══════════════════════════════════════════════════════════
   APP INITIALIZATION
   Depends on: all other JS files loaded before this one
   Load order: config.js, state.js, i18n.js, ui.js,
               calculator.js, tracker.js, google.js, profile.js, app.js
═══════════════════════════════════════════════════════════ */
function init() {
  i18n.init();
  renderAssetRows();
  loadLocal();
  renderTrackerTable();
  calcZakat();
  updateTrackerSummary();
  updateOnlineStatus();
  tryRestoreGoogleSession();

  // Keyboard shortcuts: Alt+C = Calculator, Alt+T = Tracker
  document.addEventListener('keydown', function(e) {
    if (e.altKey && e.key === 'c') showView('calculator');
    if (e.altKey && e.key === 't') showView('tracker');
  });
}

document.addEventListener('DOMContentLoaded', init);

// Wire online/offline events
window.addEventListener('online',  updateOnlineStatus);
window.addEventListener('offline', updateOnlineStatus);

/* ═══════════════════════════════════════════════════════════
   PROFILE PAGE
   Depends on: config.js, state.js, i18n.js, ui.js, google.js
═══════════════════════════════════════════════════════════ */
function updateProfileView() {
  var signedInSection = document.getElementById('profile-signed-in');
  var signedOutSection = document.getElementById('profile-signed-out');
  var syncCard = document.getElementById('profile-sync-card');
  var profileName = document.getElementById('profile-user-name');
  var profileEmail = document.getElementById('profile-user-email');
  var profileInitials = document.getElementById('profile-user-initials');

  if (googleUser && googleAccessToken) {
    // Signed in state
    if (signedInSection) signedInSection.classList.remove('hidden');
    if (signedOutSection) signedOutSection.classList.add('hidden');
    if (syncCard) syncCard.classList.remove('hidden');

    if (profileName) profileName.textContent = googleUser.name || '';
    if (profileEmail) profileEmail.textContent = googleUser.email || '';
    if (profileInitials) {
      var name = googleUser.name || googleUser.email || '?';
      profileInitials.textContent = name.split(' ').map(function(w) { return w[0]; }).join('').slice(0, 2).toUpperCase();
    }
  } else {
    // Signed out state
    if (signedInSection) signedInSection.classList.add('hidden');
    if (signedOutSection) signedOutSection.classList.remove('hidden');
    if (syncCard) syncCard.classList.add('hidden');
  }
}

function forceSync() {
  if (!googleAccessToken) return;
  setSyncStatus('syncing');
  uploadToDrive().then(function() {
    setSyncStatus('synced');
    showToast('\u2713 ' + i18n.t('profile.syncSuccess'), 'success');
    updateProfileView();
  }).catch(function(e) {
    setSyncStatus('error');
    showToast(i18n.t('sync.failed'), 'error');
  });
}

function disconnectGoogle() {
  if (!confirm(i18n.t('profile.disconnect') + '?')) return;
  doSignOut();
  updateProfileView();
  showToast(i18n.t('profile.disconnected'), 'success');
}

function clearAllData() {
  if (!confirm(i18n.t('profile.clearAllConfirm'))) return;

  // Reset state to defaults
  state.calculator.prices = { gold24PerGram: 4625, silverPerGram: 48.50 };
  state.calculator.assets = {
    gold24g: 0, gold21g: 0, gold18g: 0, silverG: 0,
    cash: 0, inventory: 0, receivables: 0, investments: 0, otherAssets: 0
  };
  state.calculator.deductions = { immediateDebts: 0, otherLiabilities: 0 };
  state.calculator.customAssets = [];
  state.tracker.payments = [];
  state.zakatDue = 0;
  state.nisabMet = false;

  // Clear localStorage
  localStorage.removeItem('zakat_app_data');
  clearGoogleUser();

  // Re-render everything
  syncInputsFromState();
  renderAssetRows();
  renderTrackerTable();
  calcZakat();
  updateTrackerSummary();

  showToast(i18n.t('profile.dataCleared'), 'success');
}

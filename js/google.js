/* ═══════════════════════════════════════════════════════════
   GOOGLE SIGN-IN & DRIVE SYNC
   Depends on: config.js, state.js, i18n.js, ui.js
═══════════════════════════════════════════════════════════ */
var googleAccessToken = null;
var driveFileId = null;
var googleUser = null;

function saveGoogleUser() {
  if (googleUser) {
    try { localStorage.setItem('zakat_google_user', JSON.stringify(googleUser)); } catch(e) {}
  }
}

function loadGoogleUser() {
  try {
    var raw = localStorage.getItem('zakat_google_user');
    if (raw) return JSON.parse(raw);
  } catch(e) {}
  return null;
}

function clearGoogleUser() {
  try { localStorage.removeItem('zakat_google_user'); } catch(e) {}
}

function tryRestoreGoogleSession() {
  var saved = loadGoogleUser();
  if (!saved) return;

  // Restore cached user info immediately so UI shows signed-in state
  googleUser = saved;
  showUserInNav(googleUser);

  // Attempt silent token refresh
  if (typeof google === 'undefined' || !google.accounts || CONFIG.GOOGLE_CLIENT_ID === 'YOUR_GOOGLE_CLIENT_ID') return;
  try {
    var client = google.accounts.oauth2.initTokenClient({
      client_id: CONFIG.GOOGLE_CLIENT_ID,
      scope: CONFIG.DRIVE_SCOPE + ' https://www.googleapis.com/auth/userinfo.profile',
      callback: function(tokenResponse) {
        if (tokenResponse.error) {
          // Silent refresh failed — clear stale session
          googleUser = null;
          clearGoogleUser();
          doSignOut();
          return;
        }
        googleAccessToken = tokenResponse.access_token;
        setSyncStatus('syncing');
        checkDriveData();
      },
    });
    client.requestAccessToken({ prompt: '' });
  } catch(e) {
    // Google SDK not ready — keep showing cached user, no sync
  }
}

function startGoogleSignIn() {
  if (CONFIG.GOOGLE_CLIENT_ID === 'YOUR_GOOGLE_CLIENT_ID') {
    showToast('\u26A0 ' + i18n.t('signin.configError'), 'warning', 4000);
    skipSignIn();
    return;
  }

  try {
    var client = google.accounts.oauth2.initTokenClient({
      client_id: CONFIG.GOOGLE_CLIENT_ID,
      scope: CONFIG.DRIVE_SCOPE + ' https://www.googleapis.com/auth/userinfo.profile',
      callback: handleGoogleToken,
    });
    client.requestAccessToken({ prompt: '' });
  } catch (e) {
    console.warn('Google Sign-In error:', e);
    showToast(i18n.t('signin.failed'), 'error');
    skipSignIn();
  }
}

function handleGoogleToken(tokenResponse) {
  if (tokenResponse.error) {
    showToast(i18n.t('signin.failedWith') + ' ' + tokenResponse.error, 'error');
    skipSignIn();
    return;
  }

  googleAccessToken = tokenResponse.access_token;

  // Fetch user profile then continue
  fetch('https://www.googleapis.com/oauth2/v2/userinfo', {
    headers: { Authorization: 'Bearer ' + googleAccessToken }
  }).then(function(res) { return res.json(); })
  .then(function(user) {
    googleUser = user;
    saveGoogleUser();
    showUserInNav(googleUser);
  }).catch(function(e) { /* profile fetch failed, continue */ })
  .finally(function() {
    showView('calculator');
    setSyncStatus('syncing');
    showToast('\u2713 ' + i18n.t('signin.toast'), 'success');

    // Check for existing cloud data
    checkDriveData();
  });
}

function showUserInNav(user) {
  var userDisplay = document.getElementById('user-display');
  var menuSignin = document.getElementById('menu-signin');
  var menuSignout = document.getElementById('menu-signout');
  var syncIndicator = document.getElementById('sync-indicator');

  if (userDisplay) userDisplay.classList.remove('hidden');
  if (menuSignin) menuSignin.classList.add('hidden');
  if (menuSignout) menuSignout.classList.remove('hidden');
  if (syncIndicator) syncIndicator.classList.remove('hidden');

  var initials = document.getElementById('user-initials');
  var name = user.name || user.email || '?';
  if (initials) {
    initials.textContent = name.split(' ').map(function(w) { return w[0]; }).join('').slice(0, 2).toUpperCase();
    initials.title = name;
  }

  // Update landing page CTA — show user welcome, hide guest CTA
  var guestCta = document.getElementById('guest-cta');
  var userCta = document.getElementById('user-cta');
  var userCtaName = document.getElementById('user-cta-name');
  if (guestCta) guestCta.classList.add('hidden');
  if (userCta) userCta.classList.remove('hidden');
  if (userCtaName) userCtaName.textContent = user.name || user.email || '';
}

function checkDriveData() {
  // Search for existing file
  driveRequest(
    'https://www.googleapis.com/drive/v3/files?spaces=appDataFolder&q=name%3D%27' + CONFIG.DRIVE_FILE_NAME + '%27&fields=files(id,modifiedTime)'
  ).then(function(searchRes) {
    var files = searchRes.files || [];

    if (files.length > 0) {
      driveFileId = files[0].id;
      var cloudModified = new Date(files[0].modifiedTime);

      // Get local last modified
      var localModified = null;
      try {
        var local = JSON.parse(localStorage.getItem('zakat_app_data') || '{}');
        if (local.lastModified) localModified = new Date(local.lastModified);
      } catch(e) {}

      if (!localModified || cloudModified > localModified) {
        // Cloud is newer — ask user
        var dateStr = cloudModified.toLocaleString(i18n.lang === 'ar' ? 'ar-EG' : 'en-GB');
        var syncModalDate = document.getElementById('sync-modal-date');
        if (syncModalDate) syncModalDate.textContent = i18n.t('sync.cloudDataFrom') + ' ' + dateStr;
        openModal('sync-modal');
      } else {
        // Local is newer — upload
        uploadToDrive().then(function() {
          setSyncStatus('synced');
        }).catch(function() {
          setSyncStatus('error');
        });
      }
    } else {
      // No cloud file — upload current data
      uploadToDrive().then(function() {
        setSyncStatus('synced');
      }).catch(function() {
        setSyncStatus('error');
      });
    }
  }).catch(function(e) {
    console.warn('Drive check error:', e);
    setSyncStatus('error');
  });
}

function syncResolveCloud() {
  closeModal('sync-modal');
  setSyncStatus('syncing');
  downloadFromDrive().then(function(data) {
    if (data) {
      applyImportData(data, true);
      saveLocal();
      showToast('\u2601 ' + i18n.t('sync.cloudLoaded'), 'success');
    }
    setSyncStatus('synced');
  }).catch(function(e) {
    setSyncStatus('error');
    showToast(i18n.t('sync.failed'), 'error');
  });
}

function syncResolvLocal() {
  closeModal('sync-modal');
  setSyncStatus('syncing');
  uploadToDrive().then(function() {
    setSyncStatus('synced');
    showToast('\u2713 ' + i18n.t('sync.uploaded'), 'success');
  }).catch(function(e) {
    setSyncStatus('error');
  });
}

function downloadFromDrive() {
  if (!driveFileId || !googleAccessToken) return Promise.resolve(null);
  return driveRequest(
    'https://www.googleapis.com/drive/v3/files/' + driveFileId + '?alt=media'
  );
}

function uploadToDrive() {
  if (!googleAccessToken) return Promise.resolve();
  var data = buildExportData();
  var json = JSON.stringify(data);
  var blob = new Blob([json], { type: 'application/json' });

  if (driveFileId) {
    // Update existing
    return fetch('https://www.googleapis.com/upload/drive/v3/files/' + driveFileId + '?uploadType=media', {
      method: 'PATCH',
      headers: {
        'Authorization': 'Bearer ' + googleAccessToken,
        'Content-Type': 'application/json',
      },
      body: blob,
    }).then(function(patchRes) {
      if (!patchRes.ok) throw new Error('Drive upload failed: ' + patchRes.status);
    });
  } else {
    // Create new
    var meta = { name: CONFIG.DRIVE_FILE_NAME, parents: ['appDataFolder'] };
    var form = new FormData();
    form.append('metadata', new Blob([JSON.stringify(meta)], { type: 'application/json' }));
    form.append('file', blob);

    return fetch('https://www.googleapis.com/upload/drive/v3/files?uploadType=multipart', {
      method: 'POST',
      headers: { 'Authorization': 'Bearer ' + googleAccessToken },
      body: form,
    }).then(function(res) {
      if (!res.ok) throw new Error('Drive create failed: ' + res.status);
      return res.json();
    }).then(function(created) {
      driveFileId = created.id;
    });
  }
}

function driveRequest(url) {
  return fetch(url, {
    headers: { 'Authorization': 'Bearer ' + googleAccessToken }
  }).then(function(res) {
    if (!res.ok) throw new Error('Drive API error: ' + res.status);
    return res.json();
  });
}

function scheduleSync() {
  if (!googleAccessToken) return;
  clearTimeout(syncTimer);
  setSyncStatus('syncing');
  syncTimer = setTimeout(function() {
    uploadToDrive().then(function() {
      setSyncStatus('synced');
    }).catch(function(e) {
      setSyncStatus('error');
    });
  }, CONFIG.DEBOUNCE_SYNC);
}

function flashSaveIndicator() {
  var indicator = document.getElementById('sync-indicator');
  var label = document.getElementById('sync-label');
  if (!indicator || !label) return;
  indicator.classList.remove('hidden');
  indicator.className = 'sync-indicator synced';
  label.textContent = '\u2713';
  clearTimeout(flashSaveIndicator._timer);
  flashSaveIndicator._timer = setTimeout(function() {
    indicator.classList.add('hidden');
  }, 1200);
}

function setSyncStatus(status) {
  var indicator = document.getElementById('sync-indicator');
  var label = document.getElementById('sync-label');
  if (!indicator || !label) return;
  indicator.className = 'sync-indicator ' + status;
  label.textContent = i18n.t('sync.' + status);
  indicator.classList.remove('hidden');
}

function doSignOut() {
  var oldToken = googleAccessToken;
  googleAccessToken = null;
  driveFileId = null;
  googleUser = null;
  clearGoogleUser();

  var userDisplay = document.getElementById('user-display');
  var menuSignin = document.getElementById('menu-signin');
  var menuSignout = document.getElementById('menu-signout');
  var syncIndicator = document.getElementById('sync-indicator');

  if (userDisplay) userDisplay.classList.add('hidden');
  if (menuSignin) menuSignin.classList.remove('hidden');
  if (menuSignout) menuSignout.classList.add('hidden');
  if (syncIndicator) syncIndicator.classList.add('hidden');

  // Restore landing page CTA
  var guestCta = document.getElementById('guest-cta');
  var userCta = document.getElementById('user-cta');
  if (guestCta) guestCta.classList.remove('hidden');
  if (userCta) userCta.classList.add('hidden');

  if (typeof google !== 'undefined' && google.accounts && oldToken) {
    google.accounts.oauth2.revoke(oldToken, function() {});
  }

  // Update profile view if visible
  if (typeof updateProfileView === 'function') updateProfileView();

  showToast(i18n.t('signout.toast'), 'success');
}

/* ═══════════════════════════════════════════════════════════
   OFFLINE DETECTION
═══════════════════════════════════════════════════════════ */
function updateOnlineStatus() {
  var banner = document.getElementById('offline-banner');
  if (!banner) return;
  if (navigator.onLine) {
    banner.classList.remove('show');
    if (googleAccessToken) scheduleSync();
  } else {
    banner.classList.add('show');
    setSyncStatus('offline');
  }
}

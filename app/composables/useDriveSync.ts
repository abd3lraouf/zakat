import { useCalculatorStore } from '~~/stores/calculator'
import { useTrackerStore } from '~~/stores/tracker'
import { useGoogleAuth } from '~/composables/useGoogleAuth'
import { useAppToast } from '~/composables/useToast'
import type { SyncStatus } from '~~/shared/types'
import { DEBOUNCE_SYNC } from '~/utils/constants'

// Module-level refs shared across all consumers
const syncStatus = ref<SyncStatus>('offline')
const driveFileId = ref<string | null>(null)
const syncTimer = ref<ReturnType<typeof setTimeout> | null>(null)
const syncConflict = ref(false)
const cloudData = ref<any>(null)
const lastSyncedAt = ref<string | null>(null)
let watchersInitialized = false

// Restore last synced timestamp from localStorage on load
try {
  const rawMeta = localStorage.getItem('zakat_sync_meta')
  if (rawMeta) {
    const meta = JSON.parse(rawMeta)
    if (meta.lastModified) lastSyncedAt.value = meta.lastModified
  }
} catch { /* ignore */ }

export function useDriveSync() {
  const auth = useGoogleAuth()
  const config = useAppConfig()
  const { showToast } = useAppToast()
  const { t } = useI18n()

  // ---------------------------------------------------------------------------
  // Export / Import helpers
  // ---------------------------------------------------------------------------

  function buildExportData() {
    const calc = useCalculatorStore()
    const tracker = useTrackerStore()
    return {
      version: config.appVersion as number,
      lastModified: new Date().toISOString(),
      calculator: {
        prices: { ...calc.prices },
        assets: { ...calc.assets },
        deductions: { ...calc.deductions },
        customAssets: calc.customAssets.map(c => ({ ...c })),
      },
      tracker: {
        payments: tracker.payments.map(p => ({ ...p })),
      },
    }
  }

  function applyImportData(data: any) {
    const calc = useCalculatorStore()
    const tracker = useTrackerStore()

    if (data.calculator && typeof data.calculator === 'object') {
      if (data.calculator.prices && typeof data.calculator.prices === 'object')
        Object.assign(calc.prices, data.calculator.prices)
      if (data.calculator.assets && typeof data.calculator.assets === 'object')
        Object.assign(calc.assets, data.calculator.assets)
      if (data.calculator.deductions && typeof data.calculator.deductions === 'object')
        Object.assign(calc.deductions, data.calculator.deductions)
      if (Array.isArray(data.calculator.customAssets))
        calc.customAssets = data.calculator.customAssets
    }
    if (data.tracker && typeof data.tracker === 'object') {
      if (Array.isArray(data.tracker.payments))
        tracker.payments = data.tracker.payments
    }
  }

  // ---------------------------------------------------------------------------
  // Drive API helpers
  // ---------------------------------------------------------------------------

  async function driveRequest<T = any>(url: string): Promise<T> {
    const res = await fetch(url, {
      headers: { Authorization: `Bearer ${auth.accessToken.value}` },
    })
    if (!res.ok) throw new Error(`Drive API error: ${res.status}`)
    return res.json()
  }

  // ---------------------------------------------------------------------------
  // Upload to Drive
  // ---------------------------------------------------------------------------

  async function uploadToDrive(): Promise<void> {
    if (!auth.accessToken.value) return

    const data = buildExportData()
    const json = JSON.stringify(data)
    const blob = new Blob([json], { type: 'application/json' })

    if (driveFileId.value) {
      // Update existing file
      const res = await fetch(
        `https://www.googleapis.com/upload/drive/v3/files/${driveFileId.value}?uploadType=media`,
        {
          method: 'PATCH',
          headers: {
            'Authorization': `Bearer ${auth.accessToken.value}`,
            'Content-Type': 'application/json',
          },
          body: blob,
        },
      )
      if (!res.ok) throw new Error(`Drive upload failed: ${res.status}`)
    } else {
      // Create new file via multipart upload
      const meta = {
        name: config.driveFileName as string,
        parents: ['appDataFolder'],
      }
      const form = new FormData()
      form.append('metadata', new Blob([JSON.stringify(meta)], { type: 'application/json' }))
      form.append('file', blob)

      const res = await fetch(
        'https://www.googleapis.com/upload/drive/v3/files?uploadType=multipart',
        {
          method: 'POST',
          headers: { Authorization: `Bearer ${auth.accessToken.value}` },
          body: form,
        },
      )
      if (!res.ok) throw new Error(`Drive create failed: ${res.status}`)
      const created = await res.json()
      driveFileId.value = created.id
    }
  }

  // ---------------------------------------------------------------------------
  // Download from Drive
  // ---------------------------------------------------------------------------

  async function downloadFromDrive(): Promise<any | null> {
    if (!driveFileId.value || !auth.accessToken.value) return null
    return driveRequest(
      `https://www.googleapis.com/drive/v3/files/${driveFileId.value}?alt=media`,
    )
  }

  // ---------------------------------------------------------------------------
  // Check for existing cloud data and resolve conflicts
  // ---------------------------------------------------------------------------

  async function checkDriveData(): Promise<void> {
    syncStatus.value = 'syncing'
    try {
      const fileName = config.driveFileName as string
      const searchRes = await driveRequest<{ files: { id: string; modifiedTime: string }[] }>(
        `https://www.googleapis.com/drive/v3/files?spaces=appDataFolder&q=name%3D%27${fileName}%27&fields=files(id,modifiedTime)`,
      )

      const files = searchRes.files || []

      if (files.length > 0) {
        driveFileId.value = files[0].id
        const cloudModified = new Date(files[0].modifiedTime)

        // Get local last modified from Pinia-persisted data
        let localModified: Date | null = null
        try {
          const rawCalc = localStorage.getItem('zakat_calculator')
          const rawTracker = localStorage.getItem('zakat_tracker')
          if (rawCalc || rawTracker) {
            // Use current time as an approximation; a more precise approach
            // would store lastModified separately.  We check if any local data
            // exists — if it does, we treat the current moment as "local time".
            // However, to mirror the original behaviour, we look for the
            // persisted lastModified if it was written via a previous sync.
            const rawMeta = localStorage.getItem('zakat_sync_meta')
            if (rawMeta) {
              const meta = JSON.parse(rawMeta)
              if (meta.lastModified) localModified = new Date(meta.lastModified)
            }
          }
        } catch {
          // ignore parse errors
        }

        if (!localModified || cloudModified > localModified) {
          // Cloud is newer — surface conflict for user to decide
          cloudData.value = { modifiedTime: files[0].modifiedTime }
          syncConflict.value = true
        } else {
          // Local is newer — upload to cloud
          try {
            await uploadToDrive()
            syncStatus.value = 'synced'
          } catch {
            syncStatus.value = 'error'
          }
        }
      } else {
        // No cloud file — upload current local data
        try {
          await uploadToDrive()
          syncStatus.value = 'synced'
        } catch {
          syncStatus.value = 'error'
        }
      }
    } catch (e) {
      console.warn('Drive check error:', e)
      syncStatus.value = 'error'
    }
  }

  // ---------------------------------------------------------------------------
  // Conflict resolution
  // ---------------------------------------------------------------------------

  async function resolveUseCloud(): Promise<void> {
    syncConflict.value = false
    syncStatus.value = 'syncing'
    try {
      const data = await downloadFromDrive()
      if (data) {
        applyImportData(data)
        saveSyncMeta()
        showToast(t('sync.cloudLoaded'), 'success')
      }
      syncStatus.value = 'synced'
    } catch {
      syncStatus.value = 'error'
      showToast(t('sync.failed'), 'error')
    }
  }

  async function resolveKeepLocal(): Promise<void> {
    syncConflict.value = false
    syncStatus.value = 'syncing'
    try {
      await uploadToDrive()
      saveSyncMeta()
      syncStatus.value = 'synced'
      showToast(t('sync.uploaded'), 'success')
    } catch {
      syncStatus.value = 'error'
    }
  }

  // ---------------------------------------------------------------------------
  // Sync scheduling
  // ---------------------------------------------------------------------------

  function scheduleSync(): void {
    if (!auth.accessToken.value) return
    if (syncTimer.value) clearTimeout(syncTimer.value)
    syncStatus.value = 'syncing'
    syncTimer.value = setTimeout(async () => {
      try {
        await uploadToDrive()
        saveSyncMeta()
        syncStatus.value = 'synced'
      } catch {
        syncStatus.value = 'error'
      }
    }, DEBOUNCE_SYNC)
  }

  function forceSync(): void {
    if (!auth.accessToken.value) {
      // No token — trigger sign-in flow (which will sync after auth)
      auth.signIn()
      return
    }
    if (syncTimer.value) clearTimeout(syncTimer.value)
    syncStatus.value = 'syncing'
    uploadToDrive()
      .then(() => {
        saveSyncMeta()
        syncStatus.value = 'synced'
        showToast(t('profile.syncSuccess'), 'success')
      })
      .catch(() => {
        syncStatus.value = 'error'
        showToast(t('sync.failed'), 'error')
      })
  }

  // ---------------------------------------------------------------------------
  // Persist last-modified timestamp for conflict detection
  // ---------------------------------------------------------------------------

  function saveSyncMeta(): void {
    try {
      const now = new Date().toISOString()
      localStorage.setItem(
        'zakat_sync_meta',
        JSON.stringify({ lastModified: now }),
      )
      lastSyncedAt.value = now
    } catch {
      // ignore storage errors
    }
  }

  // ---------------------------------------------------------------------------
  // Watch for access token and store changes (registered once)
  // ---------------------------------------------------------------------------

  if (!watchersInitialized) {
    watchersInitialized = true

    // Trigger Drive data check when user signs in or token is restored
    watch(() => auth.accessToken.value, async (newToken) => {
      if (newToken) {
        await checkDriveData()
      }
    }, { immediate: true })

    // Auto-schedule sync on store changes
    watch(
      [() => useCalculatorStore().$state, () => useTrackerStore().$state],
      () => {
        if (auth.accessToken.value) scheduleSync()
      },
      { deep: true },
    )
  }

  // ---------------------------------------------------------------------------
  // Return public API
  // ---------------------------------------------------------------------------

  return {
    syncStatus: readonly(syncStatus),
    driveFileId: readonly(driveFileId),
    lastSyncedAt: readonly(lastSyncedAt),
    syncConflict,
    cloudData,
    forceSync,
    checkDriveData,
    scheduleSync,
    resolveKeepLocal,
    resolveUseCloud,
    buildExportData,
    applyImportData,
  }
}

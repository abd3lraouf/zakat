<script setup lang="ts">
import { useCalculatorStore } from '~~/stores/calculator'
import { useTrackerStore } from '~~/stores/tracker'
import { useAuthStore } from '~~/stores/auth'

const { t } = useI18n()
const calcStore = useCalculatorStore()
const trackerStore = useTrackerStore()
const authStore = useAuthStore()
const { showToast } = useToast()

const showClearModal = ref(false)

function doExport() {
  const data = {
    version: 1,
    exported: new Date().toISOString(),
    calculator: {
      prices: calcStore.prices,
      assets: calcStore.assets,
      deductions: calcStore.deductions,
      customAssets: calcStore.customAssets,
    },
    tracker: {
      payments: trackerStore.payments,
    },
  }
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `zakat-data-${new Date().toISOString().slice(0, 10)}.json`
  a.click()
  URL.revokeObjectURL(url)
  showToast(t('export.success'), 'success')
}

function doImport() {
  const input = document.createElement('input')
  input.type = 'file'
  input.accept = '.json'
  input.onchange = async (event: Event) => {
    const file = (event.target as HTMLInputElement).files?.[0]
    if (!file) return

    try {
      const text = await file.text()
      const data = JSON.parse(text)

      if (!data.version || data.version !== 1) {
        showToast(t('import.versionError'), 'error')
        return
      }

      if (data.calculator) {
        if (data.calculator.prices) calcStore.prices = data.calculator.prices
        if (data.calculator.assets) calcStore.assets = data.calculator.assets
        if (data.calculator.deductions) calcStore.deductions = data.calculator.deductions
        if (data.calculator.customAssets) calcStore.customAssets = data.calculator.customAssets
      }

      if (data.tracker?.payments) {
        trackerStore.payments = data.tracker.payments
      }

      showToast(t('import.success'), 'success')
    } catch {
      showToast(t('import.error'), 'error')
    }
  }
  input.click()
}

function confirmClear() {
  calcStore.reset()
  trackerStore.clearAll()
  authStore.clearUser()
  localStorage.clear()
  showClearModal.value = false
  showToast(t('profile.dataCleared'), 'success')
}
</script>

<template>
  <div class="profile-card">
    <div class="profile-card-header">
      {{ t('profile.data') }}
    </div>

    <div class="profile-action-rows">
      <div class="profile-data-row">
        <div class="profile-data-info">
          <span class="profile-data-label">{{ t('export.button') }}</span>
          <span class="profile-data-desc">{{ t('profile.exportDesc') }}</span>
        </div>
        <button class="btn btn-outline" @click="doExport">
          {{ t('export.button') }}
        </button>
      </div>

      <div class="profile-data-row">
        <div class="profile-data-info">
          <span class="profile-data-label">{{ t('import.button') }}</span>
          <span class="profile-data-desc">{{ t('profile.importDesc') }}</span>
        </div>
        <button class="btn btn-outline" @click="doImport">
          {{ t('import.button') }}
        </button>
      </div>

      <div class="profile-data-row">
        <div class="profile-data-info">
          <span class="profile-data-label">{{ t('profile.clearAll') }}</span>
          <span class="profile-data-desc">{{ t('profile.clearAllDesc') }}</span>
        </div>
        <button class="btn btn-destructive" @click="showClearModal = true">
          {{ t('profile.clearAll') }}
        </button>
      </div>
    </div>

    <!-- Clear All Confirmation Modal -->
    <AppModal v-model="showClearModal">
      <div class="modal-content">
        <h3 class="modal-title">{{ t('profile.clearAll') }}</h3>
        <p class="modal-message">{{ t('profile.clearAllConfirm') }}</p>
        <div class="modal-actions">
          <button class="btn btn-outline" @click="showClearModal = false">
            {{ t('common.cancel') }}
          </button>
          <button class="btn btn-destructive" @click="confirmClear">
            {{ t('common.confirm') }}
          </button>
        </div>
      </div>
    </AppModal>
  </div>
</template>

<style scoped>
.profile-card {
  background: white;
  border-radius: 12px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.06), 0 4px 12px rgba(0, 0, 0, 0.04);
  border: 1px solid var(--color-parchment-100);
  overflow: hidden;
  margin-bottom: 16px;
  transition: box-shadow 0.3s, transform 0.3s;
}
.profile-card:hover {
  box-shadow: 0 0 0 1px rgba(198, 147, 10, 0.08), 0 4px 16px rgba(198, 147, 10, 0.06);
  transform: translateY(-1px);
}

.profile-card-header {
  padding: 16px 24px;
  background: var(--color-parchment-50);
  border-bottom: 1px solid var(--color-parchment-100);
  font-size: var(--text-sm);
  font-weight: var(--weight-semi);
  color: var(--color-parchment-600);
  text-transform: uppercase;
  letter-spacing: var(--tracking-widest);
  position: relative;
}
.profile-card-header::before {
  content: '';
  position: absolute;
  inset-inline-start: 0;
  top: 8px;
  bottom: 8px;
  width: 3px;
  background: linear-gradient(180deg, var(--color-gold), var(--color-g-500));
  border-radius: 0 2px 2px 0;
}
[dir="rtl"] .profile-card-header::before {
  border-radius: 2px 0 0 2px;
}

/* Action rows */
.profile-action-rows {
  display: flex;
  flex-direction: column;
  gap: 0;
  padding: 0;
}

.profile-data-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  padding: 16px 24px;
  border-bottom: 1px solid var(--color-parchment-100);
}
.profile-data-row:last-child {
  border-bottom: none;
}

.profile-data-info {
  display: flex;
  flex-direction: column;
  gap: 2px;
  min-width: 0;
}

.profile-data-label {
  font-size: var(--text-base);
  font-weight: var(--weight-semi);
  color: var(--color-parchment-800);
}

.profile-data-desc {
  font-size: var(--text-xs);
  color: var(--color-parchment-400);
}

/* Buttons */
.btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 10px 18px;
  border-radius: var(--radius-sm);
  border: none;
  font-family: inherit;
  font-size: var(--text-sm);
  font-weight: var(--weight-medium);
  cursor: pointer;
  transition: all 0.2s;
  letter-spacing: var(--tracking-wide);
  white-space: nowrap;
  flex-shrink: 0;
}

.btn-outline {
  background: white;
  color: var(--color-g-600);
  font-weight: var(--weight-semi);
  border: 1.5px solid var(--color-g-200);
  border-radius: var(--radius-sm);
}
.btn-outline:hover {
  background: var(--color-g-50);
  border-color: var(--color-g-400);
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(0, 108, 53, 0.15);
}
.btn-outline:active {
  transform: translateY(0) scale(0.97);
}

.btn-destructive {
  background: var(--color-red-light);
  color: var(--color-red);
  font-weight: var(--weight-semi);
  border-radius: var(--radius-sm);
}
.btn-destructive:hover {
  background: var(--color-red);
  color: white;
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(220, 38, 38, 0.3);
}
.btn-destructive:active {
  transform: translateY(0) scale(0.97);
}

/* Modal content */
.modal-content {
  text-align: center;
}

.modal-title {
  font-family: var(--font-en-serif);
  font-size: var(--text-lg);
  font-weight: var(--weight-bold);
  color: var(--color-parchment-800);
  margin-bottom: 12px;
}
[dir="rtl"] .modal-title {
  font-family: var(--font-ar-serif);
}

.modal-message {
  font-size: var(--text-base);
  color: var(--color-parchment-500);
  line-height: var(--leading-normal);
  margin-bottom: 24px;
}

.modal-actions {
  display: flex;
  gap: 12px;
  justify-content: center;
}
.modal-actions .btn {
  min-width: 120px;
}
</style>

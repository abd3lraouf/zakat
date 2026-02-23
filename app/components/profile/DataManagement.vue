<script setup lang="ts">
import { useCalculatorStore } from '~~/stores/calculator'
import { useTrackerStore } from '~~/stores/tracker'
import { useAuthStore } from '~~/stores/auth'

const { t } = useI18n()
const calcStore = useCalculatorStore()
const trackerStore = useTrackerStore()
const authStore = useAuthStore()
const { showToast } = useAppToast()

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
  <UCard>
    <template #header>
      <span class="text-xs font-semibold text-(--color-stone-500) uppercase tracking-widest">{{ t('profile.data') }}</span>
    </template>

    <div class="flex flex-col divide-y divide-(--color-stone-200)">
      <div class="flex items-center justify-between gap-4 py-4 first:pt-0">
        <div class="min-w-0">
          <div class="text-base font-semibold text-(--color-stone-800)">{{ t('export.button') }}</div>
          <div class="text-xs text-(--color-stone-400)">{{ t('profile.exportDesc') }}</div>
        </div>
        <UButton variant="outline" color="neutral" @click="doExport">
          {{ t('export.button') }}
        </UButton>
      </div>

      <div class="flex items-center justify-between gap-4 py-4">
        <div class="min-w-0">
          <div class="text-base font-semibold text-(--color-stone-800)">{{ t('import.button') }}</div>
          <div class="text-xs text-(--color-stone-400)">{{ t('profile.importDesc') }}</div>
        </div>
        <UButton variant="outline" color="neutral" @click="doImport">
          {{ t('import.button') }}
        </UButton>
      </div>

      <div class="flex items-center justify-between gap-4 py-4 last:pb-0">
        <div class="min-w-0">
          <div class="text-base font-semibold text-(--color-stone-800)">{{ t('profile.clearAll') }}</div>
          <div class="text-xs text-(--color-stone-400)">{{ t('profile.clearAllDesc') }}</div>
        </div>
        <UButton variant="outline" color="error" @click="showClearModal = true">
          {{ t('profile.clearAll') }}
        </UButton>
      </div>
    </div>

    <!-- Clear All Confirmation Modal -->
    <UModal v-model:open="showClearModal">
      <template #content>
        <div class="p-6 text-center">
          <h3 class="text-lg font-bold text-(--color-stone-800) mb-3">{{ t('profile.clearAll') }}</h3>
          <p class="text-base text-(--color-stone-500) leading-normal mb-6">{{ t('profile.clearAllConfirm') }}</p>
          <div class="flex gap-3 justify-center">
            <UButton variant="outline" color="neutral" @click="showClearModal = false">
              {{ t('common.cancel') }}
            </UButton>
            <UButton color="error" @click="confirmClear">
              {{ t('common.confirm') }}
            </UButton>
          </div>
        </div>
      </template>
    </UModal>
  </UCard>
</template>

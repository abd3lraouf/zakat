<script setup lang="ts">
import { useCalculatorStore } from '~~/stores/calculator'
import { fmtEGP } from '~/utils/format'

const store = useCalculatorStore()
const { t, locale } = useI18n()

function addCustom() {
  store.customAssets.push({
    id: `ca_${Date.now()}_${Math.random().toString(36).slice(2)}`,
    label: '',
    amount: 0,
  })
}

function removeCustom(id: string) {
  store.customAssets = store.customAssets.filter(a => a.id !== id)
}

function onAmountInput(index: number, value: string | number) {
  const val = Number(value)
  store.customAssets[index].amount = Number.isFinite(val) ? val : 0
}
</script>

<template>
  <div v-if="store.customAssets.length > 0" class="mb-5">
    <div class="section-title">{{ t('calc.sectionCustom') }}</div>
    <div
      v-for="(asset, index) in store.customAssets"
      :key="asset.id"
      class="custom-row"
    >
      <UInput
        v-model="asset.label"
        :placeholder="t('calc.customLabel')"
      />
      <UInput
        type="number"
        :model-value="asset.amount || undefined"
        :min="0"
        step="0.01"
        placeholder="0"
        class="font-mono max-w-[120px] max-sm:max-w-full"
        @update:model-value="onAmountInput(index, $event)"
      />
      <span class="text-xs text-(--color-stone-400) whitespace-nowrap tracking-widest uppercase">EGP</span>
      <span class="text-sm font-semibold text-(--color-green-600) whitespace-nowrap min-w-[100px] text-end font-mono">{{ fmtEGP(asset.amount, locale) }}</span>
      <UButton
        variant="ghost"
        color="error"
        icon="i-lucide-trash-2"
        size="sm"
        @click="removeCustom(asset.id)"
      />
    </div>
  </div>
</template>

<style scoped>
.section-title {
  font-size: var(--text-xs);
  text-transform: uppercase;
  letter-spacing: var(--tracking-widest);
  color: var(--color-stone-400);
  padding: 12px 0 8px;
  border-bottom: 1px solid var(--color-stone-200);
  margin-bottom: 4px;
  display: flex;
  align-items: center;
  gap: 8px;
}
.section-title::after {
  content: '';
  flex: 1;
  height: 1px;
  background: var(--color-stone-200);
}

.custom-row {
  display: grid;
  grid-template-columns: 1fr auto 120px auto auto;
  align-items: center;
  gap: 10px;
  padding: 10px 0;
  border-bottom: 1px solid var(--color-stone-200);
  animation: slideDown 0.25s cubic-bezier(0.16, 1, 0.3, 1);
}

@keyframes slideDown {
  from { opacity: 0; transform: translateY(-10px); max-height: 0; }
  to { opacity: 1; transform: translateY(0); max-height: 80px; }
}

@media (max-width: 640px) {
  .custom-row {
    grid-template-columns: 1fr;
    gap: 8px;
  }
}
</style>

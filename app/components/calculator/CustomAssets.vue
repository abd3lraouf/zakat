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

function onAmountInput(index: number, event: Event) {
  const target = event.target as HTMLInputElement
  const val = target.valueAsNumber
  store.customAssets[index].amount = Number.isFinite(val) ? val : 0
}
</script>

<template>
  <div v-if="store.customAssets.length > 0" class="asset-section">
    <div class="asset-section-title">{{ t('calc.sectionCustom') }}</div>
    <div
      v-for="(asset, index) in store.customAssets"
      :key="asset.id"
      class="custom-row"
    >
      <input
        v-model="asset.label"
        type="text"
        class="custom-label-input"
        :placeholder="t('calc.customLabel')"
      />
      <input
        type="number"
        :value="asset.amount || undefined"
        min="0"
        step="0.01"
        placeholder="0"
        class="custom-amount-input"
        @input="onAmountInput(index, $event)"
      />
      <span class="input-unit">EGP</span>
      <span class="input-value">{{ fmtEGP(asset.amount, locale) }}</span>
      <button class="btn-del-row" @click="removeCustom(asset.id)">
        &#x2715;
      </button>
    </div>
  </div>
</template>

<style scoped>
.asset-section {
  margin-bottom: 20px;
}

.asset-section-title {
  font-size: 12px;
  text-transform: uppercase;
  letter-spacing: 1.5px;
  color: var(--color-parchment-400);
  padding: 12px 0 8px;
  border-bottom: 1px solid var(--color-parchment-100);
  margin-bottom: 4px;
  display: flex;
  align-items: center;
  gap: 8px;
}
.asset-section-title::after {
  content: '';
  flex: 1;
  height: 1px;
  background: var(--color-parchment-100);
}

.custom-row {
  display: grid;
  grid-template-columns: 1fr auto 120px auto auto;
  align-items: center;
  gap: 10px;
  padding: 10px 0;
  border-bottom: 1px solid var(--color-parchment-100);
  animation: slideDown 0.25s cubic-bezier(0.16, 1, 0.3, 1);
}

.custom-label-input,
.custom-amount-input {
  font-family: var(--font-mono);
  font-size: 14px;
  padding: 11px 14px;
  min-height: 44px;
  border: 1.5px solid var(--color-parchment-200);
  border-radius: var(--radius-sm);
  background: white;
  color: var(--color-parchment-800);
  outline: none;
  transition: border-color 0.2s, box-shadow 0.2s;
  width: 100%;
}
.custom-label-input:focus,
.custom-amount-input:focus {
  border-color: var(--color-g-500);
  box-shadow: var(--shadow-ring);
}
.custom-label-input::placeholder,
.custom-amount-input::placeholder {
  color: var(--color-parchment-400);
}

.custom-amount-input {
  max-width: 120px;
}

.input-unit {
  font-size: 12px;
  color: var(--color-parchment-400);
  white-space: nowrap;
  letter-spacing: 0.5px;
  text-transform: uppercase;
}

.input-value {
  font-size: 13px;
  font-weight: 600;
  color: var(--color-g-600);
  white-space: nowrap;
  min-width: 100px;
  text-align: end;
  font-family: var(--font-mono);
}

.btn-del-row {
  width: 44px;
  height: 44px;
  border-radius: 6px;
  border: none;
  background: transparent;
  color: var(--color-parchment-400);
  cursor: pointer;
  font-size: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.25s cubic-bezier(0.16, 1, 0.3, 1);
}
.btn-del-row:hover {
  background: var(--color-red-light);
  color: var(--color-red);
}

@keyframes slideDown {
  from {
    opacity: 0;
    transform: translateY(-10px);
    max-height: 0;
  }
  to {
    opacity: 1;
    transform: translateY(0);
    max-height: 80px;
  }
}

@media (max-width: 640px) {
  .custom-row {
    grid-template-columns: 1fr;
    gap: 8px;
  }
  .custom-amount-input {
    max-width: 100%;
  }
}
</style>

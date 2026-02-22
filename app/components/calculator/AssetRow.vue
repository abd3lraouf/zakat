<script setup lang="ts">
import type { AssetDef } from '~~/shared/types'
import { useCalculatorStore } from '~~/stores/calculator'
import { fmtEGP } from '~/utils/format'

const props = defineProps<{
  def: AssetDef
  modelValue: number
}>()

const emit = defineEmits<{
  'update:modelValue': [value: number]
}>()

const store = useCalculatorStore()
const { t, locale } = useI18n()

const computedValue = computed(() => {
  return props.def.formula(props.modelValue, store.prices)
})

function onInput(event: Event) {
  const target = event.target as HTMLInputElement
  const val = target.valueAsNumber
  emit('update:modelValue', Number.isFinite(val) ? val : 0)
}
</script>

<template>
  <div class="form-row">
    <div class="form-label">
      <strong>{{ t(def.key) }}</strong>
    </div>
    <input
      type="number"
      :value="modelValue || undefined"
      min="0"
      step="0.01"
      placeholder="0"
      class="form-input"
      @input="onInput"
    />
    <span class="input-unit">{{ def.unit }}</span>
    <span class="input-value">{{ fmtEGP(computedValue, locale) }}</span>
  </div>
</template>

<style scoped>
.form-row {
  display: grid;
  grid-template-columns: 1fr 140px auto auto;
  align-items: center;
  gap: 16px;
  padding: 14px 0;
  border-bottom: 1px solid var(--color-parchment-100);
}
.form-row:last-child {
  border-bottom: none;
}

.form-label {
  font-size: 13px;
  color: var(--color-parchment-600);
  font-family: var(--font-mono);
}
[dir="rtl"] .form-label {
  font-family: var(--font-ar);
  font-size: 14px;
}

.form-label strong {
  display: block;
  font-weight: 600;
  color: var(--color-parchment-800);
  margin-bottom: 2px;
}

.form-input {
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
.form-input:focus {
  border-color: var(--color-g-500);
  box-shadow: var(--shadow-ring);
}
.form-input::placeholder {
  color: var(--color-parchment-400);
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

@media (max-width: 640px) {
  .form-row {
    grid-template-columns: 1fr;
    gap: 8px;
  }
  .input-value {
    text-align: start;
  }
}
</style>

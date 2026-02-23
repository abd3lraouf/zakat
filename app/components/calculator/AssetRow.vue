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
    <UInput
      type="number"
      :model-value="modelValue || undefined"
      :min="0"
      step="0.01"
      placeholder="0"
      class="form-input font-mono"
      @update:model-value="emit('update:modelValue', Number($event) || 0)"
    />
    <span class="text-xs text-(--color-stone-400) whitespace-nowrap tracking-widest uppercase">{{ def.unit }}</span>
    <span class="text-sm font-semibold text-(--color-green-600) whitespace-nowrap min-w-[100px] text-end font-mono">{{ fmtEGP(computedValue, locale) }}</span>
  </div>
</template>

<style scoped>
.form-row {
  display: grid;
  grid-template-columns: 1fr 140px auto auto;
  align-items: center;
  gap: 16px;
  padding: 14px 0;
  border-bottom: 1px solid var(--color-stone-200);
}
.form-row:last-child {
  border-bottom: none;
}

.form-label {
  font-size: var(--text-sm);
  color: var(--color-stone-600);
}

.form-label strong {
  display: block;
  font-weight: var(--weight-semi);
  color: var(--color-stone-800);
  margin-bottom: 2px;
}

.form-input {
  max-width: 140px;
}

@media (max-width: 640px) {
  .form-row {
    grid-template-columns: 1fr;
    gap: 8px;
  }
  .form-input {
    max-width: 100%;
  }
}
</style>

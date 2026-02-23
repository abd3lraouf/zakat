<script setup lang="ts">
import { useCalculatorStore } from '~~/stores/calculator'

const store = useCalculatorStore()
const { t } = useI18n()
</script>

<template>
  <UCard class="mb-6">
    <template #header>
      <div class="flex items-center justify-between gap-3">
        <h3 class="text-(--text-md) font-semibold text-(--color-stone-800)">{{ t('calc.pricesTitle') }}</h3>
        <span class="text-(--text-xs) text-(--color-stone-400) tracking-widest uppercase">{{ t('calc.pricesNote') }}</span>
      </div>
    </template>

    <p class="text-(--text-sm) text-(--color-stone-400) mb-4">{{ t('calc.pricesHint') }}</p>
    <div class="grid grid-cols-2 gap-3 max-sm:grid-cols-1">
      <UFormField :label="t('calc.gold24')">
        <UInput
          v-model.number="store.prices.gold24PerGram"
          type="number"
          :min="0"
          step="0.01"
          placeholder="0.00"
          class="font-mono"
        />
      </UFormField>
      <UFormField :label="t('calc.silver')">
        <UInput
          v-model.number="store.prices.silverPerGram"
          type="number"
          :min="0"
          step="0.01"
          placeholder="0.00"
          class="font-mono"
        />
      </UFormField>
    </div>
  </UCard>
</template>

<script setup lang="ts">
import { DEDUCTION_DEFS } from '~/utils/constants'

const { t } = useI18n()
</script>

<template>
  <UCard class="deduction-card">
    <template #header>
      <h3 class="text-(--text-md) font-semibold text-(--color-stone-800)">{{ t('calc.deductTitle') }}</h3>
    </template>

    <CalculatorAssetSection
      :title="t('calc.deductTitle')"
      :defs="DEDUCTION_DEFS"
      state-group="deductions"
    />
  </UCard>
</template>

<style scoped>
.deduction-card {
  background: var(--color-red-light);
}
</style>

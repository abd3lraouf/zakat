<script setup lang="ts">
import { DEDUCTION_DEFS } from '~/utils/constants'

const { t } = useI18n()
</script>

<template>
  <div class="card deduction-card">
    <div class="card-header card-header--deduction">
      <h3>{{ t('calc.deductTitle') }}</h3>
    </div>
    <div class="card-body">
      <CalculatorAssetSection
        :title="t('calc.deductTitle')"
        :defs="DEDUCTION_DEFS"
        state-group="deductions"
      />
    </div>
  </div>
</template>

<style scoped>
.card {
  background: white;
  border-radius: var(--radius-md);
  box-shadow: var(--shadow-sm);
  border: 1px solid var(--color-parchment-100);
  overflow: hidden;
}

.deduction-card {
  background: var(--color-red-light);
}

.card-header {
  padding: 18px 24px;
  background: var(--color-parchment-50);
  border-bottom: 1px solid var(--color-parchment-100);
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  position: relative;
}
.card-header::before {
  content: '';
  position: absolute;
  inset-inline-start: 0;
  top: 8px;
  bottom: 8px;
  width: 3px;
  background: linear-gradient(180deg, var(--color-gold), var(--color-g-500));
  border-radius: 0 2px 2px 0;
}
[dir="rtl"] .card-header::before {
  border-radius: 2px 0 0 2px;
}

.card-header--deduction::before {
  background: linear-gradient(180deg, var(--color-red-soft), var(--color-red));
}

.card-header h3 {
  font-size: 15px;
  color: var(--color-parchment-800);
  font-weight: 600;
}
[dir="rtl"] .card-header h3 {
  font-family: var(--font-ar);
  font-size: 17px;
}

.card-body {
  padding: 0 24px;
}
</style>

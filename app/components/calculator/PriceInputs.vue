<script setup lang="ts">
import { useCalculatorStore } from '~~/stores/calculator'

const store = useCalculatorStore()
const { t } = useI18n()
</script>

<template>
  <div class="card mb-6">
    <div class="card-header">
      <h3>{{ t('calc.pricesTitle') }}</h3>
      <span class="price-note">{{ t('calc.pricesNote') }}</span>
    </div>
    <div class="card-body">
      <p class="price-hint">{{ t('calc.pricesHint') }}</p>
      <div class="price-grid">
        <div class="price-item">
          <label>{{ t('calc.gold24') }}</label>
          <input
            v-model.number="store.prices.gold24PerGram"
            type="number"
            min="0"
            step="0.01"
            placeholder="0.00"
          />
        </div>
        <div class="price-item">
          <label>{{ t('calc.silver') }}</label>
          <input
            v-model.number="store.prices.silverPerGram"
            type="number"
            min="0"
            step="0.01"
            placeholder="0.00"
          />
        </div>
      </div>
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

.card-header h3 {
  font-size: var(--text-md);
  color: var(--color-parchment-800);
  font-weight: var(--weight-semi);
}

.price-note {
  font-size: var(--text-xs);
  color: var(--color-parchment-400);
  letter-spacing: var(--tracking-wider);
  text-transform: uppercase;
}

.card-body {
  padding: 24px;
}

.price-hint {
  font-size: var(--text-sm);
  color: var(--color-parchment-400);
  margin-bottom: 16px;
}

.price-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px;
  margin-bottom: 8px;
}
@media (max-width: 480px) {
  .price-grid {
    grid-template-columns: 1fr;
  }
}

.price-item label {
  display: block;
  font-size: var(--text-xs);
  color: var(--color-parchment-400);
  text-transform: uppercase;
  letter-spacing: var(--tracking-wider);
  margin-bottom: 5px;
}

.price-item input {
  font-family: var(--font-mono);
  font-size: var(--text-base);
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
.price-item input:focus {
  border-color: var(--color-g-500);
  box-shadow: var(--shadow-ring);
}
.price-item input::placeholder {
  color: var(--color-parchment-400);
}

.mb-6 {
  margin-bottom: 24px;
}
</style>

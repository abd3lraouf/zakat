<script setup lang="ts">
import { useCalculatorStore } from '~~/stores/calculator'
import { ASSET_DEFS_GOLD, ASSET_DEFS_OTHER } from '~/utils/constants'

const store = useCalculatorStore()
const { t, locale } = useI18n()

useSeoMeta({
  title: () => t('seo.calculator.title'),
  description: () => t('seo.calculator.description'),
  ogTitle: () => t('seo.calculator.title'),
  ogDescription: () => t('seo.calculator.description'),
  ogType: 'website',
  ogLocale: () => locale.value === 'ar' ? 'ar_SA' : 'en_US',
})

function addCustomAsset() {
  store.customAssets.push({
    id: `ca_${Date.now()}_${Math.random().toString(36).slice(2)}`,
    label: '',
    amount: 0,
  })
}
</script>

<template>
  <div class="view-content">
    <div class="section-header">
      <h2 class="section-title">{{ t('calc.title') }}</h2>
      <p class="section-sub">{{ t('calc.subtitle') }}</p>
    </div>

    <div class="calc-layout">
      <!-- Left column: inputs -->
      <div class="calc-inputs">
        <CalculatorPriceInputs />

        <div class="card mb-6">
          <div class="card-header">
            <h3>{{ t('calc.assetsTitle') }}</h3>
            <button class="btn btn-gold btn-sm" @click="addCustomAsset">
              + {{ t('calc.addAsset') }}
            </button>
          </div>
          <div class="card-body card-body--flush">
            <CalculatorAssetSection
              :title="t('calc.sectionGold')"
              :defs="ASSET_DEFS_GOLD"
              state-group="assets"
            />
            <CalculatorAssetSection
              :title="t('calc.sectionOther')"
              :defs="ASSET_DEFS_OTHER"
              state-group="assets"
            />
            <CalculatorCustomAssets />
          </div>
        </div>

        <CalculatorDeductionInputs />
      </div>

      <!-- Right column: summary -->
      <CalculatorSummaryPanel />
    </div>
  </div>
</template>

<style scoped>
.view-content {
  min-height: calc(100vh - var(--spacing-navbar-h));
  padding: 32px 20px 64px;
  max-width: 1100px;
  margin: 0 auto;
  animation: viewIn 0.3s cubic-bezier(0.16, 1, 0.3, 1) both;
}

@keyframes viewIn {
  from {
    opacity: 0;
    transform: translateY(12px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.section-header {
  margin-bottom: 28px;
}

.section-title {
  font-size: var(--text-xl);
  color: var(--color-g-800);
  margin-bottom: 6px;
  font-family: var(--font-en-serif);
}
[dir="rtl"] .section-title {
  font-family: var(--font-ar-serif);
}
.section-title::after {
  content: '\25C6';
  font-size: 8px;
  color: var(--color-gold);
  margin-inline-start: 10px;
  vertical-align: middle;
}

.section-sub {
  font-size: var(--text-sm);
  color: var(--color-parchment-400);
  letter-spacing: var(--tracking-wide);
}

/* ── Two-column layout ── */
.calc-layout {
  display: grid;
  grid-template-columns: 1fr 380px;
  gap: 24px;
  align-items: start;
}
@media (max-width: 900px) {
  .calc-layout {
    grid-template-columns: 1fr;
  }
}

/* ── Card styles ── */
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

.card-body {
  padding: 24px;
}
.card-body--flush {
  padding: 0 24px;
}

.mb-6 {
  margin-bottom: 24px;
}

/* ── Button styles ── */
.btn {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 12px 22px;
  border-radius: var(--radius-sm);
  border: none;
  font-family: inherit;
  font-size: 13px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
  letter-spacing: 0.3px;
  white-space: nowrap;
}

.btn-gold {
  background: linear-gradient(135deg, var(--color-gold), var(--color-gold-light));
  color: var(--color-g-800);
  font-weight: 600;
  border-radius: 999px;
}
.btn-gold:hover {
  background: linear-gradient(135deg, var(--color-gold-light), var(--color-gold));
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(198, 147, 10, 0.35);
}
.btn-gold:active {
  transform: translateY(0) scale(0.97);
}

.btn-sm {
  padding: 7px 14px;
  font-size: 13px;
}
</style>

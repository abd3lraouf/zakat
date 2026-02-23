<script setup lang="ts">
import type { AssetDef } from '~~/shared/types'
import { useCalculatorStore } from '~~/stores/calculator'
import { useTrackerStore } from '~~/stores/tracker'
import { ASSET_DEFS_GOLD, ASSET_DEFS_OTHER } from '~/utils/constants'
import { usePreferencesStore } from '~~/stores/preferences'
import { fmtCurrency, fmtPct } from '~/utils/format'

const store = useCalculatorStore()
const trackerStore = useTrackerStore()
const { t, locale } = useI18n()
const prefs = usePreferencesStore()

const allAssetDefs = [...ASSET_DEFS_GOLD, ...ASSET_DEFS_OTHER]

function assetEgpValue(def: AssetDef): number {
  const raw = store.assets[def.stateKey as keyof typeof store.assets] ?? 0
  return def.formula(raw, store.prices)
}

const activeAssets = computed(() => {
  return allAssetDefs.filter(def => assetEgpValue(def) > 0)
})

const activeCustom = computed(() => {
  return store.customAssets.filter(a => a.amount > 0)
})

const activeDeductions = computed(() => {
  const result: { label: string; value: number }[] = []
  if (store.deductions.immediateDebts > 0) {
    result.push({ label: t('calc.debts'), value: store.deductions.immediateDebts })
  }
  if (store.deductions.otherLiabilities > 0) {
    result.push({ label: t('calc.liabilities'), value: store.deductions.otherLiabilities })
  }
  return result
})

const hasAnyValue = computed(() => {
  return store.grossAssets > 0
})
</script>

<template>
  <div class="summary-panel">
    <!-- Header -->
    <div class="summary-panel-header">
      <h3>{{ t('calc.summaryTitle') }}</h3>
      <p>{{ t('calc.summaryNote') }}</p>
    </div>

    <!-- Empty state -->
    <div v-if="!hasAnyValue" class="calc-empty">
      <UIcon name="i-lucide-calculator" class="size-11 mb-3.5 text-white/40" />
      <p>{{ t('calc.empty') }}</p>
    </div>

    <!-- Summary content -->
    <template v-else>
      <!-- Asset line items -->
      <div class="summary-lines">
        <div v-for="def in activeAssets" :key="def.id" class="sum-line">
          <span class="sum-line-label">{{ t(def.key) }}</span>
          <span class="sum-line-value positive">{{ fmtCurrency(assetEgpValue(def), locale, prefs.currency) }}</span>
        </div>

        <div v-for="asset in activeCustom" :key="asset.id" class="sum-line">
          <span class="sum-line-label">{{ asset.label || t('calc.customLabel') }}</span>
          <span class="sum-line-value positive">{{ fmtCurrency(asset.amount, locale, prefs.currency) }}</span>
        </div>

        <div class="summary-divider" />

        <div class="sum-line total">
          <span class="sum-line-label">{{ t('calc.grossAssets') }}</span>
          <span class="sum-line-value">{{ fmtCurrency(store.grossAssets, locale, prefs.currency) }}</span>
        </div>

        <div v-for="ded in activeDeductions" :key="ded.label" class="sum-line">
          <span class="sum-line-label">{{ ded.label }}</span>
          <span class="sum-line-value negative">&minus; {{ fmtCurrency(ded.value, locale, prefs.currency) }}</span>
        </div>

        <div v-if="store.totalDeductions > 0" class="sum-line total">
          <span class="sum-line-label">{{ t('calc.totalDeductions') }}</span>
          <span class="sum-line-value negative">&minus; {{ fmtCurrency(store.totalDeductions, locale, prefs.currency) }}</span>
        </div>

        <div class="sum-line total">
          <span class="sum-line-label">{{ t('calc.netWealth') }}</span>
          <span class="sum-line-value">{{ fmtCurrency(store.netWealth, locale, prefs.currency) }}</span>
        </div>
      </div>

      <!-- Nisab section -->
      <div class="summary-lines nisab-section">
        <div class="sum-line">
          <span class="sum-line-label">{{ t('calc.nisabGold') }}</span>
          <span class="sum-line-value">{{ fmtCurrency(store.nisabGold, locale, prefs.currency) }}</span>
        </div>
        <div class="sum-line">
          <span class="sum-line-label">{{ t('calc.nisabSilver') }}</span>
          <span class="sum-line-value">{{ fmtCurrency(store.nisabSilver, locale, prefs.currency) }}</span>
        </div>
        <div class="sum-line">
          <span class="sum-line-label">{{ t('calc.nisabThreshold') }}</span>
          <span class="sum-line-value">{{ fmtCurrency(store.nisabThreshold, locale, prefs.currency) }}</span>
        </div>
      </div>

      <!-- Nisab badge -->
      <div class="mx-6 mb-4">
        <UBadge
          :color="store.nisabMet ? 'success' : 'error'"
          variant="subtle"
          size="lg"
          class="w-full justify-center gap-2 py-3"
        >
          <UIcon :name="store.nisabMet ? 'i-lucide-check-circle' : 'i-lucide-x-circle'" class="size-[18px]" />
          {{ store.nisabMet ? t('calc.met') : t('calc.notMet') }}
        </UBadge>
      </div>

      <!-- Zakat Due result -->
      <div class="zakat-result">
        <div class="zakat-result-label">{{ t('calc.zakatDue') }}</div>
        <div class="zakat-result-value">{{ fmtCurrency(store.zakatDue, locale, prefs.currency) }}</div>
      </div>

      <!-- Payment progress from tracker -->
      <div v-if="store.zakatDue > 0" class="calc-payment-progress">
        <div class="sum-line">
          <span class="sum-line-label">{{ t('tracker.paid') }}</span>
          <span class="sum-line-value positive">{{ fmtCurrency(trackerStore.totalPaid, locale, prefs.currency) }}</span>
        </div>
        <div class="sum-line">
          <span class="sum-line-label">{{ t('tracker.remaining') }}</span>
          <span class="sum-line-value">{{ fmtCurrency(trackerStore.remaining, locale, prefs.currency) }}</span>
        </div>
        <div class="progress-wrap">
          <div class="progress-bg">
            <div class="progress-fill" :style="{ width: fmtPct(trackerStore.progress, locale) }" />
          </div>
        </div>
        <UButton
          to="/tracker"
          color="neutral"
          variant="solid"
          size="sm"
          class="mt-3"
        >
          {{ t('calc.goTracker') }}
        </UButton>
      </div>
    </template>
  </div>
</template>

<style scoped>
/* ── Summary panel — dark gradient + pattern ── */
.summary-panel {
  background: linear-gradient(165deg, var(--color-green-800), var(--color-green-900));
  border-radius: var(--radius-md);
  overflow: hidden;
  position: sticky;
  top: calc(var(--spacing-navbar-h) + 20px);
  border: 1px solid rgba(184, 147, 58, 0.1);
  box-shadow: var(--shadow-lg), inset 0 1px 0 rgba(184, 147, 58, 0.2);
}
.summary-panel::before {
  content: '';
  position: absolute;
  inset: 0;
  pointer-events: none;
  opacity: 0.03;
  background-image: repeating-conic-gradient(
    from 0deg at 50% 50%,
    transparent 0deg,
    transparent 44deg,
    rgba(184, 147, 58, 0.5) 44deg,
    rgba(184, 147, 58, 0.5) 46deg
  );
  background-size: 60px 60px;
}

.summary-panel-header {
  padding: 20px 24px;
  border-bottom: 1px solid rgba(184, 147, 58, 0.3);
  position: relative;
}
.summary-panel-header h3 {
  color: #fff;
  font-size: var(--text-md);
  margin-bottom: 4px;
}
.summary-panel-header p {
  font-size: var(--text-xs);
  color: rgba(255, 255, 255, 0.7);
  letter-spacing: var(--tracking-wider);
}

/* ── Empty state ── */
.calc-empty {
  text-align: center;
  padding: 48px 20px;
  color: rgba(255, 255, 255, 0.5);
}
.calc-empty p {
  font-size: var(--text-sm);
  line-height: var(--leading-normal);
}

/* ── Summary lines ── */
.summary-lines {
  padding: 16px 24px;
  display: flex;
  flex-direction: column;
  position: relative;
}

.nisab-section {
  border-top: 1px solid rgba(184, 147, 58, 0.2);
}

.sum-line {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 9px 0;
  border-bottom: 1px solid rgba(255, 255, 255, 0.06);
  font-size: 13px;
}
.sum-line:last-child {
  border-bottom: none;
}

.sum-line-label {
  color: rgba(255, 255, 255, 0.75);
}
.sum-line-value {
  font-weight: var(--weight-semi);
  color: #fff;
  font-family: var(--font-mono);
  font-size: var(--text-sm);
}
.sum-line-value.positive {
  color: var(--color-green-400);
}
.sum-line-value.negative {
  color: #F87171;
}

.sum-line.total {
  padding: 14px 0 6px;
  border-top: 1px solid rgba(184, 147, 58, 0.3);
  border-bottom: none;
  margin-top: 4px;
}
.sum-line.total .sum-line-label {
  color: rgba(255, 255, 255, 0.8);
  font-weight: 600;
}
.sum-line.total .sum-line-value {
  color: #fff;
  font-size: var(--text-md);
}

.summary-divider {
  border-top: 1px solid rgba(184, 147, 58, 0.2);
  margin: 8px 0;
}

/* ── Zakat due result ── */
.zakat-result {
  margin: 0 24px 24px;
  padding: 20px;
  background: linear-gradient(135deg, var(--color-gold-500), var(--color-gold-300));
  border-radius: var(--radius-md);
  position: relative;
  overflow: hidden;
  box-shadow: inset 0 -1px 0 rgba(0, 0, 0, 0.1), 0 2px 8px rgba(184, 147, 58, 0.2);
}
.zakat-result::before {
  content: '';
  position: absolute;
  inset: 0;
  pointer-events: none;
  opacity: 0.06;
  background-image: repeating-conic-gradient(
    from 0deg at 50% 50%,
    transparent 0deg,
    transparent 44deg,
    rgba(255, 255, 255, 0.5) 44deg,
    rgba(255, 255, 255, 0.5) 46deg
  );
  background-size: 40px 40px;
}
.zakat-result-label {
  font-size: var(--text-xs);
  text-transform: uppercase;
  letter-spacing: var(--tracking-widest);
  color: var(--color-green-800);
  opacity: 0.85;
  margin-bottom: 6px;
  position: relative;
}
.zakat-result-value {
  font-family: var(--font-en-serif);
  font-size: var(--text-2xl);
  font-weight: var(--weight-bold);
  color: var(--color-green-800);
  line-height: var(--leading-tight);
  position: relative;
}

/* ── Payment progress ── */
.calc-payment-progress {
  margin: 0 24px 20px;
  padding: 16px;
  background: rgba(255, 255, 255, 0.06);
  border-radius: var(--radius-sm);
  border: 1px solid rgba(184, 147, 58, 0.15);
}

.progress-wrap { margin-top: 10px; }
.progress-bg {
  height: 4px;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 4px;
  overflow: hidden;
}
.progress-fill {
  height: 100%;
  border-radius: 4px;
  background: linear-gradient(90deg, var(--color-green-500), var(--color-gold-500));
  transition: width 0.6s cubic-bezier(0.4, 0, 0.2, 1);
  position: relative;
  overflow: hidden;
}
.progress-fill::after {
  content: '';
  position: absolute;
  inset: 0;
  background: linear-gradient(90deg, transparent 0%, rgba(255, 255, 255, 0.35) 50%, transparent 100%);
  animation: shimmer 2.5s ease-in-out infinite;
}
[dir="rtl"] .progress-fill {
  background: linear-gradient(270deg, var(--color-green-500), var(--color-gold-500));
}

@keyframes shimmer {
  0% { transform: translateX(-100%); }
  100% { transform: translateX(200%); }
}

@media (max-width: 900px) {
  .summary-panel {
    position: static;
  }
}
</style>

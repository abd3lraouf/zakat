<script setup lang="ts">
import type { AssetDef } from '~~/shared/types'
import { useCalculatorStore } from '~~/stores/calculator'
import { useTrackerStore } from '~~/stores/tracker'
import { ASSET_DEFS_GOLD, ASSET_DEFS_OTHER } from '~/utils/constants'
import { fmtEGP, fmtPct } from '~/utils/format'

const store = useCalculatorStore()
const trackerStore = useTrackerStore()
const { t, locale } = useI18n()

const allAssetDefs = [...ASSET_DEFS_GOLD, ...ASSET_DEFS_OTHER]

/** Return the EGP value of a given asset def, or 0 if not set */
function assetEgpValue(def: AssetDef): number {
  const raw = store.assets[def.stateKey as keyof typeof store.assets] ?? 0
  return def.formula(raw, store.prices)
}

/** Non-zero asset line items for display */
const activeAssets = computed(() => {
  return allAssetDefs.filter(def => assetEgpValue(def) > 0)
})

/** Non-zero custom assets */
const activeCustom = computed(() => {
  return store.customAssets.filter(a => a.amount > 0)
})

/** Non-zero deduction lines */
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
      <div class="ce-icon">
        <Icon name="lucide:calculator" size="44" />
      </div>
      <p>{{ t('calc.empty') }}</p>
    </div>

    <!-- Summary content -->
    <template v-else>
      <!-- Asset line items -->
      <div class="summary-lines">
        <div
          v-for="def in activeAssets"
          :key="def.id"
          class="sum-line"
        >
          <span class="sum-line-label">{{ t(def.key) }}</span>
          <span class="sum-line-value positive">{{ fmtEGP(assetEgpValue(def), locale) }}</span>
        </div>

        <!-- Custom asset lines -->
        <div
          v-for="asset in activeCustom"
          :key="asset.id"
          class="sum-line"
        >
          <span class="sum-line-label">{{ asset.label || t('calc.customLabel') }}</span>
          <span class="sum-line-value positive">{{ fmtEGP(asset.amount, locale) }}</span>
        </div>

        <!-- Divider -->
        <div class="summary-divider" />

        <!-- Gross Assets total -->
        <div class="sum-line total">
          <span class="sum-line-label">{{ t('calc.grossAssets') }}</span>
          <span class="sum-line-value">{{ fmtEGP(store.grossAssets, locale) }}</span>
        </div>

        <!-- Deduction lines -->
        <div
          v-for="ded in activeDeductions"
          :key="ded.label"
          class="sum-line"
        >
          <span class="sum-line-label">{{ ded.label }}</span>
          <span class="sum-line-value negative">&minus; {{ fmtEGP(ded.value, locale) }}</span>
        </div>

        <!-- Total Deductions -->
        <div v-if="store.totalDeductions > 0" class="sum-line total">
          <span class="sum-line-label">{{ t('calc.totalDeductions') }}</span>
          <span class="sum-line-value negative">&minus; {{ fmtEGP(store.totalDeductions, locale) }}</span>
        </div>

        <!-- Net Wealth -->
        <div class="sum-line total">
          <span class="sum-line-label">{{ t('calc.netWealth') }}</span>
          <span class="sum-line-value">{{ fmtEGP(store.netWealth, locale) }}</span>
        </div>
      </div>

      <!-- Nisab section -->
      <div class="summary-lines nisab-section">
        <div class="sum-line">
          <span class="sum-line-label">{{ t('calc.nisabGold') }}</span>
          <span class="sum-line-value">{{ fmtEGP(store.nisabGold, locale) }}</span>
        </div>
        <div class="sum-line">
          <span class="sum-line-label">{{ t('calc.nisabSilver') }}</span>
          <span class="sum-line-value">{{ fmtEGP(store.nisabSilver, locale) }}</span>
        </div>
        <div class="sum-line">
          <span class="sum-line-label">{{ t('calc.nisabThreshold') }}</span>
          <span class="sum-line-value">{{ fmtEGP(store.nisabThreshold, locale) }}</span>
        </div>
      </div>

      <!-- Nisab badge -->
      <div :class="['nisab-badge', store.nisabMet ? 'met' : 'not-met']">
        <Icon :name="store.nisabMet ? 'lucide:check-circle' : 'lucide:x-circle'" size="18" class="nisab-icon" />
        <span>{{ store.nisabMet ? t('calc.met') : t('calc.notMet') }}</span>
      </div>

      <!-- Zakat Due result -->
      <div class="zakat-result">
        <div class="zakat-result-label">{{ t('calc.zakatDue') }}</div>
        <div class="zakat-result-value">{{ fmtEGP(store.zakatDue, locale) }}</div>
      </div>

      <!-- Payment progress from tracker -->
      <div v-if="store.zakatDue > 0" class="calc-payment-progress">
        <div class="sum-line">
          <span class="sum-line-label">{{ t('tracker.paid') }}</span>
          <span class="sum-line-value positive">{{ fmtEGP(trackerStore.totalPaid, locale) }}</span>
        </div>
        <div class="sum-line">
          <span class="sum-line-label">{{ t('tracker.remaining') }}</span>
          <span class="sum-line-value">{{ fmtEGP(trackerStore.remaining, locale) }}</span>
        </div>
        <div class="progress-wrap">
          <div class="progress-bg">
            <div
              class="progress-fill"
              :style="{ width: fmtPct(trackerStore.progress, locale) }"
            />
          </div>
        </div>
        <NuxtLink to="/tracker" class="btn btn-gold btn-sm tracker-link">
          {{ t('calc.goTracker') }}
        </NuxtLink>
      </div>
    </template>
  </div>
</template>

<style scoped>
/* ── Summary panel — dark gradient + pattern ── */
.summary-panel {
  background: linear-gradient(165deg, var(--color-g-800), var(--color-g-900));
  border-radius: var(--radius-md);
  overflow: hidden;
  position: sticky;
  top: calc(var(--spacing-navbar-h) + 20px);
  border: 1px solid rgba(198, 147, 10, 0.1);
  box-shadow: var(--shadow-lg), inset 0 1px 0 rgba(198, 147, 10, 0.2);
}
/* Subtle geometric pattern overlay */
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
    rgba(198, 147, 10, 0.5) 44deg,
    rgba(198, 147, 10, 0.5) 46deg
  );
  background-size: 60px 60px;
}

.summary-panel-header {
  padding: 20px 24px;
  border-bottom: 1px solid rgba(198, 147, 10, 0.3);
  position: relative;
}
.summary-panel-header h3 {
  color: #fff;
  font-size: 16px;
  margin-bottom: 4px;
}
.summary-panel-header p {
  font-size: 12px;
  color: rgba(255, 255, 255, 0.7);
  letter-spacing: 0.5px;
}

/* ── Empty state ── */
.calc-empty {
  text-align: center;
  padding: 48px 20px;
  color: rgba(255, 255, 255, 0.5);
}
.calc-empty .ce-icon {
  margin-bottom: 14px;
  color: rgba(255, 255, 255, 0.4);
}
.calc-empty p {
  font-size: 13px;
  line-height: 1.6;
}

/* ── Summary lines ── */
.summary-lines {
  padding: 16px 24px;
  display: flex;
  flex-direction: column;
  gap: 0;
  position: relative;
}

.nisab-section {
  border-top: 1px solid rgba(198, 147, 10, 0.2);
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
  font-weight: 600;
  color: #fff;
  font-family: var(--font-mono);
  font-size: 13px;
}
.sum-line-value.positive {
  color: var(--color-g-400);
}
.sum-line-value.negative {
  color: #F87171;
}

.sum-line.total {
  padding: 14px 0 6px;
  border-top: 1px solid rgba(198, 147, 10, 0.3);
  border-bottom: none;
  margin-top: 4px;
}
.sum-line.total .sum-line-label {
  color: rgba(255, 255, 255, 0.8);
  font-weight: 600;
}
.sum-line.total .sum-line-value {
  color: #fff;
  font-size: 15px;
}

/* ── Divider ── */
.summary-divider {
  border-top: 1px solid rgba(198, 147, 10, 0.2);
  margin: 8px 0;
}

/* ── Nisab badge ── */
.nisab-badge {
  margin: 0 24px 16px;
  padding: 12px 16px;
  border-radius: var(--radius-sm);
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: 13px;
  transition: all 0.25s cubic-bezier(0.16, 1, 0.3, 1);
  position: relative;
}
.nisab-badge.met {
  background: rgba(43, 168, 104, 0.15);
  border: 1px solid rgba(43, 168, 104, 0.3);
  color: var(--color-g-400);
}
.nisab-badge.not-met {
  background: rgba(220, 38, 38, 0.12);
  border: 1px solid rgba(220, 38, 38, 0.25);
  color: #F87171;
}
.nisab-icon {
  flex-shrink: 0;
}

/* ── Zakat due result — gradient + pattern ── */
.zakat-result {
  margin: 0 24px 24px;
  padding: 20px;
  background: linear-gradient(135deg, var(--color-gold), var(--color-gold-light));
  border-radius: var(--radius-md);
  position: relative;
  overflow: hidden;
  box-shadow: inset 0 -1px 0 rgba(0, 0, 0, 0.1), 0 2px 8px rgba(198, 147, 10, 0.2);
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
  font-size: 12px;
  text-transform: uppercase;
  letter-spacing: 1.5px;
  color: var(--color-g-800);
  opacity: 0.85;
  margin-bottom: 6px;
  position: relative;
}
.zakat-result-value {
  font-family: var(--font-en-serif);
  font-size: 28px;
  font-weight: 700;
  color: var(--color-g-800);
  line-height: 1;
  position: relative;
}

/* ── Payment progress ── */
.calc-payment-progress {
  margin: 0 24px 20px;
  padding: 16px;
  background: rgba(255, 255, 255, 0.06);
  border-radius: var(--radius-sm);
  border: 1px solid rgba(198, 147, 10, 0.15);
}

.progress-wrap {
  margin-top: 10px;
}
.progress-bg {
  height: 4px;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 4px;
  overflow: hidden;
}
.progress-fill {
  height: 100%;
  border-radius: 4px;
  background: linear-gradient(90deg, var(--color-g-500), var(--color-gold));
  transition: width 0.6s cubic-bezier(0.4, 0, 0.2, 1);
  position: relative;
  overflow: hidden;
}
.progress-fill::after {
  content: '';
  position: absolute;
  inset: 0;
  background: linear-gradient(
    90deg,
    transparent 0%,
    rgba(255, 255, 255, 0.35) 50%,
    transparent 100%
  );
  animation: shimmer 2.5s ease-in-out infinite;
}
[dir="rtl"] .progress-fill {
  background: linear-gradient(270deg, var(--color-g-500), var(--color-gold));
}

@keyframes shimmer {
  0% {
    transform: translateX(-100%);
  }
  100% {
    transform: translateX(200%);
  }
}

/* ── Tracker link button ── */
.tracker-link {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  margin-top: 12px;
  padding: 7px 14px;
  background: linear-gradient(135deg, var(--color-gold), var(--color-gold-light));
  color: var(--color-g-800);
  font-weight: 600;
  border-radius: 999px;
  font-size: 13px;
  text-decoration: none;
  transition: all 0.2s;
  letter-spacing: 0.3px;
  white-space: nowrap;
  border: none;
  cursor: pointer;
}
.tracker-link:hover {
  background: linear-gradient(135deg, var(--color-gold-light), var(--color-gold));
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(198, 147, 10, 0.35);
}
.tracker-link:active {
  transform: translateY(0) scale(0.97);
}

@media (max-width: 900px) {
  .summary-panel {
    position: static;
  }
}
</style>

<script setup lang="ts">
import { useTrackerStore } from '~~/stores/tracker'
import { useCalculatorStore } from '~~/stores/calculator'
import { fmtEGP, fmtPct } from '~/utils/format'

const tracker = useTrackerStore()
const calculator = useCalculatorStore()
const { t, locale } = useI18n()
</script>

<template>
  <div class="summary-cards">
    <!-- Zakat Due (gold accent) -->
    <div class="sum-card sum-card-gold">
      <div class="sum-label">{{ t('tracker.due') }}</div>
      <div class="sum-value">{{ fmtEGP(calculator.zakatDue, locale) }}</div>
      <div class="sum-sub">{{ t('tracker.fromCalc') }}</div>
    </div>

    <!-- Paid So Far (green accent) -->
    <div class="sum-card sum-card-green">
      <div class="sum-label">{{ t('tracker.paid') }}</div>
      <div class="sum-value">{{ fmtEGP(tracker.totalPaid, locale) }}</div>
      <div class="progress-wrap">
        <div class="progress-bg">
          <div
            class="progress-fill"
            :style="{ width: tracker.progress + '%' }"
          />
        </div>
      </div>
      <div class="sum-sub">{{ fmtPct(tracker.progress, locale) }}</div>
    </div>

    <!-- Remaining (red accent) -->
    <div class="sum-card sum-card-red">
      <div class="sum-label">{{ t('tracker.remaining') }}</div>
      <div class="sum-value">{{ fmtEGP(tracker.remaining, locale) }}</div>
      <div class="sum-sub">{{ t('tracker.balance') }}</div>
    </div>
  </div>
</template>

<style scoped>
.summary-cards {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 16px;
  margin-bottom: 24px;
}
@media (max-width: 640px) {
  .summary-cards {
    grid-template-columns: 1fr;
  }
}
@media (min-width: 641px) and (max-width: 900px) {
  .summary-cards {
    grid-template-columns: 1fr 1fr;
  }
}

.sum-card {
  background: white;
  border: 1px solid var(--color-parchment-100);
  border-radius: var(--radius-md);
  padding: 20px 22px;
  box-shadow: var(--shadow-sm);
  position: relative;
  overflow: hidden;
  transition: transform 0.2s, box-shadow 0.2s;
}
.sum-card:hover {
  transform: translateY(-3px);
  box-shadow: var(--shadow-gold-lg);
}

/* Left accent stripe */
.sum-card::before {
  content: '';
  position: absolute;
  inset-inline-start: 0;
  top: 0;
  bottom: 0;
  width: 3px;
}
.sum-card-gold::before {
  background: var(--color-gold);
}
.sum-card-green::before {
  background: var(--color-g-500);
}
.sum-card-red::before {
  background: var(--color-red-soft);
}

.sum-label {
  font-size: 12px;
  text-transform: uppercase;
  letter-spacing: 1.5px;
  color: var(--color-parchment-400);
  margin-bottom: 8px;
}

.sum-value {
  font-family: var(--font-en);
  font-size: clamp(18px, 3vw, 26px);
  font-weight: 700;
  line-height: 1.1;
}
.sum-card-gold .sum-value {
  color: #9a7a2a;
}
.sum-card-green .sum-value {
  color: var(--color-g-600);
}
.sum-card-red .sum-value {
  color: var(--color-red);
}

.sum-sub {
  font-size: 12px;
  color: var(--color-parchment-400);
  margin-top: 6px;
}

/* Progress bar */
.progress-wrap {
  margin-top: 10px;
}
.progress-bg {
  height: 4px;
  background: var(--color-parchment-100);
  border-radius: 4px;
  overflow: hidden;
}
.progress-fill {
  height: 100%;
  border-radius: 4px;
  background: linear-gradient(90deg, var(--color-g-500), var(--color-gold));
  transition: width 0.6s cubic-bezier(0.4, 0, 0.2, 1);
  position: relative;
}
.progress-fill::after {
  content: '';
  position: absolute;
  inset: 0;
  background: linear-gradient(
    90deg,
    transparent,
    rgba(255, 255, 255, 0.4),
    transparent
  );
  animation: shimmer 2s infinite;
}

@keyframes shimmer {
  0% {
    transform: translateX(-100%);
  }
  100% {
    transform: translateX(200%);
  }
}

@media (prefers-color-scheme: dark) {
  .sum-card {
    background: var(--color-parchment-50);
  }
  .sum-card-gold .sum-value {
    color: var(--color-gold);
  }
}
</style>

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
    <!-- Zakat Due -->
    <UCard class="sum-card sum-card-gold">
      <div class="sum-label">{{ t('tracker.due') }}</div>
      <div class="sum-value text-(--color-gold-600)">{{ fmtEGP(calculator.zakatDue, locale) }}</div>
      <div class="sum-sub">{{ t('tracker.fromCalc') }}</div>
    </UCard>

    <!-- Paid So Far -->
    <UCard class="sum-card sum-card-green">
      <div class="sum-label">{{ t('tracker.paid') }}</div>
      <div class="sum-value text-(--color-green-600)">{{ fmtEGP(tracker.totalPaid, locale) }}</div>
      <div class="progress-wrap">
        <div class="progress-bg">
          <div class="progress-fill" :style="{ width: tracker.progress + '%' }" />
        </div>
      </div>
      <div class="sum-sub">{{ fmtPct(tracker.progress, locale) }}</div>
    </UCard>

    <!-- Remaining -->
    <UCard class="sum-card sum-card-red">
      <div class="sum-label">{{ t('tracker.remaining') }}</div>
      <div class="sum-value text-(--color-red)">{{ fmtEGP(tracker.remaining, locale) }}</div>
      <div class="sum-sub">{{ t('tracker.balance') }}</div>
    </UCard>
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
  .summary-cards { grid-template-columns: 1fr; }
}
@media (min-width: 641px) and (max-width: 900px) {
  .summary-cards { grid-template-columns: 1fr 1fr; }
}

.sum-card {
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
.sum-card-gold::before { background: var(--color-gold-500); }
.sum-card-green::before { background: var(--color-green-500); }
.sum-card-red::before { background: var(--color-red); }

.sum-label {
  font-size: var(--text-xs);
  text-transform: uppercase;
  letter-spacing: var(--tracking-widest);
  color: var(--color-stone-400);
  margin-bottom: 8px;
}

.sum-value {
  font-family: var(--font-en-serif);
  font-size: var(--text-2xl);
  font-weight: var(--weight-bold);
  line-height: var(--leading-tight);
}

.sum-sub {
  font-size: var(--text-xs);
  color: var(--color-stone-400);
  margin-top: 6px;
}

/* Progress bar */
.progress-wrap { margin-top: 10px; }
.progress-bg {
  height: 4px;
  background: var(--color-stone-200);
  border-radius: 4px;
  overflow: hidden;
}
.progress-fill {
  height: 100%;
  border-radius: 4px;
  background: linear-gradient(90deg, var(--color-green-500), var(--color-gold-500));
  transition: width 0.6s cubic-bezier(0.4, 0, 0.2, 1);
  position: relative;
}
.progress-fill::after {
  content: '';
  position: absolute;
  inset: 0;
  background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.4), transparent);
  animation: shimmer 2s infinite;
}

@keyframes shimmer {
  0% { transform: translateX(-100%); }
  100% { transform: translateX(200%); }
}
</style>

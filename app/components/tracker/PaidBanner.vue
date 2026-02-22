<script setup lang="ts">
import { useTrackerStore } from '~~/stores/tracker'
import { useCalculatorStore } from '~~/stores/calculator'

const tracker = useTrackerStore()
const calculator = useCalculatorStore()
const { t } = useI18n()
</script>

<template>
  <!-- Fully paid banner -->
  <div
    v-if="tracker.isComplete"
    class="paid-banner paid-banner-success"
    role="status"
  >
    <Icon name="lucide:party-popper" size="20" /> {{ t('tracker.complete') }} &mdash; {{ t('tracker.barakAllah') }}
  </div>

  <!-- No zakat due banner -->
  <div
    v-else-if="!calculator.nisabMet"
    class="paid-banner paid-banner-muted"
    role="status"
  >
    <Icon name="lucide:info" size="20" /> {{ t('tracker.noZakat') }}
  </div>
</template>

<style scoped>
.paid-banner {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 12px;
  padding: 16px 24px;
  border-radius: var(--radius-md);
  margin-bottom: 20px;
  font-weight: var(--weight-semi);
  font-size: var(--text-md);
  text-align: center;
  animation: fadeUp 0.4s cubic-bezier(0.16, 1, 0.3, 1);
}

.paid-banner-success {
  background: linear-gradient(135deg, var(--color-g-100), var(--color-gold-muted));
  border: 1px solid var(--color-g-200);
  color: var(--color-g-700);
  box-shadow: var(--shadow-gold);
}

.paid-banner-muted {
  background: var(--color-parchment-100);
  border: 1px solid var(--color-parchment-200);
  color: var(--color-parchment-600);
}

@keyframes fadeUp {
  from {
    opacity: 0;
    transform: translateY(16px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>

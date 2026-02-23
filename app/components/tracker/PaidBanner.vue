<script setup lang="ts">
import { useTrackerStore } from '~~/stores/tracker'
import { useCalculatorStore } from '~~/stores/calculator'

const tracker = useTrackerStore()
const calculator = useCalculatorStore()
const { t } = useI18n()
</script>

<template>
  <!-- Fully paid banner -->
  <UAlert
    v-if="tracker.isComplete"
    :title="`${t('tracker.complete')} — ${t('tracker.barakAllah')}`"
    color="success"
    icon="i-lucide-party-popper"
    variant="subtle"
    class="mb-5"
  />

  <!-- No zakat due banner -->
  <UAlert
    v-else-if="!calculator.nisabMet"
    :title="t('tracker.noZakat')"
    color="neutral"
    icon="i-lucide-info"
    variant="subtle"
    class="mb-5"
  />
</template>

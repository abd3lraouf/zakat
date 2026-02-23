<script setup lang="ts">
import { useCalculatorStore } from '~~/stores/calculator'
import { ASSET_DEFS_GOLD, ASSET_DEFS_OTHER } from '~/utils/constants'

const store = useCalculatorStore()
const { t, locale } = useI18n()

const breadcrumbs = computed(() => [
  { label: t('nav.home'), to: '/', icon: 'i-lucide-home' },
  { label: t('nav.calculator') },
])

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
    <UBreadcrumb :items="breadcrumbs" class="page-breadcrumb" />

    <div class="section-header">
      <h2 class="section-title">{{ t('calc.title') }}</h2>
      <p class="section-sub">{{ t('calc.subtitle') }}</p>
    </div>

    <div class="calc-layout">
      <!-- Left column: inputs -->
      <div class="calc-inputs">
        <CalculatorPriceInputs />

        <UCard class="mb-6">
          <template #header>
            <div class="flex items-center justify-between gap-3">
              <h3 class="text-(--text-md) font-semibold text-(--color-stone-800) dark:text-(--color-stone-100)">{{ t('calc.assetsTitle') }}</h3>
              <UButton variant="outline" size="xs" @click="addCustomAsset">
                + {{ t('calc.addAsset') }}
              </UButton>
            </div>
          </template>

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
        </UCard>

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

.page-breadcrumb {
  margin-bottom: 16px;
}

.section-header {
  margin-bottom: 28px;
}

.section-title {
  font-size: var(--text-xl);
  color: var(--color-green-800);
  margin-bottom: 6px;
  font-family: var(--font-en-serif);
}
.dark .section-title {
  color: var(--color-green-300);
}
[dir="rtl"] .section-title {
  font-family: var(--font-ar-serif);
}
.section-title::after {
  content: '\25C6';
  font-size: 8px;
  color: var(--color-gold-500);
  margin-inline-start: 10px;
  vertical-align: middle;
}

.section-sub {
  font-size: var(--text-sm);
  color: var(--color-stone-400);
  letter-spacing: var(--tracking-wide);
}

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

.mb-6 {
  margin-bottom: 24px;
}
</style>

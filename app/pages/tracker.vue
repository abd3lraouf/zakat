<script setup lang="ts">
const { t, locale } = useI18n()

const breadcrumbs = computed(() => [
  { label: t('nav.home'), to: '/', icon: 'i-lucide-home' },
  { label: t('nav.tracker') },
])

useSeoMeta({
  title: () => t('seo.tracker.title'),
  description: () => t('seo.tracker.description'),
  ogTitle: () => t('seo.tracker.title'),
  ogDescription: () => t('seo.tracker.description'),
  ogType: 'website',
  ogLocale: () => locale.value === 'ar' ? 'ar_SA' : 'en_US',
})
</script>

<template>
  <div class="view-content">
    <UBreadcrumb :items="breadcrumbs" class="page-breadcrumb" />

    <div class="section-header">
      <h2 class="section-title">{{ t('tracker.title') }}</h2>
      <p class="section-sub">{{ t('tracker.subtitle') }}</p>
    </div>

    <TrackerPaidBanner />
    <TrackerSummary />
    <TrackerPaymentTable />
  </div>
</template>

<style scoped>
.view-content {
  min-height: calc(100vh - var(--spacing-navbar-h));
  padding: 32px 20px 64px;
  max-width: 1100px;
  margin: 0 auto;
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
</style>

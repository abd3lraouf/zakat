<script setup lang="ts">
const { t } = useI18n()

useSeoMeta({
  title: () => t('seo.tracker.title'),
  description: () => t('seo.tracker.description'),
  ogTitle: () => t('seo.tracker.title'),
  ogDescription: () => t('seo.tracker.description'),
})
</script>

<template>
  <div class="view-content">
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
</style>

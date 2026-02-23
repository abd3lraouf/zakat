<script setup lang="ts">
const { t, locale } = useI18n()

const breadcrumbs = computed(() => [
  { label: t('nav.home'), to: '/', icon: 'i-lucide-home' },
  { label: t('nav.settings') },
])

useSeoMeta({
  title: () => t('seo.profile.title'),
  description: () => t('seo.profile.description'),
  ogTitle: () => t('seo.profile.title'),
  ogDescription: () => t('seo.profile.description'),
  ogType: 'website',
  ogLocale: () => locale.value === 'ar' ? 'ar_SA' : 'en_US',
})
</script>

<template>
  <div class="view-content profile-view">
    <UBreadcrumb :items="breadcrumbs" class="page-breadcrumb" />

    <div class="section-header">
      <h2 class="section-title">{{ t('profile.title') }}</h2>
      <p class="section-sub">{{ t('profile.subtitle') }}</p>
    </div>

    <div class="ornament-divider" aria-hidden="true">&#9830;</div>

    <div class="profile-cards">
      <div
        v-motion
        :initial="{ opacity: 0, y: 20 }"
        :visible-once="{ opacity: 1, y: 0, transition: { duration: 400, ease: 'easeOut' } }"
      >
        <ProfileAppSettings />
      </div>
      <div
        v-motion
        :initial="{ opacity: 0, y: 20 }"
        :visible-once="{ opacity: 1, y: 0, transition: { duration: 400, ease: 'easeOut', delay: 80 } }"
      >
        <ProfileAccountCard />
      </div>
      <div
        v-motion
        :initial="{ opacity: 0, y: 20 }"
        :visible-once="{ opacity: 1, y: 0, transition: { duration: 400, ease: 'easeOut', delay: 160 } }"
      >
        <ProfileSyncCard />
      </div>
      <div
        v-motion
        :initial="{ opacity: 0, y: 20 }"
        :visible-once="{ opacity: 1, y: 0, transition: { duration: 400, ease: 'easeOut', delay: 240 } }"
      >
        <ProfileDataManagement />
      </div>
      <div
        v-motion
        :initial="{ opacity: 0, y: 20 }"
        :visible-once="{ opacity: 1, y: 0, transition: { duration: 400, ease: 'easeOut', delay: 320 } }"
      >
        <ProfileAboutCard />
      </div>
    </div>
  </div>
</template>

<style scoped>
.view-content {
  min-height: calc(100vh - var(--spacing-navbar-h));
  padding: 32px 20px 64px;
  max-width: 1100px;
  margin: 0 auto;
}

.profile-view {
  max-width: 600px;
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

.ornament-divider {
  display: flex;
  align-items: center;
  gap: 16px;
  color: var(--color-gold-500);
  font-size: 8px;
  margin: 24px 0;
}
.ornament-divider::before,
.ornament-divider::after {
  content: '';
  flex: 1;
  height: 1px;
  background: linear-gradient(90deg, transparent, var(--color-stone-300), transparent);
}
.dark .ornament-divider::before,
.dark .ornament-divider::after {
  background: linear-gradient(90deg, transparent, var(--color-stone-700), transparent);
}

.profile-cards {
  display: flex;
  flex-direction: column;
  gap: 16px;
}
</style>

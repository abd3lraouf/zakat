<script setup lang="ts">
const { t, locale } = useI18n()

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
    <div class="section-header">
      <h2 class="section-title">{{ t('profile.title') }}</h2>
      <p class="section-sub">{{ t('profile.subtitle') }}</p>
    </div>

    <div class="ornament-divider" aria-hidden="true">&#9830;</div>

    <div class="profile-cards">
      <div class="card-animate" style="--i: 0">
        <ProfileAppSettings />
      </div>
      <div class="card-animate" style="--i: 1">
        <ProfileAccountCard />
      </div>
      <div class="card-animate" style="--i: 2">
        <ProfileSyncCard />
      </div>
      <div class="card-animate" style="--i: 3">
        <ProfileDataManagement />
      </div>
      <div class="card-animate" style="--i: 4">
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
  animation: viewIn 0.3s cubic-bezier(0.16, 1, 0.3, 1) both;
}

.profile-view {
  max-width: 600px;
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

.card-animate {
  animation: cardSlideUp 0.4s calc(var(--i) * 0.08s) var(--ease-out) both;
}

@keyframes cardSlideUp {
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
}
</style>

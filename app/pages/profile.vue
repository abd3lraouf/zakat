<script setup lang="ts">
const { t } = useI18n()
</script>

<template>
  <div class="view-content profile-view">
    <div class="section-header">
      <h2 class="section-title">{{ t('profile.title') }}</h2>
      <p class="section-sub">{{ t('profile.subtitle') }}</p>
    </div>

    <div class="ornament-divider" aria-hidden="true">&#9830;</div>

    <ProfileAccountCard />
    <ProfileSyncCard />
    <ProfileDataManagement />
    <ProfileAboutCard />
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

.profile-view {
  max-width: 600px;
}

.section-header {
  margin-bottom: 28px;
}

.section-title {
  font-size: clamp(22px, 4vw, 30px);
  color: var(--color-g-800);
  margin-bottom: 6px;
  font-family: var(--font-en);
}
[dir="rtl"] .section-title {
  font-family: var(--font-ar);
}
.section-title::after {
  content: '\25C6';
  font-size: 8px;
  color: var(--color-gold);
  margin-inline-start: 10px;
  vertical-align: middle;
}

.section-sub {
  font-size: 13px;
  color: var(--color-parchment-400);
  letter-spacing: 0.3px;
}

/* Ornamental divider */
.ornament-divider {
  display: flex;
  align-items: center;
  gap: 16px;
  color: var(--color-gold);
  font-size: 8px;
  margin: 24px 0;
}
.ornament-divider::before,
.ornament-divider::after {
  content: '';
  flex: 1;
  height: 1px;
  background: linear-gradient(90deg, transparent, var(--color-parchment-200), transparent);
}
</style>

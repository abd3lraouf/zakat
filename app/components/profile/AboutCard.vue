<script setup lang="ts">
const { t } = useI18n()
</script>

<template>
  <div class="profile-card">
    <div class="profile-card-header">
      {{ t('profile.about') }}
    </div>

    <div class="profile-about-body">
      <div class="profile-about-row">
        <span>{{ t('profile.version') }}</span>
        <span class="profile-about-value">1.0</span>
      </div>
      <div class="profile-about-row">
        <span>{{ t('profile.source') }}</span>
        <a
          href="https://github.com/abd3lraouf/zakat"
          target="_blank"
          rel="noopener noreferrer"
        >
          github.com/abd3lraouf/zakat
        </a>
      </div>
    </div>
  </div>
</template>

<style scoped>
.profile-card {
  background: white;
  border-radius: 12px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.06), 0 4px 12px rgba(0, 0, 0, 0.04);
  border: 1px solid var(--color-parchment-100);
  overflow: hidden;
  margin-bottom: 16px;
  transition: box-shadow 0.3s, transform 0.3s;
}
.profile-card:hover {
  box-shadow: 0 0 0 1px rgba(184, 148, 63, 0.08), 0 4px 16px rgba(184, 148, 63, 0.06);
  transform: translateY(-1px);
}

.profile-card-header {
  padding: 16px 24px;
  background: var(--color-parchment-50);
  border-bottom: 1px solid var(--color-parchment-100);
  font-size: 13px;
  font-weight: 600;
  color: var(--color-parchment-600);
  text-transform: uppercase;
  letter-spacing: 1px;
  position: relative;
}
.profile-card-header::before {
  content: '';
  position: absolute;
  inset-inline-start: 0;
  top: 8px;
  bottom: 8px;
  width: 3px;
  background: linear-gradient(180deg, var(--color-gold), var(--color-g-500));
  border-radius: 0 2px 2px 0;
}
[dir="rtl"] .profile-card-header::before {
  border-radius: 2px 0 0 2px;
}

/* About body */
.profile-about-body {
  padding: 4px 24px;
}

.profile-about-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px 0;
  border-bottom: 1px solid var(--color-parchment-100);
  font-size: 13px;
  color: var(--color-parchment-600);
}
.profile-about-row:last-child {
  border-bottom: none;
}

.profile-about-row > span:first-child {
  color: var(--color-parchment-500);
  font-weight: 500;
}

.profile-about-value {
  font-family: var(--font-mono);
  font-weight: 600;
  color: var(--color-parchment-800);
}

.profile-about-row a {
  font-weight: 600;
  color: var(--color-g-600);
  text-decoration: none;
  font-family: var(--font-mono);
}
.profile-about-row a:hover {
  color: var(--color-g-500);
  text-decoration: underline;
}
</style>

<script setup lang="ts">
import { useAuthStore } from '../../stores/auth'

const { t } = useI18n()
const auth = useAuthStore()

const features = [
  { emoji: '\u{1F9EE}', key: 'feat.calc' },
  { emoji: '\u{1F4CB}', key: 'feat.track' },
  { emoji: '\u2601', key: 'feat.sync' },
  { emoji: '\u{1F310}', key: 'feat.bilingual' },
  { emoji: '\u{1F512}', key: 'feat.private' },
]

function handleGoogleSignIn() {
  // TODO: Wire up Google Sign-In composable
  console.log('Google Sign-In clicked — not yet implemented')
}
</script>

<template>
  <div class="landing-view">
    <!-- Ornamental Arabic text -->
    <div class="landing-ornament">{{ '\u0628\u0650\u0633\u0652\u0645\u0650 \u0627\u0644\u0644\u0651\u064E\u0647\u0650 \u0627\u0644\u0631\u0651\u064E\u062D\u0652\u0645\u064E\u0646\u0650 \u0627\u0644\u0631\u0651\u064E\u062D\u0650\u064A\u0645\u0650' }}</div>

    <!-- Title -->
    <h1 class="landing-title">
      <span>{{ t('landing.title1') }}</span><br />
      <span>{{ t('landing.title2') }}</span>
    </h1>

    <!-- Subtitle -->
    <p class="landing-subtitle">{{ t('landing.subtitle') }}</p>

    <!-- Feature chips -->
    <div class="landing-features">
      <div v-for="feat in features" :key="feat.key" class="feat-chip">
        <span>{{ feat.emoji }}</span>
        <span>{{ t(feat.key) }}</span>
      </div>
    </div>

    <!-- Guest CTA (not authenticated) -->
    <div v-if="!auth.isAuthenticated" class="landing-cta">
      <button class="btn-google" @click="handleGoogleSignIn">
        <!-- Google SVG icon -->
        <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
          <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
          <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
          <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
          <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
        </svg>
        {{ t('nav.signin') }}
      </button>
      <button class="skip-link" @click="navigateTo('/calculator')">
        {{ t('landing.skip') }}
      </button>
    </div>

    <!-- User CTA (authenticated) -->
    <div v-else class="landing-cta">
      <div class="landing-welcome">
        <span>{{ t('landing.welcomeBack') }} {{ auth.user?.name }}</span>
      </div>
      <div class="landing-nav-btns">
        <button class="btn-google" @click="navigateTo('/calculator')">
          {{ t('nav.calculator') }}
        </button>
        <button class="skip-link" @click="navigateTo('/tracker')">
          {{ t('nav.tracker') }}
        </button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.landing-view {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  min-height: calc(100vh - var(--spacing-navbar-h));
  padding: 40px 20px;
}

.landing-ornament {
  font-family: var(--font-ar);
  font-size: 26px;
  color: var(--color-gold);
  letter-spacing: 8px;
  margin-bottom: 20px;
  opacity: 0.9;
  animation: fadeUp 0.6s 0.1s cubic-bezier(0.16, 1, 0.3, 1) both;
  position: relative;
  padding: 0 36px;
  text-shadow: 0 0 30px rgba(184, 148, 63, 0.25);
}
.landing-ornament::before {
  content: '\276E';
  position: absolute;
  inset-inline-start: 0;
  top: -4px;
  font-size: 20px;
  opacity: 0.5;
}
.landing-ornament::after {
  content: '\276F';
  position: absolute;
  inset-inline-end: 0;
  bottom: -4px;
  font-size: 20px;
  opacity: 0.5;
}

.landing-title {
  font-family: var(--font-en);
  font-size: clamp(36px, 6vw, 64px);
  color: var(--color-g-800);
  font-weight: 700;
  line-height: 1.1;
  margin-bottom: 12px;
  animation: fadeUp 0.6s 0.2s cubic-bezier(0.16, 1, 0.3, 1) both;
}
[dir="rtl"] .landing-title {
  font-family: var(--font-ar);
}
.landing-title span {
  color: var(--color-g-600);
}
.landing-title span:last-child {
  color: var(--color-g-800);
}

.landing-subtitle {
  font-size: 16px;
  color: var(--color-parchment-600);
  max-width: 480px;
  line-height: 1.6;
  margin-bottom: 40px;
  animation: fadeUp 0.6s 0.3s cubic-bezier(0.16, 1, 0.3, 1) both;
}

.landing-features {
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
  justify-content: center;
  margin-bottom: 48px;
}

.feat-chip {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 8px 14px;
  background: white;
  border: 1px solid var(--color-parchment-100);
  border-radius: 999px;
  font-size: 13px;
  color: var(--color-parchment-600);
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.04);
  transition: transform 0.25s cubic-bezier(0.16, 1, 0.3, 1), border-color 0.25s,
    box-shadow 0.25s;
  animation: fadeUp 0.5s cubic-bezier(0.16, 1, 0.3, 1) both;
}
.feat-chip:nth-child(1) {
  animation-delay: 0.35s;
}
.feat-chip:nth-child(2) {
  animation-delay: 0.42s;
}
.feat-chip:nth-child(3) {
  animation-delay: 0.49s;
}
.feat-chip:nth-child(4) {
  animation-delay: 0.56s;
}
.feat-chip:nth-child(5) {
  animation-delay: 0.63s;
}
.feat-chip:hover {
  transform: translateY(-2px);
  border-color: rgba(184, 148, 63, 0.3);
  box-shadow: 0 0 0 1px rgba(184, 148, 63, 0.08), 0 4px 16px rgba(184, 148, 63, 0.06);
}

.landing-cta {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
  animation: fadeUp 0.6s 0.5s cubic-bezier(0.16, 1, 0.3, 1) both;
}

.btn-google {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 13px 24px;
  background: white;
  border: 1px solid var(--color-parchment-200);
  border-radius: 12px;
  font-size: 15px;
  font-weight: 600;
  color: var(--color-parchment-800);
  cursor: pointer;
  transition: all 0.2s;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.06), 0 4px 12px rgba(0, 0, 0, 0.04);
  font-family: inherit;
}
.btn-google:hover {
  border-color: var(--color-gold-muted);
  box-shadow: 0 0 0 1px rgba(184, 148, 63, 0.12), 0 8px 32px rgba(184, 148, 63, 0.1);
  transform: translateY(-2px);
}
.btn-google svg {
  width: 20px;
  height: 20px;
  flex-shrink: 0;
}

.skip-link {
  font-size: 14px;
  color: var(--color-parchment-600);
  cursor: pointer;
  background: none;
  border: 1.5px solid var(--color-parchment-200);
  border-radius: 8px;
  padding: 12px 24px;
  font-family: inherit;
  text-decoration: none;
  transition: all 0.25s cubic-bezier(0.16, 1, 0.3, 1);
}
.skip-link:hover {
  color: var(--color-g-600);
  border-color: var(--color-g-400);
  background: var(--color-g-50);
}

.landing-welcome {
  display: flex;
  align-items: center;
  gap: 14px;
  margin-bottom: 20px;
}

.landing-nav-btns {
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
  justify-content: center;
}
</style>

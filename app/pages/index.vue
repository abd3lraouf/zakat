<script setup lang="ts">
import { useAuthStore } from '../../stores/auth'
import { useGoogleAuth } from '~/composables/useGoogleAuth'

const { t, locale } = useI18n()
const auth = useAuthStore()
const { signIn } = useGoogleAuth()

useSeoMeta({
  title: () => t('seo.home.title'),
  description: () => t('seo.home.description'),
  ogTitle: () => t('seo.home.title'),
  ogDescription: () => t('seo.home.description'),
  ogType: 'website',
  ogLocale: () => locale.value === 'ar' ? 'ar_SA' : 'en_US',
  ogLocaleAlternate: () => locale.value === 'ar' ? ['en_US'] : ['ar_SA'],
})
</script>

<template>
  <div class="landing-view">
    <div class="landing-content">
      <!-- 1. Bismillah -->
      <div class="landing-bismillah" aria-label="Bismillah">
        {{ t('landing.bismillah') }}
      </div>
      <div class="landing-separator" aria-hidden="true"></div>

      <!-- 2. Quranic Verse -->
      <blockquote class="landing-verse">
        <p class="verse-arabic">{{ t('landing.verseLine1') }}</p>
        <p class="verse-arabic verse-arabic-2">{{ t('landing.verseLine2') }}</p>
        <p v-if="t('landing.verseTranslation')" class="verse-translation">{{ t('landing.verseTranslation') }}</p>
        <cite class="verse-ref">— {{ t('landing.verseRef') }}</cite>
      </blockquote>

      <!-- 3. Message -->
      <p class="landing-message">
        {{ auth.isAuthenticated ? t('landing.messageAuth', { name: auth.user?.name }) : t('landing.message') }}
      </p>

      <!-- 4. Primary CTA -->
      <div class="landing-cta">
        <button class="btn-cta" @click="navigateTo('/calculator')">
          {{ auth.isAuthenticated ? t('landing.ctaAuth') : t('landing.cta') }}
        </button>
        <NuxtLink
          v-if="auth.isAuthenticated"
          to="/tracker"
          class="cta-secondary"
        >
          {{ t('landing.trackerHint') }}
        </NuxtLink>
      </div>

      <!-- 5. Sign-in section (guests only) -->
      <div v-if="!auth.isAuthenticated" class="landing-signin" aria-label="Sign in">
        <!-- Divider with hint text -->
        <div class="signin-divider">
          <span>{{ t('landing.syncHint') }}</span>
        </div>
        <!-- Google Sign-In button -->
        <button class="btn-google" @click="signIn">
          <svg class="google-icon" viewBox="0 0 48 48" aria-hidden="true">
            <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"/>
            <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"/>
            <path fill="#FBBC05" d="M10.53 28.59a14.5 14.5 0 0 1 0-9.18l-7.98-6.19a24.01 24.01 0 0 0 0 21.56l7.98-6.19z"/>
            <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"/>
          </svg>
          {{ t('landing.signInBtn') }}
        </button>
        <p class="signin-benefit">{{ t('landing.signInBenefit') }}</p>
      </div>

      <!-- 6. Ornamental close -->
      <div class="ornament-divider" aria-hidden="true">&#9830;</div>
    </div>
  </div>
</template>

<style scoped>
.landing-view {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: calc(100dvh - var(--spacing-navbar-h));
  padding: 40px 20px 100px;
}

.landing-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  max-width: 480px;
  width: 100%;
}

/* 1. Bismillah */
.landing-bismillah {
  font-family: var(--font-ar-serif);
  font-size: var(--text-2xl);
  color: var(--color-gold);
  letter-spacing: var(--tracking-widest);
  opacity: 0.9;
  text-shadow: 0 0 30px rgba(198, 147, 10, 0.25);
  animation: fadeUp 0.6s 0.1s var(--ease-out) both;
}

.landing-separator {
  width: 60px;
  height: 1px;
  background: linear-gradient(90deg, transparent, var(--color-gold), transparent);
  margin: 16px 0 28px;
  opacity: 0.6;
  animation: fadeIn 0.6s 0.2s var(--ease-out) both;
}

/* 2. Quranic Verse */
.landing-verse {
  margin: 0 0 28px;
  animation: fadeUp 0.6s 0.3s var(--ease-out) both;
}

.verse-arabic {
  font-family: var(--font-ar-serif);
  font-size: var(--text-xl);
  color: var(--color-g-800);
  line-height: var(--leading-relaxed);
  margin-bottom: 12px;
}

.verse-arabic-2 {
  font-size: var(--text-lg);
  color: var(--color-g-700);
}

.verse-translation {
  font-family: var(--font-en);
  font-size: var(--text-base);
  color: var(--color-parchment-500);
  line-height: var(--leading-normal);
  font-style: italic;
  margin-bottom: 8px;
}
[dir="rtl"] .verse-translation {
  font-family: var(--font-ar);
  font-style: normal;
}

.verse-ref {
  font-family: var(--font-en);
  font-size: var(--text-sm);
  color: var(--color-parchment-400);
  font-style: normal;
  letter-spacing: var(--tracking-wider);
}
[dir="rtl"] .verse-ref {
  font-family: var(--font-ar);
}

/* 3. Message */
.landing-message {
  font-size: var(--text-md);
  color: var(--color-parchment-600);
  line-height: var(--leading-normal);
  margin-bottom: 32px;
  animation: fadeUp 0.6s 0.4s var(--ease-out) both;
}
[dir="rtl"] .landing-message {
  font-family: var(--font-ar);
}

/* 4. CTA */
.landing-cta {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 16px;
  animation: fadeUp 0.6s 0.5s var(--ease-out) both;
}

.btn-cta {
  padding: 14px 48px;
  background: var(--color-gold);
  color: white;
  border: none;
  border-radius: var(--radius-md);
  font-size: var(--text-md);
  font-weight: var(--weight-semi);
  font-family: var(--font-en);
  cursor: pointer;
  transition: all 0.25s var(--ease-out);
  box-shadow: var(--shadow-gold);
  letter-spacing: var(--tracking-wider);
}
[dir="rtl"] .btn-cta {
  font-family: var(--font-ar);
}
.btn-cta:hover {
  transform: translateY(-2px);
  box-shadow: var(--shadow-gold-lg);
  background: var(--color-gold-dark);
}

.cta-secondary {
  font-size: var(--text-base);
  color: var(--color-parchment-400);
  text-decoration: none;
  background: none;
  border: none;
  cursor: pointer;
  padding: 0;
  font-family: inherit;
  transition: color 0.2s;
}
.cta-secondary:hover {
  color: var(--color-g-600);
}

/* 5. Sign-in section */
.landing-signin {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 14px;
  width: 100%;
  animation: fadeUp 0.6s 0.6s var(--ease-out) both;
}

.signin-divider {
  display: flex;
  align-items: center;
  gap: 14px;
  width: 100%;
  margin-top: 28px;
  color: var(--color-parchment-400);
  font-size: var(--text-sm);
}
.signin-divider::before,
.signin-divider::after {
  content: '';
  flex: 1;
  height: 1px;
  background: linear-gradient(90deg, transparent, var(--color-parchment-200), transparent);
}
.signin-divider span {
  white-space: nowrap;
}

.btn-google {
  display: inline-flex;
  align-items: center;
  gap: 10px;
  padding: 10px 24px;
  background: #fff;
  color: #3c4043;
  border: 1px solid #dadce0;
  border-radius: 999px;
  font-size: var(--text-base);
  font-weight: var(--weight-semi);
  font-family: var(--font-en);
  cursor: pointer;
  transition: all 0.2s var(--ease-out);
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.08);
}
[dir="rtl"] .btn-google {
  font-family: var(--font-ar);
}
.btn-google:hover {
  background: #f8f9fa;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.12);
}
.dark .btn-google {
  background: rgba(255, 255, 255, 0.08);
  color: rgba(255, 255, 255, 0.9);
  border-color: rgba(255, 255, 255, 0.15);
}
.dark .btn-google:hover {
  background: rgba(255, 255, 255, 0.14);
}

.google-icon {
  width: 18px;
  height: 18px;
  flex-shrink: 0;
}

.signin-benefit {
  font-size: var(--text-sm);
  color: var(--color-parchment-400);
  margin: 0;
}

/* 6. Ornamental close */
.ornament-divider {
  display: flex;
  align-items: center;
  gap: 16px;
  color: var(--color-gold);
  font-size: 8px;
  margin-top: 40px;
  width: 100%;
  animation: fadeIn 0.6s 0.8s var(--ease-out) both;
}
.ornament-divider::before,
.ornament-divider::after {
  content: '';
  flex: 1;
  height: 1px;
  background: linear-gradient(90deg, transparent, var(--color-parchment-200), transparent);
}
</style>

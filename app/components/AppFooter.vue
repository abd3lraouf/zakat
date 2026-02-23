<script setup lang="ts">
const { t } = useI18n()

const navLinks = [
  { to: '/calculator', labelKey: 'nav.calculator', icon: 'i-lucide-calculator' },
  { to: '/tracker', labelKey: 'nav.tracker', icon: 'i-lucide-clipboard-list' },
  { to: '/profile', labelKey: 'nav.settings', icon: 'i-lucide-settings' },
]

const socialLinks = [
  { href: 'https://github.com/abd3lraouf', icon: 'i-lucide-github', labelKey: 'footer.github' },
  { href: 'https://linkedin.com/in/abd3lraouf', icon: 'i-lucide-linkedin', labelKey: 'footer.linkedin' },
]
</script>

<template>
  <footer class="app-footer" role="contentinfo">
    <!-- Top separator — gold gradient -->
    <div class="footer-border" aria-hidden="true" />

    <div class="footer-container">
      <!-- Upper section: 3-column grid -->
      <div class="footer-grid">
        <!-- Col 1: Brand + tagline -->
        <div class="footer-brand-col">
          <NuxtLink to="/" class="footer-logo">
            {{ t('app.name') }}
          </NuxtLink>
          <p class="footer-tagline">{{ t('footer.tagline') }}</p>
        </div>

        <!-- Col 2: Navigation -->
        <div class="footer-nav-col">
          <h3 class="footer-heading">{{ t('footer.navigate') }}</h3>
          <nav :aria-label="t('footer.navigate')">
            <ul class="footer-link-list">
              <li v-for="link in navLinks" :key="link.to">
                <NuxtLink :to="link.to" class="footer-link">
                  <UIcon :name="link.icon" class="size-3.5 opacity-50" />
                  {{ t(link.labelKey) }}
                </NuxtLink>
              </li>
            </ul>
          </nav>
        </div>

        <!-- Col 3: Connect + Theme -->
        <div class="footer-connect-col">
          <h3 class="footer-heading">{{ t('footer.connect') }}</h3>
          <div class="footer-socials">
            <UButton
              v-for="social in socialLinks"
              :key="social.href"
              :to="social.href"
              target="_blank"
              rel="noopener noreferrer"
              variant="ghost"
              color="neutral"
              size="xs"
              :aria-label="t(social.labelKey)"
              class="social-btn"
            >
              <UIcon :name="social.icon" class="size-4" />
              <span class="social-label">{{ t(social.labelKey) }}</span>
            </UButton>
          </div>

          <!-- Theme toggle -->
          <div class="theme-section">
            <UColorModeSwitch size="sm" color="primary" />
          </div>
        </div>
      </div>

      <!-- Bottom bar -->
      <div class="footer-bottom">
        <div class="footer-bottom-separator" aria-hidden="true" />
        <div class="footer-bottom-row">
          <UButton
            to="https://github.com/abd3lraouf/zakat"
            target="_blank"
            rel="noopener noreferrer"
            variant="link"
            color="neutral"
            size="xs"
            class="source-link"
          >
            <UIcon name="i-lucide-heart" class="size-3" />
            {{ t('footer.openSource') }}
          </UButton>
          <span class="footer-dot" aria-hidden="true">&middot;</span>
          <span class="footer-made">{{ t('footer.madeFor') }}</span>
        </div>
      </div>
    </div>
  </footer>
</template>

<style scoped>
.app-footer {
  position: relative;
  z-index: 1;
  margin-top: 40px;
}

.footer-border {
  height: 1px;
  background: linear-gradient(
    90deg,
    transparent 0%,
    var(--color-gold-400) 30%,
    var(--color-gold-300) 50%,
    var(--color-gold-400) 70%,
    transparent 100%
  );
  opacity: 0.3;
}

.footer-container {
  max-width: 960px;
  margin: 0 auto;
  padding: 40px 24px 24px;
}

/* ── Grid layout ── */
.footer-grid {
  display: grid;
  grid-template-columns: 1.2fr 1fr 1fr;
  gap: 40px;
  margin-bottom: 32px;
}

@media (max-width: 640px) {
  .footer-grid {
    grid-template-columns: 1fr;
    gap: 28px;
    text-align: center;
  }

  .app-footer {
    padding-bottom: 80px;
  }
}

/* ── Brand column ── */
.footer-logo {
  font-family: var(--font-en-serif);
  font-size: var(--text-lg);
  font-weight: var(--weight-bold);
  color: var(--color-gold-500);
  text-decoration: none;
  transition: text-shadow 0.3s var(--ease-out);
  line-height: 1;
}

.footer-logo:hover {
  text-shadow: 0 0 20px rgba(184, 147, 58, 0.35);
}

.footer-tagline {
  font-size: var(--text-sm);
  color: var(--color-stone-400);
  line-height: var(--leading-normal);
  margin: 10px 0 0;
  max-width: 240px;
}

@media (max-width: 640px) {
  .footer-tagline {
    max-width: none;
  }
}

/* ── Column headings ── */
.footer-heading {
  font-size: var(--text-xs);
  font-weight: var(--weight-semi);
  color: var(--color-stone-400);
  letter-spacing: var(--tracking-widest);
  text-transform: uppercase;
  margin: 0 0 12px;
}

[dir="rtl"] .footer-heading {
  text-transform: none;
  letter-spacing: var(--tracking-wide);
}

/* ── Nav links ── */
.footer-link-list {
  list-style: none;
  margin: 0;
  padding: 0;
  display: flex;
  flex-direction: column;
  gap: 6px;
}

@media (max-width: 640px) {
  .footer-link-list {
    align-items: center;
  }
}

.footer-link {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  font-size: var(--text-sm);
  color: var(--color-stone-500);
  text-decoration: none;
  padding: 4px 0;
  transition: color 0.2s, transform 0.15s var(--ease-out);
}

.footer-link:hover {
  color: var(--color-green-600);
  transform: translateX(3px);
}

[dir="rtl"] .footer-link:hover {
  transform: translateX(-3px);
}

/* ── Socials ── */
.footer-socials {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

@media (max-width: 640px) {
  .footer-socials {
    align-items: center;
  }
}

.social-btn {
  color: var(--color-stone-500) !important;
  justify-content: flex-start !important;
  transition: color 0.2s !important;
}

.social-btn:hover {
  color: var(--color-green-600) !important;
}

.social-label {
  font-size: var(--text-sm);
}

/* ── Theme toggle ── */
.theme-section {
  margin-top: 16px;
}

@media (max-width: 640px) {
  .theme-section {
    display: flex;
    justify-content: center;
  }
}

/* ── Bottom bar ── */
.footer-bottom {
  text-align: center;
}

.footer-bottom-separator {
  height: 1px;
  background: linear-gradient(90deg, transparent, var(--color-stone-200), transparent);
  margin-bottom: 16px;
}

.dark .footer-bottom-separator {
  background: linear-gradient(90deg, transparent, var(--color-stone-800), transparent);
}

.footer-bottom-row {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  flex-wrap: wrap;
}

.source-link {
  color: var(--color-stone-400) !important;
  font-size: var(--text-xs) !important;
  letter-spacing: var(--tracking-wide);
  text-decoration: none !important;
}

.source-link:hover {
  color: var(--color-green-600) !important;
}

.footer-dot {
  color: var(--color-stone-300);
  font-size: var(--text-xs);
}

.footer-made {
  font-size: var(--text-xs);
  color: var(--color-stone-300);
  letter-spacing: var(--tracking-wider);
}
</style>

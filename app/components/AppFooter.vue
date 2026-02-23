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
            <a
              v-for="social in socialLinks"
              :key="social.href"
              :href="social.href"
              target="_blank"
              rel="noopener noreferrer"
              :aria-label="t(social.labelKey)"
              class="social-link"
            >
              <UIcon :name="social.icon" class="size-4" />
              <span class="social-label">{{ t(social.labelKey) }}</span>
            </a>
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
          <a
            href="https://github.com/abd3lraouf/zakat"
            target="_blank"
            rel="noopener noreferrer"
            class="source-link"
          >
            <UIcon name="i-lucide-heart" class="size-3" />
            {{ t('footer.openSource') }}
          </a>
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
  background: rgba(31, 72, 55, 0.92);
  backdrop-filter: blur(16px) saturate(180%);
  -webkit-backdrop-filter: blur(16px) saturate(180%);
}
.dark .app-footer {
  background: rgba(20, 20, 18, 0.92);
}

.footer-border {
  height: 1px;
  background: linear-gradient(
    90deg,
    transparent 0%,
    rgba(184, 147, 58, 0.3) 30%,
    rgba(184, 147, 58, 0.4) 50%,
    rgba(184, 147, 58, 0.3) 70%,
    transparent 100%
  );
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
  color: rgba(255, 255, 255, 0.7);
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
  color: rgba(255, 255, 255, 0.65);
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
  color: rgba(255, 255, 255, 0.75);
  text-decoration: none;
  padding: 4px 0;
  transition: color 0.2s, transform 0.15s var(--ease-out);
}

.footer-link:hover {
  color: rgba(255, 255, 255, 0.95);
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

.social-link {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  color: rgba(255, 255, 255, 0.75);
  text-decoration: none;
  padding: 4px 0;
  transition: color 0.2s;
}

.social-link:hover {
  color: rgba(255, 255, 255, 0.95);
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
  background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.1), transparent);
  margin-bottom: 16px;
}

.footer-bottom-row {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  flex-wrap: wrap;
}

.source-link {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  color: rgba(255, 255, 255, 0.6);
  font-size: var(--text-xs);
  letter-spacing: var(--tracking-wide);
  text-decoration: none;
  transition: color 0.2s;
}

.source-link:hover {
  color: rgba(255, 255, 255, 0.85);
}

.footer-dot {
  color: rgba(255, 255, 255, 0.4);
  font-size: var(--text-xs);
}

.footer-made {
  font-size: var(--text-xs);
  color: var(--color-gold-400);
  letter-spacing: var(--tracking-wider);
  font-weight: var(--weight-medium);
}
</style>

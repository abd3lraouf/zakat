<script setup lang="ts">
import type { SyncStatus } from '~~/shared/types'

const { t, locale, setLocale } = useI18n()
const route = useRoute()
const authStore = useAuthStore()

// TODO: Wire up real sync status from a composable when available
const syncStatus = ref<SyncStatus>('offline')

const userInitials = computed(() => {
  const name = authStore.user?.name
  if (!name) return '?'
  const parts = name.trim().split(/\s+/)
  if (parts.length >= 2) {
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase()
  }
  return name.substring(0, 2).toUpperCase()
})

function isActive(path: string): boolean {
  return route.path === path
}
</script>

<template>
  <nav class="navbar" role="navigation" :aria-label="t('nav.home')">
    <!-- Brand -->
    <NuxtLink to="/" class="nav-brand">
      <div class="nav-logo" aria-hidden="true">&#9770;</div>
      <span class="nav-title">
        <span>{{ t('app.name') }}</span>
      </span>
    </NuxtLink>

    <!-- Desktop nav links -->
    <div class="nav-links">
      <NuxtLink
        to="/calculator"
        class="nav-link"
        :class="{ active: isActive('/calculator') }"
      >
        {{ t('nav.calculator') }}
      </NuxtLink>
      <NuxtLink
        to="/tracker"
        class="nav-link"
        :class="{ active: isActive('/tracker') }"
      >
        {{ t('nav.tracker') }}
      </NuxtLink>
      <NuxtLink
        to="/profile"
        class="nav-link"
        :class="{ active: isActive('/profile') }"
      >
        {{ t('nav.profile') }}
      </NuxtLink>
    </div>

    <!-- Spacer -->
    <div class="nav-spacer" />

    <!-- Actions -->
    <div class="nav-actions">
      <!-- Sync indicator (shown when authenticated) -->
      <SyncIndicator
        v-if="authStore.isAuthenticated"
        :status="syncStatus"
      />

      <!-- Language toggle -->
      <div class="lang-toggle" role="group" :aria-label="t('feat.bilingual')">
        <button
          class="lang-btn lang-btn-en"
          :class="{ active: locale === 'en' }"
          aria-label="English"
          @click="setLocale('en')"
        >
          English
        </button>
        <button
          class="lang-btn lang-btn-ar"
          :class="{ active: locale === 'ar' }"
          aria-label="العربية"
          @click="setLocale('ar')"
        >
          العربية
        </button>
      </div>

      <!-- User avatar (shown when authenticated) -->
      <NuxtLink
        v-if="authStore.isAuthenticated"
        to="/profile"
        class="user-initials"
        :title="t('nav.profile')"
      >
        {{ userInitials }}
      </NuxtLink>
    </div>
  </nav>
</template>

<style scoped>
.navbar {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  height: var(--spacing-navbar-h);
  background: rgba(36, 61, 50, 0.85);
  backdrop-filter: blur(16px) saturate(180%);
  -webkit-backdrop-filter: blur(16px) saturate(180%);
  border-bottom: 1px solid rgba(184, 148, 63, 0.15);
  display: flex;
  align-items: center;
  padding: 0 24px;
  gap: 16px;
  z-index: 100;
  box-shadow: 0 1px 0 rgba(0, 0, 0, 0.05);
}

/* ── Brand ── */
.nav-brand {
  display: flex;
  align-items: center;
  gap: 10px;
  text-decoration: none;
  flex-shrink: 0;
}

.nav-logo {
  width: 36px;
  height: 36px;
  background: var(--color-gold);
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 18px;
  flex-shrink: 0;
  transition: box-shadow 0.3s var(--ease-out);
}

.nav-brand:hover .nav-logo {
  box-shadow: 0 0 20px rgba(184, 148, 63, 0.4);
}

.nav-title {
  font-family: var(--font-en);
  font-size: 20px;
  font-weight: 700;
  color: #fff;
  letter-spacing: -0.3px;
}

[dir="rtl"] .nav-title {
  font-family: var(--font-ar);
  font-size: 22px;
}

.nav-title span {
  color: var(--color-gold);
}

/* ── Desktop links ── */
.nav-links {
  display: flex;
  align-items: center;
  gap: 4px;
  margin-inline-start: 24px;
}

.nav-link {
  padding: 7px 14px;
  border-radius: var(--radius-sm);
  color: rgba(255, 255, 255, 0.85);
  font-size: 13px;
  font-weight: 500;
  cursor: pointer;
  text-decoration: none;
  transition: all 0.2s;
  letter-spacing: 0.3px;
}

.nav-link:hover {
  color: #fff;
  background: rgba(255, 255, 255, 0.08);
}

.nav-link.active {
  color: var(--color-gold);
  background: rgba(184, 148, 63, 0.15);
}

/* ── Spacer ── */
.nav-spacer {
  flex: 1;
}

/* ── Actions ── */
.nav-actions {
  display: flex;
  align-items: center;
  gap: 8px;
}

/* ── Language toggle ── */
.lang-toggle {
  display: flex;
  background: rgba(255, 255, 255, 0.08);
  border-radius: 999px;
  padding: 3px;
  gap: 2px;
}

.lang-btn {
  padding: 8px 14px;
  border-radius: 999px;
  border: none;
  background: transparent;
  color: rgba(255, 255, 255, 0.8);
  font-size: 13px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
  letter-spacing: 0.5px;
}

.lang-btn-en {
  font-family: var(--font-en);
}

.lang-btn-ar {
  font-family: var(--font-ar);
  font-size: 15px;
}

.lang-btn.active {
  background: var(--color-gold);
  color: var(--color-g-800);
  box-shadow: 0 2px 8px rgba(184, 148, 63, 0.3);
}

/* ── User avatar ── */
.user-initials {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background: var(--color-gold);
  color: var(--color-g-800);
  font-size: 13px;
  font-weight: 700;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  font-family: var(--font-en);
  text-decoration: none;
  flex-shrink: 0;
  transition: box-shadow 0.2s;
}

.user-initials:hover {
  box-shadow: 0 0 0 2px rgba(184, 148, 63, 0.4);
}

/* ── Mobile ── */
@media (max-width: 640px) {
  .nav-links {
    display: none;
  }

  .navbar {
    padding: 0 16px;
  }
}
</style>

<script setup lang="ts">
import { useAuthStore } from '~~/stores/auth'
import { useDriveSync } from '~/composables/useDriveSync'
import { useGoogleAuth } from '~/composables/useGoogleAuth'

const { t, locale, setLocale } = useI18n()
const route = useRoute()
const authStore = useAuthStore()
const { syncStatus } = useDriveSync()
const { isConnected } = useGoogleAuth()

const { avatarUrl, showImage, onImgError } = useAvatar(64)

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
      <span class="nav-logo">{{ t('app.name') }}</span>
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
    </div>

    <!-- Spacer -->
    <div class="nav-spacer" />

    <!-- Actions -->
    <div class="nav-actions">
      <!-- Sync indicator (shown when connected to Drive) -->
      <SyncIndicator
        v-if="isConnected"
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
        class="user-avatar"
        :title="t('nav.settings')"
      >
        <img
          v-if="showImage"
          :src="avatarUrl!"
          :alt="authStore.user?.name || ''"
          class="user-avatar-img"
          referrerpolicy="no-referrer"
          @error="onImgError"
        />
        <span v-else class="user-avatar-initials">{{ userInitials }}</span>
      </NuxtLink>

      <!-- Settings (shown when not authenticated) -->
      <NuxtLink
        v-else
        to="/profile"
        class="nav-settings-btn"
        :title="t('nav.settings')"
      >
        <Icon name="lucide:settings" size="18" />
      </NuxtLink>
    </div>
  </nav>
</template>

<style scoped>
.navbar {
  position: fixed;
  top: 0;
  inset-inline: 0;
  height: var(--spacing-navbar-h);
  background: rgba(0, 61, 31, 0.92);
  backdrop-filter: blur(16px) saturate(180%);
  -webkit-backdrop-filter: blur(16px) saturate(180%);
  border-bottom: 1px solid rgba(198, 147, 10, 0.15);
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
  font-family: 'Aref Ruqaa', 'Amiri', serif;
  font-size: var(--text-lg);
  font-weight: var(--weight-bold);
  color: var(--color-gold);
  line-height: var(--leading-tight);
  flex-shrink: 0;
  transition: text-shadow 0.3s var(--ease-out);
}

.nav-brand:hover .nav-logo {
  text-shadow: 0 0 20px rgba(198, 147, 10, 0.4);
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
  font-size: var(--text-sm);
  font-weight: var(--weight-medium);
  cursor: pointer;
  text-decoration: none;
  transition: all 0.2s;
  letter-spacing: var(--tracking-wide);
}

.nav-link:hover {
  color: #fff;
  background: rgba(255, 255, 255, 0.08);
}

.nav-link.active {
  color: var(--color-gold);
  background: rgba(198, 147, 10, 0.15);
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
  font-size: var(--text-sm);
  font-weight: var(--weight-semi);
  cursor: pointer;
  transition: all 0.2s;
  letter-spacing: var(--tracking-wider);
}

.lang-btn-en {
  font-family: var(--font-en);
}

.lang-btn-ar {
  font-family: var(--font-ar);
  font-size: var(--text-md);
}

.lang-btn.active {
  background: var(--color-gold);
  color: var(--color-g-800);
  box-shadow: 0 2px 8px rgba(198, 147, 10, 0.3);
}

/* ── User avatar ── */
.user-avatar {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  flex-shrink: 0;
  text-decoration: none;
  transition: box-shadow 0.2s;
  overflow: hidden;
}

.user-avatar:hover {
  box-shadow: 0 0 0 2px rgba(198, 147, 10, 0.4);
}

.user-avatar-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: 50%;
}

.user-avatar-initials {
  width: 100%;
  height: 100%;
  border-radius: 50%;
  background: var(--color-gold);
  color: var(--color-g-800);
  font-size: var(--text-sm);
  font-weight: var(--weight-bold);
  display: flex;
  align-items: center;
  justify-content: center;
  font-family: var(--font-en);
}

/* ── Nav settings button (guest) ── */
.nav-settings-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  border-radius: 50%;
  color: rgba(255, 255, 255, 0.7);
  font-size: var(--text-md);
  text-decoration: none;
  transition: all 0.2s;
}

.nav-settings-btn:hover {
  color: #fff;
  background: rgba(255, 255, 255, 0.1);
}

/* ── Mobile ── */
@media (max-width: 640px) {
  .nav-links,
  .nav-settings-btn {
    display: none;
  }

  .navbar {
    padding: 0 16px;
  }
}
</style>

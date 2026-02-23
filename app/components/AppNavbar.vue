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

const isArabic = computed({
  get: () => locale.value === 'ar',
  set: (val: boolean) => setLocale(val ? 'ar' : 'en'),
})

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
    <div class="flex-1" />

    <!-- Actions -->
    <div class="flex items-center gap-2">
      <!-- Sync indicator -->
      <SyncIndicator
        v-if="isConnected"
        :status="syncStatus"
      />

      <!-- Language toggle -->
      <div class="lang-toggle" :aria-label="t('feat.bilingual')">
        <span
          class="lang-label"
          :class="{ active: locale === 'en' }"
          @click="setLocale('en')"
        >English</span>
        <USwitch
          v-model="isArabic"
          size="sm"
          :aria-label="t('feat.bilingual')"
          :ui="{
            base: 'bg-white/10 data-[state=checked]:bg-white/10 cursor-pointer',
            thumb: 'bg-(--color-gold-400) shadow-[0_1px_6px_rgba(184,147,58,0.5)]',
          }"
        />
        <span
          class="lang-label lang-label-ar"
          :class="{ active: locale === 'ar' }"
          @click="setLocale('ar')"
        >العربية</span>
      </div>

      <!-- User avatar (authenticated) -->
      <NuxtLink
        v-if="authStore.isAuthenticated"
        to="/profile"
        :title="t('nav.settings')"
      >
        <UAvatar
          v-if="showImage"
          :src="avatarUrl!"
          :alt="authStore.user?.name || ''"
          size="sm"
          class="ring-2 ring-transparent hover:ring-(--color-gold-400) transition-shadow"
        />
        <UAvatar
          v-else
          :text="userInitials"
          size="sm"
          class="ring-2 ring-transparent hover:ring-(--color-gold-400) transition-shadow"
        />
      </NuxtLink>

      <!-- Settings (guest) -->
      <NuxtLink
        v-else
        to="/profile"
        class="nav-settings-btn"
        :title="t('nav.settings')"
      >
        <UIcon name="i-lucide-settings" class="size-[18px]" />
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
  background: rgba(31, 72, 55, 0.92);
  backdrop-filter: blur(16px) saturate(180%);
  -webkit-backdrop-filter: blur(16px) saturate(180%);
  border-bottom: 1px solid rgba(184, 147, 58, 0.15);
  display: flex;
  align-items: center;
  padding: 0 24px;
  gap: 16px;
  z-index: 100;
  box-shadow: 0 1px 0 rgba(0, 0, 0, 0.05);
}
.dark .navbar {
  background: rgba(20, 20, 18, 0.92);
  border-bottom-color: rgba(184, 147, 58, 0.1);
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
  font-family: 'IBM Plex Sans Arabic', sans-serif;
  font-size: var(--text-lg);
  font-weight: var(--weight-bold);
  color: var(--color-gold-400);
  line-height: var(--leading-tight);
  flex-shrink: 0;
  transition: text-shadow 0.3s var(--ease-out);
}

.nav-brand:hover .nav-logo {
  text-shadow: 0 0 20px rgba(184, 147, 58, 0.4);
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
  color: var(--color-gold-400);
  background: rgba(184, 147, 58, 0.15);
}

/* ── Language toggle ── */
.lang-toggle {
  display: flex;
  align-items: center;
  gap: 6px;
}

.lang-label {
  font-size: var(--text-xs);
  font-weight: var(--weight-semi);
  color: rgba(255, 255, 255, 0.4);
  cursor: pointer;
  transition: color 0.25s, text-shadow 0.25s;
  user-select: none;
  letter-spacing: var(--tracking-wide);
}

.lang-label.active {
  color: var(--color-gold-400);
  text-shadow: 0 0 12px rgba(184, 147, 58, 0.3);
}

.lang-label-ar {
  font-family: var(--font-ar);
  font-size: var(--text-sm);
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

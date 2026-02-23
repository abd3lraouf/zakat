<script setup lang="ts">
import { useAuthStore } from '~~/stores/auth'
import { useGoogleAuth } from '~/composables/useGoogleAuth'

const { t } = useI18n()
const authStore = useAuthStore()
const { signIn, signOut } = useGoogleAuth()
const { avatarUrl, showImage, onImgError } = useAvatar(112)

const initials = computed(() => {
  const name = authStore.user?.name
  if (!name) return '?'
  return name.charAt(0).toUpperCase()
})
</script>

<template>
  <UCard>
    <template #header>
      <span class="text-xs font-semibold text-(--color-stone-500) uppercase tracking-widest">{{ t('profile.account') }}</span>
    </template>

    <!-- Signed In -->
    <template v-if="authStore.isAuthenticated">
      <div class="flex items-center gap-4 mb-4">
        <UAvatar
          v-if="showImage"
          :src="avatarUrl!"
          :alt="authStore.user?.name || ''"
          size="xl"
          class="ring-2 ring-(--color-gold-400)"
        />
        <UAvatar
          v-else
          :text="initials"
          size="xl"
          class="ring-2 ring-(--color-gold-400)"
        />
        <div class="min-w-0">
          <div class="text-lg font-semibold text-(--color-stone-800) dark:text-(--color-stone-100) font-[var(--font-en-serif)]">{{ authStore.user?.name }}</div>
          <div class="text-sm text-(--color-stone-400) truncate">{{ authStore.user?.email }}</div>
        </div>
      </div>
      <UButton variant="outline" color="error" block @click="signOut">
        {{ t('nav.signout') }}
      </UButton>
    </template>

    <!-- Signed Out -->
    <template v-else>
      <div class="mb-4">
        <p class="text-(--text-md) font-semibold text-(--color-stone-800) dark:text-(--color-stone-100) mb-1">{{ t('profile.notSignedIn') }}</p>
        <p class="text-sm text-(--color-stone-400)">{{ t('profile.signInHint') }}</p>
      </div>
      <UButton block @click="signIn">
        {{ t('nav.signin') }}
      </UButton>
    </template>
  </UCard>
</template>

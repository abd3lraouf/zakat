<script setup lang="ts">
import { useAuthStore } from '~~/stores/auth'
import { useGoogleAuth } from '~/composables/useGoogleAuth'
import { useDriveSync } from '~/composables/useDriveSync'

const { t } = useI18n()
const authStore = useAuthStore()
const { signIn, signOut, isConnected } = useGoogleAuth()
const { forceSync, syncStatus, lastSyncedAt } = useDriveSync()
const { showToast } = useAppToast()

const isSyncing = computed(() => syncStatus.value === 'syncing')

const statusColor = computed(() => {
  switch (syncStatus.value) {
    case 'synced': return 'success'
    case 'syncing': return 'warning'
    case 'error': return 'error'
    default: return 'neutral'
  }
})

const statusLabel = computed(() => {
  switch (syncStatus.value) {
    case 'synced': return t('sync.synced')
    case 'syncing': return t('sync.syncing')
    case 'error': return t('sync.error')
    default: return t('sync.offline')
  }
})

const lastSyncedFormatted = computed(() => {
  if (!lastSyncedAt.value) return null
  const d = new Date(lastSyncedAt.value)
  return d.toLocaleString()
})

function handleDisconnect() {
  signOut()
  showToast(t('profile.disconnected'), 'info')
}
</script>

<template>
  <UCard v-if="authStore.isAuthenticated">
    <template #header>
      <div class="flex items-center justify-between gap-3">
        <span class="text-xs font-semibold text-(--color-stone-500) uppercase tracking-widest">{{ t('profile.sync') }}</span>
        <UBadge :color="(statusColor as any)" variant="subtle" size="sm">
          {{ statusLabel }}
        </UBadge>
      </div>
    </template>

    <div class="flex items-center gap-5 mb-4">
      <!-- Google Drive logo -->
      <div :class="['sync-logo-wrap', { 'animate-pulse': isSyncing }]">
        <svg viewBox="0 0 87.3 78" xmlns="http://www.w3.org/2000/svg" class="w-full h-full">
          <path d="M6.6 66.85l3.85 6.65c.8 1.4 1.95 2.5 3.3 3.3L29 52.2H0c0 1.55.4 3.1 1.2 4.5z" fill="#0066DA"/>
          <path d="M43.65 25.15L29.4.15c-1.35.8-2.5 1.9-3.3 3.3l-25 43.3c-.8 1.35-1.2 2.9-1.2 4.5h28.9z" fill="#00AC47"/>
          <path d="M73.55 76.8c1.35-.8 2.5-1.9 3.3-3.3l1.6-2.75 7.65-13.25c.8-1.4 1.2-2.95 1.2-4.5H58.2L73.55 76.8z" fill="#EA4335"/>
          <path d="M43.65 25.15L58 1.45c-1.35-.8-2.9-1.2-4.5-1.2H33.8c-1.6 0-3.15.45-4.5 1.2z" fill="#00832D"/>
          <path d="M58.3 52.2H29L13.75 76.8c1.35.8 2.9 1.2 4.5 1.2h35.6c1.6 0 3.15-.45 4.5-1.2z" fill="#2684FC"/>
          <path d="M73.4 26.5L60.1 3.45c-.8-1.4-1.95-2.5-3.3-3.3L43.65 25.15 58.3 52.2h29c0-1.55-.4-3.1-1.2-4.5z" fill="#FFBA00"/>
        </svg>
      </div>
      <div class="min-w-0">
        <p class="text-(--text-md) font-semibold text-(--color-stone-800)">Google Drive</p>
        <p class="text-sm text-(--color-stone-400) truncate">{{ authStore.user?.email }}</p>
        <p v-if="lastSyncedFormatted" class="text-xs text-(--color-stone-400) mt-1.5 opacity-80">
          {{ t('profile.lastSynced') }} {{ lastSyncedFormatted }}
        </p>
      </div>
    </div>

    <div class="flex gap-2.5">
      <template v-if="isConnected">
        <UButton :loading="isSyncing" class="flex-1" @click="forceSync">
          {{ t('profile.syncNow') }}
        </UButton>
        <UButton variant="outline" color="error" @click="handleDisconnect">
          {{ t('profile.disconnect') }}
        </UButton>
      </template>
      <template v-else>
        <UButton class="flex-1" @click="signIn">
          {{ t('profile.reconnect') }}
        </UButton>
        <UButton variant="outline" color="error" @click="handleDisconnect">
          {{ t('profile.disconnect') }}
        </UButton>
      </template>
    </div>
  </UCard>
</template>

<style scoped>
.sync-logo-wrap {
  width: 48px;
  height: 48px;
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--color-stone-100);
  border-radius: var(--radius-sm);
  padding: 10px;
}
</style>

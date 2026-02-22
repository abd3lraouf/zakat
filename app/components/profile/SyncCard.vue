<script setup lang="ts">
import { useAuthStore } from '~~/stores/auth'
import { useGoogleAuth } from '~/composables/useGoogleAuth'
import { useDriveSync } from '~/composables/useDriveSync'

const { t } = useI18n()
const authStore = useAuthStore()
const { signIn, signOut, isConnected } = useGoogleAuth()
const { forceSync, syncStatus, lastSyncedAt } = useDriveSync()
const { showToast } = useToast()

const isSyncing = computed(() => syncStatus.value === 'syncing')

const statusColor = computed(() => {
  switch (syncStatus.value) {
    case 'synced': return 'green'
    case 'syncing': return 'gold'
    case 'error': return 'red'
    default: return 'muted'
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

function handleSyncNow() {
  forceSync()
}

function handleDisconnect() {
  signOut()
  showToast(t('profile.disconnected'), 'info')
}
</script>

<template>
  <div v-if="authStore.isAuthenticated" class="sync-card">
    <div class="sync-card-header">
      <div class="sync-card-title-row">
        <span class="sync-card-title">{{ t('profile.sync') }}</span>
        <span :class="['sync-badge', statusColor]">
          <span class="sync-badge-dot" />
          {{ statusLabel }}
        </span>
      </div>
    </div>

    <div class="sync-card-body">
      <div class="sync-visual">
        <!-- Google Drive logo -->
        <div :class="['sync-logo-wrap', { spinning: isSyncing }]">
          <svg viewBox="0 0 87.3 78" xmlns="http://www.w3.org/2000/svg" class="drive-logo">
            <path d="M6.6 66.85l3.85 6.65c.8 1.4 1.95 2.5 3.3 3.3L29 52.2H0c0 1.55.4 3.1 1.2 4.5z" fill="#0066DA"/>
            <path d="M43.65 25.15L29.4.15c-1.35.8-2.5 1.9-3.3 3.3l-25 43.3c-.8 1.35-1.2 2.9-1.2 4.5h28.9z" fill="#00AC47"/>
            <path d="M73.55 76.8c1.35-.8 2.5-1.9 3.3-3.3l1.6-2.75 7.65-13.25c.8-1.4 1.2-2.95 1.2-4.5H58.2L73.55 76.8z" fill="#EA4335"/>
            <path d="M43.65 25.15L58 1.45c-1.35-.8-2.9-1.2-4.5-1.2H33.8c-1.6 0-3.15.45-4.5 1.2z" fill="#00832D"/>
            <path d="M58.3 52.2H29L13.75 76.8c1.35.8 2.9 1.2 4.5 1.2h35.6c1.6 0 3.15-.45 4.5-1.2z" fill="#2684FC"/>
            <path d="M73.4 26.5L60.1 3.45c-.8-1.4-1.95-2.5-3.3-3.3L43.65 25.15 58.3 52.2h29c0-1.55-.4-3.1-1.2-4.5z" fill="#FFBA00"/>
          </svg>
        </div>
        <div class="sync-info">
          <p class="sync-info-primary">Google Drive</p>
          <p class="sync-info-secondary">{{ authStore.user?.email }}</p>
          <p v-if="lastSyncedFormatted" class="sync-info-meta">
            {{ t('profile.lastSynced') }} {{ lastSyncedFormatted }}
          </p>
        </div>
      </div>
    </div>

    <div class="sync-card-actions">
      <template v-if="isConnected">
        <button
          class="btn btn-sync"
          :disabled="isSyncing"
          @click="handleSyncNow"
        >
          <Icon name="lucide:refresh-cw" size="16" :class="{ 'spin-icon': isSyncing }" />
          {{ t('profile.syncNow') }}
        </button>
        <button class="btn btn-disconnect" @click="handleDisconnect">
          {{ t('profile.disconnect') }}
        </button>
      </template>
      <template v-else>
        <button class="btn btn-sync" @click="signIn">
          {{ t('profile.reconnect') }}
        </button>
        <button class="btn btn-disconnect" @click="handleDisconnect">
          {{ t('profile.disconnect') }}
        </button>
      </template>
    </div>
  </div>
</template>

<style scoped>
.sync-card {
  background: white;
  border-radius: var(--radius-md);
  box-shadow: var(--shadow-sm);
  border: 1px solid var(--color-g-100);
  overflow: hidden;
  margin-bottom: 16px;
}

.sync-card-header {
  padding: 16px 24px;
  background: var(--color-g-50);
  border-bottom: 1px solid var(--color-g-100);
  position: relative;
}
.sync-card-header::before {
  content: '';
  position: absolute;
  inset-inline-start: 0;
  top: 8px;
  bottom: 8px;
  width: 3px;
  background: linear-gradient(180deg, var(--color-g-400), var(--color-g-600));
  border-radius: 0 2px 2px 0;
}
[dir="rtl"] .sync-card-header::before {
  border-radius: 2px 0 0 2px;
}

.sync-card-title-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
}

.sync-card-title {
  font-size: 13px;
  font-weight: 600;
  color: var(--color-parchment-600);
  text-transform: uppercase;
  letter-spacing: 1px;
}

/* Status badge */
.sync-badge {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 4px 12px;
  border-radius: 999px;
  font-size: 12px;
  font-weight: 600;
  transition: all 0.3s var(--ease-out);
}
.sync-badge-dot {
  width: 7px;
  height: 7px;
  border-radius: 50%;
  flex-shrink: 0;
  transition: all 0.3s;
}

.sync-badge.green {
  background: rgba(43, 168, 104, 0.12);
  color: var(--color-g-600);
}
.sync-badge.green .sync-badge-dot {
  background: #2BA868;
  box-shadow: 0 0 6px rgba(43, 168, 104, 0.4);
}

.sync-badge.gold {
  background: rgba(198, 147, 10, 0.12);
  color: var(--color-gold-dark);
}
.sync-badge.gold .sync-badge-dot {
  background: var(--color-gold);
  animation: pulse 1s infinite;
}

.sync-badge.red {
  background: rgba(220, 38, 38, 0.1);
  color: var(--color-red);
}
.sync-badge.red .sync-badge-dot {
  background: var(--color-red-soft);
}

.sync-badge.muted {
  background: var(--color-parchment-100);
  color: var(--color-parchment-500);
}
.sync-badge.muted .sync-badge-dot {
  background: var(--color-parchment-400);
}

/* Body */
.sync-card-body {
  padding: 24px;
}

.sync-visual {
  display: flex;
  align-items: center;
  gap: 20px;
}

/* Google Drive logo wrapper */
.sync-logo-wrap {
  width: 48px;
  height: 48px;
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--color-parchment-50);
  border-radius: var(--radius-sm);
  padding: 10px;
  transition: transform 0.3s var(--ease-out);
}
.sync-logo-wrap.spinning {
  animation: gentlePulse 1.5s ease-in-out infinite;
}

.drive-logo {
  width: 100%;
  height: 100%;
}

.sync-info {
  min-width: 0;
}

.sync-info-primary {
  font-size: 15px;
  font-weight: 600;
  color: var(--color-parchment-800);
  margin-bottom: 2px;
}

.sync-info-secondary {
  font-size: 13px;
  color: var(--color-parchment-400);
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.sync-info-meta {
  font-size: 11px;
  color: var(--color-parchment-400);
  margin-top: 6px;
  opacity: 0.8;
}

/* Actions */
.sync-card-actions {
  display: flex;
  gap: 10px;
  padding: 0 24px 20px;
}

.btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  padding: 10px 20px;
  border-radius: var(--radius-sm);
  border: none;
  font-family: inherit;
  font-size: 13px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
  white-space: nowrap;
}

.btn-sync {
  flex: 1;
  background: linear-gradient(135deg, var(--color-g-600), var(--color-g-700));
  color: white;
}
.btn-sync:hover:not(:disabled) {
  background: linear-gradient(135deg, var(--color-g-500), var(--color-g-600));
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(0, 108, 53, 0.35);
}
.btn-sync:active:not(:disabled) {
  transform: translateY(0) scale(0.97);
}
.btn-sync:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.btn-disconnect {
  background: var(--color-red-light);
  color: var(--color-red);
}
.btn-disconnect:hover {
  background: var(--color-red);
  color: white;
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(220, 38, 38, 0.3);
}
.btn-disconnect:active {
  transform: translateY(0) scale(0.97);
}

/* Spinning sync icon */
.spin-icon {
  display: inline-block;
  animation: spinIcon 1s linear infinite;
}

/* Animations */
@keyframes pulse {
  0%, 100% { opacity: 1; transform: scale(1); }
  50% { opacity: 0.5; transform: scale(0.75); }
}

@keyframes gentlePulse {
  0%, 100% { transform: scale(1); }
  50% { transform: scale(1.05); }
}

@keyframes spinIcon {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

@media (prefers-color-scheme: dark) {
  .sync-card {
    background: var(--color-parchment-50);
  }
  .sync-logo-wrap {
    background: var(--color-parchment-100);
  }
}
</style>

<script setup lang="ts">
import { useAuthStore } from '~~/stores/auth'

const { t } = useI18n()
const authStore = useAuthStore()
const { showToast } = useToast()

function handleSyncNow() {
  // TODO: Wire up Drive sync composable
  console.log('Sync Now clicked — not yet implemented')
  showToast(t('profile.syncSuccess'), 'success')
}

function handleDisconnect() {
  // TODO: Wire up Google disconnect logic
  console.log('Disconnect Google clicked — not yet implemented')
  authStore.clearUser()
  showToast(t('profile.disconnected'), 'info')
}
</script>

<template>
  <div v-if="authStore.isAuthenticated" class="profile-card profile-card-sync">
    <div class="profile-card-header">
      {{ t('profile.sync') }}
    </div>

    <div class="profile-sync-body">
      <p class="profile-sync-status">{{ t('profile.syncStatus') }}</p>
    </div>

    <div class="profile-action-rows">
      <button class="btn btn-outline" @click="handleSyncNow">
        {{ t('profile.syncNow') }}
      </button>
      <button class="btn btn-destructive" @click="handleDisconnect">
        {{ t('profile.disconnect') }}
      </button>
    </div>
  </div>
</template>

<style scoped>
.profile-card {
  background: white;
  border-radius: 12px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.06), 0 4px 12px rgba(0, 0, 0, 0.04);
  border: 1px solid var(--color-parchment-100);
  overflow: hidden;
  margin-bottom: 16px;
  transition: box-shadow 0.3s, transform 0.3s;
}
.profile-card:hover {
  box-shadow: 0 0 0 1px rgba(184, 148, 63, 0.08), 0 4px 16px rgba(184, 148, 63, 0.06);
  transform: translateY(-1px);
}

.profile-card-header {
  padding: 16px 24px;
  background: var(--color-parchment-50);
  border-bottom: 1px solid var(--color-parchment-100);
  font-size: 13px;
  font-weight: 600;
  color: var(--color-parchment-600);
  text-transform: uppercase;
  letter-spacing: 1px;
  position: relative;
}
.profile-card-header::before {
  content: '';
  position: absolute;
  inset-inline-start: 0;
  top: 8px;
  bottom: 8px;
  width: 3px;
  background: linear-gradient(180deg, var(--color-gold), var(--color-g-500));
  border-radius: 0 2px 2px 0;
}
[dir="rtl"] .profile-card-header::before {
  border-radius: 2px 0 0 2px;
}

/* Sync card accent */
.profile-card-sync .profile-card-header {
  background: var(--color-g-50);
  border-bottom-color: var(--color-g-100);
}
.profile-card-sync .profile-card-header::before {
  background: linear-gradient(180deg, var(--color-g-400), var(--color-g-600));
}

.profile-sync-body {
  padding: 20px 24px;
}

.profile-sync-status {
  font-size: 14px;
  color: var(--color-g-600);
  font-weight: 500;
}

/* Action rows */
.profile-action-rows {
  display: flex;
  flex-direction: column;
  gap: 10px;
  padding: 20px 24px;
}

/* Buttons */
.btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 12px 22px;
  border-radius: var(--radius-sm);
  border: none;
  font-family: inherit;
  font-size: 13px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
  letter-spacing: 0.3px;
  white-space: nowrap;
}

.btn-outline {
  background: white;
  color: var(--color-g-600);
  font-weight: 600;
  border: 1.5px solid var(--color-g-200);
  border-radius: var(--radius-sm);
}
.btn-outline:hover {
  background: var(--color-g-50);
  border-color: var(--color-g-400);
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(61, 107, 90, 0.15);
}
.btn-outline:active {
  transform: translateY(0) scale(0.97);
}

.btn-destructive {
  background: var(--color-red-light);
  color: var(--color-red);
  font-weight: 600;
  border-radius: var(--radius-sm);
}
.btn-destructive:hover {
  background: var(--color-red);
  color: white;
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(181, 56, 45, 0.3);
}
.btn-destructive:active {
  transform: translateY(0) scale(0.97);
}
</style>

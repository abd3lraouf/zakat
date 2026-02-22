<script setup lang="ts">
import { useAuthStore } from '~~/stores/auth'

const { t } = useI18n()
const authStore = useAuthStore()

const initials = computed(() => {
  const name = authStore.user?.name
  if (!name) return '?'
  return name.charAt(0).toUpperCase()
})

function handleSignIn() {
  // TODO: Wire up Google Sign-In composable
  console.log('Google Sign-In clicked — not yet implemented')
}

function handleSignOut() {
  authStore.clearUser()
}
</script>

<template>
  <div class="profile-card profile-card-account">
    <div class="profile-card-header">
      {{ t('profile.account') }}
    </div>

    <!-- Signed In State -->
    <template v-if="authStore.isAuthenticated">
      <div class="profile-account">
        <div class="profile-avatar-placeholder">
          {{ initials }}
        </div>
        <div class="profile-user-info">
          <div class="profile-user-name">{{ authStore.user?.name }}</div>
          <div class="profile-user-email">{{ authStore.user?.email }}</div>
        </div>
      </div>
      <div class="profile-action-rows">
        <button class="btn btn-destructive" @click="handleSignOut">
          {{ t('nav.signout') }}
        </button>
      </div>
    </template>

    <!-- Signed Out State -->
    <template v-else>
      <div class="profile-signed-out">
        <p class="profile-signed-out-title">{{ t('profile.notSignedIn') }}</p>
        <p class="profile-signed-out-hint">{{ t('profile.signInHint') }}</p>
      </div>
      <div class="profile-action-rows">
        <button class="btn btn-primary" @click="handleSignIn">
          {{ t('nav.signin') }}
        </button>
      </div>
    </template>
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

/* Account card accent */
.profile-card-account .profile-card-header {
  background: var(--color-gold-pale);
  border-bottom-color: var(--color-gold-muted);
}
.profile-card-account .profile-card-header::before {
  background: linear-gradient(180deg, var(--color-gold), var(--color-gold-dark));
}

/* Signed-in layout */
.profile-account {
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 20px 24px;
}

.profile-avatar-placeholder {
  width: 56px;
  height: 56px;
  border-radius: 50%;
  background: linear-gradient(135deg, var(--color-gold-pale), var(--color-gold-muted));
  color: var(--color-gold-dark);
  font-size: 20px;
  font-weight: 700;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 2.5px solid var(--color-gold);
  box-shadow: 0 0 0 3px var(--color-gold-pale);
  font-family: var(--font-en);
  flex-shrink: 0;
}

.profile-user-info {
  min-width: 0;
}

.profile-user-name {
  font-family: var(--font-en);
  font-size: 18px;
  font-weight: 600;
  color: var(--color-parchment-800);
  margin-bottom: 2px;
}

.profile-user-email {
  font-size: 13px;
  color: var(--color-parchment-400);
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

/* Signed-out layout */
.profile-signed-out {
  padding: 20px 24px;
}

.profile-signed-out-title {
  font-size: 16px;
  font-weight: 600;
  color: var(--color-parchment-800);
  margin-bottom: 4px;
}

.profile-signed-out-hint {
  font-size: 13px;
  color: var(--color-parchment-400);
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

.btn-primary {
  background: linear-gradient(135deg, var(--color-g-600), var(--color-g-700));
  color: white;
  font-weight: 600;
  border-radius: var(--radius-sm);
}
.btn-primary:hover {
  background: linear-gradient(135deg, var(--color-g-500), var(--color-g-600));
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(61, 107, 90, 0.35);
}
.btn-primary:active {
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

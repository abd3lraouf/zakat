<script setup lang="ts">
import { useDriveSync } from '~/composables/useDriveSync'

const { t } = useI18n()
const { syncConflict, cloudData, resolveUseCloud, resolveKeepLocal } = useDriveSync()
</script>

<template>
  <div>
    <AppNavbar />
    <OfflineBanner />
    <main class="pt-[var(--spacing-navbar-h)] relative z-[1] min-h-screen">
      <slot />
    </main>
    <AppBottomNav />
    <AppToast />

    <!-- Sync conflict resolution modal -->
    <AppModal v-model="syncConflict">
      <div class="sync-conflict-modal">
        <div class="sync-conflict-icon">
          <Icon name="lucide:cloud" size="48" />
        </div>
        <h3 class="sync-conflict-title">{{ t('sync.conflictTitle') }}</h3>
        <p class="sync-conflict-hint">{{ t('sync.conflictHint') }}</p>
        <p v-if="cloudData?.modifiedTime" class="sync-conflict-date">
          {{ t('sync.cloudDataFrom') }} {{ new Date(cloudData.modifiedTime).toLocaleDateString() }}
        </p>
        <div class="sync-conflict-actions">
          <button class="btn btn-outline" @click="resolveKeepLocal">
            {{ t('sync.keepLocal') }}
          </button>
          <button class="btn btn-primary" @click="resolveUseCloud">
            {{ t('sync.useCloud') }}
          </button>
        </div>
      </div>
    </AppModal>
  </div>
</template>

<style scoped>
.sync-conflict-modal {
  text-align: center;
}

.sync-conflict-icon {
  margin-bottom: 12px;
  opacity: 0.8;
  color: var(--color-parchment-600);
}

.sync-conflict-title {
  font-size: var(--text-lg);
  font-weight: var(--weight-bold);
  color: var(--color-parchment-800);
  margin-bottom: 8px;
}

.sync-conflict-hint {
  font-size: var(--text-base);
  color: var(--color-parchment-500);
  line-height: var(--leading-normal);
  margin-bottom: 8px;
}

.sync-conflict-date {
  font-size: var(--text-xs);
  color: var(--color-parchment-400);
  margin-bottom: 24px;
}

.sync-conflict-actions {
  display: flex;
  gap: 12px;
  justify-content: center;
}

.btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 12px 24px;
  border-radius: var(--radius-sm);
  border: none;
  font-family: inherit;
  font-size: var(--text-sm);
  font-weight: var(--weight-semi);
  cursor: pointer;
  transition: all 0.2s;
  min-width: 130px;
}

.btn-outline {
  background: white;
  color: var(--color-parchment-600);
  border: 1.5px solid var(--color-parchment-200);
}
.btn-outline:hover {
  border-color: var(--color-parchment-400);
  background: var(--color-parchment-50);
}

.btn-primary {
  background: linear-gradient(135deg, var(--color-g-600), var(--color-g-700));
  color: white;
}
.btn-primary:hover {
  background: linear-gradient(135deg, var(--color-g-500), var(--color-g-600));
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(0, 108, 53, 0.35);
}
</style>

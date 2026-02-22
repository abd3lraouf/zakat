<script setup lang="ts">
import type { SyncStatus } from '~~/shared/types'

defineProps<{
  status: SyncStatus
}>()

const { t } = useI18n()

const labelKey: Record<SyncStatus, string> = {
  synced: 'sync.synced',
  syncing: 'sync.syncing',
  error: 'sync.error',
  offline: 'sync.offline',
}
</script>

<template>
  <div
    class="sync-indicator"
    :class="status"
    aria-live="polite"
  >
    <div class="sync-dot" />
    <span class="sync-label">{{ t(labelKey[status]) }}</span>
  </div>
</template>

<style scoped>
.sync-indicator {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 12px;
  color: rgba(255, 255, 255, 0.75);
  padding: 4px 10px;
  border-radius: 999px;
  background: rgba(255, 255, 255, 0.06);
  cursor: default;
  transition: all 0.2s;
}

.sync-dot {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: var(--color-parchment-400);
  transition: all 0.2s;
  flex-shrink: 0;
}

/* Status: synced */
.sync-indicator.synced .sync-dot {
  background: #4aab72;
}

/* Status: syncing */
.sync-indicator.syncing .sync-dot {
  background: var(--color-gold);
  animation: pulse 1s infinite;
}

/* Status: error */
.sync-indicator.error .sync-dot {
  background: var(--color-red-soft);
}

/* Status: offline */
.sync-indicator.offline .sync-dot {
  background: var(--color-parchment-400);
}

@keyframes pulse {
  0%, 100% {
    opacity: 1;
    transform: scale(1);
  }
  50% {
    opacity: 0.5;
    transform: scale(0.8);
  }
}

/* Hide label text on mobile to save space */
@media (max-width: 640px) {
  .sync-label {
    display: none;
  }
}
</style>

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

const colorMap: Record<SyncStatus, string> = {
  synced: 'success',
  syncing: 'warning',
  error: 'error',
  offline: 'neutral',
}
</script>

<template>
  <UBadge
    :color="(colorMap[status] as any)"
    variant="subtle"
    size="sm"
    class="sync-indicator"
    aria-live="polite"
  >
    <span class="sync-dot" :class="status" />
    <span class="sync-label">{{ t(labelKey[status]) }}</span>
  </UBadge>
</template>

<style scoped>
.sync-indicator {
  gap: 6px;
  cursor: default;
}

.sync-dot {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  flex-shrink: 0;
  transition: all 0.2s;
}

.sync-dot.synced {
  background: var(--color-green-500);
}

.sync-dot.syncing {
  background: var(--color-gold-500);
  animation: pulse 1s infinite;
}

.sync-dot.error {
  background: var(--color-red);
}

.sync-dot.offline {
  background: var(--color-stone-400);
}

@keyframes pulse {
  0%, 100% { opacity: 1; transform: scale(1); }
  50% { opacity: 0.5; transform: scale(0.8); }
}

@media (max-width: 640px) {
  .sync-label {
    display: none;
  }
}
</style>

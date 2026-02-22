<script setup lang="ts">
const { t } = useI18n()

const isOffline = ref(false)

function updateOnlineStatus() {
  isOffline.value = !navigator.onLine
}

onMounted(() => {
  updateOnlineStatus()
  window.addEventListener('online', updateOnlineStatus)
  window.addEventListener('offline', updateOnlineStatus)
})

onUnmounted(() => {
  window.removeEventListener('online', updateOnlineStatus)
  window.removeEventListener('offline', updateOnlineStatus)
})
</script>

<template>
  <Transition name="banner">
    <div
      v-if="isOffline"
      class="offline-banner"
      role="alert"
      aria-live="assertive"
    >
      <span aria-hidden="true">&#128225;</span>
      {{ t('sync.offline') }} &mdash; {{ t('offline.saved') }}
    </div>
  </Transition>
</template>

<style scoped>
.offline-banner {
  background: var(--color-warning);
  color: #fff;
  position: fixed;
  top: var(--spacing-navbar-h);
  left: 0;
  right: 0;
  z-index: 90;
  padding: 8px 20px;
  text-align: center;
  font-size: 13px;
}

.banner-enter-active {
  animation: slideDown 0.3s cubic-bezier(0.16, 1, 0.3, 1);
}

.banner-leave-active {
  transition: all 0.2s ease;
}

.banner-leave-to {
  opacity: 0;
  transform: translateY(-100%);
}

@keyframes slideDown {
  from {
    opacity: 0;
    transform: translateY(-100%);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>

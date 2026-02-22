<script setup lang="ts">
const { toasts } = useToast()
</script>

<template>
  <div class="toast-container">
    <TransitionGroup name="toast">
      <div
        v-for="toast in toasts"
        :key="toast.id"
        class="toast"
        :class="`toast-${toast.type}`"
        role="status"
        aria-live="polite"
      >
        <Icon v-if="toast.type === 'success'" name="lucide:check" size="16" aria-hidden="true" />
        <Icon v-else-if="toast.type === 'error'" name="lucide:x" size="16" aria-hidden="true" />
        <Icon v-else-if="toast.type === 'warning'" name="lucide:triangle-alert" size="16" aria-hidden="true" />
        <Icon v-else name="lucide:info" size="16" aria-hidden="true" />
        {{ toast.message }}
      </div>
    </TransitionGroup>
  </div>
</template>

<style scoped>
.toast-container {
  position: fixed;
  bottom: 24px;
  inset-inline-end: 24px;
  z-index: 999;
  display: flex;
  flex-direction: column;
  gap: 8px;
  pointer-events: none;
}

.toast {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 12px 20px;
  border-radius: 999px;
  font-size: 13px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.08), 0 16px 48px rgba(0, 0, 0, 0.12);
  max-width: 320px;
}

.toast-success {
  background: linear-gradient(135deg, #005229, #006C35);
  color: #fff;
}

.toast-error {
  background: #DC2626;
  color: #fff;
}

.toast-warning {
  background: #D97706;
  color: #fff;
}

.toast-info {
  background: #1F2937;
  color: #fff;
}

/* Transition group animations */
.toast-enter-active {
  animation: slideInRight 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
}

.toast-leave-active {
  transition: all 0.3s cubic-bezier(0.4, 0, 1, 1);
}

.toast-leave-to {
  opacity: 0;
  transform: translateX(120%);
}

[dir="rtl"] .toast-leave-to {
  transform: translateX(-120%);
}

@keyframes slideInRight {
  from {
    opacity: 0;
    transform: translateX(120%);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}

[dir="rtl"] .toast-enter-active {
  animation: slideInLeft 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
}

@keyframes slideInLeft {
  from {
    opacity: 0;
    transform: translateX(-120%);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}
</style>

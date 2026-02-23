<script setup lang="ts">
const props = defineProps<{
  modelValue: boolean
}>()

const emit = defineEmits<{
  'update:modelValue': [value: boolean]
}>()

function close() {
  emit('update:modelValue', false)
}

function onOverlayClick(event: MouseEvent) {
  if (event.target === event.currentTarget) {
    close()
  }
}

function onKeydown(event: KeyboardEvent) {
  if (event.key === 'Escape') {
    close()
  }
}
</script>

<template>
  <Teleport to="body">
    <Transition name="modal">
      <div
        v-if="modelValue"
        class="modal-overlay"
        role="dialog"
        aria-modal="true"
        @click="onOverlayClick"
        @keydown="onKeydown"
        tabindex="-1"
      >
        <div class="modal-box">
          <slot />
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<style scoped>
.modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(17, 24, 39, 0.5);
  backdrop-filter: blur(8px) saturate(150%);
  -webkit-backdrop-filter: blur(8px) saturate(150%);
  z-index: 500;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
}

.modal-box {
  background: var(--color-stone-50);
  border-radius: 16px;
  border: 1px solid var(--color-stone-200);
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.1), 0 24px 64px rgba(0, 0, 0, 0.16);
  width: 100%;
  max-width: 460px;
  padding: 32px;
}

.dark .modal-box {
  background: var(--color-stone-900);
  border-color: var(--color-stone-700);
}

/* Transition: overlay fade + modal scale */
.modal-enter-active {
  transition: opacity 0.3s cubic-bezier(0.16, 1, 0.3, 1);
}

.modal-leave-active {
  transition: opacity 0.2s ease;
}

.modal-enter-from,
.modal-leave-to {
  opacity: 0;
}

.modal-enter-active .modal-box {
  transition: transform 0.35s cubic-bezier(0.34, 1.56, 0.64, 1);
}

.modal-leave-active .modal-box {
  transition: transform 0.2s ease;
}

.modal-enter-from .modal-box {
  transform: scale(0.92) translateY(16px);
}

.modal-leave-to .modal-box {
  transform: scale(0.95) translateY(8px);
}
</style>

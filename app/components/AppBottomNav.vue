<script setup lang="ts">
const { t } = useI18n()
const route = useRoute()

function isActive(path: string): boolean {
  return route.path === path
}

const navItems = [
  { path: '/', icon: 'lucide:house', labelKey: 'nav.home' },
  { path: '/calculator', icon: 'lucide:calculator', labelKey: 'nav.calculator' },
  { path: '/tracker', icon: 'lucide:clipboard-list', labelKey: 'nav.tracker' },
  { path: '/profile', icon: 'lucide:settings', labelKey: 'nav.settings' },
]
</script>

<template>
  <nav class="bottom-nav" aria-label="Bottom navigation">
    <NuxtLink
      v-for="item in navItems"
      :key="item.path"
      :to="item.path"
      class="bnav-btn"
      :class="{ active: isActive(item.path) }"
    >
      <Icon :name="item.icon" size="20" />
      <span>{{ t(item.labelKey) }}</span>
    </NuxtLink>
  </nav>
</template>

<style scoped>
.bottom-nav {
  display: none;
  position: fixed;
  bottom: 0;
  inset-inline: 0;
  background: rgba(0, 61, 31, 0.92);
  backdrop-filter: blur(16px) saturate(180%);
  -webkit-backdrop-filter: blur(16px) saturate(180%);
  border-top: 1px solid rgba(198, 147, 10, 0.15);
  padding: 8px 20px;
  padding-bottom: max(8px, env(safe-area-inset-bottom));
  z-index: 90;
  gap: 4px;
  justify-content: space-around;
}

@media (max-width: 640px) {
  .bottom-nav {
    display: flex;
  }
}

.bnav-btn {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 3px;
  padding: 8px;
  border-radius: var(--radius-sm);
  border: none;
  background: transparent;
  color: rgba(255, 255, 255, 0.7);
  cursor: pointer;
  transition: all 0.2s;
  text-decoration: none;
  font-family: inherit;
}

.bnav-btn.active {
  color: var(--color-gold);
}

.bnav-btn span:last-child {
  font-size: var(--text-xs);
  letter-spacing: var(--tracking-wide);
}
</style>

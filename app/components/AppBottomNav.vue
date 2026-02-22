<script setup lang="ts">
const { t } = useI18n()
const route = useRoute()

function isActive(path: string): boolean {
  return route.path === path
}

const navItems = [
  { path: '/', icon: '\uD83C\uDFE0', labelKey: 'nav.home' },
  { path: '/calculator', icon: '\uD83E\uDDEE', labelKey: 'nav.calculator' },
  { path: '/tracker', icon: '\uD83D\uDCCB', labelKey: 'nav.tracker' },
  { path: '/profile', icon: '\uD83D\uDC64', labelKey: 'nav.profile' },
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
      <span>{{ item.icon }}</span>
      <span>{{ t(item.labelKey) }}</span>
    </NuxtLink>
  </nav>
</template>

<style scoped>
.bottom-nav {
  display: none;
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  background: rgba(36, 61, 50, 0.85);
  backdrop-filter: blur(16px) saturate(180%);
  -webkit-backdrop-filter: blur(16px) saturate(180%);
  border-top: 1px solid rgba(184, 148, 63, 0.15);
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

.bnav-btn span:first-child {
  font-size: 20px;
}

.bnav-btn span:last-child {
  font-size: 12px;
  letter-spacing: 0.3px;
}
</style>

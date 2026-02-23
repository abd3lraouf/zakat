<script setup lang="ts">
const { t } = useI18n()
</script>

<template>
  <UCard>
    <template #header>
      <span class="text-xs font-semibold text-(--color-stone-500) uppercase tracking-widest">{{ t('profile.about') }}</span>
    </template>

    <div class="flex flex-col divide-y divide-(--color-stone-200) dark:divide-(--color-stone-800)">
      <div class="flex items-center justify-between py-3 first:pt-0 text-sm text-(--color-stone-600) dark:text-(--color-stone-400)">
        <span class="text-(--color-stone-500) font-medium">{{ t('profile.version') }}</span>
        <span class="font-mono font-semibold text-(--color-stone-800) dark:text-(--color-stone-200)">1.0</span>
      </div>
      <div class="flex items-center justify-between py-3 text-sm text-(--color-stone-600) dark:text-(--color-stone-400)">
        <span class="text-(--color-stone-500) font-medium">{{ t('profile.source') }}</span>
        <a
          href="https://github.com/abd3lraouf/zakat"
          target="_blank"
          rel="noopener noreferrer"
          class="font-mono font-semibold text-(--color-green-600) hover:text-(--color-green-500) hover:underline"
        >
          github.com/abd3lraouf/zakat
        </a>
      </div>
      <div class="flex flex-col items-start gap-1 py-3 last:pb-0 text-sm">
        <span class="text-(--color-stone-500) font-medium">{{ t('profile.privacy') }}</span>
        <span class="text-xs text-(--color-stone-400) leading-snug">{{ t('profile.privacyDesc') }}</span>
      </div>
    </div>
  </UCard>
</template>

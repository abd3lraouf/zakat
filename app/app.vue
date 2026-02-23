<script setup lang="ts">
import { ar, en } from '@nuxt/ui/locale'

const { locale, locales } = useI18n()
const head = useLocaleHead({ addDirAttribute: true, addSeoAttributes: true })

const appName = computed(() => locale.value === 'ar' ? 'زكاتي' : 'Zakaty')
const dir = computed(() => head.value.htmlAttrs?.dir ?? (locales.value.find(l => (typeof l === 'object' ? l.code : l) === locale.value) as { dir?: string })?.dir ?? 'ltr')
const uiLocale = computed(() => locale.value === 'ar' ? ar : en)

useHead({
  titleTemplate: (title) => title ? `${title} — ${appName.value}` : appName.value,
  htmlAttrs: computed(() => ({
    lang: head.value.htmlAttrs?.lang ?? locale.value,
    dir: dir.value,
  })),
})
</script>

<template>
  <UApp :locale="uiLocale">
    <NuxtLayout>
      <NuxtPage />
    </NuxtLayout>
  </UApp>
</template>

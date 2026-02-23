<script setup lang="ts">
const { locale, locales } = useI18n()
const head = useLocaleHead({ addDirAttribute: true, addSeoAttributes: true })

const appName = computed(() => locale.value === 'ar' ? 'زكاتي' : 'Zakaty')

useHead({
  titleTemplate: (title) => title ? `${title} — ${appName.value}` : appName.value,
  htmlAttrs: computed(() => ({
    lang: head.value.htmlAttrs?.lang ?? locale.value,
    dir: head.value.htmlAttrs?.dir ?? (locales.value.find(l => (typeof l === 'object' ? l.code : l) === locale.value) as { dir?: string })?.dir ?? 'ltr',
  })),
})
</script>

<template>
  <UApp>
    <NuxtLayout>
      <NuxtPage />
    </NuxtLayout>
  </UApp>
</template>

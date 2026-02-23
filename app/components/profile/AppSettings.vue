<script setup lang="ts">
import { usePreferencesStore } from '~~/stores/preferences'
import { CURRENCIES, MIDDLE_EAST_CODES, INTERNATIONAL_CODES } from '~/utils/currencies'

const { t, locale } = useI18n()
const prefs = usePreferencesStore()

const currencyOptions = computed(() => {
  const lang = locale.value

  function toOption(code: string) {
    const c = CURRENCIES[code]!
    return {
      label: lang === 'ar' ? `${c.nameAr} (${c.code})` : `${c.nameEn} (${c.code})`,
      value: c.code,
    }
  }

  return [
    {
      label: t('profile.currencyMiddleEast'),
      items: MIDDLE_EAST_CODES.map(toOption),
    },
    {
      label: t('profile.currencyInternational'),
      items: INTERNATIONAL_CODES.map(toOption),
    },
  ]
})
</script>

<template>
  <UCard>
    <template #header>
      <span class="text-xs font-semibold text-(--color-stone-500) uppercase tracking-widest">{{ t('profile.appSettings') }}</span>
    </template>

    <div class="flex items-center justify-between gap-4">
      <div class="min-w-0">
        <div class="text-base font-semibold text-(--color-stone-800) dark:text-(--color-stone-200)">{{ t('profile.currency') }}</div>
        <div class="text-xs text-(--color-stone-400)">{{ t('profile.currencyHint') }}</div>
      </div>
      <USelectMenu
        v-model="prefs.currency"
        :items="currencyOptions"
        value-key="value"
        class="w-[220px]"
      />
    </div>
  </UCard>
</template>

<script setup lang="ts">
import { useDriveSync } from '~/composables/useDriveSync'

const { t } = useI18n()
const { syncConflict, cloudData, resolveUseCloud, resolveKeepLocal } = useDriveSync()
</script>

<template>
  <div>
    <AppNavbar />
    <OfflineBanner />
    <main class="pt-[var(--spacing-navbar-h)] relative z-[1] min-h-screen">
      <slot />
      <AppFooter />
    </main>
    <AppBottomNav />

    <!-- Sync conflict resolution modal -->
    <UModal v-model:open="syncConflict">
      <template #content>
        <div class="p-6 text-center">
          <UIcon name="i-lucide-cloud" class="size-12 mb-3 opacity-80 text-(--color-stone-600)" />
          <h3 class="text-lg font-bold text-(--color-stone-800) mb-2">{{ t('sync.conflictTitle') }}</h3>
          <p class="text-base text-(--color-stone-500) leading-normal mb-2">{{ t('sync.conflictHint') }}</p>
          <p v-if="cloudData?.modifiedTime" class="text-xs text-(--color-stone-400) mb-6">
            {{ t('sync.cloudDataFrom') }} {{ new Date(cloudData.modifiedTime).toLocaleDateString() }}
          </p>
          <div class="flex gap-3 justify-center">
            <UButton variant="outline" color="neutral" @click="resolveKeepLocal">
              {{ t('sync.keepLocal') }}
            </UButton>
            <UButton @click="resolveUseCloud">
              {{ t('sync.useCloud') }}
            </UButton>
          </div>
        </div>
      </template>
    </UModal>
  </div>
</template>

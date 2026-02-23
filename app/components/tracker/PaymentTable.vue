<script setup lang="ts">
import type { Payment } from '~~/shared/types'
import { useTrackerStore } from '~~/stores/tracker'
import { usePreferencesStore } from '~~/stores/preferences'
import { fmtCurrency } from '~/utils/format'

const tracker = useTrackerStore()
const { t, locale } = useI18n()
const prefs = usePreferencesStore()

function onUpdateField(id: string, field: keyof Payment, value: string | number) {
  tracker.updatePayment(id, field, value)
}

function onDelete(id: string) {
  tracker.deletePayment(id)
}

function clearAllPayments() {
  if (confirm(t('tracker.clearAll.confirm'))) {
    tracker.clearAll()
  }
}
</script>

<template>
  <UCard>
    <template #header>
      <div class="flex items-center justify-between gap-3">
        <h3 class="text-(--text-md) font-semibold text-(--color-stone-800) dark:text-(--color-stone-100)">{{ t('tracker.paymentLog') }}</h3>
        <UButton
          variant="outline"
          color="error"
          size="xs"
          @click="clearAllPayments"
        >
          {{ t('tracker.clearAll') }}
        </UButton>
      </div>
    </template>

    <div class="table-wrap">
      <table aria-label="Payment log table">
        <thead>
          <tr>
            <th scope="col">#</th>
            <th scope="col">{{ t('tracker.date') }}</th>
            <th scope="col">{{ t('tracker.recipient') }}</th>
            <th scope="col">{{ t('tracker.category') }}</th>
            <th scope="col">{{ t('tracker.amount') }}</th>
            <th scope="col">{{ t('tracker.notes') }}</th>
            <th scope="col" aria-label="Delete" />
          </tr>
        </thead>
        <TransitionGroup name="row" tag="tbody">
          <TrackerPaymentRow
            v-for="(payment, idx) in tracker.payments"
            :key="payment.id"
            :payment="payment"
            :index="idx"
            @update:field="onUpdateField"
            @delete="onDelete"
          />
        </TransitionGroup>
      </table>

      <!-- Empty state -->
      <div v-if="tracker.payments.length === 0" class="tracker-empty">
        <UIcon name="i-lucide-scroll-text" class="size-11 mb-3.5 text-(--color-stone-300)" />
        <h4 class="text-base font-semibold text-(--color-stone-600) dark:text-(--color-stone-300) mb-2">{{ t('tracker.empty.title') }}</h4>
        <p class="text-sm text-(--color-stone-400) leading-normal">{{ t('tracker.empty.sub') }}</p>
      </div>
    </div>

    <!-- Add row bar -->
    <div class="add-row-bar">
      <UButton @click="tracker.addPayment(1)">
        <UIcon name="i-lucide-plus" class="size-4" />
        {{ t('tracker.addRow') }}
      </UButton>
      <UButton variant="outline" color="neutral" size="sm" @click="tracker.addPayment(5)">
        + {{ t('tracker.add5') }}
      </UButton>
      <UBadge variant="subtle" color="neutral" class="ms-auto">
        {{ tracker.payments.length }} {{ tracker.payments.length === 1 ? 'payment' : 'payments' }}
      </UBadge>
    </div>

    <template #footer>
      <div class="flex items-center justify-between">
        <div>
          <div class="text-xs text-(--color-stone-400) mb-0.5">{{ t('tracker.totalPaid') }}</div>
          <div class="font-mono text-[15px] font-bold text-(--color-green-600)">{{ fmtCurrency(tracker.totalPaid, locale, prefs.currency) }}</div>
        </div>
        <div class="text-end">
          <div class="text-xs text-(--color-stone-400) mb-0.5">{{ t('tracker.remaining') }}</div>
          <div class="font-mono text-[15px] font-bold text-(--color-red)">{{ fmtCurrency(tracker.remaining, locale, prefs.currency) }}</div>
        </div>
      </div>
    </template>
  </UCard>
</template>

<style scoped>
.table-wrap {
  overflow-x: auto;
  -webkit-overflow-scrolling: touch;
}

table {
  width: 100%;
  border-collapse: collapse;
  font-size: 13px;
  min-width: 700px;
}

thead tr {
  background: var(--color-stone-100);
}
.dark thead tr {
  background: var(--color-stone-800);
}
thead th {
  padding: 12px 10px;
  text-align: start;
  font-size: var(--text-xs);
  letter-spacing: var(--tracking-widest);
  text-transform: uppercase;
  color: var(--color-stone-400);
  font-weight: var(--weight-medium);
  white-space: nowrap;
  border-bottom: 1px solid var(--color-stone-200);
}
.dark thead th {
  border-bottom-color: var(--color-stone-700);
}

.tracker-empty {
  text-align: center;
  padding: 48px 20px;
  color: var(--color-stone-400);
}

.add-row-bar {
  padding: 14px 20px;
  border-top: 1px solid var(--color-stone-200);
  display: flex;
  align-items: center;
  gap: 10px;
  flex-wrap: wrap;
}
.dark .add-row-bar {
  border-top-color: var(--color-stone-800);
}

/* ── Row transitions ── */
.row-enter-active {
  transition: opacity 0.3s cubic-bezier(0.16, 1, 0.3, 1),
              transform 0.3s cubic-bezier(0.16, 1, 0.3, 1);
}
.row-leave-active {
  transition: opacity 0.2s ease,
              transform 0.2s ease;
}
.row-enter-from {
  opacity: 0;
  transform: translateY(-8px);
}
.row-leave-to {
  opacity: 0;
  transform: translateX(20px);
}
.row-move {
  transition: transform 0.3s cubic-bezier(0.16, 1, 0.3, 1);
}
</style>

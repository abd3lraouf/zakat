<script setup lang="ts">
import type { Payment } from '~~/shared/types'
import { useTrackerStore } from '~~/stores/tracker'
import { fmtEGP } from '~/utils/format'

const tracker = useTrackerStore()
const { t, locale } = useI18n()

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
  <div class="card">
    <div class="card-header">
      <h3>{{ t('tracker.paymentLog') }}</h3>
      <div class="header-actions">
        <button
          class="btn btn-outline btn-sm btn-destructive"
          @click="clearAllPayments"
        >
          {{ t('tracker.clearAll') }}
        </button>
      </div>
    </div>

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
        <tbody v-if="tracker.payments.length > 0">
          <TrackerPaymentRow
            v-for="(payment, idx) in tracker.payments"
            :key="payment.id"
            :payment="payment"
            :index="idx"
            @update:field="onUpdateField"
            @delete="onDelete"
          />
        </tbody>
      </table>

      <!-- Empty state -->
      <div v-if="tracker.payments.length === 0" class="tracker-empty">
        <div class="te-icon">
          <Icon name="lucide:scroll-text" size="44" />
        </div>
        <h4>{{ t('tracker.empty.title') }}</h4>
        <p>{{ t('tracker.empty.sub') }}</p>
      </div>
    </div>

    <!-- Add row bar -->
    <div class="add-row-bar">
      <button class="btn btn-primary" @click="tracker.addPayment(1)">
        <Icon name="lucide:plus" size="16" /> {{ t('tracker.addRow') }}
      </button>
      <button class="btn btn-outline btn-sm" @click="tracker.addPayment(5)">
        + {{ t('tracker.add5') }}
      </button>
      <div class="row-count-badge" aria-live="polite">
        {{ tracker.payments.length }} {{ tracker.payments.length === 1 ? 'payment' : 'payments' }}
      </div>
    </div>

    <!-- Footer -->
    <div class="card-footer">
      <div>
        <div class="footer-label">{{ t('tracker.totalPaid') }}</div>
        <div class="footer-value footer-value-green">
          {{ fmtEGP(tracker.totalPaid, locale) }}
        </div>
      </div>
      <div class="footer-end">
        <div class="footer-label">{{ t('tracker.remaining') }}</div>
        <div class="footer-value footer-value-red">
          {{ fmtEGP(tracker.remaining, locale) }}
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* ── Card ── */
.card {
  background: white;
  border-radius: var(--radius-md);
  box-shadow: var(--shadow-sm);
  border: 1px solid var(--color-parchment-100);
  overflow: hidden;
}

.card-header {
  padding: 18px 24px;
  background: var(--color-parchment-50);
  border-bottom: 1px solid var(--color-parchment-100);
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  position: relative;
}
.card-header::before {
  content: '';
  position: absolute;
  inset-inline-start: 0;
  top: 8px;
  bottom: 8px;
  width: 3px;
  background: linear-gradient(180deg, var(--color-gold), var(--color-g-500));
  border-radius: 0 2px 2px 0;
}
[dir="rtl"] .card-header::before {
  border-radius: 2px 0 0 2px;
}
.card-header h3 {
  font-size: 15px;
  color: var(--color-parchment-800);
  font-weight: 600;
}
[dir="rtl"] .card-header h3 {
  font-family: var(--font-ar);
  font-size: 17px;
}

.header-actions {
  display: flex;
  gap: 8px;
}

/* ── Table ── */
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
  background: var(--color-parchment-50);
}
thead th {
  padding: 12px 14px;
  text-align: start;
  font-size: 12px;
  letter-spacing: 1.2px;
  text-transform: uppercase;
  color: var(--color-parchment-400);
  font-weight: 500;
  white-space: nowrap;
  border-bottom: 1px solid var(--color-parchment-100);
}

/* ── Empty state ── */
.tracker-empty {
  text-align: center;
  padding: 48px 20px;
  color: var(--color-parchment-400);
}
.te-icon {
  margin-bottom: 14px;
  color: var(--color-parchment-300);
}
.tracker-empty h4 {
  font-size: 16px;
  color: var(--color-parchment-600);
  margin-bottom: 8px;
}
.tracker-empty p {
  font-size: 13px;
  line-height: 1.6;
}

/* ── Add row bar ── */
.add-row-bar {
  padding: 14px 20px;
  border-top: 1px solid var(--color-parchment-100);
  display: flex;
  align-items: center;
  gap: 10px;
  flex-wrap: wrap;
}

.row-count-badge {
  margin-inline-start: auto;
  font-size: 12px;
  color: var(--color-parchment-400);
  background: var(--color-parchment-100);
  padding: 3px 10px;
  border-radius: var(--radius-pill);
}

/* ── Card footer ── */
.card-footer {
  padding: 16px 24px;
  background: var(--color-parchment-50);
  border-top: 1px solid var(--color-parchment-100);
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.footer-label {
  font-size: 12px;
  color: var(--color-parchment-400);
  margin-bottom: 2px;
}

.footer-value {
  font-family: var(--font-mono);
  font-size: 15px;
  font-weight: 700;
}
.footer-value-green {
  color: var(--color-g-600);
}
.footer-value-red {
  color: var(--color-red);
}

.footer-end {
  text-align: end;
}

/* ── Buttons ── */
.btn {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 12px 22px;
  border-radius: var(--radius-sm);
  border: none;
  font-family: inherit;
  font-size: 13px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
  letter-spacing: 0.3px;
  white-space: nowrap;
}

.btn-primary {
  background: linear-gradient(135deg, var(--color-g-600), var(--color-g-700));
  color: #fff;
  border-radius: var(--radius-pill);
}
.btn-primary:hover {
  background: linear-gradient(135deg, var(--color-g-500), var(--color-g-600));
  transform: translateY(-1px);
}

.btn-outline {
  background: transparent;
  color: var(--color-parchment-600);
  border: 1.5px solid var(--color-parchment-200);
}
.btn-outline:hover {
  border-color: var(--color-g-400);
  color: var(--color-g-600);
  background: var(--color-g-50);
}

.btn-sm {
  padding: 7px 14px;
  font-size: 13px;
}

.btn-destructive {
  color: var(--color-red);
  border-color: rgba(220, 38, 38, 0.25);
}
.btn-destructive:hover {
  background: var(--color-red-light);
  border-color: var(--color-red);
}

@media (prefers-color-scheme: dark) {
  .card {
    background: var(--color-parchment-50);
  }
}
</style>

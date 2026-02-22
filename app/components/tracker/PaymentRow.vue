<script setup lang="ts">
import type { Payment } from '~~/shared/types'
import { CATEGORIES } from '~/utils/constants'

defineProps<{
  payment: Payment
  index: number
}>()

const emit = defineEmits<{
  'update:field': [id: string, field: keyof Payment, value: string | number]
  'delete': [id: string]
}>()

const { t } = useI18n()

function onFieldInput(id: string, field: keyof Payment, event: Event) {
  const target = event.target as HTMLInputElement | HTMLSelectElement
  if (field === 'amount') {
    emit('update:field', id, field, (target as HTMLInputElement).valueAsNumber || 0)
  } else {
    emit('update:field', id, field, target.value)
  }
}
</script>

<template>
  <tr class="payment-row">
    <td class="td-num">{{ index + 1 }}</td>
    <td>
      <input
        type="date"
        :value="payment.date"
        class="td-input"
        @input="onFieldInput(payment.id, 'date', $event)"
      />
    </td>
    <td>
      <input
        type="text"
        :value="payment.recipient"
        :placeholder="t('tracker.recipient')"
        class="td-input"
        @input="onFieldInput(payment.id, 'recipient', $event)"
      />
    </td>
    <td>
      <select
        :value="payment.category"
        class="td-input"
        @change="onFieldInput(payment.id, 'category', $event)"
      >
        <option value="" disabled>{{ t('tracker.category') }}</option>
        <option
          v-for="cat in CATEGORIES"
          :key="cat"
          :value="cat"
        >
          {{ t(cat) }}
        </option>
      </select>
    </td>
    <td>
      <input
        type="number"
        :value="payment.amount || undefined"
        placeholder="0"
        min="0"
        step="0.01"
        class="td-input td-amount"
        @input="onFieldInput(payment.id, 'amount', $event)"
      />
    </td>
    <td>
      <input
        type="text"
        :value="payment.notes"
        :placeholder="t('tracker.notes')"
        class="td-input"
        @input="onFieldInput(payment.id, 'notes', $event)"
      />
    </td>
    <td>
      <button
        class="btn-del-row"
        :aria-label="'Delete row ' + (index + 1)"
        @click="emit('delete', payment.id)"
      >
        <Icon name="lucide:trash-2" size="16" />
      </button>
    </td>
  </tr>
</template>

<style scoped>
.payment-row {
  border-bottom: 1px solid var(--color-parchment-100);
  transition: background 0.15s;
}
.payment-row:hover {
  background: var(--color-gold-pale);
}

td {
  padding: 8px 14px;
  vertical-align: middle;
}

.td-num {
  color: var(--color-parchment-400);
  font-size: var(--text-xs);
  text-align: center;
  width: 40px;
}

.td-input {
  border: 1px solid transparent;
  border-radius: var(--radius-xs);
  padding: 10px 8px;
  min-height: 44px;
  background: transparent;
  font-size: var(--text-sm);
  min-width: 80px;
  font-family: var(--font-mono);
  color: var(--color-parchment-800);
  outline: none;
  width: 100%;
  transition: background 0.15s, border-color 0.15s, box-shadow 0.15s;
}
[dir="rtl"] .td-input {
  font-family: var(--font-ar);
}
.td-input:focus {
  background: white;
  border-color: var(--color-g-400);
  box-shadow: 0 0 0 2px rgba(0, 137, 74, 0.1);
}

.td-amount {
  text-align: end;
  font-weight: var(--weight-bold);
  color: var(--color-g-600);
}

.btn-del-row {
  width: 44px;
  height: 44px;
  border-radius: var(--radius-xs);
  border: none;
  background: transparent;
  color: var(--color-parchment-400);
  cursor: pointer;
  font-size: var(--text-md);
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background 0.15s, color 0.15s;
}
.btn-del-row:hover {
  background: var(--color-red-light);
  color: var(--color-red);
}

@media (prefers-color-scheme: dark) {
  .td-input:focus {
    background: var(--color-parchment-100);
  }
}
</style>

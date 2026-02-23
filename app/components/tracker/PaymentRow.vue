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

const categoryOptions = CATEGORIES.map(cat => ({
  label: t(cat),
  value: cat,
}))

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
      <UInput
        type="date"
        :model-value="payment.date"
        size="sm"
        @update:model-value="emit('update:field', payment.id, 'date', String($event))"
      />
    </td>
    <td>
      <UInput
        :model-value="payment.recipient"
        :placeholder="t('tracker.recipient')"
        size="sm"
        @update:model-value="emit('update:field', payment.id, 'recipient', String($event))"
      />
    </td>
    <td>
      <USelect
        :model-value="payment.category"
        :items="categoryOptions"
        value-key="value"
        :placeholder="t('tracker.category')"
        size="sm"
        @update:model-value="emit('update:field', payment.id, 'category', String($event))"
      />
    </td>
    <td>
      <UInput
        type="number"
        :model-value="payment.amount || undefined"
        placeholder="0"
        :min="0"
        step="0.01"
        size="sm"
        class="font-mono text-end"
        @update:model-value="emit('update:field', payment.id, 'amount', Number($event) || 0)"
      />
    </td>
    <td>
      <UInput
        :model-value="payment.notes"
        :placeholder="t('tracker.notes')"
        size="sm"
        @update:model-value="emit('update:field', payment.id, 'notes', String($event))"
      />
    </td>
    <td>
      <UButton
        variant="ghost"
        color="error"
        icon="i-lucide-trash-2"
        size="xs"
        :aria-label="'Delete row ' + (index + 1)"
        @click="emit('delete', payment.id)"
      />
    </td>
  </tr>
</template>

<style scoped>
.payment-row {
  border-bottom: 1px solid var(--color-stone-200);
  transition: background 0.15s;
}
.payment-row:hover {
  background: var(--color-gold-50);
}

td {
  padding: 6px 10px;
  vertical-align: middle;
}

.td-num {
  color: var(--color-stone-400);
  font-size: var(--text-xs);
  text-align: center;
  width: 40px;
}
</style>

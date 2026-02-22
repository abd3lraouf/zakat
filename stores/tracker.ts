import { defineStore } from 'pinia'
import type { Payment } from '~~/shared/types'
import { safeNum } from '~/utils/format'
import { useCalculatorStore } from './calculator'

export const useTrackerStore = defineStore('tracker', {
  state: () => ({
    payments: [] as Payment[],
  }),

  getters: {
    totalPaid(state): number {
      return state.payments.reduce((sum, p) => sum + safeNum(p.amount), 0)
    },

    remaining(): number {
      const calc = useCalculatorStore()
      return Math.max(calc.zakatDue - this.totalPaid, 0)
    },

    progress(): number {
      const calc = useCalculatorStore()
      if (calc.zakatDue <= 0) return 0
      return Math.min((this.totalPaid / calc.zakatDue) * 100, 100)
    },

    isComplete(): boolean {
      const calc = useCalculatorStore()
      return calc.zakatDue > 0 && this.totalPaid >= calc.zakatDue
    },
  },

  actions: {
    addPayment(count: number = 1) {
      for (let i = 0; i < count; i++) {
        this.payments.push({
          id: `pay_${Date.now()}_${Math.random().toString(36).slice(2)}`,
          date: '',
          recipient: '',
          category: '',
          amount: 0,
          notes: '',
        })
      }
    },

    deletePayment(id: string) {
      this.payments = this.payments.filter(p => p.id !== id)
    },

    updatePayment(id: string, field: keyof Payment, value: string | number) {
      const pay = this.payments.find(p => p.id === id)
      if (!pay) return
      if (field === 'amount') {
        pay.amount = safeNum(value)
      } else if (field !== 'id') {
        ;(pay as any)[field] = value
      }
    },

    clearAll() {
      this.payments = []
    },
  },

  persist: {
    key: 'zakat_tracker',
  },
})

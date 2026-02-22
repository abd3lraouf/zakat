import { describe, it, expect, beforeEach } from 'vitest'
import { setActivePinia, createPinia } from 'pinia'
import { useTrackerStore } from '../../stores/tracker'
import { useCalculatorStore } from '../../stores/calculator'

describe('tracker store', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
  })

  it('starts with no payments', () => {
    const store = useTrackerStore()
    expect(store.payments).toEqual([])
  })

  it('addPayment creates a payment with defaults', () => {
    const store = useTrackerStore()
    store.addPayment()
    expect(store.payments).toHaveLength(1)
    expect(store.payments[0].amount).toBe(0)
    expect(store.payments[0].date).toBe('')
    expect(store.payments[0].id).toBeTruthy()
  })

  it('addPayment with count creates multiple', () => {
    const store = useTrackerStore()
    store.addPayment(5)
    expect(store.payments).toHaveLength(5)
  })

  it('deletePayment removes by id', () => {
    const store = useTrackerStore()
    store.addPayment()
    const id = store.payments[0].id
    store.deletePayment(id)
    expect(store.payments).toHaveLength(0)
  })

  it('updatePayment changes field value', () => {
    const store = useTrackerStore()
    store.addPayment()
    const id = store.payments[0].id
    store.updatePayment(id, 'amount', 500)
    expect(store.payments[0].amount).toBe(500)
  })

  it('updatePayment converts amount to number', () => {
    const store = useTrackerStore()
    store.addPayment()
    const id = store.payments[0].id
    store.updatePayment(id, 'amount', '123.45' as any)
    expect(store.payments[0].amount).toBe(123.45)
  })

  it('totalPaid sums payment amounts', () => {
    const store = useTrackerStore()
    store.addPayment(2)
    store.updatePayment(store.payments[0].id, 'amount', 100)
    store.updatePayment(store.payments[1].id, 'amount', 200)
    expect(store.totalPaid).toBe(300)
  })

  it('clearAll removes all payments', () => {
    const store = useTrackerStore()
    store.addPayment(3)
    store.clearAll()
    expect(store.payments).toHaveLength(0)
  })

  it('remaining is zakatDue - totalPaid (min 0)', () => {
    const calc = useCalculatorStore()
    calc.assets.cash = 100000 // zakatDue = 2500
    const store = useTrackerStore()
    store.addPayment()
    store.updatePayment(store.payments[0].id, 'amount', 1000)
    expect(store.remaining).toBe(1500)
  })

  it('remaining does not go negative', () => {
    const calc = useCalculatorStore()
    calc.assets.cash = 100000 // zakatDue = 2500
    const store = useTrackerStore()
    store.addPayment()
    store.updatePayment(store.payments[0].id, 'amount', 5000)
    expect(store.remaining).toBe(0)
  })

  it('progress caps at 100', () => {
    const calc = useCalculatorStore()
    calc.assets.cash = 100000
    const store = useTrackerStore()
    store.addPayment()
    store.updatePayment(store.payments[0].id, 'amount', 99999)
    expect(store.progress).toBe(100)
  })

  it('isComplete when paid >= due and due > 0', () => {
    const calc = useCalculatorStore()
    calc.assets.cash = 100000
    const store = useTrackerStore()
    store.addPayment()
    store.updatePayment(store.payments[0].id, 'amount', 2500)
    expect(store.isComplete).toBe(true)
  })
})

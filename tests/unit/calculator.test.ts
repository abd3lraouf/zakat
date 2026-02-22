import { describe, it, expect, beforeEach } from 'vitest'
import { setActivePinia, createPinia } from 'pinia'
import { useCalculatorStore } from '../../stores/calculator'

describe('calculator store', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
  })

  it('starts with default prices', () => {
    const store = useCalculatorStore()
    expect(store.prices.gold24PerGram).toBe(4625)
    expect(store.prices.silverPerGram).toBe(48.50)
  })

  it('grossAssets is 0 when all assets are 0', () => {
    const store = useCalculatorStore()
    expect(store.grossAssets).toBe(0)
  })

  it('calculates gold24 value correctly', () => {
    const store = useCalculatorStore()
    store.assets.gold24g = 10
    // 10g * 4625 EGP/g = 46250
    expect(store.grossAssets).toBe(46250)
  })

  it('adjusts gold21 by karat ratio', () => {
    const store = useCalculatorStore()
    store.assets.gold21g = 10
    // 10g * 4625 * (21/24) = 40468.75
    expect(store.grossAssets).toBeCloseTo(40468.75)
  })

  it('adjusts gold18 by karat ratio', () => {
    const store = useCalculatorStore()
    store.assets.gold18g = 10
    // 10g * 4625 * (18/24) = 34687.50
    expect(store.grossAssets).toBeCloseTo(34687.50)
  })

  it('calculates silver value', () => {
    const store = useCalculatorStore()
    store.assets.silverG = 100
    // 100g * 48.50 = 4850
    expect(store.grossAssets).toBe(4850)
  })

  it('sums cash assets directly', () => {
    const store = useCalculatorStore()
    store.assets.cash = 5000
    store.assets.inventory = 3000
    expect(store.grossAssets).toBe(8000)
  })

  it('includes custom assets in gross', () => {
    const store = useCalculatorStore()
    store.assets.cash = 1000
    store.customAssets = [{ id: 'c1', label: 'Test', amount: 500 }]
    expect(store.grossAssets).toBe(1500)
  })

  it('calculates total deductions', () => {
    const store = useCalculatorStore()
    store.deductions.immediateDebts = 2000
    store.deductions.otherLiabilities = 1000
    expect(store.totalDeductions).toBe(3000)
  })

  it('netWealth = grossAssets - deductions (min 0)', () => {
    const store = useCalculatorStore()
    store.assets.cash = 5000
    store.deductions.immediateDebts = 2000
    expect(store.netWealth).toBe(3000)
  })

  it('netWealth does not go negative', () => {
    const store = useCalculatorStore()
    store.assets.cash = 1000
    store.deductions.immediateDebts = 5000
    expect(store.netWealth).toBe(0)
  })

  it('nisab uses minimum of gold and silver nisab', () => {
    const store = useCalculatorStore()
    // Gold nisab: 87.48 * 4625 = 404,595
    // Silver nisab: 612.36 * 48.50 = 29,699.46
    // Min = silver nisab
    expect(store.nisabThreshold).toBeCloseTo(29699.46)
  })

  it('nisabMet is true when netWealth >= nisab', () => {
    const store = useCalculatorStore()
    store.assets.cash = 30000 // above silver nisab
    expect(store.nisabMet).toBe(true)
  })

  it('nisabMet is false when netWealth < nisab', () => {
    const store = useCalculatorStore()
    store.assets.cash = 1000 // below nisab
    expect(store.nisabMet).toBe(false)
  })

  it('zakatDue is 2.5% of netWealth when nisab met', () => {
    const store = useCalculatorStore()
    store.assets.cash = 100000
    expect(store.zakatDue).toBe(100000 * 0.025)
  })

  it('zakatDue is 0 when nisab not met', () => {
    const store = useCalculatorStore()
    store.assets.cash = 100
    expect(store.zakatDue).toBe(0)
  })

  it('responds to price changes', () => {
    const store = useCalculatorStore()
    store.assets.gold24g = 10
    const before = store.grossAssets
    store.prices.gold24PerGram = 5000
    expect(store.grossAssets).not.toBe(before)
    expect(store.grossAssets).toBe(50000)
  })

  it('reset() restores defaults', () => {
    const store = useCalculatorStore()
    store.assets.cash = 99999
    store.reset()
    expect(store.assets.cash).toBe(0)
    expect(store.prices.gold24PerGram).toBe(4625)
  })
})

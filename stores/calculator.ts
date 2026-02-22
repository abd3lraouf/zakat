import { defineStore } from 'pinia'
import type { Prices, Assets, Deductions, CustomAsset } from '~~/shared/types'
import { NISAB_GOLD_GRAMS, NISAB_SILVER_GRAMS, ZAKAT_RATE, DEFAULT_PRICES } from '~/utils/constants'

export const useCalculatorStore = defineStore('calculator', {
  state: () => ({
    prices: { ...DEFAULT_PRICES } as Prices,
    assets: {
      gold24g: 0, gold21g: 0, gold18g: 0, silverG: 0,
      cash: 0, inventory: 0, receivables: 0, investments: 0, otherAssets: 0,
    } as Assets,
    deductions: {
      immediateDebts: 0,
      otherLiabilities: 0,
    } as Deductions,
    customAssets: [] as CustomAsset[],
  }),

  getters: {
    grossAssets(state): number {
      const p = state.prices
      const a = state.assets
      const assetTotal =
        a.gold24g * p.gold24PerGram +
        a.gold21g * p.gold24PerGram * (21 / 24) +
        a.gold18g * p.gold24PerGram * (18 / 24) +
        a.silverG * p.silverPerGram +
        a.cash + a.inventory + a.receivables + a.investments + a.otherAssets
      const customTotal = state.customAssets.reduce((s, c) => s + (Number.isFinite(c.amount) ? c.amount : 0), 0)
      return assetTotal + customTotal
    },

    totalDeductions(state): number {
      return state.deductions.immediateDebts + state.deductions.otherLiabilities
    },

    netWealth(): number {
      return Math.max(this.grossAssets - this.totalDeductions, 0)
    },

    nisabGold(state): number {
      return NISAB_GOLD_GRAMS * state.prices.gold24PerGram
    },

    nisabSilver(state): number {
      return NISAB_SILVER_GRAMS * state.prices.silverPerGram
    },

    nisabThreshold(): number {
      return Math.min(this.nisabGold, this.nisabSilver)
    },

    nisabMet(): boolean {
      return this.netWealth >= this.nisabThreshold
    },

    zakatDue(): number {
      return this.nisabMet ? this.netWealth * ZAKAT_RATE : 0
    },
  },

  actions: {
    reset() {
      this.prices = { ...DEFAULT_PRICES }
      this.assets = {
        gold24g: 0, gold21g: 0, gold18g: 0, silverG: 0,
        cash: 0, inventory: 0, receivables: 0, investments: 0, otherAssets: 0,
      }
      this.deductions = { immediateDebts: 0, otherLiabilities: 0 }
      this.customAssets = []
    },
  },

  persist: {
    key: 'zakat_calculator',
  },
})

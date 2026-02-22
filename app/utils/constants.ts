import type { AssetDef, Prices } from '~~/shared/types'

export const NISAB_GOLD_GRAMS = 87.48
export const NISAB_SILVER_GRAMS = 612.36
export const ZAKAT_RATE = 0.025
export const DEBOUNCE_SAVE = 500
export const DEBOUNCE_SYNC = 3000

export const DEFAULT_PRICES: Prices = {
  gold24PerGram: 4625,
  silverPerGram: 48.50,
}

export const ASSET_DEFS_GOLD: AssetDef[] = [
  { id: 'gold24g', key: 'calc.gold24', unit: 'g', stateKey: 'gold24g', formula: (v, p) => v * p.gold24PerGram },
  { id: 'gold21g', key: 'calc.gold21', unit: 'g', stateKey: 'gold21g', formula: (v, p) => v * p.gold24PerGram * (21 / 24) },
  { id: 'gold18g', key: 'calc.gold18', unit: 'g', stateKey: 'gold18g', formula: (v, p) => v * p.gold24PerGram * (18 / 24) },
  { id: 'silverg', key: 'calc.silver', unit: 'g', stateKey: 'silverG', formula: (v, p) => v * p.silverPerGram },
]

export const ASSET_DEFS_OTHER: AssetDef[] = [
  { id: 'cash', key: 'calc.cash', unit: 'EGP', stateKey: 'cash', formula: v => v },
  { id: 'inventory', key: 'calc.inventory', unit: 'EGP', stateKey: 'inventory', formula: v => v },
  { id: 'receivables', key: 'calc.receivables', unit: 'EGP', stateKey: 'receivables', formula: v => v },
  { id: 'investments', key: 'calc.investments', unit: 'EGP', stateKey: 'investments', formula: v => v },
  { id: 'otherassets', key: 'calc.other', unit: 'EGP', stateKey: 'otherAssets', formula: v => v },
]

export const DEDUCTION_DEFS: AssetDef[] = [
  { id: 'immediatedebts', key: 'calc.debts', unit: 'EGP', stateKey: 'immediateDebts', formula: v => v },
  { id: 'otherliabilities', key: 'calc.liabilities', unit: 'EGP', stateKey: 'otherLiabilities', formula: v => v },
]

export const CATEGORIES = [
  'cat.faqir', 'cat.miskin', 'cat.amil', 'cat.muallaf',
  'cat.gharim', 'cat.sabilillah', 'cat.ibnsabil', 'cat.org', 'cat.other',
] as const

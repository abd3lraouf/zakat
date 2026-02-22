export interface Prices {
  gold24PerGram: number
  silverPerGram: number
}

export interface Assets {
  gold24g: number
  gold21g: number
  gold18g: number
  silverG: number
  cash: number
  inventory: number
  receivables: number
  investments: number
  otherAssets: number
}

export interface Deductions {
  immediateDebts: number
  otherLiabilities: number
}

export interface CustomAsset {
  id: string
  label: string
  amount: number
}

export interface Payment {
  id: string
  date: string
  recipient: string
  category: string
  amount: number
  notes: string
}

export interface GoogleUser {
  name?: string
  email?: string
  picture?: string
}

export type AssetKey = keyof Assets
export type DeductionKey = keyof Deductions
export type PriceKey = keyof Prices

export interface AssetDef {
  id: string
  key: string       // i18n translation key
  unit: 'g' | 'EGP'
  stateKey: AssetKey | DeductionKey
  formula: (value: number, prices: Prices) => number
}

export type SyncStatus = 'synced' | 'syncing' | 'error' | 'offline'

import { getCurrency } from '~/utils/currencies'

export function safeNum(val: unknown): number {
  const n = Number(val)
  return Number.isFinite(n) ? n : 0
}

export function escapeHtml(str: string | null | undefined): string {
  return (str || '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;')
}

export function fmtCurrency(val: unknown, lang: string = 'en', currencyCode: string = 'EGP'): string {
  const n = safeNum(val)
  const info = getCurrency(currencyCode)
  if (lang === 'ar') {
    return info.symbol + ' ' + n.toLocaleString('ar', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
  }
  return info.code + ' ' + n.toLocaleString('en', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
}

export function fmtUnit(unit: 'g' | 'currency', lang: string, currencyCode: string): string {
  if (unit === 'g') {
    return lang === 'ar' ? 'جم' : 'g'
  }
  const info = getCurrency(currencyCode)
  return lang === 'ar' ? info.symbol : info.code
}

export function fmtPct(n: number, lang: string = 'en'): string {
  if (lang === 'ar') {
    return n.toFixed(1) + '%'
  }
  return n.toFixed(1) + '%'
}

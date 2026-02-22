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

export function fmtEGP(val: unknown, lang: string = 'en'): string {
  const n = safeNum(val)
  if (lang === 'ar') {
    return 'ج.م ' + n.toLocaleString('ar-EG', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
  }
  return 'EGP ' + n.toLocaleString('en-EG', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
}

export function fmtPct(n: number, lang: string = 'en'): string {
  if (lang === 'ar') {
    return n.toFixed(1) + '%'
  }
  return n.toFixed(1) + '%'
}

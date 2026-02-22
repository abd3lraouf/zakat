import { describe, it, expect } from 'vitest'
import { safeNum, escapeHtml, fmtEGP, fmtPct } from '~/utils/format'

describe('safeNum', () => {
  it('returns number for valid input', () => {
    expect(safeNum(42)).toBe(42)
    expect(safeNum('3.14')).toBe(3.14)
    expect(safeNum(0)).toBe(0)
  })
  it('returns 0 for invalid input', () => {
    expect(safeNum(NaN)).toBe(0)
    expect(safeNum(Infinity)).toBe(0)
    expect(safeNum(-Infinity)).toBe(0)
    expect(safeNum(null)).toBe(0)
    expect(safeNum(undefined)).toBe(0)
    expect(safeNum('abc')).toBe(0)
    expect(safeNum('')).toBe(0)
  })
})

describe('escapeHtml', () => {
  it('escapes all dangerous characters', () => {
    expect(escapeHtml('<script>alert("xss")</script>')).toBe('&lt;script&gt;alert(&quot;xss&quot;)&lt;/script&gt;')
    expect(escapeHtml("it's")).toBe('it&#39;s')
    expect(escapeHtml('a & b')).toBe('a &amp; b')
  })
  it('handles empty/null input', () => {
    expect(escapeHtml('')).toBe('')
    expect(escapeHtml(null as any)).toBe('')
    expect(escapeHtml(undefined as any)).toBe('')
  })
})

describe('fmtEGP', () => {
  it('formats currency in English', () => {
    const result = fmtEGP(1234.56, 'en')
    expect(result).toContain('EGP')
    expect(result).toContain('1')
    expect(result).toContain('234')
  })
  it('formats currency in Arabic', () => {
    const result = fmtEGP(1234.56, 'ar')
    expect(result).toContain('ج.م')
  })
  it('handles zero', () => {
    expect(fmtEGP(0, 'en')).toContain('0.00')
  })
})

describe('fmtPct', () => {
  it('formats percentage in English', () => {
    expect(fmtPct(50.5, 'en')).toBe('50.5%')
  })
  it('formats percentage in Arabic', () => {
    const result = fmtPct(50.5, 'ar')
    expect(result).toContain('%')
  })
})

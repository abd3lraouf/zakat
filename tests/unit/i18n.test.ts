import { describe, it, expect } from 'vitest'
import en from '../../locales/en.json'
import ar from '../../locales/ar.json'

describe('i18n translations', () => {
  it('EN and AR have the same keys', () => {
    const enKeys = Object.keys(en).sort()
    const arKeys = Object.keys(ar).sort()
    expect(enKeys).toEqual(arKeys)
  })

  it('no empty values in EN', () => {
    for (const [key, val] of Object.entries(en)) {
      expect(val, `EN key "${key}" is empty`).not.toBe('')
    }
  })

  it('no empty values in AR', () => {
    for (const [key, val] of Object.entries(ar)) {
      expect(val, `AR key "${key}" is empty`).not.toBe('')
    }
  })

  it('all category keys exist', () => {
    const cats = ['cat.faqir', 'cat.miskin', 'cat.amil', 'cat.muallaf', 'cat.gharim', 'cat.sabilillah', 'cat.ibnsabil', 'cat.org', 'cat.other']
    for (const key of cats) {
      expect(en).toHaveProperty(key)
      expect(ar).toHaveProperty(key)
    }
  })
})

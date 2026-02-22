import { describe, it, expect, beforeAll } from 'vitest';
import { createApp } from './helpers.js';

let win, app;

beforeAll(() => {
  ({ window: win, app } = createApp());
});

// ───────────────────────── safeNum ─────────────────────────
describe('safeNum', () => {
  it('converts valid numbers', () => {
    expect(win.safeNum(42)).toBe(42);
    expect(win.safeNum(3.14)).toBe(3.14);
    expect(win.safeNum(0)).toBe(0);
    expect(win.safeNum(-5)).toBe(-5);
  });

  it('converts numeric strings', () => {
    expect(win.safeNum('42')).toBe(42);
    expect(win.safeNum('3.14')).toBe(3.14);
    expect(win.safeNum('0')).toBe(0);
    expect(win.safeNum('-10')).toBe(-10);
  });

  it('returns 0 for NaN', () => {
    expect(win.safeNum(NaN)).toBe(0);
  });

  it('returns 0 for Infinity', () => {
    expect(win.safeNum(Infinity)).toBe(0);
    expect(win.safeNum(-Infinity)).toBe(0);
  });

  it('returns 0 for null/undefined', () => {
    expect(win.safeNum(null)).toBe(0);
    expect(win.safeNum(undefined)).toBe(0);
  });

  it('returns 0 for non-numeric strings', () => {
    expect(win.safeNum('')).toBe(0);
    expect(win.safeNum('abc')).toBe(0);
    expect(win.safeNum('12abc')).toBe(0);
  });

  it('returns 0 for objects', () => {
    expect(win.safeNum({})).toBe(0);
    expect(win.safeNum([])).toBe(0);
  });
});

// ───────────────────── escapeHtml ──────────────────────────
describe('escapeHtml', () => {
  it('escapes < and >', () => {
    expect(win.escapeHtml('<script>alert(1)</script>')).toBe(
      '&lt;script&gt;alert(1)&lt;/script&gt;'
    );
  });

  it('escapes ampersands', () => {
    expect(win.escapeHtml('a & b')).toBe('a &amp; b');
  });

  it('escapes double quotes', () => {
    expect(win.escapeHtml('"hello"')).toBe('&quot;hello&quot;');
  });

  it('escapes single quotes', () => {
    expect(win.escapeHtml("it's")).toBe('it&#39;s');
  });

  it('handles all special chars together', () => {
    expect(win.escapeHtml(`<a href="x" onclick='y'>&`)).toBe(
      '&lt;a href=&quot;x&quot; onclick=&#39;y&#39;&gt;&amp;'
    );
  });

  it('returns empty string for null/undefined', () => {
    expect(win.escapeHtml(null)).toBe('');
    expect(win.escapeHtml(undefined)).toBe('');
    expect(win.escapeHtml('')).toBe('');
  });

  it('preserves safe strings', () => {
    expect(win.escapeHtml('Hello World 123')).toBe('Hello World 123');
  });
});

// ────────────────────── fmtEGP ─────────────────────────────
describe('fmtEGP', () => {
  it('formats positive numbers in English', () => {
    app.i18n.lang = 'en';
    expect(win.fmtEGP(1234.56)).toBe('EGP 1,234.56');
  });

  it('formats zero in English', () => {
    app.i18n.lang = 'en';
    expect(win.fmtEGP(0)).toBe('EGP 0.00');
  });

  it('formats large numbers in English', () => {
    app.i18n.lang = 'en';
    const result = win.fmtEGP(1234567.89);
    expect(result).toContain('EGP');
    expect(result).toContain('1,234,567.89');
  });

  it('formats in Arabic with ج.م prefix', () => {
    app.i18n.lang = 'ar';
    const result = win.fmtEGP(1234.56);
    expect(result).toContain('ج.م');
    // Reset
    app.i18n.lang = 'en';
  });

  it('handles invalid input gracefully (via safeNum)', () => {
    app.i18n.lang = 'en';
    expect(win.fmtEGP(NaN)).toBe('EGP 0.00');
    expect(win.fmtEGP(null)).toBe('EGP 0.00');
    expect(win.fmtEGP(undefined)).toBe('EGP 0.00');
    expect(win.fmtEGP('abc')).toBe('EGP 0.00');
    expect(win.fmtEGP(Infinity)).toBe('EGP 0.00');
  });
});

// ────────────────────── fmtPct ─────────────────────────────
describe('fmtPct', () => {
  it('formats percentage in English', () => {
    app.i18n.lang = 'en';
    expect(win.fmtPct(50)).toBe('50.0%');
    expect(win.fmtPct(99.9)).toBe('99.9%');
    expect(win.fmtPct(0)).toBe('0.0%');
  });

  it('formats percentage in Arabic', () => {
    app.i18n.lang = 'ar';
    const result = win.fmtPct(50);
    expect(result).toContain('%');
    app.i18n.lang = 'en';
  });
});

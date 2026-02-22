import { describe, it, expect, beforeEach } from 'vitest';
import { createApp, resetState } from './helpers.js';

let win, app;

beforeEach(() => {
  ({ window: win, app } = createApp());
});

// ──────────────── CONFIG ───────────────────────────────────
describe('CONFIG constants', () => {
  it('has correct Zakat rate', () => {
    expect(app.CONFIG.ZAKAT_RATE).toBe(0.025);
  });

  it('has correct Nisab gold grams', () => {
    expect(app.CONFIG.NISAB_GOLD_GRAMS).toBe(87.48);
  });

  it('has correct Nisab silver grams', () => {
    expect(app.CONFIG.NISAB_SILVER_GRAMS).toBe(612.36);
  });

  it('has valid debounce timings', () => {
    expect(app.CONFIG.DEBOUNCE_SAVE).toBeGreaterThan(0);
    expect(app.CONFIG.DEBOUNCE_SYNC).toBeGreaterThan(0);
  });
});

// ──────────────── calcZakat ────────────────────────────────
describe('calcZakat', () => {
  it('zero assets = zero zakat', () => {
    win.calcZakat();
    expect(app.state.zakatDue).toBe(0);
    expect(app.state.nisabMet).toBe(false);
  });

  it('below nisab = zero zakat', () => {
    // Nisab (silver) = 612.36g × 48.50 = 29,699.46
    // Set cash to 10,000 (below nisab)
    app.state.calculator.assets.cash = 10000;
    win.calcZakat();
    expect(app.state.zakatDue).toBe(0);
    expect(app.state.nisabMet).toBe(false);
  });

  it('above nisab = 2.5% of net wealth', () => {
    // Set cash well above nisab
    app.state.calculator.assets.cash = 100000;
    win.calcZakat();
    expect(app.state.nisabMet).toBe(true);
    expect(app.state.zakatDue).toBe(100000 * 0.025); // 2500
  });

  it('deductions reduce net wealth', () => {
    app.state.calculator.assets.cash = 100000;
    app.state.calculator.deductions.immediateDebts = 20000;
    win.calcZakat();
    expect(app.state.zakatDue).toBe(80000 * 0.025); // 2000
  });

  it('deductions can bring below nisab', () => {
    app.state.calculator.assets.cash = 30000;
    app.state.calculator.deductions.immediateDebts = 29000;
    win.calcZakat();
    // Net = 1000, below nisab
    expect(app.state.zakatDue).toBe(0);
    expect(app.state.nisabMet).toBe(false);
  });

  it('net wealth cannot go negative', () => {
    app.state.calculator.assets.cash = 1000;
    app.state.calculator.deductions.immediateDebts = 5000;
    win.calcZakat();
    // Net is capped at 0
    expect(app.state.zakatDue).toBe(0);
  });

  it('gold assets calculated correctly with karat adjustment', () => {
    // 100g of 24K gold at 4625/g = 462,500
    app.state.calculator.assets.gold24g = 100;
    win.calcZakat();
    expect(app.state.zakatDue).toBe(462500 * 0.025);
  });

  it('21K gold adjusted by 21/24 factor', () => {
    app.state.calculator.assets.gold21g = 100;
    const expected = 100 * 4625 * (21 / 24);
    win.calcZakat();
    expect(app.state.zakatDue).toBeCloseTo(expected * 0.025, 2);
  });

  it('18K gold adjusted by 18/24 factor', () => {
    app.state.calculator.assets.gold18g = 100;
    const expected = 100 * 4625 * (18 / 24);
    win.calcZakat();
    expect(app.state.zakatDue).toBeCloseTo(expected * 0.025, 2);
  });

  it('silver assets calculated correctly', () => {
    app.state.calculator.assets.silverG = 1000;
    const expected = 1000 * 48.50;
    win.calcZakat();
    expect(app.state.zakatDue).toBeCloseTo(expected * 0.025, 2);
  });

  it('custom assets added to total', () => {
    app.state.calculator.assets.cash = 50000;
    app.state.calculator.customAssets = [
      { id: 'c1', label: 'Crypto', amount: 50000 },
    ];
    win.calcZakat();
    // Total = 100,000
    expect(app.state.zakatDue).toBe(100000 * 0.025);
  });

  it('multiple asset types sum correctly', () => {
    app.state.calculator.assets.cash = 30000;
    app.state.calculator.assets.investments = 40000;
    app.state.calculator.assets.receivables = 30000;
    win.calcZakat();
    // Total = 100,000
    expect(app.state.zakatDue).toBe(100000 * 0.025);
  });

  it('nisab uses minimum of gold and silver nisab', () => {
    // Gold nisab = 87.48g × 4625 = 404,595
    // Silver nisab = 612.36g × 48.50 = 29,699.46
    // Minimum = silver nisab
    const silverNisab = app.CONFIG.NISAB_SILVER_GRAMS * app.state.calculator.prices.silverPerGram;

    // Just above silver nisab
    app.state.calculator.assets.cash = Math.ceil(silverNisab) + 1;
    win.calcZakat();
    expect(app.state.nisabMet).toBe(true);
  });

  it('updates DOM summary panel', () => {
    app.state.calculator.assets.cash = 100000;
    win.calcZakat();
    const zakatDisplay = win.document.getElementById('zakat-due-display');
    expect(zakatDisplay.textContent).toContain('2,500');
  });
});

// ──────────── Price changes affect calculations ────────────
describe('Price sensitivity', () => {
  it('higher gold price increases zakat', () => {
    app.state.calculator.assets.gold24g = 100;
    app.state.calculator.prices.gold24PerGram = 4625;
    win.calcZakat();
    const zakat1 = app.state.zakatDue;

    app.state.calculator.prices.gold24PerGram = 5000;
    win.calcZakat();
    const zakat2 = app.state.zakatDue;

    expect(zakat2).toBeGreaterThan(zakat1);
  });

  it('zero price gives zero value for gold', () => {
    app.state.calculator.assets.gold24g = 100;
    app.state.calculator.prices.gold24PerGram = 0;
    app.state.calculator.prices.silverPerGram = 0;
    win.calcZakat();
    expect(app.state.zakatDue).toBe(0);
  });
});

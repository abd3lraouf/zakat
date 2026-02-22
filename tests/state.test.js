import { describe, it, expect, beforeEach } from 'vitest';
import { createApp, resetState } from './helpers.js';

let win, app;

beforeEach(() => {
  ({ window: win, app } = createApp());
});

// ──────────────── buildExportData ──────────────────────────
describe('buildExportData', () => {
  it('returns correct structure', () => {
    const data = win.buildExportData();
    expect(data).toHaveProperty('version');
    expect(data).toHaveProperty('exportedAt');
    expect(data).toHaveProperty('lastModified');
    expect(data).toHaveProperty('language');
    expect(data).toHaveProperty('calculator');
    expect(data).toHaveProperty('tracker');
  });

  it('version matches CONFIG.APP_VERSION', () => {
    const data = win.buildExportData();
    expect(data.version).toBe(app.CONFIG.APP_VERSION);
  });

  it('includes calculator state', () => {
    app.state.calculator.assets.cash = 50000;
    const data = win.buildExportData();
    expect(data.calculator.assets.cash).toBe(50000);
  });

  it('includes tracker payments', () => {
    app.state.tracker.payments = [
      { id: 't1', date: '2024-01-01', recipient: 'A', category: '', amount: 500, notes: '' },
    ];
    const data = win.buildExportData();
    expect(data.tracker.payments).toHaveLength(1);
    expect(data.tracker.payments[0].amount).toBe(500);
  });

  it('deep-clones data (no reference sharing)', () => {
    const data = win.buildExportData();
    data.calculator.assets.cash = 99999;
    expect(app.state.calculator.assets.cash).not.toBe(99999);
  });

  it('exportedAt is a valid ISO string', () => {
    const data = win.buildExportData();
    const parsed = new Date(data.exportedAt);
    expect(parsed.getTime()).not.toBeNaN();
  });
});

// ──────────────── applyImportData ──────────────────────────
describe('applyImportData', () => {
  it('applies valid data', () => {
    const importData = {
      calculator: {
        prices: { gold24PerGram: 5000, silverPerGram: 55 },
        assets: { cash: 75000 },
        deductions: { immediateDebts: 5000 },
        customAssets: [{ id: 'c1', label: 'Test', amount: 1000 }],
      },
      tracker: {
        payments: [{ id: 'p1', date: '', recipient: '', category: '', amount: 200, notes: '' }],
      },
    };
    win.applyImportData(importData, false);

    expect(app.state.calculator.prices.gold24PerGram).toBe(5000);
    expect(app.state.calculator.assets.cash).toBe(75000);
    expect(app.state.calculator.deductions.immediateDebts).toBe(5000);
    expect(app.state.calculator.customAssets).toHaveLength(1);
    expect(app.state.tracker.payments).toHaveLength(1);
  });

  it('rejects non-object calculator', () => {
    const importData = { calculator: 'not an object' };
    // Should not throw
    expect(() => win.applyImportData(importData, false)).not.toThrow();
    // State should be unchanged
    expect(app.state.calculator.assets.cash).toBe(0);
  });

  it('rejects non-array customAssets', () => {
    const importData = {
      calculator: { customAssets: 'not an array' },
    };
    win.applyImportData(importData, false);
    expect(Array.isArray(app.state.calculator.customAssets)).toBe(true);
  });

  it('rejects non-array payments', () => {
    const importData = {
      tracker: { payments: { not: 'an array' } },
    };
    win.applyImportData(importData, false);
    expect(Array.isArray(app.state.tracker.payments)).toBe(true);
  });

  it('rejects non-object tracker', () => {
    const importData = { tracker: 42 };
    expect(() => win.applyImportData(importData, false)).not.toThrow();
  });

  it('rejects non-object prices', () => {
    const importData = {
      calculator: { prices: 'bad', assets: { cash: 999 } },
    };
    win.applyImportData(importData, false);
    // prices should remain default, assets should be updated
    expect(app.state.calculator.prices.gold24PerGram).toBe(4625);
    expect(app.state.calculator.assets.cash).toBe(999);
  });

  it('handles empty import data', () => {
    expect(() => win.applyImportData({}, false)).not.toThrow();
  });

  it('handles null/undefined fields gracefully', () => {
    expect(() => win.applyImportData({ calculator: null }, false)).not.toThrow();
    expect(() => win.applyImportData({ tracker: null }, false)).not.toThrow();
  });
});

// ──────────────── Round-trip export/import ──────────────────
describe('Export/Import round-trip', () => {
  it('state survives export then import', () => {
    app.state.calculator.assets.cash = 42000;
    app.state.calculator.assets.gold24g = 10;
    app.state.calculator.deductions.immediateDebts = 3000;
    app.state.calculator.customAssets = [{ id: 'x', label: 'BTC', amount: 5000 }];
    app.state.tracker.payments = [
      { id: 'p1', date: '2024-06-01', recipient: 'Ali', category: 'cat.faqir', amount: 1000, notes: 'test' },
    ];

    const exported = win.buildExportData();

    // Reset state
    resetState(app, win);
    expect(app.state.calculator.assets.cash).toBe(0);

    // Re-import
    win.applyImportData(exported, false);
    expect(app.state.calculator.assets.cash).toBe(42000);
    expect(app.state.calculator.assets.gold24g).toBe(10);
    expect(app.state.calculator.deductions.immediateDebts).toBe(3000);
    expect(app.state.calculator.customAssets[0].label).toBe('BTC');
    expect(app.state.tracker.payments[0].recipient).toBe('Ali');
  });
});

// ──────────────── localStorage save/load ───────────────────
describe('localStorage', () => {
  it('loadLocal recovers saved state', () => {
    app.state.calculator.assets.cash = 77777;
    const data = win.buildExportData();
    win.localStorage.setItem('zakat_app_data', JSON.stringify(data));

    // Reset
    app.state.calculator.assets.cash = 0;

    // Load
    win.loadLocal();
    expect(app.state.calculator.assets.cash).toBe(77777);
  });

  it('loadLocal handles missing data gracefully', () => {
    win.localStorage.clear();
    expect(() => win.loadLocal()).not.toThrow();
  });

  it('loadLocal handles corrupted JSON', () => {
    win.localStorage.setItem('zakat_app_data', '{not valid json');
    expect(() => win.loadLocal()).not.toThrow();
  });
});

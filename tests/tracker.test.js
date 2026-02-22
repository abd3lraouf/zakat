import { describe, it, expect, beforeEach, vi } from 'vitest';
import { createApp } from './helpers.js';

let win, app;

beforeEach(() => {
  ({ window: win, app } = createApp());
});

// ──────────────── addTrackerRow ────────────────────────────
describe('addTrackerRow', () => {
  it('adds a single payment entry', () => {
    const before = app.state.tracker.payments.length;
    win.addTrackerRow();
    expect(app.state.tracker.payments.length).toBe(before + 1);
  });

  it('adds multiple rows at once', () => {
    const before = app.state.tracker.payments.length;
    win.addTrackerRow(5);
    expect(app.state.tracker.payments.length).toBe(before + 5);
  });

  it('new payment has required fields', () => {
    win.addTrackerRow();
    const payment = app.state.tracker.payments[app.state.tracker.payments.length - 1];
    expect(payment).toHaveProperty('id');
    expect(payment).toHaveProperty('date');
    expect(payment).toHaveProperty('recipient');
    expect(payment).toHaveProperty('category');
    expect(payment).toHaveProperty('amount');
    expect(payment).toHaveProperty('notes');
  });

  it('new payment has unique id', () => {
    win.addTrackerRow(3);
    const ids = app.state.tracker.payments.map(p => p.id);
    const unique = new Set(ids);
    expect(unique.size).toBe(ids.length);
  });

  it('new payment defaults to zero amount', () => {
    win.addTrackerRow();
    const payment = app.state.tracker.payments[app.state.tracker.payments.length - 1];
    expect(payment.amount).toBe(0);
  });
});

// ──────────────── deleteTrackerRow ─────────────────────────
describe('deleteTrackerRow', () => {
  it('removes a payment by id', async () => {
    win.addTrackerRow();
    const id = app.state.tracker.payments[0].id;
    win.deleteTrackerRow(id);
    // Wait for animation timeout (200ms)
    await new Promise(r => setTimeout(r, 300));
    expect(app.state.tracker.payments.find(p => p.id === id)).toBeUndefined();
  });
});

// ──────────────── updatePaymentField ───────────────────────
describe('updatePaymentField', () => {
  it('updates amount field', () => {
    win.addTrackerRow();
    const id = app.state.tracker.payments[0].id;
    win.updatePaymentField(id, 'amount', '500');
    expect(app.state.tracker.payments[0].amount).toBe(500);
  });

  it('uses safeNum for amount', () => {
    win.addTrackerRow();
    const id = app.state.tracker.payments[0].id;
    win.updatePaymentField(id, 'amount', 'NaN');
    expect(app.state.tracker.payments[0].amount).toBe(0);
  });

  it('updates text fields as strings', () => {
    win.addTrackerRow();
    const id = app.state.tracker.payments[0].id;
    win.updatePaymentField(id, 'recipient', 'Test Recipient');
    expect(app.state.tracker.payments[0].recipient).toBe('Test Recipient');
  });

  it('updates date field', () => {
    win.addTrackerRow();
    const id = app.state.tracker.payments[0].id;
    win.updatePaymentField(id, 'date', '2024-01-15');
    expect(app.state.tracker.payments[0].date).toBe('2024-01-15');
  });

  it('updates category field', () => {
    win.addTrackerRow();
    const id = app.state.tracker.payments[0].id;
    win.updatePaymentField(id, 'category', 'cat.faqir');
    expect(app.state.tracker.payments[0].category).toBe('cat.faqir');
  });
});

// ──────────────── clearAllPayments ─────────────────────────
describe('clearAllPayments', () => {
  it('clears all payments when confirmed', () => {
    win.addTrackerRow(3);
    expect(app.state.tracker.payments.length).toBe(3);
    // Mock confirm to return true
    win.confirm = () => true;
    win.clearAllPayments();
    expect(app.state.tracker.payments.length).toBe(0);
  });

  it('does nothing when cancelled', () => {
    win.addTrackerRow(3);
    win.confirm = () => false;
    win.clearAllPayments();
    expect(app.state.tracker.payments.length).toBe(3);
  });

  it('does nothing when no payments exist', () => {
    win.confirm = vi.fn();
    win.clearAllPayments();
    // confirm should NOT have been called
    expect(win.confirm).not.toHaveBeenCalled();
  });
});

// ──────────────── updateTrackerSummary ─────────────────────
describe('updateTrackerSummary', () => {
  it('computes correct totals', () => {
    app.state.zakatDue = 10000;
    app.state.tracker.payments = [
      { id: '1', date: '', recipient: '', category: '', amount: 3000, notes: '' },
      { id: '2', date: '', recipient: '', category: '', amount: 2000, notes: '' },
    ];
    win.renderTrackerTable();
    win.updateTrackerSummary();

    const paid = win.document.getElementById('tr-paid');
    expect(paid.textContent).toContain('5,000');

    const remaining = win.document.getElementById('tr-remaining');
    expect(remaining.textContent).toContain('5,000');
  });

  it('shows fully paid banner when 100% paid', () => {
    app.state.zakatDue = 1000;
    app.state.nisabMet = true;
    app.state.tracker.payments = [
      { id: '1', date: '', recipient: '', category: '', amount: 1000, notes: '' },
    ];
    win.renderTrackerTable();
    win.updateTrackerSummary();

    const banner = win.document.getElementById('paid-banner');
    expect(banner.classList.contains('show')).toBe(true);
  });

  it('shows no-zakat banner when below nisab', () => {
    app.state.zakatDue = 0;
    app.state.nisabMet = false;
    win.updateTrackerSummary();

    const banner = win.document.getElementById('no-zakat-banner');
    expect(banner.classList.contains('hidden')).toBe(false);
  });

  it('remaining cannot go below zero', () => {
    app.state.zakatDue = 1000;
    app.state.tracker.payments = [
      { id: '1', date: '', recipient: '', category: '', amount: 2000, notes: '' },
    ];
    win.renderTrackerTable();
    win.updateTrackerSummary();

    const remaining = win.document.getElementById('tr-remaining');
    expect(remaining.textContent).toContain('0.00');
  });

  it('progress bar capped at 100%', async () => {
    app.state.zakatDue = 1000;
    app.state.tracker.payments = [
      { id: '1', date: '', recipient: '', category: '', amount: 5000, notes: '' },
    ];
    win.renderTrackerTable();
    win.updateTrackerSummary();

    // requestAnimationFrame is async in JSDOM — wait for it
    await new Promise(r => setTimeout(r, 50));
    const progress = win.document.getElementById('tr-progress');
    expect(progress.style.width).toBe('100%');
  });
});

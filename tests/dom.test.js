import { describe, it, expect, beforeAll } from 'vitest';
import { createApp, getAllCss } from './helpers.js';

let win, doc, app;

beforeAll(() => {
  ({ window: win, document: doc, app } = createApp());
});

// ──────────────── Accessibility ────────────────────────────
describe('Accessibility: DOM structure', () => {
  it('has a skip-to-main-content link', () => {
    const skipLink = doc.querySelector('.skip-to-main');
    expect(skipLink).not.toBeNull();
    expect(skipLink.getAttribute('href')).toBe('#app');
  });

  it('all table headers have scope="col"', () => {
    const ths = doc.querySelectorAll('#tracker-table thead th');
    expect(ths.length).toBeGreaterThan(0);
    ths.forEach(th => {
      expect(th.getAttribute('scope')).toBe('col');
    });
  });

  it('nav has role="navigation" and aria-label', () => {
    const nav = doc.getElementById('navbar');
    expect(nav.getAttribute('role')).toBe('navigation');
    expect(nav.getAttribute('aria-label')).toBeTruthy();
  });

  it('modals have aria-modal and role="dialog"', () => {
    const modals = doc.querySelectorAll('.modal-overlay');
    expect(modals.length).toBeGreaterThan(0);
    modals.forEach(m => {
      expect(m.getAttribute('role')).toBe('dialog');
      expect(m.getAttribute('aria-modal')).toBe('true');
    });
  });

  it('sync indicator has aria-live', () => {
    const sync = doc.getElementById('sync-indicator');
    expect(sync.getAttribute('aria-live')).toBe('polite');
  });

  it('toast container has aria-live', () => {
    const toasts = doc.getElementById('toast-container');
    expect(toasts.getAttribute('aria-live')).toBe('polite');
  });

  it('language toggle has role="group"', () => {
    const toggle = doc.querySelector('.lang-toggle');
    expect(toggle.getAttribute('role')).toBe('group');
  });

  it('nav buttons have keyboard shortcut titles', () => {
    const calcBtn = doc.getElementById('nav-calculator-btn');
    const trackBtn = doc.getElementById('nav-tracker-btn');
    expect(calcBtn.getAttribute('title')).toContain('Alt+C');
    expect(trackBtn.getAttribute('title')).toContain('Alt+T');
  });

  it('profile view exists', () => {
    const profileView = doc.getElementById('view-profile');
    expect(profileView).not.toBeNull();
  });

  it('bottom nav has profile button', () => {
    const bnavProfile = doc.getElementById('bnav-profile');
    expect(bnavProfile).not.toBeNull();
  });
});

// ──────────────── CSS checks ───────────────────────────────
describe('CSS features', () => {
  const rawCss = getAllCss();

  it('has prefers-reduced-motion media query', () => {
    expect(rawCss).toContain('prefers-reduced-motion: reduce');
  });

  it('has prefers-color-scheme dark mode', () => {
    expect(rawCss).toContain('prefers-color-scheme: dark');
  });

  it('has --warning CSS variable', () => {
    expect(rawCss).toContain('--warning:');
  });

  it('has focus-visible styles for nav elements', () => {
    expect(rawCss).toContain(':focus-visible');
  });

  it('has skip-to-main CSS class', () => {
    expect(rawCss).toContain('.skip-to-main');
  });

  it('has RTL progress bar gradient', () => {
    expect(rawCss).toContain('[dir="rtl"] .progress-fill');
  });

  it('uses logical properties (inset-inline)', () => {
    expect(rawCss).toContain('inset-inline-end');
  });

  it('uses logical properties (margin-inline-start)', () => {
    expect(rawCss).toContain('margin-inline-start');
  });

  it('print stylesheet hides interactive elements', () => {
    expect(rawCss).toContain('@media print');
    expect(rawCss).toContain('.btn-del-row');
  });

  it('print stylesheet prevents page breaks in rows', () => {
    expect(rawCss).toContain('page-break-inside: avoid');
  });
});

// ──────────────── Meta tags ────────────────────────────────
describe('Meta tags', () => {
  it('has viewport meta tag', () => {
    const viewport = doc.querySelector('meta[name="viewport"]');
    expect(viewport).not.toBeNull();
  });

  it('has description meta tag', () => {
    const desc = doc.querySelector('meta[name="description"]');
    expect(desc).not.toBeNull();
    expect(desc.getAttribute('content')).toBeTruthy();
  });

  it('has theme-color meta tag', () => {
    const theme = doc.querySelector('meta[name="theme-color"]');
    expect(theme).not.toBeNull();
    expect(theme.getAttribute('content')).toBe('#243d32');
  });

  it('has Open Graph tags', () => {
    expect(doc.querySelector('meta[property="og:title"]')).not.toBeNull();
    expect(doc.querySelector('meta[property="og:description"]')).not.toBeNull();
    expect(doc.querySelector('meta[property="og:type"]')).not.toBeNull();
  });

  it('has favicon', () => {
    const favicon = doc.querySelector('link[rel="icon"]');
    expect(favicon).not.toBeNull();
  });
});

// ──────────────── Security DOM checks ──────────────────────
describe('Security: DOM', () => {
  it('custom asset labels are escaped in summary', () => {
    // Add a custom asset with HTML in the label
    app.state.calculator.customAssets = [
      { id: 'xss1', label: '<img src=x onerror=alert(1)>', amount: 50000 },
    ];
    win.calcZakat();

    const summaryHtml = doc.getElementById('summary-lines').innerHTML;
    // Should contain escaped HTML, not raw tags
    expect(summaryHtml).not.toContain('<img');
    expect(summaryHtml).toContain('&lt;img');
  });

  it('file import input accepts only .json', () => {
    const input = doc.getElementById('import-file-input');
    expect(input.getAttribute('accept')).toBe('.json');
  });

  it('input fields have max bounds', () => {
    const goldInput = doc.getElementById('price-gold24');
    expect(goldInput.getAttribute('max')).toBeTruthy();
  });
});

// ──────────────── Input validation ─────────────────────────
describe('Input validation', () => {
  it('price inputs have step="0.01"', () => {
    const gold = doc.getElementById('price-gold24');
    const silver = doc.getElementById('price-silver');
    expect(gold.getAttribute('step')).toBe('0.01');
    expect(silver.getAttribute('step')).toBe('0.01');
  });

  it('price inputs have max attribute', () => {
    const gold = doc.getElementById('price-gold24');
    expect(gold.getAttribute('max')).toBe('999999');
  });
});

// ──────────────── Modal focus trap ─────────────────────────
describe('Modal focus management', () => {
  it('openModal sets the modal as open', () => {
    win.openModal('import-modal');
    const modal = doc.getElementById('import-modal');
    expect(modal.classList.contains('open')).toBe(true);
    win.closeModal('import-modal');
  });

  it('closeModal removes open class', () => {
    win.openModal('import-modal');
    win.closeModal('import-modal');
    const modal = doc.getElementById('import-modal');
    expect(modal.classList.contains('open')).toBe(false);
  });
});

// ──────────────── View navigation ──────────────────────────
describe('View navigation', () => {
  it('showView activates the correct view', () => {
    win.showView('calculator');
    expect(doc.getElementById('view-calculator').classList.contains('active')).toBe(true);
    expect(doc.getElementById('view-tracker').classList.contains('active')).toBe(false);

    win.showView('tracker');
    expect(doc.getElementById('view-tracker').classList.contains('active')).toBe(true);
    expect(doc.getElementById('view-calculator').classList.contains('active')).toBe(false);
  });

  it('showView updates nav button active state', () => {
    win.showView('calculator');
    expect(doc.getElementById('nav-calculator-btn').classList.contains('active')).toBe(true);
    expect(doc.getElementById('nav-tracker-btn').classList.contains('active')).toBe(false);
  });

  it('showView can navigate to profile', () => {
    win.showView('profile');
    expect(doc.getElementById('view-profile').classList.contains('active')).toBe(true);
    expect(doc.getElementById('view-calculator').classList.contains('active')).toBe(false);
  });
});

// ──────────────── Toast notifications ──────────────────────
describe('Toast notifications', () => {
  it('showToast adds a toast to the container', () => {
    win.showToast('Test message', 'success');
    const container = doc.getElementById('toast-container');
    const toasts = container.querySelectorAll('.toast');
    expect(toasts.length).toBeGreaterThan(0);
    expect(toasts[toasts.length - 1].textContent).toBe('Test message');
  });

  it('toast has correct type class', () => {
    win.showToast('Error!', 'error');
    const container = doc.getElementById('toast-container');
    const toasts = container.querySelectorAll('.toast.error');
    expect(toasts.length).toBeGreaterThan(0);
  });
});

// ──────────────── Landing page states ──────────────────────
describe('Landing page CTA states', () => {
  it('has guest-cta and user-cta elements', () => {
    expect(doc.getElementById('guest-cta')).not.toBeNull();
    expect(doc.getElementById('user-cta')).not.toBeNull();
  });

  it('user-cta is hidden by default', () => {
    const userCta = doc.getElementById('user-cta');
    expect(userCta.classList.contains('hidden')).toBe(true);
  });

  it('guest-cta is visible by default', () => {
    const guestCta = doc.getElementById('guest-cta');
    expect(guestCta.classList.contains('hidden')).toBe(false);
  });
});

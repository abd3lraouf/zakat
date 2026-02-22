# Contributing

Thank you for your interest in contributing!

## Getting Started

See the [Setup Guide](docs/SETUP.md) for repository setup and deployment. For local development:

```bash
git clone https://github.com/abd3lraouf/zakat.git
cd zakat
bun install          # dev dependencies for testing
python3 -m http.server 8080
```

## Development Workflow

1. Create a feature branch: `git checkout -b feature/my-change`
2. Make your changes to `index.html`
3. Run tests: `bun test`
4. Test manually:
   - Switch between EN/AR — verify translations and RTL layout
   - Toggle OS dark mode — verify all colors adapt
   - Keyboard-only navigation — Tab through inputs, Escape closes modals
   - Mobile viewport (375px) — verify bottom nav and touch targets
5. Commit, push, and open a pull request

## Testing

Tests use [Vitest](https://vitest.dev/) with JSDOM. Test files are in `tests/`:

| File | Coverage |
|------|----------|
| `utils.test.js` | `safeNum`, `escapeHtml`, `fmtEGP`, `fmtPct` |
| `i18n.test.js` | Translation coverage, `i18n.t()`, `setLang()` |
| `calculator.test.js` | Zakat calculation, nisab, price sensitivity |
| `tracker.test.js` | Payment CRUD, summary calculations |
| `state.test.js` | Export/import, validation, localStorage |
| `dom.test.js` | Accessibility, security, meta tags |

```bash
bun test              # Run all tests once
bun run test:watch    # Watch mode
bun run test:coverage # With coverage report
```

### Writing Tests

```js
import { createApp, resetState } from './helpers.js';

let win, app;
beforeEach(() => {
  ({ window: win, app } = createApp());
});

it('my test', () => {
  app.state.calculator.assets.cash = 50000;
  win.calcZakat();
  expect(app.state.zakatDue).toBeGreaterThan(0);
});
```

## Code Guidelines

- **No runtime dependencies** — keep everything in `index.html`, no build step
- **Theming** — use CSS custom properties, never hardcode colors
- **i18n** — all user-facing strings via `i18n.t('key')` with EN and AR entries
- **Security** — use `escapeHtml()` for user-provided text, `safeNum()` instead of `parseFloat(x) || 0`
- **Accessibility** — WCAG AA contrast (4.5:1), 44px touch targets, `aria-label` on interactive elements
- **Commits** — imperative mood ("Add feature" not "Added feature"), under 72 characters

## Pull Request Checklist

- [ ] Tests pass (`bun test`)
- [ ] Both EN and AR translations added for new strings
- [ ] Dark mode works (no hardcoded colors)
- [ ] RTL layout works (use logical CSS properties)
- [ ] Keyboard navigation works
- [ ] Touch targets meet 44px minimum
- [ ] No console errors

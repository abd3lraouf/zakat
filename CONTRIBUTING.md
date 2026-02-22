# Contributing to Zakat App

Thank you for your interest in contributing!

## Getting Started

```bash
# Clone the repo
git clone https://github.com/YOUR_USERNAME/zakat.git
cd zakat

# Install dev dependencies
npm install

# Start local server
python3 -m http.server 8080

# Run tests
npm test

# Run tests in watch mode (re-runs on file changes)
npm run test:watch
```

## Project Architecture

The entire app lives in a single `index.html` file (~3200 lines):
- **CSS** (~800 lines): CSS custom properties, dark mode, responsive breakpoints at 640px/900px
- **JavaScript** (~1700 lines): Vanilla ES6+, zero frameworks
- **HTML** (~500 lines): Semantic markup with ARIA attributes

See [CLAUDE.md](./CLAUDE.md) for detailed architecture documentation.

## Development Workflow

1. Create a feature branch: `git checkout -b feature/my-change`
2. Make your changes to `index.html`
3. Run tests: `npm test`
4. Test manually:
   - Switch between EN/AR — verify translations and RTL layout
   - Toggle OS dark mode — verify all colors adapt
   - Keyboard-only navigation — Tab through inputs, Escape closes modals
   - Mobile viewport (375px) — verify bottom nav and touch targets
5. Commit and push
6. Open a pull request — CI runs tests automatically

## Testing

Tests use [Vitest](https://vitest.dev/) with JSDOM. Test files are in `tests/`:

| File | What it tests |
|------|--------------|
| `utils.test.js` | `safeNum`, `escapeHtml`, `fmtEGP`, `fmtPct` |
| `i18n.test.js` | Translation coverage, `i18n.t()`, `setLang()` |
| `calculator.test.js` | Zakat calculation engine, nisab, price sensitivity |
| `tracker.test.js` | Payment CRUD, summary calculations |
| `state.test.js` | Export/import, validation, localStorage |
| `dom.test.js` | Accessibility, security, meta tags, CSS features |

### Writing tests

```js
import { createApp, resetState } from './helpers.js';

let win, app;

beforeEach(() => {
  ({ window: win, app } = createApp());
});

it('my test', () => {
  // app.state, app.i18n, app.CONFIG — module-scoped constants
  // win.calcZakat(), win.fmtEGP() — function declarations on window
  app.state.calculator.assets.cash = 50000;
  win.calcZakat();
  expect(app.state.zakatDue).toBeGreaterThan(0);
});
```

### Test commands

```bash
npm test              # Run all tests once
npm run test:watch    # Watch mode
npm run test:coverage # With coverage report
```

## Guidelines

### Code style

- No external dependencies in the app itself (dev dependencies for testing are fine)
- Keep everything in `index.html` — no build step
- Use CSS custom properties for theming (never hardcode colors)
- All user-facing strings must use `i18n.t('key')` with entries in both EN and AR
- Use `escapeHtml()` for any user-provided text rendered as HTML
- Use `safeNum()` instead of `parseFloat(x) || 0`

### Accessibility

- All interactive elements need `aria-label` or visible text
- Modals must trap focus
- Color contrast ratio must meet WCAG AA (4.5:1 for text)
- Touch targets must be at least 44px

### Security

- Sanitize all user input before innerHTML with `escapeHtml()`
- Validate data types in `applyImportData()`
- Wrap `localStorage` operations in try/catch
- Check `res.ok` after fetch calls

### Commit messages

- Use imperative mood: "Add feature" not "Added feature"
- Keep first line under 72 characters
- Reference issues if applicable: "Fix #42: handle NaN in price input"

## Pull Request Checklist

- [ ] Tests pass (`npm test`)
- [ ] Both EN and AR translations added for any new strings
- [ ] Dark mode works (no hardcoded colors)
- [ ] RTL layout works (use logical CSS properties)
- [ ] Keyboard navigation works
- [ ] No console errors
- [ ] Touch targets meet 44px minimum

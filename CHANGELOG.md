# Changelog

All notable changes to the Zakat App are documented here.

## [1.1.0] - 2026-02-22

### Security
- Fix XSS vulnerability: custom asset labels now escaped with `escapeHtml()` in summary panel
- Add `try/catch` around `localStorage.setItem` to handle `QuotaExceededError`
- Add `reader.onerror` handler for file import
- Add `res.ok` checks on Google Drive upload API calls (both PATCH and POST)
- Add type guards in `applyImportData()`: object/array validation before assignment
- Add `safeNum()` utility using `Number.isFinite()`, replacing all `parseFloat(x) || 0` patterns

### Accessibility
- Add `prefers-reduced-motion: reduce` media query to disable animations
- Improve color contrast: nav links, sync label, language buttons
- Add focus trap in modals with Tab/Shift+Tab cycling and focus restore on close
- Add skip-to-main-content link before navigation
- Add `scope="col"` to all tracker table header cells
- Increase touch targets: delete buttons 28px to 44px, table inputs min-height 44px
- Add `:focus-visible` gold outline styles for nav elements

### Internationalization
- Add 9 missing translation keys to both EN and AR:
  `tracker.clearAll.confirm`, `sync.cloudDataFrom`, `signin.configError`,
  `signin.failed`, `signin.failedWith`, `sync.cloudLoaded`, `sync.failed`,
  `sync.uploaded`, `save.failed`
- Replace 8 hardcoded English strings with `i18n.t()` calls

### Dark Mode
- Add `--warning` CSS custom property with light/dark variants
- Toast warning and offline banner now use `var(--warning)`
- Add dark mode override for table select dropdown SVG arrow
- Improve progress bar visibility in dark mode (`--g-500` override)

### RTL
- Replace physical CSS properties with logical equivalents (`margin-inline-start`, `inset-inline-end`, `padding-inline-end`)
- Add RTL progress bar gradient direction (270deg)
- Remove redundant `[dir="rtl"]` overrides

### Visual
- Fix dropdown menu animation: replace `display:none` toggle with `visibility/opacity` transition
- Unify empty state styling between calculator and tracker views
- Move repeated inline styles to CSS classes (`footer-value`, `btn-nav-ghost`, `btn-card-ghost`, `paid-banner-muted`)

### Input Validation
- Add `max` bounds on price inputs (999,999), monetary inputs (999,999,999)
- Replace `step="any"` with `step="0.01"` (monetary) and `step="0.001"` (weight)
- Add `max` attribute with today's date on tracker date inputs to prevent future dates

### UI Polish
- Add inline SVG favicon (🌙)
- Add `<meta name="theme-color">` and Open Graph meta tags
- Improve print stylesheet: table borders, page-break rules, hide delete buttons
- Add keyboard shortcut titles to nav buttons (Alt+C, Alt+T)
- Add save indicator: brief checkmark flash in sync area after local save
- Fix nav button IDs to match `showView()` pattern (`nav-calculator-btn`, `nav-tracker-btn`)

### Testing & CI
- Add Vitest test suite with 126 unit tests across 6 test files
- Test coverage: utility functions, i18n, calculator engine, tracker, state management, DOM/accessibility
- Add CI workflow for pull requests (`.github/workflows/ci.yml`)
- Update deploy workflow to run tests before deployment (`.github/workflows/deploy.yml`)
- Deploy now only uploads `index.html` and `404.html` (excludes test/config files)
- Move `deploy.yml` from root to `.github/workflows/`

### Documentation
- Add `docs/SETUP.md`: GitHub Pages, OAuth, and secrets configuration guide
- Add `CONTRIBUTING.md`: development workflow, testing guide, and code standards
- Add `CHANGELOG.md`
- Add `.gitignore`

## [1.0.0] - Initial Release

- Single-file SPA Zakat calculator and payment tracker
- Bilingual Arabic/English support with RTL
- Dark mode via `prefers-color-scheme`
- Google Drive sync (optional)
- Export/import JSON data
- Responsive design with mobile bottom nav

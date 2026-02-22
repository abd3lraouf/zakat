# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Zakat App — a bilingual (Arabic/English) single-page web application for calculating Islamic Zakat and tracking payments. Zero dependencies, no build step, no backend. Optional Google Drive sync. Deployed to GitHub Pages.

## Development

```bash
# Serve locally
python3 -m http.server 8080
# Open http://localhost:8080

# Run tests
bun test
```

No build tools required. The app uses plain `<script>` tags loaded in dependency order (no ES modules, no bundler). Tests use vitest with JSDOM. Uses bun as the package manager.

Deployment is automatic via GitHub Actions on push to `main` (see `deploy.yml`).

## Architecture

**Multi-file SPA** — `index.html` contains only HTML structure, with external CSS and JS files:

### File Structure

```
zakat/
├── index.html              # HTML only (views, structure)
├── 404.html                # SPA redirect for GitHub Pages
├── css/
│   ├── tokens.css          # Design tokens (colors, shadows, radii, spacing)
│   ├── base.css            # Reset, typography, body, background pattern
│   ├── components.css      # Navbar, cards, buttons, inputs, table, modals, toasts
│   ├── views.css           # Landing, calculator, tracker, profile view styles
│   └── utilities.css       # Utility classes, print styles, animations
├── js/
│   ├── config.js           # CONFIG object, TRANSLATIONS (EN + AR)
│   ├── state.js            # State object, saveLocal(), loadLocal(), export/import, utilities
│   ├── i18n.js             # i18n module, setLang(), apply()
│   ├── ui.js               # showView(), showToast(), openModal(), closeModal(), export/import UI
│   ├── calculator.js       # ASSET_DEFS, calcZakat(), updateSummaryPanel(), custom assets
│   ├── tracker.js          # addTrackerRow(), renderTrackerTable(), updateTrackerSummary()
│   ├── google.js           # Google Sign-In, Drive sync, online/offline detection
│   ├── profile.js          # Profile page: updateProfileView(), forceSync(), clearAllData()
│   └── app.js              # Entry point: init(), DOMContentLoaded, keyboard shortcuts
├── tests/
│   ├── helpers.js           # JSDOM setup, inlines JS files for testing
│   ├── calculator.test.js
│   ├── state.test.js
│   ├── i18n.test.js
│   ├── tracker.test.js
│   ├── utils.test.js
│   └── dom.test.js
└── .github/workflows/
    ├── deploy.yml           # Copies index.html, 404.html, css/, js/ to _site/
    └── ci.yml
```

### JS Load Order

Scripts are loaded as plain `<script>` tags in strict dependency order (not ES modules):

`config.js` → `state.js` → `i18n.js` → `ui.js` → `calculator.js` → `tracker.js` → `google.js` → `profile.js` → `app.js`

Each file uses global scope — functions and `const` declarations in earlier files are accessible to later files. `var` is used for mutable shared variables (saveTimer, syncTimer, googleAccessToken, etc.).

### Views

Four views toggled via `showView(name)`:
- **Landing** — Welcome page with guest CTA (sign-in) and user CTA (welcome back)
- **Calculator** — Zakat calculation with asset inputs, deductions, and live summary
- **Tracker** — Payment log table with progress tracking
- **Profile** — Account info, sync controls, data management (export/import/clear), about

### State Management

Global `state` object holds all app data:
- `state.calculator` — prices, assets (9 types), deductions, custom assets
- `state.tracker` — payment entries array
- `state.zakatDue` / `state.nisabMet` — computed values

State persists to `localStorage` under key `zakat_app_data` with 500ms debounced saves.

### Key Architectural Patterns

- **i18n**: Translation keys in `TRANSLATIONS` object (Arabic + English). `i18n.t(key)` for lookups. Auto-detects browser locale. Handles RTL/LTR switching.
- **Google Drive Sync**: Uses Drive AppData folder (invisible to user). Conflict resolution prompts user when modification timestamps diverge. 3s debounced sync.
- **Config constants**: `CONFIG` object in `js/config.js` — contains Google Client ID, Nisab thresholds (gold: 87.48g, silver: 612.36g), Zakat rate (2.5%).

### Core Functions

| Area | File | Key Functions |
|------|------|--------------|
| Calculation | `calculator.js` | `calcZakat()`, `updateSummaryPanel()`, `renderAssetRows()` |
| Tracker | `tracker.js` | `addTrackerRow()`, `deleteTrackerRow()`, `renderTrackerTable()`, `updateTrackerSummary()` |
| Storage | `state.js` | `saveLocal()`, `loadLocal()`, `buildExportData()`, `applyImportData()` |
| Drive Sync | `google.js` | `startGoogleSignIn()`, `uploadToDrive()`, `downloadFromDrive()`, `checkDriveData()` |
| UI | `ui.js` | `showView()`, `showToast()`, `openModal()`, `closeModal()` |
| Profile | `profile.js` | `updateProfileView()`, `forceSync()`, `disconnectGoogle()`, `clearAllData()` |
| Utilities | `state.js` | `fmtEGP()`, `escapeHtml()`, `safeNum()`, `fmtPct()` |

### External Dependencies

None installed. External services loaded via CDN:
- Google Sign-In (`accounts.google.com/gsi/client`)
- Google Drive API v3
- Google Fonts (Noto Naskh Arabic, DM Mono, Playfair Display)

### Testing

Tests use vitest with JSDOM. The test helper (`tests/helpers.js`) reads `index.html` and replaces external `<script src="js/...">` tags with inlined file contents so JSDOM can execute them. CSS tests read from external CSS files via `getAllCss()`.

```bash
bun test        # Run all tests
bunx vitest run # Same thing
```

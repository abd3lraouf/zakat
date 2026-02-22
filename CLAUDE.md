# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Zakat App — a bilingual (Arabic/English) single-page web application for calculating Islamic Zakat and tracking payments. Zero dependencies, no build step, no backend. Optional Google Drive sync. Deployed to GitHub Pages.

## Development

```bash
# Serve locally
python3 -m http.server 8080
# Open http://localhost:8080
```

No build tools, package managers, or test frameworks are used. The entire app lives in a single `index.html` file (~3000 lines containing all HTML, CSS, and JS inline).

Deployment is automatic via GitHub Actions on push to `main` (see `deploy.yml`).

## Architecture

**Single-file SPA** — `index.html` contains everything:
- **CSS** (~800 lines): CSS custom properties for theming, dark mode via `prefers-color-scheme`, responsive breakpoints at 640px and 900px
- **JavaScript** (~1700 lines): Vanilla ES6+, no frameworks
- **HTML** (~500 lines): Semantic markup with ARIA attributes

### State Management

Global `state` object holds all app data:
- `state.calculator` — prices, assets (9 types), deductions, custom assets
- `state.tracker` — payment entries array
- `state.zakatDue` / `state.nisabMet` — computed values

State persists to `localStorage` under key `zakat_app_data` with 500ms debounced saves.

### Key Architectural Patterns

- **i18n**: 171 translation keys in `STRINGS` object (Arabic + English). `i18n.t(key)` for lookups. Auto-detects browser locale. Handles RTL/LTR switching.
- **Views**: Two main views (Calculator, Tracker) toggled via `showView(name)` with CSS class manipulation.
- **Google Drive Sync**: Uses Drive AppData folder (invisible to user). Conflict resolution prompts user when modification timestamps diverge. 3s debounced sync.
- **Config constants**: `CONFIG` object near top of `<script>` section — contains Google Client ID, Nisab thresholds (gold: 87.48g, silver: 612.36g), Zakat rate (2.5%).

### Core Functions

| Area | Key Functions |
|------|--------------|
| Calculation | `calcZakat()`, `updateSummaryPanel()` |
| Tracker | `addTrackerRow()`, `deleteTrackerRow()`, `renderTrackerTable()`, `updateTrackerSummary()` |
| Storage | `saveLocal()`, `loadLocal()`, `buildExportData()`, `applyImportData()` |
| Drive Sync | `startGoogleSignIn()`, `uploadToDrive()`, `downloadFromDrive()`, `checkDriveData()` |
| UI | `showView()`, `showToast()`, `openModal()`, `closeModal()`, `setLang()` |
| Utilities | `fmtEGP()` (currency formatting), `escapeHtml()` (XSS prevention) |

### External Dependencies

None installed. External services loaded via CDN:
- Google Sign-In (`accounts.google.com/gsi/client`)
- Google Drive API v3
- Google Fonts (Amiri, DM Mono, Playfair Display)

## Other Files

- `404.html` — SPA redirect for GitHub Pages routing
- `_config.yml` — Minimal Jekyll config (excludes README and YAML from build)
- `deploy.yml` — GitHub Actions workflow for Pages deployment

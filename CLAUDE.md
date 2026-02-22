# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Zakat App — a bilingual (Arabic/English) single-page web application for calculating Islamic Zakat and tracking payments. Built with Nuxt 4, Vue 3, Pinia, Tailwind CSS v4, and @nuxtjs/i18n. Optional Google Drive sync. Deployed to GitHub Pages.

## Development

```bash
# Install dependencies
bun install

# Start dev server (opens at http://localhost:3000)
bun run dev

# Run tests
bun run test

# Build for production
bun run build

# Preview production build
bun run preview
```

Uses bun as the package manager. Deployment is automatic via GitHub Actions on push to `main` (see `deploy.yml`).

## Architecture

**Nuxt 4 SPA** with `app/` directory convention, TypeScript, Vue 3 Composition API, Pinia stores, Tailwind CSS v4, and @nuxtjs/i18n.

### File Structure

```
zakat/
├── app/
│   ├── app.vue                     # Root component
│   ├── app.config.ts               # App-level configuration
│   ├── assets/css/
│   │   ├── main.css                # Tailwind v4 entry + theme tokens
│   │   └── base.css                # Base styles, typography, patterns
│   ├── components/
│   │   ├── AppBottomNav.vue        # Bottom navigation bar
│   │   ├── AppModal.vue            # Reusable modal dialog
│   │   ├── AppNavbar.vue           # Top navigation bar
│   │   ├── AppToast.vue            # Toast notification
│   │   ├── OfflineBanner.vue       # Offline status indicator
│   │   ├── SyncIndicator.vue       # Google Drive sync status
│   │   ├── calculator/             # Calculator-specific components
│   │   ├── tracker/                # Tracker-specific components
│   │   └── profile/                # Profile-specific components
│   ├── composables/
│   │   ├── useGoogleAuth.ts        # Google Sign-In composable
│   │   └── useToast.ts             # Toast notification composable
│   ├── layouts/
│   │   └── default.vue             # Default layout (navbar + bottom nav)
│   ├── pages/
│   │   ├── index.vue               # Landing page
│   │   ├── calculator.vue          # Zakat calculator page
│   │   ├── tracker.vue             # Payment tracker page
│   │   └── profile.vue             # Profile & settings page
│   ├── plugins/
│   │   ├── google-sdk.client.ts    # Google SDK loader (client-only)
│   │   └── pinia-persist.ts        # Pinia persistence plugin
│   ├── types/
│   │   └── google.d.ts             # Google API type declarations
│   └── utils/
│       ├── constants.ts            # CONFIG, Nisab thresholds, Zakat rate
│       └── format.ts               # fmtEGP(), fmtPct(), safeNum(), escapeHtml()
├── stores/
│   ├── auth.ts                     # Auth store (Google sign-in state)
│   ├── calculator.ts               # Calculator store (assets, deductions, zakat calc)
│   └── tracker.ts                  # Tracker store (payment entries, progress)
├── shared/
│   └── types/
│       └── index.ts                # Shared TypeScript types
├── locales/
│   ├── en.json                     # English translations
│   └── ar.json                     # Arabic translations
├── public/                         # Static assets (favicon, etc.)
├── tests/
│   └── unit/                       # Vitest unit tests
│       ├── calculator.test.ts
│       ├── format.test.ts
│       ├── i18n.test.ts
│       └── tracker.test.ts
├── nuxt.config.ts                  # Nuxt configuration
├── vitest.config.ts                # Vitest configuration
├── tsconfig.json                   # TypeScript configuration
└── .github/workflows/
    ├── deploy.yml                  # Build + deploy to GitHub Pages
    └── ci.yml                      # PR checks (test + build)
```

### Nuxt Modules

- **@pinia/nuxt** — State management with Pinia stores
- **@tailwindcss/vite** — Tailwind CSS v4 via Vite plugin
- **@nuxtjs/i18n** — Internationalization (Arabic + English, RTL/LTR)
- **@nuxtjs/google-fonts** — Google Fonts (Noto Naskh Arabic, DM Mono, Playfair Display)

### Pages / Views

Four pages via Nuxt file-based routing:
- **`/`** (Landing) — Welcome page with guest CTA (sign-in) and user CTA (welcome back)
- **`/calculator`** — Zakat calculation with asset inputs, deductions, and live summary
- **`/tracker`** — Payment log table with progress tracking
- **`/profile`** — Account info, sync controls, data management (export/import/clear), about

### State Management

Pinia stores with localStorage persistence via `pinia-plugin-persistedstate`:
- **`useCalculatorStore`** — prices, assets (9 types), deductions, custom assets, computed zakat
- **`useTrackerStore`** — payment entries array, computed totals and progress
- **`useAuthStore`** — Google sign-in state, user profile

### Key Architectural Patterns

- **Composition API**: All components use `<script setup lang="ts">` with Vue 3 Composition API.
- **i18n**: Translation keys in `locales/en.json` and `locales/ar.json`. Uses `useI18n()` composable with `$t()` for lookups. Auto-detects browser locale. Handles RTL/LTR switching.
- **Google Drive Sync**: Uses Drive AppData folder (invisible to user). Managed via `useGoogleAuth` composable. Conflict resolution prompts user when modification timestamps diverge.
- **Config constants**: `CONFIG` object in `app/utils/constants.ts` — contains Google Client ID, Nisab thresholds (gold: 87.48g, silver: 612.36g), Zakat rate (2.5%).
- **SPA Mode**: `ssr: false` in nuxt.config.ts for GitHub Pages compatibility.

### Testing

Tests use Vitest with happy-dom. Test files live in `tests/unit/` and use TypeScript.

```bash
bun run test            # Run all tests
bun run test:watch      # Watch mode
bun run test:coverage   # With coverage
```

### External Dependencies

External services loaded via plugins:
- Google Sign-In (`accounts.google.com/gsi/client`) — loaded by `google-sdk.client.ts` plugin
- Google Drive API v3
- Google Fonts — managed by `@nuxtjs/google-fonts` module

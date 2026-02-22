# Nuxt UI Redesign: Serene Islamic Aesthetic

**Date**: 2026-02-23
**Status**: Approved

## Goal

Replace all custom UI components with Nuxt UI v4 (required for Nuxt 4) equivalents and apply a softened "Serene Mosque Interior" color palette. The result is a calm, elegant Islamic web app with warm stone neutrals, muted sage-green, and brass-gold accents. No ads, no analytics, fully local. Nuxt UI v4 unifies UI + UI Pro into a single free `@nuxt/ui` package with 125+ components and handles Tailwind CSS v4 internally.

## Color Palette

### Primary Green (softened sage — aged mosque tile)

| Token | Hex |
|-------|-----|
| 50 | #F0F7F4 |
| 100 | #DCEEE5 |
| 200 | #B9DDCB |
| 300 | #8DC7AA |
| 400 | #5EAB85 |
| 500 | #3D8B67 |
| 600 | #2E7054 |
| 700 | #265A44 |
| 800 | #1F4837 |
| 900 | #1A3D2C |
| 950 | #0E2219 |

### Gold (muted brass — weathered calligraphy)

| Token | Hex |
|-------|-----|
| 50 | #FBF7EE |
| 100 | #F5ECD4 |
| 200 | #EBDAAB |
| 300 | #D4B96A |
| 400 | #C4A54A |
| 500 | #B8933A |
| 600 | #8F7230 |
| 700 | #6E5827 |
| 800 | #5A4822 |
| 900 | #4B3C1F |
| 950 | #2A200F |

### Neutral (warm stone — marble & limestone)

| Token | Hex |
|-------|-----|
| 50 | #FAFAF8 |
| 100 | #F5F3EF |
| 200 | #EBE8E2 |
| 300 | #DDD9D1 |
| 400 | #B5AFA5 |
| 500 | #8F887D |
| 600 | #6B6560 |
| 700 | #4E4944 |
| 800 | #353230 |
| 900 | #2C2824 |
| 950 | #1C1A17 |

### Semantic Color Mapping (app.config.ts)

```ts
ui: {
  colors: {
    primary: 'green',    // custom sage-green defined in @theme
    neutral: 'stone',    // custom warm stone defined in @theme
    success: 'green',
    error: 'red',
    warning: 'amber',
    info: 'blue'
  }
}
```

### Additional Accent Colors

- **Error red**: #C94A4A (softer than current #DC2626)
- **Warning amber**: #C4850A
- **Navbar green**: `green-800` / `green-900` with glassmorphism

## Component Mapping

### Layout & Navigation

| Current | Nuxt UI | Notes |
|---------|---------|-------|
| AppNavbar.vue | Custom wrapper + `UNavigationMenu` | Keep glassmorphism backdrop-blur, use UNavigationMenu for nav items, UButton for actions |
| AppBottomNav.vue | Custom wrapper + `UNavigationMenu` | Horizontal bottom bar with Lucide icons, safe-area insets |
| default.vue | Wrap with `UApp` | UApp provides toast, tooltip, and overlay infrastructure |

### Overlays & Feedback

| Current | Nuxt UI | Notes |
|---------|---------|-------|
| AppModal.vue | `UModal` | Built-in backdrop blur, focus trap, ESC close, transitions |
| AppToast.vue | `useToast()` via `UApp` | Programmatic toasts, drop custom toast system |
| OfflineBanner.vue | `UAlert` | Warning variant, sticky top |
| SyncIndicator.vue | `UBadge` / `UChip` | Colored status dot + label |

### Calculator Page

| Current | Nuxt UI | Notes |
|---------|---------|-------|
| PriceInputs.vue | `UCard` + `UFormField` + `UInput` | Card with form fields |
| AssetRow.vue | `UFormField` + `UInput` | Grid row with label + input |
| AssetSection.vue | `UCard` with header slot | Section title in card header |
| CustomAssets.vue | `UCard` + `UButton` + `UInput` | Add/remove dynamic rows |
| DeductionInputs.vue | `UFormField` + `UInput` | Same pattern as assets |
| SummaryPanel.vue | `UCard` with custom dark styling | Keep dark gradient bg, use UCard structure for slots |

### Tracker Page

| Current | Nuxt UI | Notes |
|---------|---------|-------|
| Summary.vue | `UCard` with stat items | Due/paid/remaining cards |
| PaymentTable.vue | `UTable` | Built-in empty states, column definitions |
| PaymentRow.vue | Inline `UInput` / `USelect` / `UButton` in table cells | Replace custom transparent inputs |
| PaidBanner.vue | `UAlert` success variant | Celebratory banner |

### Profile Page

| Current | Nuxt UI | Notes |
|---------|---------|-------|
| AccountCard.vue | `UCard` + `UAvatar` + `UButton` | User info card |
| SyncCard.vue | `UCard` + `UBadge` + `UButton` | Sync status + actions |
| DataManagement.vue | `UCard` + `UButton` | Export/import/clear buttons |
| AboutCard.vue | `UCard` | Version, source, privacy rows |

### Landing Page

Keep mostly custom layout (bismillah, verse, ornamental elements). Use `UButton` for CTA and Google sign-in button.

## Typography

Keep the current font system unchanged:

- **EN body**: Plus Jakarta Sans (400/500/600/700)
- **AR body**: Cairo (400/500/600/700)
- **EN serif**: Cormorant Garamond (headers, decorative)
- **AR serif**: Amiri (headers, Quranic text)
- **AR display**: Aref Ruqaa (brand/logo)
- **Mono**: DM Mono (numbers, values)

Retain the responsive fluid type scale (`clamp()` values).

## Background & Atmosphere

### Geometric Star Pattern
- Keep the Islamic 8-pointed star SVG pattern
- Reduce opacity: 4% → 2-3%
- Warmer gradient wash: gold-pale + sage-green (not bright emerald)
- Subtle vignette at edges

### Card Treatments
- Softer shadows with warm tone: `rgba(44, 40, 36, 0.06)` instead of `rgba(0, 0, 0, 0.06)`
- Warm border: `stone-200` (#EBE8E2)
- Gentle hover: translateY(-1px) + shadow increase
- Border-radius: 12px (matches current --radius-md)

### Navbar
- Keep glassmorphism (backdrop-filter blur)
- Background: `green-800` at ~90% opacity
- Border-bottom: gold at 15% opacity
- Same pattern as current but with softened green

## Dark Mode

Warm dark theme (not cool/blue-gray):

| Element | Color |
|---------|-------|
| Background | stone-950 (#1C1A17) |
| Surface/Cards | stone-900 (#2C2824) |
| Borders | stone-700 (#4E4944) |
| Primary text | stone-100 (#F5F3EF) |
| Secondary text | stone-400 (#B5AFA5) |
| Green accent | Slightly brighter/luminous |
| Gold accent | Richer, brighter (#D4B96A) |

Nuxt UI handles dark mode via `color-mode` module. Custom overrides via `@theme` dark variants.

## Animation & Transitions

Keep the current animation system:
- Page transitions: fadeUp/viewIn
- Element reveal: fadeUp with staggered delays
- Interactive: 0.2s ease-out
- Easing: `cubic-bezier(0.16, 1, 0.3, 1)`
- Respects `prefers-reduced-motion`

## Accessibility

Nuxt UI provides built-in:
- Focus management for modals/overlays
- Keyboard navigation for menus/selects
- ARIA attributes on all interactive components
- Screen reader announcements for toasts

Keep existing:
- `aria-label` on custom elements
- `aria-hidden` on decorative icons
- Semantic HTML structure

## Files to Change

### New/Modified Configuration
- `nuxt.config.ts` — Add `@nuxt/ui` module, remove `@tailwindcss/vite`
- `app/app.config.ts` — Nuxt UI theme colors + component overrides
- `app/assets/css/main.css` — Custom color definitions via `@theme`, import `@nuxt/ui`
- `app/assets/css/base.css` — Remove duplicated dark mode overrides (Nuxt UI handles), keep animations + geometric pattern
- `app/app.vue` — Wrap with `UApp`

### Component Rewrites (20 files)
- `app/components/AppNavbar.vue`
- `app/components/AppBottomNav.vue`
- `app/components/AppModal.vue` → May become thin wrapper or removed
- `app/components/AppToast.vue` → Remove (use `useToast()`)
- `app/components/OfflineBanner.vue`
- `app/components/SyncIndicator.vue`
- `app/components/calculator/PriceInputs.vue`
- `app/components/calculator/AssetRow.vue`
- `app/components/calculator/AssetSection.vue`
- `app/components/calculator/CustomAssets.vue`
- `app/components/calculator/DeductionInputs.vue`
- `app/components/calculator/SummaryPanel.vue`
- `app/components/tracker/Summary.vue`
- `app/components/tracker/PaymentTable.vue`
- `app/components/tracker/PaymentRow.vue`
- `app/components/tracker/PaidBanner.vue`
- `app/components/profile/AccountCard.vue`
- `app/components/profile/SyncCard.vue`
- `app/components/profile/DataManagement.vue`
- `app/components/profile/AboutCard.vue`

### Page Updates (4 files)
- `app/pages/index.vue` — UButton for CTAs
- `app/pages/calculator.vue` — Layout restructure with UCard
- `app/pages/tracker.vue` — UTable integration
- `app/pages/profile.vue` — UCard layout

### Composables
- `app/composables/useToast.ts` — Update to use Nuxt UI's `useToast()`

### Layout
- `app/layouts/default.vue` — Remove AppToast, update modal to UModal

## Out of Scope
- No new features or pages
- No changes to Pinia stores or business logic
- No i18n key changes (beyond what's already done)
- No changes to Google Auth/Drive sync logic

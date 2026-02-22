# Icon Rework Design — Lucide via @nuxt/icon

## Problem

The app uses 20+ icons implemented as HTML entities, emojis, Unicode escapes, and CSS pseudo-elements. These render inconsistently across platforms, lack visual cohesion, and are hard to maintain.

## Solution

Replace all non-brand icons with Lucide icons from icones.js.org, integrated via the `@nuxt/icon` Nuxt module (Iconify-based).

## Decisions

- **Icon set**: Lucide — clean, consistent 24x24 stroke icons
- **Integration**: `@nuxt/icon` module — auto-imports `<Icon>` component, tree-shakes, SSR-safe
- **Brand icons**: Google logo and Google Drive logo stay as inline SVGs (brand-specific, multi-color)
- **Decorative elements**: CSS ornamental diamonds (◆, ♦) stay as CSS — they're decorative, not functional icons

## Icon Mapping

| Current | Component | Lucide Name |
|---------|-----------|-------------|
| ⚙ (entity) | AppNavbar | `lucide:settings` |
| 🏠 (emoji) | AppBottomNav | `lucide:house` |
| 🧮 (emoji) | AppBottomNav | `lucide:calculator` |
| 📋 (emoji) | AppBottomNav | `lucide:clipboard-list` |
| ⚙️ (emoji) | AppBottomNav | `lucide:settings` |
| ☁ (entity) | default.vue layout | `lucide:cloud` |
| ↻ (entity) | SyncCard | `lucide:refresh-cw` |
| ✓ (entity) | AppToast success | `lucide:check` |
| ✗ (entity) | AppToast error | `lucide:x` |
| ⚠ (entity) | AppToast warning | `lucide:triangle-alert` |
| ℹ (entity) | AppToast info | `lucide:info` |
| × (entity) | PaymentRow delete | `lucide:trash-2` |
| 🍽 (entity) | PaymentTable empty | `lucide:scroll-text` |
| 🎉 (entity) | PaidBanner success | `lucide:party-popper` |
| ℹ️ (entity) | PaidBanner info | `lucide:info` |
| 📡 (entity) | OfflineBanner | `lucide:wifi-off` |
| 🧮 (entity) | SummaryPanel empty | `lucide:calculator` |
| ✔ (entity) | SummaryPanel nisab met | `lucide:check-circle` |
| ✘ (entity) | SummaryPanel nisab not | `lucide:x-circle` |
| ✕ (entity) | CustomAssets delete | `lucide:trash-2` |

## Integration Steps

1. Install `@nuxt/icon` and add to nuxt.config.ts modules
2. Replace icons in each component file (13 files total)
3. Clean up unused CSS icon classes
4. Verify all icons render correctly in both LTR and RTL modes
5. Run existing tests to ensure no regressions

## Files to Modify

- `nuxt.config.ts` — add @nuxt/icon module
- `app/components/AppNavbar.vue` — settings gear
- `app/components/AppBottomNav.vue` — 4 nav icons
- `app/components/AppToast.vue` — 4 toast type icons
- `app/components/AppModal.vue` — check if close button needs icon
- `app/components/OfflineBanner.vue` — wifi-off icon
- `app/components/SyncIndicator.vue` — check for icons
- `app/layouts/default.vue` — cloud conflict icon
- `app/components/profile/SyncCard.vue` — refresh icon
- `app/components/tracker/PaymentRow.vue` — delete icon
- `app/components/tracker/PaymentTable.vue` — empty state icon
- `app/components/tracker/Summary.vue` — check for icons
- `app/components/calculator/SummaryPanel.vue` — empty state + nisab icons
- `app/components/calculator/CustomAssets.vue` — delete icon
- `app/pages/index.vue` — keep Google SVG as-is
- `app/assets/css/base.css` — clean up icon CSS if needed

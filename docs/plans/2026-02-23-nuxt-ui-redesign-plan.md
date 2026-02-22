# Nuxt UI v4 Redesign Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Replace all custom UI components with Nuxt UI v4 and apply a softened "Serene Mosque Interior" color palette for a calm, elegant Islamic aesthetic.

**Architecture:** Install `@nuxt/ui` (v4, includes Pro), remove `@tailwindcss/vite` (Nuxt UI handles Tailwind internally), define custom color scales in `@theme`, configure semantic colors in `app.config.ts`, then rewrite each component to use Nuxt UI primitives. Work bottom-up: foundation first, then shared components, then page-specific components, then pages.

**Tech Stack:** Nuxt 4, Nuxt UI v4, Tailwind CSS v4, Pinia, @nuxtjs/i18n, Lucide icons via @nuxt/icon

**Design doc:** `docs/plans/2026-02-23-nuxt-ui-redesign-design.md`

---

### Task 1: Install Nuxt UI v4 and update configuration

**Files:**
- Modify: `package.json`
- Modify: `nuxt.config.ts`
- Modify: `app/assets/css/main.css`
- Modify: `app/app.config.ts`
- Modify: `app/app.vue`

**Step 1: Install @nuxt/ui**

Run: `bun add @nuxt/ui`

**Step 2: Remove @tailwindcss/vite from nuxt.config.ts**

Nuxt UI v4 handles Tailwind internally. Remove the `@tailwindcss/vite` import and `vite.plugins` entry. Add `@nuxt/ui` to modules. Remove `@nuxt/icon` (Nuxt UI includes its own icon system).

```ts
// nuxt.config.ts — remove these:
import tailwindcss from '@tailwindcss/vite'
// ...
vite: {
  plugins: [tailwindcss()],
},

// Add '@nuxt/ui' to modules, remove '@nuxt/icon':
modules: [
  '@nuxt/ui',
  '@pinia/nuxt',
  '@nuxtjs/i18n',
  '@nuxtjs/google-fonts',
  '@nuxtjs/seo',
],
```

**Step 3: Update main.css — add Nuxt UI import and new color palette**

Replace current `main.css` content. The `@import "@nuxt/ui"` must come after `@import "tailwindcss"`. Then define custom color scales (green, gold, stone) in `@theme static` with all shades 50-950. Keep existing font, spacing, shadow, and typography tokens.

New color scales from design doc:
- `--color-green-*` (sage green, 50-950)
- `--color-gold-*` (muted brass, 50-950)
- `--color-stone-*` (warm neutrals, 50-950)

Keep legacy tokens (--color-g-*, --color-gold, --color-parchment-*) as aliases pointing to new scale values so existing components don't break during migration. Remove aliases once all components are migrated.

**Step 4: Update app.config.ts — add Nuxt UI theme**

```ts
export default defineAppConfig({
  googleClientId: '801391702852-a3p2vh875rp941ggu83g5ge2970i64c1.apps.googleusercontent.com',
  driveScope: 'https://www.googleapis.com/auth/drive.appdata',
  driveFileName: 'zakat-app-data.json',
  appVersion: 1,
  ui: {
    colors: {
      primary: 'green',
      neutral: 'stone',
    },
  },
})
```

**Step 5: Wrap app.vue with UApp**

```vue
<template>
  <UApp>
    <NuxtLayout>
      <NuxtPage />
    </NuxtLayout>
  </UApp>
</template>
```

**Step 6: Run dev server and verify it starts**

Run: `bun run dev`
Expected: App starts without errors. Existing components still render (may look different due to Tailwind reset changes).

**Step 7: Run tests**

Run: `bun run test`
Expected: All existing tests pass.

**Step 8: Commit**

```bash
git add -A
git commit -m "feat: install Nuxt UI v4 with serene Islamic color palette

Add @nuxt/ui module, define custom green/gold/stone color scales,
configure semantic colors, wrap app with UApp. Remove @tailwindcss/vite
(Nuxt UI handles Tailwind internally)."
```

---

### Task 2: Update base.css — refine background pattern and animations

**Files:**
- Modify: `app/assets/css/base.css`

**Step 1: Update base.css**

- Update body background to use new `stone-50` token
- Update text color to use `stone-900`
- Soften the geometric star pattern (reduce opacity to 2-3%, use warmer gradients with gold-50 and green-50)
- Remove the dark mode CSS variable overrides section (Nuxt UI handles dark mode via its color system). Keep only dark mode overrides for the geometric background pattern and any custom element overrides.
- Keep all `@keyframes` animations (fadeUp, fadeIn, viewIn, viewOut, slideDown, rowDelete, shimmer)
- Keep print styles
- Keep `prefers-reduced-motion` support

**Step 2: Run dev server and verify background renders correctly**

Run: `bun run dev`
Expected: Warmer background with subtler geometric pattern.

**Step 3: Commit**

```bash
git commit -m "style: refine background pattern and base styles for warm aesthetic"
```

---

### Task 3: Rewrite useToast composable to use Nuxt UI toast

**Files:**
- Modify: `app/composables/useToast.ts`

**Step 1: Rewrite useToast.ts**

Replace custom toast implementation with a wrapper around Nuxt UI's `useToast()`. Map the existing `showToast(message, type)` API to Nuxt UI's toast API so callers don't need to change.

```ts
export function useToast() {
  const toast = useNuxtUIToast() // or however Nuxt UI exports it

  function showToast(message: string, type: 'success' | 'error' | 'warning' | 'info' = 'success', duration = 3000) {
    const colorMap = { success: 'green', error: 'red', warning: 'yellow', info: 'blue' } as const
    const iconMap = { success: 'lucide:check-circle', error: 'lucide:x-circle', warning: 'lucide:triangle-alert', info: 'lucide:info' } as const
    toast.add({
      title: message,
      color: colorMap[type],
      icon: iconMap[type],
      duration,
    })
  }

  return { showToast }
}
```

Note: Check Nuxt UI v4 docs for exact `useToast()` import name and API shape. It may be auto-imported.

**Step 2: Verify toast works**

Open dev server, trigger a toast (e.g., via sign-out). Expected: Nuxt UI styled toast appears.

**Step 3: Commit**

```bash
git commit -m "refactor: migrate useToast to Nuxt UI toast system"
```

---

### Task 4: Rewrite default layout — UModal, remove AppToast

**Files:**
- Modify: `app/layouts/default.vue`
- Delete or empty: `app/components/AppToast.vue` (no longer needed, UApp handles toasts)

**Step 1: Update default.vue**

- Remove `<AppToast />` (Nuxt UI's UApp handles toast rendering)
- Replace `<AppModal v-model="syncConflict">` with `<UModal v-model:open="syncConflict">`
- Replace custom `.btn` / `.btn-primary` / `.btn-outline` with `<UButton>` components
- Remove all scoped CSS (Nuxt UI handles button/modal styling)

```vue
<template>
  <div>
    <AppNavbar />
    <OfflineBanner />
    <main class="pt-[--spacing-navbar-h] relative z-[1] min-h-screen">
      <slot />
    </main>
    <AppBottomNav />

    <UModal v-model:open="syncConflict">
      <template #content>
        <div class="p-6 text-center">
          <Icon name="lucide:cloud" size="48" class="mb-3 opacity-80 text-(--color-stone-600)" />
          <h3 class="text-lg font-bold text-(--color-stone-800) mb-2">{{ t('sync.conflictTitle') }}</h3>
          <p class="text-base text-(--color-stone-500) leading-normal mb-2">{{ t('sync.conflictHint') }}</p>
          <p v-if="cloudData?.modifiedTime" class="text-xs text-(--color-stone-400) mb-6">
            {{ t('sync.cloudDataFrom') }} {{ new Date(cloudData.modifiedTime).toLocaleDateString() }}
          </p>
          <div class="flex gap-3 justify-center">
            <UButton variant="outline" color="neutral" @click="resolveKeepLocal">
              {{ t('sync.keepLocal') }}
            </UButton>
            <UButton @click="resolveUseCloud">
              {{ t('sync.useCloud') }}
            </UButton>
          </div>
        </div>
      </template>
    </UModal>
  </div>
</template>
```

**Step 2: Remove or empty AppToast.vue**

Either delete the file or replace contents with an empty component that renders nothing (in case it's still referenced somewhere).

**Step 3: Run dev server and test modal**

Trigger a sync conflict (if possible) or verify the layout renders without errors.

**Step 4: Commit**

```bash
git commit -m "refactor: migrate layout to UModal, remove custom AppToast"
```

---

### Task 5: Rewrite AppNavbar

**Files:**
- Modify: `app/components/AppNavbar.vue`

**Step 1: Rewrite AppNavbar.vue**

Replace custom nav with Nuxt UI components:
- Keep the custom glassmorphism wrapper `<nav>` (this is unique styling)
- Use `<UNavigationMenu>` or simple `<NuxtLink>` with Nuxt UI styling for nav links
- Use `<UButton>` for the language toggle buttons
- Use `<UAvatar>` for user avatar
- Keep the brand logo as custom (Aref Ruqaa font, gold color)
- Remove all scoped CSS that Nuxt UI now handles
- Keep glassmorphism CSS (backdrop-filter, bg opacity) and mobile hide rules

**Step 2: Run dev server and verify navbar**

Expected: Navbar renders with same layout, using Nuxt UI button/avatar components.

**Step 3: Commit**

```bash
git commit -m "refactor: migrate AppNavbar to Nuxt UI components"
```

---

### Task 6: Rewrite AppBottomNav

**Files:**
- Modify: `app/components/AppBottomNav.vue`

**Step 1: Rewrite AppBottomNav.vue**

- Use `<UButton>` with `variant="ghost"` for nav items
- Keep safe-area-inset padding
- Keep mobile-only display logic
- Use Lucide icons via `icon` prop on UButton

**Step 2: Verify on mobile viewport**

**Step 3: Commit**

```bash
git commit -m "refactor: migrate AppBottomNav to Nuxt UI buttons"
```

---

### Task 7: Rewrite OfflineBanner and SyncIndicator

**Files:**
- Modify: `app/components/OfflineBanner.vue`
- Modify: `app/components/SyncIndicator.vue`

**Step 1: Rewrite OfflineBanner.vue**

Replace with `<UAlert>` using warning color, icon, and sticky positioning.

**Step 2: Rewrite SyncIndicator.vue**

Replace with `<UBadge>` or `<UChip>` showing sync status with appropriate color and icon.

**Step 3: Commit**

```bash
git commit -m "refactor: migrate OfflineBanner and SyncIndicator to Nuxt UI"
```

---

### Task 8: Rewrite calculator components — PriceInputs, AssetRow, AssetSection, DeductionInputs

**Files:**
- Modify: `app/components/calculator/PriceInputs.vue`
- Modify: `app/components/calculator/AssetRow.vue`
- Modify: `app/components/calculator/AssetSection.vue`
- Modify: `app/components/calculator/DeductionInputs.vue`

**Step 1: Rewrite AssetRow.vue**

Replace custom form inputs with `<UFormField>` + `<UInput>` or `<UInputNumber>`. Keep the grid layout for label/input/unit/value. Use Nuxt UI's built-in focus states and sizing.

**Step 2: Rewrite AssetSection.vue**

Wrap asset groups in `<UCard>` with section title in header slot.

**Step 3: Rewrite PriceInputs.vue**

Same pattern as AssetRow — `<UCard>` wrapper with `<UFormField>` + `<UInput>` for each price.

**Step 4: Rewrite DeductionInputs.vue**

Same pattern — `<UCard>` + form fields.

**Step 5: Run dev server, navigate to /calculator**

Expected: All input fields render with Nuxt UI styling, values still bind correctly to Pinia store.

**Step 6: Commit**

```bash
git commit -m "refactor: migrate calculator form components to Nuxt UI"
```

---

### Task 9: Rewrite CustomAssets

**Files:**
- Modify: `app/components/calculator/CustomAssets.vue`

**Step 1: Rewrite CustomAssets.vue**

- Use `<UCard>` wrapper
- Use `<UInput>` for label and value fields
- Use `<UButton>` for add/delete actions
- Keep dynamic row add/remove logic

**Step 2: Verify adding/removing custom assets works**

**Step 3: Commit**

```bash
git commit -m "refactor: migrate CustomAssets to Nuxt UI"
```

---

### Task 10: Rewrite SummaryPanel

**Files:**
- Modify: `app/components/calculator/SummaryPanel.vue`

**Step 1: Rewrite SummaryPanel.vue**

This is the most complex component. Keep the dark gradient background as custom styling (it's a signature visual element). Use `<UCard>` as the base structure with custom `ui` prop overrides for dark styling. Use `<UBadge>` for the nisab met/not-met indicator. Use `<UButton>` for the "Track Payments" CTA. Keep the shimmer progress bar animation.

**Step 2: Verify summary panel renders with correct values**

Check gross assets, deductions, net wealth, nisab threshold, zakat due amounts.

**Step 3: Commit**

```bash
git commit -m "refactor: migrate SummaryPanel to Nuxt UI with dark theme"
```

---

### Task 11: Rewrite tracker components — Summary, PaidBanner

**Files:**
- Modify: `app/components/tracker/Summary.vue`
- Modify: `app/components/tracker/PaidBanner.vue`

**Step 1: Rewrite tracker Summary.vue**

Use `<UCard>` for the stat cards (due, paid, remaining). Use Nuxt UI typography utilities.

**Step 2: Rewrite PaidBanner.vue**

Replace with `<UAlert>` using success color and celebratory icon.

**Step 3: Commit**

```bash
git commit -m "refactor: migrate tracker Summary and PaidBanner to Nuxt UI"
```

---

### Task 12: Rewrite PaymentTable and PaymentRow

**Files:**
- Modify: `app/components/tracker/PaymentTable.vue`
- Modify: `app/components/tracker/PaymentRow.vue`

**Step 1: Rewrite PaymentTable.vue**

Use `<UTable>` with column definitions. Define columns for date, recipient, category, amount, notes, and actions. Use UTable's empty state slot for the "no payments" message.

**Step 2: Rewrite PaymentRow.vue**

Each row uses inline `<UInput>`, `<USelect>` for category dropdown, `<UInputNumber>` for amount, and `<UButton>` for delete. These render inside UTable cells.

Note: Depending on UTable's API, rows with inline editing may need custom cell slots rather than a separate PaymentRow component. Check if UTable supports `#cell-{column}` slots and adapt accordingly.

**Step 3: Verify adding, editing, and deleting payments**

**Step 4: Commit**

```bash
git commit -m "refactor: migrate PaymentTable to Nuxt UI UTable with inline editing"
```

---

### Task 13: Rewrite profile components — AccountCard, SyncCard, DataManagement, AboutCard

**Files:**
- Modify: `app/components/profile/AccountCard.vue`
- Modify: `app/components/profile/SyncCard.vue`
- Modify: `app/components/profile/DataManagement.vue`
- Modify: `app/components/profile/AboutCard.vue`

**Step 1: Rewrite AccountCard.vue**

Use `<UCard>` with header slot. Use `<UAvatar>` for user avatar. Use `<UButton>` for sign-in/sign-out.

**Step 2: Rewrite SyncCard.vue**

Use `<UCard>` + `<UBadge>` for sync status + `<UButton>` for sync/reconnect/disconnect actions.

**Step 3: Rewrite DataManagement.vue**

Use `<UCard>` + `<UButton>` for export/import/clear actions. Keep the file input logic. Use `<UModal>` for import confirmation dialog.

**Step 4: Rewrite AboutCard.vue**

Use `<UCard>` with simple rows for version, source, privacy.

**Step 5: Verify profile page — all cards render, actions work**

**Step 6: Commit**

```bash
git commit -m "refactor: migrate profile cards to Nuxt UI"
```

---

### Task 14: Update landing page

**Files:**
- Modify: `app/pages/index.vue`

**Step 1: Update index.vue**

- Keep the bismillah, verse, and ornamental sections as custom (these are the app's signature Islamic design elements)
- Replace CTA `<button class="btn-cta">` with `<UButton size="lg">`
- Replace Google sign-in `<button class="btn-google">` with `<UButton variant="outline" color="neutral">`
- Remove custom button CSS
- Keep verse typography, separator, and ornament CSS

**Step 2: Verify landing page renders correctly in both locales**

**Step 3: Commit**

```bash
git commit -m "refactor: migrate landing page buttons to Nuxt UI"
```

---

### Task 15: Update calculator, tracker, and profile pages

**Files:**
- Modify: `app/pages/calculator.vue`
- Modify: `app/pages/tracker.vue`
- Modify: `app/pages/profile.vue`

**Step 1: Update calculator.vue**

Review page layout. May need to adjust container classes for Nuxt UI's default spacing. Remove any page-level custom CSS that's now handled by component styles.

**Step 2: Update tracker.vue**

Same — review layout, clean up custom CSS.

**Step 3: Update profile.vue**

Same — review layout, clean up custom CSS.

**Step 4: Commit**

```bash
git commit -m "refactor: clean up page layouts for Nuxt UI components"
```

---

### Task 16: Remove AppModal.vue, clean up dead code

**Files:**
- Delete: `app/components/AppModal.vue` (replaced by UModal everywhere)
- Delete: `app/components/AppToast.vue` (if not already removed)
- Modify: `app/assets/css/main.css` — Remove legacy color aliases (--color-g-*, --color-parchment-*, etc.) if all references are migrated

**Step 1: Search for any remaining references to AppModal or AppToast**

Run: `grep -r "AppModal\|AppToast" app/`
Expected: No matches (already migrated in previous tasks).

**Step 2: Delete the files**

**Step 3: Remove legacy color token aliases from main.css**

Only remove aliases that are no longer referenced anywhere. Search each one first.

**Step 4: Commit**

```bash
git commit -m "chore: remove replaced custom components and legacy color tokens"
```

---

### Task 17: Component theme overrides in app.config.ts

**Files:**
- Modify: `app/app.config.ts`

**Step 1: Add Nuxt UI component theme overrides**

Fine-tune the global component styles to match the serene Islamic aesthetic:

```ts
ui: {
  colors: {
    primary: 'green',
    neutral: 'stone',
  },
  card: {
    slots: {
      root: 'rounded-xl shadow-sm border border-(--color-stone-200)',
    },
  },
  button: {
    defaultVariants: {
      color: 'primary',
    },
  },
  // ... other component overrides as needed
}
```

Adjust based on what looks right in the dev server. This is iterative visual tuning.

**Step 2: Commit**

```bash
git commit -m "style: fine-tune Nuxt UI component theme for Islamic aesthetic"
```

---

### Task 18: Final polish — dark mode, RTL, and visual QA

**Files:**
- Various component files for tweaks

**Step 1: Test dark mode**

Toggle system dark mode. Verify:
- Warm dark backgrounds (not cool blue-gray)
- Cards, modals, and toasts look correct
- Green and gold accents are visible and legible
- Geometric pattern adapts

**Step 2: Test RTL (Arabic locale)**

Switch to Arabic. Verify:
- All components flip correctly
- Text alignment is right-to-left
- Nav items, buttons, and cards are mirrored
- Arabic serif fonts render for headers

**Step 3: Test mobile responsive**

Resize to mobile viewport. Verify:
- Bottom nav shows, top nav links hide
- Cards stack vertically
- Table scrolls horizontally if needed
- Modals are fullscreen or appropriately sized

**Step 4: Fix any issues found**

**Step 5: Commit**

```bash
git commit -m "style: dark mode, RTL, and responsive polish"
```

---

### Task 19: Run tests and final build

**Files:** None (verification only)

**Step 1: Run unit tests**

Run: `bun run test`
Expected: All tests pass.

**Step 2: Run production build**

Run: `bun run build`
Expected: Build succeeds without errors.

**Step 3: Preview production build**

Run: `bun run preview`
Expected: App works correctly in production mode.

**Step 4: Commit any final fixes**

```bash
git commit -m "fix: resolve test/build issues from Nuxt UI migration"
```

---

### Task 20: Remove @tailwindcss/vite dependency

**Files:**
- Modify: `package.json`

**Step 1: Uninstall the package**

Run: `bun remove @tailwindcss/vite`

**Step 2: Verify dev server still works**

Run: `bun run dev`
Expected: No errors. Nuxt UI provides Tailwind internally.

**Step 3: Commit**

```bash
git commit -m "chore: remove @tailwindcss/vite (Nuxt UI provides Tailwind)"
```

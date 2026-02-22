# Icon Rework Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Replace all HTML entity/emoji/Unicode icons with Lucide icons via `@nuxt/icon` module for visual consistency.

**Architecture:** Install `@nuxt/icon` (Iconify-based) as a Nuxt module. Replace inline HTML entities/emojis with `<Icon name="lucide:icon-name" />` components. Keep branded SVGs (Google, Drive) and CSS decorative elements as-is.

**Tech Stack:** @nuxt/icon, Iconify, Lucide icon set

---

### Task 1: Install @nuxt/icon and configure

**Files:**
- Modify: `package.json`
- Modify: `nuxt.config.ts:8-12`

**Step 1: Install the module**

Run: `bun add @nuxt/icon`

**Step 2: Add module to nuxt.config.ts**

In `nuxt.config.ts`, add `'@nuxt/icon'` to the `modules` array:

```ts
modules: [
  '@pinia/nuxt',
  '@nuxtjs/i18n',
  '@nuxtjs/google-fonts',
  '@nuxt/icon',
],
```

**Step 3: Verify dev server starts**

Run: `bun run dev`
Expected: Server starts without errors, `@nuxt/icon` module loads.

**Step 4: Commit**

```bash
git add package.json bun.lockb nuxt.config.ts
git commit -m "feat: add @nuxt/icon module for Lucide icons"
```

---

### Task 2: Replace icons in AppBottomNav

**Files:**
- Modify: `app/components/AppBottomNav.vue:9-14,26,76-78`

**Step 1: Update navItems to use icon names instead of emojis**

Replace the `navItems` array (lines 9-14):

```ts
const navItems = [
  { path: '/', icon: 'lucide:house', labelKey: 'nav.home' },
  { path: '/calculator', icon: 'lucide:calculator', labelKey: 'nav.calculator' },
  { path: '/tracker', icon: 'lucide:clipboard-list', labelKey: 'nav.tracker' },
  { path: '/profile', icon: 'lucide:settings', labelKey: 'nav.settings' },
]
```

**Step 2: Replace emoji span with Icon component**

Replace line 26 (`<span>{{ item.icon }}</span>`) with:

```vue
<Icon :name="item.icon" size="20" />
```

**Step 3: Update CSS for Icon component**

Replace the `.bnav-btn span:first-child` rule (lines 76-78) with:

```css
.bnav-btn .icon {
  font-size: 20px;
}
```

Note: The `<Icon>` component renders as an inline element. The `size="20"` prop handles sizing.

**Step 4: Verify visually**

Run: `bun run dev` — navigate to mobile view, check bottom nav icons render correctly.

**Step 5: Commit**

```bash
git add app/components/AppBottomNav.vue
git commit -m "feat: replace emoji nav icons with Lucide icons"
```

---

### Task 3: Replace icon in AppNavbar

**Files:**
- Modify: `app/components/AppNavbar.vue:110`

**Step 1: Replace gear entity with Icon component**

Replace line 110 (`&#9881;`) with:

```vue
<Icon name="lucide:settings" size="18" />
```

**Step 2: Verify visually**

Check desktop navbar — gear icon should appear for guest users.

**Step 3: Commit**

```bash
git add app/components/AppNavbar.vue
git commit -m "feat: replace navbar settings icon with Lucide"
```

---

### Task 4: Replace icons in AppToast

**Files:**
- Modify: `app/components/AppToast.vue:16-19`

**Step 1: Replace HTML entity spans with Icon components**

Replace lines 16-19 with:

```vue
<Icon v-if="toast.type === 'success'" name="lucide:check" size="16" aria-hidden="true" />
<Icon v-else-if="toast.type === 'error'" name="lucide:x" size="16" aria-hidden="true" />
<Icon v-else-if="toast.type === 'warning'" name="lucide:triangle-alert" size="16" aria-hidden="true" />
<Icon v-else name="lucide:info" size="16" aria-hidden="true" />
```

**Step 2: Verify visually**

Trigger toasts of each type to confirm icons render correctly.

**Step 3: Commit**

```bash
git add app/components/AppToast.vue
git commit -m "feat: replace toast icons with Lucide icons"
```

---

### Task 5: Replace icon in OfflineBanner

**Files:**
- Modify: `app/components/OfflineBanner.vue:30`

**Step 1: Replace signal entity with Icon component**

Replace line 30 (`<span aria-hidden="true">&#128225;</span>`) with:

```vue
<Icon name="lucide:wifi-off" size="16" aria-hidden="true" />
```

**Step 2: Commit**

```bash
git add app/components/OfflineBanner.vue
git commit -m "feat: replace offline banner icon with Lucide wifi-off"
```

---

### Task 6: Replace icon in default layout (sync conflict modal)

**Files:**
- Modify: `app/layouts/default.vue:21,45-48`

**Step 1: Replace cloud entity with Icon component**

Replace line 21 (`<div class="sync-conflict-icon">&#9729;</div>`) with:

```vue
<div class="sync-conflict-icon">
  <Icon name="lucide:cloud" size="48" />
</div>
```

**Step 2: Update CSS**

Replace the `.sync-conflict-icon` rule (lines 45-48):

```css
.sync-conflict-icon {
  margin-bottom: 12px;
  opacity: 0.8;
  color: var(--color-parchment-600);
}
```

Remove `font-size: 48px` since the Icon `size` prop handles it.

**Step 3: Commit**

```bash
git add app/layouts/default.vue
git commit -m "feat: replace sync conflict cloud icon with Lucide"
```

---

### Task 7: Replace icon in SyncCard

**Files:**
- Modify: `app/components/profile/SyncCard.vue:90,321-325`

**Step 1: Replace refresh entity with Icon component**

Replace line 90 (`<span :class="{ 'spin-icon': isSyncing }">&#8635;</span>`) with:

```vue
<Icon name="lucide:refresh-cw" size="16" :class="{ 'spin-icon': isSyncing }" />
```

**Step 2: Verify spin animation still works**

The `.spin-icon` CSS class (lines 321-325) applies `animation: spinIcon 1s linear infinite`. This should work on the `<Icon>` component since it renders inline SVG.

**Step 3: Commit**

```bash
git add app/components/profile/SyncCard.vue
git commit -m "feat: replace sync refresh icon with Lucide refresh-cw"
```

---

### Task 8: Replace icons in PaymentRow and PaymentTable

**Files:**
- Modify: `app/components/tracker/PaymentRow.vue:89`
- Modify: `app/components/tracker/PaymentTable.vue:65,74`

**Step 1: Replace delete icon in PaymentRow**

Replace line 89 (`&times;`) with:

```vue
<Icon name="lucide:trash-2" size="16" />
```

**Step 2: Replace empty state icon in PaymentTable**

Replace line 65 (`<div class="te-icon">&#127769;</div>`) with:

```vue
<div class="te-icon">
  <Icon name="lucide:scroll-text" size="44" />
</div>
```

Update the `.te-icon` CSS (line 184-187) — remove `font-size: 44px` since size is on the Icon:

```css
.te-icon {
  margin-bottom: 14px;
  color: var(--color-parchment-300);
}
```

**Step 3: Replace + icon in add row button**

Replace line 74 (`<span>+</span>`) with:

```vue
<Icon name="lucide:plus" size="16" />
```

**Step 4: Commit**

```bash
git add app/components/tracker/PaymentRow.vue app/components/tracker/PaymentTable.vue
git commit -m "feat: replace tracker icons with Lucide"
```

---

### Task 9: Replace icons in PaidBanner

**Files:**
- Modify: `app/components/tracker/PaidBanner.vue:17,26`

**Step 1: Replace party popper entity**

Replace line 17 — change `&#127881; {{ t('tracker.complete') }}` to:

```vue
<Icon name="lucide:party-popper" size="20" /> {{ t('tracker.complete') }} &mdash; {{ t('tracker.barakAllah') }}
```

**Step 2: Replace info entity**

Replace line 26 — change `&#8505;&#65039; {{ t('tracker.noZakat') }}` to:

```vue
<Icon name="lucide:info" size="20" /> {{ t('tracker.noZakat') }}
```

**Step 3: Commit**

```bash
git add app/components/tracker/PaidBanner.vue
git commit -m "feat: replace paid banner icons with Lucide"
```

---

### Task 10: Replace icons in SummaryPanel

**Files:**
- Modify: `app/components/calculator/SummaryPanel.vue:57,134,314-316`

**Step 1: Replace empty state icon**

Replace line 57 (`<div class="ce-icon">&#x1F9EE;</div>`) with:

```vue
<div class="ce-icon">
  <Icon name="lucide:calculator" size="44" />
</div>
```

Update `.calc-empty .ce-icon` CSS (lines 220-224) — remove `font-size` and `filter`:

```css
.calc-empty .ce-icon {
  margin-bottom: 14px;
  color: rgba(255, 255, 255, 0.4);
}
```

**Step 2: Replace nisab badge icons**

Replace line 134 (`<span class="nisab-icon">{{ store.nisabMet ? '&#x2714;' : '&#x2718;' }}</span>`) with:

```vue
<Icon :name="store.nisabMet ? 'lucide:check-circle' : 'lucide:x-circle'" size="18" class="nisab-icon" />
```

The `.nisab-icon` CSS (line 314-316) — remove `font-size: 18px` since Icon handles size.

**Step 3: Commit**

```bash
git add app/components/calculator/SummaryPanel.vue
git commit -m "feat: replace calculator summary icons with Lucide"
```

---

### Task 11: Replace icon in CustomAssets

**Files:**
- Modify: `app/components/calculator/CustomAssets.vue:53`

**Step 1: Replace delete icon**

Replace line 53 — change `&#x2715;` inside the button to:

```vue
<Icon name="lucide:trash-2" size="16" />
```

**Step 2: Commit**

```bash
git add app/components/calculator/CustomAssets.vue
git commit -m "feat: replace custom asset delete icon with Lucide"
```

---

### Task 12: Run tests and final verification

**Files:** None (verification only)

**Step 1: Run all tests**

Run: `bun run test`
Expected: All tests pass.

**Step 2: Verify dev server**

Run: `bun run dev`
Check these pages visually:
- `/` — Google sign-in button (brand SVG preserved), ornamental diamond (CSS preserved)
- `/calculator` — section title diamond (CSS preserved), empty state, nisab badge, summary panel
- `/tracker` — empty state, payment rows delete buttons, paid banner, add row button
- `/profile` — sync card refresh icon, Google Drive logo (brand SVG preserved)
- Mobile bottom nav — all 4 icons
- Desktop navbar — settings gear for guests
- Toggle to RTL (Arabic) — verify icons don't flip unexpectedly

**Step 3: Build check**

Run: `bun run build`
Expected: Build succeeds without errors.

**Step 4: Commit (if any fixes needed)**

```bash
git add -A
git commit -m "fix: resolve any remaining icon issues"
```

# Typography Overhaul Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Replace 278 hardcoded font declarations across 26 files with a unified design-token type scale, swap Playfair Display for Cormorant Garamond, and make all text fluid-responsive.

**Architecture:** Define all typography tokens as CSS custom properties in `main.css @theme`. Update `base.css` global rules. Then systematically replace hardcoded values in every component/page with token references. No structural changes to templates — only `<style>` blocks change.

**Tech Stack:** CSS custom properties, `clamp()`, Google Fonts via `@nuxtjs/google-fonts`

**Design doc:** `docs/plans/2026-02-23-typography-overhaul-design.md`

---

### Task 1: Add Typography Tokens to main.css

**Files:**
- Modify: `app/assets/css/main.css`

**Step 1: Add all typography tokens inside the existing `@theme` block**

Add after the existing `--spacing-navbar-h: 64px;` line (before the closing `}`):

```css
  /* Typography — Type Scale (fluid) */
  --text-xs:      clamp(11px, 0.2vw + 10.5px, 12px);
  --text-sm:      clamp(12px, 0.2vw + 11.5px, 13px);
  --text-base:    clamp(14px, 0.3vw + 13px,   15px);
  --text-md:      clamp(15px, 0.4vw + 14px,   17px);
  --text-lg:      clamp(18px, 0.8vw + 16px,   22px);
  --text-xl:      clamp(22px, 1.2vw + 19px,   30px);
  --text-2xl:     clamp(26px, 1.5vw + 22px,   36px);
  --text-display: clamp(32px, 2.5vw + 24px,   48px);

  /* Typography — Line Height */
  --leading-tight:   1.1;
  --leading-snug:    1.3;
  --leading-normal:  1.6;
  --leading-relaxed: 1.8;

  /* Typography — Letter Spacing */
  --tracking-tight:  -0.01em;
  --tracking-normal: 0;
  --tracking-wide:   0.03em;
  --tracking-wider:  0.06em;
  --tracking-widest: 0.1em;

  /* Typography — Font Weight */
  --weight-normal: 400;
  --weight-medium: 500;
  --weight-semi:   600;
  --weight-bold:   700;
```

**Step 2: Update `--font-en-serif` to use Cormorant Garamond**

Change:
```css
  --font-en-serif: 'Playfair Display', Georgia, serif;
```
To:
```css
  --font-en-serif: 'Cormorant Garamond', Georgia, serif;
```

**Step 3: Build to verify**

Run: `bun run build`
Expected: Build succeeds (tokens are defined but not yet consumed)

**Step 4: Commit**

```bash
git add app/assets/css/main.css
git commit -m "feat(typography): add design-token type scale and swap heading font"
```

---

### Task 2: Update Google Fonts Config

**Files:**
- Modify: `nuxt.config.ts`

**Step 1: Replace Playfair Display with Cormorant Garamond**

In the `googleFonts.families` object, change:
```ts
'Playfair Display': [400, 500, 600, 700],
```
To:
```ts
'Cormorant Garamond': [400, 500, 600, 700],
```

**Step 2: Build to verify**

Run: `bun run build`
Expected: Build succeeds

**Step 3: Commit**

```bash
git add nuxt.config.ts
git commit -m "feat(typography): switch to Cormorant Garamond in Google Fonts config"
```

---

### Task 3: Update Global Base Styles

**Files:**
- Modify: `app/assets/css/base.css`

**Step 1: Update body and heading typography**

Replace lines 6-29:
```css
body {
  font-family: var(--font-en);
  background: var(--color-off-white);
  color: var(--color-parchment-800);
  min-height: 100vh;
  overflow-x: hidden;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

[dir="rtl"] body {
  font-family: var(--font-ar);
}

h1, h2, h3 {
  font-family: var(--font-en-serif);
  line-height: 1.2;
}

[dir="rtl"] h1,
[dir="rtl"] h2,
[dir="rtl"] h3 {
  font-family: var(--font-ar-serif);
}
```

With:
```css
body {
  font-family: var(--font-en);
  font-size: var(--text-base);
  line-height: var(--leading-normal);
  background: var(--color-off-white);
  color: var(--color-parchment-800);
  min-height: 100vh;
  overflow-x: hidden;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

[dir="rtl"] body {
  font-family: var(--font-ar);
}

h1, h2, h3 {
  font-family: var(--font-en-serif);
  line-height: var(--leading-snug);
}

[dir="rtl"] h1,
[dir="rtl"] h2,
[dir="rtl"] h3 {
  font-family: var(--font-ar-serif);
}
```

**Step 2: Build and run tests**

Run: `bun run build && bun run test`
Expected: Build succeeds. Tests pass (the pre-existing `landing.verseTranslation` AR empty-key failure is unrelated).

**Step 3: Commit**

```bash
git add app/assets/css/base.css
git commit -m "feat(typography): set global body font-size and line-height from tokens"
```

---

### Task 4: Update Layout (default.vue)

**Files:**
- Modify: `app/layouts/default.vue`

**Replacements in `<style scoped>` block:**

| Line | Current | New |
|------|---------|-----|
| 54 | `font-size: 20px;` | `font-size: var(--text-lg);` |
| 55 | `font-weight: 700;` | `font-weight: var(--weight-bold);` |
| 61 | `font-size: 14px;` | `font-size: var(--text-base);` |
| 63 | `line-height: 1.6;` | `line-height: var(--leading-normal);` |
| 68 | `font-size: 12px;` | `font-size: var(--text-xs);` |
| 87 | `font-size: 13px;` | `font-size: var(--text-sm);` |
| 88 | `font-weight: 600;` | `font-weight: var(--weight-semi);` |

**Build, then commit:**

```bash
git add app/layouts/default.vue
git commit -m "feat(typography): apply tokens to default layout"
```

---

### Task 5: Update AppNavbar

**Files:**
- Modify: `app/components/AppNavbar.vue`

**Replacements:**

| Line | Current | New |
|------|---------|-----|
| 145 | `font-size: 26px;` | `font-size: var(--text-lg);` |
| 146 | `font-weight: 700;` | `font-weight: var(--weight-bold);` |
| 148 | `line-height: 1;` | `line-height: var(--leading-tight);` |
| 158 | `font-size: 28px;` | `font-size: var(--text-xl);` |
| 173 | `font-size: 13px;` | `font-size: var(--text-sm);` |
| 174 | `font-weight: 500;` | `font-weight: var(--weight-medium);` |
| 178 | `letter-spacing: 0.3px;` | `letter-spacing: var(--tracking-wide);` |
| 218 | `font-size: 13px;` | `font-size: var(--text-sm);` |
| 219 | `font-weight: 600;` | `font-weight: var(--weight-semi);` |
| 222 | `letter-spacing: 0.5px;` | `letter-spacing: var(--tracking-wider);` |
| 231 | `font-size: 15px;` | `font-size: var(--text-md);` |
| 268 | `font-size: 13px;` | `font-size: var(--text-sm);` |
| 269 | `font-weight: 700;` | `font-weight: var(--weight-bold);` |
| 285 | `font-size: 18px;` | `font-size: var(--text-md);` |

Also remove the `[dir="rtl"] .nav-logo` font-size override (line 158) — the fluid token handles it.

**Commit:**

```bash
git add app/components/AppNavbar.vue
git commit -m "feat(typography): apply tokens to AppNavbar"
```

---

### Task 6: Update Root-Level Components

**Files:**
- Modify: `app/components/AppBottomNav.vue`
- Modify: `app/components/AppToast.vue`
- Modify: `app/components/OfflineBanner.vue`
- Modify: `app/components/SyncIndicator.vue`
- Modify: `app/components/AppModal.vue` (no font changes needed, skip if none)

**AppBottomNav.vue:**
| Line | Current | New |
|------|---------|-----|
| 77 | `font-size: 12px;` | `font-size: var(--text-xs);` |
| 78 | `letter-spacing: 0.3px;` | `letter-spacing: var(--tracking-wide);` |

**AppToast.vue:**
| Line | Current | New |
|------|---------|-----|
| 44 | `font-size: 13px;` | `font-size: var(--text-sm);` |

**OfflineBanner.vue:**
| Line | Current | New |
|------|---------|-----|
| 46 | `font-size: 13px;` | `font-size: var(--text-sm);` |

**SyncIndicator.vue:**
| Line | Current | New |
|------|---------|-----|
| 34 | `font-size: 12px;` | `font-size: var(--text-xs);` |

**Commit:**

```bash
git add app/components/AppBottomNav.vue app/components/AppToast.vue app/components/OfflineBanner.vue app/components/SyncIndicator.vue
git commit -m "feat(typography): apply tokens to root-level components"
```

---

### Task 7: Update Landing Page (index.vue)

**Files:**
- Modify: `app/pages/index.vue`

**Replacements:**

| Line | Current | New |
|------|---------|-----|
| 92 | `font-size: clamp(24px, 5vw, 32px);` | `font-size: var(--text-2xl);` |
| 94 | `letter-spacing: 4px;` | `letter-spacing: var(--tracking-widest);` |
| 117 | `font-size: clamp(20px, 4vw, 26px);` | `font-size: var(--text-xl);` |
| 119 | `line-height: 1.8;` | `line-height: var(--leading-relaxed);` |
| 124 | `font-size: clamp(18px, 3.5vw, 23px);` | `font-size: var(--text-lg);` |
| 130 | `font-size: 15px;` | `font-size: var(--text-base);` |
| 132 | `line-height: 1.6;` | `line-height: var(--leading-normal);` |
| 143 | `font-size: 13px;` | `font-size: var(--text-sm);` |
| 146 | `letter-spacing: 0.5px;` | `letter-spacing: var(--tracking-wider);` |
| 154 | `font-size: 16px;` | `font-size: var(--text-md);` |
| 156 | `line-height: 1.6;` | `line-height: var(--leading-normal);` |
| 179 | `font-size: 16px;` | `font-size: var(--text-md);` |
| 180 | `font-weight: 600;` | `font-weight: var(--weight-semi);` |
| 185 | `letter-spacing: 0.5px;` | `letter-spacing: var(--tracking-wider);` |
| 197 | `font-size: 14px;` | `font-size: var(--text-base);` |
| 228 | `font-size: 13px;` | `font-size: var(--text-sm);` |
| 250 | `font-size: 14px;` | `font-size: var(--text-base);` |
| 251 | `font-weight: 600;` | `font-weight: var(--weight-semi);` |
| 280 | `font-size: 13px;` | `font-size: var(--text-sm);` |
| 291 | `font-size: 8px;` | `font-size: 8px;` (keep — decorative diamond ornament) |

**Commit:**

```bash
git add app/pages/index.vue
git commit -m "feat(typography): apply tokens to landing page"
```

---

### Task 8: Update Calculator Page + Components

**Files:**
- Modify: `app/pages/calculator.vue`
- Modify: `app/components/calculator/SummaryPanel.vue`
- Modify: `app/components/calculator/AssetRow.vue`
- Modify: `app/components/calculator/CustomAssets.vue`
- Modify: `app/components/calculator/AssetSection.vue`
- Modify: `app/components/calculator/PriceInputs.vue`
- Modify: `app/components/calculator/DeductionInputs.vue`

**calculator.vue:**

| Line | Current | New |
|------|---------|-----|
| 85 | `font-size: clamp(22px, 4vw, 30px);` | `font-size: var(--text-xl);` |
| 95 | `font-size: 8px;` | keep (ornament) |
| 102 | `font-size: 13px;` | `font-size: var(--text-sm);` |
| 104 | `letter-spacing: 0.3px;` | `letter-spacing: var(--tracking-wide);` |
| 154 | `font-size: 15px;` | `font-size: var(--text-md);` |
| 156 | `font-weight: 600;` | `font-weight: var(--weight-semi);` |
| 160 | `font-size: 17px;` | remove — fluid token handles Arabic |
| 183 | `font-size: 13px;` | `font-size: var(--text-sm);` |
| 184 | `font-weight: 500;` | `font-weight: var(--weight-medium);` |
| 187 | `letter-spacing: 0.3px;` | `letter-spacing: var(--tracking-wide);` |
| 194 | `font-weight: 600;` | `font-weight: var(--weight-semi);` |
| 208 | `font-size: 13px;` | `font-size: var(--text-sm);` |

**SummaryPanel.vue:**

| Line | Current | New |
|------|---------|-----|
| 205 | `font-size: 16px;` | `font-size: var(--text-md);` |
| 209 | `font-size: 12px;` | `font-size: var(--text-xs);` |
| 211 | `letter-spacing: 0.5px;` | `letter-spacing: var(--tracking-wider);` |
| 221 | `font-size: 44px;` | `font-size: var(--text-display);` |
| 226 | `font-size: 13px;` | `font-size: var(--text-sm);` |
| 227 | `line-height: 1.6;` | `line-height: var(--leading-normal);` |
| 249 | `font-size: 13px;` | `font-size: var(--text-sm);` |
| 259 | `font-weight: 600;` | `font-weight: var(--weight-semi);` |
| 262 | `font-size: 13px;` | `font-size: var(--text-sm);` |
| 283 | `font-size: 15px;` | `font-size: var(--text-md);` |
| 279 | `font-weight: 600;` | `font-weight: var(--weight-semi);` |
| 344 | `font-size: 12px;` | `font-size: var(--text-xs);` |
| 346 | `letter-spacing: 1.5px;` | `letter-spacing: var(--tracking-widest);` |
| 354 | `font-size: 28px;` | `font-size: var(--text-2xl);` |
| 355 | `font-weight: 700;` | `font-weight: var(--weight-bold);` |
| 357 | `line-height: 1;` | `line-height: var(--leading-tight);` |
| 421 | `font-weight: 600;` | `font-weight: var(--weight-semi);` |
| 423 | `font-size: 13px;` | `font-size: var(--text-sm);` |
| 426 | `letter-spacing: 0.3px;` | `letter-spacing: var(--tracking-wide);` |

**AssetRow.vue:**

| Line | Current | New |
|------|---------|-----|
| 62 | `font-size: 13px;` | `font-size: var(--text-sm);` |
| 68 | `font-weight: 600;` | `font-weight: var(--weight-semi);` |
| 75 | `font-size: 14px;` | `font-size: var(--text-base);` |
| 95 | `font-size: 12px;` | `font-size: var(--text-xs);` |
| 98 | `letter-spacing: 0.5px;` | `letter-spacing: var(--tracking-wider);` |
| 103 | `font-size: 13px;` | `font-size: var(--text-sm);` |
| 104 | `font-weight: 600;` | `font-weight: var(--weight-semi);` |

**CustomAssets.vue:**

| Line | Current | New |
|------|---------|-----|
| 65 | `font-size: 12px;` | `font-size: var(--text-xs);` |
| 67 | `letter-spacing: 1.5px;` | `letter-spacing: var(--tracking-widest);` |
| 95 | `font-size: 14px;` | `font-size: var(--text-base);` |
| 122 | `font-size: 12px;` | `font-size: var(--text-xs);` |
| 125 | `letter-spacing: 0.5px;` | `letter-spacing: var(--tracking-wider);` |
| 130 | `font-size: 13px;` | `font-size: var(--text-sm);` |
| 131 | `font-weight: 600;` | `font-weight: var(--weight-semi);` |
| 147 | `font-size: 16px;` | `font-size: var(--text-md);` |

**AssetSection.vue:**

| Line | Current | New |
|------|---------|-----|
| 48 | `font-size: 12px;` | `font-size: var(--text-xs);` |
| 50 | `letter-spacing: 1.5px;` | `letter-spacing: var(--tracking-widest);` |

**PriceInputs.vue:**

| Line | Current | New |
|------|---------|-----|
| 76 | `font-size: 15px;` | `font-size: var(--text-md);` |
| 78 | `font-weight: 600;` | `font-weight: var(--weight-semi);` |
| 82 | `font-size: 17px;` | remove — fluid token handles Arabic |
| 86 | `font-size: 12px;` | `font-size: var(--text-xs);` |
| 88 | `letter-spacing: 0.5px;` | `letter-spacing: var(--tracking-wider);` |
| 97 | `font-size: 13px;` | `font-size: var(--text-sm);` |
| 116 | `font-size: 12px;` | `font-size: var(--text-xs);` |
| 119 | `letter-spacing: 0.8px;` | `letter-spacing: var(--tracking-wider);` |
| 125 | `font-size: 14px;` | `font-size: var(--text-base);` |

**DeductionInputs.vue:**

| Line | Current | New |
|------|---------|-----|
| 64 | `font-size: 15px;` | `font-size: var(--text-md);` |
| 66 | `font-weight: 600;` | `font-weight: var(--weight-semi);` |
| 70 | `font-size: 17px;` | remove — fluid token handles Arabic |

**Build, test, commit:**

```bash
git add app/pages/calculator.vue app/components/calculator/
git commit -m "feat(typography): apply tokens to calculator page and components"
```

---

### Task 9: Update Tracker Page + Components

**Files:**
- Modify: `app/pages/tracker.vue`
- Modify: `app/components/tracker/PaymentTable.vue`
- Modify: `app/components/tracker/PaymentRow.vue`
- Modify: `app/components/tracker/Summary.vue`
- Modify: `app/components/tracker/PaidBanner.vue`

**tracker.vue:**

| Line | Current | New |
|------|---------|-----|
| 43 | `font-size: clamp(22px, 4vw, 30px);` | `font-size: var(--text-xl);` |
| 53 | `font-size: 8px;` | keep (ornament) |
| 60 | `font-size: 13px;` | `font-size: var(--text-sm);` |
| 62 | `letter-spacing: 0.3px;` | `letter-spacing: var(--tracking-wide);` |

**PaymentTable.vue:**

| Line | Current | New |
|------|---------|-----|
| 136 | `font-size: 15px;` | `font-size: var(--text-md);` |
| 138 | `font-weight: 600;` | `font-weight: var(--weight-semi);` |
| 142 | `font-size: 17px;` | remove — fluid token handles Arabic |
| 159 | `font-size: 13px;` | `font-size: var(--text-sm);` |
| 169 | `font-size: 12px;` | `font-size: var(--text-xs);` |
| 170 | `letter-spacing: 1.2px;` | `letter-spacing: var(--tracking-widest);` |
| 173 | `font-weight: 500;` | `font-weight: var(--weight-medium);` |
| 185 | `font-size: 44px;` | `font-size: var(--text-display);` |
| 189 | `font-size: 16px;` | `font-size: var(--text-md);` |
| 194 | `font-size: 13px;` | `font-size: var(--text-sm);` |
| 195 | `line-height: 1.6;` | `line-height: var(--leading-normal);` |
| 210 | `font-size: 12px;` | `font-size: var(--text-xs);` |
| 228 | `font-size: 12px;` | `font-size: var(--text-xs);` |
| 235 | `font-size: 15px;` | `font-size: var(--text-md);` |
| 236 | `font-weight: 700;` | `font-weight: var(--weight-bold);` |
| 258 | `font-size: 13px;` | `font-size: var(--text-sm);` |
| 259 | `font-weight: 500;` | `font-weight: var(--weight-medium);` |
| 262 | `letter-spacing: 0.3px;` | `letter-spacing: var(--tracking-wide);` |
| 289 | `font-size: 13px;` | `font-size: var(--text-sm);` |

**PaymentRow.vue:**

| Line | Current | New |
|------|---------|-----|
| 111 | `font-size: 12px;` | `font-size: var(--text-xs);` |
| 122 | `font-size: 13px;` | `font-size: var(--text-sm);` |
| 141 | `font-weight: 700;` | `font-weight: var(--weight-bold);` |
| 153 | `font-size: 16px;` | `font-size: var(--text-md);` |

**Summary.vue:**

| Line | Current | New |
|------|---------|-----|
| 97 | `font-size: 12px;` | `font-size: var(--text-xs);` |
| 99 | `letter-spacing: 1.5px;` | `letter-spacing: var(--tracking-widest);` |
| 106 | `font-size: clamp(18px, 3vw, 26px);` | `font-size: var(--text-2xl);` |
| 107 | `font-weight: 700;` | `font-weight: var(--weight-bold);` |
| 108 | `line-height: 1.1;` | `line-height: var(--leading-tight);` |
| 121 | `font-size: 12px;` | `font-size: var(--text-xs);` |

**PaidBanner.vue:**

| Line | Current | New |
|------|---------|-----|
| 39 | `font-weight: 600;` | `font-weight: var(--weight-semi);` |
| 40 | `font-size: 15px;` | `font-size: var(--text-md);` |

**Build, test, commit:**

```bash
git add app/pages/tracker.vue app/components/tracker/
git commit -m "feat(typography): apply tokens to tracker page and components"
```

---

### Task 10: Update Profile Page + Components

**Files:**
- Modify: `app/pages/profile.vue`
- Modify: `app/components/profile/AccountCard.vue`
- Modify: `app/components/profile/SyncCard.vue`
- Modify: `app/components/profile/DataManagement.vue`
- Modify: `app/components/profile/AboutCard.vue`

**profile.vue:**

| Line | Current | New |
|------|---------|-----|
| 60 | `font-size: clamp(22px, 4vw, 30px);` | `font-size: var(--text-xl);` |
| 70 | `font-size: 8px;` | keep (ornament) |
| 77 | `font-size: 13px;` | `font-size: var(--text-sm);` |
| 79 | `letter-spacing: 0.3px;` | `letter-spacing: var(--tracking-wide);` |
| 88 | `font-size: 8px;` | keep (ornament) |

**AccountCard.vue:**

| Line | Current | New |
|------|---------|-----|
| 93 | `font-size: 13px;` | `font-size: var(--text-sm);` |
| 94 | `font-weight: 600;` | `font-weight: var(--weight-semi);` |
| 97 | `letter-spacing: 1px;` | `letter-spacing: var(--tracking-widest);` |
| 152 | `font-size: 20px;` | `font-size: var(--text-lg);` |
| 153 | `font-weight: 700;` | `font-weight: var(--weight-bold);` |
| 166 | `font-size: 18px;` | `font-size: var(--text-lg);` |
| 167 | `font-weight: 600;` | `font-weight: var(--weight-semi);` |
| 173 | `font-size: 13px;` | `font-size: var(--text-sm);` |
| 186 | `font-size: 16px;` | `font-size: var(--text-md);` |
| 187 | `font-weight: 600;` | `font-weight: var(--weight-semi);` |
| 193 | `font-size: 13px;` | `font-size: var(--text-sm);` |
| 215 | `font-size: 13px;` | `font-size: var(--text-sm);` |
| 216 | `font-weight: 500;` | `font-weight: var(--weight-medium);` |
| 219 | `letter-spacing: 0.3px;` | `letter-spacing: var(--tracking-wide);` |
| 226 | `font-weight: 600;` | `font-weight: var(--weight-semi);` |
| 241 | `font-weight: 600;` | `font-weight: var(--weight-semi);` |

**SyncCard.vue:**

| Line | Current | New |
|------|---------|-----|
| 147 | `font-size: 13px;` | `font-size: var(--text-sm);` |
| 148 | `font-weight: 600;` | `font-weight: var(--weight-semi);` |
| 151 | `letter-spacing: 1px;` | `letter-spacing: var(--tracking-widest);` |
| 161 | `font-size: 12px;` | `font-size: var(--text-xs);` |
| 162 | `font-weight: 600;` | `font-weight: var(--weight-semi);` |
| 245 | `font-size: 15px;` | `font-size: var(--text-md);` |
| 246 | `font-weight: 600;` | `font-weight: var(--weight-semi);` |
| 252 | `font-size: 13px;` | `font-size: var(--text-sm);` |
| 260 | `font-size: 11px;` | `font-size: var(--text-xs);` |
| 282 | `font-size: 13px;` | `font-size: var(--text-sm);` |
| 283 | `font-weight: 600;` | `font-weight: var(--weight-semi);` |

**DataManagement.vue:**

| Line | Current | New |
|------|---------|-----|
| 159 | `font-size: 13px;` | `font-size: var(--text-sm);` |
| 160 | `font-weight: 600;` | `font-weight: var(--weight-semi);` |
| 163 | `letter-spacing: 1px;` | `letter-spacing: var(--tracking-widest);` |
| 208 | `font-size: 14px;` | `font-size: var(--text-base);` |
| 209 | `font-weight: 600;` | `font-weight: var(--weight-semi);` |
| 214 | `font-size: 12px;` | `font-size: var(--text-xs);` |
| 228 | `font-size: 13px;` | `font-size: var(--text-sm);` |
| 229 | `font-weight: 500;` | `font-weight: var(--weight-medium);` |
| 232 | `letter-spacing: 0.3px;` | `letter-spacing: var(--tracking-wide);` |
| 240 | `font-weight: 600;` | `font-weight: var(--weight-semi);` |
| 257 | `font-weight: 600;` | `font-weight: var(--weight-semi);` |
| 277 | `font-size: 20px;` | `font-size: var(--text-lg);` |
| 278 | `font-weight: 700;` | `font-weight: var(--weight-bold);` |
| 287 | `font-size: 14px;` | `font-size: var(--text-base);` |
| 289 | `line-height: 1.6;` | `line-height: var(--leading-normal);` |

**AboutCard.vue:**

| Line | Current | New |
|------|---------|-----|
| 53 | `font-size: 13px;` | `font-size: var(--text-sm);` |
| 54 | `font-weight: 600;` | `font-weight: var(--weight-semi);` |
| 57 | `letter-spacing: 1px;` | `letter-spacing: var(--tracking-widest);` |
| 85 | `font-size: 13px;` | `font-size: var(--text-sm);` |
| 94 | `font-weight: 500;` | `font-weight: var(--weight-medium);` |
| 99 | `font-weight: 600;` | `font-weight: var(--weight-semi);` |
| 104 | `font-weight: 600;` | `font-weight: var(--weight-semi);` |
| 121 | `font-size: 12px;` | `font-size: var(--text-xs);` |
| 123 | `line-height: 1.5;` | `line-height: var(--leading-snug);` |

**Build, test, commit:**

```bash
git add app/pages/profile.vue app/components/profile/
git commit -m "feat(typography): apply tokens to profile page and components"
```

---

### Task 11: Final Build + Visual Verification

**Step 1: Full build**

Run: `bun run build`
Expected: Build succeeds with no errors

**Step 2: Run all tests**

Run: `bun run test`
Expected: All tests pass (except the pre-existing AR empty-key issue)

**Step 3: Dev server visual check**

Run: `bun run dev`
Check each page (/, /calculator, /tracker, /profile) in both EN and AR.
Verify: headings use Cormorant Garamond (EN), text scales fluidly when resizing.

**Step 4: Final commit if any tweaks needed**

```bash
git add -A
git commit -m "feat(typography): complete overhaul — all tokens applied"
```

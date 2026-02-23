# Multi-Currency Support Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Replace hardcoded EGP currency with a user-selectable currency that syncs with Google Drive, supporting Middle East and major Western currencies.

**Architecture:** New `preferences` Pinia store holds `currency` code. A currency registry maps codes to display metadata. `fmtCurrency()` replaces `fmtEGP()` everywhere. A new AppSettings card on the profile page provides the currency selector.

**Tech Stack:** Nuxt 4, Pinia (persisted), Nuxt i18n, Nuxt UI (USelectMenu), TypeScript

---

### Task 1: Currency Registry

**Files:**
- Create: `app/utils/currencies.ts`

**Step 1: Create the currency registry file**

```ts
// app/utils/currencies.ts

export interface CurrencyInfo {
  code: string
  symbol: string
  nameEn: string
  nameAr: string
}

export const CURRENCIES: Record<string, CurrencyInfo> = {
  // Middle East
  EGP: { code: 'EGP', symbol: 'ج.م', nameEn: 'Egyptian Pound', nameAr: 'جنيه مصري' },
  SAR: { code: 'SAR', symbol: 'ر.س', nameEn: 'Saudi Riyal', nameAr: 'ريال سعودي' },
  AED: { code: 'AED', symbol: 'د.إ', nameEn: 'UAE Dirham', nameAr: 'درهم إماراتي' },
  KWD: { code: 'KWD', symbol: 'د.ك', nameEn: 'Kuwaiti Dinar', nameAr: 'دينار كويتي' },
  QAR: { code: 'QAR', symbol: 'ر.ق', nameEn: 'Qatari Riyal', nameAr: 'ريال قطري' },
  BHD: { code: 'BHD', symbol: 'د.ب', nameEn: 'Bahraini Dinar', nameAr: 'دينار بحريني' },
  OMR: { code: 'OMR', symbol: 'ر.ع', nameEn: 'Omani Rial', nameAr: 'ريال عماني' },
  JOD: { code: 'JOD', symbol: 'د.أ', nameEn: 'Jordanian Dinar', nameAr: 'دينار أردني' },
  IQD: { code: 'IQD', symbol: 'د.ع', nameEn: 'Iraqi Dinar', nameAr: 'دينار عراقي' },
  LBP: { code: 'LBP', symbol: 'ل.ل', nameEn: 'Lebanese Pound', nameAr: 'ليرة لبنانية' },
  SYP: { code: 'SYP', symbol: 'ل.س', nameEn: 'Syrian Pound', nameAr: 'ليرة سورية' },
  YER: { code: 'YER', symbol: 'ر.ي', nameEn: 'Yemeni Rial', nameAr: 'ريال يمني' },
  TND: { code: 'TND', symbol: 'د.ت', nameEn: 'Tunisian Dinar', nameAr: 'دينار تونسي' },
  MAD: { code: 'MAD', symbol: 'د.م', nameEn: 'Moroccan Dirham', nameAr: 'درهم مغربي' },
  DZD: { code: 'DZD', symbol: 'د.ج', nameEn: 'Algerian Dinar', nameAr: 'دينار جزائري' },
  LYD: { code: 'LYD', symbol: 'د.ل', nameEn: 'Libyan Dinar', nameAr: 'دينار ليبي' },
  SDG: { code: 'SDG', symbol: 'ج.س', nameEn: 'Sudanese Pound', nameAr: 'جنيه سوداني' },
  // International
  USD: { code: 'USD', symbol: '$', nameEn: 'US Dollar', nameAr: 'دولار أمريكي' },
  EUR: { code: 'EUR', symbol: '€', nameEn: 'Euro', nameAr: 'يورو' },
  GBP: { code: 'GBP', symbol: '£', nameEn: 'British Pound', nameAr: 'جنيه إسترليني' },
  CAD: { code: 'CAD', symbol: 'C$', nameEn: 'Canadian Dollar', nameAr: 'دولار كندي' },
  AUD: { code: 'AUD', symbol: 'A$', nameEn: 'Australian Dollar', nameAr: 'دولار أسترالي' },
  CHF: { code: 'CHF', symbol: 'Fr', nameEn: 'Swiss Franc', nameAr: 'فرنك سويسري' },
  TRY: { code: 'TRY', symbol: '₺', nameEn: 'Turkish Lira', nameAr: 'ليرة تركية' },
}

export const MIDDLE_EAST_CODES = ['EGP', 'SAR', 'AED', 'KWD', 'QAR', 'BHD', 'OMR', 'JOD', 'IQD', 'LBP', 'SYP', 'YER', 'TND', 'MAD', 'DZD', 'LYD', 'SDG'] as const
export const INTERNATIONAL_CODES = ['USD', 'EUR', 'GBP', 'CAD', 'AUD', 'CHF', 'TRY'] as const

export function getCurrency(code: string): CurrencyInfo {
  return CURRENCIES[code] || CURRENCIES.EGP
}
```

**Step 2: Commit**

```bash
git add app/utils/currencies.ts
git commit -m "feat: add currency registry with Middle East and international currencies"
```

---

### Task 2: Preferences Store

**Files:**
- Create: `stores/preferences.ts`

**Step 1: Create the preferences store**

```ts
// stores/preferences.ts
import { defineStore } from 'pinia'

export const usePreferencesStore = defineStore('preferences', {
  state: () => ({
    currency: 'EGP',
  }),

  persist: {
    key: 'zakat_preferences',
  },
})
```

**Step 2: Commit**

```bash
git add stores/preferences.ts
git commit -m "feat: add preferences store with currency setting"
```

---

### Task 3: Update Types and Constants

**Files:**
- Modify: `shared/types/index.ts:51` — change `unit: 'g' | 'EGP'` to `unit: 'g' | 'currency'`
- Modify: `app/utils/constants.ts:21-32` — change all `unit: 'EGP'` to `unit: 'currency'`

**Step 1: Update AssetDef type**

In `shared/types/index.ts` line 51, change:
```ts
  unit: 'g' | 'EGP'
```
to:
```ts
  unit: 'g' | 'currency'
```

**Step 2: Update constants**

In `app/utils/constants.ts`, change every `unit: 'EGP'` to `unit: 'currency'` (7 occurrences: lines 22-26, 30-31).

**Step 3: Commit**

```bash
git add shared/types/index.ts app/utils/constants.ts
git commit -m "refactor: change asset unit type from 'EGP' to 'currency'"
```

---

### Task 4: Update Format Utilities

**Files:**
- Modify: `app/utils/format.ts` — replace `fmtEGP` with `fmtCurrency`

**Step 1: Rewrite format.ts**

Replace the `fmtEGP` function (lines 15-21) with:

```ts
import { getCurrency } from '~/utils/currencies'

export function fmtCurrency(val: unknown, lang: string = 'en', currencyCode: string = 'EGP'): string {
  const n = safeNum(val)
  const info = getCurrency(currencyCode)
  if (lang === 'ar') {
    return info.symbol + ' ' + n.toLocaleString('ar', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
  }
  return info.code + ' ' + n.toLocaleString('en', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
}

export function fmtUnit(unit: 'g' | 'currency', lang: string, currencyCode: string): string {
  if (unit === 'g') {
    return lang === 'ar' ? 'جم' : 'g'
  }
  const info = getCurrency(currencyCode)
  return lang === 'ar' ? info.symbol : info.code
}
```

**Step 2: Update tests**

In `tests/unit/format.test.ts`, update the test imports and tests:

Replace `fmtEGP` import with `fmtCurrency` and update test names/assertions:

```ts
import { safeNum, escapeHtml, fmtCurrency, fmtPct } from '~/utils/format'

// Replace the fmtEGP describe block with:
describe('fmtCurrency', () => {
  it('formats currency in English with default EGP', () => {
    const result = fmtCurrency(1234.56, 'en')
    expect(result).toContain('EGP')
    expect(result).toContain('1')
    expect(result).toContain('234')
  })
  it('formats currency in Arabic with default EGP', () => {
    const result = fmtCurrency(1234.56, 'ar')
    expect(result).toContain('ج.م')
  })
  it('handles zero', () => {
    expect(fmtCurrency(0, 'en')).toContain('0.00')
  })
  it('formats SAR currency', () => {
    const result = fmtCurrency(100, 'en', 'SAR')
    expect(result).toContain('SAR')
  })
  it('formats SAR in Arabic', () => {
    const result = fmtCurrency(100, 'ar', 'SAR')
    expect(result).toContain('ر.س')
  })
  it('falls back to EGP for unknown currency', () => {
    const result = fmtCurrency(100, 'en', 'UNKNOWN')
    expect(result).toContain('EGP')
  })
})
```

**Step 3: Run tests**

```bash
npx vitest run tests/unit/format.test.ts
```

Expected: All tests pass.

**Step 4: Commit**

```bash
git add app/utils/format.ts tests/unit/format.test.ts
git commit -m "feat: replace fmtEGP with fmtCurrency supporting multiple currencies"
```

---

### Task 5: Update i18n Translation Files

**Files:**
- Modify: `locales/en.json`
- Modify: `locales/ar.json`

**Step 1: Update English translations**

Add these new keys to `locales/en.json`:

```json
"profile.appSettings": "App Settings",
"profile.currency": "Currency",
"profile.currencyHint": "Select your local currency for display",
"profile.currencyMiddleEast": "Middle East",
"profile.currencyInternational": "International"
```

Change these existing keys:
- `"calc.pricesHint"`: from `"Update prices to today's market rates (EGP)"` to `"Update prices to today's market rates"`
- `"tracker.amount"`: from `"Amount (EGP)"` to `"Amount"`

**Step 2: Update Arabic translations**

Add these new keys to `locales/ar.json`:

```json
"profile.appSettings": "إعدادات التطبيق",
"profile.currency": "العملة",
"profile.currencyHint": "اختر عملتك المحلية للعرض",
"profile.currencyMiddleEast": "الشرق الأوسط",
"profile.currencyInternational": "دولية"
```

Change these existing keys:
- `"calc.pricesHint"`: from `"حدّث الأسعار بأسعار السوق الحالية (ج.م)"` to `"حدّث الأسعار بأسعار السوق الحالية"`
- `"tracker.amount"`: from `"المبلغ (ج.م)"` to `"المبلغ"`

**Step 3: Commit**

```bash
git add locales/en.json locales/ar.json
git commit -m "feat: add currency settings i18n keys and remove hardcoded EGP from translations"
```

---

### Task 6: Update All Components Using fmtEGP

**Files:**
- Modify: `app/components/calculator/AssetRow.vue`
- Modify: `app/components/calculator/CustomAssets.vue`
- Modify: `app/components/calculator/SummaryPanel.vue`
- Modify: `app/components/tracker/PaymentTable.vue`
- Modify: `app/components/tracker/Summary.vue`

Each component needs three changes:
1. Import `fmtCurrency` instead of `fmtEGP` (and import `fmtUnit` where needed)
2. Import and use `usePreferencesStore`
3. Replace all `fmtEGP(value, locale)` calls with `fmtCurrency(value, locale, prefs.currency)`

**Step 1: Update AssetRow.vue**

In `app/components/calculator/AssetRow.vue`:

Change import (line 4):
```ts
import { fmtCurrency, fmtUnit } from '~/utils/format'
```

Add after line 16 (`const { t, locale } = useI18n()`):
```ts
const prefs = usePreferencesStore()
```

Add import (after line 3):
```ts
import { usePreferencesStore } from '~~/stores/preferences'
```

Change line 43 (the unit display span):
```html
<span class="text-xs text-(--color-stone-400) whitespace-nowrap tracking-widest uppercase">{{ fmtUnit(def.unit, locale, prefs.currency) }}</span>
```

Change line 44 (the value display):
```html
<span class="text-sm font-semibold text-(--color-green-600) whitespace-nowrap min-w-[100px] text-end font-mono">{{ fmtCurrency(computedValue, locale, prefs.currency) }}</span>
```

**Step 2: Update CustomAssets.vue**

In `app/components/calculator/CustomAssets.vue`:

Change import (line 3):
```ts
import { fmtCurrency, fmtUnit } from '~/utils/format'
```

Add import:
```ts
import { usePreferencesStore } from '~~/stores/preferences'
```

Add after line 6:
```ts
const prefs = usePreferencesStore()
```

Change line 47 (hardcoded "EGP" span):
```html
<span class="text-xs text-(--color-stone-400) whitespace-nowrap tracking-widest uppercase">{{ fmtUnit('currency', locale, prefs.currency) }}</span>
```

Change line 48 (fmtEGP call):
```html
<span class="text-sm font-semibold text-(--color-green-600) whitespace-nowrap min-w-[100px] text-end font-mono">{{ fmtCurrency(asset.amount, locale, prefs.currency) }}</span>
```

**Step 3: Update SummaryPanel.vue**

In `app/components/calculator/SummaryPanel.vue`:

Change import (line 6):
```ts
import { fmtCurrency, fmtPct } from '~/utils/format'
```

Add import:
```ts
import { usePreferencesStore } from '~~/stores/preferences'
```

Add after line 10:
```ts
const prefs = usePreferencesStore()
```

Replace ALL `fmtEGP(xxx, locale)` calls with `fmtCurrency(xxx, locale, prefs.currency)` — there are 14 occurrences on lines 63, 68, 75, 80, 85, 90, 98, 102, 106, 126, 133, 137.

**Step 4: Update PaymentTable.vue**

In `app/components/tracker/PaymentTable.vue`:

Change import (line 4):
```ts
import { fmtCurrency } from '~/utils/format'
```

Add import:
```ts
import { usePreferencesStore } from '~~/stores/preferences'
```

Add after line 7:
```ts
const prefs = usePreferencesStore()
```

Replace lines 91, 95: `fmtEGP(xxx, locale)` → `fmtCurrency(xxx, locale, prefs.currency)`.

**Step 5: Update Summary.vue (tracker)**

In `app/components/tracker/Summary.vue`:

Change import (line 4):
```ts
import { fmtCurrency, fmtPct } from '~/utils/format'
```

Add import:
```ts
import { usePreferencesStore } from '~~/stores/preferences'
```

Add after line 8:
```ts
const prefs = usePreferencesStore()
```

Replace lines 16, 23, 35: `fmtEGP(xxx, locale)` → `fmtCurrency(xxx, locale, prefs.currency)`.

**Step 6: Commit**

```bash
git add app/components/calculator/AssetRow.vue app/components/calculator/CustomAssets.vue app/components/calculator/SummaryPanel.vue app/components/tracker/PaymentTable.vue app/components/tracker/Summary.vue
git commit -m "refactor: update all components to use fmtCurrency with preferences store"
```

---

### Task 7: Create App Settings Card

**Files:**
- Create: `app/components/profile/AppSettings.vue`
- Modify: `app/pages/profile.vue`

**Step 1: Create AppSettings.vue**

```vue
<script setup lang="ts">
import { usePreferencesStore } from '~~/stores/preferences'
import { CURRENCIES, MIDDLE_EAST_CODES, INTERNATIONAL_CODES } from '~/utils/currencies'
import type { CurrencyInfo } from '~/utils/currencies'

const { t, locale } = useI18n()
const prefs = usePreferencesStore()

const currencyOptions = computed(() => {
  const lang = locale.value

  function toOption(code: string) {
    const c = CURRENCIES[code]!
    return {
      label: lang === 'ar' ? `${c.nameAr} (${c.code})` : `${c.nameEn} (${c.code})`,
      value: c.code,
      suffix: c.symbol,
    }
  }

  return [
    {
      label: t('profile.currencyMiddleEast'),
      items: MIDDLE_EAST_CODES.map(toOption),
    },
    {
      label: t('profile.currencyInternational'),
      items: INTERNATIONAL_CODES.map(toOption),
    },
  ]
})

const selectedLabel = computed(() => {
  const c = CURRENCIES[prefs.currency]
  if (!c) return prefs.currency
  return locale.value === 'ar' ? `${c.nameAr} (${c.code})` : `${c.nameEn} (${c.code})`
})
</script>

<template>
  <UCard>
    <template #header>
      <span class="text-xs font-semibold text-(--color-stone-500) uppercase tracking-widest">{{ t('profile.appSettings') }}</span>
    </template>

    <div class="flex items-center justify-between gap-4">
      <div class="min-w-0">
        <div class="text-base font-semibold text-(--color-stone-800) dark:text-(--color-stone-200)">{{ t('profile.currency') }}</div>
        <div class="text-xs text-(--color-stone-400)">{{ t('profile.currencyHint') }}</div>
      </div>
      <USelectMenu
        v-model="prefs.currency"
        :items="currencyOptions"
        value-key="value"
        class="w-[220px]"
      />
    </div>
  </UCard>
</template>
```

**Step 2: Add AppSettings card to profile page**

In `app/pages/profile.vue`, add a new card-animate div as the first child of `.profile-cards` (before the AccountCard), and increment all other `--i` values by 1:

```html
<div class="profile-cards">
  <div class="card-animate" style="--i: 0">
    <ProfileAppSettings />
  </div>
  <div class="card-animate" style="--i: 1">
    <ProfileAccountCard />
  </div>
  <div class="card-animate" style="--i: 2">
    <ProfileSyncCard />
  </div>
  <div class="card-animate" style="--i: 3">
    <ProfileDataManagement />
  </div>
  <div class="card-animate" style="--i: 4">
    <ProfileAboutCard />
  </div>
</div>
```

**Step 3: Commit**

```bash
git add app/components/profile/AppSettings.vue app/pages/profile.vue
git commit -m "feat: add App Settings card with currency selector on profile page"
```

---

### Task 8: Sync Integration

**Files:**
- Modify: `app/composables/useDriveSync.ts`
- Modify: `app/components/profile/DataManagement.vue`

**Step 1: Update useDriveSync.ts**

Add import at top of file (after line 4):
```ts
import { usePreferencesStore } from '~~/stores/preferences'
```

Update `buildExportData()` (around line 36) to include preferences:

After the `tracker` section in the return object, add:
```ts
      preferences: {
        currency: usePreferencesStore().currency,
      },
```

Update `applyImportData()` (around line 54) to restore preferences:

After the tracker block, add:
```ts
    if (data.preferences && typeof data.preferences === 'object') {
      const prefs = usePreferencesStore()
      if (data.preferences.currency && typeof data.preferences.currency === 'string') {
        prefs.currency = data.preferences.currency
      }
    }
```

**Step 2: Update DataManagement.vue export/import**

In `app/components/profile/DataManagement.vue`:

Add import:
```ts
import { usePreferencesStore } from '~~/stores/preferences'
```

Add after line 9:
```ts
const prefsStore = usePreferencesStore()
```

Update `doExport()` — add preferences to the export data object (after the `tracker` key):
```ts
    preferences: {
      currency: prefsStore.currency,
    },
```

Update `doImport()` — after the tracker block (line 62-64), add:
```ts
      if (data.preferences?.currency) {
        prefsStore.currency = data.preferences.currency
      }
```

Update `confirmClear()` — after `trackerStore.clearAll()` (line 76), add:
```ts
    prefsStore.$reset()
```

**Step 3: Commit**

```bash
git add app/composables/useDriveSync.ts app/components/profile/DataManagement.vue
git commit -m "feat: include currency preference in sync and export/import data"
```

---

### Task 9: Verify and Polish

**Step 1: Run full test suite**

```bash
npx vitest run
```

Expected: All tests pass.

**Step 2: Run the dev server and manually verify**

```bash
npx nuxt dev
```

Verify:
- Profile page shows App Settings card with currency selector
- Changing currency updates all displays (calculator, tracker, summary)
- Arabic locale shows localized currency symbols and "جم" for grams
- English locale shows currency codes and "g" for grams
- Export includes currency preference
- Import restores currency preference
- Clear all resets currency to EGP

**Step 3: Final commit if any polish needed**

```bash
git add -A
git commit -m "fix: polish multi-currency implementation"
```

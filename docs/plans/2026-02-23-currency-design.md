# Multi-Currency Support Design

## Problem

The app is hardcoded to Egyptian Pounds (EGP). Arabic users see "EGP" and "G" for grams without localization. Users in other countries cannot use their local currency.

## Requirements

- Support all Middle East currencies and major Western currencies
- Currency selection in a new "App Settings" card on the profile page
- Currency preference syncs with Google Drive user data
- Manual price entry only (no live API)
- Display-only change: stored numbers stay as-is when currency changes
- Localized weight unit: "g" in English, "جم" in Arabic

## Supported Currencies

### Middle East
| Code | Symbol | English | Arabic |
|------|--------|---------|--------|
| EGP | ج.م | Egyptian Pound | جنيه مصري |
| SAR | ر.س | Saudi Riyal | ريال سعودي |
| AED | د.إ | UAE Dirham | درهم إماراتي |
| KWD | د.ك | Kuwaiti Dinar | دينار كويتي |
| QAR | ر.ق | Qatari Riyal | ريال قطري |
| BHD | د.ب | Bahraini Dinar | دينار بحريني |
| OMR | ر.ع | Omani Rial | ريال عماني |
| JOD | د.أ | Jordanian Dinar | دينار أردني |
| IQD | د.ع | Iraqi Dinar | دينار عراقي |
| LBP | ل.ل | Lebanese Pound | ليرة لبنانية |
| SYP | ل.س | Syrian Pound | ليرة سورية |
| YER | ر.ي | Yemeni Rial | ريال يمني |
| TND | د.ت | Tunisian Dinar | دينار تونسي |
| MAD | د.م | Moroccan Dirham | درهم مغربي |
| DZD | د.ج | Algerian Dinar | دينار جزائري |
| LYD | د.ل | Libyan Dinar | دينار ليبي |
| SDG | ج.س | Sudanese Pound | جنيه سوداني |

### International
| Code | Symbol | English | Arabic |
|------|--------|---------|--------|
| USD | $ | US Dollar | دولار أمريكي |
| EUR | € | Euro | يورو |
| GBP | £ | British Pound | جنيه إسترليني |
| CAD | C$ | Canadian Dollar | دولار كندي |
| AUD | A$ | Australian Dollar | دولار أسترالي |
| CHF | Fr | Swiss Franc | فرنك سويسري |
| TRY | ₺ | Turkish Lira | ليرة تركية |

## Architecture

### 1. Currency Registry (`app/utils/currencies.ts`)

Static map of `CurrencyInfo` objects keyed by currency code:

```ts
interface CurrencyInfo {
  code: string
  symbol: string
  nameEn: string
  nameAr: string
}
```

### 2. Preferences Store (`stores/preferences.ts`)

New Pinia store with persistence:

```ts
state: () => ({
  currency: 'EGP' as string,
})
persist: { key: 'zakat_preferences' }
```

### 3. Formatting (`app/utils/format.ts`)

- Replace `fmtEGP(val, lang)` with `fmtCurrency(val, lang, currencyCode)`
- Looks up currency symbol from registry
- Arabic: symbol prefix with `ar` locale formatting
- English: code prefix with `en` locale formatting
- Add `fmtUnit(unit, lang, currencyCode)` for input suffix display
- Localize gram unit: "g" (en) / "جم" (ar)

### 4. Asset Type Change (`shared/types/index.ts`)

Change `unit: 'g' | 'EGP'` to `unit: 'g' | 'currency'` in `AssetDef`.

Update `ASSET_DEFS_OTHER` in `constants.ts` accordingly.

### 5. Profile - App Settings Card (`app/components/profile/AppSettings.vue`)

New card placed first on the profile page containing:
- Currency selector (USelectMenu, searchable, grouped by region)
- Future-proof for additional settings

### 6. Sync Integration (`app/composables/useDriveSync.ts`)

- `buildExportData()`: include `preferences: { currency }` in export
- `applyImportData()`: restore currency from import data
- Handle version 1 data (no preferences field) gracefully — default to EGP

### 7. i18n Updates (`locales/en.json`, `locales/ar.json`)

- Add keys: `profile.appSettings`, `profile.currency`, `profile.currencyHint`
- Replace hardcoded "EGP" / "ج.م" references in existing keys with generic wording
- Add gram unit key: `units.gram` → "g" / "جم"

## Files Changed

| File | Change |
|------|--------|
| `app/utils/currencies.ts` | **NEW** - Currency registry |
| `stores/preferences.ts` | **NEW** - Preferences store |
| `app/components/profile/AppSettings.vue` | **NEW** - App settings card |
| `app/utils/format.ts` | Replace `fmtEGP` with `fmtCurrency` |
| `app/utils/constants.ts` | Change unit `'EGP'` → `'currency'` |
| `shared/types/index.ts` | Update `AssetDef.unit` type |
| `locales/en.json` | Add settings keys, fix currency refs |
| `locales/ar.json` | Add settings keys, fix currency refs |
| `app/pages/profile.vue` | Add AppSettings card |
| `app/composables/useDriveSync.ts` | Include preferences in sync data |
| All components using `fmtEGP` | Update to `fmtCurrency` with currency param |

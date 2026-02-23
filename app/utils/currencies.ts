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

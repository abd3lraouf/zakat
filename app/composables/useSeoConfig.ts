export const SEO_CONFIG = {
  siteUrl: 'https://abd3lraouf.github.io',
  basePath: '/zakat',
  ogImage: '/og-image.png',
  twitterCard: 'summary_large_image' as const,
  locales: {
    en: 'en_US',
    ar: 'ar_SA',
  },
}

export function useSeoConfig() {
  const { locale, t } = useI18n()
  const route = useRoute()
  
  const siteName = computed(() => locale.value === 'ar' ? 'زكاتي' : 'Zakaty')
  const fullUrl = computed(() => {
    const path = route.path === '/' ? '' : route.path
    return `${SEO_CONFIG.siteUrl}${SEO_CONFIG.basePath}${path}`
  })
  const ogImageUrl = computed(() => `${SEO_CONFIG.siteUrl}${SEO_CONFIG.basePath}${SEO_CONFIG.ogImage}`)
  const ogLocale = computed(() => SEO_CONFIG.locales[locale.value as keyof typeof SEO_CONFIG.locales] || 'en_US')
  const ogLocaleAlternate = computed(() => 
    locale.value === 'ar' ? ['en_US'] : ['ar_SA']
  )

  function setPageSeo(titleKey: string, descriptionKey: string) {
    useSeoMeta({
      title: () => t(titleKey),
      description: () => t(descriptionKey),
      ogTitle: () => `${t(titleKey)} — ${siteName.value}`,
      ogDescription: () => t(descriptionKey),
      ogType: 'website',
      ogUrl: fullUrl,
      ogSiteName: siteName,
      ogLocale: ogLocale,
      ogLocaleAlternate: ogLocaleAlternate,
      ogImage: ogImageUrl,
      ogImageAlt: () => `${t(titleKey)} — ${siteName.value}`,
      twitterCard: SEO_CONFIG.twitterCard,
      twitterTitle: () => `${t(titleKey)} — ${siteName.value}`,
      twitterDescription: () => t(descriptionKey),
      twitterImage: ogImageUrl,
      twitterImageAlt: () => `${t(titleKey)} — ${siteName.value}`,
    })
  }

  return {
    config: SEO_CONFIG,
    siteName,
    fullUrl,
    ogImageUrl,
    ogLocale,
    ogLocaleAlternate,
    setPageSeo,
  }
}

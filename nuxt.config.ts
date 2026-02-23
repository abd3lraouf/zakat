// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  ssr: false, // SPA mode for GitHub Pages

  modules: [
    '@nuxt/ui',
    '@pinia/nuxt',
    '@nuxtjs/i18n',
    '@nuxtjs/google-fonts',
    '@nuxtjs/seo',
    '@vueuse/motion/nuxt',
  ],

  site: {
    url: 'https://abd3lraouf.github.io',
    name: 'Zakaty',
    description: 'Bilingual Zakat calculator and payment tracker',
    defaultLocale: 'en',
  },

  ogImage: { enabled: false },
  linkChecker: { enabled: false },
  robots: { robotsTxt: false },
  schemaOrg: { enabled: false },

  css: [
    '~/assets/css/main.css',
    '~/assets/css/base.css',
  ],

  app: {
    head: {
      htmlAttrs: {},
      link: [
        { rel: 'icon', type: 'image/svg+xml', href: '/favicon.svg' },
        { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' },
        { rel: 'apple-touch-icon', href: '/apple-touch-icon.png' },
        { rel: 'manifest', href: '/site.webmanifest' },
      ],
      meta: [
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
        { name: 'color-scheme', content: 'light dark' },
        { name: 'theme-color', content: '#1F4837', media: '(prefers-color-scheme: light)' },
        { name: 'theme-color', content: '#1C1A17', media: '(prefers-color-scheme: dark)' },
        { property: 'og:image', content: 'https://abd3lraouf.github.io/zakat/og-image.png' },
        { property: 'og:image:width', content: '1200' },
        { property: 'og:image:height', content: '630' },
        { name: 'twitter:card', content: 'summary_large_image' },
        { name: 'twitter:image', content: 'https://abd3lraouf.github.io/zakat/og-image.png' },
      ],
    },
  },

  googleFonts: {
    families: {
      'IBM Plex Sans Arabic': [400, 500, 600, 700],
      'Amiri': [400, 700],
      'DM Mono': [400, 500],
    },
    display: 'swap',
  },

  i18n: {
    locales: [
      { code: 'en', file: 'en.json', dir: 'ltr' },
      { code: 'ar', file: 'ar.json', dir: 'rtl' },
    ],
    defaultLocale: 'en',
    strategy: 'no_prefix',
    detectBrowserLanguage: {
      useCookie: true,
      cookieKey: 'zakat_lang',
      fallbackLocale: 'en',
    },
    lazy: true,
    langDir: '../locales',
    bundle: {
      optimizeTranslationDirective: false,
    },
  },

  devtools: { enabled: true },
})

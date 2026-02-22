import tailwindcss from '@tailwindcss/vite'

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  ssr: false, // SPA mode for GitHub Pages

  modules: [
    '@pinia/nuxt',
    '@nuxtjs/i18n',
    '@nuxtjs/google-fonts',
  ],

  vite: {
    plugins: [tailwindcss()],
  },

  css: [
    '~/assets/css/main.css',
    '~/assets/css/base.css',
  ],

  app: {
    head: {
      htmlAttrs: { lang: 'en' },
      meta: [
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
        { name: 'description', content: 'Bilingual Zakat calculator and payment tracker' },
        { property: 'og:title', content: 'Zakat Calculator' },
        { property: 'og:description', content: 'Calculate and track your Zakat payments' },
        { name: 'theme-color', content: '#2f5244' },
      ],
    },
  },

  googleFonts: {
    families: {
      'Playfair Display': [400, 500, 600, 700],
      'Noto Naskh Arabic': [400, 500, 600, 700],
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
  },

  devtools: { enabled: true },
})

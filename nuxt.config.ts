import tailwindcss from '@tailwindcss/vite'

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  ssr: false, // SPA mode for GitHub Pages

  modules: [
    '@pinia/nuxt',
    '@nuxtjs/i18n',
    '@nuxtjs/google-fonts',
    '@nuxt/icon',
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
      htmlAttrs: {},
      meta: [
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
        { name: 'description', content: 'Bilingual Zakat calculator and payment tracker' },
        { property: 'og:title', content: 'Zakat Calculator' },
        { property: 'og:description', content: 'Calculate and track your Zakat payments' },
        { name: 'theme-color', content: '#005229' },
      ],
    },
  },

  googleFonts: {
    families: {
      'Plus Jakarta Sans': [400, 500, 600, 700],
      'Cairo': [400, 500, 600, 700],
      'Cormorant Garamond': [400, 500, 600, 700],
      'Amiri': [400, 700],
      'Aref Ruqaa': [400, 700],
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

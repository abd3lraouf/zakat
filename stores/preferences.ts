import { defineStore } from 'pinia'

export const usePreferencesStore = defineStore('preferences', {
  state: () => ({
    currency: 'EGP',
  }),

  persist: {
    key: 'zakat_preferences',
  },
})

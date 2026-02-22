import { defineStore } from 'pinia'
import type { GoogleUser } from '~~/shared/types'

export const useAuthStore = defineStore('auth', {
  state: () => ({
    user: null as GoogleUser | null,
  }),

  getters: {
    isAuthenticated: (state) => !!state.user,
  },

  actions: {
    setUser(user: GoogleUser) {
      this.user = user
    },
    clearUser() {
      this.user = null
    },
  },

  persist: {
    key: 'zakat_google_user',
  },
})

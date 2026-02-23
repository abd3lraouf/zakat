import type { GoogleUser } from '~~/shared/types'
import { useAuthStore } from '~~/stores/auth'
import { useCalculatorStore } from '~~/stores/calculator'
import { useTrackerStore } from '~~/stores/tracker'

const TOKEN_STORAGE_KEY = 'zakat_google_token'

// Module-level state shared across all consumers
const accessToken = ref<string | null>(null)

// Restore token from localStorage on load (survives page refresh)
try {
  const stored = localStorage.getItem(TOKEN_STORAGE_KEY)
  if (stored) {
    const { token, expiresAt } = JSON.parse(stored)
    if (expiresAt > Date.now()) {
      accessToken.value = token
    } else {
      localStorage.removeItem(TOKEN_STORAGE_KEY)
    }
  }
} catch { /* ignore */ }

export function useGoogleAuth() {
  const authStore = useAuthStore()
  const config = useAppConfig()

  const user = computed(() => authStore.user)
  const isAuthenticated = computed(() => authStore.isAuthenticated)
  const isConnected = computed(() => !!accessToken.value)

  async function fetchUserProfile(token: string): Promise<GoogleUser | null> {
    try {
      const res = await fetch('https://www.googleapis.com/oauth2/v1/userinfo', {
        headers: { Authorization: `Bearer ${token}` },
      })
      if (!res.ok) return null
      const data = await res.json()
      return {
        name: data.name || data.email || 'User',
        email: data.email || '',
        picture: data.picture || '',
      }
    } catch {
      return null
    }
  }

  function signIn() {
    if (typeof google === 'undefined' || !google?.accounts?.oauth2) {
      console.warn('Google Identity Services not loaded')
      return
    }

    const client = google.accounts.oauth2.initTokenClient({
      client_id: config.googleClientId as string,
      scope: `${config.driveScope} https://www.googleapis.com/auth/userinfo.profile`,
      callback: async (tokenResponse: any) => {
        if (tokenResponse.error) {
          console.error('Google auth error:', tokenResponse.error)
          return
        }
        accessToken.value = tokenResponse.access_token

        // Persist token with expiry so it survives page refresh
        try {
          const expiresIn = tokenResponse.expires_in || 3600
          localStorage.setItem(TOKEN_STORAGE_KEY, JSON.stringify({
            token: tokenResponse.access_token,
            expiresAt: Date.now() + expiresIn * 1000,
          }))
        } catch { /* ignore */ }

        // Fetch profile if we don't have one yet (first sign-in)
        if (!authStore.user) {
          const profile = await fetchUserProfile(tokenResponse.access_token)
          if (profile) authStore.setUser(profile)
        }
      },
    })

    client.requestAccessToken()
  }

  function signOut() {
    if (accessToken.value && typeof google !== 'undefined' && google?.accounts?.oauth2) {
      google.accounts.oauth2.revoke(accessToken.value, () => {})
    }
    accessToken.value = null
    localStorage.removeItem(TOKEN_STORAGE_KEY)

    // Clear all app data
    useCalculatorStore().reset()
    useTrackerStore().clearAll()
    authStore.clearUser()
    localStorage.removeItem('zakat_sync_meta')
  }

  return {
    user,
    isAuthenticated,
    isConnected,
    accessToken: readonly(accessToken),
    signIn,
    signOut,
  }
}

import type { GoogleUser } from '~~/shared/types'
import { useAuthStore } from '~~/stores/auth'

// Module-level state shared across all consumers
const accessToken = ref<string | null>(null)

export function useGoogleAuth() {
  const authStore = useAuthStore()
  const config = useAppConfig()

  const user = computed(() => authStore.user)
  const isAuthenticated = computed(() => authStore.isAuthenticated)

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
        const profile = await fetchUserProfile(tokenResponse.access_token)
        if (profile) {
          authStore.setUser(profile)
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
    authStore.clearUser()
  }

  function tryRestoreSession() {
    if (!authStore.user) return
    if (typeof google === 'undefined' || !google?.accounts?.oauth2) return

    try {
      const client = google.accounts.oauth2.initTokenClient({
        client_id: config.googleClientId as string,
        scope: `${config.driveScope} https://www.googleapis.com/auth/userinfo.profile`,
        callback: (tokenResponse: any) => {
          if (tokenResponse.error) {
            // Silent restore failed, clean up
            accessToken.value = null
            authStore.clearUser()
            return
          }
          accessToken.value = tokenResponse.access_token
        },
      })

      client.requestAccessToken({ prompt: '' })
    } catch {
      // Silently fail if restoration doesn't work
    }
  }

  return {
    user,
    isAuthenticated,
    accessToken: readonly(accessToken),
    signIn,
    signOut,
    tryRestoreSession,
  }
}

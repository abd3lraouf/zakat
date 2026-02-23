import { useAuthStore } from '~~/stores/auth'

async function sha256Hex(str: string): Promise<string> {
  const data = new TextEncoder().encode(str)
  const hash = await crypto.subtle.digest('SHA-256', data)
  return Array.from(new Uint8Array(hash))
    .map(b => b.toString(16).padStart(2, '0'))
    .join('')
}

/**
 * Returns the best avatar URL for the current user.
 * Priority: Google profile picture → Gravatar (from email) → null (use initials).
 * Handles image load errors by falling back to initials.
 */
export function useAvatar(size = 80) {
  const authStore = useAuthStore()
  const avatarUrl = ref<string | null>(null)
  const imgError = ref(false)

  const showImage = computed(() => !!avatarUrl.value && !imgError.value)

  watch(
    () => authStore.user,
    async (user) => {
      imgError.value = false

      if (user?.picture) {
        avatarUrl.value = user.picture
        return
      }

      if (user?.email) {
        const hash = await sha256Hex(user.email.trim().toLowerCase())
        avatarUrl.value = `https://www.gravatar.com/avatar/${hash}?s=${size}&d=404`
        return
      }

      avatarUrl.value = null
    },
    { immediate: true, deep: true },
  )

  function onImgError() {
    imgError.value = true
  }

  return { avatarUrl, showImage, onImgError }
}

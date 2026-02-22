type ToastType = 'success' | 'error' | 'warning' | 'info'

const colorMap: Record<ToastType, string> = {
  success: 'success',
  error: 'error',
  warning: 'warning',
  info: 'info',
}

const iconMap: Record<ToastType, string> = {
  success: 'i-lucide-check-circle',
  error: 'i-lucide-x-circle',
  warning: 'i-lucide-triangle-alert',
  info: 'i-lucide-info',
}

export function useAppToast() {
  const toast = useToast()

  function showToast(message: string, type: ToastType = 'success', duration = 3000) {
    toast.add({
      title: message,
      color: colorMap[type] as any,
      icon: iconMap[type],
      duration,
    })
  }

  return { showToast }
}

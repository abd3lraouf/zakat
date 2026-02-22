<template>
  <div>
    <AppNavbar />
    <OfflineBanner />
    <main class="pt-[var(--spacing-navbar-h)] relative z-[1] min-h-screen">
      <slot />
    </main>
    <AppBottomNav />
    <AppToast />
  </div>
</template>

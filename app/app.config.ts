export default defineAppConfig({
  // Why this note: the OAuth client's GCP project (zakat-app-488216, number 801391702852) was
  // deleted on 2026-10-01 to free a slot under the account's 5-project cap, so Google sign-in and
  // Drive sync fail until a client from a live project replaces this id.
  googleClientId: '801391702852-a3p2vh875rp941ggu83g5ge2970i64c1.apps.googleusercontent.com',
  driveScope: 'https://www.googleapis.com/auth/drive.appdata',
  driveFileName: 'zakat-app-data.json',
  appVersion: 1,
  ui: {
    icons: {
      light: 'i-lucide-sun',
      dark: 'i-lucide-moon',
    },
    colors: {
      primary: 'green',
      neutral: 'stone',
    },
    card: {
      slots: {
        root: 'rounded-xl shadow-sm border border-(--color-stone-200) dark:border-(--color-stone-800) dark:bg-(--color-stone-900)',
      },
    },
    button: {
      defaultVariants: {
        color: 'primary',
      },
    },
  },
})

export default defineAppConfig({
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
        root: 'rounded-xl shadow-sm border border-(--color-stone-200)',
      },
    },
    button: {
      defaultVariants: {
        color: 'primary',
      },
    },
  },
})

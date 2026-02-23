# Setup Guide

Complete guide to deploy the Zakat App and configure Google Drive sync.

---

## 1. Deploy to GitHub Pages

### Option A — Fork & Deploy

1. **Fork** this repository
2. Go to your fork > **Settings** > **Pages**
3. Under **Source**, select **GitHub Actions**
4. Push any change to `main` — the site deploys automatically

Your app will be live at `https://YOUR_USERNAME.github.io/zakat/`

### Option B — New Repository

```bash
git clone https://github.com/abd3lraouf/zakat.git
cd zakat
git remote set-url origin https://github.com/YOUR_USERNAME/zakat.git
git push -u origin main
```

Then enable GitHub Pages: **Settings** > **Pages** > Source: **GitHub Actions**.

### How Deployment Works

- Push to `main` triggers `.github/workflows/deploy.yml`
- The workflow installs dependencies with Bun, runs tests, builds with `nuxt build`, and deploys the `.output/public` directory
- If tests fail, deployment is blocked
- The build uses `NUXT_APP_BASE_URL` and `NITRO_PRESET=github_pages` for correct path handling
- Manual deploys: **Actions** > **Deploy to GitHub Pages** > **Run workflow**

### Custom Domain (optional)

1. **Settings** > **Pages** > **Custom domain** > enter your domain
2. Add a `CNAME` DNS record pointing to `YOUR_USERNAME.github.io`
3. Check **Enforce HTTPS**

---

## 2. Google Drive Sync (Optional)

The app works fully **without** Google Sign-In — all data is saved in localStorage. Sign-in adds cross-device sync via Google Drive's AppData folder.

Google Sign-In is **button-triggered only** (on the landing page and navbar). It never auto-launches popups.

### Step 1 — Create a Google Cloud Project

1. Go to [console.cloud.google.com](https://console.cloud.google.com)
2. **New Project** > name it "Zakat App" > Create

### Step 2 — Enable APIs

1. Go to **APIs & Services** > **Library**
2. Enable **Google Drive API**
3. Enable **Google People API** (for profile info)

### Step 3 — Configure OAuth Consent Screen

1. Go to **APIs & Services** > **OAuth consent screen**
2. User type: **External** > Create
3. App name: `Zakat App` | Support email: your email
4. Click **Add or Remove Scopes** > add `drive.appdata` and `userinfo.profile`
5. Save — no Google verification needed for personal use

### Step 4 — Create OAuth Credentials

1. Go to **APIs & Services** > **Credentials** > **Create Credentials** > **OAuth 2.0 Client ID**
2. Application type: **Web application**
3. Name: "Zakat App Web"
4. **Authorized JavaScript origins** — add:
   ```
   https://YOUR_USERNAME.github.io
   http://localhost:3000
   ```
5. No redirect URIs needed (uses popup token flow)
6. Click **Create** > copy the **Client ID**

### Step 5 — Add Client ID to the App

In `app/app.config.ts`, replace the `googleClientId` value:

```ts
export default defineAppConfig({
  googleClientId: 'YOUR_CLIENT_ID.apps.googleusercontent.com',
  driveScope: 'https://www.googleapis.com/auth/drive.appdata',
  driveFileName: 'zakat-app-data.json',
  appVersion: 1,
})
```

Commit and push — Google Sync is now active.

### Testing Sign-In

- Sign-in requires a valid Client ID and an authorized origin
- Locally, use `http://localhost:3000` (the Nuxt dev server port)
- The sign-in button appears on the landing page (for guests) and in the navbar

---

## 3. CI/CD Workflows

### CI — Pull Requests

`.github/workflows/ci.yml` runs on every PR to `main`:
- Bun setup + `bun install` + `bun run test` + `bun run build`

### Deploy — Push to main

`.github/workflows/deploy.yml`:
1. Installs dependencies with Bun
2. Runs the full test suite
3. Builds with `nuxt build` (using `github_pages` Nitro preset)
4. Uploads `.output/public` to GitHub Pages

### Required Permissions

Already configured in the workflow files:
- `contents: read` — checkout the repo
- `pages: write` — deploy to Pages
- `id-token: write` — OIDC authentication with Pages

No repository secrets are needed.

---

## 4. Local Development

```bash
# Prerequisites: Bun (https://bun.sh)
bun install             # Install dependencies
bun run dev             # Dev server at http://localhost:3000
bun run test            # Run tests
bun run build           # Production build
bun run preview         # Preview production build
```

---

## 5. Security Notes

| Item | Where | Notes |
|------|-------|-------|
| Google Client ID | `app/app.config.ts` | Not a secret — designed to be public. Security comes from authorized origins. |
| User data | Browser `localStorage` | Never leaves the device unless user opts into Drive sync |
| Drive sync data | Google Drive AppData | Invisible to user in Drive, only accessible by this app |
| Auth tokens | In-memory only | OAuth2 access tokens are held in a Vue ref, never persisted to storage |

- Never commit actual API keys or service account credentials
- The app has no backend — there are no server secrets to manage

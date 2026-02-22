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
- The workflow runs **tests first** — if any fail, deployment is blocked
- Only `index.html` and `404.html` are deployed
- Manual deploys: **Actions** > **Deploy to GitHub Pages** > **Run workflow**

### Custom Domain (optional)

1. **Settings** > **Pages** > **Custom domain** > enter your domain
2. Add a `CNAME` DNS record pointing to `YOUR_USERNAME.github.io`
3. Check **Enforce HTTPS**
4. Update the deploy workflow to include a CNAME file:

```yaml
      - name: Prepare site files
        run: |
          mkdir _site
          cp index.html 404.html _site/
          echo "zakat.example.com" > _site/CNAME
```

---

## 2. Google Drive Sync (Optional)

The app works fully **without** Google Sign-In — data is saved in localStorage. Sign-in adds cross-device sync via Google Drive's AppData folder.

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
   http://localhost:8080
   ```
5. No redirect URIs needed (uses popup flow)
6. Click **Create** > copy the **Client ID**

### Step 5 — Add Client ID to the App

In `index.html`, find the CONFIG section and replace:

```js
GOOGLE_CLIENT_ID: 'YOUR_GOOGLE_CLIENT_ID',
```

with your actual Client ID:

```js
GOOGLE_CLIENT_ID: '123456789-abc.apps.googleusercontent.com',
```

Commit and push — Google Sync is now active.

### Testing Sign-In

- With the placeholder `'YOUR_GOOGLE_CLIENT_ID'`, the app shows a warning and falls back to offline mode
- Sign-in works locally at `http://localhost:8080` if that origin is in your OAuth credentials

---

## 3. CI/CD Workflows

### CI — Pull Requests

`.github/workflows/ci.yml` runs on every PR to `main`:
- Bun + `bun install` + `bun test`

### Deploy — Push to main

`.github/workflows/deploy.yml`:
1. **Test job**: runs the full test suite
2. **Deploy job** (depends on tests passing): uploads site files to GitHub Pages

### Required Permissions

Already configured in the workflow files:
- `contents: read` — checkout the repo
- `pages: write` — deploy to Pages
- `id-token: write` — OIDC authentication with Pages

No repository secrets are needed.

---

## 4. Security Notes

| Item | Where | Notes |
|------|-------|-------|
| Google Client ID | `index.html` CONFIG | Not a secret — designed to be public. Security comes from authorized origins. |
| User data | Browser `localStorage` | Never leaves the device unless user opts into Drive sync |
| Drive sync data | Google Drive AppData | Invisible to user, only accessible by this app |

- Never commit actual API keys or service account credentials
- The app has no backend — there are no server secrets to manage

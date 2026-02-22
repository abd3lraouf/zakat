# Setup Guide

Complete guide to configure GitHub Pages deployment, Google OAuth, and secrets for the Zakat App.

---

## 1. Repository Setup

```bash
# Clone or init the repo
git init
git remote add origin https://github.com/YOUR_USERNAME/zakat.git

# Install dev dependencies (for testing)
npm install

# Run tests locally
npm test

# Serve locally
python3 -m http.server 8080
# Open http://localhost:8080
```

## 2. GitHub Pages Configuration

### Enable Pages in repository settings

1. Go to **Settings** > **Pages** in your GitHub repository
2. Under **Source**, select **GitHub Actions**
3. The deploy workflow (`.github/workflows/deploy.yml`) handles the rest automatically

### How deployment works

- **Push to `main`** triggers the deploy workflow
- The workflow runs **tests first** — if any test fails, deployment is blocked
- Only `index.html` and `404.html` are deployed (test files, node_modules, etc. are excluded)
- Manual deploys are also available via **Actions** > **Deploy to GitHub Pages** > **Run workflow**

### Custom domain (optional)

1. Go to **Settings** > **Pages**
2. Under **Custom domain**, enter your domain (e.g., `zakat.example.com`)
3. Add a `CNAME` record in your DNS pointing to `YOUR_USERNAME.github.io`
4. Check **Enforce HTTPS**

If using a custom domain, update the deploy workflow to include the CNAME file:
```yaml
      - name: Prepare site files
        run: |
          mkdir _site
          cp index.html 404.html _site/
          echo "zakat.example.com" > _site/CNAME
```

## 3. Google OAuth Setup (for Drive Sync)

The app supports optional Google Drive sync. To enable it:

### Create OAuth credentials

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project (or select existing)
3. Navigate to **APIs & Services** > **OAuth consent screen**
   - Choose **External** user type
   - Fill in app name: `Zakat App`
   - Add scopes: `drive.appdata`, `userinfo.profile`
   - Add your domain to authorized domains
4. Navigate to **APIs & Services** > **Credentials**
5. Click **Create Credentials** > **OAuth 2.0 Client ID**
   - Application type: **Web application**
   - Authorized JavaScript origins:
     - `https://YOUR_USERNAME.github.io` (production)
     - `http://localhost:8080` (development)
   - No redirect URIs needed (uses popup flow)
6. Copy the **Client ID**

### Configure the app

In `index.html`, find the CONFIG section near line ~1697 and replace:

```js
GOOGLE_CLIENT_ID: 'YOUR_GOOGLE_CLIENT_ID',
```

with your actual Client ID:

```js
GOOGLE_CLIENT_ID: '123456789-abc.apps.googleusercontent.com',
```

### Enable required APIs

In Google Cloud Console:
1. Go to **APIs & Services** > **Library**
2. Enable **Google Drive API**
3. Enable **Google People API** (for profile info)

### Testing Google Sign-In

- The app works without Google Sign-In (offline mode with localStorage)
- When the Client ID is set to `'YOUR_GOOGLE_CLIENT_ID'`, the app shows a warning and skips to offline mode
- Sign-in can be tested locally at `http://localhost:8080` if your OAuth credentials include `http://localhost:8080` as an authorized origin

## 4. CI/CD Workflows

### CI (Pull Requests)

`.github/workflows/ci.yml` runs on every pull request to `main`:
- Installs Node.js 20
- Runs `npm install`
- Runs `npm test` (126 unit tests)

### Deploy (Push to main)

`.github/workflows/deploy.yml` runs on every push to `main`:
1. **Test job**: runs the full test suite
2. **Deploy job** (depends on test passing): uploads `index.html` + `404.html` to GitHub Pages

### Required repository permissions

The deploy workflow needs these permissions (already configured in the workflow file):
- `contents: read` — to checkout the repo
- `pages: write` — to deploy to Pages
- `id-token: write` — for OIDC authentication with Pages

No repository secrets are needed — the workflow uses GitHub's built-in OIDC tokens.

## 5. Environment Variables & Secrets

This project has **no server-side secrets**. Everything runs client-side.

| Item | Where | Notes |
|------|-------|-------|
| Google Client ID | `index.html` CONFIG section | Not a secret — visible in browser. Restricted by authorized origins. |
| User data | Browser `localStorage` | Never leaves the device unless user opts into Drive sync |
| Drive sync data | Google Drive AppData folder | Invisible to the user, only accessible by the app |

### Security notes

- The Google Client ID is **not sensitive** — it's designed to be public. Security comes from the authorized origins restriction.
- Never commit actual API keys or service account credentials.
- The app has no backend, so there are no server secrets to manage.

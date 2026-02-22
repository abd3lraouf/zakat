# زكاة · Zakat App

A premium, bilingual (Arabic/English) web app to **calculate Zakat** from your assets and **track payments** — with optional Google Drive sync. Deployable as a static site on GitHub Pages with zero backend.

[![Deploy to GitHub Pages](https://img.shields.io/badge/Deploy-GitHub%20Pages-brightgreen?logo=github)](https://pages.github.com/)

---

## ✨ Features

| Feature | Description |
|---------|-------------|
| 🧮 **Zakat Calculator** | Full Nisab calculation (gold & silver standards), all asset types, real-time breakdown |
| 📋 **Payment Tracker** | Log payments, dynamic rows, category dropdown (all 8 Quranic recipients), progress bar |
| ☁ **Google Drive Sync** | Auto-sync across devices via Drive AppData (invisible folder, no Drive permission needed) |
| 💾 **Import / Export** | JSON backup/restore for local saves |
| 🌐 **Bilingual** | Arabic (RTL) + English (LTR), auto-detected from browser locale |
| 📱 **Mobile-first** | Fully responsive from 320px to 1440px, bottom navigation on mobile |
| 🔒 **Private** | All data in localStorage, Drive AppData only — never shared |
| 🖨 **Print-ready** | Print stylesheet shows only calculation summary |
| 🌙 **Dark mode** | Respects `prefers-color-scheme` |

---

## 🚀 Deploy to GitHub Pages

### Option A — Fork & Deploy (5 minutes)

1. **Fork** this repository
2. Go to your fork → **Settings** → **Pages**
3. Under **Source**, select **GitHub Actions**
4. Push any change to `main` — the site will deploy automatically

Your app will be live at: `https://YOUR_USERNAME.github.io/REPO_NAME/`

---

### Option B — New Repository

```bash
# Clone or download this repo, then:
git init
git add .
git commit -m "Initial Zakat App"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/zakat-app.git
git push -u origin main
```

Then enable GitHub Pages via Settings → Pages → GitHub Actions source.

---

## 🔑 Google Sign-In Setup (Optional)

The app works fully **without** Google Sign-In — your data is saved in localStorage. Sign-in adds cross-device sync via Google Drive.

### Step 1 — Create Google Cloud Project

1. Go to [console.cloud.google.com](https://console.cloud.google.com)
2. Click **New Project** → Name it "Zakat App" → Create
3. In the sidebar: **APIs & Services** → **Enable APIs**
4. Search for and enable: **Google Drive API**

### Step 2 — Create OAuth Credentials

1. Go to **APIs & Services** → **Credentials** → **Create Credentials** → **OAuth 2.0 Client ID**
2. Application type: **Web application**
3. Name: "Zakat App Web"
4. **Authorized JavaScript origins** — add:
   ```
   http://localhost:8080
   https://YOUR_USERNAME.github.io
   ```
5. Click **Create** → Copy the **Client ID**

### Step 3 — OAuth Consent Screen

1. Go to **OAuth consent screen**
2. User type: **External** → Create
3. App name: Zakat App | Support email: your email
4. Scopes: click **Add or Remove Scopes** → find `drive.appdata` → Add
5. Save — no Google verification needed for personal use

### Step 4 — Add Client ID to the App

Open `index.html` and find this line (near the top of the `<script>` section):

```javascript
const CONFIG = {
  GOOGLE_CLIENT_ID: 'YOUR_GOOGLE_CLIENT_ID', // ← Replace this
```

Replace `YOUR_GOOGLE_CLIENT_ID` with your actual Client ID:

```javascript
GOOGLE_CLIENT_ID: '123456789-abcdefgh.apps.googleusercontent.com',
```

Commit and push — Google Sync is now active.

---

## 📁 Project Structure

```
zakat-app/
├── index.html                  ← Entire app (HTML + CSS + JS)
├── 404.html                    ← SPA redirect for GitHub Pages
├── _config.yml                 ← Jekyll config (minimal)
├── README.md                   ← This file
└── .github/
    └── workflows/
        └── deploy.yml          ← Auto-deploy on push to main
```

---

## 🧮 Calculation Logic

### Nisab Thresholds
| Standard | Amount | Conservative |
|----------|--------|-------------|
| Gold Nisab | 87.48g of 24K gold | ✓ Used (lower) |
| Silver Nisab | 612.36g of silver | ✓ Used (lower) |

The app uses the **lower of the two** (conservative approach). Nisab value = grams × current price per gram.

### Asset Types
- 24K, 21K, 18K Gold (grams)
- Silver (grams)
- Cash & Bank Balance
- Business Inventory
- Receivable Money
- Investments & Stocks
- Other Assets (+ custom rows)

### Deductions
- Immediate Debts (bills due within the year)
- Other Liabilities

### Formula
```
Net Zakatable Wealth = Gross Assets − Deductions
Zakat Due = Net Wealth × 2.5%   (only if ≥ Nisab)
```

---

## 💾 Data Schema

Your data is stored in `localStorage` under key `zakat_app_data` and synced to Google Drive as `zakat-app-data.json` in the AppData folder:

```json
{
  "version": 1,
  "exportedAt": "2026-02-22T10:00:00Z",
  "lastModified": "2026-02-22T10:00:00Z",
  "language": "ar",
  "calculator": {
    "prices": { "gold24PerGram": 4625, "silverPerGram": 48.50 },
    "assets": { "gold24g": 502.1, "cash": 107000, ... },
    "deductions": { "immediateDebts": 0, "otherLiabilities": 0 },
    "customAssets": []
  },
  "tracker": {
    "payments": [
      { "id": "pay_...", "date": "2026-02-01", "recipient": "مؤسسة مصر الخير",
        "category": "cat.faqir", "amount": 10000, "notes": "" }
    ]
  }
}
```

---

## 🛠 Local Development

```bash
# Serve locally (Python 3)
cd zakat-app
python3 -m http.server 8080

# Then open: http://localhost:8080
```

For Google Sign-In to work locally, ensure `http://localhost:8080` is in your OAuth authorized origins.

---

## 🌐 Zakat Categories (8 Recipients — Quran 9:60)

| Key | English | Arabic |
|-----|---------|--------|
| Faqir | The poor (who do not ask) | الفقير |
| Miskin | The needy (who may ask) | المسكين |
| Amil | Zakat administrator | العامل على الزكاة |
| Muallaf | New Muslims / hearts to be reconciled | المؤلفة قلوبهم |
| Riqab | Freeing captives | الرقاب |
| Gharim | Those in debt | الغارم |
| Fi Sabilillah | In the cause of Allah | في سبيل الله |
| Ibn Sabil | Stranded traveler | ابن السبيل |

---

## ⌨️ Keyboard Shortcuts

| Shortcut | Action |
|----------|--------|
| `Alt + C` | Go to Calculator |
| `Alt + T` | Go to Tracker |
| `Escape` | Close modals / menus |

---

## 📄 License

Free to use and modify for personal use. Please do not redistribute as a commercial product.

---

*بارك الله فيكم · May Allah accept your Zakat*

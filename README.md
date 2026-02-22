# Zakat App

A bilingual (Arabic/English) web app to calculate Zakat and track payments — with optional Google Drive sync.

**[Live App](https://abd3lraouf.github.io/zakat/)** | **[Setup Guide](docs/SETUP.md)** | **[Contributing](CONTRIBUTING.md)**

---

## Features

- **Zakat Calculator** — Full Nisab calculation (gold & silver), all asset types, real-time breakdown
- **Payment Tracker** — Log payments with categories for all 8 Quranic recipients
- **Google Drive Sync** — Optional cross-device sync via Drive AppData
- **Bilingual** — Arabic (RTL) + English (LTR), auto-detected from browser locale
- **Dark Mode** — Respects `prefers-color-scheme`
- **Mobile-first** — Responsive from 320px to 1440px with bottom navigation
- **Private** — All data in localStorage; Drive AppData only if opted in
- **Import / Export** — JSON backup and restore
- **Accessible** — WCAG AA contrast, 44px touch targets, keyboard navigation
- **Zero Dependencies** — Single `index.html` file, no build step, no backend

---

## Quick Start

```bash
git clone https://github.com/abd3lraouf/zakat.git
cd zakat
python3 -m http.server 8080
# Open http://localhost:8080
```

To deploy your own instance or enable Google Drive sync, see the **[Setup Guide](docs/SETUP.md)**.

---

## Project Structure

```
zakat/
├── index.html              # Entire app (HTML + CSS + JS)
├── 404.html                # SPA redirect for GitHub Pages
├── _config.yml             # Jekyll config (minimal)
├── docs/
│   └── SETUP.md            # Deployment & Google OAuth guide
├── tests/                  # Vitest unit tests
├── .github/workflows/
│   ├── deploy.yml          # Auto-deploy on push to main
│   └── ci.yml              # Test on pull requests
├── CONTRIBUTING.md
├── CHANGELOG.md
├── LICENSE
└── CLAUDE.md               # Architecture reference
```

---

## Zakat Calculation

| | Threshold |
|---|---|
| Gold Nisab | 87.48g of 24K gold |
| Silver Nisab | 612.36g of silver |

The app uses the **lower** of the two (conservative approach).

```
Net Zakatable Wealth = Gross Assets - Deductions
Zakat Due = Net Wealth x 2.5%   (only if >= Nisab)
```

---

## License

[MIT](LICENSE)

---

*May Allah accept your Zakat*

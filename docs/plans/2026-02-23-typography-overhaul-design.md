# Typography Overhaul Design

## Problem

The app has 150+ hardcoded `font-size` values with no unified scale. Only 5% use `clamp()` for responsiveness. Letter-spacing and line-height are applied ad-hoc per component. The heading font (Playfair Display) doesn't pair well with the body font. Result: inconsistent hierarchy, poor mobile scaling, amateurish feel.

## Font Pairing

| Role | English | Arabic |
|------|---------|--------|
| Body | Plus Jakarta Sans (keep) | Cairo (keep) |
| Headings / Serif | Cormorant Garamond (new) | Amiri (keep) |
| Monospace | DM Mono (keep) | DM Mono (keep) |
| Brand (logo only) | Aref Ruqaa (keep) | Aref Ruqaa (keep) |

**Why Cormorant Garamond:** More refined than Playfair Display, lighter optical weight, better contrast with Jakarta Sans, available in 300-700 weights.

## Type Scale (CSS Custom Properties)

All sizes use `clamp()` for fluid responsiveness.

```css
--text-xs:      clamp(11px, 0.2vw + 10.5px, 12px)
--text-sm:      clamp(12px, 0.2vw + 11.5px, 13px)
--text-base:    clamp(14px, 0.3vw + 13px,   15px)
--text-md:      clamp(15px, 0.4vw + 14px,   17px)
--text-lg:      clamp(18px, 0.8vw + 16px,   22px)
--text-xl:      clamp(22px, 1.2vw + 19px,   30px)
--text-2xl:     clamp(26px, 1.5vw + 22px,   36px)
--text-display: clamp(32px, 2.5vw + 24px,   48px)
```

## Line-Height Tokens

```css
--leading-tight:   1.1
--leading-snug:    1.3
--leading-normal:  1.6
--leading-relaxed: 1.8
```

## Letter-Spacing Tokens

```css
--tracking-tight:  -0.01em
--tracking-normal:  0
--tracking-wide:    0.03em
--tracking-wider:   0.06em
--tracking-widest:  0.1em
```

## Font-Weight Tokens

```css
--weight-normal: 400
--weight-medium: 500
--weight-semi:   600
--weight-bold:   700
```

## Token-to-UI Mapping

| UI Element | Size | Weight | Line-Height | Letter-Spacing |
|---|---|---|---|---|
| Page titles | `--text-xl` | `--weight-bold` | `--leading-snug` | — |
| Page subtitles | `--text-sm` | `--weight-normal` | `--leading-normal` | `--tracking-wide` |
| Card section headers (uppercase) | `--text-sm` | `--weight-semi` | — | `--tracking-widest` |
| Card body text / labels | `--text-base` | `--weight-normal` | `--leading-normal` | — |
| Card header (h3) | `--text-md` | `--weight-semi` | `--leading-snug` | — |
| Input values / mono numbers | `--text-base` | `--weight-medium` | — | — |
| Display numbers (zakat due, totals) | `--text-display` | `--weight-bold` | `--leading-tight` | `--tracking-tight` |
| Navbar logo | `--text-lg` | `--weight-bold` | `--leading-tight` | — |
| Navbar links | `--text-sm` | `--weight-medium` | — | `--tracking-wide` |
| Bottom nav labels | `--text-xs` | — | — | `--tracking-wide` |
| Buttons | `--text-sm` | `--weight-semi` | — | `--tracking-wide` |
| Badges / pills | `--text-xs` | `--weight-semi` | — | — |
| Toast messages | `--text-sm` | `--weight-medium` | — | — |
| Landing bismillah | `--text-2xl` | — | — | `--tracking-widest` |
| Landing verse (Arabic) | `--text-xl` | — | `--leading-relaxed` | — |
| Landing verse (translation) | `--text-base` | — | `--leading-normal` | — |

## Global Base Changes

- `body { line-height: var(--leading-normal); }` — inherited by all text
- `h1, h2, h3 { line-height: var(--leading-snug); }` — tighter for headings
- Remove ad-hoc `[dir="rtl"] { font-size: 17px }` overrides — the fluid scale handles Arabic

## RTL Handling

Font-family switching remains at body and heading levels (same as today). Size tokens are shared between LTR/RTL — `clamp()` ranges accommodate Arabic's taller glyphs. Per-component RTL font-size overrides are removed.

## Files Affected

1. `nuxt.config.ts` — swap Playfair Display for Cormorant Garamond
2. `app/assets/css/main.css` — add all tokens, update `--font-en-serif`
3. `app/assets/css/base.css` — global line-height, heading styles
4. All components in `app/components/` — replace hardcoded values with tokens
5. All pages in `app/pages/` — replace hardcoded values with tokens
6. `app/layouts/default.vue` — replace hardcoded values with tokens

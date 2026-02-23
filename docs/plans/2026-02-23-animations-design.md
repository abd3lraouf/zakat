# Site-wide Animation Upgrade — Design

**Date:** 2026-02-23
**Goal:** Elegant, cinematic animations across the entire app using a layered system.
**Library:** `@vueuse/motion` + CSS transitions + Vue `<Transition>`/`<TransitionGroup>`

## Architecture: Three Layers

### Layer 1 — Page Transitions

Nuxt `pageTransition` config in `nuxt.config.ts`. CSS classes in `base.css`.

- **Out:** opacity 1→0, translateY(0→-12px), 200ms ease
- **In:** opacity 0→1, translateY(12px→0), 300ms cubic-bezier(0.16, 1, 0.3, 1)

Replaces per-page `animation: viewIn` declarations with a unified transition system.

### Layer 2 — Component Scroll Reveals

`v-motion` directives on major content blocks. Fires once on first scroll into viewport (`visibleOnce`).

**Default motion preset:**
```
initial: { opacity: 0, y: 24 }
visibleOnce: { opacity: 1, y: 0, transition: { duration: 400, ease: [0.16, 1, 0.3, 1], delay: staggerIndex * 80 } }
```

**Targets:**
- Calculator: AssetSection cards, DeductionInputs, SummaryPanel
- Tracker: Summary cards, PaymentTable rows
- Profile: Upgrade existing card stagger to spring-based v-motion
- Landing: Enhance CTA button with spring bounce on reveal

### Layer 3 — Interactive Micro-feedback (CSS)

**Button press:**
- `:active` scale(0.97), 100ms transition
- Release spring-back via cubic-bezier(0.34, 1.56, 0.64, 1)

**Input focus:**
- Gold glow ring: box-shadow 0 0 0 3px rgba(184,147,58,0.15), 200ms transition

**Card hover:**
- translateY(-2px) + enhanced shadow, 200ms transition

**List enter/leave:**
- Vue `<TransitionGroup>` on payment rows and custom asset rows
- Enter: slide+fade in
- Leave: collapse + fade out

**Number animation:**
- `useAnimatedNumber` composable (requestAnimationFrame, 400ms tween)
- Used on zakat total, progress percentages, summary amounts

**Lang toggle:**
- Spring transition on USwitch thumb
- Smooth color cross-fade on labels

## Accessibility

- All animations respect `prefers-reduced-motion` (existing base.css rule)
- `visibleOnce` prevents re-triggering on scroll back
- No animation blocks interaction or delays content visibility

## Dependencies

- `@vueuse/motion` (~4KB) — scroll-triggered reveals, spring physics
- No other new dependencies

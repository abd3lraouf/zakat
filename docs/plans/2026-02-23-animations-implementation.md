# Site-wide Animation Upgrade — Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Add elegant, cinematic animations across the entire app using a three-layer system: page transitions, scroll-triggered reveals, and interactive micro-feedback.

**Architecture:** `@vueuse/motion` for scroll-triggered component reveals + Nuxt `pageTransition` for route changes + CSS for interactive micro-feedback. All animations respect `prefers-reduced-motion`.

**Tech Stack:** `@vueuse/motion`, Nuxt page transitions, CSS transitions/keyframes, Vue `<TransitionGroup>`, `requestAnimationFrame` composable.

---

### Task 1: Install @vueuse/motion and Register Module

**Files:**
- Modify: `package.json:16-25`
- Modify: `nuxt.config.ts:6-12`

**Step 1: Install the package**

Run: `cd /Users/abd3lraouf/Developer/zakat && npm install @vueuse/motion`
Expected: Package added to dependencies in package.json

**Step 2: Register the Nuxt module**

In `nuxt.config.ts`, add `'@vueuse/motion'` to the modules array:

```ts
  modules: [
    '@nuxt/ui',
    '@pinia/nuxt',
    '@nuxtjs/i18n',
    '@nuxtjs/google-fonts',
    '@nuxtjs/seo',
    '@vueuse/motion/nuxt',
  ],
```

**Step 3: Verify dev server starts**

Run: `cd /Users/abd3lraouf/Developer/zakat && npx nuxi build 2>&1 | tail -5`
Expected: Build succeeds with no errors

**Step 4: Commit**

```bash
git add package.json package-lock.json nuxt.config.ts
git commit -m "feat: add @vueuse/motion for animation system"
```

---

### Task 2: Add Nuxt Page Transitions

**Files:**
- Modify: `nuxt.config.ts:31-52` (add pageTransition to app config)
- Modify: `app/assets/css/base.css:74-82` (add page transition CSS classes)
- Modify: `app/pages/calculator.vue:83` (remove viewIn animation)
- Modify: `app/pages/tracker.vue:40` (remove viewIn animation)
- Modify: `app/pages/profile.vue:56` (remove viewIn animation)

**Step 1: Add pageTransition config to nuxt.config.ts**

In `nuxt.config.ts`, inside the `app: {}` block (after line 31), add:

```ts
  app: {
    pageTransition: { name: 'page', mode: 'out-in' },
    head: {
```

**Step 2: Add page transition CSS classes to base.css**

After the existing `viewIn`/`viewOut` keyframes (after line 82), add:

```css
/* ── Page transitions ── */
.page-enter-active {
  transition: opacity 0.3s cubic-bezier(0.16, 1, 0.3, 1),
              transform 0.3s cubic-bezier(0.16, 1, 0.3, 1);
}
.page-leave-active {
  transition: opacity 0.2s ease,
              transform 0.2s ease;
}
.page-enter-from {
  opacity: 0;
  transform: translateY(12px);
}
.page-leave-to {
  opacity: 0;
  transform: translateY(-12px);
}
```

**Step 3: Remove per-page viewIn animations**

In `app/pages/calculator.vue:83`, remove:
```css
  animation: viewIn 0.3s cubic-bezier(0.16, 1, 0.3, 1) both;
```

In `app/pages/tracker.vue:40`, remove:
```css
  animation: viewIn 0.3s cubic-bezier(0.16, 1, 0.3, 1) both;
```

In `app/pages/profile.vue:56`, remove:
```css
  animation: viewIn 0.3s cubic-bezier(0.16, 1, 0.3, 1) both;
```

**Step 4: Verify page transitions work**

Run: `cd /Users/abd3lraouf/Developer/zakat && npx nuxi build 2>&1 | tail -5`
Expected: Build succeeds

**Step 5: Commit**

```bash
git add nuxt.config.ts app/assets/css/base.css app/pages/calculator.vue app/pages/tracker.vue app/pages/profile.vue
git commit -m "feat: add cinematic page transitions, remove per-page viewIn"
```

---

### Task 3: Add Scroll Reveals to Calculator Page

**Files:**
- Modify: `app/pages/calculator.vue:40-73` (add v-motion directives to sections)

**Step 1: Add v-motion to calculator page sections**

In `app/pages/calculator.vue`, update the `calc-layout` children with v-motion directives:

```html
    <div class="calc-layout">
      <!-- Left column: inputs -->
      <div
        class="calc-inputs"
        v-motion
        :initial="{ opacity: 0, y: 24 }"
        :visible-once="{ opacity: 1, y: 0, transition: { duration: 400, ease: 'easeOut' } }"
      >
```

And for the summary panel:

```html
      <!-- Right column: summary -->
      <CalculatorSummaryPanel
        v-motion
        :initial="{ opacity: 0, y: 24 }"
        :visible-once="{ opacity: 1, y: 0, transition: { duration: 400, ease: 'easeOut', delay: 100 } }"
      />
```

**Step 2: Verify build**

Run: `cd /Users/abd3lraouf/Developer/zakat && npx nuxi build 2>&1 | tail -5`
Expected: Build succeeds

**Step 3: Commit**

```bash
git add app/pages/calculator.vue
git commit -m "feat: add scroll-triggered reveals to calculator page"
```

---

### Task 4: Add Scroll Reveals to Tracker Page

**Files:**
- Modify: `app/pages/tracker.vue:28-30` (add v-motion to sections)

**Step 1: Add v-motion to tracker page sections**

In `app/pages/tracker.vue`, wrap the three main components with motion directives:

```html
    <TrackerPaidBanner
      v-motion
      :initial="{ opacity: 0, y: 24 }"
      :visible-once="{ opacity: 1, y: 0, transition: { duration: 400, ease: 'easeOut' } }"
    />
    <TrackerSummary
      v-motion
      :initial="{ opacity: 0, y: 24 }"
      :visible-once="{ opacity: 1, y: 0, transition: { duration: 400, ease: 'easeOut', delay: 80 } }"
    />
    <TrackerPaymentTable
      v-motion
      :initial="{ opacity: 0, y: 24 }"
      :visible-once="{ opacity: 1, y: 0, transition: { duration: 400, ease: 'easeOut', delay: 160 } }"
    />
```

**Step 2: Verify build**

Run: `cd /Users/abd3lraouf/Developer/zakat && npx nuxi build 2>&1 | tail -5`
Expected: Build succeeds

**Step 3: Commit**

```bash
git add app/pages/tracker.vue
git commit -m "feat: add scroll-triggered reveals to tracker page"
```

---

### Task 5: Upgrade Profile Page Card Reveals to v-motion

**Files:**
- Modify: `app/pages/profile.vue:30-46` (replace CSS card animation with v-motion)
- Modify: `app/pages/profile.vue:123-130` (remove cardSlideUp keyframe and .card-animate CSS)

**Step 1: Replace CSS card animations with v-motion**

In `app/pages/profile.vue`, replace the profile-cards section (lines 30-46) with:

```html
    <div class="profile-cards">
      <div
        v-for="(component, i) in [
          'ProfileAppSettings',
          'ProfileAccountCard',
          'ProfileSyncCard',
          'ProfileDataManagement',
          'ProfileAboutCard',
        ]"
        :key="component"
        v-motion
        :initial="{ opacity: 0, y: 20 }"
        :visible-once="{ opacity: 1, y: 0, transition: { duration: 400, ease: 'easeOut', delay: i * 80 } }"
      >
        <component :is="component" />
      </div>
    </div>
```

Wait — dynamic components need to be resolved. Better to keep the explicit components and add v-motion to each wrapper div:

```html
    <div class="profile-cards">
      <div
        v-motion
        :initial="{ opacity: 0, y: 20 }"
        :visible-once="{ opacity: 1, y: 0, transition: { duration: 400, ease: 'easeOut' } }"
      >
        <ProfileAppSettings />
      </div>
      <div
        v-motion
        :initial="{ opacity: 0, y: 20 }"
        :visible-once="{ opacity: 1, y: 0, transition: { duration: 400, ease: 'easeOut', delay: 80 } }"
      >
        <ProfileAccountCard />
      </div>
      <div
        v-motion
        :initial="{ opacity: 0, y: 20 }"
        :visible-once="{ opacity: 1, y: 0, transition: { duration: 400, ease: 'easeOut', delay: 160 } }"
      >
        <ProfileSyncCard />
      </div>
      <div
        v-motion
        :initial="{ opacity: 0, y: 20 }"
        :visible-once="{ opacity: 1, y: 0, transition: { duration: 400, ease: 'easeOut', delay: 240 } }"
      >
        <ProfileDataManagement />
      </div>
      <div
        v-motion
        :initial="{ opacity: 0, y: 20 }"
        :visible-once="{ opacity: 1, y: 0, transition: { duration: 400, ease: 'easeOut', delay: 320 } }"
      >
        <ProfileAboutCard />
      </div>
    </div>
```

**Step 2: Remove old CSS card animation**

In `app/pages/profile.vue`, remove lines 123-130:

```css
.card-animate {
  animation: cardSlideUp 0.4s calc(var(--i) * 0.08s) var(--ease-out) both;
}

@keyframes cardSlideUp {
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
}
```

**Step 3: Verify build**

Run: `cd /Users/abd3lraouf/Developer/zakat && npx nuxi build 2>&1 | tail -5`
Expected: Build succeeds

**Step 4: Commit**

```bash
git add app/pages/profile.vue
git commit -m "feat: upgrade profile cards to spring-based scroll reveals"
```

---

### Task 6: Add Global Button Press Feedback (CSS)

**Files:**
- Modify: `app/assets/css/base.css` (add button active state after print styles)

**Step 1: Add button press CSS to base.css**

After the print styles section (after line 119), add:

```css
/* ═══════════════════════════════════════════════════════════
   INTERACTIVE MICRO-FEEDBACK
═══════════════════════════════════════════════════════════ */

/* ── Button press feedback ── */
button,
[role="button"],
.cta-btn {
  transition: transform 0.15s cubic-bezier(0.34, 1.56, 0.64, 1);
}

button:active:not(:disabled),
[role="button"]:active:not(:disabled),
.cta-btn:active:not(:disabled) {
  transform: scale(0.97);
}

/* ── Input focus glow ── */
input:focus-visible,
textarea:focus-visible,
select:focus-visible {
  box-shadow: 0 0 0 3px rgba(184, 147, 58, 0.15);
  transition: box-shadow 0.2s ease;
}
```

**Step 2: Verify build**

Run: `cd /Users/abd3lraouf/Developer/zakat && npx nuxi build 2>&1 | tail -5`
Expected: Build succeeds

**Step 3: Commit**

```bash
git add app/assets/css/base.css
git commit -m "feat: add button press and input focus micro-feedback"
```

---

### Task 7: Add List Item Transitions to Payment Table

**Files:**
- Modify: `app/components/tracker/PaymentTable.vue:55-64` (wrap rows in TransitionGroup)

**Step 1: Add TransitionGroup to payment rows**

In `app/components/tracker/PaymentTable.vue`, replace the tbody (lines 55-64) with:

```html
        <TransitionGroup name="row" tag="tbody">
          <TrackerPaymentRow
            v-for="(payment, idx) in tracker.payments"
            :key="payment.id"
            :payment="payment"
            :index="idx"
            @update:field="onUpdateField"
            @delete="onDelete"
          />
        </TransitionGroup>
```

Remove the `v-if` on the old tbody — use a separate empty-state check instead.

**Step 2: Add row transition CSS**

In `app/components/tracker/PaymentTable.vue`, add to the `<style scoped>` section:

```css
/* ── Row transitions ── */
.row-enter-active {
  transition: opacity 0.3s cubic-bezier(0.16, 1, 0.3, 1),
              transform 0.3s cubic-bezier(0.16, 1, 0.3, 1);
}
.row-leave-active {
  transition: opacity 0.2s ease,
              transform 0.2s ease;
}
.row-enter-from {
  opacity: 0;
  transform: translateY(-8px);
}
.row-leave-to {
  opacity: 0;
  transform: translateX(20px);
}
.row-move {
  transition: transform 0.3s cubic-bezier(0.16, 1, 0.3, 1);
}
```

**Step 3: Verify build**

Run: `cd /Users/abd3lraouf/Developer/zakat && npx nuxi build 2>&1 | tail -5`
Expected: Build succeeds

**Step 4: Commit**

```bash
git add app/components/tracker/PaymentTable.vue
git commit -m "feat: add slide transitions for payment row add/remove"
```

---

### Task 8: Add List Item Transitions to Custom Assets

**Files:**
- Modify: `app/components/calculator/CustomAssets.vue:31-58` (wrap rows in TransitionGroup)
- Modify: `app/components/calculator/CustomAssets.vue:88-104` (replace animation CSS)

**Step 1: Wrap custom asset rows in TransitionGroup**

In `app/components/calculator/CustomAssets.vue`, replace the v-for div (lines 31-58) with:

```html
    <TransitionGroup name="asset-row">
      <div
        v-for="(asset, index) in store.customAssets"
        :key="asset.id"
        class="custom-row"
      >
        <!-- ... existing row contents unchanged ... -->
      </div>
    </TransitionGroup>
```

**Step 2: Replace old slideDown animation with transition CSS**

Remove the old dark-mode-only animation (lines 96-104) and replace with:

```css
/* ── Row transitions ── */
.asset-row-enter-active {
  transition: opacity 0.25s cubic-bezier(0.16, 1, 0.3, 1),
              transform 0.25s cubic-bezier(0.16, 1, 0.3, 1);
}
.asset-row-leave-active {
  transition: opacity 0.2s ease,
              transform 0.2s ease;
}
.asset-row-enter-from {
  opacity: 0;
  transform: translateY(-10px);
}
.asset-row-leave-to {
  opacity: 0;
  transform: translateX(20px);
}
.asset-row-move {
  transition: transform 0.25s cubic-bezier(0.16, 1, 0.3, 1);
}
```

**Step 3: Verify build**

Run: `cd /Users/abd3lraouf/Developer/zakat && npx nuxi build 2>&1 | tail -5`
Expected: Build succeeds

**Step 4: Commit**

```bash
git add app/components/calculator/CustomAssets.vue
git commit -m "feat: add slide transitions for custom asset row add/remove"
```

---

### Task 9: Create useAnimatedNumber Composable

**Files:**
- Create: `app/composables/useAnimatedNumber.ts`

**Step 1: Create the composable**

```ts
import { ref, watch, type Ref } from 'vue'

export function useAnimatedNumber(source: Ref<number>, duration = 400) {
  const displayed = ref(source.value)
  let raf: number | null = null

  watch(source, (to) => {
    if (raf) cancelAnimationFrame(raf)
    const from = displayed.value
    const start = performance.now()

    function tick(now: number) {
      const t = Math.min((now - start) / duration, 1)
      // ease-out cubic
      const ease = 1 - Math.pow(1 - t, 3)
      displayed.value = from + (to - from) * ease
      if (t < 1) raf = requestAnimationFrame(tick)
    }

    raf = requestAnimationFrame(tick)
  })

  return displayed
}
```

**Step 2: Verify build**

Run: `cd /Users/abd3lraouf/Developer/zakat && npx nuxi build 2>&1 | tail -5`
Expected: Build succeeds

**Step 3: Commit**

```bash
git add app/composables/useAnimatedNumber.ts
git commit -m "feat: add useAnimatedNumber composable for value tweening"
```

---

### Task 10: Apply Animated Numbers to Tracker Summary

**Files:**
- Modify: `app/components/tracker/Summary.vue:1-11` (use animated numbers)
- Modify: `app/components/tracker/Summary.vue:18,25,37` (display animated values)

**Step 1: Add animated numbers to the script**

In `app/components/tracker/Summary.vue`, add after the store imports:

```ts
import { useAnimatedNumber } from '~/composables/useAnimatedNumber'

// ... existing store setup ...

const animatedDue = useAnimatedNumber(computed(() => calculator.zakatDue))
const animatedPaid = useAnimatedNumber(computed(() => tracker.totalPaid))
const animatedRemaining = useAnimatedNumber(computed(() => tracker.remaining))
```

**Step 2: Use animated values in template**

Replace:
- Line 18: `fmtCurrency(calculator.zakatDue, ...)` → `fmtCurrency(animatedDue.value, ...)`
- Line 25: `fmtCurrency(tracker.totalPaid, ...)` → `fmtCurrency(animatedPaid.value, ...)`
- Line 37: `fmtCurrency(tracker.remaining, ...)` → `fmtCurrency(animatedRemaining.value, ...)`

**Step 3: Verify build**

Run: `cd /Users/abd3lraouf/Developer/zakat && npx nuxi build 2>&1 | tail -5`
Expected: Build succeeds

**Step 4: Commit**

```bash
git add app/components/tracker/Summary.vue
git commit -m "feat: animate tracker summary numbers with smooth tweening"
```

---

### Task 11: Apply Animated Numbers to Calculator Summary Panel

**Files:**
- Modify: `app/components/calculator/SummaryPanel.vue` (use animated numbers for zakat total and progress)

**Step 1: Add animated numbers to the script**

Add the useAnimatedNumber import and create animated refs for the key display values (zakatDue, totalAssets, totalDeductions, progress percentage).

**Step 2: Use animated values in template**

Replace the direct store values with animated versions in the display areas.

**Step 3: Verify build**

Run: `cd /Users/abd3lraouf/Developer/zakat && npx nuxi build 2>&1 | tail -5`
Expected: Build succeeds

**Step 4: Commit**

```bash
git add app/components/calculator/SummaryPanel.vue
git commit -m "feat: animate calculator summary numbers with smooth tweening"
```

---

### Task 12: Enhance Tracker Summary Card Hover

**Files:**
- Modify: `app/components/tracker/Summary.vue:57-65` (refine hover styles)

**Step 1: Update card hover CSS**

Replace the existing hover styles with:

```css
.sum-card {
  position: relative;
  overflow: hidden;
  transition: transform 0.25s cubic-bezier(0.16, 1, 0.3, 1),
              box-shadow 0.25s cubic-bezier(0.16, 1, 0.3, 1);
}
.sum-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.08), 0 2px 8px rgba(184, 147, 58, 0.1);
}
```

**Step 2: Verify build**

Run: `cd /Users/abd3lraouf/Developer/zakat && npx nuxi build 2>&1 | tail -5`
Expected: Build succeeds

**Step 3: Commit**

```bash
git add app/components/tracker/Summary.vue
git commit -m "feat: refine tracker card hover with smoother easing"
```

---

### Task 13: Final Cleanup and Verification

**Files:**
- Modify: `app/assets/css/base.css` (optionally remove unused viewIn/viewOut if no longer referenced)

**Step 1: Check if viewIn/viewOut are still used anywhere**

Run: `grep -r "viewIn\|viewOut" app/ --include="*.vue" --include="*.css"`

If no results (all pages now use pageTransition), remove the viewIn/viewOut keyframes from base.css (lines 74-82).

**Step 2: Verify full build**

Run: `cd /Users/abd3lraouf/Developer/zakat && npx nuxi build 2>&1 | tail -5`
Expected: Build succeeds

**Step 3: Verify reduced-motion still works**

The existing `@media (prefers-reduced-motion: reduce)` in base.css (lines 62-69) already sets `transition-duration: 0.01ms` and `animation-duration: 0.01ms`, which covers all our new CSS transitions. For `@vueuse/motion` directives, they respect the browser's reduced-motion preference by default.

**Step 4: Commit**

```bash
git add -A
git commit -m "chore: clean up unused animation keyframes"
```

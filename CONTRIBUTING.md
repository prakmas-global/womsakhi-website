# Contributing to the WomSakhi website

Read [README.md](README.md) first — especially the part about this not being the
product, and the part about port 3200.

---

## Branches

Same model as the product repo, so nobody has to hold two in their head:

```
  feature branch  ──PR──►  development  ──PR──►  main  ──►  production
                     │                     │
                     └──── CI runs ────────┘
```

- **`main` is production.** It only moves through a pull request whose checks
  passed. Never push to it.
- **`development` is integration.** Feature branches merge here first, and this
  is where things get to be temporarily wrong together.
- **Feature branches come off `development`**, not off `main`. Branching from
  `main` means your first merge quietly reverts whatever landed on
  `development` while you were working.

Name a branch for what it does: `hero-webgl`, `fix-focus-ring`,
`copy-promises-pass`.

## Reviews

**Every PR needs one approving review from someone other than its author.**

Be aware of what that rule currently is and is not. In the product repo the
check is a workflow that turns an unreviewed PR red — GitHub only *enforces*
"you may not merge without an approval" through branch protection or rulesets,
and both are refused on a private repo in a free organisation (`403 Upgrade to
GitHub Pro`). So the rule depends on the team respecting a red check, not on
GitHub stopping you. Respect it.

Review your own diff before you ask anyone else to. Most of what a reviewer
would have said is visible in the diff view and not in the editor.

---

## Code style

TypeScript `strict`. ESLint (`core-web-vitals` + `typescript`) must be clean —
there is no ratchet here and no pre-existing debt to hide behind, so keep it
that way. Formatting is not argued about; match the file you are in.

### Comments explain *why*, and what went wrong

A comment that restates the line is noise. A comment that records the reason —
particularly a reason discovered the hard way — is the most valuable thing in
the file, because it is the only part that cannot be reconstructed by reading
the code.

Not this:

```ts
// Start Lenis
const lenis = new Lenis({ duration: 1.05 });
```

This — the comment that is already in `src/components/SmoothScroll.tsx`:

```ts
// Exponential ease-out: fast to respond, long to settle. A linear ramp
// reads as lag rather than weight.
easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
```

And this, in `globals.css`, which exists because somebody hit it:

```css
html {
  /* Lenis drives the scroll; leaving the native smooth behaviour on as well
     makes the two fight and the page stutters on every anchor jump. */
  scroll-behavior: auto;
}
```

Rules of thumb:

- If you spent more than ten minutes working something out, write down what you
  worked out. The next person is usually you, in four months.
- Name the failure, not the fix alone: "a stray Lenis instance keeps consuming
  wheel events and the next page scrolls at half speed for no reason anyone can
  see" beats "cleanup".
- Plain language. No marketing voice in engineering files — the register in
  `src/lib/site.ts` is for visitors, the register in a component is for whoever
  has to debug it at 2am.
- Say when something is a constraint rather than a choice: "Cloud Run injects
  `PORT` and it is not negotiable" tells you not to argue with it.

---

## Performance budget

This site is animation-heavy on purpose, and it is read on a mid-range Android
phone in India over a network that is not always good. Those two facts are in
tension and the budget is where the tension is resolved. Numbers, not vibes:

| Metric | Budget | Measured on |
|---|---|---|
| **LCP** | ≤ **2.5 s** | Lighthouse mobile, Slow 4G, 4× CPU throttle |
| **CLS** | ≤ **0.05** | same. Stricter than the 0.1 web-vital on purpose — the whole page moves on scroll, and a layout shift under a scroll animation is far more visible than a shift on a static page |
| **INP** | ≤ **200 ms** | same |
| **TBT** | ≤ **300 ms** | same |
| **First-load JS for `/`** | ≤ **220 kB** gzipped | see the recipe below |
| **The lazy WebGL chunks** | ≤ **150 kB** gzipped in total | and they must not appear in the first-load list for any route |
| **Fonts** | 2 families, `latin` subset, `display: swap` | no third face |
| **Images** | WebP, through `next/image`, explicit `width`/`height` | a raw `<img>` with no dimensions is a CLS bug waiting to be filed |

**Where the JS budget comes from — measured, not guessed.** All figures below
are gzipped bytes from a real `npm run build` on 2026-09-11, with kB meaning
1024 bytes:

| | Bytes | |
|---|---|---|
| First-load JS for `/` | 178,762 | **174.6 kB** across 7 scripts |
| …the same measurement on an empty page (one `<p>` + `SmoothScroll`) | 178,188 | **174.0 kB** |
| The lazy WebGL chunks, 4 of them | 73,227 | **71.5 kB** |
| …the largest single one | 51,084 | **49.9 kB** |
| The whole of `three`, bundled and minified | 189,452 | **185.0 kB** |

Read the first two rows together: **almost the entire first-load figure is the
floor.** Next 16 plus React 19 plus Lenis costs 174 kB before this site has any
content in it at all, and every section built since has added well under a
kilobyte to it, because the sections are server-rendered markup.

So the 220 kB ceiling leaves about **45 kB** of real headroom. It is tight, and
it is meant to be — the last row is four times that headroom on its own.
Turbopack currently tree-shakes `three` down to ~50 kB because the scenes use a
narrow slice of it. A careless `import * as THREE from "three"`, or importing
`@react-three/drei` as a namespace instead of by name, undoes that in one line
and blows both budgets at once.

### How to measure it

**Next 16's build summary no longer prints a "First Load JS" column** — do not
go looking for it. Measure the scripts the prerendered HTML actually references:

```bash
npm run build
grep -o '/_next/static/[^"]*\.js' .next/server/app/index.html \
  | sort -u | sed 's|^/_next/|.next/|' | xargs -I{} gzip -c {} | wc -c
```

That prints the gzipped first-load bytes for `/`. Swap `index.html` for another
route's prerendered file to check that one. Run it before and after your branch
and put both numbers in the PR description if you moved it.

For the vitals, run Lighthouse against `npm start` on the production build —
**never against `npm run dev`.** A dev server compiles routes on demand; every
number you get from it is a number about the compiler.

### WebGL rules — these are not negotiable

1. **Pause off-screen.** An `IntersectionObserver` around the canvas, and
   `frameloop="demand"` (or an explicit stop) when it is not visible. A scene
   that keeps rendering after you have scrolled past it is burning battery to
   draw something nobody can see.
2. **Stop under reduced motion.** Not "slow down", not `opacity: 0` — the render
   loop is switched off in JavaScript. A hidden canvas that is still animating
   costs exactly as much as a visible one.
3. **One WebGL context per page.** Browsers cap the number of live contexts and
   silently kill the oldest when you exceed it, which presents as a randomly
   blank hero on somebody else's machine.
4. **Cap device pixel ratio** — `dpr={[1, 2]}`. Rendering at a phone's native
   3× is invisible to the eye and very visible in the frame time.
5. **Load it with `next/dynamic` and `ssr: false`.** `three` has no business in
   a server render, and a static import puts it in the first-load bundle where
   the budget above forbids it.
6. **Never make the LCP element a canvas.** The headline is HTML text. If the
   largest paint is something WebGL drew, the site is unreadable for the first
   two seconds on the phones it is built for.

---

## Before you open a PR

Run all of it. CI runs the same three, and finding out here is faster than
finding out there.

```bash
npx tsc --noEmit        # types
npx eslint src          # lint — must be clean, not merely no-worse
npm run build           # a real production build
```

**Run the lint separately and actually look at it.** Next 16 no longer runs
ESLint as part of `next build`, so a green build tells you nothing about lint.
That is not hypothetical: while this document was being written the build was
green and `npx eslint src` was reporting seven errors in `src/components/three/`
at the same moment.

Note also that `npm run lint` is a bare `eslint`, which walks the root config
files too. `npx eslint src` is the command CI runs; use that one so a green
local run means a green CI run.

Then, in a browser, on the production build (`npm start -- --port 3200`):

- [ ] **390 px wide.** The iPhone-class width most visitors are on. Nothing
      overflows horizontally, nothing is clipped, tap targets are ≥ 44 px.
- [ ] **1440 px wide.** Line lengths stay readable — a paragraph should not run
      the full width of a desktop monitor.
- [ ] **Reduced motion on.** macOS: System Settings → Accessibility → Display →
      Reduce motion. Or DevTools → Rendering → *Emulate CSS
      `prefers-reduced-motion`*. With it on: nothing animates, the page scrolls
      natively rather than with momentum, and any WebGL loop has stopped —
      check the frame counter, not just your eyes.
- [ ] **Tab through the page.** The skip link appears first, focus is visible on
      every stop, and focus order matches reading order.
- [ ] **New copy went into `src/lib/site.ts`**, not into JSX.
- [ ] **No new colours** outside the `@theme` block in `globals.css`. If the
      design needs one, it belongs in the product's token set first.
- [ ] If you changed dependencies, **the lockfile was regenerated on Linux** —
      see the README. A macOS lockfile turns CI red.

In the PR description, say what you changed and what you checked. If you moved
the JS budget, give the before and after numbers.

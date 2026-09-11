# WomSakhi — the website

The marketing site for WomSakhi, at **`www.womsakhi.com`**. It explains what the
platform is, and hands the visitor over to the product. That is the whole job.

WomSakhi is a livelihood platform built for women in India — learn a skill, find
work, earn by selling, inside a circle of women. Free, women-only,
human-reviewed, and it never holds a member's money.

---

## What this repo is *not*

**It is not the product.** The product is a different repository —
`prakmas-global/womsakhi` — and the two must not be confused:

| Host | What runs there | Repo |
|---|---|---|
| `app.womsakhi.com` | the product web app (Next.js) | `womsakhi` → `womencrafts-frontend/frontend` |
| `api.womsakhi.com` | the product API (FastAPI) | `womsakhi` → `womencrafts-backend/backend` |
| `www.womsakhi.com` | **this site** | `womsakhi-website` — you are here |

Nothing in this repo has an account, a session, a database, or an API of its
own. Every button that actually *does* something is a link to
`app.womsakhi.com`. If you find yourself adding authentication here, or a form
that stores something, you are in the wrong repository.

The one thing this site takes from the product is its public numbers. Today it
takes them *by hand*: the figures in `src/lib/site.ts` are copied from
`api.womsakhi.com/api/v1/public/stats` and committed. There is deliberately no
runtime fetch — see [Content](#content-lives-in-one-file).

---

## Quick start

Node **24** is what this is developed, built and deployed on (`node -v` →
`v24.2.0` here; CI pins `24`; the product's Dockerfile is `node:24-alpine`).

```bash
npm ci
npm run dev -- --port 3200
```

Then open <http://localhost:3200>.

Use `npm ci`, not `npm install` — `ci` installs exactly what the lockfile says
and fails loudly on drift, which is the only reason to commit a lockfile at all.
There is a real trap in that lockfile; see [The lockfile](#the-lockfile-must-be-generated-on-linux).

### The port is not optional, and here is why

`next dev` defaults to port **3000**, and **port 3000 on this machine belongs to
an unrelated Docker stack**. Taking it breaks something that has nothing to do
with this project, in a way that is not obvious for a while. The default is
wrong for us, so the flag has to be typed every time.

| Port | What listens there | |
|---|---|---|
| **3000** | an unrelated Docker stack | **never take it.** It is also `next dev`'s default, which is precisely why the flag is not optional |
| **3100** | the **product** frontend | `womencrafts-frontend/frontend` |
| **3200** | **this site** | |
| **8020** | the **product** API | FastAPI, bound to `127.0.0.1:8020` |

`PORT=3200 npm run dev` works too — `next dev` reads `PORT`. Both forms were
run against a live server before being written here, not read off a help page.

The `dev` script in `package.json` is a bare `next dev`, so the port is not
baked in. Adding `-p 3200` there would be the durable fix; `package.json` is not
this document's file to change.

### Build, and run the production output

```bash
npm run build            # Next 16 builds with Turbopack by default
npm start -- --port 3200
```

Measure performance against `npm start`, **never** against `npm run dev`. This
mistake has already cost the product team a day: the app was reported as slow,
profiled, and argued about, and the cause was `next dev` compiling routes on
demand. The same build served by `next start` answered in about 40 ms. A dev
server is not a slow version of production, it is a different program.

### Checks

```bash
npx tsc --noEmit
npx eslint src
npm run build
```

All three were run while writing this file. Two notes worth having in advance:

- **`npm run build` does not run ESLint.** Next 16 dropped that step, so a green
  build is not a green lint — it was verified here by getting one of each at the
  same time. CI runs them separately for that reason.
- **`npm run lint` (bare `eslint`) is not the same command as `npx eslint src`.**
  The former also walks the config files at the repo root. Use `npx eslint src`,
  which is what CI runs.

---

## The stack, and why each piece is here

| Package | Version | Why this one |
|---|---|---|
| `next` | 16.3.4 | App Router, `src/`, Turbopack. The site is a handful of routes of mostly-static content, and the App Router prerenders them to real HTML — text is on screen before any JavaScript is fetched. Same framework the product uses, so nobody has to learn two. |
| `react` / `react-dom` | 19.2.8 | What Next 16 requires. |
| `tailwindcss` | 4 | v4 is CSS-first: the palette is declared in an `@theme` block inside `src/app/globals.css`, next to the rules that use it, instead of in a separate JS config. **There is no `tailwind.config.ts` here, and that is on purpose** — don't add one. |
| `three` | 0.186 | WebGL for the hero and the scroll set-pieces. |
| `@react-three/fiber` | 9 | Three.js as React components, which matters for a reason beyond taste: a scene expressed as components can be unmounted by the same conditions that stop everything else — reduced motion, off-screen, route change — and a hand-rolled `requestAnimationFrame` loop reliably outlives all three. |
| `@react-three/drei` | 10 | The helpers (loaders, controls, materials) that would otherwise be re-implemented badly. Import from it by name; a namespace import pulls in far more than it looks like. |
| `@react-three/postprocessing` | 3 | Bloom and grade passes. Expensive — see the budget in [CONTRIBUTING.md](CONTRIBUTING.md). |
| `motion` | 13 | Scroll-linked and enter animation. Ships `useReducedMotion`, so a component can stand down from motion without reading `matchMedia` by hand in five places. |
| `gsap` | 3 | The timelines `motion` is awkward at: long scroll-pinned sequences where several things must be scrubbed against one progress value. Used for those, not as a second general-purpose animation library. |
| `lenis` | 1.3 | Momentum scroll. Two things always go wrong with it and both are already handled in `src/components/SmoothScroll.tsx` — read the comment there before touching it. |
| `clsx` + `tailwind-merge` | | Conditional class names that don't end up with `p-2 p-4` both applied. |
| `typescript` | 5 | `strict: true`. |
| `eslint` + `eslint-config-next` | 9 / 16.3.4 | `core-web-vitals` + `typescript` presets. |

---

## Project structure

```
src/
  app/
    layout.tsx      Root layout: fonts, <head> metadata, the skip link, <SmoothScroll/>.
    page.tsx        The home page.
    globals.css     Tailwind v4 import, the @theme token block, and the small
                    number of global rules that cannot be utilities —
                    reduced-motion, :focus-visible, ::selection, .u-grain.
    favicon.ico
  components/
    SmoothScroll.tsx  Starts Lenis — and does not start it under reduced motion.
  lib/
    site.ts         Every word and every URL the site says about itself.
public/
  art/              The illustrations, WebP only.
  brand-mark.png
```

Path alias: `@/*` → `./src/*` (`tsconfig.json`). Import `@/lib/site`, not
`../../lib/site`.

---

## Design tokens

They live in **one place**: the `@theme` block at the top of
`src/app/globals.css`. Tailwind v4 turns each entry into both a CSS custom
property and a utility class, so `--color-brand-600` is usable as
`text-brand-600`, `bg-brand-600`, `var(--color-brand-600)` — with no config file
to keep in sync.

```
brand-50  #f8f3fd    brand-500 #8f6ae8    brand-900 #2c1a5c
brand-100 #f0e5fe    brand-600 #7648b3    brand-950 #1a0f38
brand-200 #e0cbfc    brand-700 #5b32a6
brand-300 #c9a8f7    brand-800 #4a2895    pink-brand #e160a4
brand-400 #a98bf5                         pink-deep  #ba4484
                                          gold       #f5b544

ink #14102a   ink-2 #3d3660   muted #6b6490
canvas #faf8ff   surface #ffffff   line #ece7f7
```

The neutrals carry a violet bias rather than being grey. That is not a
flourish: a true neutral grey placed next to this much purple reads as dirty.

Type: `--font-display` is Fraunces (variable, with the `opsz` axis, so a 96 px
headline is *drawn* differently rather than merely scaled up), `--font-sans` is
Plus Jakarta Sans. Both are loaded through `next/font/google` in `layout.tsx`
with `display: swap`.

### The rule about the palette

**This palette is the product's palette. It is not a new one, and this site does
not get to invent colours.**

A woman who reads this site and then opens `app.womsakhi.com` must not feel she
has changed companies. `--color-brand-600` here is the same value as
`--ux-brand-600` in the product's `src/app/ux/tokens.css` — both `#7648b3` —
`brand-700` matches `--ux-brand-700`, and `pink-brand` is the product's
`--ux-pink`, character for character. That was checked, not assumed. If the site genuinely needs a
colour that does not exist yet, it belongs in the product's token set *first*,
and arrives here afterwards. A one-off hex in a component is how two products
slowly stop looking related.

---

## Accessibility — what this site commits to

These are commitments, not aspirations. A PR that breaks one of them is not
finished.

**Reduced motion means stop, not slow down.** A woman who has told her operating
system she wants less motion is not asking for a tastefully damped version — she
is telling you the movement makes her unwell. So:

- `globals.css` collapses every animation and transition to ~0 ms under
  `prefers-reduced-motion: reduce`.
- Lenis is **never started** under that setting, rather than started and eased.
  Momentum scrolling *is* the sensation the setting exists to prevent.
- The WebGL render loop is **switched off in JavaScript**, not merely hidden
  with CSS. A canvas that is animating behind `opacity: 0` still costs battery
  on the phone this site is mostly read on.

**Keyboard.** The skip link is the first element inside `<body>` so a keyboard
reaches it before anything else. `:focus-visible` is styled once, globally, so
no component can quietly remove the ring — do not add `outline: none` anywhere.
Everything clickable must be a `<button>` or an `<a>`; a `<div>` with an
`onClick` is not reachable and not announced.

**Contrast.** Body text meets WCAG AA (4.5:1), large display text meets 3:1, and
focus indicators meet 3:1 against every ground they appear on. Measured pairs
from the current palette:

| Pair | Ratio | |
|---|---|---|
| `ink` on `canvas` | 17.5:1 | body text |
| `ink-2` on `canvas` | 10.5:1 | secondary text |
| `muted` on `canvas` | 5.2:1 | the floor — nothing lighter than `muted` carries text |
| `brand-700` on `canvas` | 8.1:1 | links |
| white on `brand-700` | 8.6:1 | primary button |
| white on `pink-deep` | 4.9:1 | just clears AA |
| white on `pink-brand` | **3.3:1** | **fails AA.** `pink-brand` is a surface and decoration colour. Do not put small text on it. |

These were computed from the hex values in `@theme`, and they agree with the
ratios the product records beside its own tokens in `src/app/ux/tokens.css` —
which is a useful check that the two palettes really are the same one.

**One commitment is not currently met, and pretending otherwise helps nobody.**
The global `:focus-visible` ring is `--color-brand-400` (`#a98bf5`). Against the
light grounds this site actually uses it measures **2.59:1 on `canvas`** and
2.73:1 on `surface` — under the 3:1 that WCAG 2.2 SC 1.4.11 requires of a
non-text indicator. It only clears 3:1 on the dark purples. `--color-brand-500`
(`#8f6ae8`) is the one step on this ramp that passes on both: 3.70:1 on `canvas`
and 3.83:1 on `brand-900`. The fix belongs in `globals.css`, in a PR of its own.

**Readable at first paint.** The words must be legible before the JavaScript
arrives, on a mid-range Android on a slow connection. In practice: headline and
body copy are server-rendered HTML — never text drawn into a canvas or revealed
by an animation that starts at `opacity: 0` with no reduced-motion fallback —
fonts use `display: swap`, and nothing above the fold waits on WebGL.

---

## Content lives in one file

`src/lib/site.ts` is the single source of truth for copy: the site's name and
URLs, the four pillars (Learn, Work, Earn, Circle) with their art and accent
colours, the four steps, and the four promises.

Edit the copy there, not in JSX. Two reasons: someone who is not a developer can
read one file and tell you what is wrong with it, and the same sentence is not
allowed to drift between the hero and the footer.

**The numbers in that file are claims about a real platform.** They are copied
from what the product actually reports and they must stay copied. A marketing
site that overstates what the platform holds is the fastest possible way to lose
the trust the platform exists to build.

---

## Environment

`.env.example` lists every variable the site reads or expects to read, each with
a note on what it is for. Copy it and fill in real values locally:

```bash
cp .env.example .env.local
```

`.env.local` is git-ignored and must stay that way. Verified:

```
$ git check-ignore -v .env.local
.gitignore:34:.env*     .env.local
```

**That same pattern has a snag.** `.env*` also matches `.env.example`, so
`git add .env.example` silently does nothing and the template never reaches the
repository. Both sibling repos already carry the fix — one line under the env
block in `.gitignore`:

```gitignore
!.env.example
```

Until that lands, `git add -f .env.example`. `.gitignore` is not this
document's file to change, so it is written down here instead of edited.

As of 2026-09-11 nothing under `src/` reads `process.env` at all. The site is
static and the URLs are literals in `src/lib/site.ts`.

---

## The lockfile must be generated on Linux

`package-lock.json` in this repo was generated on macOS, and **a macOS lockfile
does not install on Linux.** npm only resolves `wasm32-wasi` packages on a
platform that can use them, so a lockfile made on a Mac is missing the
`@emnapi/*` entries that `@tailwindcss/oxide-wasm32-wasi` demands there. `npm ci`
then refuses it — in GitHub Actions and in a Docker build alike.

The current lockfile has `@emnapi/wasi-threads` but **not** `@emnapi/core` or
`@emnapi/runtime`. The CI workflow checks for exactly this before it runs
`npm ci`, so the failure says what is wrong instead of dumping an npm error.

A Linux-generated lockfile is a superset — it installs cleanly on macOS too — so
there is no trade-off, only a rule. Regenerate it in a Linux container after any
dependency change:

```bash
docker run --rm -v "$PWD":/w -w /w node:24 \
  bash -c 'rm -f package-lock.json && npm install --package-lock-only --ignore-scripts'
```

The product repo does the same thing through Cloud Build, because Docker is not
always running on this machine; that recipe is in the product's deployment
runbook.

**Do not "fix" a red `npm ci` by switching to `npm install`.** That hides real
lockfile drift, which is the one thing a lockfile exists to catch.

---

## Deployment

Not yet wired up. The intended shape, which matches how the product is already
deployed, is:

- A container on **Cloud Run** in **`asia-south1`** (Mumbai), in the same GCP
  project as the product, beside `womsakhi-web` and `womsakhi-api`. The region
  is not a preference — the users are in India, and it cannot be changed later
  without recreating everything.
- Fronted by the **existing global external Application Load Balancer**, which
  already terminates TLS for `app.` and `api.` on one static IP. This site
  becomes another backend service and host rule on that same load balancer; it
  does not get infrastructure of its own.
- Cloud Run **domain mappings are not available in `asia-south1`** — Google
  answers `501 UNIMPLEMENTED`. That is a regional limitation, not a permissions
  problem, and it is why the load balancer exists. Do not spend an afternoon
  rediscovering this.
- **`www.womsakhi.com` and the apex `womsakhi.com` are deliberately unused and
  reserved for this site.** Nothing in the product touches them. They still
  point at GoDaddy's WebsiteBuilder and are waiting to be moved.
- Adding them means issuing a **new** managed certificate covering all four
  names and swapping the HTTPS proxy over — a managed certificate cannot have
  domains added in place — then pointing the `www` and `@` records at the load
  balancer's IP.
- The container must bind to the `PORT` Cloud Run injects. Cloud Run does not
  negotiate on this; a service that listens on a port of its own choosing never
  passes its health check.

Exact resource names, IPs and commands are in the product's `DEPLOYMENT.local.md`,
which is git-ignored on purpose and stays out of this repository.

---

## See also

- [CONTRIBUTING.md](CONTRIBUTING.md) — branch model, review rule, the
  performance budget, and the checklist to run before opening a PR.
- `.github/workflows/ci.yml` — what a PR is checked against.

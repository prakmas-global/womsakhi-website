import { SITE } from "@/lib/site";
import { HeroCanvasMount } from "@/components/three/HeroCanvasMount";

/**
 * The hero.
 *
 * A Server Component on purpose. The headline, the sentence under it and both
 * links are in the HTML that leaves the server — they are not waiting on
 * hydration, on an observer, or on a 400kB WebGL bundle. Everything below is
 * either text or a CSS gradient until the client decides the artwork is worth
 * loading, and the page reads correctly if it never is.
 *
 * The voice is the product's own: "Sell it, and get paid", "Nobody does this
 * alone". Plain sentences about money, addressed to one woman. The nonprofit
 * register — unlocking potential, empowering communities — is the register of
 * people talking *about* her rather than *to* her, and it is not used here.
 */

/*
  The counts the platform actually reports, from
  `api.womsakhi.com/api/v1/public/stats`. They are small because the platform is
  new. Printing the real number is the entire point: a woman who is asked to
  trust this with her livelihood can check every claim on this page, and the
  first one she checks should be true.
*/
const OPEN_NOW = { courses: 28, jobs: 20, circles: 45 } as const;

/** The three promises the platform is willing to be held to, in the hero. */
const PROMISES_SHORT = [
  "Free to join",
  "Women only, checked by a person",
  "We never hold your money",
] as const;

const GROUND =
  "radial-gradient(115% 78% at 74% 16%, rgba(225,96,164,0.18) 0%, rgba(225,96,164,0) 58%)," +
  "radial-gradient(95% 70% at 12% 6%, rgba(118,72,179,0.16) 0%, rgba(118,72,179,0) 62%)," +
  "linear-gradient(178deg, #f3ecfd 0%, #f8f4ff 46%, #faf8ff 100%)";

export function Hero() {
  return (
    <section className="relative isolate overflow-hidden">
      {/* The ground. It is painted first and never removed, so the hero has its
          full colour before a single byte of three.js has been asked for. */}
      <div aria-hidden="true" className="absolute inset-0 -z-30" style={{ background: GROUND }} />

      <HeroCanvasMount className="absolute inset-0 -z-20" />

      {/* Legibility. The artwork is soft and pale, but "soft and pale" is not a
          contrast ratio, so the text sits on a wash of the page's own colour —
          vertical on a phone, where the ring is above the words, and horizontal
          on a wide screen, where it is beside them. */}
      <div
        aria-hidden="true"
        className="absolute inset-x-0 bottom-0 -z-10 h-[54%] bg-gradient-to-t from-canvas via-canvas/84 to-transparent lg:hidden"
      />
      <div
        aria-hidden="true"
        className="absolute inset-y-0 left-0 -z-10 hidden w-[62%] bg-gradient-to-r from-canvas via-canvas/76 to-transparent lg:block"
      />
      <div aria-hidden="true" className="u-grain z-0" />

      <div className="relative z-10 mx-auto flex min-h-[100svh] w-full max-w-7xl flex-col justify-center px-6 pb-20 pt-28 sm:px-8 sm:pt-32 lg:px-12 lg:pb-24">
        <div className="max-w-[36rem] xl:max-w-[42rem]">
          <p className="inline-flex items-center gap-2.5 rounded-full border border-brand-200 bg-white/65 px-3.5 py-2 text-[0.75rem] font-medium tracking-[0.01em] text-brand-800 backdrop-blur-sm sm:px-4 sm:text-[0.8125rem]">
            <span aria-hidden="true" className="h-1.5 w-1.5 shrink-0 rounded-full bg-pink-brand" />
            {OPEN_NOW.courses} courses · {OPEN_NOW.jobs} jobs · {OPEN_NOW.circles} circles, open now
          </p>

          <h1
            className="u-balance mt-7 font-display text-[clamp(2.7rem,6.6vw,5.25rem)] font-semibold leading-[0.95] tracking-[-0.035em] text-ink"
            style={{ fontVariationSettings: "'opsz' 144, 'SOFT' 42, 'WONK' 1" }}
          >
            Earn your own money.
            <span className="mt-1 block bg-gradient-to-r from-brand-700 via-brand-600 to-pink-brand bg-clip-text pb-[0.09em] text-transparent">
              Beside women who already do.
            </span>
          </h1>

          <p className="u-balance mt-7 max-w-[34rem] text-[clamp(1.0625rem,1.35vw,1.3rem)] leading-[1.62] text-ink-2">
            Learn a skill, find work that respects your time, or sell what you make — with a
            circle of women who have already done it.
          </p>

          <div className="mt-10 flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-4">
            <a
              href={SITE.signup}
              className="group inline-flex items-center justify-center gap-2.5 rounded-full bg-brand-600 px-8 py-4 text-base font-semibold text-white shadow-[0_12px_32px_-10px_rgba(118,72,179,0.75)] transition duration-300 ease-out-quint hover:-translate-y-0.5 hover:bg-brand-700 hover:shadow-[0_20px_44px_-12px_rgba(118,72,179,0.8)] active:translate-y-0"
            >
              Join free
              <svg
                aria-hidden="true"
                viewBox="0 0 20 20"
                fill="none"
                className="h-[1.05em] w-[1.05em] transition-transform duration-300 ease-out-quint group-hover:translate-x-1"
              >
                <path
                  d="M4 10h11m0 0-4.2-4.2M15 10l-4.2 4.2"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </a>
            <a
              href={SITE.signin}
              className="inline-flex items-center justify-center rounded-full border border-line bg-white/70 px-8 py-4 text-base font-semibold text-ink backdrop-blur-sm transition duration-300 ease-out-quint hover:-translate-y-0.5 hover:border-brand-300 hover:bg-white active:translate-y-0"
            >
              Sign in
            </a>
          </div>

          {/* A bulleted list until there is room for one line, then a dot-separated
              row — the first dot disappearing is the only difference between the two. */}
          <ul className="mt-9 flex flex-col gap-2 text-[0.875rem] text-muted lg:flex-row lg:flex-wrap lg:items-center lg:gap-x-3 lg:gap-y-2">
            {PROMISES_SHORT.map((promise, i) => (
              <li key={promise} className="flex items-center gap-3">
                <span
                  aria-hidden="true"
                  className={`h-1 w-1 shrink-0 rounded-full bg-brand-300 ${i === 0 ? "lg:hidden" : ""}`}
                />
                {promise}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}

export default Hero;

import Image from "next/image";
import { PILLARS, SITE } from "@/lib/site";

/*
  The floor of the page.

  Dark, so the scroll ends somewhere rather than fading out on the same cream
  it started on. Every link here goes somewhere real: the four pillars point
  at the sections above, the app button at the app, and the pages that have
  not been written yet are honestly parked on `#` rather than pointed at a
  route that would 404 on the first person who clicked it.
*/

const EXPLORE = PILLARS.map((pillar) => ({
  label: pillar.eyebrow,
  href: `#${pillar.id}`,
}));

const COMPANY = [
  { label: "About", href: "#" },
  { label: "Contact", href: "#" },
] as const;

const LEGAL = [
  { label: "Privacy", href: "#" },
  { label: "Terms", href: "#" },
] as const;

export function Footer() {
  // Computed when the page renders, so it can never be a year out of date.
  const year = new Date().getFullYear();

  return (
    <footer className="relative isolate overflow-hidden bg-brand-950 text-brand-200">
      <div
        aria-hidden
        className="absolute inset-0 -z-10"
        style={{
          backgroundImage:
            "radial-gradient(60% 70% at 82% 0%, rgba(225,96,164,0.18), transparent 62%), radial-gradient(55% 70% at 0% 10%, rgba(118,72,179,0.28), transparent 60%)",
        }}
      />
      <span aria-hidden className="u-grain -z-10" />

      <div className="mx-auto w-full max-w-[1440px] px-4 pb-10 pt-16 sm:px-6 sm:pt-20 lg:px-10">
        {/* Three narrow columns rather than a stacked list: a footer that runs
            to two thousand pixels on a phone is a footer nobody reaches. */}
        <div className="grid grid-cols-3 gap-x-4 gap-y-12 sm:gap-x-8 lg:grid-cols-[minmax(0,1.6fr)_repeat(3,minmax(0,0.7fr))] lg:gap-10">
          <div className="col-span-3 max-w-sm lg:col-span-1">
            <div className="flex items-center gap-3">
              <span className="relative size-11 shrink-0 overflow-hidden rounded-full ring-1 ring-white/20">
                <Image
                  src="/brand-mark.png"
                  alt=""
                  width={88}
                  height={88}
                  className="size-full scale-[1.12] object-cover"
                />
              </span>
              <span>
                <span className="block font-display text-xl font-semibold tracking-[-0.01em] text-white">
                  {SITE.name}
                </span>
                <span className="block font-display text-[0.95rem] italic text-brand-300">
                  {SITE.tagline}
                </span>
              </span>
            </div>

            <p className="mt-5 text-[0.9375rem] leading-relaxed text-brand-200">
              A livelihood platform built for women — learn a skill, find work
              that respects you, and sell what you make.
            </p>

            <a
              href={SITE.app}
              className="mt-6 inline-flex min-h-11 items-center gap-2 rounded-full border border-white/30 px-5 text-[0.9375rem] font-semibold text-white transition-colors duration-200 hover:bg-white/10"
            >
              Open the app
              <svg viewBox="0 0 20 20" aria-hidden className="size-4" fill="none">
                <path
                  d="M7 13 13 7m0 0H8m5 0v5"
                  stroke="currentColor"
                  strokeWidth={1.8}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </a>
          </div>

          <FooterColumn title="Explore" links={EXPLORE} />
          <FooterColumn title="Company" links={COMPANY} />
          <FooterColumn title="Legal" links={LEGAL} />
        </div>

        <div className="mt-14 flex flex-col gap-4 border-t border-white/12 pt-7 sm:mt-16 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-[0.8125rem] text-brand-300">
            © {year} {SITE.name}. All rights reserved.
          </p>
          <p className="text-[0.8125rem] text-brand-300">
            {SITE.name} is not a bank and never holds member funds.
          </p>
        </div>
      </div>
    </footer>
  );
}

function FooterColumn({
  title,
  links,
}: {
  title: string;
  links: readonly { readonly label: string; readonly href: string }[];
}) {
  return (
    <div>
      <h2 className="text-[0.7rem] font-semibold uppercase tracking-[0.18em] text-brand-300">
        {title}
      </h2>
      <ul className="mt-3 lg:mt-4">
        {links.map((link) => (
          <li key={`${title}-${link.label}`}>
            <a
              href={link.href}
              className="inline-flex min-h-11 items-center text-[0.9375rem] text-brand-200 transition-colors duration-200 hover:text-white lg:min-h-0 lg:py-1.5"
            >
              {link.label}
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default Footer;

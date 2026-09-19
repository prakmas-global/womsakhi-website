import type { Metadata } from "next";
import Link from "next/link";
import { PILLARS, SITE } from "@/lib/site";
import { getPlatformStats } from "@/lib/stats";
import Nav from "@/components/Nav";
import { PageHeader } from "@/components/sections/PageHeader";
import { PageSection } from "@/components/sections/PageSection";
import Footer from "@/components/Footer";

/*
  About.

  The temptation on a page like this is the nonprofit register — empowering
  women, unlocking potential, transforming communities. That register is what
  people sound like when they are talking ABOUT a woman to a donor. This site
  talks TO her, in the product's own voice: "Sell it, and get paid", "Nobody
  does this alone". So the page is four plain answers to four plain questions —
  why this exists, what she can do here, why men cannot join, and what we
  refuse to do — and it ends on the real member count rather than a projection.
*/

export const metadata: Metadata = {
  title: "About",
  description:
    "Why WomSakhi exists, what a woman can actually do here, why membership is women-only, and the four things the platform refuses to do — including holding your money.",
  alternates: { canonical: "/about" },
  openGraph: {
    title: `About · ${SITE.name}`,
    description:
      "Why WomSakhi exists, what a woman can actually do here, and what the platform refuses to do.",
    url: "/about",
    type: "article",
  },
};

/*
  The counts the app reports today. Small, and printed anyway.

  Each of these is the LIVE figure, not the total ever created, because the
  label a woman reads is a promise about what she will find when she taps
  through. 28 courses exist; 9 have finished and 1 is archived, so 18 are open
  to join. 20 opportunities have been posted; 12 are closed, so 8 are open. 37
  members have signed up; 7 are still awaiting review and 2 are not active, so
  28 are members today. Counting the closed ones would flatter this page and
  then disappoint her on the next screen.

  There is deliberately NO member count here. The platform holds 24 active
  member records and not one of them is a woman who found WomSakhi and signed
  up — they are seed personas we wrote, plus our own accounts. Printing "24
  members" on the page that argues this company does not inflate its numbers
  would have been the exact thing it refuses, dressed as the opposite. The
  three below are different: they are things she can actually walk into on the
  day she joins.
*/
const TODAY = (s: { courses: number; jobs: number; circles: number }) =>
  [
    { value: s.courses, label: "courses open" },
    { value: s.jobs, label: "jobs open" },
    { value: s.circles, label: "circles running" },
  ] as const;

/** The promises, written as refusals — which is what they are. */
const REFUSALS = [
  {
    title: "We will not hold your money",
    body:
      "A buyer pays into your account. There is no WomSakhi wallet for your earnings to sit in, no payout day, no cut taken on the way through — because there is no way through. We are not a bank and will not behave like one.",
  },
  {
    title: "We will not charge you to be found",
    body:
      "No fee to learn, no fee to be listed, no fee to be paid. Nothing described on this site is a free tier with a wall behind it.",
  },
  {
    title: "We will not show your documents to anyone",
    body:
      "The identity document you upload is encrypted, read once by a reviewer, and never shown to another member, an employer or a buyer. It is not part of your profile.",
  },
  {
    title: "We will not sell what you tell us",
    body:
      "Your name, your number and what you do here are not stock. They are not sold to advertisers, not sold to data brokers, and not sold to anyone else.",
  },
] as const;

export default async function AboutPage() {
  const stats = await getPlatformStats();
  const today = TODAY(stats);
  return (
    <>
      <Nav />

      <main id="main">
        <PageHeader
          eyebrow="About"
          title="Why WomSakhi exists"
          lead={
            <>
              A woman in India who wants to earn her own money is rarely short
              of will. She is short of a skill someone will pay for, work that
              will have her, a way to sell what she already makes, or one
              person to ask. This is an attempt at all four, in one place, free.
            </>
          }
        />

        <PageSection id="problem" eyebrow="The problem" title="It is never only one thing">
          <p>
            Ask a woman what stops her earning and she will not say motivation.
          </p>
          <p>
            She will say she does not know what to learn, or that the course
            cost more than the work would have paid. She will say the job wanted
            experience she was never allowed to get. She will say she makes good
            things and sells them to the four houses on her street. She will say
            she does not know a single woman who has done this, so there is
            nobody to ask whether the price is right or the employer is real.
          </p>
          <p>
            Any one of those is enough to stop the whole thing. Most women are
            carrying more than one at a time, which is why fixing a single piece
            of it — another free course, another job board — tends to change
            nothing.
          </p>
        </PageSection>

        <section
          id="what-she-can-do"
          aria-labelledby="what-she-can-do-heading"
          className="scroll-mt-28 bg-surface py-14 sm:py-20"
        >
          <div className="mx-auto w-full max-w-[1440px] px-4 sm:px-6 lg:px-10">
            <p className="text-[0.8125rem] font-semibold uppercase tracking-[0.16em] text-brand-600">
              What she can do here
            </p>
            <h2
              id="what-she-can-do-heading"
              className="u-balance mt-3 max-w-[22ch] font-display text-[clamp(1.875rem,3.4vw,2.75rem)] font-semibold leading-[1.08] tracking-[-0.025em] text-ink"
            >
              Four things, and they hold each other up
            </h2>
            <p className="mt-5 max-w-[40rem] text-[1.0625rem] leading-[1.7] text-muted sm:text-[1.125rem]">
              They are one platform on purpose. The course is worth something
              because there is work at the end of it; the shop is worth
              something because there is a circle telling you what to charge.
            </p>

            <ul className="mt-10 grid gap-4 sm:gap-5 lg:grid-cols-2">
              {PILLARS.map((pillar) => (
                <li
                  key={pillar.id}
                  className="rounded-3xl border border-line bg-canvas p-5 sm:p-7"
                >
                  <p
                    className="text-[0.8125rem] font-semibold uppercase tracking-[0.16em]"
                    style={{ color: pillar.accent }}
                  >
                    {pillar.eyebrow}
                  </p>
                  <h3 className="mt-3 font-display text-[1.375rem] font-semibold leading-snug tracking-[-0.015em] text-ink sm:text-[1.5rem]">
                    {pillar.title}
                  </h3>
                  <p className="mt-3 max-w-[34rem] text-[1rem] leading-[1.7] text-ink-2">
                    {pillar.body}
                  </p>
                </li>
              ))}
            </ul>
          </div>
        </section>

        <PageSection
          id="women-only"
          eyebrow="The rule"
          title="Women only, and why that is not decoration"
        >
          <p>
            Every account is read by a person before it can message anyone. An
            account that is not a woman&rsquo;s is closed. That is the whole
            rule, and it is enforced by people rather than by a checkbox.
          </p>
          <p>
            The reason is the circle. The questions worth having a circle for
            are the ones a woman is embarrassed to ask out loud — how much
            should I charge for this, is this employer going to pay me, my
            husband does not know I have opened this account. Put an audience in
            the room and those questions stop being asked and start being
            performed. The rule exists to keep the room the kind of room where
            the real question gets a straight answer.
          </p>
          <p>
            Review by people is slower than a checkbox and it is not infallible.
            We will occasionally close an account we should not have. When that
            happens, write to us and say so — a wrongly closed account is a
            mistake we can undo, and the other kind is not.
          </p>
        </PageSection>

        <section
          id="refusals"
          aria-labelledby="refusals-heading"
          className="scroll-mt-28 bg-surface py-14 sm:py-20"
        >
          <div className="mx-auto grid w-full max-w-[1440px] gap-8 px-4 sm:px-6 lg:grid-cols-[minmax(0,20rem)_minmax(0,36rem)] lg:gap-16 lg:px-10 xl:gap-24">
            <div className="lg:self-start">
              <p className="text-[0.8125rem] font-semibold uppercase tracking-[0.16em] text-brand-600">
                The limits
              </p>
              <h2
                id="refusals-heading"
                className="u-balance mt-3 font-display text-[clamp(1.875rem,3.4vw,2.75rem)] font-semibold leading-[1.08] tracking-[-0.025em] text-ink"
              >
                What this platform refuses to do
              </h2>
              <p className="mt-5 max-w-[30rem] text-[1.0625rem] leading-[1.7] text-muted">
                Written as refusals because that is what they are. Each one is
                something we could do, that most platforms in this shape do, and
                that we have built ourselves out of being able to do.
              </p>
            </div>

            <ul className="min-w-0 divide-y divide-line overflow-hidden rounded-3xl border border-line bg-canvas">
              {REFUSALS.map((refusal) => (
                <li key={refusal.title} className="p-5 sm:p-7">
                  <h3 className="font-display text-[1.25rem] font-semibold leading-snug tracking-[-0.01em] text-ink sm:text-[1.375rem]">
                    {refusal.title}
                  </h3>
                  <p className="mt-2 max-w-[34rem] text-[1rem] leading-[1.7] text-muted">
                    {refusal.body}
                  </p>
                </li>
              ))}
            </ul>
          </div>
        </section>

        <PageSection id="where-we-are" eyebrow="Honestly" title="Where this is, today">
          <p>
            WomSakhi is new, and newer than a number can show. Today you can
            join {stats.courses} courses and apply to {stats.jobs} jobs, and{" "}
            {stats.circles} circles are running. Those are read from the
            platform itself when this page is built, and they are the live
            counts, not the totals: a course that has finished and a job that
            has been filled are not things you can walk into.
          </p>

          <ul className="grid grid-cols-1 gap-3 pt-1 sm:grid-cols-3 sm:gap-4">
            {today.map((stat) => (
              <li
                key={stat.label}
                className="rounded-2xl border border-line bg-surface p-4 sm:p-5"
              >
                <p className="font-display text-[2rem] font-semibold leading-none tracking-[-0.02em] text-brand-700 sm:text-[2.5rem]">
                  {stat.value}
                </p>
                <p className="mt-2 text-[0.875rem] leading-snug text-muted">
                  {stat.label}
                </p>
              </li>
            ))}
          </ul>

          <p>
            They are printed here because a platform that asks a woman to upload
            a government identity document and then rounds a number this small
            up to &ldquo;thousands of women across India&rdquo; has already told her
            what kind of company it is. Every number on this site can be checked
            inside the app. When these grow, the ones printed here will be the
            real ones then too.
          </p>
          <p>
            What being early actually means for her: a course she wants may not
            exist yet, and a circle near her town may have four women in it
            rather than forty. There is no member count on this page because
            there is nothing yet to count — the accounts in the app today are
            ours, made while building it. She would be among the first, and we
            would rather she knew that before she joined than after.
          </p>
        </PageSection>

        <section
          aria-labelledby="about-next-heading"
          className="bg-surface py-14 sm:py-20"
        >
          <div className="mx-auto w-full max-w-[1440px] px-4 sm:px-6 lg:px-10">
            <div className="rounded-3xl border border-line bg-canvas p-6 sm:p-10">
              <h2
                id="about-next-heading"
                className="u-balance max-w-[20ch] font-display text-[clamp(1.75rem,3vw,2.5rem)] font-semibold leading-[1.08] tracking-[-0.025em] text-ink"
              >
                Two ways from here
              </h2>
              <p className="mt-4 max-w-[36rem] text-[1.0625rem] leading-[1.7] text-muted">
                Join, which is free and takes a few minutes and then waits on a
                person reading it. Or ask us something first — that is a fair
                thing to want to do before handing anyone your documents.
              </p>
              <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-4">
                <a
                  href={SITE.signup}
                  className="inline-flex min-h-[52px] items-center justify-center gap-2.5 rounded-full bg-brand-600 px-7 text-base font-semibold text-white shadow-[0_14px_30px_-14px_rgba(118,72,179,0.95)] transition-colors duration-200 hover:bg-brand-700"
                >
                  Join free
                  <svg viewBox="0 0 20 20" aria-hidden="true" className="size-4" fill="none">
                    <path
                      d="M4.5 10h10m-4-4.5 4.5 4.5-4.5 4.5"
                      stroke="currentColor"
                      strokeWidth={1.8}
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </a>
                <Link
                  href="/contact"
                  className="inline-flex min-h-[52px] items-center justify-center rounded-full border border-brand-200 bg-surface px-7 text-base font-semibold text-brand-700 transition-colors duration-200 hover:bg-brand-50"
                >
                  Talk to a person
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}

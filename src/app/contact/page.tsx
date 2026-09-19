import type { Metadata } from "next";
import { SITE } from "@/lib/site";
import Nav from "@/components/Nav";
import { PageHeader } from "@/components/sections/PageHeader";
import { PageContactForm, CONTACT_EMAIL } from "@/components/sections/PageContactForm";
import Footer from "@/components/Footer";

/*
  Contact.

  This site has no server. There is no route handler, no form service and no
  inbox that a POST from this page could reach — so the form on it cannot
  submit anything, and the page says that out loud rather than staging a tick
  and a "we will be in touch" over a message that went nowhere.

  What it does instead is put the address first, in text large enough to copy
  off a screen with a thumb, and then offer the form as a way of composing the
  same mail without leaving the page. `PageContactForm` explains the hand-off
  above the button and refuses to congratulate anyone afterwards.
*/

export const metadata: Metadata = {
  title: "Contact",
  description:
    "How to reach a person at WomSakhi. Write to hello@womsakhi.com — the form on this page opens your own email app rather than sending anything itself.",
  alternates: { canonical: "/contact" },
  openGraph: {
    title: `Contact · ${SITE.name}`,
    description: "How to reach a person at WomSakhi.",
    url: "/contact",
    type: "website",
  },
};

export default function ContactPage() {
  return (
    <>
      <Nav />

      <main id="main">
        <PageHeader
          eyebrow="Contact"
          title="Talk to a person"
          lead={
            <>
              There is no ticket number and no bot. Mail to WomSakhi arrives in
              front of a small team, and one of us reads it.
            </>
          }
        />

        <div className="mx-auto grid w-full max-w-[1440px] gap-10 px-4 py-14 sm:px-6 sm:py-20 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.05fr)] lg:gap-16 lg:px-10">
          <div className="min-w-0 space-y-12">
            <section aria-labelledby="direct-heading">
              <h2
                id="direct-heading"
                className="u-balance font-display text-[clamp(1.75rem,3vw,2.25rem)] font-semibold leading-[1.1] tracking-[-0.025em] text-ink"
              >
                The direct way
              </h2>
              <p className="mt-4 max-w-[36rem] text-[1.0625rem] leading-[1.7] text-ink-2">
                One address, for everything — a question before you join, a
                problem with your account, a member who is behaving badly, or a
                request to delete what we hold about you.
              </p>

              <a
                href={`mailto:${CONTACT_EMAIL}`}
                className="mt-6 flex min-h-[64px] items-center gap-4 rounded-2xl border border-brand-200 bg-brand-50 px-5 py-4 transition-colors duration-200 hover:border-brand-400 hover:bg-brand-100"
              >
                <svg
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                  className="size-6 shrink-0 text-brand-600"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={1.6}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M3.6 6.6h16.8v10.8H3.6z" />
                  <path d="m3.9 7.2 8.1 6 8.1-6" />
                </svg>
                <span className="min-w-0">
                  <span className="block break-words font-display text-[1.1875rem] font-semibold leading-snug tracking-[-0.01em] text-brand-800 sm:text-[1.375rem]">
                    {CONTACT_EMAIL}
                  </span>
                  <span className="mt-0.5 block text-[0.875rem] text-muted">
                    Opens your email app
                  </span>
                </span>
              </a>
            </section>

            <section aria-labelledby="after-heading">
              <h2
                id="after-heading"
                className="u-balance font-display text-[clamp(1.5rem,2.4vw,1.875rem)] font-semibold leading-[1.12] tracking-[-0.02em] text-ink"
              >
                What happens after you write
              </h2>
              <div className="mt-4 max-w-[36rem] space-y-4 text-[1.0625rem] leading-[1.75] text-ink-2">
                <p>
                  A person reads it — the same people who built this. We are
                  small, so a reply can take a few days rather than a few hours,
                  and we would rather say that than print a response time we
                  cannot keep.
                </p>
                <p>
                  If a week goes by with nothing, write again. It means the mail
                  went missing, not that you were ignored.
                </p>
                <p>
                  Tell us what happened and what you need. If it is about your
                  account, send it from the address you signed up with — it
                  saves a round trip while we work out who you are.
                </p>
              </div>
            </section>

            <section aria-labelledby="member-heading">
              <h2
                id="member-heading"
                className="u-balance font-display text-[clamp(1.5rem,2.4vw,1.875rem)] font-semibold leading-[1.12] tracking-[-0.02em] text-ink"
              >
                If you are already a member
              </h2>
              <div className="mt-4 max-w-[36rem] space-y-4 text-[1.0625rem] leading-[1.75] text-ink-2">
                <p>
                  The faster route is inside the app, where we can already see
                  your account and you do not have to prove it is yours. That is
                  also where you report another member.
                </p>
                <p>
                  Two things we cannot do over email, whoever asks: open or
                  unlock an account without checking who you are, and tell you
                  anything about another woman&rsquo;s account.
                </p>
              </div>
              <a
                href={SITE.app}
                className="mt-5 inline-flex min-h-11 items-center gap-2 rounded-full border border-brand-200 bg-surface px-5 text-[0.9375rem] font-semibold text-brand-700 transition-colors duration-200 hover:bg-brand-50"
              >
                Open the app
                <svg viewBox="0 0 20 20" aria-hidden="true" className="size-4" fill="none">
                  <path
                    d="M7 13 13 7m0 0H8m5 0v5"
                    stroke="currentColor"
                    strokeWidth={1.8}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </a>
            </section>

            <aside
              aria-labelledby="emergency-heading"
              className="rounded-2xl border border-line bg-surface p-5 sm:p-6"
            >
              <h2
                id="emergency-heading"
                className="flex items-start gap-3 font-display text-[1.125rem] font-semibold leading-snug text-ink"
              >
                <svg
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                  className="mt-0.5 size-5 shrink-0 text-pink-deep"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={1.6}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M12 4.2 3.4 19.2h17.2L12 4.2Z" />
                  <path d="M12 10.2v3.4" />
                  <path d="M12 16.4h.01" />
                </svg>
                This is not an emergency service
              </h2>
              <p className="mt-3 text-[0.9875rem] leading-[1.7] text-ink-2 sm:pl-8">
                Nobody is watching this inbox at three in the morning. If you
                are in immediate danger, call 112. India&rsquo;s women&rsquo;s
                helpline is 181, and it answers at any hour.
              </p>
            </aside>
          </div>

          <div className="min-w-0 lg:pt-1">
            <PageContactForm />
          </div>
        </div>
      </main>

      <Footer />
    </>
  );
}

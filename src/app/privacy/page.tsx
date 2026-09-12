import type { Metadata } from "next";
import Link from "next/link";
import { SITE } from "@/lib/site";
import { PageNav } from "@/components/sections/PageNav";
import { PageHeader } from "@/components/sections/PageHeader";
import {
  PageDoc,
  PageDocHeading,
  PageDocList,
  PageDocNote,
  PageDocSection,
  type DocSection,
} from "@/components/sections/PageDoc";
import { CONTACT_EMAIL } from "@/components/sections/PageContactForm";
import Footer from "@/components/Footer";

/*
  Privacy.

  A woman is asked to upload a government identity document to a company she
  has never heard of. Every instinct she has learned about the internet tells
  her not to. A page of "we value your privacy" boilerplate confirms the
  instinct; naming the document, the one person who sees it, and the places it
  will never appear is the only thing that answers it.

  So this is specific rather than comprehensive, and it says at the top that it
  has not been through legal review — because implying a lawyer has read
  something no lawyer has read is itself a lie about how your data is handled.
*/

const UPDATED = "12 September 2026";

export const metadata: Metadata = {
  title: "Privacy",
  description:
    "A plain-language summary of what WomSakhi collects, why, and who can see it — including why your identity document is encrypted, seen by one reviewer, and never shown to another member.",
  alternates: { canonical: "/privacy" },
  openGraph: {
    title: `Privacy · ${SITE.name}`,
    description:
      "What WomSakhi collects, why, and who can see it. Written in plain language.",
    url: "/privacy",
    type: "article",
  },
};

const SECTIONS: readonly DocSection[] = [
  { id: "what-we-collect", title: "What we collect" },
  { id: "why", title: "Why we need each one" },
  { id: "documents", title: "Your identity document" },
  { id: "who-sees-what", title: "Who can see what" },
  { id: "money", title: "Your money never touches us" },
  { id: "never", title: "What we never do" },
  { id: "this-website", title: "This website itself" },
  { id: "keeping", title: "Keeping it, and deleting it" },
  { id: "changes", title: "Changes, and reaching us" },
];

export default function PrivacyPage() {
  return (
    <>
      <PageNav />

      <main id="main">
        <PageHeader
          eyebrow="Privacy"
          title="What we do with your details"
          lead={
            <>
              What WomSakhi collects, why it needs it, and exactly who can see
              it. The short version: your identity document is seen by one
              reviewer and never by another member, and we never hold your
              money.
            </>
          }
          meta={<>Last updated {UPDATED}.</>}
        />

        <PageDoc sections={SECTIONS}>
          <PageDocNote title="This is a plain-language summary, not a reviewed legal document">
            <p>
              It was written by the people who built WomSakhi, and it has not
              been through legal review. We would rather tell you that than let
              the layout imply a lawyer has been over it.
            </p>
            <p>
              It describes what the software actually does today. If you find
              this page and the app disagreeing, treat it as our mistake and
              tell us at {CONTACT_EMAIL} — we will fix whichever one is wrong.
            </p>
          </PageDocNote>

          <PageDocSection id="what-we-collect" index={1} title="What we collect">
            <p>The whole list, not the headline items:</p>
            <PageDocList
              items={[
                <>
                  <strong className="font-semibold text-ink">Your name</strong> —
                  both your real one and the name you want other members to see,
                  if they are different.
                </>,
                <>
                  <strong className="font-semibold text-ink">
                    An email address and a phone number
                  </strong>{" "}
                  — so you can sign in, and so a buyer or an employer can be
                  told you replied.
                </>,
                <>
                  <strong className="font-semibold text-ink">
                    An identity document
                  </strong>{" "}
                  — once, when your account is reviewed. Section 3 is about
                  nothing else.
                </>,
                <>
                  <strong className="font-semibold text-ink">
                    What you do in the app
                  </strong>{" "}
                  — courses you start and finish, jobs you apply for, what you
                  list for sale, what you write in a circle.
                </>,
                <>
                  <strong className="font-semibold text-ink">
                    The payment details you choose to publish
                  </strong>{" "}
                  — the account or UPI ID a buyer needs in order to pay you
                  directly.
                </>,
                <>
                  <strong className="font-semibold text-ink">
                    Basic sign-in records
                  </strong>{" "}
                  — the device and the time. Kept so that an account being
                  broken into looks different from an account being used.
                </>,
              ]}
            />
            <p>
              There is nothing hidden under this list. We do not buy information
              about you from anyone else, and we do not build a profile of you
              from other websites.
            </p>
          </PageDocSection>

          <PageDocSection id="why" index={2} title="Why we need each one">
            <PageDocList
              items={[
                <>
                  <strong className="font-semibold text-ink">
                    Name, email, phone.
                  </strong>{" "}
                  To sign you in, to get you back in when you are locked out,
                  and to tell you a buyer has paid or an employer has answered.
                </>,
                <>
                  <strong className="font-semibold text-ink">
                    The identity document.
                  </strong>{" "}
                  Because women-only means nothing if nobody checks. It is the
                  one thing standing between a circle and whoever wants into it.
                </>,
                <>
                  <strong className="font-semibold text-ink">
                    What you do here.
                  </strong>{" "}
                  To show your progress back to you, to keep your shop working,
                  and to build the record an employer looks at before hiring
                  you.
                </>,
                <>
                  <strong className="font-semibold text-ink">
                    Payment details.
                  </strong>{" "}
                  So money can go from a buyer straight to you, without passing
                  through us.
                </>,
              ]}
            />
            <p>
              We do not collect anything in order to advertise to you. There is
              no advertising on WomSakhi.
            </p>
          </PageDocSection>

          <PageDocSection id="documents" index={3} title="Your identity document">
            <p>
              This is the part that matters most, so it is the part written most
              plainly.
            </p>
            <PageDocList
              items={[
                <>
                  It is <strong className="font-semibold text-ink">encrypted at rest</strong>.
                  It is not sitting in a folder as an ordinary image file that
                  anyone with access to a disk could open.
                </>,
                <>
                  It is opened by{" "}
                  <strong className="font-semibold text-ink">
                    one reviewer on our team
                  </strong>
                  , for the review, and for nothing else.
                </>,
                <>
                  It is{" "}
                  <strong className="font-semibold text-ink">
                    never shown to another member
                  </strong>
                  , to an employer, or to a buyer. It is not on your profile, it
                  does not appear in search, and it cannot be attached to a
                  message.
                </>,
                <>
                  It is not scored, not resold, not handed to an advertiser, and
                  not used to work out anything about you beyond the one
                  question the review asks.
                </>,
              ]}
            />
            <p>
              We keep it while your account is open, because a review that
              cannot be checked again later is not really a review. If your
              account closes, it goes with the account.
            </p>
          </PageDocSection>

          <PageDocSection id="who-sees-what" index={4} title="Who can see what">
            <PageDocHeading>Other members see</PageDocHeading>
            <p>
              The name you chose to show, a photo if you added one, the circle
              you are in, your shop and what you have listed in it, and anything
              you have written in a circle. That is the point of being here, and
              all of it is yours to take down.
            </p>

            <PageDocHeading>A buyer sees</PageDocHeading>
            <p>
              What you have listed, and the payment details you chose to
              publish — because that is how her money reaches you without
              passing through us.
            </p>

            <PageDocHeading>An employer sees</PageDocHeading>
            <p>
              What is on your profile and whatever you sent with your
              application. Not your identity document, and not your phone number
              unless you gave it to them yourself.
            </p>

            <PageDocHeading>Nobody sees</PageDocHeading>
            <p>
              Your identity document, except the one reviewer. Your password,
              including us — it is stored as a hash, which means we cannot read
              it back. Your private messages, unless you report one to us and
              ask us to read it.
            </p>
          </PageDocSection>

          <PageDocSection id="money" index={5} title="Your money never touches us">
            <p>
              WomSakhi is not a bank and never holds a member&rsquo;s money. A
              buyer pays into your account directly. There is no balance of
              yours on our side, no wallet, no payout run, and no fee taken on
              the way through.
            </p>
            <p>
              What that means for your data: we store the payment details you
              give us so that a buyer can pay you. We do not take payments, we
              do not store card numbers, and we could not move money out of your
              account because we were never in it.
            </p>
            <p>
              It is also the limit of what we can do for you. If a buyer does
              not pay, we can act on her account. We cannot reverse a payment we
              never held.
            </p>
          </PageDocSection>

          <PageDocSection id="never" index={6} title="What we never do">
            <PageDocList
              items={[
                <>
                  We do not sell your details — not to advertisers, not to data
                  brokers, not to anyone.
                </>,
                <>
                  We do not show your identity document to another member, ever,
                  for any reason.
                </>,
                <>
                  We do not give your phone number to an employer so they can
                  follow up.
                </>,
                <>We do not post, message or list anything as you.</>,
                <>
                  We do not read your messages for anything other than a report
                  you have made, or a legal order we are obliged to answer.
                </>,
              ]}
            />
          </PageDocSection>

          <PageDocSection id="this-website" index={7} title="This website itself">
            <p>
              The page you are reading is a plain website. It sets no cookies of
              its own, runs no advertising tracker, and loads nothing from an
              advertising network — the fonts and the images all come from this
              domain rather than from somebody else&rsquo;s server watching who
              asked for them.
            </p>
            <p>
              Signing in at {SITE.app.replace("https://", "")} does set a
              cookie. It is the one that keeps you signed in, and that is all it
              is for.
            </p>
          </PageDocSection>

          <PageDocSection id="keeping" index={8} title="Keeping it, and deleting it">
            <p>
              We keep what is above for as long as your account is open, and
              your account stays open until you ask us to close it.
            </p>
            <p>
              To close it, or to ask for a copy of everything we hold about you,
              write to {CONTACT_EMAIL} from the address you signed up with. A
              person does it by hand — we are small enough that there is no
              button for it yet, and saying so is better than pretending there
              is one.
            </p>
            <p>
              Two things survive a deletion, and both for the same reason: a
              record that an account was closed for harassing someone, so the
              same person cannot walk back in the next day, and anything a law
              obliges us to keep.
            </p>
          </PageDocSection>

          <PageDocSection id="changes" index={9} title="Changes, and reaching us">
            <p>
              When this changes, this page changes and so does the date at the
              top. If the change matters — something new collected, or somebody
              new who can see something — we will say so in the app rather than
              hoping you come back and re-read this.
            </p>
            <p>
              Questions about any of it go to {CONTACT_EMAIL}, and a person
              answers them.
            </p>
            <p className="pt-2">
              <Link
                href="/contact"
                className="inline-flex min-h-11 items-center gap-2 rounded-full border border-brand-200 bg-surface px-5 text-[0.9375rem] font-semibold text-brand-700 transition-colors duration-200 hover:bg-brand-50"
              >
                Go to the contact page
              </Link>
            </p>
          </PageDocSection>
        </PageDoc>
      </main>

      <Footer />
    </>
  );
}

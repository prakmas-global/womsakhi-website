import type { Metadata } from "next";
import Link from "next/link";
import { SITE } from "@/lib/site";
import { PageNav } from "@/components/sections/PageNav";
import { PageHeader } from "@/components/sections/PageHeader";
import {
  PageDoc,
  PageDocList,
  PageDocNote,
  PageDocSection,
  type DocSection,
} from "@/components/sections/PageDoc";
import { CONTACT_EMAIL } from "@/components/sections/PageContactForm";
import Footer from "@/components/Footer";

/*
  Terms.

  Held to the same standard as the privacy page: plain words, no clause that
  exists to be unreadable, and an admission at the top that no lawyer has been
  over it. The two things this page has to be unambiguous about are the two
  things a member will one day need it for — what gets an account closed, and
  the fact that when a deal between two members goes wrong, WomSakhi was never
  standing in the middle of it holding the money.
*/

const UPDATED = "12 September 2026";

export const metadata: Metadata = {
  title: "Terms",
  description:
    "The terms of using WomSakhi in plain words: women-only membership, free to join, every account reviewed by a person, what gets an account closed, and why WomSakhi is not a bank or a party to what members agree between themselves.",
  alternates: { canonical: "/terms" },
  openGraph: {
    title: `Terms · ${SITE.name}`,
    description: "The terms of using WomSakhi, in plain words.",
    url: "/terms",
    type: "article",
  },
};

const SECTIONS: readonly DocSection[] = [
  { id: "who-can-join", title: "Who can join" },
  { id: "free", title: "It is free" },
  { id: "review", title: "A person reviews your account" },
  { id: "closed", title: "What gets an account closed" },
  { id: "not-a-bank", title: "We are not a bank" },
  { id: "work", title: "Work, and what we do not promise" },
  { id: "yours", title: "What you put here stays yours" },
  { id: "certificates", title: "What a certificate is" },
  { id: "leaving", title: "Changes, and leaving" },
];

export default function TermsPage() {
  return (
    <>
      <PageNav />

      <main id="main">
        <PageHeader
          eyebrow="Terms"
          title="The terms, in plain words"
          lead={
            <>
              What you are agreeing to by using WomSakhi, written to be read
              rather than to be survived. Free to join, women only, every
              account read by a person — and WomSakhi never standing between
              you and your money.
            </>
          }
          meta={<>Last updated {UPDATED}.</>}
        />

        <PageDoc sections={SECTIONS}>
          <PageDocNote title="This is a plain-language summary, not a reviewed legal document">
            <p>
              These terms were written by the people who built WomSakhi and have
              not been through legal review. We are saying so rather than
              dressing plain English up as something a lawyer has signed off.
            </p>
            <p>
              Nothing here takes away a right the law gives you. If a line on
              this page ever conflicts with the law, the law wins and the line
              is our mistake to fix.
            </p>
          </PageDocNote>

          <PageDocSection id="who-can-join" index={1} title="Who can join">
            <p>
              WomSakhi is for women. One account each, in your own name, with
              your own identity document. Not an account shared with a husband,
              a brother or a business partner — because every promise on this
              site depends on the account being one woman.
            </p>
            <p>
              Using someone else&rsquo;s identity document to get in, or setting
              up an account for a man to use, is the fastest way to lose an
              account here.
            </p>
          </PageDocSection>

          <PageDocSection id="free" index={2} title="It is free">
            <p>
              No fee to join, no fee to learn, no fee to be listed and no fee to
              be paid. We do not take a percentage of what you earn, and we
              could not — the money never comes near us.
            </p>
            <p>
              If anybody on WomSakhi asks you for money in exchange for work, a
              placement, a certificate or a &ldquo;registration&rdquo;, they are
              not us and they are not allowed to be here. Tell us and we will
              close them.
            </p>
          </PageDocSection>

          <PageDocSection id="review" index={3} title="A person reviews your account">
            <p>
              Every account is read by a person before it can message another
              member. That is slower than a checkbox and it is the reason the
              circles work.
            </p>
            <p>
              Until the review is done you can look around, but you cannot
              message anyone. If we get a review wrong, write to us — a wrongly
              closed account is a mistake we can undo.
            </p>
          </PageDocSection>

          <PageDocSection id="closed" index={4} title="What gets an account closed">
            <p>
              Short list, plainly meant. Any of these and the account goes, by
              hand, with a reason given:
            </p>
            <PageDocList
              items={[
                <>
                  Not being who you said you were — a man on the account, or
                  somebody else&rsquo;s documents used to open it.
                </>,
                <>
                  Asking another member for money: a joining fee, a training
                  fee, a deposit to release work. Nobody here should ever have
                  to pay to be given work.
                </>,
                <>Harassment, threats, or pressure of any kind.</>,
                <>
                  Posting work that does not exist, or taking work and not
                  paying for it.
                </>,
                <>
                  Sharing another member&rsquo;s photo, number, address or
                  documents outside WomSakhi.
                </>,
                <>
                  Selling something illegal, or something that was not yours to
                  sell.
                </>,
              ]}
            />
            <p>
              Accounts are closed by people, not by a score. If yours is closed
              and you believe we have it wrong, write to {CONTACT_EMAIL} and a
              person will look again.
            </p>
          </PageDocSection>

          <PageDocSection id="not-a-bank" index={5} title="We are not a bank">
            <p>
              WomSakhi is not a bank, not a payment company, and not a party to
              anything you agree with another member.
            </p>
            <p>
              When you sell something, the agreement is between you and the
              buyer. Her money goes from her account into yours. We are not on
              that line — which is why nothing of yours can be frozen, skimmed
              or lost by us, and equally why we cannot reverse a payment we
              never held or pay you ourselves if she does not.
            </p>
            <p>
              What we can do when a deal goes wrong is act on the account: close
              it, and keep the person off the platform. That is real, and it is
              the honest size of it.
            </p>
          </PageDocSection>

          <PageDocSection id="work" index={6} title="Work, and what we do not promise">
            <p>
              An employer who posts work here is not our employee and not our
              agent. We check who they are, and we show whether the women who
              worked for them were paid on time — the review runs both ways. We
              do not sign their contracts and we cannot guarantee their
              behaviour.
            </p>
            <p>
              WomSakhi does not promise you work, a wage, or a number of hours.
              It promises you the list, the record other women left on it, and a
              circle to ask before you say yes.
            </p>
          </PageDocSection>

          <PageDocSection id="yours" index={7} title="What you put here stays yours">
            <p>
              Your photos, your listings, the description of your work, what you
              write in a circle — they remain yours. Putting them on WomSakhi
              gives us permission to show them to the people you meant to see
              them, and nothing beyond that.
            </p>
            <p>
              We do not use your work in advertising. If you take a listing
              down, it comes down. If you close your account, it goes with it.
            </p>
          </PageDocSection>

          <PageDocSection id="certificates" index={8} title="What a certificate is">
            <p>
              A certificate from a WomSakhi course says that you finished that
              course. It is ours, and it is honest about that.
            </p>
            <p>
              It is not a government qualification, a degree, or a licence for
              work that legally requires one. Where a trade needs a licence, you
              still need the licence.
            </p>
          </PageDocSection>

          <PageDocSection id="leaving" index={9} title="Changes, and leaving">
            <p>
              These terms will change as the platform does. When they do, this
              page changes and so does the date at the top. If a change affects
              something you are relying on, we will say so in the app rather
              than hoping you re-read this page.
            </p>
            <p>
              You can leave whenever you like. Write to {CONTACT_EMAIL} from the
              address you signed up with, and a person will close the account
              and remove what the privacy page describes.
            </p>
            <p>
              We can close an account too, for the reasons in section 4. We will
              tell you which one.
            </p>
            {/* Links as their own rows rather than underlined words inside a
                sentence: a thumb needs a target it can hit, and an inline link
                in a paragraph of 17px text is a 22px one. */}
            <div className="flex flex-col gap-3 pt-2 sm:flex-row">
              <Link
                href="/contact"
                className="inline-flex min-h-11 items-center justify-center gap-2 rounded-full border border-brand-200 bg-surface px-5 text-[0.9375rem] font-semibold text-brand-700 transition-colors duration-200 hover:bg-brand-50"
              >
                Ask us about any of this
              </Link>
              <Link
                href="/privacy"
                className="inline-flex min-h-11 items-center justify-center gap-2 rounded-full border border-brand-200 bg-surface px-5 text-[0.9375rem] font-semibold text-brand-700 transition-colors duration-200 hover:bg-brand-50"
              >
                Read the privacy page
              </Link>
            </div>
          </PageDocSection>
        </PageDoc>
      </main>

      <Footer />
    </>
  );
}

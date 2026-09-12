/**
 * Everything the site says about itself, in one place.
 *
 * The numbers are the ones the product actually reports from
 * `api.womsakhi.com/api/v1/public/stats`, not invented ones. When they are
 * refreshed, refresh them here — a marketing site that overstates what the
 * platform holds is the fastest way to lose the trust the platform is for.
 */
export const SITE = {
  name: "WomSakhi",
  tagline: "Together, stronger",
  description:
    "A livelihood platform built for women — learn a skill, find work that respects you, sell what you make, and do it beside women who have done it before.",
  url: "https://www.womsakhi.com",
  app: "https://app.womsakhi.com",
  signup: "https://app.womsakhi.com/signup",
  signin: "https://app.womsakhi.com/signin",
} as const;

/** The four things a woman can do here. The product's own four modes. */
export const PILLARS = [
  {
    id: "learn",
    eyebrow: "Learn",
    title: "A skill you can charge for",
    body:
      "Courses in plain language, mentors who have done the thing you want to do, and a certificate at the end that an employer will actually take seriously.",
    points: ["Learn at your own pace", "Mentors, not lecturers", "Certificates you can show"],
    href: "https://app.womsakhi.com/app/learn",
    art: "/art/lm-banner-v2.webp",
    accent: "#7648b3",
  },
  {
    id: "work",
    eyebrow: "Work",
    title: "Work on your own terms",
    body:
      "Opportunities from employers other women have already been paid by. You can see who paid on time before you say yes — the review runs both ways.",
    // "1,200+ live opportunities" stood here. Eight are open. A number that is
    // 150x the truth is the one thing this site cannot afford to print, and
    // /about prints the real one two clicks away.
    points: ["Free to apply, always", "Verified employers", "Flexible and remote work"],
    href: "https://app.womsakhi.com/app/work",
    art: "/art/scene-woman-climbing-steps.webp",
    accent: "#5b32a6",
  },
  {
    id: "earn",
    eyebrow: "Earn",
    title: "Sell it, and get paid",
    body:
      "Your own shop, a link you can send on WhatsApp, and a ledger that tells you who still owes you money. Ten places, and nothing hidden behind a fee.",
    points: ["Your shop, your prices", "Get paid by anyone", "Know what you are owed"],
    href: "https://app.womsakhi.com/app/earn",
    art: "/art/earn-market.webp",
    accent: "#ba4484",
  },
  {
    id: "circle",
    eyebrow: "Circle",
    title: "Nobody does this alone",
    body:
      "The women around you — the ones a few steps ahead, the ones starting beside you. Ask the question you are embarrassed to ask, and get a real answer.",
    points: ["Circles near you", "Ask anything, safely", "Women-only, always"],
    href: "https://app.womsakhi.com/app/circle",
    art: "/art/circle-hands-joined.webp",
    accent: "#e160a4",
  },
] as const;

/** How it works, in the order it actually happens. */
export const STEPS = [
  { n: "01", title: "Join", body: "Free, and women-only. A real person checks every account." },
  { n: "02", title: "Learn", body: "Pick a skill. Follow it at whatever pace your week allows." },
  { n: "03", title: "Earn", body: "Take work, or open a shop. Get paid into your own account." },
  { n: "04", title: "Grow", body: "Build a record employers trust, and bring another woman with you." },
] as const;

/** What the platform promises, and what it refuses. */
export const PROMISES = [
  { title: "Women only", body: "Every account is reviewed by a person before it can message anyone." },
  { title: "Free to join", body: "No fee to learn, no fee to be found, no fee to be paid." },
  { title: "We never hold your money", body: "Payments go from the buyer to your account. We are not a bank and will not behave like one." },
  { title: "Your documents stay yours", body: "Identity documents are encrypted, never public, and never shown to another member." },
] as const;

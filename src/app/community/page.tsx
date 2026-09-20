import type { Metadata } from "next";
import { MarketingPage } from "@/components/MarketingPage";

export const metadata: Metadata = {
  title: "Community with purpose",
  description:
    "Circles, conversations, events and women-led mutual support — the people who make the next step easier.",
  alternates: { canonical: "/community" },
  openGraph: { title: "Community with purpose | WomSakhi", description: "Circles, conversations, events and women-led mutual support — the people who make the next step easier.", url: "/community" },
};


const APP = process.env.NEXT_PUBLIC_APP_URL || "https://app.womsakhi.com";

export default function Community() {
  return <MarketingPage spec={{
    eyebrow: "CONNECT · SHARE · GROW",
    title: "Find women who",
    accent: "understand the journey.",
    intro: "Join thoughtful circles, ask honest questions, exchange practical knowledge and help women, girls and families build relationships that make progress feel less lonely.",
    image: "/assets/community-hero.png",
    journeyImage: "/assets/community-intergenerational-learning-v1.png",
    note: "A useful conversation can change a week.",
    stats: [["Shared interests", "Find women around goals that matter to you"], ["Moderated spaces", "Participate with clearer community boundaries"], ["Useful events", "Learn, meet and practise together"], ["Mutual support", "Ask for help and offer what you know"]],
    features: [
      { icon: "♧", title: "Find your circle", text: "Explore communities around work, business, money, health, family, creativity and local interests.", href: `${APP}/app/circle` },
      { icon: "◌", title: "Join real conversations", text: "Ask questions, share experience and learn from women navigating similar decisions.", href: `${APP}/app/circles` },
      { icon: "□", title: "Attend useful events", text: "Discover workshops, webinars, local meetups and sessions connected to your goals.", href: `${APP}/app/events` },
      { icon: "♡", title: "Help another woman", text: "Share a skill, useful contact, thoughtful answer or timely encouragement when you can.", href: `${APP}/app/together` },
    ],
    journeyTitle: "Belonging that becomes momentum",
    journey: [
      { step: "01", title: "Discover your people", text: "Browse by interest, location, life stage or the goal you are working towards." },
      { step: "02", title: "Participate at your pace", text: "Read first, join a conversation, attend an event or connect with someone relevant." },
      { step: "03", title: "Grow through contribution", text: "What you have learned can become another woman's shortcut, reassurance or fresh possibility." },
    ],
    faqs: [
      { question: "What can I talk about in a circle?", answer: "Circles can focus on learning, careers, business, money, wellbeing, parenting, creativity, local interests and other shared goals." },
      { question: "Do I have to post when I join?", answer: "No. You can begin by reading, saving useful conversations or attending an event, then participate when you feel ready." },
      { question: "How does community support practical progress?", answer: "A useful answer, trusted introduction, shared experience or timely encouragement can help turn an uncertain next step into an achievable one." },
    ],
    quote: "You do not have to know everyone. You need a few people who understand what you are trying to build.",
    quoteBy: "WomSakhi Circles",
    cta: "Find your circle",
  }} />;
}

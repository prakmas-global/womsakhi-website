import type { Metadata } from "next";
import { MarketingPage } from "@/components/MarketingPage";

export const metadata: Metadata = {
  title: "Clear answers when you need them",
  description:
    "Guidance for health, safety, rights, money and everyday decisions, written to be understood the first time.",
  alternates: { canonical: "/resources" },
  openGraph: { title: "Clear answers when you need them | WomSakhi", description: "Guidance for health, safety, rights, money and everyday decisions, written to be understood the first time.", url: "/resources" },
};


const APP = process.env.NEXT_PUBLIC_APP_URL || "https://app.womsakhi.com";

export default function Resources() {
  return <MarketingPage spec={{
    eyebrow: "HEALTH · MONEY · RIGHTS · SAFETY",
    title: "Clear support for",
    accent: "real-life decisions.",
    intro: "Find calm, practical guidance for your wellbeing, cycle, money, rights, family, travel and safety, with direct routes to further help when a situation needs more than information.",
    image: "/assets/resources-hero.png",
    note: "Good information should make the next step clearer.",
    stats: [["Plain language", "Understand options without unnecessary jargon"], ["Private tools", "Use sensitive features with greater discretion"], ["Saved guidance", "Keep useful information ready for later"], ["Routes to help", "Know when and where to seek human support"]],
    features: [
      { icon: "♡", title: "Health and wellbeing", text: "Track your cycle, explore nutrition and movement, and find support for mental wellbeing.", href: `${APP}/app/wellness` },
      { icon: "₹", title: "Money and earning clarity", text: "Understand payments, savings goals, pricing, safer choices and what may still be owed to you.", href: `${APP}/app/money` },
      { icon: "⌾", title: "Rights and safety", text: "Recognise difficult situations, understand available options and reach urgent support when needed.", href: `${APP}/app/helpdesk` },
      { icon: "▤", title: "Help for everyday life", text: "Find guidance for family, childcare, school, travel, schemes and using a phone with confidence.", href: `${APP}/app/helpdesk` },
    ],
    journeyTitle: "Useful answers without the noise",
    journey: [
      { step: "01", title: "Name what you need", text: "Choose a topic or ask Sakhi in your own words when you are not sure where to begin." },
      { step: "02", title: "Understand your options", text: "Read practical information designed to be clear, respectful and easy to act on." },
      { step: "03", title: "Take the safest next step", text: "Save the guidance, make a plan, contact support or speak with someone you trust." },
    ],
    faqs: [
      { question: "Is WomSakhi a replacement for professional advice?", answer: "No. WomSakhi offers practical information and routes to support. Medical, legal, financial and emergency situations may require a qualified professional or local service." },
      { question: "Can I save information for later?", answer: "Yes. You can save useful guidance, opportunities, people and resources so they are easier to return to when you need them." },
      { question: "What if I need urgent help?", answer: "Use the immediate support options in the Help Centre and contact the appropriate local emergency or specialist service for your situation." },
    ],
    quote: "The right information does not make the decision for you. It helps you make the decision with greater confidence.",
    quoteBy: "WomSakhi Help and Wellbeing",
    cta: "Explore support",
  }} />;
}

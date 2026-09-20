import type { Metadata } from "next";
import { MarketingPage } from "@/components/MarketingPage";

export const metadata: Metadata = {
  title: "One woman. Many ambitions.",
  description:
    "Why WomSakhi connects learning, work, income, wellbeing, family support and trusted relationships in one place built around real life.",
  alternates: { canonical: "/about" },
  openGraph: { title: "One woman. Many ambitions. | WomSakhi", description: "Why WomSakhi connects learning, work, income, wellbeing, family support and trusted relationships in one place built around real life.", url: "/about" },
};


const APP = process.env.NEXT_PUBLIC_APP_URL || "https://app.womsakhi.com";

export default function About() {
  return <MarketingPage spec={{
    eyebrow: "WHY WOMSAKHI",
    title: "One woman.",
    accent: "Many ambitions.",
    intro: "Women and girls should not need a different platform for every part of their progress. WomSakhi connects learning, work, income, wellbeing, family support and trusted relationships in one thoughtful experience.",
    image: "/assets/about-global-generations-v1.png",
    note: "Different lives. Equal possibility.",
    stats: [["One profile", "Your goals and progress stay connected"], ["Your pace", "Begin small and continue when life allows"], ["Private by design", "Sensitive journeys deserve careful choices"], ["Women with women", "Support becomes stronger when it is shared"]],
    features: [
      { icon: "◇", title: "Designed around real life", text: "WomSakhi considers time, confidence, family responsibilities, safety and access, not only ambition.", href: `${APP}/signup` },
      { icon: "▤", title: "Progress that connects", text: "Learning can lead to a certificate, a mentor, a work opportunity, a service listing or a new income goal.", href: "/programs" },
      { icon: "♡", title: "Care beyond careers", text: "Health, cycle support, mental wellbeing, rights, safety and practical guidance belong beside economic opportunity.", href: "/resources" },
      { icon: "♧", title: "Community with purpose", text: "Circles, conversations and mutual support help knowledge travel from one woman to another.", href: "/community" },
    ],
    journeyTitle: "A platform that grows with you",
    journey: [
      { step: "01", title: "Start with what matters now", text: "Choose a goal, ask Sakhi, find a course or explore opportunities without needing to plan everything at once." },
      { step: "02", title: "Build visible progress", text: "Save useful resources, complete learning, track goals and keep your work, earnings and achievements connected." },
      { step: "03", title: "Turn progress into possibility", text: "Use stronger skills, clearer choices and trusted relationships to create the future you want." },
    ],
    faqs: [
      { question: "Who is WomSakhi for?", answer: "WomSakhi is for women and girls across different ages, countries, communities and starting points. This includes learners, job seekers, entrepreneurs, caregivers, professionals, older women and families supporting a girl's future." },
      { question: "How are children included?", answer: "Children and girls are included through age-appropriate learning, family, wellbeing and community support. Work, earning and financial actions remain designed for adults and responsible caregivers." },
      { question: "Do I need a clear goal before I join?", answer: "No. You can begin with a question, browse what is available or use Ask Sakhi to find a starting point that fits your current need." },
      { question: "Why bring so many parts of life together?", answer: "Because learning, income, health, confidence and community affect one another. Connecting them makes it easier to see progress and take practical action." },
    ],
    quote: "A stronger future begins when the next useful step is easier to see.",
    quoteBy: "The WomSakhi promise",
    cta: "Find your next step",
  }} />;
}

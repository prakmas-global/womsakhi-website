import type { Metadata } from "next";
import { MarketingPage } from "@/components/MarketingPage";

export const metadata: Metadata = {
  title: "Build skills. Create choices.",
  description:
    "Practical learning paths, mentors, certificates and the routes that turn a new skill into work or income.",
  alternates: { canonical: "/programs" },
  openGraph: { title: "Build skills. Create choices. | WomSakhi", description: "Practical learning paths, mentors, certificates and the routes that turn a new skill into work or income.", url: "/programs" },
};


const APP = process.env.NEXT_PUBLIC_APP_URL || "https://app.womsakhi.com";

export default function Programs() {
  return <MarketingPage spec={{
    eyebrow: "LEARN · WORK · EARN",
    title: "Build skills.",
    accent: "Create choices.",
    intro: "Learn something useful, practise it with support, show what you can do and connect that progress to work or income. WomSakhi keeps the whole path in view.",
    image: "/assets/programs-hero.png",
    note: "What you learn can change what comes next.",
    stats: [["Short lessons", "Make progress in the time you have"], ["Mentor support", "Learn from women with relevant experience"], ["Proof of skill", "Keep certificates and achievements together"], ["Real pathways", "Move from learning towards work and earning"]],
    features: [
      { icon: "▤", title: "Learn practical skills", text: "Explore digital skills, business, money, crafts, wellbeing and other useful learning paths.", href: `${APP}/app/learn` },
      { icon: "♙", title: "Learn with a mentor", text: "Find guidance from someone who understands the work, the questions and the road ahead.", href: `${APP}/app/mentors` },
      { icon: "◇", title: "Show what you know", text: "Complete assessments, collect certificates and build a profile that reflects your growing capability.", href: `${APP}/app/certificates` },
      { icon: "↗", title: "Use your skills", text: "Explore roles, projects and ways to earn that match your interests, experience and availability.", href: `${APP}/app/work` },
    ],
    journeyTitle: "From interest to useful progress",
    journey: [
      { step: "01", title: "Choose a direction", text: "Start with a skill, a work goal, a business idea or a topic you want to understand better." },
      { step: "02", title: "Learn in manageable steps", text: "Continue at your pace through lessons, practice, live sessions and mentor guidance." },
      { step: "03", title: "Put learning to work", text: "Use your progress to strengthen your profile, apply for opportunities or build something of your own." },
    ],
    faqs: [
      { question: "Can I learn at my own pace?", answer: "Yes. WomSakhi supports progress in manageable steps, with saved learning, goals and reminders that help you continue when your time allows." },
      { question: "Does learning connect to work opportunities?", answer: "WomSakhi is designed to connect skills, certificates and interests with relevant roles, projects, mentors and ways to earn." },
      { question: "Can I use WomSakhi if I already have experience?", answer: "Yes. You can strengthen existing skills, explore a new direction, find mentors or use your experience to build work and earning opportunities." },
    ],
    quote: "Learning matters most when it gives you more confidence, more choices and a clearer next step.",
    quoteBy: "WomSakhi Learning",
    cta: "Start learning",
  }} />;
}

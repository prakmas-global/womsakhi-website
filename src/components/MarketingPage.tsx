"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { FormEvent, useState } from "react";
import { APP, SiteHeader } from "@/components/SiteHeader";

export type PageSpec = {
  eyebrow: string; title: string; accent: string; intro: string;
  image: string; journeyImage?: string; note: string;
  stats: [string, string][];
  features: { icon: string; title: string; text: string; href: string }[];
  journeyTitle: string;
  journey: { step: string; title: string; text: string }[];
  faqs: { question: string; answer: string }[];
  quote: string; quoteBy: string; cta: string;
};

export { SiteHeader as MarketingHeader };

export function SiteFooter() {
  return <footer className="marketingFooter">
    <div className="footerBrand">
      <Image className="footerLockup brandMarkLight" src="/assets/womsakhi-lockup.png" alt="WomSakhi — Stronger Women. Brighter Tomorrows." width={210} height={210} />
      <Image className="footerLockup brandMarkDark" src="/assets/womsakhi-lockup-dark.png" alt="" aria-hidden="true" width={210} height={210} />
      <p>Learn. Work. Earn. Belong.</p>
      <small>One practical place for the many parts of a woman&apos;s life.</small>
    </div>
    <nav aria-label="Explore"><b>Explore</b><Link href="/programs">Programs</Link><Link href="/community">Community</Link><Link href="/resources">Resources</Link></nav>
    <nav aria-label="Support"><b>Support</b><a href={`${APP}/app/helpdesk`}>Help Centre</a><a href={`${APP}/app/safety`}>Safety and urgent help</a><Link href="/contact">Contact WomSakhi</Link></nav>
    <nav aria-label="Join"><b>Join</b><a href={`${APP}/signup`}>Create your free account</a><a href={`${APP}/signin`}>Member sign in</a><p>Built for women. Designed around real life.</p></nav>
  </footer>;
}

export function MarketingPage({ spec }: { spec: PageSpec }) {
  const pathname = usePathname();
  const pageClass = `marketingPage-${pathname.slice(1) || "home"}`;
  const journeyImage = spec.journeyImage ?? ({
    "/assets/mission-linked-women-v2.png": "/assets/about-journey-v2.png",
    "/assets/about-global-generations-v1.png": "/assets/about-journey-v2.png",
    "/assets/programs-hero.png": "/assets/programs-students-v3.png",
    "/assets/community-hero.png": "/assets/community-generations-v3.png",
    "/assets/resources-hero.png": "/assets/resources-journey-v2.png",
  }[spec.image] ?? spec.image);
  return <div className={`marketingSite ${pageClass}`}><SiteHeader /><main id="main">
    <section className="innerHero">
      <div className="innerHeroCopy"><p className="eyebrow">{spec.eyebrow}</p><h1>{spec.title} <em>{spec.accent}</em></h1><p>{spec.intro}</p><div className="innerActions"><a className="primary" href={`${APP}/signup`}>{spec.cta} →</a><Link className="textAction" href="#explore">See what you can do ↓</Link></div></div>
      <div className="innerHeroArt"><Image src={spec.image} alt="Women supporting one another through WomSakhi" fill priority sizes="(max-width: 1006px) 100vw, 52vw" /><Image className="innerLeaves" src="/assets/hero-blush-leaves.png" alt="" width={170} height={220} /><p className="script">{spec.note}<br /><small>— WomSakhi</small></p></div>
    </section>
    <section className="innerStats" aria-label="What WomSakhi offers">{spec.stats.map(([value, label]) => <article key={label}><b>{value}</b><span>{label}</span></article>)}</section>
    <section className="featureSection" id="explore"><div className="sectionIntro"><p className="eyebrow berry">WHAT YOU CAN DO</p><h2>Practical tools for your next step</h2><p>Begin with what matters now. WomSakhi keeps the wider journey connected when you are ready for more.</p></div><div className="featureGrid">{spec.features.map((feature, index) => <article key={feature.title}><i aria-hidden="true">{feature.icon}</i><span aria-hidden="true">0{index + 1}</span><h3>{feature.title}</h3><p>{feature.text}</p><a href={feature.href}>Open this pathway<span className="srOnly">: {feature.title}</span> →</a></article>)}</div></section>
    <section className="journeySection"><div className="journeyVisual"><Image src={journeyImage} alt="Women and girls learning, connecting and moving forward" fill sizes="(max-width: 1006px) 100vw, 45vw" /><p className="script">Small steps.<br />Lasting change. ♡</p></div><div className="journeyCopy"><p className="eyebrow berry">HOW IT WORKS</p><h2>{spec.journeyTitle}</h2>{spec.journey.map((item) => <article key={item.step}><b aria-hidden="true">{item.step}</b><div><h3>{item.title}</h3><p>{item.text}</p></div></article>)}</div></section>
    <section className="faqSection"><div className="faqIntro"><p className="eyebrow berry">GOOD TO KNOW</p><h2>Questions deserve clear answers.</h2><p>Understand what WomSakhi offers before you choose your next step.</p></div><div className="faqList">{spec.faqs.map((item) => <details key={item.question}><summary>{item.question}<span aria-hidden="true">+</span></summary><p>{item.answer}</p></details>)}</div></section>
    <section className="storyBand"><Image src="/assets/mission-leaves.png" alt="" width={190} height={190} /><blockquote>&ldquo;{spec.quote}&rdquo;<small>{spec.quoteBy}</small></blockquote><a className="light" href={`${APP}/signup`}>Create your free account →</a></section>
  </main><SiteFooter /></div>;
}

const TOPICS = ["General question", "Partnership or collaboration", "Programs and learning", "Community support", "Press and media", "Product feedback"];

export function ContactPage() {
  const [sent, setSent] = useState(false);

  /**
   * There is no backend on the marketing site yet, so rather than pretend a
   * message was delivered we hand the visitor a fully written email in their
   * own mail app and say plainly that it still needs sending.
   */
  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const name = String(data.get("name") ?? "");
    const topic = String(data.get("topic") ?? "");
    const message = String(data.get("message") ?? "");
    const email = String(data.get("email") ?? "");
    const body = `${message}\n\n—\n${name}\n${email}`;
    window.location.href = `mailto:hello@womsakhi.com?subject=${encodeURIComponent(`${topic} — ${name}`)}&body=${encodeURIComponent(body)}`;
    setSent(true);
  }

  return <div className="marketingSite marketingPage-contact"><SiteHeader /><main id="main"><section className="contactHero">
    <div>
      <p className="eyebrow">TALK TO WOMSAKHI</p>
      <h1>Find the right <em>kind of help</em></h1>
      <p>Whether you have a product question, a partnership idea or feedback that can make WomSakhi better, choose the simplest way to reach us.</p>
      <div className="contactWays">
        <a href="mailto:hello@womsakhi.com"><b>General enquiries</b><span>hello@womsakhi.com</span></a>
        <a href={`${APP}/app/helpdesk`}><b>Help with your account</b><span>Open the member Help Centre</span></a>
        <a href={`${APP}/app/safety`}><b>Safety or urgent support</b><span>See immediate support options</span></a>
      </div>
    </div>
    <form onSubmit={submit}>
      <p className="eyebrow berry">TELL US WHAT YOU NEED</p>
      <label>Your name<input required name="name" autoComplete="name" /></label>
      <label>Your email<input required type="email" name="email" autoComplete="email" /></label>
      <label>What is this about?<select name="topic" defaultValue={TOPICS[0]}>{TOPICS.map((topic) => <option key={topic}>{topic}</option>)}</select></label>
      <label>How can we help?<textarea required name="message" rows={5} /></label>
      <button className="primary" type="submit">Open this in my email app →</button>
      <p className="formNote">This opens a pre-written email to hello@womsakhi.com. Nothing is sent until you press send there.</p>
      {sent && <p className="formSuccess" role="status">Your email app should now be open with the message ready. If nothing happened, write to hello@womsakhi.com directly.</p>}
    </form>
  </section></main><SiteFooter /></div>;
}

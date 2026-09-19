"use client";

import Image from "next/image";
import Link from "next/link";
import { FormEvent, useState } from "react";

const APP = "http://localhost:3100";

export type PageSpec = {
  eyebrow: string;
  title: string;
  accent: string;
  intro: string;
  image: string;
  note: string;
  stats: [string, string][];
  features: { icon: string; title: string; text: string; href: string }[];
  journeyTitle: string;
  journey: { step: string; title: string; text: string }[];
  quote: string;
  quoteBy: string;
  cta: string;
};

const navigation = [
  ["Home", "/"], ["About", "/about"], ["Programs", "/programs"],
  ["Community", "/community"], ["Resources", "/resources"], ["Contact", "/contact"],
];

export function MarketingHeader() {
  const [open, setOpen] = useState(false);
  return <header className="header marketingHeader"><Link className="brand brandOfficial brandWordOnly" href="/"><Image src="/assets/womsakhi-wordmark.png" alt="WomSakhi" width={145} height={48} priority/></Link><nav className={open?"open":""}>{navigation.map(([label,href])=><Link onClick={()=>setOpen(false)} key={href} href={href}>{label}</Link>)}</nav><div className="headerActions"><a className="searchAction" aria-label="Search WomSakhi" href={`${APP}/app/search`}>⌕</a><a className="ghost" href={`${APP}/signin`}>Sign In</a><a className="primary" href={`${APP}/signup`}>Get Started</a></div><button className="menu" aria-label="Open navigation" aria-expanded={open} onClick={()=>setOpen(v=>!v)}>☰</button></header>;
}

function SiteFooter() {
  return <footer className="marketingFooter"><div className="footerBrand"><Image className="footerLockup" src="/assets/womsakhi-lockup.png" alt="WomSakhi — Stronger Women. Brighter Tomorrows." width={120} height={120}/><p>Learn. Work. Earn. Belong.</p></div><div><b>Explore</b><Link href="/programs">Programs</Link><Link href="/community">Community</Link><Link href="/resources">Resources</Link></div><div><b>Support</b><a href={`${APP}/app/help`}>Help Centre</a><a href={`${APP}/app/safety`}>Safety Centre</a><Link href="/contact">Contact</Link></div><div><b>Join</b><a href={`${APP}/signup`}>Create an account</a><a href={`${APP}/signin`}>Member sign in</a><p>Made for women, with women.</p></div></footer>;
}

export function MarketingPage({ spec }: { spec: PageSpec }) {
  return <div className="marketingSite"><MarketingHeader/><main><section className="innerHero"><div className="innerHeroCopy"><p className="eyebrow">{spec.eyebrow}</p><h1>{spec.title} <em>{spec.accent}</em></h1><p>{spec.intro}</p><div className="innerActions"><a className="primary" href={`${APP}/signup`}>{spec.cta}　→</a><Link className="textAction" href="#explore">Explore what’s here ↓</Link></div></div><div className="innerHeroArt"><Image src={spec.image} alt="WomSakhi women supporting one another" fill priority sizes="(max-width: 760px) 100vw, 52vw"/><Image className="innerLeaves" src="/assets/hero-blush-leaves.png" alt="" width={170} height={220}/><p className="script">{spec.note}<br/><small>— WomSakhi</small></p></div></section><section className="innerStats">{spec.stats.map(([value,label])=><article key={label}><b>{value}</b><span>{label}</span></article>)}</section><section className="featureSection" id="explore"><div className="sectionIntro"><p className="eyebrow berry">WHAT YOU CAN DO</p><h2>Practical support for real life</h2><p>Start where you are. Choose one useful next step and move at your own pace.</p></div><div className="featureGrid">{spec.features.map((feature,i)=><article key={feature.title}><i>{feature.icon}</i><span>0{i+1}</span><h3>{feature.title}</h3><p>{feature.text}</p><a href={feature.href}>Explore →</a></article>)}</div></section><section className="journeySection"><div className="journeyVisual"><Image src={spec.image} alt="" fill sizes="45vw"/><p className="script">Small steps.<br/>Lasting change. ♡</p></div><div className="journeyCopy"><p className="eyebrow berry">HOW IT WORKS</p><h2>{spec.journeyTitle}</h2>{spec.journey.map(item=><article key={item.step}><b>{item.step}</b><div><h3>{item.title}</h3><p>{item.text}</p></div></article>)}</div></section><section className="storyBand"><Image src="/assets/mission-leaves.png" alt="" width={190} height={190}/><blockquote>“{spec.quote}”<small>{spec.quoteBy}</small></blockquote><a className="light" href={`${APP}/signup`}>Begin your journey　→</a></section></main><SiteFooter/></div>;
}

export function ContactPage() {
  const [sent,setSent] = useState(false);
  function submit(event:FormEvent<HTMLFormElement>){event.preventDefault();setSent(true)}
  return <div className="marketingSite"><MarketingHeader/><main><section className="contactHero"><div><p className="eyebrow">WE ARE HERE</p><h1>Let’s start a <em>conversation</em></h1><p>Questions, partnerships, feedback or support: choose the route that feels easiest. Our team will point you in the right direction.</p><div className="contactWays"><a href="mailto:hello@womsakhi.com"><b>Write to us</b><span>hello@womsakhi.com</span></a><a href={`${APP}/app/help`}><b>Member help</b><span>Open the Help Centre</span></a><a href={`${APP}/app/safety`}><b>Urgent safety</b><span>Open the Safety Centre</span></a></div></div><form onSubmit={submit}><p className="eyebrow berry">SEND A MESSAGE</p><label>Name<input required name="name" autoComplete="name"/></label><label>Email<input required type="email" name="email" autoComplete="email"/></label><label>How can we help?<select name="topic"><option>General question</option><option>Partnership</option><option>Programs and learning</option><option>Community support</option><option>Media</option></select></label><label>Message<textarea required name="message" rows={5}/></label><button className="primary" type="submit">Send message　→</button>{sent&&<p className="formSuccess" role="status">Thank you. Your message is ready for our team.</p>}</form></section></main><SiteFooter/></div>;
}

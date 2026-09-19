"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

const APP = "http://localhost:3100";
const offers = [
  ["Skill Development", "Learn in-demand skills through expert-led programs.", "learn.png", "learn"],
  ["Career Guidance", "Personalized support to help you grow & succeed.", "career.png", "work"],
  ["Community Network", "Connect, share and grow with like-minded women.", "community.png", "circle"],
  ["Health & Wellness", "Resources for a healthier, happier you.", "wellness.png", "health"],
];

function Header() {
  const [open, setOpen] = useState(false);
  const links = [["Home","/"],["About","/about"],["Programs","/programs"],["Community","/community"],["Resources","/resources"],["Contact","/contact"]];
  return <header className="header"><Link className="brand brandOfficial brandWordOnly" href="/"><Image src="/assets/womsakhi-wordmark.png" alt="WomSakhi" width={145} height={48} priority/></Link><nav className={open?"open":""}>{links.map(([label,href], i)=><Link onClick={()=>setOpen(false)} key={label} className={i===0?"active":""} href={href}>{label}</Link>)}</nav><div className="headerActions"><a className="searchAction" aria-label="Search WomSakhi" href={`${APP}/app/search`}>⌕</a><a className="ghost" href={`${APP}/signin`}>Sign In</a><a className="primary" href={`${APP}/signup`}>Get Started</a></div><button className="menu" aria-label="Open navigation" onClick={()=>setOpen(v=>!v)}>☰</button></header>;
}

function Hero() {
  return <><section className="hero" id="home"><div className="heroCopy"><p className="eyebrow">EMPOWER · EDUCATE · ELEVATE</p><h1>Every Woman<br/>Has a <em>Stronger</em><br/>Tomorrow</h1><p className="lead">WomSakhi is a supportive platform empowering women with knowledge, opportunities, and a caring community to build independent and fulfilling lives.</p><div className="actions"><a className="primary" href={`${APP}/signup`}>Join the Movement　→</a><a className="watch" href="#mission"><i>▶</i> Watch Our Story</a></div><div className="proof"><span className="faces">{[15,48,80].map(x=><Image key={x} src="/assets/community.png" alt="" width={42} height={42} style={{objectPosition:`${x}% center`}}/>)}</span><span><b>10K+</b><small>Women are already on this journey</small></span></div></div><div className="heroArt"><Image className="heroBackdrop" src="/assets/hero-mountain-bg.png" alt="" fill priority sizes="430px"/><Image className="heroWoman" src="/assets/hero-woman-cutout.png" alt="A confident woman looking toward a brighter future" fill priority sizes="470px"/><span className="leaf l1"/><span className="leaf l2"/><span className="leaf l3"/><span className="leaf l4"/><p className="script top">Learn<br/>Grow<br/>Achieve<br/>Together ♡</p><p className="script side">A Stronger<br/>You ♡</p><a className="steps" href="#programs"><span>▥</span><b>Small Steps<br/>Big Changes</b><span className="miniFaces">● ● ●</span><i>→</i></a></div></section><section className="stats">{[["♙","10K+","Women Empowered"],["▤","200+","Skill Programs"],["◇","50+","Partner Organizations"],["♡","95%","Positive Impact"]].map(s=><article key={s[1]}><i>{s[0]}</i><b>{s[1]}</b><small>{s[2]}</small></article>)}</section></>;
}

function Mission() {
  const [playing, setPlaying] = useState(false);
  return <><section className="mission" id="mission"><div className="missionArt"><Image src="/assets/mission-linked-women-v2.png" alt="Six women supporting one another while overlooking a mountain valley" fill sizes="530px"/><span className="decorLeaves"/><button className="play" aria-label="Play WomSakhi story" onClick={()=>setPlaying(true)}>▶</button><span className="together">Together</span><figure><Image src="/assets/hero-hq.png" alt="Priya" width={42} height={42}/><blockquote>“WomSakhi gave me the confidence<br/>to dream again.”<small>— Priya, Entrepreneur</small></blockquote><span>→</span></figure></div><div className="missionCopy"><p className="eyebrow berry">OUR MISSION</p><h2>A More Equal,<br/>Inclusive and <em>Empowered</em><br/>World for Women</h2><p>We believe in a world where every woman has access to education, opportunities, support and a community that stands with her. WomSakhi bridges gaps, opens doors and creates real change.</p><div className="pillars">{[["▤","Education","& Learning"],["♙","Career","Opportunities"],["♧","Community","Support"],["♡","Health","& Wellbeing"]].map(p=><span key={p[1]}><i>{p[0]}</i>{p[1]}<br/>{p[2]}</span>)}</div><a className="textLink" href="#programs">Learn more about our mission <b>→</b></a></div></section>{playing&&<div className="videoModal" role="dialog" aria-modal="true" aria-label="WomSakhi story" onClick={()=>setPlaying(false)}><div onClick={e=>e.stopPropagation()}><button className="videoClose" aria-label="Close video" onClick={()=>setPlaying(false)}>×</button><video src="/womsakhi-reveal.mp4" controls autoPlay playsInline/></div></div>}</>;
}

function Offers() {
  return <section className="offers" id="programs"><div className="sectionHead"><div><p className="eyebrow berry">WHAT WE OFFER</p><h2>Tools for a Brighter Tomorrow</h2></div><a href="#cards">Explore all programs →</a></div><div className="cards" id="cards">{offers.map((o,i)=><article key={o[0]}><Image src={`/assets/${o[2]}`} alt="" width={210} height={120}/><i>{["♙","♙","♧","♡"][i]}</i><h3>{o[0]}</h3><p>{o[1]}</p><a href={`${APP}/app/${o[3]}`}>Explore →</a></article>)}</div></section>;
}

export default function Home() {
  return <div className="site"><Header/><main><Hero/><Mission/><Offers/><section className="closing ctaClosing"><Image className="ctaLeaves ctaLeavesLeft" src="/assets/mission-leaves.png" alt="" width={230} height={230}/><Image className="ctaLeaves ctaLeavesRight" src="/assets/hero-blush-leaves.png" alt="" width={190} height={190}/><div><Image className="ctaBrandLotus" src="/assets/womsakhi-lotus.png" alt="" width={38} height={24}/><h2>Together We Create Brighter Tomorrows</h2><p>Be a part of a growing community that believes in women, always.</p><a className="light" href={`${APP}/signup`}>Join WomSakhi Today　→</a></div><p className="script">Stronger<br/>Together ♡</p></section></main></div>;
}

"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { SiteFooter } from "@/components/MarketingPage";
import { APP, SiteHeader } from "@/components/SiteHeader";
const offers = [
  ["Learn with purpose", "Build useful skills in small steps, with courses, mentors and proof of progress.", "learn.png", "learn"],
  ["Find better work", "Discover relevant roles, flexible projects and practical guidance for your next move.", "career.png", "work"],
  ["Earn on your terms", "Sell products or services, understand pricing and keep track of what you are owed.", "community.png", "earn"],
  ["Care for your wellbeing", "Use private tools and clear guidance for your body, mind, safety and rights.", "wellness.png", "wellness"],
];

function Hero() {
  return <><section className="hero" id="home"><div className="heroCopy"><p className="eyebrow">LEARN · WORK · EARN · BELONG</p><h1>Your Next Step.<br/>Your Own Pace.<br/><em>Your Future.</em></h1><p className="lead">WomSakhi brings practical learning, trusted opportunities, earning tools, wellbeing support and women-led community into one place built for real life.</p><div className="actions"><a className="primary" href={`${APP}/signup`}>Create your free account →</a><a className="watch" href="#mission"><i aria-hidden="true">▶</i> See how WomSakhi works</a></div><div className="proof"><span className="faces">{[15,48,80].map(x=><Image key={x} src="/assets/community.png" alt="" width={42} height={42} style={{objectPosition:`${x}% center`}}/>)}</span><span><b>Built for every beginning</b><small>Start with the goal that matters to you today</small></span></div></div><div className="heroArt"><Image className="heroBackdrop" src="/assets/hero-mountain-bg.png" alt="" fill priority sizes="430px"/><Image className="heroWoman" src="/assets/hero-woman-cutout.png" alt="A confident woman looking toward a brighter future" fill priority sizes="470px"/><span className="leaf l1"/><span className="leaf l2"/><span className="leaf l3"/><span className="leaf l4"/><p className="script top">Learn<br/>Earn<br/>Connect<br/>Grow ♡</p><p className="script side">A Brighter<br/>You ♡</p><a className="steps" href="#programs"><span aria-hidden="true">▥</span><b>One place.<br/>Many ways forward.</b><span className="miniFaces" aria-hidden="true">● ● ●</span><i aria-hidden="true">→</i></a></div></section><section className="stats" aria-label="What WomSakhi offers">{[["▤","Practical learning","Skills for work and everyday confidence"],["◇","Trusted opportunities","Roles, projects and ways to sell"],["♧","Women-led support","Circles, mentors and useful conversations"],["♡","Whole-life care","Health, safety, rights and guidance"]].map(s=><article key={s[1]}><i aria-hidden="true">{s[0]}</i><b>{s[1]}</b><small>{s[2]}</small></article>)}</section></>;
}

function Mission() {
  const [playing, setPlaying] = useState(false);
  useEffect(() => {
    if (!playing) return;
    const onKey = (event: KeyboardEvent) => { if (event.key === "Escape") setPlaying(false); };
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    document.addEventListener("keydown", onKey);
    return () => { document.body.style.overflow = previous; document.removeEventListener("keydown", onKey); };
  }, [playing]);
  return <><section className="mission" id="mission"><div className="missionArt"><Image src="/assets/mission-linked-women-v2.png" alt="Women of different generations supporting one another" fill sizes="530px"/><span className="decorLeaves"/><button className="play" aria-label="Play the WomSakhi story" onClick={()=>setPlaying(true)}>▶</button><span className="together">Together</span><figure><Image src="/assets/hero-hq.png" alt="WomSakhi member" width={42} height={42}/><blockquote>“Progress feels possible when<br/>the next step is clear.”<small>WomSakhi</small></blockquote><span aria-hidden="true">→</span></figure></div><div className="missionCopy"><p className="eyebrow berry">WHY WOMSAKHI</p><h2>Life Does Not Happen<br/>in Separate Boxes.<br/><em>Your Support Should Not Either.</em></h2><p>A new skill can lead to work. Work can build income. Income can create choices. Good health, clear information and trusted people make every step stronger. WomSakhi connects these parts so you can move forward without starting over in five different places.</p><div className="pillars">{[["▤","Learn","useful skills"],["♙","Work","with confidence"],["₹","Earn","and get paid"],["♡","Live","with support"]].map(p=><span key={p[1]}><i aria-hidden="true">{p[0]}</i>{p[1]}<br/>{p[2]}</span>)}</div><a className="textLink" href="#programs">Explore what you can do <b aria-hidden="true">→</b></a></div></section>{playing&&<div className="videoModal" role="dialog" aria-modal="true" aria-label="WomSakhi story" onClick={()=>setPlaying(false)}><div onClick={e=>e.stopPropagation()}><button className="videoClose" aria-label="Close video" onClick={()=>setPlaying(false)}>×</button><video src="/womsakhi-reveal.mp4" controls autoPlay playsInline/></div></div>}</>;
}

function Offers() {
  return <section className="offers" id="programs"><div className="sectionHead"><div><p className="eyebrow berry">YOUR WOMSAKHI</p><h2>Useful Today. Powerful Over Time.</h2></div><Link href="/programs">See every pathway →</Link></div><div className="cards" id="cards">{offers.map((o,i)=><article key={o[0]}><Image src={`/assets/${o[2]}`} alt="" width={210} height={120}/><i aria-hidden="true">{["▤","♙","₹","♡"][i]}</i><h3>{o[0]}</h3><p>{o[1]}</p><a href={`${APP}/app/${o[3]}`}>Open in WomSakhi →</a></article>)}</div></section>;
}

const beginnings = [
  ["I want to learn", "Find practical courses, mentors and learning paths that fit the time you have.", "▤", "learn"],
  ["I am looking for work", "Explore roles and projects aligned with your skills, location and availability.", "♙", "work"],
  ["I want to earn", "Discover ways to sell products, offer services and understand your money better.", "₹", "earn"],
  ["I need support", "Find clear guidance for health, safety, rights, family and everyday decisions.", "♡", "helpdesk"],
  ["I want my people", "Join circles, conversations and events built around shared interests and goals.", "♧", "circle"],
  ["I am not sure yet", "Tell Sakhi what is on your mind and get help finding a useful place to begin.", "✦", "sakhi"],
];

function StartingPoints() {
  return <section className="startingPoints"><div className="wideSectionHead"><div><p className="eyebrow berry">START WHERE YOU ARE</p><h2>What would make life feel more possible today?</h2></div><p>You do not need to understand the whole platform. Choose the need that feels closest to you and WomSakhi will help you move from there.</p></div><div className="startingGrid">{beginnings.map(([title,text,icon,path])=><a key={title} href={`${APP}/app/${path}`}><i aria-hidden="true">{icon}</i><span><b>{title}</b><small>{text}</small></span><em aria-hidden="true">→</em></a>)}</div></section>;
}

function SakhiStory() {
  return <section className="sakhiStory"><div className="sakhiCopy"><p className="eyebrow">MEET ASK SAKHI</p><h2>When you do not know where to begin, <em>begin with a question.</em></h2><p>Ask Sakhi helps you find courses, opportunities, support and useful information using your own words. Ask about work, money, learning, wellbeing or what is already planned for your week.</p><ul><li>Ask in the language that feels natural to you</li><li>Receive suggestions while keeping the final choice yours</li><li>Move directly from an answer to a useful WomSakhi tool</li></ul><a className="primary" href={`${APP}/app/sakhi`}>Ask Sakhi a question →</a></div><div className="sakhiVisual"><Image src="/assets/ask-sakhi-middle-age-v1.png" alt="A middle-aged woman using Ask Sakhi while planning her next step" fill sizes="(max-width: 1006px) 100vw, 45vw"/><blockquote>“You can ask simply. You can ask again. You stay in control.”<small>WomSakhi</small></blockquote></div></section>;
}

function ConnectedJourney() {
  return <section className="connectedJourney"><div className="wideSectionHead"><div><p className="eyebrow berry">ONE CONNECTED JOURNEY</p><h2>One step can open the next.</h2></div><p>Your learning, work, money, goals and wellbeing should support one another. WomSakhi keeps the connections visible.</p></div><div className="journeyRail">{[["01","Choose what matters","Set a goal or start with the need in front of you."],["02","Build useful progress","Learn, save, plan, connect and practise at your pace."],["03","Turn progress into action","Apply, sell, join, book or ask for the support you need."],["04","Keep moving forward","See your journey, celebrate progress and choose what comes next."]].map(item=><article key={item[0]}><b aria-hidden="true">{item[0]}</b><h3>{item[1]}</h3><p>{item[2]}</p></article>)}</div></section>;
}

function TrustSection() {
  return <section className="trustSection"><div><p className="eyebrow">BUILT WITH CARE</p><h2>Ambition needs opportunity. Confidence needs trust.</h2><p>WomSakhi is designed to make complex choices feel clearer while respecting the woman making them.</p></div><div className="trustGrid">{[["Clarity before complexity","Plain language, visible next steps and fewer unnecessary decisions."],["Choice stays with you","Recommendations can guide you, but they do not decide or act in your name."],["Privacy for personal journeys","Sensitive tools and conversations deserve thoughtful boundaries."],["Support when information is not enough","Clear routes help you reach people and services when a situation needs human care."]].map(([title,text])=><article key={title}><span aria-hidden="true">✓</span><div><h3>{title}</h3><p>{text}</p></div></article>)}</div></section>;
}

const productAreas = [
  ["Home", "Chosen for you", "Personal recommendations based on your interests, goals and activity.", "✦", "discover"],
  ["Learn", "Skills that lead somewhere", "Courses, mentors, practice, assessments and certificates in one learning journey.", "▤", "learn"],
  ["Work", "Opportunities that fit life", "Explore jobs, flexible projects, local work and guidance for stronger applications.", "♙", "work"],
  ["Earn", "More ways to build income", "Sell products, offer services, find projects and keep payments easier to understand.", "₹", "earn"],
  ["Circle", "Community with purpose", "Join useful conversations, interest groups, events and women-led mutual support.", "♧", "circle"],
  ["Wellness", "Care for the whole you", "Use cycle, nutrition, movement and mental wellbeing tools with greater privacy.", "♡", "wellness"],
  ["Help", "Clarity for difficult moments", "Find guidance for safety, rights, family, school, travel and practical daily needs.", "⌾", "helpdesk"],
  ["Ask Sakhi", "A simpler way to find answers", "Ask in your own words and move directly to relevant tools, resources and support.", "✧", "sakhi"],
];

function ProductWorld() {
  return <section className="productWorld"><div className="wideSectionHead"><div><p className="eyebrow berry">EVERYTHING IN ONE PLACE</p><h2>Meet the WomSakhi world.</h2></div><p>Open one account and build a journey across learning, opportunity, income, community and care. Each area works on its own and becomes more useful when connected.</p></div><div className="productWorldGrid">{productAreas.map(([area,title,text,icon,path])=><a key={area} href={`${APP}/app/${path}`}><span className="productIcon" aria-hidden="true">{icon}</span><small>{area}</small><h3>{title}</h3><p>{text}</p><b>Explore {area} <i aria-hidden="true">→</i></b></a>)}</div></section>;
}

function PersonalWorkspace() {
  return <section className="personalWorkspace"><div className="workspaceVisual"><Image src="/assets/community-generations-v3.png" alt="Women across generations building their next steps together" fill sizes="(max-width: 1006px) 100vw, 46vw"/></div><div className="workspaceCopy"><p className="eyebrow berry">YOUR JOURNEY, REMEMBERED</p><h2>Come back to progress, not another blank page.</h2><p>Your WomSakhi account keeps the useful parts of your journey together, so the course you saved, the goal you set and the opportunity you noticed are easier to find again.</p><div className="workspaceFeatures">{[["Chosen for you","Recommendations shaped around what matters to you."],["My journey","A connected view of progress across WomSakhi."],["Goals and calendar","Turn intentions into milestones, reminders and time."],["Saved","Keep opportunities, learning, people and resources close."],["What’s new","See relevant updates without searching every section."],["Private profile","Choose what you share and keep your details current."]].map(([title,text])=><article key={title}><span aria-hidden="true">✓</span><div><h3>{title}</h3><p>{text}</p></div></article>)}</div><a className="primary" href={`${APP}/signup`}>Create your personal space →</a></div></section>;
}

function ForEveryChapter() {
  const chapters = [["Starting out","Explore interests, build confidence and learn practical skills."],["Returning to work","Refresh skills, find flexible options and rebuild professional momentum."],["Building a business","Shape an offer, reach customers and understand income more clearly."],["Balancing many roles","Keep goals, family needs, health and opportunities in one manageable view."],["Beginning again","Find support, useful information and a next step after life changes."],["Sharing experience","Mentor, teach, contribute and help another woman move forward."]];
  return <section className="lifeChapters"><div className="chapterIntro"><p className="eyebrow">FOR EVERY CHAPTER</p><h2>There is no single way to move forward.</h2><p>WomSakhi meets different ambitions, responsibilities and life stages with practical paths rather than one fixed definition of success.</p><a href={`${APP}/signup`}>Find your place in WomSakhi →</a></div><div className="chapterList">{chapters.map(([title,text],index)=><article key={title}><b aria-hidden="true">0{index+1}</b><div><h3>{title}</h3><p>{text}</p></div></article>)}</div></section>;
}

function HomeFaq() {
  const faqs = [["Is WomSakhi only for careers?","No. Work and income matter, but so do learning, health, safety, rights, family, confidence and community. WomSakhi brings them together."],["Can I join if I am not sure what I need?","Yes. Browse Chosen for you, explore a section or ask Sakhi in your own words. You can begin without having a complete plan."],["Is it useful for women at different ages?","Yes. WomSakhi supports learners, working women, entrepreneurs, caregivers, women returning to work and older women sharing experience. Girls and children are included through age-appropriate family, learning and wellbeing support."],["Will WomSakhi make decisions or apply for things for me?","No. WomSakhi helps you understand options and prepare next steps. Important choices and actions remain yours."],["What do I get when I create an account?","You receive a personal place to save resources, track goals, follow learning, view recommendations, plan activities and keep your wider journey connected."]];
  return <section className="homeFaq"><div><p className="eyebrow berry">BEFORE YOU JOIN</p><h2>A few honest answers.</h2><p>Know what to expect, then decide whether WomSakhi is right for you.</p></div><div>{faqs.map(([question,answer])=><details key={question}><summary>{question}<span aria-hidden="true">+</span></summary><p>{answer}</p></details>)}</div></section>;
}

export default function Home() {
  return <div className="site"><SiteHeader/><main id="main"><Hero/><StartingPoints/><Mission/><Offers/><ProductWorld/><SakhiStory/><PersonalWorkspace/><ConnectedJourney/><ForEveryChapter/><TrustSection/><HomeFaq/><section className="closing ctaClosing"><Image className="ctaLeaves ctaLeavesLeft" src="/assets/mission-leaves.png" alt="" width={230} height={230}/><Image className="ctaLeaves ctaLeavesRight" src="/assets/hero-blush-leaves.png" alt="" width={190} height={190}/><div><Image className="ctaBrandLotus" src="/assets/womsakhi-lotus.png" alt="" width={38} height={24}/><h2>You Do Not Need the Whole Plan. Just a Place to Begin.</h2><p>Create your free WomSakhi account and choose the next step that feels right for you.</p><a className="light" href={`${APP}/signup`}>Start your WomSakhi journey →</a></div><p className="script">Your pace.<br/>Your path. ♡</p></section></main><SiteFooter/></div>;
}

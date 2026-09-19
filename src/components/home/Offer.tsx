import Image from "next/image";
import { SITE } from "@/lib/site";
import { ArrowRight, GuideIcon, LearnerIcon, NetworkIcon, WellnessIcon } from "./marks";

/*
  "What we offer": four cards, each with a tinted round icon, a photograph
  fading in from the top-right corner, a line of copy and "Explore". Each
  card opens the matching part of the member app.
*/

const CARDS = [
  {
    title: "Skill Development",
    body: ["Learn in-demand skills through", "expert-led programs."],
    href: `${SITE.app}/app/learn`,
    img: "/home/card-skill.webp",
    alt: "A young woman working on a laptop at a table by a window.",
    icon: <LearnerIcon />,
    bg: "#f9d8df",
    fg: "#a8214f",
  },
  {
    title: "Career Guidance",
    body: ["Personalized support to help", "you grow & succeed."],
    href: `${SITE.app}/app/work`,
    img: "/home/card-career.webp",
    alt: "Two women in conversation across a table, one of them in a blazer.",
    icon: <GuideIcon />,
    bg: "#fcecdb",
    fg: "#d9771f",
  },
  {
    title: "Community Network",
    body: ["Connect, share and grow", "with like-minded women."],
    href: `${SITE.app}/app/circle`,
    img: "/home/card-community.webp",
    alt: "A group of women standing together indoors.",
    icon: <NetworkIcon />,
    bg: "#dfe1f1",
    fg: "#23489a",
  },
  {
    title: "Health & Wellness",
    body: ["Resources for a healthier,", "happier you."],
    href: `${SITE.app}/app/health`,
    img: "/home/card-health.webp",
    alt: "A woman meditating cross-legged outdoors, with mountains and the rising sun behind her.",
    icon: <WellnessIcon />,
    bg: "#fadae2",
    fg: "#ad2150",
  },
] as const;

export function Offer() {
  return (
    <section id="programs" className="ws-canvas ws-offer" aria-labelledby="offer-title">
      <div className="ws-offer-head">
        <p className="ws-eyebrow">What We Offer</p>
        <h2 id="offer-title" className="ws-h2 ws-display">
          Tools for a Brighter Tomorrow
        </h2>
        <a href={`${SITE.app}/app/programs`} className="ws-offer-all">
          Explore all programs
          <ArrowRight />
        </a>
      </div>

      <ul className="ws-cards">
        {CARDS.map((c) => (
          <li key={c.title} className="ws-card">
            <Image className="ws-card-img" src={c.img} alt={c.alt} width={524} height={392} sizes="(min-width: 1024px) 13vw, 60vw" />
            <span className="ws-card-icon" style={{ background: c.bg, color: c.fg }} aria-hidden>
              {c.icon}
            </span>
            <h3>{c.title}</h3>
            <p>
              {c.body[0]}
              <br />
              {c.body[1]}
            </p>
            <a href={c.href}>
              Explore
              <span className="ws-sr"> {c.title}</span>
              <ArrowRight />
            </a>
          </li>
        ))}
      </ul>
    </section>
  );
}

export default Offer;

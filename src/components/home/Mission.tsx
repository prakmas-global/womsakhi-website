import Image from "next/image";
import Link from "next/link";
import { ArrowRight, BookIcon, CareerIcon, CommunityIcon, HeartIcon, PlayTriangle } from "./marks";

/*
  "Our mission": the sunset photograph of women sitting together, with its
  play button, "Together" in handwriting and the testimonial card overlapping
  it; beside it the headline, paragraph and the four round-icon pillars.
*/

const PILLARS = [
  { label: ["Education", "& Learning"], icon: <BookIcon />, bg: "#e5e8f8", fg: "#1f4597" },
  { label: ["Career", "Opportunities"], icon: <CareerIcon />, bg: "#e5e9f8", fg: "#1f4a9e" },
  { label: ["Community", "Support"], icon: <CommunityIcon />, bg: "#ddf0f6", fg: "#12609f" },
  { label: ["Health", "& Wellbeing"], icon: <HeartIcon />, bg: "#ddecfa", fg: "#1a52a8" },
] as const;

export function Mission() {
  return (
    <section id="community" className="ws-canvas ws-mission" aria-labelledby="mission-title">
      <div className="ws-mission-art">
        <Image
          className="ws-mission-img"
          src="/home/mission-art.webp"
          alt="Six women sitting close together on a grassy hillside, arms around each other's shoulders, watching the sun set over the mountains."
          width={1590}
          height={1275}
          sizes="(min-width: 1024px) 53vw, 100vw"
        />
        <Link href="/about" className="ws-play-lg" aria-label="Watch our story">
          <PlayTriangle />
        </Link>
        <p className="ws-together" aria-hidden>
          Together
        </p>
        <figure className="ws-quote">
          <Image src="/home/avatar-priya.webp" alt="Priya" width={64} height={64} />
          <div>
            <blockquote>“WomSakhi gave me the confidence to dream again.”</blockquote>
            <figcaption>– Priya, Entrepreneur</figcaption>
          </div>
          <ArrowRight className="ws-quote-go" />
        </figure>
      </div>

      <div className="ws-mission-copy">
        <p className="ws-eyebrow ws-eyebrow-berry">Our Mission</p>
        <h2 id="mission-title" className="ws-h2 ws-display">
          A More Equal,
          <br />
          Inclusive and <em>Empowered</em>
          <br />
          World for Women
        </h2>
        <p className="ws-lede">
          We believe in a world where every woman has access to education, opportunities, support
          and a community that stands with her. WomSakhi bridges gaps, opens doors and creates real
          change.
        </p>
        <ul className="ws-pillars">
          {PILLARS.map((p) => (
            <li key={p.label[0]}>
              <span className="ws-mission-icon" style={{ background: p.bg, color: p.fg }} aria-hidden>
                {p.icon}
              </span>
              <span>
                {p.label[0]}
                <br />
                {p.label[1]}
              </span>
            </li>
          ))}
        </ul>
        <hr className="ws-rule" />
        <Link href="/about" className="ws-textlink">
          Learn more about our mission
          <ArrowRight />
        </Link>
      </div>
    </section>
  );
}

export default Mission;

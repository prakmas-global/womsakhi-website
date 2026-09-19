import Image from "next/image";
import Link from "next/link";
import { SITE } from "@/lib/site";
import {
  ArrowRight,
  BookIcon,
  ChartIcon,
  HandshakeIcon,
  HeartIcon,
  PlayTriangle,
  ScrawlArrow,
  ScrawlHeart,
  UsersIcon,
} from "./marks";

/*
  The hero and the stats band beneath it, from the reference design.

  Left: eyebrow, the three-line serif headline with "Stronger" in berry
  italic, the paragraph, the two actions and the avatar row.

  Right: the photograph composite (the arched portrait, pink leaves, misty
  hills), with the handwriting, and the floating "Small Steps / Big Changes"
  card drawn over it in HTML. Every position inside the composite is in
  reference pixels, so the overlays land exactly where the reference has them.

  The stats panel overlaps the bottom of the photograph, as it does in the
  reference. Its numbers are the reference's, reproduced as written.
*/

const STATS = [
  { value: "10K+", label: "Women Empowered", x: 0, icon: <UsersIcon />, bg: "#fbede7", fg: "#b24c4f" },
  { value: "200+", label: "Skill Programs", x: 226, icon: <BookIcon />, bg: "#fbe3eb", fg: "#a3284f" },
  { value: "50+", label: "Partner Organizations", x: 437, icon: <HandshakeIcon />, bg: "#f5e5f7", fg: "#6c2385" },
  { value: "95%", label: "Positive Impact", x: 663, icon: <HeartIcon />, bg: "#fbe3e9", fg: "#b0285a" },
] as const;

const u = (n: number) => `calc(${n} * var(--u))`;
const a = (n: number) => `calc(${n} * var(--a))`;

function Scrawl({
  children,
  x,
  y,
  size,
  rotate,
}: {
  children: React.ReactNode;
  x: number;
  y: number;
  size: number;
  rotate: number;
}) {
  return (
    <span
      className="ws-scrawl"
      style={{ left: a(x), top: a(y), fontSize: a(size), transform: `rotate(${rotate}deg)` }}
    >
      {children}
    </span>
  );
}

export function Hero() {
  return (
    <>
      <section className="ws-canvas ws-hero" aria-labelledby="hero-title">
        <div className="ws-hero-copy">
          <p className="ws-eyebrow">
            <span>Empower</span>
            <span className="ws-dot" aria-hidden>
              ·
            </span>
            <span>Educate</span>
            <span className="ws-dot" aria-hidden>
              ·
            </span>
            <span>Elevate</span>
          </p>
          <h1 id="hero-title" className="ws-h1 ws-display">
            Every Woman
            <br />
            Has a <span className="ws-accent">Stronger</span>
            <br />
            Tomorrow
          </h1>
          <p className="ws-lede">
            WomSakhi is a supportive platform empowering women with knowledge, opportunities, and a
            caring community to build independent and fulfilling lives.
          </p>

          <div className="ws-actions">
            <a href={SITE.signup} className="ws-pill ws-pill-berry ws-join">
              Join the Movement
              <ArrowRight />
            </a>
            <Link href="/about" className="ws-watch">
              <span className="ws-play" aria-hidden>
                <PlayTriangle />
              </span>
              Watch Our Story
            </Link>
          </div>

          <div className="ws-proof">
            <span className="ws-stack" aria-hidden>
              <Image src="/home/avatar-hero-1.webp" alt="" width={54} height={54} />
              <Image src="/home/avatar-hero-2.webp" alt="" width={54} height={54} />
              <Image src="/home/avatar-hero-3.webp" alt="" width={54} height={54} />
            </span>
            <span>
              <strong className="ws-proof-num">10K+</strong>
              <span className="ws-proof-label">Women are already on this journey</span>
            </span>
          </div>
        </div>

        <div className="ws-art">
          <Image
            className="ws-art-img"
            src="/home/hero-art.webp"
            alt="A smiling young woman in a white kurta and a rose-pink dupatta, arms folded, looking up towards the hills."
            width={1866}
            height={1650}
            priority
            sizes="(min-width: 1024px) 62vw, 100vw"
          />

          <span className="ws-scrawl-set" aria-hidden>
            <Scrawl x={467} y={40} size={23} rotate={-8}>
              Learn
            </Scrawl>
            <Scrawl x={478} y={71} size={23} rotate={-8}>
              Grow
            </Scrawl>
            <Scrawl x={480} y={102} size={23} rotate={-8}>
              Achieve
            </Scrawl>
            <Scrawl x={473} y={133} size={23} rotate={-8}>
              Together
            </Scrawl>
            <ScrawlArrow
              className="ws-scrawl-arrow"
              variant="right"
              style={{ left: a(527), top: a(73), width: a(15), height: a(18) }}
            />
            <ScrawlHeart
              className="ws-scrawl-heart"
              style={{ left: a(556), top: a(136), width: a(19), height: a(18) }}
            />
            <ScrawlArrow
              className="ws-scrawl-arrow"
              style={{ left: a(487), top: a(172), width: a(18), height: a(26) }}
            />

            <Scrawl x={13} y={301} size={17.5} rotate={-13}>
              A Stronger
            </Scrawl>
            <Scrawl x={27} y={327} size={17.5} rotate={-13}>
              You
            </Scrawl>
            <ScrawlHeart
              className="ws-scrawl-heart"
              style={{ left: a(62), top: a(323), width: a(16), height: a(15) }}
            />
            <ScrawlArrow
              className="ws-scrawl-arrow"
              style={{ left: a(55), top: a(352), width: a(12), height: a(17) }}
            />
          </span>

          <a href={`${SITE.app}/app/progress`} className="ws-steps">
            <span className="ws-steps-inner">
              <ChartIcon className="ws-steps-icon" />
              <span className="ws-steps-text">
                Small Steps
                <br />
                Big Changes
              </span>
              <span className="ws-steps-stack" aria-hidden>
                <Image src="/home/avatar-steps-1.webp" alt="" width={42} height={42} />
                <Image src="/home/avatar-steps-2.webp" alt="" width={42} height={42} />
                <Image src="/home/avatar-steps-3.webp" alt="" width={42} height={42} />
              </span>
              <ArrowRight className="ws-steps-go" />
            </span>
          </a>
        </div>
      </section>

      <section className="ws-canvas ws-stats" aria-label="WomSakhi in numbers">
        <ul className="ws-stats-panel">
          {STATS.map((s) => (
            <li key={s.label} className="ws-stat" style={{ left: u(43 + s.x) }}>
              <span className="ws-stat-icon" style={{ background: s.bg, color: s.fg }} aria-hidden>
                {s.icon}
              </span>
              <span className="ws-stat-num">{s.value}</span>
              <span className="ws-stat-label">{s.label}</span>
              {s.x > 0 && <span className="ws-stat-rule" aria-hidden />}
            </li>
          ))}
        </ul>
      </section>
    </>
  );
}

export default Hero;

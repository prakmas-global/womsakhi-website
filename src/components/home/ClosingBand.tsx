import { SITE } from "@/lib/site";
import { ArrowRight, Lotus, ScrawlArrow, ScrawlHeart } from "./marks";

/*
  The closing band: the deep berry banner with rounded shoulders and a wavy
  foot, pink leaves at both ends, the lotus, one line of serif, one line of
  sans, a white pill, and "Stronger Together" in handwriting. The banner, its
  gradient and its leaves are one background picture taken from the reference;
  every word on it is live text.
*/

const u = (n: number) => `calc(${n} * var(--u))`;

export function ClosingBand() {
  return (
    <div className="ws ws-band-wrap">
      <section className="ws-canvas ws-band" aria-labelledby="band-title">
        <div className="ws-band-bg" aria-hidden />
        <div className="ws-band-inner">
          <Lotus className="ws-band-lotus" />
          <h2 id="band-title">Together We Create Brighter Tomorrows</h2>
          <p>Be a part of a growing community that believes in women, always.</p>
          <a href={SITE.signup} className="ws-pill ws-band-cta">
            Join WomSakhi Today
            <ArrowRight />
          </a>
        </div>
        <span className="ws-scrawl-set" aria-hidden>
          <span
            className="ws-scrawl"
            style={{ left: u(834), top: u(91), fontSize: u(20), transform: "rotate(-16deg)" }}
          >
            Stronger
          </span>
          <span
            className="ws-scrawl"
            style={{ left: u(851), top: u(113), fontSize: u(20), transform: "rotate(-16deg)" }}
          >
            Together
          </span>
          <ScrawlHeart className="ws-scrawl-heart" style={{ left: u(921), top: u(119), width: u(15), height: u(14) }} />
          <ScrawlArrow className="ws-scrawl-arrow" style={{ left: u(864), top: u(149), width: u(13), height: u(24) }} />
        </span>
      </section>
    </div>
  );
}

export default ClosingBand;

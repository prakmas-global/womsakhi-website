/*
  The small drawn things the reference design uses: the lotus mark, the line
  icons inside the tinted circles, the arrows and the hand-drawn flourishes.
  All inline SVG, all `currentColor` where a colour is meant to follow the
  text, all hidden from assistive technology — every one of them sits next to
  words that already say what it means.
*/

type IconProps = { className?: string };

/* One petal pointing straight up from (0,0), `h` tall and `w` wide. */
function petal(h: number, w: number) {
  return `M0 0 C ${-w} ${-h * 0.34} ${-w * 0.62} ${-h * 0.8} 0 ${-h} C ${w * 0.62} ${-h * 0.8} ${w} ${-h * 0.34} 0 0 Z`;
}

const PETALS = [
  { a: -64, h: 19, w: 8.2, fill: "#f4c4d2" },
  { a: 64, h: 19, w: 8.2, fill: "#f4c4d2" },
  { a: -36, h: 23.5, w: 7.6, fill: "#eba3ba" },
  { a: 36, h: 23.5, w: 7.6, fill: "#eba3ba" },
  { a: -15, h: 26, w: 6.6, fill: "#dd7c9e" },
  { a: 15, h: 26, w: 6.6, fill: "#dd7c9e" },
  { a: 0, h: 28, w: 6.4, fill: "#c9588a" },
] as const;

/** The seven-petal lotus from the reference's header and closing band. */
export function Lotus({ className }: IconProps) {
  return (
    <svg viewBox="0 0 44 32" className={className} aria-hidden focusable="false">
      <ellipse cx="13" cy="29.3" rx="8.6" ry="2.3" transform="rotate(-9 13 29.3)" fill="#d9819f" />
      <ellipse cx="31" cy="29.3" rx="8.6" ry="2.3" transform="rotate(9 31 29.3)" fill="#d9819f" />
      <g transform="translate(22 29.5)">
        {PETALS.map((p) => (
          <path
            key={`${p.a}-${p.h}`}
            d={petal(p.h, p.w)}
            transform={`rotate(${p.a})`}
            fill={p.fill}
            fillOpacity={0.93}
          />
        ))}
      </g>
    </svg>
  );
}

const stroke = {
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.7,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
};

export function ArrowRight({ className }: IconProps) {
  return (
    <svg viewBox="0 0 20 20" className={className ?? "ws-arrow"} aria-hidden focusable="false">
      <path d="M3.5 10h12.5m-5-5 5 5-5 5" {...stroke} strokeWidth={2} />
    </svg>
  );
}

export function PlayTriangle() {
  return (
    <svg viewBox="0 0 20 20" aria-hidden focusable="false">
      <path d="M4.5 2.8v14.4a.8.8 0 0 0 1.2.7l12-7.2a.8.8 0 0 0 0-1.4l-12-7.2a.8.8 0 0 0-1.2.7Z" fill="currentColor" />
    </svg>
  );
}

export function SearchIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden focusable="false">
      <circle cx="10.8" cy="10.8" r="6.6" {...stroke} strokeWidth={1.9} />
      <path d="m15.8 15.8 4.6 4.6" {...stroke} strokeWidth={1.9} />
    </svg>
  );
}

export function MenuIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden focusable="false">
      <path d="M4 7h16M4 12h16M4 17h11" {...stroke} strokeWidth={1.9} />
    </svg>
  );
}

export function CloseIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden focusable="false">
      <path d="m6.5 6.5 11 11m0-11-11 11" {...stroke} strokeWidth={1.9} />
    </svg>
  );
}

export function ChartIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 22" className={className} aria-hidden focusable="false">
      <path d="M2 20.5h20" {...stroke} strokeWidth={1.6} />
      <rect x="3.5" y="12.5" width="3.2" height="8" rx="1.1" {...stroke} strokeWidth={1.5} />
      <rect x="8.6" y="9.5" width="3.2" height="11" rx="1.1" {...stroke} strokeWidth={1.5} />
      <rect x="13.7" y="6.5" width="3.2" height="14" rx="1.1" {...stroke} strokeWidth={1.5} />
      <rect x="18.8" y="2.5" width="3.2" height="18" rx="1.1" {...stroke} strokeWidth={1.5} />
    </svg>
  );
}

/* Line icons for the tinted circles. */

export function UsersIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden focusable="false">
      <circle cx="8.3" cy="8" r="3.3" {...stroke} />
      <circle cx="16.2" cy="8" r="3.3" {...stroke} />
      <path d="M2.8 19.5c0-3.3 2.5-5.8 5.5-5.8s5.5 2.5 5.5 5.8" {...stroke} />
      <path d="M13.1 14.5a5.3 5.3 0 0 1 3.1-.8c3 0 5.3 2.5 5.3 5.8" {...stroke} />
    </svg>
  );
}

export function BookIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden focusable="false">
      <path d="M3 5.2c3.2-.9 6.2-.6 9 1.2v13.2c-2.8-1.7-5.8-2-9-1.2Z" {...stroke} />
      <path d="M21 5.2c-3.2-.9-6.2-.6-9 1.2v13.2c2.8-1.7 5.8-2 9-1.2Z" {...stroke} />
      <path d="M3 18.4v1.4c3.2-.8 6.2-.5 9 1.2 2.8-1.7 5.8-2 9-1.2v-1.4" {...stroke} />
    </svg>
  );
}

export function HandshakeIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden focusable="false">
      <path d="m2.5 11 4.2-4.5 3.4 1.6" {...stroke} />
      <path d="m21.5 11-4.2-4.5-4.6 1.7-3.3 3.1a1.3 1.3 0 0 0 1.8 1.9l2.1-1.6 4.8 4.4" {...stroke} />
      <path d="m2.5 11 7.8 7.6a1.5 1.5 0 0 0 2.1 0l.2-.2m-5.6-4.1 1.5 1.4m1.6-3.2 2.2 2.1m1.1-3.2 2.2 2.1" {...stroke} />
      <path d="m12.6 18.4 1.9 1.4 7-8.8" {...stroke} />
    </svg>
  );
}

export function HeartIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden focusable="false">
      <path d="M12 20.2S3.2 15 3.2 8.9A4.6 4.6 0 0 1 12 6.8a4.6 4.6 0 0 1 8.8 2.1c0 6.1-8.8 11.3-8.8 11.3Z" {...stroke} />
    </svg>
  );
}

export function CareerIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden focusable="false">
      <path d="m12 2.8 5.2 3.4-5.2 3.3-5.2-3.3Z" {...stroke} />
      <path d="M16.6 6.6v2.6" {...stroke} />
      <path d="M9 8.3a3.3 3.3 0 1 0 6 0" {...stroke} />
      <path d="M5 21v-2.3c0-2.8 2.3-4.8 5-4.8h4c2.7 0 5 2 5 4.8V21Z" {...stroke} />
      <path d="M8.2 18h7.6" {...stroke} />
    </svg>
  );
}

export function CommunityIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden focusable="false">
      <circle cx="7" cy="7.4" r="2.6" {...stroke} />
      <circle cx="17" cy="7.4" r="2.6" {...stroke} />
      <circle cx="12" cy="11.3" r="2.6" {...stroke} />
      <path d="M2.8 16.3c.3-2.4 2-3.9 4.2-3.9.7 0 1.3.1 1.9.4M21.2 16.3c-.3-2.4-2-3.9-4.2-3.9-.7 0-1.3.1-1.9.4" {...stroke} />
      <path d="M7.4 20.6c.3-2.6 2.2-4.3 4.6-4.3s4.3 1.7 4.6 4.3Z" {...stroke} />
    </svg>
  );
}

export function LearnerIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden focusable="false">
      <path d="M8.2 8.8c0-2.9 1.7-5.3 3.8-5.3s3.8 2.4 3.8 5.3c0 1.5-.5 2.7-1.2 3.4" {...stroke} />
      <circle cx="12" cy="9" r="3" {...stroke} />
      <path d="M4.5 20.5v-1.4c0-3 2.4-5.4 5.4-5.4h4.2c3 0 5.4 2.4 5.4 5.4v1.4Z" {...stroke} />
      <path d="M8.5 17.2h7" {...stroke} />
    </svg>
  );
}

export function GuideIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden focusable="false">
      <path d="M7.6 6.4a4.4 4.4 0 0 1 8.8 0" {...stroke} />
      <circle cx="12" cy="8.6" r="3.2" {...stroke} />
      <path d="M4.5 20.5v-1.3c0-3 2.4-5.5 5.4-5.5h4.2c3 0 5.4 2.5 5.4 5.5v1.3Z" {...stroke} />
      <path d="m12 13.8-1.4 3.4 1.4 1.4 1.4-1.4Z" {...stroke} strokeWidth={1.4} />
    </svg>
  );
}

export function NetworkIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden focusable="false">
      <path d="M5 6.5a3 3 0 0 1 3-3h8a3 3 0 0 1 3 3v2.2a3 3 0 0 1-3 3h-4.5L8.4 14v-2.3H8a3 3 0 0 1-3-3Z" {...stroke} />
      <path d="M4.5 20.5v-.9c0-2.4 2-4.4 4.4-4.4M19.5 20.5v-.9c0-2.4-2-4.4-4.4-4.4" {...stroke} />
      <path d="M8.5 20.5h7" {...stroke} />
      <path d="M9.6 7.6h4.8" {...stroke} strokeWidth={1.4} />
    </svg>
  );
}

export function WellnessIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden focusable="false">
      <path d="M8.2 12.3S3.3 9.6 3.3 6.4a2.7 2.7 0 0 1 4.9-1.6 2.7 2.7 0 0 1 4.9 1.6c0 1-.4 1.9-1 2.8" {...stroke} />
      <path d="M15.8 12.3s4.9-2.7 4.9-5.9a2.7 2.7 0 0 0-4.9-1.6" {...stroke} />
      <path d="M3.5 20.5c.4-3.6 2.4-5.5 4.7-5.5 1.6 0 2.9.8 3.8 2.3.9-1.5 2.2-2.3 3.8-2.3 2.3 0 4.3 1.9 4.7 5.5" {...stroke} />
    </svg>
  );
}

/* Hand-drawn flourishes that sit beside the script lettering. */

export function ScrawlHeart({ className, style }: IconProps & { style?: React.CSSProperties }) {
  return (
    <svg viewBox="0 0 24 22" className={className} style={style} aria-hidden focusable="false">
      <path
        d="M12.2 19.4C7.6 16.2 3 12.6 3.1 8.1c.1-2.8 2.1-4.7 4.5-4.6 2 .1 3.6 1.5 4.3 3.4.8-2 2.6-3.5 4.7-3.4 2.4.1 4.3 2.2 4.1 4.9-.4 4.6-4.9 8-8.5 11"
        fill="none"
        stroke="currentColor"
        strokeWidth={1.5}
        strokeLinecap="round"
      />
    </svg>
  );
}

export function ScrawlArrow({ className, style, variant = "down" }: IconProps & { style?: React.CSSProperties; variant?: "down" | "right" }) {
  return (
    <svg viewBox="0 0 24 30" className={className} style={style} aria-hidden focusable="false">
      {variant === "down" ? (
        <path
          d="M17 2.5c.6 7.5-2.6 14.6-9.8 22.3m-.4-6.3-.3 6.7 6.2-1.4"
          fill="none"
          stroke="currentColor"
          strokeWidth={1.5}
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      ) : (
        <path
          d="M2.5 20c6.3-1.8 11.8-5.6 17.4-12.2m-6-.6 6.3-.2-.4 6.2"
          fill="none"
          stroke="currentColor"
          strokeWidth={1.5}
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      )}
    </svg>
  );
}

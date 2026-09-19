import Link from "next/link";
import { SITE } from "@/lib/site";
import { Lotus } from "@/components/home/marks";

/*
  The floor of the page.

  The reference design stops at its closing band, so the footer is drawn to
  belong to it: the same blush ground, the lotus and serif wordmark from the
  header, eyebrow-style column labels in berry, and one line of the
  handwriting. Every link goes somewhere real; the Resources column carries
  the id the header's "Resources" link points at.
*/

const EXPLORE = [
  { label: "Programs", href: "/#programs" },
  { label: "Our mission", href: "/#community" },
  { label: "About", href: "/about" },
  { label: "Contact", href: "/contact" },
] as const;

const RESOURCES = [
  { label: "Privacy", href: "/privacy" },
  { label: "Terms", href: "/terms" },
  { label: "Write to us", href: "/contact" },
] as const;

const MEMBERS = [
  { label: "Get Started", href: SITE.signup },
  { label: "Sign In", href: SITE.signin },
  { label: "Open the app", href: SITE.app },
] as const;

export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="ws ws-footer" id="resources">
      <div className="ws-footer-in">
        <div className="ws-footer-grid">
          <div className="ws-footer-brand">
            <Link href="/" className="ws-brand" aria-label={`${SITE.name} home`}>
              <Lotus className="ws-lotus" />
              <span className="ws-brand-text">
                <span className="ws-wordmark">{SITE.name}</span>
                <span className="ws-tagline">Stronger women. Brighter tomorrows.</span>
              </span>
            </Link>
            <p className="ws-footer-about">
              A supportive platform for women — learn a skill, find work that respects you, and
              grow beside women who have done it before.
            </p>
            <p className="ws-footer-script" aria-hidden>
              Stronger Together ♡
            </p>
          </div>

          <FooterColumn title="Explore" links={EXPLORE} />
          <FooterColumn title="Resources" links={RESOURCES} />
          <FooterColumn title="Members" links={MEMBERS} />
        </div>

        <div className="ws-footer-bottom">
          <p>
            © {year} {SITE.name}. All rights reserved.
          </p>
          <p>{SITE.name} is not a bank and never holds member funds.</p>
        </div>
      </div>
    </footer>
  );
}

function FooterColumn({
  title,
  links,
}: {
  title: string;
  links: readonly { readonly label: string; readonly href: string }[];
}) {
  return (
    <div>
      <h2>{title}</h2>
      <ul>
        {links.map((link) => (
          <li key={link.label}>
            {link.href.startsWith("http") ? (
              <a href={link.href}>{link.label}</a>
            ) : (
              <Link href={link.href}>{link.label}</Link>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default Footer;

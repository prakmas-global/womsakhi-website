import Link from "next/link";
import type { Metadata } from "next";
import { SiteFooter } from "@/components/MarketingPage";
import { SiteHeader } from "@/components/SiteHeader";

export const metadata: Metadata = { title: "Page not found", robots: { index: false, follow: true } };

export default function NotFound() {
  return (
    <div className="marketingSite marketingPage-notfound">
      <SiteHeader />
      <main id="main">
        <section className="notFound">
          <p className="eyebrow berry">THIS PAGE MOVED, OR NEVER EXISTED</p>
          <h1>That is a dead end. <em>Here is a way on.</em></h1>
          <p>The page you asked for is not here. These are the places most people are looking for.</p>
          <div className="notFoundLinks">
            <Link href="/"><b>Home</b><span>Start at the beginning</span></Link>
            <Link href="/programs"><b>Programs</b><span>Learning, work and earning paths</span></Link>
            <Link href="/community"><b>Community</b><span>Circles, events and support</span></Link>
            <Link href="/contact"><b>Contact</b><span>Ask us directly</span></Link>
          </div>
        </section>
      </main>
      <SiteFooter />
    </div>
  );
}

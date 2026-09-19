import type { Metadata, Viewport } from "next";
import { Frank_Ruhl_Libre, Inter, PT_Serif, Vujahday_Script } from "next/font/google";
import "./globals.css";
import "./site.css";
import { SITE } from "@/lib/site";
import { SmoothScroll } from "@/components/SmoothScroll";

/*
  Four faces, each matched to the owner's reference design by rendering the
  candidates beside it and comparing glyph shapes, not by name.

  Frank Ruhl Libre is the display serif (headlines, numbers, the wordmark): of
  forty Google serifs it overlapped the reference headline most closely.
  It has no italic, so the one italic word in the hero ("Stronger") is set in
  PT Serif Italic, whose wide round italic is the nearest match to the
  reference's. Vujahday Script is the handwriting ("Learn / Grow / Achieve /
  Together"), and Inter carries everything that has to be read.
*/
const display = Frank_Ruhl_Libre({
  subsets: ["latin"],
  variable: "--font-display",
  display: "swap",
});

const accent = PT_Serif({
  subsets: ["latin"],
  weight: "400",
  style: "italic",
  variable: "--font-accent",
  display: "swap",
});

const script = Vujahday_Script({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-script",
  display: "swap",
});

const sans = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE.url),
  title: {
    default: `${SITE.name} — a livelihood platform built for women`,
    template: `%s · ${SITE.name}`,
  },
  description: SITE.description,
  openGraph: {
    title: `${SITE.name} — a livelihood platform built for women`,
    description: SITE.description,
    url: SITE.url,
    siteName: SITE.name,
    locale: "en_IN",
    type: "website",
  },
  twitter: { card: "summary_large_image", title: SITE.name, description: SITE.description },
  robots: { index: true, follow: true },
};

export const viewport: Viewport = {
  themeColor: "#901f4d",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${display.variable} ${accent.variable} ${script.variable} ${sans.variable}`}>
      <body>
        {/* Before anything else in the DOM, so a keyboard reaches it first. */}
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:rounded-full focus:bg-brand-700 focus:px-5 focus:py-3 focus:text-white"
        >
          Skip to content
        </a>
        <SmoothScroll />
        {children}
      </body>
    </html>
  );
}

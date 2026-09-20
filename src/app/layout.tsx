import type { Metadata, Viewport } from "next";
import { Caveat, DM_Sans, Playfair_Display } from "next/font/google";
import { BrandSplash } from "@/components/BrandSplash";
import "./globals.css";

const sans = DM_Sans({ subsets: ["latin"], variable: "--font-sans", display: "swap" });
const serif = Playfair_Display({ subsets: ["latin"], variable: "--font-serif", display: "swap" });
const script = Caveat({ subsets: ["latin"], variable: "--font-script", display: "swap" });

const SITE = process.env.NEXT_PUBLIC_SITE_URL || "https://www.womsakhi.com";

export const metadata: Metadata = {
  metadataBase: new URL(SITE),
  title: {
    default: "WomSakhi | Stronger Women. Brighter Tomorrows.",
    template: "%s | WomSakhi",
  },
  description:
    "WomSakhi brings practical learning, trusted work opportunities, earning tools, wellbeing support and women-led community into one place built for real life.",
  applicationName: "WomSakhi",
  keywords: ["women", "learning", "careers", "income", "wellbeing", "community", "India"],
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    siteName: "WomSakhi",
    url: SITE,
    title: "WomSakhi | Stronger Women. Brighter Tomorrows.",
    description:
      "Learn, work, earn and belong. One practical place for the many parts of a woman's life.",
    images: [{ url: "/assets/womsakhi-lockup.png", width: 1254, height: 1254, alt: "WomSakhi" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "WomSakhi | Stronger Women. Brighter Tomorrows.",
    description:
      "Learn, work, earn and belong. One practical place for the many parts of a woman's life.",
    images: ["/assets/womsakhi-lockup.png"],
  },
  robots: { index: true, follow: true },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#fcf8f6" },
    { media: "(prefers-color-scheme: dark)", color: "#140c12" },
  ],
  colorScheme: "light dark",
};

/**
 * Runs before first paint, so a visitor who chose a theme never sees the other
 * one flash and a returning visitor never sees the splash at all. Anyone who
 * has not chosen a theme falls through to the `prefers-color-scheme` block in
 * theme.css.
 */
const bootScript = `(function(){var r=document.documentElement;
try{var t=localStorage.getItem("womsakhi-theme");if(t==="dark"||t==="light"){r.setAttribute("data-theme",t)}}catch(e){}
try{var reduced=window.matchMedia("(prefers-reduced-motion: reduce)").matches;
if(reduced||sessionStorage.getItem("womsakhi-splash-seen")==="1"){r.setAttribute("data-splash","skip")}
else{sessionStorage.setItem("womsakhi-splash-seen","1")}}catch(e){r.setAttribute("data-splash","skip")}})();`;

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: bootScript }} />
      </head>
      <body className={`${sans.variable} ${serif.variable} ${script.variable}`}>
        <a className="skipLink" href="#main">Skip to main content</a>
        <BrandSplash />
        {children}
      </body>
    </html>
  );
}

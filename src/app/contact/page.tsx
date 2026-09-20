import type { Metadata } from "next";
import { ContactPage } from "@/components/MarketingPage";

export const metadata: Metadata = {
  title: "Talk to WomSakhi",
  description:
    "Product questions, partnership ideas, press or feedback — and the quickest route to account help or urgent support.",
  alternates: { canonical: "/contact" },
  openGraph: { title: "Talk to WomSakhi | WomSakhi", description: "Product questions, partnership ideas, press or feedback — and the quickest route to account help or urgent support.", url: "/contact" },
};

export default ContactPage;

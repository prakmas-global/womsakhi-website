import Nav from "@/components/Nav";
import Hero from "@/components/sections/Hero";
import Pillars from "@/components/sections/Pillars";
import HowItWorks from "@/components/sections/HowItWorks";
import Promises from "@/components/sections/Promises";
import FinalCta from "@/components/sections/FinalCta";
import Footer from "@/components/Footer";

/**
 * The website.
 *
 * The order is an argument, not a template: what this is (Hero), what you can
 * actually do here (Pillars), how it works in practice (HowItWorks), what we
 * will and will not do with your money and your documents (Promises), and only
 * then the ask (FinalCta). The trust section sits before the call to action
 * deliberately — this platform asks women to upload identity documents, and
 * answering that before asking for a signup is the whole difference between an
 * invitation and a pitch.
 */
export default function Home() {
  return (
    <>
      <Nav />
      <main id="main">
        <Hero />
        <Pillars />
        <HowItWorks />
        <Promises />
        <FinalCta />
      </main>
      <Footer />
    </>
  );
}

import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import Hero from "@/components/home/Hero";
import Mission from "@/components/home/Mission";
import Offer from "@/components/home/Offer";
import ClosingBand from "@/components/home/ClosingBand";

/**
 * The home page, built to the owner's reference design section by section:
 * hero with the stats band overlapping its foot, the mission, what we offer,
 * and the closing band. The header and footer are the site-wide ones.
 *
 * The header is sticky, so it has to be a sibling of the page rather than a
 * child of the hero's wrapper (a sticky element only sticks inside its own
 * parent). The hero's blush ground is pulled up underneath it instead.
 */
export default function Home() {
  return (
    <>
      <Nav />
      <main id="main">
        <div className="ws ws-top ws-under-header">
          <Hero />
        </div>
        <div className="ws ws-mid">
          <Mission />
          <Offer />
        </div>
        <ClosingBand />
      </main>
      <Footer />
    </>
  );
}

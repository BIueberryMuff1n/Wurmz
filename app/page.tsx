import Hero from "@/components/Hero";
import BrandSection from "@/components/BrandSection";
import GrowSection from "@/components/GrowSection";
import CountdownSection from "@/components/CountdownSection";
import SignupSection from "@/components/SignupSection";
import Footer from "@/components/Footer";
import UndergroundJourney from "@/components/UndergroundJourney";
import WormTunnel from "@/components/WormTunnel";
import SurfaceScene from "@/components/SurfaceScene";
import ParachuteWorm from "@/components/ParachuteWorm";
import WormPit from "@/components/WormPit";

export default function Home() {
  return (
    <>
      <UndergroundJourney />
      <SurfaceScene />
      <ParachuteWorm />
      <WormTunnel />
      <WormPit />
      <main className="relative z-20">
        <Hero />
        <BrandSection />
        <GrowSection />
        <CountdownSection />
        <SignupSection />
      </main>
      <Footer />
    </>
  );
}

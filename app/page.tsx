import Hero from "@/components/Hero";
import BrandSection from "@/components/BrandSection";
import GrowSection from "@/components/GrowSection";
import ProcessSection from "@/components/ProcessSection";
import PhilosophySection from "@/components/PhilosophySection";
import CountdownSection from "@/components/CountdownSection";
import SignupSection from "@/components/SignupSection";
import Footer from "@/components/Footer";
import UndergroundJourney from "@/components/UndergroundJourney";
import WormTunnel from "@/components/WormTunnel";
import SurfaceScene from "@/components/SurfaceScene";
import ParachuteWorm from "@/components/ParachuteWorm";
import WormPit from "@/components/WormPit";
import BuriedArtifacts from "@/components/BuriedArtifacts";
import SoilBiology from "@/components/SoilBiology";
import PlaneIntroWrapper from "@/components/PlaneIntroWrapper";
import EasterEggs from "@/components/EasterEggs";
import CinematicMode from "@/components/CinematicMode";

export default function Home() {
  return (
    <>
      <EasterEggs />
      <UndergroundJourney />
      <SurfaceScene />
      <PlaneIntroWrapper />
      <ParachuteWorm />
      <WormTunnel />
      <BuriedArtifacts />
      <SoilBiology />
      <WormPit />
      <main className="relative z-20">
        <Hero />
        <BrandSection />
        <GrowSection />
        <ProcessSection />
        <PhilosophySection />
        <CountdownSection />
        <SignupSection />
      </main>
      <Footer />
      <CinematicMode />
    </>
  );
}

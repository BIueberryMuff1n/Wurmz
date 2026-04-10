import Hero from "@/components/Hero";
import BrandSection from "@/components/BrandSection";
import GrowSection from "@/components/GrowSection";
import CountdownSection from "@/components/CountdownSection";
import SignupSection from "@/components/SignupSection";
import Footer from "@/components/Footer";
import UndergroundJourney from "@/components/UndergroundJourney";
import WormTunnel from "@/components/WormTunnel";
import SurfaceScene from "@/components/SurfaceScene";
import OrganicDivider from "@/components/OrganicDivider";

export default function Home() {
  return (
    <>
      <UndergroundJourney />
      <SurfaceScene />
      <WormTunnel />
      <main className="relative z-20">
        <Hero />
        <OrganicDivider color="#1E1710" />
        <BrandSection />
        <OrganicDivider color="#1E1710" flip />
        <GrowSection />
        <OrganicDivider color="#1E1710" />
        <CountdownSection />
        <OrganicDivider color="#1E1710" flip />
        <SignupSection />
      </main>
      <Footer />
    </>
  );
}

import Hero from "@/components/Hero";
import BrandSection from "@/components/BrandSection";
import GrowSection from "@/components/GrowSection";
import CountdownSection from "@/components/CountdownSection";
import SignupSection from "@/components/SignupSection";
import Footer from "@/components/Footer";
import FloatingParticles from "@/components/FloatingParticles";
import RootTendrils from "@/components/RootTendrils";
import AuraEffect from "@/components/AuraEffect";
import MyceliumNetwork from "@/components/MyceliumNetwork";
import WormCursor from "@/components/WormCursor";
import DepthGradient from "@/components/DepthGradient";
import OrganicDivider from "@/components/OrganicDivider";

export default function Home() {
  return (
    <>
      <DepthGradient />
      <AuraEffect />
      <MyceliumNetwork />
      <RootTendrils />
      <FloatingParticles />
      <WormCursor />
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

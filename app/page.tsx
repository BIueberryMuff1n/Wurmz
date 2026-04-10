import Hero from "@/components/Hero";
import BrandSection from "@/components/BrandSection";
import GrowSection from "@/components/GrowSection";
import CountdownSection from "@/components/CountdownSection";
import SignupSection from "@/components/SignupSection";
import Footer from "@/components/Footer";
import FloatingParticles from "@/components/FloatingParticles";
import RootTendrils from "@/components/RootTendrils";

export default function Home() {
  return (
    <>
      <RootTendrils />
      <FloatingParticles />
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

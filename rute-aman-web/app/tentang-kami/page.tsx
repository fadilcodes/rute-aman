import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import HeroSection from '@/components/sections/HeroSection';
import VisionMissionSection from '@/components/sections/VisionMissionSection';
import ValuesSection from '@/components/sections/ValuesSection';
import ImpactSection from '@/components/sections/ImpactSection';
import CTASection from '@/components/sections/CTASection';

export default function TentangKami() {
  return (
    <div className="min-h-screen bg-[#F8FAFC] font-sans flex flex-col">
      <Navbar />
      
      <main className="grow max-w-5xl mx-auto w-full px-6 py-10 space-y-20">
        <HeroSection />
        <VisionMissionSection />
        <ValuesSection />
        <ImpactSection />
        <CTASection />
      </main>

      <Footer />
    </div>
  );
}
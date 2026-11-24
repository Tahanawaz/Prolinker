import { CategoriesSection } from '@/components/home/CategoriesSection';
import { FaqSection } from '@/components/home/FaqSection';
import { FeaturesSection } from '@/components/home/FeaturesSection';
import { Hero } from '@/components/home/Hero';
import { HowItWorks } from '@/components/home/HowItWorks';
import { StatsStrip } from '@/components/home/StatsStrip';
import { TevtaSection } from '@/components/home/TevtaSection';
import { Testimonials } from '@/components/home/Testimonials';
import { WorkersSection } from '@/components/home/WorkersSection';

export default function HomePage() {
  return (
    <>
      <Hero />
      <StatsStrip />
      <CategoriesSection />
      <HowItWorks />
      <FeaturesSection />
      <WorkersSection />
      <TevtaSection />
      <Testimonials />
      <FaqSection />
    </>
  );
}

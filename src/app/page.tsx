import { Hero } from "@/components/home/Hero";
import { ValueStrip } from "@/components/home/ValueStrip";
import { CategoryGrid } from "@/components/home/CategoryGrid";
import { FeaturedExperts } from "@/components/home/FeaturedExperts";
import { HowItWorks } from "@/components/home/HowItWorks";
import { Testimonials } from "@/components/home/Testimonials";
import { CtaBand } from "@/components/home/CtaBand";

export default function HomePage() {
  return (
    <>
      <Hero />
      <ValueStrip />
      <CategoryGrid />
      <FeaturedExperts />
      <HowItWorks />
      <Testimonials />
      <CtaBand />
    </>
  );
}

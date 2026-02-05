import {
  CtaSection,
  FeaturesSection,
  HeroSection,
  HowItWorksSection,
  LandingFooter,
  LandingHeader,
  TestimonialsSection,
} from "@/components/home";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "SaaS Recipes — Ship your SaaS faster with proven patterns",
  description:
    "Learn from real-world SaaS patterns and a production-ready dashboard. Next.js, Tailwind, TypeScript. Copy what you need and ship in weeks, not months.",
};

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col">
      <LandingHeader />
      <main>
        <HeroSection />
        <FeaturesSection />
        <HowItWorksSection />
        <TestimonialsSection />
        <CtaSection />
      </main>
      <LandingFooter />
    </div>
  );
}

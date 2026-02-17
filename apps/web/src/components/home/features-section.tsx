"use client";

import { BookOpen, Globe, Lock, Shield, Sparkles, TrendingUp } from "lucide-react";
import type { LucideIcon } from "lucide-react";

import { FeatureCard } from "./feature-card";
import { FeaturesSectionHeader } from "./features-section-header";

type Feature = {
  icon: LucideIcon;
  title: string;
  description: string;
  bullets: readonly [string, string];
};

const features: readonly Feature[] = [
  {
    icon: Sparkles,
    title: "See any codebase in minutes",
    description: "Get a clear map of structure, architecture, and complexity before you write a line.",
    bullets: ["Visualize modules and ownership", "Catch risky hotspots early"],
  },
  {
    icon: BookOpen,
    title: "Copy proven product recipes",
    description: "Learn directly from high-quality SaaS repos and reuse patterns that already ship.",
    bullets: ["Compare real-world tradeoffs", "Reuse battle-tested workflows"],
  },
  {
    icon: Shield,
    title: "Latest auth, billing, and security",
    description: "Skip boilerplate with production-grade implementations your team can trust.",
    bullets: ["Reference secure auth flows", "Adopt robust billing setups"],
  },
  {
    icon: TrendingUp,
    title: "Choose tools with real momentum",
    description: "Track adoption signals across active teams so you invest in stacks that last.",
    bullets: ["Track usage trends over time", "Validate stack bets sooner"],
  },
  {
    icon: Globe,
    title: "Build for every product surface",
    description: "From web apps to bots and self-hosted products, find patterns that fit your roadmap.",
    bullets: ["Filter by product type", "Find launch-ready examples"],
  },
  {
    icon: Lock,
    title: "Stay type-safe as you scale",
    description: "Use strict TypeScript patterns to ship faster, reduce regressions, and refactor safely.",
    bullets: ["Follow strict typing patterns", "Refactor with safer contracts"],
  },
];

export function FeaturesSection() {
  return (
    <section
      id="features"
      className="relative border-t bg-muted/30 py-20 md:py-28"
      aria-labelledby="features-heading"
    >
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_70%_50%_at_50%_100%,var(--primary)/8%,transparent_70%)]" />
      <div className="container px-4 mx-auto">
        <FeaturesSectionHeader />
        <div className="mx-auto grid max-w-5xl gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {features.map(({ icon: Icon, title, description, bullets }, index) => (
            <FeatureCard
              key={title}
              icon={Icon}
              title={title}
              description={description}
              bullets={bullets}
              index={index}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

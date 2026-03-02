"use client";

import { BookOpen, Globe, Lock, Shield, Sparkles, TrendingUp } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { useI18n } from "@/hooks/use-i18n";

import { FeatureCard } from "./feature-card";
import { FeaturesSectionHeader } from "./features-section-header";

type Feature = {
  icon: LucideIcon;
  titleKey: string;
  descriptionKey: string;
  bullets: readonly [string, string];
};

const features: readonly Feature[] = [
  {
    icon: Sparkles,
    titleKey: "features.items.analysis.title",
    descriptionKey: "features.items.analysis.description",
    bullets: [
      "features.items.analysis.bullets.modules",
      "features.items.analysis.bullets.hotspots",
    ],
  },
  {
    icon: BookOpen,
    titleKey: "features.items.recipes.title",
    descriptionKey: "features.items.recipes.description",
    bullets: [
      "features.items.recipes.bullets.tradeoffs",
      "features.items.recipes.bullets.workflows",
    ],
  },
  {
    icon: Shield,
    titleKey: "features.items.security.title",
    descriptionKey: "features.items.security.description",
    bullets: [
      "features.items.security.bullets.auth",
      "features.items.security.bullets.billing",
    ],
  },
  {
    icon: TrendingUp,
    titleKey: "features.items.momentum.title",
    descriptionKey: "features.items.momentum.description",
    bullets: [
      "features.items.momentum.bullets.trends",
      "features.items.momentum.bullets.validate",
    ],
  },
  {
    icon: Globe,
    titleKey: "features.items.surface.title",
    descriptionKey: "features.items.surface.description",
    bullets: [
      "features.items.surface.bullets.filter",
      "features.items.surface.bullets.launch",
    ],
  },
  {
    icon: Lock,
    titleKey: "features.items.typesafe.title",
    descriptionKey: "features.items.typesafe.description",
    bullets: [
      "features.items.typesafe.bullets.typing",
      "features.items.typesafe.bullets.contracts",
    ],
  },
];

export function FeaturesSection() {
  const { t } = useI18n();

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
          {features.map(({ icon: Icon, titleKey, descriptionKey, bullets }, index) => (
            <FeatureCard
              key={titleKey}
              icon={Icon}
              title={t(titleKey)}
              description={t(descriptionKey)}
              bullets={[t(bullets[0]), t(bullets[1])]}
              index={index}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

"use client";

import { BookOpen, Globe, Lock, Shield, Sparkles, TrendingUp } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import type { ReactNode } from "react";
import { useI18n } from "@/hooks/use-i18n";
import { FeaturesSectionHeader } from "./features-section-header";

type Feature = {
  icon: LucideIcon;
  titleKey: string;
  descriptionKey: string;
  bullets: readonly [string, string];
};

const featureMap = {
  analysis: {
    icon: Sparkles,
    titleKey: "features.items.analysis.title",
    descriptionKey: "features.items.analysis.description",
    bullets: [
      "features.items.analysis.bullets.modules",
      "features.items.analysis.bullets.hotspots",
    ],
  },
  recipes: {
    icon: BookOpen,
    titleKey: "features.items.recipes.title",
    descriptionKey: "features.items.recipes.description",
    bullets: [
      "features.items.recipes.bullets.tradeoffs",
      "features.items.recipes.bullets.workflows",
    ],
  },
  security: {
    icon: Shield,
    titleKey: "features.items.security.title",
    descriptionKey: "features.items.security.description",
    bullets: [
      "features.items.security.bullets.auth",
      "features.items.security.bullets.billing",
    ],
  },
  momentum: {
    icon: TrendingUp,
    titleKey: "features.items.momentum.title",
    descriptionKey: "features.items.momentum.description",
    bullets: [
      "features.items.momentum.bullets.trends",
      "features.items.momentum.bullets.validate",
    ],
  },
  surface: {
    icon: Globe,
    titleKey: "features.items.surface.title",
    descriptionKey: "features.items.surface.description",
    bullets: [
      "features.items.surface.bullets.filter",
      "features.items.surface.bullets.launch",
    ],
  },
  typesafe: {
    icon: Lock,
    titleKey: "features.items.typesafe.title",
    descriptionKey: "features.items.typesafe.description",
    bullets: [
      "features.items.typesafe.bullets.typing",
      "features.items.typesafe.bullets.contracts",
    ],
  },
} as const satisfies Record<string, Feature>;

type BentoCardProps = {
  feature: Feature;
  title: string;
  description: string;
  bullets: readonly [string, string];
  className?: string;
  children?: ReactNode;
};

function BentoCard({
  feature,
  title,
  description,
  bullets,
  className,
  children,
}: BentoCardProps) {
  const Icon = feature.icon;

  return (
    <article
      className={`group relative overflow-hidden rounded-md border border-border/70 bg-card/95 p-5 shadow-sm transition-all duration-300 hover:border-primary/30 hover:shadow-lg hover:shadow-primary/10 ${className ?? ""}`}
    >
      <div className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(100%_100%_at_100%_0%,hsl(var(--primary)/0.14),transparent_60%)] opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
      <div className="mb-4 flex items-center gap-3">
        <span className="inline-flex h-8 w-8 items-center justify-center rounded-md border border-primary/20 bg-primary/10 text-primary">
          <Icon className="h-4 w-4" aria-hidden />
        </span>
        <div className="h-px flex-1 bg-border/70" />
      </div>
      <h3 className="text-base font-semibold tracking-tight">{title}</h3>
      <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{description}</p>
      {/* <div className="mt-4 flex flex-wrap gap-2">
        <span className="rounded-md border border-border/80 bg-muted/40 px-2.5 py-1 text-xs text-foreground/90">
          {bullets[0]}
        </span>
        <span className="rounded-md border border-border/80 bg-muted/40 px-2.5 py-1 text-xs text-foreground/90">
          {bullets[1]}
        </span>
      </div> */}
      {children}
    </article>
  );
}

/**
 * Render a bento-style feature grid inspired by modern AI feature layouts.
 *
 * @returns A responsive home-page section that highlights core product capabilities.
 */
export function FeaturesSection() {
  const { t } = useI18n();

  const analysis = featureMap.analysis;
  const recipes = featureMap.recipes;
  const security = featureMap.security;
  const momentum = featureMap.momentum;
  const surface = featureMap.surface;
  const typesafe = featureMap.typesafe;

  return (
    <section
      id="features"
      className="relative border-t bg-muted/30 py-20 md:py-28"
      aria-labelledby="features-heading"
    >
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_70%_50%_at_50%_100%,var(--primary)/8%,transparent_70%)]" />
      <div className="container mx-auto px-4">
        <FeaturesSectionHeader />

        <div className="mx-auto grid max-w-6xl gap-3 md:grid-cols-2 lg:grid-cols-4">
          <BentoCard
            feature={analysis}
            title={t(analysis.titleKey)}
            description={t(analysis.descriptionKey)}
            bullets={[t(analysis.bullets[0]), t(analysis.bullets[1])]}
            className="md:col-span-2 lg:col-span-2"
          >
            <div className="mt-5 grid gap-2 sm:grid-cols-3">
              <div className="rounded-md border border-border/70 bg-background/70 p-3 sm:col-span-2">
                <p className="text-[11px] font-medium uppercase tracking-wide text-muted-foreground">
                  {t(analysis.bullets[0])}
                </p>
                <div className="mt-2 space-y-2">
                  <div className="h-1.5 rounded-full bg-muted">
                    <div className="h-full w-[82%] rounded-full bg-primary/70" />
                  </div>
                  <div className="h-1.5 rounded-full bg-muted">
                    <div className="h-full w-[67%] rounded-full bg-primary/60" />
                  </div>
                  <div className="h-1.5 rounded-full bg-muted">
                    <div className="h-full w-[74%] rounded-full bg-primary/50" />
                  </div>
                </div>
              </div>
              <div className="rounded-md border border-border/70 bg-background/70 p-3 sm:col-span-1">
                <p className="text-[11px] font-medium uppercase tracking-wide text-muted-foreground">
                  {t(analysis.bullets[1])}
                </p>
                <p className="mt-2 text-2xl font-semibold tracking-tight">92%</p>
                <p className="text-xs text-muted-foreground">{t(analysis.titleKey)}</p>
              </div>
            </div>
            <div className="mt-3 flex flex-wrap gap-1.5 text-[11px]">
              {["Solo dev", "Students", "Startup teams", "Engineering orgs"].map(
                (audience) => (
                  <span
                    key={audience}
                    className="rounded-md border border-border/70 bg-muted/35 px-2 py-1 text-foreground/85"
                  >
                    {audience}
                  </span>
                ),
              )}
            </div>
          </BentoCard>

          <BentoCard
            feature={recipes}
            title={t(recipes.titleKey)}
            description={t(recipes.descriptionKey)}
            bullets={[t(recipes.bullets[0]), t(recipes.bullets[1])]}
            className="md:col-span-2 lg:col-span-2"
          >
            <div className="mt-5 rounded-md border border-border/70 bg-background/75 p-3">
              <div className="flex flex-wrap gap-2 text-xs">
                {[
                  t(recipes.bullets[0]),
                  t(recipes.bullets[1]),
                  t(security.bullets[0]),
                  t(surface.bullets[0]),
                  t(typesafe.bullets[0]),
                  t(momentum.bullets[0]),
                ].map((tag, index) => (
                  <span
                    key={`${tag}-${index}`}
                    className="rounded-md border border-border/80 bg-muted/35 px-2 py-1 text-foreground/85"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          </BentoCard>

          <BentoCard
            feature={momentum}
            title={t(momentum.titleKey)}
            description={t(momentum.descriptionKey)}
            bullets={[t(momentum.bullets[0]), t(momentum.bullets[1])]}
          >
            <div className="mt-5 rounded-md border border-border/70 bg-background/75 p-3">
              <div className="grid grid-cols-6 items-end gap-1">
                {[24, 34, 42, 38, 56, 68].map((height, index) => (
                  <div
                    key={`momentum-bar-${height}-${index}`}
                    className="rounded-sm bg-primary/70"
                    style={{ height }}
                  />
                ))}
              </div>
            </div>
          </BentoCard>

          <BentoCard
            feature={security}
            title={t(security.titleKey)}
            description={t(security.descriptionKey)}
            bullets={[t(security.bullets[0]), t(security.bullets[1])]}
          >
            <div className="mt-5 space-y-2 rounded-md border border-border/70 bg-background/75 p-3 text-xs">
              <p className="rounded-md border border-border/70 bg-muted/45 px-2 py-1">
                {t(security.bullets[0])}
              </p>
              <p className="rounded-md border border-border/70 bg-muted/45 px-2 py-1">
                {t(security.bullets[1])}
              </p>
              <p className="rounded-md border border-border/70 bg-muted/45 px-2 py-1">
                {t(security.titleKey)}
              </p>
            </div>
          </BentoCard>

          <BentoCard
            feature={surface}
            title={t(surface.titleKey)}
            description={t(surface.descriptionKey)}
            bullets={[t(surface.bullets[0]), t(surface.bullets[1])]}
          >
            <div className="mt-5 rounded-md border border-border/70 bg-background/75 p-3">
              <div className="grid grid-cols-3 gap-1.5 text-[11px] font-medium">
                <span className="rounded-md border border-primary/35 bg-primary/10 px-2 py-1 text-primary">
                  {t(surface.bullets[0])}
                </span>
                <span className="rounded-md border border-border/80 bg-muted/40 px-2 py-1 text-muted-foreground">
                  {t(surface.bullets[1])}
                </span>
                <span className="rounded-md border border-border/80 bg-muted/40 px-2 py-1 text-muted-foreground">
                  {t(surface.titleKey)}
                </span>
              </div>
            </div>
          </BentoCard>

          <BentoCard
            feature={typesafe}
            title={t(typesafe.titleKey)}
            description={t(typesafe.descriptionKey)}
            bullets={[t(typesafe.bullets[0]), t(typesafe.bullets[1])]}
          >
            <div className="mt-5 rounded-md border border-border/70 bg-background/80 p-3 font-mono text-[11px] leading-relaxed text-foreground/85">
              <p>
                <span className="text-primary">type</span> Stack = {"{"}
              </p>
              <p className="pl-3">auth: "strict";</p>
              <p className="pl-3">billing: "typed";</p>
              <p className="pl-3">contracts: "safe";</p>
              <p>{"}"}</p>
            </div>
          </BentoCard>
        </div>
      </div>
    </section>
  );
}

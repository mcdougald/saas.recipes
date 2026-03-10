"use client";

import {
  BarChart3,
  GraduationCap,
  Lock,
  type LucideIcon,
  Shield,
  Sparkles,
  TrendingUp,
} from "lucide-react";
import {
  type ComponentPropsWithoutRef,
  type ReactNode,
  useEffect,
  useRef,
  useState,
} from "react";

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
    icon: GraduationCap,
    titleKey: "features.items.recipes.title",
    descriptionKey: "features.items.recipes.description",
    bullets: [
      "features.items.recipes.bullets.academy",
      "features.items.recipes.bullets.caseStudies",
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
    icon: BarChart3,
    titleKey: "features.items.surface.title",
    descriptionKey: "features.items.surface.description",
    bullets: [
      "features.items.surface.bullets.contributors",
      "features.items.surface.bullets.bots",
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

const ANALYSIS_IDLE_SCORE = 52;
const ANALYSIS_ACTIVE_SCORE = 92;
const ANALYSIS_IDLE_WIDTHS = [44, 36, 52] as const;
const ANALYSIS_ACTIVE_WIDTHS = [86, 74, 93] as const;
const ANALYSIS_BAR_TONES = [
  "bg-primary/70",
  "bg-primary/60",
  "bg-primary/50",
] as const;
const MOMENTUM_IDLE_HEIGHTS = [24, 34, 42, 38, 56, 68] as const;
const MOMENTUM_ACTIVE_HEIGHTS = [36, 52, 48, 64, 78, 92] as const;
const ACADEMY_TRACKS = [
  {
    stack: "Next.js + Drizzle",
    environment: "Vercel + Postgres",
    completion: 88,
  },
  {
    stack: "Supabase + tRPC",
    environment: "Docker + GitHub Actions",
    completion: 73,
  },
  {
    stack: "Stripe + Better Auth",
    environment: "Edge runtime + Webhooks",
    completion: 91,
  },
] as const;

type BentoCardProps = ComponentPropsWithoutRef<"article"> & {
  feature: Feature;
  title: string;
  description: string;
  className?: string;
  children?: ReactNode;
};

function AnimatedPercentValue({ value }: { value: number }) {
  const [displayValue, setDisplayValue] = useState(value);
  const displayValueRef = useRef(value);

  useEffect(() => {
    displayValueRef.current = displayValue;
  }, [displayValue]);

  useEffect(() => {
    const startValue = displayValueRef.current;
    const durationMs = 550;
    const startTime = performance.now();
    let frameId = 0;

    const tick = (now: number) => {
      const progress = Math.min((now - startTime) / durationMs, 1);
      const easedProgress = 1 - (1 - progress) ** 3;
      const nextValue = Math.round(
        startValue + (value - startValue) * easedProgress,
      );

      setDisplayValue(nextValue);

      if (progress < 1) {
        frameId = requestAnimationFrame(tick);
      }
    };

    frameId = requestAnimationFrame(tick);

    return () => cancelAnimationFrame(frameId);
  }, [value]);

  return (
    <p className="mt-2 text-2xl font-semibold tracking-tight tabular-nums">
      {displayValue}%
    </p>
  );
}

function CompactAnimatedPercentValue({ value }: { value: number }) {
  const [displayValue, setDisplayValue] = useState(value);
  const displayValueRef = useRef(value);

  useEffect(() => {
    displayValueRef.current = displayValue;
  }, [displayValue]);

  useEffect(() => {
    const startValue = displayValueRef.current;
    const durationMs = 420;
    const startTime = performance.now();
    let frameId = 0;

    const tick = (now: number) => {
      const progress = Math.min((now - startTime) / durationMs, 1);
      const easedProgress = 1 - (1 - progress) ** 3;
      const nextValue = Math.round(
        startValue + (value - startValue) * easedProgress,
      );

      setDisplayValue(nextValue);

      if (progress < 1) {
        frameId = requestAnimationFrame(tick);
      }
    };

    frameId = requestAnimationFrame(tick);

    return () => cancelAnimationFrame(frameId);
  }, [value]);

  return <span className="tabular-nums text-primary/90">{displayValue}%</span>;
}

function BentoCard({
  feature,
  title,
  description,
  className,
  children,
  ...props
}: BentoCardProps) {
  const Icon = feature.icon;

  return (
    <article
      className={`group relative overflow-hidden rounded-md border border-border/70 bg-card/95 p-5 shadow-sm transition-all duration-300 hover:border-primary/30 hover:shadow-lg hover:shadow-primary/10 ${className ?? ""}`}
      {...props}
    >
      <div className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(100%_100%_at_100%_0%,hsl(var(--primary)/0.14),transparent_60%)] opacity-0 transition-opacity duration-300 group-hover:opacity-100 group-focus-within:opacity-100" />
      <div className="mb-4 flex items-center gap-3">
        <span className="inline-flex h-8 w-8 items-center justify-center rounded-md border border-primary/20 bg-primary/10 text-primary">
          <Icon className="h-4 w-4" aria-hidden />
        </span>
        <div className="h-px flex-1 bg-border/70" />
      </div>
      <h3 className="text-base font-semibold tracking-tight">{title}</h3>
      <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
        {description}
      </p>
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
  const [isAnalysisActive, setIsAnalysisActive] = useState(false);
  const [isMomentumActive, setIsMomentumActive] = useState(false);
  const [academyTrackOffset, setAcademyTrackOffset] = useState(0);
  const [isAcademyTrackTransitioning, setIsAcademyTrackTransitioning] =
    useState(false);

  const analysis = featureMap.analysis;
  const recipes = featureMap.recipes;
  const security = featureMap.security;
  const momentum = featureMap.momentum;
  const surface = featureMap.surface;
  const typesafe = featureMap.typesafe;
  const analysisWidths = isAnalysisActive
    ? ANALYSIS_ACTIVE_WIDTHS
    : ANALYSIS_IDLE_WIDTHS;
  const analysisScore = isAnalysisActive
    ? ANALYSIS_ACTIVE_SCORE
    : ANALYSIS_IDLE_SCORE;
  const momentumHeights = isMomentumActive
    ? MOMENTUM_ACTIVE_HEIGHTS
    : MOMENTUM_IDLE_HEIGHTS;
  const activeAcademyTracks = [
    ACADEMY_TRACKS[academyTrackOffset],
    ACADEMY_TRACKS[(academyTrackOffset + 1) % ACADEMY_TRACKS.length],
  ] as const;

  useEffect(() => {
    let holdTimeout = 0;
    let swapTimeout = 0;
    let revealTimeout = 0;

    const scheduleRotation = () => {
      holdTimeout = window.setTimeout(() => {
        setIsAcademyTrackTransitioning(true);

        swapTimeout = window.setTimeout(() => {
          setAcademyTrackOffset(
            (previousOffset) => (previousOffset + 1) % ACADEMY_TRACKS.length,
          );
          revealTimeout = window.setTimeout(() => {
            setIsAcademyTrackTransitioning(false);
            scheduleRotation();
          }, 170);
        }, 170);
      }, 2400);
    };

    scheduleRotation();

    return () => {
      window.clearTimeout(holdTimeout);
      window.clearTimeout(swapTimeout);
      window.clearTimeout(revealTimeout);
    };
  }, []);

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
            className="cursor-pointer md:col-span-2 lg:col-span-2"
            tabIndex={0}
            onMouseEnter={() => setIsAnalysisActive(true)}
            onMouseLeave={() => setIsAnalysisActive(false)}
            onFocus={() => setIsAnalysisActive(true)}
            onBlur={() => setIsAnalysisActive(false)}
          >
            <div className="mt-5 grid gap-2 sm:grid-cols-3">
              <div className="rounded-md border border-border/70 bg-background/70 p-3 sm:col-span-2">
                <div className="flex items-center justify-between gap-2">
                  <p className="text-[11px] font-medium uppercase tracking-wide text-muted-foreground">
                    {t(analysis.bullets[0])}
                  </p>
                  <span className="rounded-full border border-primary/20 bg-primary/8 px-2 py-0.5 text-[10px] font-medium uppercase tracking-[0.16em] text-primary/80">
                    {isAnalysisActive ? "Live scan" : "Hover preview"}
                  </span>
                </div>
                <div className="mt-2 space-y-2">
                  {analysisWidths.map((width, index) => (
                    <div
                      key={`analysis-bar-${index}`}
                      className="h-1.5 rounded-full bg-muted"
                    >
                      <div
                        className={`h-full rounded-full transition-[width] ease-out ${ANALYSIS_BAR_TONES[index]}`}
                        style={{
                          width: `${width}%`,
                          transitionDuration: `${360 + index * 90}ms`,
                        }}
                      />
                    </div>
                  ))}
                </div>
              </div>
              <div className="rounded-md border border-border/70 bg-background/70 p-3 sm:col-span-1">
                <p className="text-[11px] font-medium uppercase tracking-wide text-muted-foreground">
                  {t(analysis.bullets[1])}
                </p>
                <AnimatedPercentValue value={analysisScore} />
                <p className="text-xs text-muted-foreground">
                  {isAnalysisActive
                    ? "Weighted repository fit"
                    : t(analysis.titleKey)}
                </p>
              </div>
            </div>
            <div className="mt-3 flex flex-wrap gap-1.5 text-[11px]">
              {[
                "Solo dev",
                "Students",
                "Startup teams",
                "Engineering orgs",
              ].map((audience) => (
                <span
                  key={audience}
                  className="rounded-md border border-border/70 bg-muted/35 px-2 py-1 text-foreground/85"
                >
                  {audience}
                </span>
              ))}
            </div>
          </BentoCard>

          <BentoCard
            feature={recipes}
            title={t(recipes.titleKey)}
            description={t(recipes.descriptionKey)}
            className="cursor-pointer md:col-span-2 lg:col-span-2"
            tabIndex={0}
          >
            <div className="mt-4 rounded-md border border-border/70 bg-background/80 p-2.5">
              <div className="flex flex-wrap items-center gap-1.5 text-[10px] font-medium">
                {[
                  t(recipes.bullets[0]),
                  t(recipes.bullets[1]),
                  "AI Snippets",
                ].map((badge, index) => (
                  <span
                    key={badge}
                    className={`rounded-md border px-2 py-0.5 transition-all duration-300 ease-out ${
                      index === 0
                        ? "border-primary/35 bg-primary/10 text-primary"
                        : "border-border/80 bg-muted/45 text-foreground/85 group-hover:border-primary/25 group-hover:bg-primary/10 group-focus-within:border-primary/25 group-focus-within:bg-primary/10"
                    }`}
                  >
                    {badge}
                  </span>
                ))}
              </div>
              <div className="mt-2 max-h-[100px] overflow-hidden rounded-md border border-border/70 bg-background/70 p-2">
                <div className="grid gap-2 md:grid-cols-[1.3fr_1fr]">
                  <div className="space-y-1">
                    <p className="text-[9px] font-medium uppercase tracking-wide text-muted-foreground">
                      Learning tracks
                    </p>
                    {activeAcademyTracks.map((track, index) => (
                      <div
                        key={`academy-track-${index}`}
                        className="rounded-md bg-muted/35 px-1.5 py-1"
                      >
                        <div className="flex items-center justify-between gap-2 text-[10px]">
                          <p
                            className={`truncate font-medium text-foreground transition-opacity duration-150 ${
                              isAcademyTrackTransitioning
                                ? "opacity-0"
                                : "opacity-100"
                            }`}
                          >
                            {track.stack}
                          </p>
                          <CompactAnimatedPercentValue
                            value={track.completion}
                          />
                        </div>
                        <div className="mt-1 h-1 rounded-full bg-muted">
                          <div
                            className="h-full rounded-full bg-primary/70 transition-[width] duration-500 ease-out"
                            style={{ width: `${track.completion}%` }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="space-y-1 rounded-md border border-border/70 bg-muted/25 p-1.5">
                    <p className="text-[9px] font-medium uppercase tracking-wide text-muted-foreground">
                      AI lesson flow
                    </p>
                    <p className="truncate font-mono text-[9px] text-foreground/85">
                      Prompt: learn {activeAcademyTracks[0].stack}
                    </p>
                    <div className="flex items-center gap-1 text-[9px]">
                      {["Snippet", "Academy", "Case Study"].map((step) => (
                        <span
                          key={step}
                          className="rounded-md border border-border/80 bg-background/70 px-1.5 py-0.5 text-foreground/80"
                        >
                          {step}
                        </span>
                      ))}
                    </div>
                    <p className="truncate font-mono text-[9px] text-primary/90">
                      Output: {activeAcademyTracks[0].environment}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </BentoCard>

          <BentoCard
            feature={momentum}
            title={t(momentum.titleKey)}
            description={t(momentum.descriptionKey)}
            className="cursor-pointer"
            tabIndex={0}
            onMouseEnter={() => setIsMomentumActive(true)}
            onMouseLeave={() => setIsMomentumActive(false)}
            onFocus={() => setIsMomentumActive(true)}
            onBlur={() => setIsMomentumActive(false)}
          >
            <div className="mt-5 rounded-md border border-border/70 bg-background/75 p-3">
              <div className="grid h-24 grid-cols-6 items-end gap-1">
                {momentumHeights.map((height, index) => (
                  <div
                    key={`momentum-bar-${index}`}
                    className="rounded-sm bg-primary/70 transition-[height] ease-out"
                    style={{
                      height,
                      transitionDuration: `${320 + index * 80}ms`,
                    }}
                  />
                ))}
              </div>
            </div>
          </BentoCard>

          <BentoCard
            feature={security}
            title={t(security.titleKey)}
            description={t(security.descriptionKey)}
            className="cursor-pointer"
            tabIndex={0}
          >
            <div className="mt-5 space-y-2 rounded-md border border-border/70 bg-background/75 p-3 text-xs">
              <p className="rounded-md border border-border/70 bg-muted/45 px-2 py-1 transition-all duration-300 ease-out group-hover:translate-x-1 group-hover:border-primary/20 group-hover:bg-primary/8 group-focus-within:translate-x-1 group-focus-within:border-primary/20 group-focus-within:bg-primary/8">
                {t(security.bullets[0])}
              </p>
              <p className="rounded-md border border-border/70 bg-muted/45 px-2 py-1 transition-all duration-300 ease-out [transition-delay:40ms] group-hover:translate-x-2 group-hover:border-primary/25 group-hover:bg-primary/10 group-focus-within:translate-x-2 group-focus-within:border-primary/25 group-focus-within:bg-primary/10">
                {t(security.bullets[1])}
              </p>
              <p className="rounded-md border border-border/70 bg-muted/45 px-2 py-1 transition-all duration-300 ease-out [transition-delay:80ms] group-hover:translate-x-3 group-hover:border-primary/30 group-hover:bg-primary/12 group-focus-within:translate-x-3 group-focus-within:border-primary/30 group-focus-within:bg-primary/12">
                {t(security.titleKey)}
              </p>
            </div>
          </BentoCard>

          <BentoCard
            feature={surface}
            title={t(surface.titleKey)}
            description={t(surface.descriptionKey)}
            className="cursor-pointer"
            tabIndex={0}
          >
            <div className="mt-5 rounded-md border border-border/70 bg-background/75 p-3">
              <div className="grid grid-cols-2 gap-1.5 text-[11px]">
                {[
                  {
                    label: t(surface.bullets[0]),
                    value: "+34",
                    tone: "border-primary/35 bg-primary/10 text-primary shadow-sm shadow-primary/20",
                  },
                  {
                    label: t(surface.bullets[1]),
                    value: "11",
                    tone: "border-border/80 bg-muted/40 text-foreground/90",
                  },
                  {
                    label: t("features.items.surface.metrics.prs"),
                    value: "128",
                    tone: "border-border/80 bg-muted/40 text-foreground/90",
                  },
                  {
                    label: t("features.items.surface.metrics.deployments"),
                    value: "47",
                    tone: "border-border/80 bg-muted/40 text-foreground/90",
                  },
                ].map((metric, index) => (
                  <div
                    key={metric.label}
                    className={`rounded-md border px-2 py-1.5 transition-all duration-300 ease-out group-hover:-translate-y-0.5 group-hover:border-primary/20 group-hover:bg-primary/8 group-focus-within:-translate-y-0.5 group-focus-within:border-primary/20 group-focus-within:bg-primary/8 ${metric.tone}`}
                    style={{ transitionDelay: `${index * 45}ms` }}
                  >
                    <p className="text-[10px] uppercase tracking-wide text-muted-foreground">
                      {metric.label}
                    </p>
                    <p className="mt-0.5 font-semibold tabular-nums">
                      {metric.value}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </BentoCard>

          <BentoCard
            feature={typesafe}
            title={t(typesafe.titleKey)}
            description={t(typesafe.descriptionKey)}
            className="cursor-pointer"
            tabIndex={0}
          >
            <div className="mt-5 rounded-md border border-border/70 bg-background/80 p-3 font-mono text-[11px] leading-relaxed text-foreground/85">
              <p>
                <span className="text-primary">type</span> Stack = {"{"}
              </p>
              <p className="pl-3 transition-all duration-300 ease-out group-hover:translate-x-1 group-hover:text-foreground group-focus-within:translate-x-1 group-focus-within:text-foreground">
                auth: "strict";
              </p>
              <p className="pl-3 transition-all duration-300 ease-out [transition-delay:45ms] group-hover:translate-x-2 group-hover:text-foreground group-focus-within:translate-x-2 group-focus-within:text-foreground">
                billing: "typed";
              </p>
              <p className="pl-3 transition-all duration-300 ease-out [transition-delay:90ms] group-hover:translate-x-3 group-hover:text-primary/90 group-focus-within:translate-x-3 group-focus-within:text-primary/90">
                contracts: "safe";
              </p>
              <p>{"}"}</p>
            </div>
          </BentoCard>
        </div>
      </div>
    </section>
  );
}

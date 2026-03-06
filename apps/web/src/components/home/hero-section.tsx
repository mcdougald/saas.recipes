"use client";

import { Button } from "@/components/ui/button";
import { HighlightText } from "@/components/ui/highlight-text";
import { useI18n } from "@/hooks/use-i18n";
import Link from "next/link";
import { HiSparkles } from "react-icons/hi2";

import { HeroDescription } from "./hero-description";
import { RecipeCardsPreview } from "./recipe-cards-preview";

/**
 * Render the landing hero with developer-first messaging and conversion CTAs.
 *
 * @returns The primary hero section for the home page.
 */
export function HeroSection() {
  const { t } = useI18n();

  return (
    <section
      className="relative flex flex-col items-center justify-center overflow-hidden px-4 py-20 md:py-32"
      aria-labelledby="hero-heading"
    >
      <div className="absolute inset-0 -z-20 bg-[radial-gradient(ellipse_80%_60%_at_50%_-20%,var(--primary)/18%,transparent)]" />
      <div className="pointer-events-none absolute left-1/2 top-12 -z-10 h-44 w-136 -translate-x-1/2 rounded-full bg-primary/15 blur-3xl" />

      <div className="container relative mx-auto max-w-5xl text-center">
        <div className="mx-auto mb-6 max-w-5xl space-y-4 text-center">
          <h1
            id="hero-heading"
            className="mx-auto max-w-4xl text-balance pb-1 text-4xl font-bold leading-[1.08] tracking-tight sm:text-5xl md:text-6xl lg:text-7xl"
          >
            <span className="block">{t("hero.headingPrefix")}</span>
            <span className="mt-3 block text-3xl sm:text-4xl md:text-5xl lg:text-6xl">
              <HighlightText
                variant="underline"
                color="hsl(var(--primary))"
                strokeWidth={2}
                animationDuration={700}
                className="px-1.5 py-1 align-middle text-primary"
              >
                {t("hero.rotate.better")}
              </HighlightText>{" "}
              <span className="text-gradient-primary">
                {t("hero.headingSuffix")}
              </span>
            </span>
          </h1>

          <p className="mx-auto flex max-w-2xl items-center justify-center gap-2 text-sm font-medium text-muted-foreground sm:text-base">
            <span aria-hidden className="text-primary/70">
              ↖
            </span>
            <span>{t("hero.description.secondary")}</span>
            <span aria-hidden className="text-primary/70">
              ↗
            </span>
          </p>
        </div>

        <HeroDescription />

        <div className="mx-auto mt-8 mb-12 flex w-full max-w-md flex-col items-center gap-3 sm:max-w-none sm:flex-row sm:justify-center sm:gap-4">
          <Button
            asChild
            size="lg"
            className="group inline-flex w-full max-w-xs items-center justify-center rounded-md px-8 text-base font-medium shadow-lg shadow-primary/25 motion-safe:transition-all motion-safe:duration-300 motion-safe:hover:-translate-y-0.5 motion-safe:hover:shadow-xl motion-safe:hover:shadow-primary/35 focus-visible:ring-primary/40 sm:w-auto sm:max-w-none"
          >
            <Link href="/dashboard">
              <span>{t("hero.cta.primary")}</span>
              <span
                className="ml-2 inline-block motion-safe:transition-transform motion-safe:duration-300 motion-safe:group-hover:translate-x-1"
                aria-hidden
              >
                →
              </span>
            </Link>
          </Button>
          <Button
            asChild
            size="lg"
            variant="outline"
            className="group inline-flex w-full max-w-xs items-center justify-center rounded-md border-primary/30 bg-background/90 text-base font-medium backdrop-blur-sm motion-safe:transition-all motion-safe:duration-300 motion-safe:hover:-translate-y-0.5 motion-safe:hover:border-primary/60 motion-safe:hover:bg-primary/5 motion-safe:hover:shadow-lg motion-safe:hover:shadow-primary/15 focus-visible:ring-primary/30 sm:w-auto sm:max-w-none"
          >
            <Link href="#features">
              <span>{t("hero.cta.secondary")}</span>
              <HiSparkles
                aria-hidden
                className="ml-2 inline-block size-4 opacity-70 motion-safe:transition-all motion-safe:duration-300 motion-safe:group-hover:-translate-y-px motion-safe:group-hover:opacity-100"
              />
            </Link>
          </Button>
        </div>

        <RecipeCardsPreview />
      </div>
    </section>
  );
}

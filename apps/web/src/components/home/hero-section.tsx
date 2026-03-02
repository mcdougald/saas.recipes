"use client";

import { Button } from "@/components/ui/button";
import { WordRotate } from "@/components/ui/word-rotate";
import { useI18n } from "@/hooks/use-i18n";
import Link from "next/link";
import { HiSparkles } from "react-icons/hi2";

import { HeroDescription } from "./hero-description";

export function HeroSection() {
  const { t } = useI18n();

  return (
    <section
      className="relative flex flex-col items-center justify-center overflow-hidden px-4 py-20 md:py-32"
      aria-labelledby="hero-heading"
    >
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_80%_60%_at_50%_-20%,var(--primary)/15%,transparent)]" />
      <div className="container relative mx-auto max-w-4xl text-center">
        <h1
          id="hero-heading"
          className="mb-6 pb-2 text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl lg:text-7xl"
        >
          {t("hero.headingPrefix")}{" "}
          <WordRotate
            words={[
              t("hero.rotate.faster"),
              t("hero.rotate.safer"),
              t("hero.rotate.better"),
            ]}
            duration={3000}
            className="inline-block"
          />

          <span className="text-gradient-primary mt-2 block pb-2">
            {t("hero.headingSuffix")}
          </span>
        </h1>
        <HeroDescription />
        <div className="mx-auto mt-10 flex w-full max-w-md flex-col items-center gap-3 sm:max-w-none sm:flex-row sm:justify-center sm:gap-4">
          <Button
            asChild
            size="lg"
            className="group inline-flex w-full max-w-xs items-center justify-center rounded-md px-8 text-base font-medium shadow-lg shadow-primary/20 motion-safe:transition-all motion-safe:duration-300 motion-safe:hover:-translate-y-0.5 motion-safe:hover:shadow-xl motion-safe:hover:shadow-primary/30 focus-visible:ring-primary/40 sm:w-auto sm:max-w-none"
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
            className="group inline-flex w-full max-w-xs items-center justify-center rounded-md border-primary/30 bg-background/80 text-base font-medium backdrop-blur-sm motion-safe:transition-all motion-safe:duration-300 motion-safe:hover:-translate-y-0.5 motion-safe:hover:border-primary/60 motion-safe:hover:bg-primary/5 motion-safe:hover:shadow-lg motion-safe:hover:shadow-primary/15 focus-visible:ring-primary/30 sm:w-auto sm:max-w-none"
          >
            <Link href="#features">
              <span>{t("hero.cta.secondary")}</span>
              <HiSparkles
                className="ml-2 inline-block size-4 opacity-70 motion-safe:transition-all motion-safe:duration-300 motion-safe:group-hover:-translate-y-px motion-safe:group-hover:opacity-100"
                aria-hidden
              />
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
}

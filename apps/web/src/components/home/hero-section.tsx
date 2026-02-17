import { Button } from "@/components/ui/button";
import { WordRotate } from "@/components/ui/word-rotate";
import Link from "next/link";

import { HeroDescription } from "./hero-description";

export function HeroSection() {
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
          Serve a SaaS{" "}
          <WordRotate
            words={["faster", "safer", "better"]}
            duration={3000}
            className="inline-block"
          />
          
          <span className="mt-2 block pb-2 bg-linear-to-r from-primary to-primary/70 bg-clip-text text-transparent">
            Use profitable recipes
          </span>
        </h1>
        <HeroDescription />
        <div className="mx-auto mt-10 flex flex-col gap-4 sm:flex-row sm:justify-center">
          <Button
            asChild
            size="lg"
            className="group w-full px-8 text-base shadow-lg shadow-primary/20 motion-safe:transition-all motion-safe:duration-300 motion-safe:hover:-translate-y-0.5 motion-safe:hover:shadow-xl motion-safe:hover:shadow-primary/30 sm:w-auto"
          >
            <Link href="/dashboard">
              <span>Explore Recipes</span>
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
            className="group w-full border-primary/30 bg-background/80 text-base backdrop-blur-sm motion-safe:transition-all motion-safe:duration-300 motion-safe:hover:-translate-y-0.5 motion-safe:hover:border-primary/60 motion-safe:hover:bg-primary/5 motion-safe:hover:shadow-lg motion-safe:hover:shadow-primary/15 sm:w-auto"
          >
            <Link href="#features">
              <span>See Features</span>
              <span
                className="ml-2 inline-block opacity-70 motion-safe:transition-all motion-safe:duration-300 motion-safe:group-hover:-translate-y-px motion-safe:group-hover:opacity-100"
                aria-hidden
              >
                ✨
              </span>
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
}

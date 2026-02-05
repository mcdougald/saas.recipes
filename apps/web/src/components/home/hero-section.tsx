import { Button } from "@/components/ui/button";
import Link from "next/link";

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
          className="mb-6 text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl lg:text-7xl"
        >
          Serve up your SaaS faster.
          <span className="mt-2 block bg-linear-to-r from-primary to-primary/70 bg-clip-text text-transparent">
            Learn from recipes that scale.
          </span>
        </h1>
        <p className="mx-auto max-w-2xl text-lg text-muted-foreground md:text-xl">
          Don&apos;t cook alone. Leverage this cookbook — proven recipes from real
          kitchens (auth, billing, dashboards, and more) — plus an AI chef to help
          run the kitchen.
        </p>
        <p className="mx-auto mt-4 max-w-2xl text-lg text-muted-foreground md:text-xl">
          You focus on your signature dish; this product handles the prep.
        </p>
        <div className="mx-auto mt-10 flex flex-col gap-4 sm:flex-row sm:justify-center">
          <Link href="/dashboard">
            <Button size="lg" className="w-full sm:w-auto text-base px-8">
              Explore Recipes
              <span className="ml-2" aria-hidden>→</span>
            </Button>
          </Link>
          <Link href="#features">
            <Button
              size="lg"
              variant="outline"
              className="w-full sm:w-auto text-base"
            >
              See Features
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}

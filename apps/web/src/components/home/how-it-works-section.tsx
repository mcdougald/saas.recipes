"use client";

import { BookOpen, Check, Sparkles, TrendingUp } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { motion } from "motion/react";

type ValuePillar = {
  icon: LucideIcon;
  title: string;
  description: string;
  highlights: readonly [string, string];
};

const valuePillars: readonly ValuePillar[] = [
  {
    icon: BookOpen,
    title: "Curated implementation patterns",
    description:
      "Browse production-grade repositories and see how real teams structure auth, billing, dashboards, and release workflows.",
    highlights: ["Reference fullstack architecture decisions", "Learn from proven code organization"],
  },
  {
    icon: Sparkles,
    title: "Actionable insights for your stack",
    description:
      "Compare tooling, complexity, and maintenance signals so you can choose patterns that fit your product constraints.",
    highlights: ["Filter examples by stack and product type", "Spot tradeoffs before implementation"],
  },
  {
    icon: TrendingUp,
    title: "Faster path from idea to launch",
    description:
      "Reuse battle-tested approaches instead of rebuilding foundations, and focus your team on product differentiation.",
    highlights: ["Reduce time spent on boilerplate", "Ship with more confidence"],
  },
] as const;

export function HowItWorksSection() {
  return (
    <section
      id="how-it-works"
      className="border-t py-20 md:py-28"
      aria-labelledby="how-it-works-heading"
    >
      <div className="container px-4 mx-auto">
        <div className="mx-auto max-w-3xl text-center mb-14">
          <h2
            id="how-it-works-heading"
            className="text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl mb-4"
          >
            How teams ship faster with saas.recipes
          </h2>
          <p className="text-lg text-muted-foreground">
            The recipes are a curated intelligence
            layer for learning from real products and applying those lessons to your own.
          </p>
        </div>
        <div className="mx-auto grid max-w-5xl gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {valuePillars.map(({ icon: Icon, title, description, highlights }, index) => (
            <motion.article
              key={title}
              className="group relative overflow-hidden rounded-3xl border border-border/70 bg-linear-to-b from-background via-muted/30 to-background text-left shadow-sm transition-all hover:-translate-y-1 hover:border-primary/35 hover:shadow-lg hover:shadow-primary/10"
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.25 }}
              transition={{
                duration: 0.45,
                delay: index * 0.08,
                ease: "easeOut",
              }}
            >
              <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(140%_90%_at_0%_0%,var(--primary)/90%,transparent_90%)] opacity-60 transition-opacity duration-300 group-hover:opacity-100" />
              <div className="relative z-10 h-full p-6">
                <div className="mb-5 flex items-center justify-between gap-4">
                  <span className="inline-flex items-center rounded-full border border-primary/20 bg-primary/2 px-2.5 py-1 text-[11px] font-semibold uppercase tracking-[0.14em] text-primary/85">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  <div className="inline-flex h-11 w-11 items-center justify-center rounded-2xl border border-primary/20 bg-background/80 text-primary shadow-sm backdrop-blur">
                    <Icon className="h-5 w-5 transition-transform duration-300 group-hover:scale-105" aria-hidden />
                  </div>
                </div>

                <h3 className="text-xl font-semibold tracking-tight">{title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                  {description}
                </p>

                <ul className="mt-6 space-y-2.5 border-l border-primary/30 pl-4">
                  {highlights.map((item) => (
                    <li
                      key={item}
                      className="flex items-start gap-2.5 text-sm text-foreground/90"
                    >
                      <span className="mt-0.5 inline-flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
                        <Check className="h-3.5 w-3.5" aria-hidden />
                      </span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
}

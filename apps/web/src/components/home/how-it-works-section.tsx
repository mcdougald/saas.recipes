import { BookOpen, Sparkles, TrendingUp } from "lucide-react";
import type { LucideIcon } from "lucide-react";

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
        <div className="mx-auto grid max-w-5xl gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {valuePillars.map(({ icon: Icon, title, description, highlights }) => (
            <article
              key={title}
              className="group rounded-2xl border bg-background p-6 text-left shadow-sm transition-all hover:-translate-y-0.5 hover:border-primary/30 hover:shadow-md"
            >
              <div className="mb-5 flex items-start justify-between gap-4">
                <div className="inline-flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10 ring-1 ring-primary/15">
                  <Icon className="h-6 w-6 text-primary" aria-hidden />
                </div>
                <span className="rounded-full border border-primary/20 bg-primary/5 px-2.5 py-1 text-xs font-medium text-primary">
                  Outcome-focused
                </span>
              </div>
              <h3 className="text-xl font-semibold">{title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                {description}
              </p>
              <div className="mt-5 flex flex-wrap gap-2">
                {highlights.map((item) => (
                  <span
                    key={item}
                    className="rounded-full bg-muted px-3 py-1 text-xs font-medium text-foreground/80 transition-colors group-hover:bg-primary/10 group-hover:text-primary"
                  >
                    {item}
                  </span>
                ))}
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

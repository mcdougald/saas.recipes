import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  BookOpen,
  Globe,
  Lock,
  Shield,
  Sparkles,
  TrendingUp,
} from "lucide-react";

const features = [
  {
    icon: Sparkles,
    title: "Instant codebase insights",
    description:
      "Real-time analysis of your codebase so you can make decisions on the spot. See structure, patterns, and impact without digging through files—instant clarity when it matters.",
  },
  {
    icon: BookOpen,
    title: "Learn from the best kitchens & cooks",
    description:
      "Recipes from silo developers, enterprise teams, and open-source solutions. Whatever your setup—solo, org, or community—find patterns that match how you actually work.",
  },
  {
    icon: Shield,
    title: "Auth, billing & security by default",
    description:
      "Production-ready examples for authentication, billing, and secure patterns. Copy proven implementations instead of wiring it yourself—auth, payments, and guardrails that scale.",
  },
  {
    icon: TrendingUp,
    title: "Modern flavors, tracked",
    description:
      "Built to track which modern stacks and flavors are working in the wild. See what’s adopted, what’s trending, and what’s proven—so you choose tools that are here to stay.",
  },
  {
    icon: Globe,
    title: "Every deployment shape",
    description:
      "Web apps, mobile apps, Chrome extensions, bots, self-hosted, portfolios, and more. Find recipes for the exact kind of product you’re building—versatility without the noise.",
  },
  {
    icon: Lock,
    title: "Type-safe from the start",
    description:
      "Full TypeScript and clear types across the stack. Fewer runtime bugs, safer refactors, and better DX so you move fast without breaking things.",
  },
] as const;

export function FeaturesSection() {
  return (
    <section
      id="features"
      className="relative border-t bg-muted/30 py-20 md:py-28"
      aria-labelledby="features-heading"
    >
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_70%_50%_at_50%_100%,var(--primary)/8%,transparent_70%)]" />
      <div className="container px-4">
        <div className="mx-auto max-w-2xl text-center mb-14 md:mb-16">
          <p className="mb-3 text-sm font-medium uppercase tracking-wider text-primary/80">
            Why SaaS Recipes
          </p>
          <h2
            id="features-heading"
            className="text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl mb-4"
          >
            Everything you need to{" "}
            <span className="bg-linear-to-r from-primary to-primary/70 bg-clip-text text-transparent">
              deliver
            </span>
          </h2>
          <p className="text-lg text-muted-foreground md:text-xl leading-relaxed">
            Proven recipes from profitable kitchens — auth, billing, dashboards,
            and more. Use what fits your menu, skip the prep work, and
            let the market taste-test your product sooner.
          </p>
        </div>
        <div className="mx-auto grid max-w-5xl gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {features.map(({ icon: Icon, title, description }) => (
            <Card
              key={title}
              className="group relative border-2 bg-card/90 backdrop-blur-sm transition-all duration-200 hover:shadow-xl hover:shadow-primary/5 hover:border-primary/20"
            >
              <CardHeader className="space-y-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary transition-colors group-hover:bg-primary/15">
                  <Icon className="h-6 w-6" aria-hidden />
                </div>
                <CardTitle className="text-xl font-semibold tracking-tight">
                  {title}
                </CardTitle>
                <CardDescription className="text-base leading-relaxed text-muted-foreground">
                  {description}
                </CardDescription>
              </CardHeader>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}

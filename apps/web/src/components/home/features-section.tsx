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
    description: "Real-time structure, patterns, and impact—no digging through files.",
  },
  {
    icon: BookOpen,
    title: "Learn from the best cooks",
    description: "Recipes from indie devs, teams, and open source. Patterns that match how you work.",
  },
  {
    icon: Shield,
    title: "Auth, billing & security",
    description: "Production-ready examples. Copy proven implementations, skip the wiring.",
  },
  {
    icon: TrendingUp,
    title: "Modern flavors, tracked",
    description: "See what's adopted and proven so you choose tools that stick.",
  },
  {
    icon: Globe,
    title: "Every deployment shape",
    description: "Web, mobile, extensions, bots, self-hosted. Recipes for what you're building.",
  },
  {
    icon: Lock,
    title: "Type-safe from the start",
    description: "Full TypeScript and clear types. Fewer bugs, safer refactors.",
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
      <div className="container px-4 mx-auto">
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
            Proven recipes from profitable kitchens. Use what fits your menu, skip the prep work, and
            let the market taste-test your product sooner.
          </p>
        </div>
        <div className="mx-auto grid max-w-5xl gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {features.map(({ icon: Icon, title, description }) => (
            <Card
              key={title}
              className="group relative border bg-card/90 backdrop-blur-sm transition-all duration-200 hover:shadow-lg hover:shadow-primary/5 hover:border-primary/15"
            >
              <CardHeader className="space-y-3 p-5 sm:p-6">
                <div className="flex items-center gap-3">
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary transition-colors group-hover:bg-primary/15">
                    <Icon className="h-4 w-4" aria-hidden />
                  </div>
                  <CardTitle className="text-lg font-semibold tracking-tight">
                    {title}
                  </CardTitle>
                </div>
                <CardDescription className="text-sm leading-snug text-muted-foreground">
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

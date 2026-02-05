import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  BarChart3,
  Globe,
  Lock,
  Shield,
  Users,
  Zap,
} from "lucide-react";

const features = [
  {
    icon: BarChart3,
    title: "Analytics & insights",
    description:
      "Real-time metrics and clear visualizations so you see what’s working and what isn’t—without guessing.",
  },
  {
    icon: Users,
    title: "Contributor management",
    description:
      "Track who’s doing what across repos and teams. Keep ownership clear and collaboration smooth.",
  },
  {
    icon: Shield,
    title: "Dependency security",
    description:
      "Stay on top of vulnerabilities and upgrades. Secure by default, without extra tooling.",
  },
  {
    icon: Zap,
    title: "Built for speed",
    description:
      "Next.js 16 and Turbopack for fast dev cycles and instant feedback. No more waiting on builds.",
  },
  {
    icon: Globe,
    title: "Responsive & accessible",
    description:
      "Works on every device with a mobile-first layout and solid accessibility out of the box.",
  },
  {
    icon: Lock,
    title: "Type-safe stack",
    description:
      "Full TypeScript and clear types across the app. Fewer runtime bugs and better refactors.",
  },
] as const;

export function FeaturesSection() {
  return (
    <section
      id="features"
      className="border-t bg-muted/30 py-20 md:py-28"
      aria-labelledby="features-heading"
    >
      <div className="container px-4">
        <div className="mx-auto max-w-2xl text-center mb-14">
          <h2
            id="features-heading"
            className="text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl mb-4"
          >
            Everything you need to ship
          </h2>
          <p className="text-lg text-muted-foreground">
            Real patterns from production SaaS. Use them as reference, copy
            what you need, and skip the boilerplate so you can build what
            matters.
          </p>
        </div>
        <div className="mx-auto grid max-w-5xl gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {features.map(({ icon: Icon, title, description }) => (
            <Card
              key={title}
              className="border-2 bg-card/80 transition-shadow hover:shadow-lg"
            >
              <CardHeader>
                <div className="mb-3 flex h-11 w-11 items-center justify-center rounded-lg bg-primary/10">
                  <Icon className="h-5 w-5 text-primary" aria-hidden />
                </div>
                <CardTitle className="text-lg">{title}</CardTitle>
                <CardDescription className="text-base leading-relaxed">
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

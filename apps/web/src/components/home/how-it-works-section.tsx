import { BookOpen, Code2, Rocket } from "lucide-react";

const steps = [
  {
    icon: BookOpen,
    title: "Study the recipes",
    description:
      "Browse real implementations: auth, billing, dashboards, and more. See how others solved the same problems.",
  },
  {
    icon: Code2,
    title: "Copy what fits",
    description:
      "Use the code and patterns directly in your app. TypeScript, Next.js, and Tailwind—ready to adapt.",
  },
  {
    icon: Rocket,
    title: "Ship faster",
    description:
      "Spend less time on infrastructure and more on your product. Get to market with confidence.",
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
        <div className="mx-auto max-w-2xl text-center mb-14">
          <h2
            id="how-it-works-heading"
            className="text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl mb-4"
          >
            How it works
          </h2>
          <p className="text-lg text-muted-foreground">
            Three steps turn “I need deliver this” into “it’s live.” No lock-in, no
            magic—just proven patterns and experience you can own.
          </p>
        </div>
        <div className="mx-auto grid max-w-4xl gap-10 md:grid-cols-3 md:gap-8">
          {steps.map(({ icon: Icon, title, description }, index) => (
            <div key={title} className="relative text-center md:text-left">
              <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10">
                <Icon className="h-6 w-6 text-primary" aria-hidden />
              </div>
              <span className="text-sm font-semibold text-muted-foreground">
                Step {index + 1}
              </span>
              <h3 className="mt-1 text-xl font-semibold">{title}</h3>
              <p className="mt-2 text-muted-foreground leading-relaxed">
                {description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

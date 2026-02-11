import { BookOpen, Code2, Rocket } from "lucide-react";

const steps = [
  {
    icon: BookOpen,
    title: "Access proven recipes",
    description:
      "Quickly scan real implementations for auth, billing, dashboards, and more. Clear examples make it easy to find exactly what you need.",
  },
  {
    icon: Code2,
    title: "Get code that fits your stack",
    description:
      "Start from patterns already shaped for your setup, then drop them into your app. TypeScript, Next.js, and Tailwind-ready out of the box.",
  },
  {
    icon: Rocket,
    title: "Satisfy returning users",
    description:
      "Spend less time on plumbing and more on product quality. Deliver cleaner experiences that keep users happy and coming back.",
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
            Three steps turn “I need to deliver&quot; into “it’s live.” No lock-in, no
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

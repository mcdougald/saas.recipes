import { Card, CardContent } from "@/components/ui/card";
import { Quote } from "lucide-react";

const testimonials = [
  {
    quote:
      "Finally, a reference that shows how real SaaS apps are built—not just theory. Cut our setup time in half.",
    author: "Engineering lead",
    role: "Series A startup",
  },
  {
    quote:
      "The dashboard and auth patterns were exactly what we needed. We shipped our MVP in weeks, not months.",
    author: "Full-stack developer",
    role: "Indie hacker",
  },
] as const;

export function TestimonialsSection() {
  return (
    <section
      id="testimonials"
      className="border-t bg-muted/30 py-20 md:py-28"
      aria-labelledby="testimonials-heading"
    >
      <div className="container px-4">
        <div className="mx-auto max-w-2xl text-center mb-14">
          <h2
            id="testimonials-heading"
            className="text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl mb-4"
          >
            Built for builders
          </h2>
          <p className="text-lg text-muted-foreground">
            Developers and teams use SaaS Recipes to ship faster and avoid
            reinventing the wheel.
          </p>
        </div>
        <div className="mx-auto grid max-w-4xl gap-6 sm:grid-cols-2">
          {testimonials.map(({ quote, author, role }) => (
            <Card
              key={author}
              className="border-2 bg-card/80 shadow-sm"
            >
              <CardContent className="pt-6">
                <Quote
                  className="mb-3 h-8 w-8 text-primary/40"
                  aria-hidden
                />
                <p className="text-foreground leading-relaxed">&ldquo;{quote}&rdquo;</p>
                <p className="mt-4 text-sm font-medium text-foreground">
                  {author}
                </p>
                <p className="text-sm text-muted-foreground">{role}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}

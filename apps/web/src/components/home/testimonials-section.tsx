"use client";

import { Card, CardContent } from "@/components/ui/card";
import { useI18n } from "@/hooks/use-i18n";
import { Quote } from "lucide-react";

const testimonials = [
  {
    quoteKey: "testimonials.items.first.quote",
    authorKey: "testimonials.items.first.author",
    roleKey: "testimonials.items.first.role",
  },
  {
    quoteKey: "testimonials.items.second.quote",
    authorKey: "testimonials.items.second.author",
    roleKey: "testimonials.items.second.role",
  },
] as const;

export function TestimonialsSection() {
  const { t } = useI18n();

  return (
    <section
      id="testimonials"
      className="border-t bg-muted/30 py-20 md:py-28"
      aria-labelledby="testimonials-heading"
    >
      <div className="container px-4 mx-auto">
        <div className="mx-auto mb-14 max-w-3xl text-center">
          <h2
            id="testimonials-heading"
            className="text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl mb-4"
          >
            {t("testimonials.heading")}
          </h2>
          <p className="mx-auto max-w-2xl text-base text-muted-foreground sm:text-lg">
            {t("testimonials.description")}
          </p>
        </div>
        <div className="mx-auto grid max-w-4xl gap-6 sm:grid-cols-2">
          {testimonials.map(({ quoteKey, authorKey, roleKey }) => (
            <Card
              key={authorKey}
              className="border-2 bg-card/80 shadow-sm"
            >
              <CardContent className="pt-2">
                <Quote
                  className="mb-3 h-8 w-8 text-primary/40"
                  aria-hidden
                />
                <p className="text-foreground leading-relaxed">
                  &ldquo;{t(quoteKey)}&rdquo;
                </p>
                <p className="mt-4 text-sm font-medium text-foreground">
                  {t(authorKey)}
                </p>
                <p className="text-sm text-muted-foreground">{t(roleKey)}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}

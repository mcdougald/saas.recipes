"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { pricingPageCopy, pricingPlans } from "@/features/pricing/pricing-data";
import { Check } from "lucide-react";
import posthog from "posthog-js";
import { useState } from "react";

export function ColumnPricing() {
  // "free" acts as the default plan selection.
  const [currentPlan, setCurrentPlan] = useState<string>("free");

  return (
    <div className="mt-4 px-4 py-4 lg:px-6">
      <div className="mb-12 text-center">
        <p className="text-primary/80 mb-3 text-sm font-semibold uppercase tracking-wide">
          Priced for cooks
        </p>
        <h1 className="mx-auto mb-8 max-w-4xl text-4xl font-bold tracking-tight md:text-5xl">
          {pricingPageCopy.headline}
        </h1>
        <div className="mx-auto flex w-full max-w-3xl flex-col items-center gap-6">
          <p className="text-muted-foreground text-balance text-lg leading-relaxed md:text-xl">
            {pricingPageCopy.description}
          </p>
          <p className="bg-muted/40 text-muted-foreground w-8/10 rounded-md px-4 py-3 text-sm leading-relaxed">
            {pricingPageCopy.supportNote}
          </p>
        </div>
        <div className="text-muted-foreground mt-10 flex flex-wrap items-center justify-center gap-x-4 gap-y-2 text-sm">
          <span>Cancel anytime</span>
          <span className="hidden h-1 w-1 rounded-full bg-current/40 sm:inline-block" />
          <span>Upgrade as your project grows</span>
          <span className="hidden h-1 w-1 rounded-full bg-current/40 sm:inline-block" />
          <span>Built for solo builders and teams</span>
        </div>
      </div>

      <div className="mx-auto grid max-w-6xl grid-cols-1 items-stretch gap-8 pt-8 md:grid-cols-3">
        {pricingPlans.map((plan) => {
          const isPopular = Boolean(plan.popular);
          const isSelected = currentPlan === plan.id;
          const cardClasses = `relative flex h-full flex-col transition-all ${
            isSelected
              ? "border-primary ring-2 ring-primary/20 shadow-lg"
              : isPopular
                ? "border-primary z-10 md:scale-105 md:px-6 md:py-6 shadow-2xl"
                : "md:mt-0 md:scale-100"
          }`;

          return (
            <Card
              key={plan.id}
              className={`cursor-pointer ${cardClasses}`}
              onClick={() => {
                setCurrentPlan(plan.id);
                // Capture pricing plan selection event
                posthog.capture("pricing_plan_selected", {
                  plan_id: plan.id,
                  plan_name: plan.name,
                  plan_price: plan.price,
                  is_popular: Boolean(plan.popular),
                });
              }}
            >
              {plan.popular && !isSelected && (
                <div className="bg-primary text-primary-foreground absolute -top-3 left-1/2 -translate-x-1/2 rounded-full px-3 py-1 text-xs font-medium">
                  Most Popular
                </div>
              )}
              {isSelected && (
                <div className="bg-primary text-primary-foreground absolute -top-3 left-1/2 -translate-x-1/2 rounded-full px-3 py-1 text-xs font-medium">
                  Current plan
                </div>
              )}
              <CardHeader className="text-center">
                <CardTitle className="text-2xl">{plan.name}</CardTitle>
                <CardDescription>{plan.description}</CardDescription>
              </CardHeader>
              <CardContent className="flex-1">
                <div className="mb-6 text-center">
                  <span className="text-4xl font-bold">{plan.price}</span>
                  <span className="text-muted-foreground">{plan.period}</span>
                </div>
                <ul className="space-y-3">
                  {plan.features.map((feature) => (
                    <li key={feature} className="flex items-center gap-2">
                      <Check className="text-primary size-4" />
                      <span className="text-sm">{feature}</span>
                    </li>
                  ))}
                </ul>
                {plan.supportImpact ? (
                  <p className="text-muted-foreground mt-5 text-xs">
                    {plan.supportImpact}
                  </p>
                ) : null}
              </CardContent>
              <CardFooter>
                <Button
                  variant={isSelected ? "secondary" : plan.variant}
                  className="w-full"
                  disabled={isSelected}
                >
                  {isSelected ? "Current plan" : plan.buttonText}
                </Button>
              </CardFooter>
            </Card>
          );
        })}
      </div>
    </div>
  );
}

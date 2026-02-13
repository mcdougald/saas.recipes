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
import { useState } from "react";

export function ColumnPricing() {
  // "free" acts as the default plan selection.
  const [currentPlan, setCurrentPlan] = useState<string>("free");

  return (
    <div className="px-4 py-4 lg:px-6">
      <div className="mb-12 text-center">
        <h1 className="mb-4 text-4xl font-bold">{pricingPageCopy.headline}</h1>
        <p className="text-muted-foreground text-lg">
          {pricingPageCopy.description}
        </p>
        <p className="text-muted-foreground mx-auto mt-3 max-w-3xl text-sm">
          {pricingPageCopy.supportNote}
        </p>
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
              onClick={() => setCurrentPlan(plan.id)}
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

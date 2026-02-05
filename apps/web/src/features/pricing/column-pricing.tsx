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
import { Check } from "lucide-react";
import { useState } from "react";

const pricingPlans = [
  {
    name: "Free",
    description: "Limited, temporary access to explore",
    price: "$0",
    period: "/month",
    features: [
      "Limited access to browse recipes",
      "View live project demos",
      "Community support",
    ],
    buttonText: "Get started free",
    variant: "outline" as const,
  },
  {
    name: "Basic",
    description: "Full access to recipes and live projects",
    price: "$9",
    period: "/month",
    features: [
      "Full access — no time limits",
      "Notes & repository recipes",
      "Access to all live projects",
      "Unlimited recipe browsing",
      "Community support",
    ],
    buttonText: "Choose Basic",
    variant: "outline" as const,
  },
  {
    name: "Pro",
    description: "AI Chef plus My Help (my time)",
    price: "$19",
    period: "/month",
    features: [
      "Everything in Basic",
      "AI Chef — recipe help & project guidance",
      "My Help — direct access to my time",
    ],
    buttonText: "Choose Pro",
    variant: "default" as const,
    popular: true,
  },
  {
    name: "Enterprise",
    description: "For teams shipping together",
    price: "$49",
    period: "/month",
    features: [
      "Everything in Pro",
      "Team workspace & sharing",
      "AI Chef for the whole team",
      "Priority My Help (my time)",
      "Early access to new recipes",
    ],
    buttonText: "Choose Enterprise",
    variant: "outline" as const,
  },
];

export function ColumnPricing() {
  // null = no paid plan, so Free is the selected/current plan
  const [currentPlan, setCurrentPlan] = useState<string | null>(null);

  return (
    <div className="px-4 py-4 lg:px-6">
      <div className="mb-12 text-center">
        <h1 className="mb-4 text-4xl font-bold">Pricing</h1>
        <p className="text-muted-foreground text-lg">
          Recipes, live projects, and AI Chef — choose the plan that fits
        </p>
      </div>

      <div className="mx-auto grid max-w-6xl grid-cols-1 items-stretch gap-8 pt-8 md:grid-cols-2 lg:grid-cols-4">
        {pricingPlans.map((plan) => {
          const isPopular = Boolean(plan.popular);
          const isSelected =
            plan.name === "Free"
              ? currentPlan === null
              : currentPlan === plan.name;
          const cardClasses = `relative flex h-full flex-col transition-all ${
            isSelected
              ? "border-primary ring-2 ring-primary/20 shadow-lg"
              : isPopular
                ? "border-primary z-10 md:scale-110 md:px-8 md:py-8 shadow-2xl"
                : "md:mt-0 md:scale-100"
          }`;

          return (
            <Card
              key={plan.name}
              className={`cursor-pointer ${cardClasses}`}
              onClick={() =>
                setCurrentPlan(plan.name === "Free" ? null : plan.name)
              }
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

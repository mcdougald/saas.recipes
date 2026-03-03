"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import type { PricingPlan } from "@/features/pricing/pricing-data";
import { cn } from "@/lib/utils";
import { Check } from "lucide-react";
import posthog from "posthog-js";
import { useMemo, useState } from "react";
import { toast } from "sonner";

type ActiveBadge = {
  label: string;
  variant: "default" | "secondary" | "destructive" | "outline";
};

const statusBadgeVariant: Record<
  string,
  "default" | "secondary" | "destructive" | "outline"
> = {
  active: "default",
  trialing: "secondary",
  canceled: "outline",
  unpaid: "destructive",
  past_due: "destructive",
  incomplete: "destructive",
  incomplete_expired: "destructive",
  free: "outline",
};

const tierToPlanId: Record<string, PricingPlan["id"]> = {
  free: "free",
  basic: "starter",
  starter: "starter",
  pro: "supporter",
  supporter: "supporter",
  enterprise: "enterprise",
};

const planToCheckoutId: Partial<Record<PricingPlan["id"], string>> = {
  starter: "basic",
  supporter: "pro",
  enterprise: "enterprise",
};

/**
 * Describe Stripe-aware rendering and actions for pricing columns.
 */
export interface PriceColumnsProps {
  plans: PricingPlan[];
  activeTier: string;
  subscriptionStatus: string;
  hasStripeCustomer: boolean;
  isSignedIn: boolean;
}

function getActiveBadge(
  isCurrent: boolean,
  subscriptionStatus: string,
  isPopular: boolean,
): ActiveBadge | null {
  if (isCurrent) {
    if (subscriptionStatus === "free") {
      return { label: "Current plan", variant: "outline" };
    }

    return {
      label: `Current - ${subscriptionStatus.replaceAll("_", " ")}`,
      variant: statusBadgeVariant[subscriptionStatus] ?? "outline",
    };
  }

  if (isPopular) {
    return { label: "Most popular", variant: "secondary" };
  }

  return null;
}

/**
 * Render selectable pricing columns with checkout and portal actions.
 *
 * @param props - Plans and user subscription context to render action states.
 * @returns A grid of pricing cards with active subscription indicators.
 */
export function PriceColumns({
  plans,
  activeTier,
  subscriptionStatus,
  hasStripeCustomer,
  isSignedIn,
}: PriceColumnsProps) {
  const normalizedActivePlan = useMemo(
    () => tierToPlanId[activeTier] ?? "free",
    [activeTier],
  );
  const [busyPlanId, setBusyPlanId] = useState<string | null>(null);

  const openPortal = async () => {
    try {
      const response = await fetch("/api/stripe/create-portal-session", {
        method: "POST",
      });
      const payload = (await response.json()) as { url?: string; error?: string };

      if (!response.ok || !payload.url) {
        throw new Error(payload.error ?? "Could not open billing portal.");
      }

      window.location.assign(payload.url);
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Could not open billing portal.";
      toast.error(message);
    }
  };

  const startCheckout = async (plan: PricingPlan) => {
    const checkoutPlanId = planToCheckoutId[plan.id];

    if (!checkoutPlanId) {
      return;
    }

    try {
      const response = await fetch("/api/stripe/create-checkout-session", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ priceId: checkoutPlanId }),
      });
      const payload = (await response.json()) as { url?: string; error?: string };

      if (!response.ok || !payload.url) {
        throw new Error(payload.error ?? "Could not start checkout.");
      }

      posthog.capture("pricing_checkout_started", {
        plan_id: plan.id,
        checkout_plan_id: checkoutPlanId,
      });
      window.location.assign(payload.url);
    } catch (error) {
      const message = error instanceof Error ? error.message : "Could not start checkout.";
      toast.error(message);
    }
  };

  const onPlanAction = async (plan: PricingPlan, isCurrent: boolean) => {
    if (busyPlanId) {
      return;
    }

    if (!isSignedIn) {
      window.location.assign("/sign-in?redirect=/pricing");
      return;
    }

    setBusyPlanId(plan.id);
    try {
      if (isCurrent && plan.id !== "free" && hasStripeCustomer) {
        await openPortal();
        return;
      }

      if (!isCurrent) {
        await startCheckout(plan);
      }
    } finally {
      setBusyPlanId(null);
    }
  };

  return (
    <div className="mx-auto grid max-w-6xl grid-cols-1 items-stretch gap-8 pt-8 md:grid-cols-2 xl:grid-cols-4">
      {plans.map((plan) => {
        const isPopular = Boolean(plan.popular);
        const isCurrent = normalizedActivePlan === plan.id;
        const isBusy = busyPlanId === plan.id;
        const badge = getActiveBadge(isCurrent, subscriptionStatus, isPopular);
        const canManageCurrentPlan = isCurrent && plan.id !== "free" && hasStripeCustomer;

        return (
          <Card
            key={plan.id}
            className={cn(
              "relative flex h-full flex-col transition-all",
              isCurrent
                ? "border-primary ring-primary/20 ring-2 shadow-lg"
                : isPopular
                  ? "border-primary md:scale-[1.02]"
                  : "",
            )}
          >
            {badge ? (
              <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                <Badge variant={badge.variant} className="capitalize">
                  {badge.label}
                </Badge>
              </div>
            ) : null}
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
                  <li key={feature} className="flex items-start gap-2">
                    <Check className="text-primary mt-0.5 size-4 shrink-0" />
                    <span className="text-sm">{feature}</span>
                  </li>
                ))}
              </ul>
              {plan.supportImpact ? (
                <p className="text-muted-foreground mt-5 text-xs">{plan.supportImpact}</p>
              ) : null}
            </CardContent>
            <CardFooter>
              <Button
                variant={isCurrent ? "secondary" : plan.variant}
                className="w-full"
                disabled={isBusy || (isCurrent && !canManageCurrentPlan)}
                onClick={() => onPlanAction(plan, isCurrent)}
              >
                {isBusy
                  ? "Redirecting..."
                  : canManageCurrentPlan
                    ? "Manage subscription"
                    : isCurrent
                      ? "Current plan"
                      : isSignedIn
                        ? plan.buttonText
                        : "Sign in to subscribe"}
              </Button>
            </CardFooter>
          </Card>
        );
      })}
    </div>
  );
}

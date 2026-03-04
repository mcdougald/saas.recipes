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
import { useSearchParams } from "next/navigation";
import posthog from "posthog-js";
import { useEffect, useMemo, useRef, useState } from "react";
import { toast } from "sonner";

type ActiveBadge = {
  label: string;
  variant: "default" | "secondary" | "destructive" | "outline";
};

type BillingInterval = "monthly" | "yearly";

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
  basic: "pro",
  starter: "pro",
  pro: "pro",
  supporter: "pro",
  pro_plus: "pro_plus",
  enterprise: "enterprise",
};

const planToCheckoutId: Partial<Record<PricingPlan["id"], string>> = {
  pro: "pro",
  pro_plus: "pro_plus",
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
  const searchParams = useSearchParams();
  const [billingInterval, setBillingInterval] = useState<BillingInterval>("monthly");
  const normalizedActivePlan = useMemo(
    () => tierToPlanId[activeTier] ?? "free",
    [activeTier],
  );
  const [busyPlanId, setBusyPlanId] = useState<string | null>(null);
  const hasAutoStartedCheckout = useRef(false);

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
        body: JSON.stringify({ priceId: checkoutPlanId, billingInterval }),
      });
      const payload = (await response.json()) as { url?: string; error?: string };

      if (!response.ok || !payload.url) {
        throw new Error(payload.error ?? "Could not start checkout.");
      }

      posthog.capture("pricing_checkout_started", {
        plan_id: plan.id,
        checkout_plan_id: checkoutPlanId,
        billing_interval: billingInterval,
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
      const destination = new URL("/pricing", window.location.origin);
      destination.searchParams.set("subscribePlan", plan.id);
      destination.searchParams.set("billingInterval", billingInterval);
      const redirect = `${destination.pathname}${destination.search}`;
      window.location.assign(`/sign-up?redirect=${encodeURIComponent(redirect)}`);
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

  useEffect(() => {
    if (!isSignedIn || busyPlanId || hasAutoStartedCheckout.current) {
      return;
    }

    const subscribePlan = searchParams.get("subscribePlan");
    const subscribeInterval = searchParams.get("billingInterval");
    if (!subscribePlan || subscribePlan === "free") {
      return;
    }

    const plan = plans.find((item) => item.id === subscribePlan);
    if (!plan) {
      return;
    }

    const nextInterval: BillingInterval = subscribeInterval === "yearly" ? "yearly" : "monthly";
    if (billingInterval !== nextInterval) {
      setBillingInterval(nextInterval);
    }

    hasAutoStartedCheckout.current = true;
    void onPlanAction(plan, normalizedActivePlan === plan.id);
  }, [billingInterval, busyPlanId, isSignedIn, normalizedActivePlan, plans, searchParams]);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-center">
        <div className="bg-muted inline-flex items-center gap-1 rounded-md p-1">
          <Button
            size="sm"
            variant={billingInterval === "monthly" ? "default" : "ghost"}
            onClick={() => setBillingInterval("monthly")}
          >
            Monthly
          </Button>
          <Button
            size="sm"
            variant={billingInterval === "yearly" ? "default" : "ghost"}
            onClick={() => setBillingInterval("yearly")}
          >
            Yearly
          </Button>
        </div>
      </div>
      <div className="mx-auto grid max-w-6xl grid-cols-1 items-stretch gap-8 md:grid-cols-2 xl:grid-cols-4">
        {plans.map((plan) => {
          const displayPrice =
            billingInterval === "yearly" && plan.yearlyPrice ? plan.yearlyPrice : plan.price;
          const displayPeriod =
            billingInterval === "yearly" && plan.yearlyPeriod ? plan.yearlyPeriod : plan.period;
          const isPopular = Boolean(plan.popular);
          const isCurrent = normalizedActivePlan === plan.id;
          const isBusy = busyPlanId === plan.id;
          const badge = getActiveBadge(isCurrent, subscriptionStatus, isPopular);
          const canManageCurrentPlan = isCurrent && plan.id !== "free" && hasStripeCustomer;

          return (
            <Card
              key={plan.id}
              className={cn(
                "flex h-full flex-col overflow-hidden rounded-md border transition-all",
                isCurrent
                  ? "border-primary bg-primary/3 ring-primary/20 ring-2 shadow-lg"
                  : isPopular
                    ? "border-primary/70 shadow-md"
                    : "hover:border-primary/40 hover:shadow-sm",
              )}
            >
              <div className="min-h-10 px-4 pt-4">
                {badge ? (
                  <Badge variant={badge.variant} className="capitalize">
                    {badge.label}
                  </Badge>
                ) : (
                  <span className="inline-block h-5" aria-hidden />
                )}
              </div>
              <CardHeader className="min-h-28 px-4 pb-3 pt-0 text-center">
                <CardTitle className="text-lg">{plan.name}</CardTitle>
                <CardDescription className="mt-2 text-sm leading-relaxed">
                  {plan.description}
                </CardDescription>
              </CardHeader>
              <CardContent className="flex flex-1 flex-col px-4 pt-0">
                <div className="mb-3 min-h-16 border-y py-3 text-center">
                  <span className="text-3xl font-bold">{displayPrice}</span>
                  <span className="text-muted-foreground ml-1">{displayPeriod}</span>
                  {billingInterval === "yearly" && plan.yearlyCallout ? (
                    <p className="text-muted-foreground mt-2 text-xs">{plan.yearlyCallout}</p>
                  ) : null}
                </div>
                <ul className="flex-1 space-y-1.5">
                  {plan.features.map((feature) => (
                    <li key={feature} className="flex items-start gap-2">
                      <Check className="text-primary mt-0.5 size-3.5 shrink-0" />
                      <span className="text-xs leading-relaxed">{feature}</span>
                    </li>
                  ))}
                </ul>
                {plan.supportImpact ? (
                  <p className="text-muted-foreground mt-3 border-t pt-2 text-xs leading-relaxed">
                    {plan.supportImpact}
                  </p>
                ) : null}
              </CardContent>
              <CardFooter className="px-4 pb-4 pt-3">
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
                          : "Sign in & Subscribe"}
                </Button>
              </CardFooter>
            </Card>
          );
        })}
      </div>
    </div>
  );
}

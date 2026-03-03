import { pricingPageCopy, pricingPlans } from "@/features/pricing/pricing-data";
import { PriceColumns } from "@/features/pricing/price-columns";

/**
 * Describe account-aware rendering props for the pricing hero and cards.
 */
export interface ColumnPricingProps {
  currentTier: string;
  subscriptionStatus: string;
  hasStripeCustomer: boolean;
  isSignedIn: boolean;
}

/**
 * Render pricing content with active subscription indicators and actions.
 *
 * @param props - Current user subscription context from server-side data.
 * @returns The pricing hero and plan columns with Stripe-aware actions.
 */
export function ColumnPricing({
  currentTier,
  subscriptionStatus,
  hasStripeCustomer,
  isSignedIn,
}: ColumnPricingProps) {
  const hasPaidPlan = currentTier !== "free";

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
          <span>{hasPaidPlan ? `Current tier: ${currentTier}` : "Currently on free tier"}</span>
          <span className="hidden h-1 w-1 rounded-full bg-current/40 sm:inline-block" />
          <span className="capitalize">Status: {subscriptionStatus.replaceAll("_", " ")}</span>
          <span className="hidden h-1 w-1 rounded-full bg-current/40 sm:inline-block" />
          <span>{isSignedIn ? "Upgrade as your project grows" : "Sign in to subscribe"}</span>
        </div>
      </div>

      <PriceColumns
        plans={pricingPlans}
        activeTier={currentTier}
        subscriptionStatus={subscriptionStatus}
        hasStripeCustomer={hasStripeCustomer}
        isSignedIn={isSignedIn}
      />
    </div>
  );
}

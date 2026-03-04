import { pricingPlans } from "@/features/pricing/pricing-data";
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
  return (
    <div className="px-4 pb-4 lg:px-6">
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

import { pricingPageCopy } from "@/features/pricing/pricing-data";

/**
 * Describe props used to render the pricing page marketing header.
 */
export interface PricingPageHeaderProps {
  currentTier: string;
  subscriptionStatus: string;
  isSignedIn: boolean;
}

/**
 * Render the pricing page hero with positioning-focused marketing copy.
 *
 * @param props - Current account status context used in the header status row.
 * @returns A marketing-first pricing header with support and status messaging.
 */
export function PricingPageHeader({
  currentTier,
  subscriptionStatus,
  isSignedIn,
}: PricingPageHeaderProps) {
  const hasPaidPlan = currentTier !== "free";

  return (
    <div className="space-y-4 px-4 pt-4 lg:px-6">
      <div className="from-background to-muted/30 rounded-md border bg-linear-to-b p-6 md:p-10">
        <div className="mx-auto max-w-4xl text-center">
          <p className="text-primary/80 mb-3 text-xs font-semibold uppercase tracking-[0.2em]">
            Developer acceleration
          </p>
          <h1 className="mx-auto mb-4 max-w-3xl text-4xl font-bold tracking-tight md:text-5xl">
            {pricingPageCopy.headline}
          </h1>
          <p className="text-muted-foreground mx-auto max-w-3xl text-balance text-lg leading-relaxed md:text-xl">
            {pricingPageCopy.description}
          </p>
        </div>

        <div className="mt-6 grid gap-3 md:grid-cols-3">
          <div className="rounded-md border bg-background/60 p-4">
            <p className="text-sm font-semibold">Improve local environments</p>
            <p className="text-muted-foreground mt-2 text-sm">
              Copy proven setup standards for dependencies, tooling, and team onboarding.
            </p>
          </div>
          <div className="rounded-md border bg-background/60 p-4">
            <p className="text-sm font-semibold">Ship with fewer architecture misses</p>
            <p className="text-muted-foreground mt-2 text-sm">
              Learn from real repos before your team commits to expensive implementation paths.
            </p>
          </div>
          <div className="rounded-md border bg-background/60 p-4">
            <p className="text-sm font-semibold">Sustain builder-focused support</p>
            <p className="text-muted-foreground mt-2 text-sm">
              Paid subscriptions support platform progress while I navigate bone-cancer treatment.
            </p>
          </div>
        </div>
      </div>

      <div className="border-border bg-muted/30 rounded-md border p-4 text-sm">
        <p className="font-medium">Why this pricing model exists</p>
        <p className="text-muted-foreground mt-2">{pricingPageCopy.supportNote}</p>
      </div>

      <div className="text-muted-foreground flex flex-wrap items-center justify-center gap-x-4 gap-y-2 px-2 text-sm">
        <span>{hasPaidPlan ? `Current tier: ${currentTier}` : "Currently on free tier"}</span>
        <span className="hidden h-1 w-1 rounded-full bg-current/40 sm:inline-block" />
        <span className="capitalize">Status: {subscriptionStatus.replaceAll("_", " ")}</span>
        <span className="hidden h-1 w-1 rounded-full bg-current/40 sm:inline-block" />
        <span>{isSignedIn ? "Upgrade as your product grows" : "Sign in to subscribe"}</span>
      </div>
    </div>
  );
}

import { Button } from "@/components/ui/button";
import { pricingPageCopy } from "@/features/pricing/pricing-data";
import Link from "next/link";

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
  isSignedIn,
}: PricingPageHeaderProps) {
  const hasPaidPlan = currentTier !== "free";

  return (
    <div className="space-y-6 px-4 pt-4 lg:px-6">
      <div className="from-background via-background to-muted/30 relative overflow-hidden rounded-md border bg-linear-to-br p-6 md:p-8 lg:p-10">
        <div className="bg-primary/10 pointer-events-none absolute -right-20 -top-16 h-56 w-56 rounded-full blur-3xl" />
        <div className="bg-muted-foreground/10 pointer-events-none absolute -bottom-24 -left-16 h-52 w-52 rounded-full blur-3xl" />

        <div className="relative mx-auto grid max-w-5xl gap-8 lg:grid-cols-[1.7fr_1fr] lg:items-center">
          <div>
            <p className="text-primary/80 mb-3 text-xs font-semibold uppercase tracking-[0.2em]">
              Developer Acceleration
            </p>
            <h1 className="max-w-3xl text-4xl font-bold tracking-tight md:text-5xl">
              {pricingPageCopy.headline}
            </h1>
            <p className="text-muted-foreground mt-4 max-w-3xl text-balance text-base leading-relaxed md:text-lg">
              {pricingPageCopy.description}
            </p>

            <div className="mt-5 flex flex-wrap gap-2 text-xs font-medium">
              <span className="bg-background/90 rounded-full border px-3 py-1">Recipe breakdowns</span>
              <span className="bg-background/90 rounded-full border px-3 py-1">Architecture patterns</span>
              <span className="bg-background/90 rounded-full border px-3 py-1">Implementation support</span>
            </div>

            <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              <div className="rounded-md border bg-background/85 p-4">
                <p className="text-sm font-semibold">Setup confidence</p>
                <p className="text-muted-foreground mt-1.5 text-sm">
                  Standardize dependencies, scripts, and onboarding from proven repos.
                </p>
              </div>
              <div className="rounded-md border bg-background/85 p-4">
                <p className="text-sm font-semibold">Faster delivery</p>
                <p className="text-muted-foreground mt-1.5 text-sm">
                  Reuse architecture decisions that reduce rework and shipping delays.
                </p>
              </div>
              <div className="rounded-md border bg-background/85 p-4 sm:col-span-2 lg:col-span-1">
                <p className="text-sm font-semibold">Ongoing momentum</p>
                <p className="text-muted-foreground mt-1.5 text-sm">
                  Invest in a platform focused on practical guides for real production builds.
                </p>
              </div>
            </div>
          </div>

          <div className="bg-background/80 rounded-md border p-5 shadow-sm">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-foreground/80">Next step</p>
            <p className="text-muted-foreground mt-3 text-sm leading-relaxed">
              {isSignedIn
                ? `You're on ${hasPaidPlan ? currentTier : "the free tier"}. Choose the plan that matches your roadmap.`
                : "Sign in to unlock full analysis, AI Chef support, and one-click checkout."}
            </p>

            <div className="mt-4 grid gap-2">
              {isSignedIn ? (
                <Button asChild className="w-full">
                  <Link href="/pricing">Compare plans</Link>
                </Button>
              ) : (
                <>
                  <Button asChild className="w-full">
                    <Link href="/sign-in?redirect=%2Fpricing">Sign in to continue</Link>
                  </Button>
                  <Button asChild variant="outline" className="w-full">
                    <Link href="/sign-up?redirect=%2Fpricing">Create free account</Link>
                  </Button>
                </>
              )}
            </div>

            <div className="bg-primary/5 mt-4 rounded-md border p-3">
              <p className="text-sm font-medium">Your unfair shipping advantage</p>
              <p className="text-muted-foreground mt-1 text-xs leading-relaxed">
                Use battle-tested repo analysis and AI Chef guidance to ship faster with fewer costly missteps.
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="border-border bg-muted/30 rounded-md border p-4 text-sm md:p-5">
        <p className="font-medium">Why this pricing model exists</p>
        <p className="text-muted-foreground mt-2">{pricingPageCopy.supportNote}</p>
      </div>
    </div>
  );
}

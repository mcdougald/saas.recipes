import Link from "next/link";

import { Button } from "@/components/ui/button";
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
  isSignedIn,
}: PricingPageHeaderProps) {
  const hasPaidPlan = currentTier !== "free";

  return (
    <div className="space-y-6 px-4 pt-4 lg:px-6">
      <div className="from-background via-background to-muted/30 relative overflow-hidden rounded-md border bg-linear-to-br p-6 md:p-9 lg:p-12">
        <div className="bg-primary/10 pointer-events-none absolute -right-20 -top-16 h-56 w-56 rounded-full blur-3xl" />
        <div className="bg-muted-foreground/10 pointer-events-none absolute -bottom-24 -left-16 h-52 w-52 rounded-full blur-3xl" />

        <div className="relative mx-auto flex max-w-5xl flex-col gap-9 lg:gap-11">
          <div className="grid gap-8 lg:grid-cols-[1.7fr_1fr] lg:items-start">
            <div className="space-y-6 lg:space-y-7">
              <p className="text-primary/80 text-xs font-semibold uppercase tracking-[0.2em]">
                Developer Acceleration
              </p>
              <h1 className="max-w-3xl text-4xl font-bold tracking-tight md:text-5xl">
                {pricingPageCopy.headline}
              </h1>
              <p className="text-muted-foreground max-w-2xl text-balance text-base leading-relaxed md:text-lg">
                {pricingPageCopy.description}
              </p>
            </div>

            <div className="space-y-4">
              <div className="bg-background/80 rounded-md border p-6 shadow-sm">
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-foreground/80">
                  Next step
                </p>
                <p className="text-muted-foreground mt-3 text-sm leading-relaxed">
                  {isSignedIn
                    ? `You're on ${hasPaidPlan ? currentTier : "the free tier"}. Choose the plan that matches your roadmap.`
                    : "Sign in to unlock full analysis, AI Chef support, and one-click checkout."}
                </p>

                <div className="mt-5 grid gap-2.5">
                  {isSignedIn ? (
                    <Button asChild className="w-full">
                      <Link href="/pricing">Compare plans</Link>
                    </Button>
                  ) : (
                    <>
                      <Button asChild className="w-full">
                        <Link href="/sign-in?redirect=%2Fpricing">
                          Sign in to continue
                        </Link>
                      </Button>
                      <Button asChild variant="outline" className="w-full">
                        <Link href="/sign-up?redirect=%2Fpricing">
                          Create free account
                        </Link>
                      </Button>
                    </>
                  )}
                </div>
              </div>

              <div className="bg-primary/5 rounded-md border p-4">
                <p className="text-sm font-medium">
                  Your unfair shipping advantage
                </p>
                <p className="text-muted-foreground mt-1.5 text-xs leading-relaxed">
                  Use battle-tested repo analysis and AI Chef guidance to ship
                  faster with fewer costly missteps.
                </p>
              </div>
            </div>
          </div>

          <div className="border-t border-border/30 pt-5 md:pt-6">
            <div>
              <p className="text-[0.7rem] font-semibold uppercase tracking-[0.14em] text-foreground/70">
                Why the pricing models exist
              </p>
              <p className="text-muted-foreground mt-2 max-w-2xl text-xs leading-relaxed md:text-sm">
                {pricingPageCopy.supportNote}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

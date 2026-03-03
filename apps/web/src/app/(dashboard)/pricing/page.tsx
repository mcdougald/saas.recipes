import { ColumnPricing } from "@/features/pricing/column-pricing";
import { pricingPageCopy } from "@/features/pricing/pricing-data";
import { db } from "@/lib/db";
import { subscription, user } from "@/lib/db/schema";
import { getServerSession } from "@/lib/session";
import { and, desc, eq } from "drizzle-orm";

/**
 * Render the pricing dashboard with current account subscription state.
 *
 * @returns The pricing page with active tier and billing status context.
 */
export default async function PricingPage() {
  const session = await getServerSession();

  let currentTier = "free";
  let subscriptionStatus = "free";
  let hasStripeCustomer = false;

  if (session?.user.id) {
    const [userRows, subscriptionRows] = await Promise.all([
      db
        .select({
          stripeCustomerId: user.stripeCustomerId,
          subscriptionTier: user.subscriptionTier,
          subscriptionStatus: user.subscriptionStatus,
        })
        .from(user)
        .where(eq(user.id, session.user.id))
        .limit(1),
      db
        .select({
          status: subscription.status,
        })
        .from(subscription)
        .where(and(eq(subscription.userId, session.user.id)))
        .orderBy(desc(subscription.updatedAt))
        .limit(1),
    ]);

    const currentUser = userRows[0];
    const currentSubscription = subscriptionRows[0];

    currentTier = (currentUser?.subscriptionTier ?? "free").toLowerCase();
    subscriptionStatus = (
      currentSubscription?.status ??
      currentUser?.subscriptionStatus ??
      "free"
    ).toLowerCase();
    hasStripeCustomer = Boolean(currentUser?.stripeCustomerId);
  }

  return (
    <section className="space-y-8">
      <ColumnPricing
        currentTier={currentTier}
        subscriptionStatus={subscriptionStatus}
        hasStripeCustomer={hasStripeCustomer}
        isSignedIn={Boolean(session?.user.id)}
      />
      <div className="border-border bg-muted/30 mx-4 rounded-lg border p-4 text-sm lg:mx-6">
        <p className="font-medium">Why this pricing model exists</p>
        <p className="text-muted-foreground mt-2">{pricingPageCopy.supportNote}</p>
      </div>
    </section>
  );
}

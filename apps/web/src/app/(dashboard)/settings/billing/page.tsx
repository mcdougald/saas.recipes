import { and, desc, eq } from "drizzle-orm";
import Link from "next/link";
import { redirect } from "next/navigation";
import type Stripe from "stripe";

import { ContentSection } from "@/components/content-section";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { db } from "@/lib/db";
import { subscription, user } from "@/lib/db/schema";
import { getServerSession } from "@/lib/session";
import { stripe } from "@/lib/stripe";

export const dynamic = "force-dynamic";

const tierLabels: Record<string, string> = {
  free: "Free",
  basic: "Basic",
  pro: "Pro",
  enterprise: "Enterprise",
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
};

function formatCurrency(
  amountInCents: number | null | undefined,
  currency = "usd",
) {
  const amount = (amountInCents ?? 0) / 100;
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: currency.toUpperCase(),
  }).format(amount);
}

function formatDate(date: Date | number | string | null | undefined) {
  if (!date) {
    return "N/A";
  }

  const value = date instanceof Date ? date : new Date(date);
  if (Number.isNaN(value.getTime())) {
    return "N/A";
  }

  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(value);
}

/**
 * Render billing details for the authenticated user.
 *
 * @returns The settings billing page with subscription and purchase history.
 */
export default async function BillingSettingsPage() {
  const session = await getServerSession();

  if (!session?.user.id) {
    return (
      <ContentSection
        title="Billing"
        desc="Manage your subscription and review purchases."
      >
        <Card>
          <CardHeader>
            <CardTitle>Sign in required</CardTitle>
            <CardDescription>
              Sign in to view your current plan and purchase history.
            </CardDescription>
          </CardHeader>
        </Card>
      </ContentSection>
    );
  }

  const userPromise = db
    .select({
      id: user.id,
      stripeCustomerId: user.stripeCustomerId,
      subscriptionStatus: user.subscriptionStatus,
      subscriptionTier: user.subscriptionTier,
      subscriptionEndDate: user.subscriptionEndDate,
    })
    .from(user)
    .where(eq(user.id, session.user.id))
    .limit(1);

  const subscriptionPromise = db
    .select({
      id: subscription.id,
      stripePriceId: subscription.stripePriceId,
      stripeCurrentPeriodEnd: subscription.stripeCurrentPeriodEnd,
      status: subscription.status,
      cancelAtPeriodEnd: subscription.cancelAtPeriodEnd,
      updatedAt: subscription.updatedAt,
    })
    .from(subscription)
    .where(and(eq(subscription.userId, session.user.id)))
    .orderBy(desc(subscription.updatedAt))
    .limit(1);

  const [userRows, subscriptionRows] = await Promise.all([
    userPromise,
    subscriptionPromise,
  ]);

  const currentUser = userRows[0];
  const currentSubscription = subscriptionRows[0];
  const normalizedTier = (
    currentUser?.subscriptionTier ?? "free"
  ).toLowerCase();
  const planName = tierLabels[normalizedTier] ?? normalizedTier;
  const status = (currentSubscription?.status ??
    currentUser?.subscriptionStatus ??
    "free") as string;
  const statusVariant = statusBadgeVariant[status] ?? "outline";

  let invoices: Stripe.Invoice[] = [];
  let stripeLoadError: string | null = null;

  if (stripe && currentUser?.stripeCustomerId) {
    try {
      const invoiceList = await stripe.invoices.list({
        customer: currentUser.stripeCustomerId,
        limit: 12,
      });
      invoices = invoiceList.data;
    } catch (error) {
      console.error("Failed to load Stripe invoices:", error);
      stripeLoadError = "Could not load purchases from Stripe right now.";
    }
  }

  async function openBillingPortal() {
    "use server";

    if (!stripe) {
      redirect("/pricing");
    }

    const actionSession = await getServerSession();
    if (!actionSession?.user.id) {
      redirect("/sign-in");
    }

    const actionUserRows = await db
      .select({
        stripeCustomerId: user.stripeCustomerId,
      })
      .from(user)
      .where(eq(user.id, actionSession.user.id))
      .limit(1);

    const customerId = actionUserRows[0]?.stripeCustomerId;
    if (!customerId) {
      redirect("/pricing");
    }

    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:4000";
    const portalSession = await stripe.billingPortal.sessions.create({
      customer: customerId,
      return_url: `${baseUrl}/settings/billing`,
    });

    redirect(portalSession.url);
  }

  return (
    <ContentSection
      title="Billing"
      desc="Manage your subscription and review your purchases."
    >
      <div className="space-y-6 pb-4">
        <Card>
          <CardHeader>
            <CardTitle>Current subscription</CardTitle>
            <CardDescription>
              Your active plan, renewal status, and Stripe account link.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">Plan</p>
                <p className="text-lg font-semibold">{planName}</p>
              </div>
              <Badge variant={statusVariant} className="capitalize">
                {status.replaceAll("_", " ")}
              </Badge>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <p className="text-sm text-muted-foreground">
                  Next billing date
                </p>
                <p className="font-medium">
                  {formatDate(
                    currentSubscription?.stripeCurrentPeriodEnd ??
                      currentUser?.subscriptionEndDate,
                  )}
                </p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Cancellation</p>
                <p className="font-medium">
                  {currentSubscription?.cancelAtPeriodEnd
                    ? "Cancels at period end"
                    : "Auto-renewing"}
                </p>
              </div>
            </div>

            <div className="flex flex-wrap gap-3">
              {currentUser?.stripeCustomerId ? (
                <form action={openBillingPortal}>
                  <Button type="submit">Manage subscription</Button>
                </form>
              ) : (
                <Button asChild>
                  <Link href="/pricing">Choose a plan</Link>
                </Button>
              )}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Purchases</CardTitle>
            <CardDescription>
              Recent invoices and payment outcomes from Stripe.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {stripeLoadError ? (
              <p className="text-sm text-destructive">{stripeLoadError}</p>
            ) : null}

            {invoices.length === 0 ? (
              <p className="text-sm text-muted-foreground">
                No purchases found yet. When you subscribe, invoices will appear
                here.
              </p>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Date</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Receipt</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {invoices.map((invoice) => (
                    <TableRow key={invoice.id}>
                      <TableCell>
                        {formatDate(invoice.created * 1000)}
                      </TableCell>
                      <TableCell>
                        {formatCurrency(
                          invoice.amount_paid || invoice.amount_due,
                          invoice.currency,
                        )}
                      </TableCell>
                      <TableCell className="capitalize">
                        {invoice.status?.replaceAll("_", " ") ?? "unknown"}
                      </TableCell>
                      <TableCell className="text-right">
                        {invoice.hosted_invoice_url ? (
                          <Button asChild size="sm" variant="outline">
                            <Link
                              href={invoice.hosted_invoice_url}
                              target="_blank"
                              rel="noreferrer"
                            >
                              View
                            </Link>
                          </Button>
                        ) : (
                          <span className="text-sm text-muted-foreground">
                            N/A
                          </span>
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
      </div>
    </ContentSection>
  );
}

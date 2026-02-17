import { NextRequest, NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { db } from "@/lib/db";
import { user } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { getPostHogClient, shutdownPostHog } from "@/lib/posthog-server";

export async function POST(req: NextRequest) {
  try {
    if (!stripe) {
      return NextResponse.json(
        { error: "Stripe is not configured" },
        { status: 500 },
      );
    }

    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Get user's Stripe customer ID
    const users = await db
      .select()
      .from(user)
      .where(eq(user.id, session.user.id))
      .limit(1);

    if (users.length === 0 || !users[0].stripeCustomerId) {
      return NextResponse.json(
        { error: "No subscription found" },
        { status: 404 },
      );
    }

    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:4000";

    const portalSession = await stripe.billingPortal.sessions.create({
      customer: users[0].stripeCustomerId,
      return_url: `${baseUrl}/dashboard/settings`,
    });

    // Track billing portal opened event
    const posthog = getPostHogClient();
    posthog.capture({
      distinctId: session.user.id,
      event: "billing_portal_opened",
      properties: {
        customer_id: users[0].stripeCustomerId,
      },
    });
    await shutdownPostHog();

    return NextResponse.json({ url: portalSession.url });
  } catch (error) {
    console.error("Error creating portal session:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}

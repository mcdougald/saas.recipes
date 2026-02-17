import { NextRequest, NextResponse } from "next/server";
import { stripe, STRIPE_PLANS } from "@/lib/stripe";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
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

    const { priceId } = await req.json();

    // Get the price ID from environment variables based on the plan
    let stripePriceId: string | undefined;
    if (priceId === "basic") {
      stripePriceId = STRIPE_PLANS.BASIC.stripePriceId;
    } else if (priceId === "pro") {
      stripePriceId = STRIPE_PLANS.PRO.stripePriceId;
    } else if (priceId === "enterprise") {
      stripePriceId = STRIPE_PLANS.ENTERPRISE.stripePriceId;
    }

    if (!stripePriceId) {
      return NextResponse.json({ error: "Invalid price ID" }, { status: 400 });
    }

    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:4000";

    const checkoutSession = await stripe.checkout.sessions.create({
      customer_email: session.user.email,
      client_reference_id: session.user.id,
      mode: "subscription",
      payment_method_types: ["card"],
      line_items: [
        {
          price: stripePriceId,
          quantity: 1,
        },
      ],
      success_url: `${baseUrl}/dashboard?success=true`,
      cancel_url: `${baseUrl}/pricing?canceled=true`,
      metadata: {
        userId: session.user.id,
      },
    });

    // Track checkout session creation in PostHog
    const posthog = getPostHogClient();
    posthog.capture({
      distinctId: session.user.id,
      event: "checkout_session_created",
      properties: {
        plan_id: priceId,
        checkout_session_id: checkoutSession.id,
        email: session.user.email,
      },
    });
    await shutdownPostHog();

    return NextResponse.json({ url: checkoutSession.url });
  } catch (error) {
    console.error("Error creating checkout session:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}

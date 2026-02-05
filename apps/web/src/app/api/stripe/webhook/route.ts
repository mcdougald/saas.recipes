import { NextRequest, NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";
import { db } from "@/lib/db";
import { user, subscription } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import Stripe from "stripe";

export async function POST(req: NextRequest) {
  const body = await req.text();
  const signature = req.headers.get("stripe-signature");

  if (!signature) {
    return NextResponse.json({ error: "No signature" }, { status: 400 });
  }

  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
  if (!webhookSecret) {
    console.error("STRIPE_WEBHOOK_SECRET is not set");
    return NextResponse.json({ error: "Webhook secret not configured" }, { status: 500 });
  }

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
  } catch (err) {
    console.error("Webhook signature verification failed:", err);
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  try {
    switch (event.type) {
      case "checkout.session.completed": {
        const session = event.data.object as Stripe.Checkout.Session;
        const userId = session.metadata?.userId;

        if (!userId) {
          console.error("No userId in session metadata");
          break;
        }

        // Update user with Stripe customer ID
        if (session.customer) {
          await db
            .update(user)
            .set({
              stripeCustomerId: session.customer as string,
              subscriptionStatus: "active",
            })
            .where(eq(user.id, userId));
        }
        break;
      }

      case "customer.subscription.created":
      case "customer.subscription.updated": {
        const sub = event.data.object as Stripe.Subscription;
        const customerId = sub.customer as string;

        // Find user by Stripe customer ID
        const users = await db
          .select()
          .from(user)
          .where(eq(user.stripeCustomerId, customerId))
          .limit(1);

        if (users.length === 0) {
          console.error("No user found for customer:", customerId);
          break;
        }

        const userId = users[0].id;
        const priceId = sub.items.data[0]?.price.id;
        
        // Determine subscription tier
        let tier = "free";
        if (priceId === process.env.STRIPE_PRO_MONTHLY_PRICE_ID) {
          tier = "pro";
        } else if (priceId === process.env.STRIPE_ENTERPRISE_MONTHLY_PRICE_ID) {
          tier = "enterprise";
        }

        // Update or create subscription
        await db
          .insert(subscription)
          .values({
            id: sub.id,
            userId,
            stripeSubscriptionId: sub.id,
            stripePriceId: priceId,
            status: sub.status,
            stripeCurrentPeriodEnd: new Date(sub.current_period_end * 1000),
            cancelAtPeriodEnd: sub.cancel_at_period_end,
          })
          .onConflictDoUpdate({
            target: subscription.id,
            set: {
              status: sub.status,
              stripePriceId: priceId,
              stripeCurrentPeriodEnd: new Date(sub.current_period_end * 1000),
              cancelAtPeriodEnd: sub.cancel_at_period_end,
              updatedAt: new Date(),
            },
          });

        // Update user subscription info
        await db
          .update(user)
          .set({
            subscriptionStatus: sub.status,
            subscriptionTier: tier,
            subscriptionEndDate: new Date(sub.current_period_end * 1000),
          })
          .where(eq(user.id, userId));
        break;
      }

      case "customer.subscription.deleted": {
        const sub = event.data.object as Stripe.Subscription;
        const customerId = sub.customer as string;

        // Find user by Stripe customer ID
        const users = await db
          .select()
          .from(user)
          .where(eq(user.stripeCustomerId, customerId))
          .limit(1);

        if (users.length === 0) {
          console.error("No user found for customer:", customerId);
          break;
        }

        const userId = users[0].id;

        // Update subscription status
        await db
          .update(subscription)
          .set({
            status: "canceled",
            updatedAt: new Date(),
          })
          .where(eq(subscription.userId, userId));

        // Update user to free tier
        await db
          .update(user)
          .set({
            subscriptionStatus: "canceled",
            subscriptionTier: "free",
            subscriptionEndDate: new Date(sub.current_period_end * 1000),
          })
          .where(eq(user.id, userId));
        break;
      }

      default:
        console.log(`Unhandled event type: ${event.type}`);
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error("Error processing webhook:", error);
    return NextResponse.json({ error: "Webhook handler failed" }, { status: 500 });
  }
}

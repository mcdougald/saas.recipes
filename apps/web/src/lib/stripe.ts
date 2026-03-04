import Stripe from "stripe";

const stripeSecretKey = process.env.STRIPE_SECRET_KEY || "";

// Only throw error in runtime if stripe is actually used
export const stripe = stripeSecretKey 
  ? new Stripe(stripeSecretKey, {
      apiVersion: "2026-02-25.clover",
      typescript: true,
    })
  : null;

/**
 * Define Stripe plan metadata and environment price identifiers.
 */
export const STRIPE_PLANS = {
  FREE: {
    name: "Free",
    price: 0,
    interval: "month" as const,
    features: [
      "Limited, temporary access",
      "Browse recipes & view demos",
      "Community support",
    ],
  },
  BASIC: {
    name: "Pro",
    price: 1499, // $14.99 in cents
    interval: "month" as const,
    stripePriceId: process.env.STRIPE_PRO_MONTHLY_PRICE_ID,
    stripeYearlyPriceId: process.env.STRIPE_PRO_YEARLY_PRICE_ID,
    features: [
      "Full access to recipes and implementation breakdowns",
      "AI Chef guidance for dev environment decisions",
      "Priority support",
    ],
  },
  PRO: {
    name: "Legacy Pro",
    price: 1499, // Legacy alias for compatibility
    interval: "month" as const,
    stripePriceId: process.env.STRIPE_PRO_MONTHLY_PRICE_ID,
    stripeYearlyPriceId: process.env.STRIPE_PRO_YEARLY_PRICE_ID,
    features: [
      "Same as Basic plan",
    ],
  },
  PRO_PLUS: {
    name: "Pro+",
    price: 3499, // $34.99 in cents
    interval: "month" as const,
    stripePriceId: process.env.STRIPE_PRO_PLUS_MONTHLY_PRICE_ID,
    stripeYearlyPriceId: process.env.STRIPE_PRO_PLUS_YEARLY_PRICE_ID,
    features: [
      "Everything in Pro",
      "1-1 implementation support",
      "Priority response windows",
    ],
  },
  ENTERPRISE: {
    name: "Enterprise",
    price: 9999, // $99.99 in cents
    interval: "month" as const,
    stripePriceId: process.env.STRIPE_ENTERPRISE_MONTHLY_PRICE_ID,
    stripeYearlyPriceId: process.env.STRIPE_ENTERPRISE_YEARLY_PRICE_ID,
    features: [
      "Everything in Pro",
      "Team rollout and standardization support",
      "Priority enterprise support",
    ],
  },
} as const;

import Stripe from "stripe";

const stripeSecretKey = process.env.STRIPE_SECRET_KEY || "";

// Only throw error in runtime if stripe is actually used
export const stripe = stripeSecretKey 
  ? new Stripe(stripeSecretKey, {
      apiVersion: "2026-01-28.clover",
      typescript: true,
    })
  : null;

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
    name: "Basic",
    price: 900, // $9.00 in cents
    interval: "month" as const,
    stripePriceId: process.env.STRIPE_BASIC_MONTHLY_PRICE_ID,
    features: [
      "Full access — no time limits",
      "Notes & repository recipes",
      "All live projects",
      "Unlimited recipe browsing",
      "Community support",
    ],
  },
  PRO: {
    name: "Pro",
    price: 1900, // $19.00 in cents
    interval: "month" as const,
    stripePriceId: process.env.STRIPE_PRO_MONTHLY_PRICE_ID,
    features: [
      "Everything in Basic",
      "AI Chef — recipe help & guidance",
      "My Help — direct access to my time",
    ],
  },
  ENTERPRISE: {
    name: "Enterprise",
    price: 4900, // $49.00 in cents
    interval: "month" as const,
    stripePriceId: process.env.STRIPE_ENTERPRISE_MONTHLY_PRICE_ID,
    features: [
      "Everything in Pro",
      "For teams — workspace & sharing",
      "AI Chef for the whole team",
      "Priority My Help (my time)",
      "Early access to new recipes",
    ],
  },
} as const;

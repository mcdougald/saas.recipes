import Stripe from "stripe";

if (!process.env.STRIPE_SECRET_KEY) {
  throw new Error("STRIPE_SECRET_KEY environment variable is not set");
}

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: "2024-12-18.acacia",
  typescript: true,
});

export const STRIPE_PLANS = {
  FREE: {
    name: "Free",
    price: 0,
    interval: "month" as const,
    features: [
      "Basic dashboard access",
      "Up to 3 projects",
      "Community support",
    ],
  },
  PRO: {
    name: "Pro",
    price: 1900, // $19.00 in cents
    interval: "month" as const,
    stripePriceId: process.env.STRIPE_PRO_MONTHLY_PRICE_ID,
    features: [
      "Everything in Free",
      "Unlimited projects",
      "Priority support",
      "Advanced analytics",
      "Custom integrations",
    ],
  },
  ENTERPRISE: {
    name: "Enterprise",
    price: 4900, // $49.00 in cents
    interval: "month" as const,
    stripePriceId: process.env.STRIPE_ENTERPRISE_MONTHLY_PRICE_ID,
    features: [
      "Everything in Pro",
      "Dedicated account manager",
      "SLA guarantee",
      "Custom features",
      "On-premise deployment option",
    ],
  },
} as const;

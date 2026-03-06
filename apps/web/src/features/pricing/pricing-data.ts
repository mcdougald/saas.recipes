/**
 * Describe a pricing plan card shown in pricing views.
 */
export type PricingPlan = {
  id: string;
  name: string;
  description: string;
  price: string;
  period: string;
  yearlyPrice?: string;
  yearlyPeriod?: string;
  yearlyCallout?: string;
  features: string[];
  buttonText: string;
  variant: "default" | "outline" | "secondary";
  popular?: boolean;
  supportImpact?: string;
};

/**
 * Describe one feature row used by comparison-style pricing tables.
 */
export type PricingFeatureRow = {
  name: string;
  values: Record<string, string | boolean>;
};

/**
 * Provide top-level marketing copy used across pricing layouts.
 */
export const pricingPageCopy = {
  headline: "Cook Better Code, Faster",
  description:
    "SaaS.Recipes analyzes real SaaS codebases and pairs each breakdown with AI Chef, your helper for setup, architecture decisions, and production-ready execution.",
  supportNote:
    "Paid plans fund platform development, deeper product research, and faster rollout of high-impact features while I continue dealing with bone-tumors.",
};

/**
 * Define all available plans and their billing display metadata.
 */
export const pricingPlans: PricingPlan[] = [
  {
    id: "free",
    name: "Free",
    description:
      "Get started with focused guidance for improving your dev environment.",
    price: "$0",
    period: "/month",
    yearlyPrice: "$0",
    yearlyPeriod: "/year",
    features: [
      "Starter access to selected architecture and tooling breakdowns",
      "See proven repo setup patterns before you commit to a stack",
      "Community support",
    ],
    buttonText: "Start for Free",
    variant: "outline",
  },
  {
    id: "pro",
    name: "Pro",
    description: "For developers who want full access and implementation help.",
    price: "$14.99",
    period: "/month",
    yearlyPrice: "$149.99",
    yearlyPeriod: "/year",
    yearlyCallout: "Save 17% with annual billing",
    features: [
      "Full access to all recipe breakdowns and playbooks",
      "AI Chef guidance for better environment and architecture decisions",
      "Priority support when you're stuck in setup or integration work",
      "Directly supports ongoing platform development and stability",
    ],
    buttonText: "Upgrade to Pro",
    variant: "default",
    popular: true,
    supportImpact: "Supports product progress and sustained founder-led output.",
  },
  {
    id: "pro_plus",
    name: "Pro+",
    description: "For builders who want dedicated 1-1 implementation support.",
    price: "$34.99",
    period: "/month",
    yearlyPrice: "$349.99",
    yearlyPeriod: "/year",
    yearlyCallout: "Save 17% with annual billing",
    features: [
      "Everything in Pro",
      "1-1 support for architecture and delivery blockers",
      "Direct review of your dev-environment setup and workflows",
      "Priority async help for high-impact implementation decisions",
    ],
    buttonText: "Upgrade to Pro+",
    variant: "secondary",
    supportImpact:
      "Adds direct founder support while sustaining focused product development.",
  },
  {
    id: "enterprise",
    name: "Enterprise",
    description:
      "For teams standardizing dev environments and delivery workflows.",
    price: "$99.99",
    period: "/month",
    yearlyPrice: "$999.99",
    yearlyPeriod: "/year",
    yearlyCallout: "Save 17% with annual billing",
    features: [
      "Everything in Pro",
      "Team onboarding for shared tooling standards and CI confidence",
      "Org-wide workflow and environment optimization guidance",
      "Priority roadmap collaboration and support",
    ],
    buttonText: "Choose Enterprise",
    variant: "outline",
    supportImpact:
      "Accelerates platform investment for higher-impact team needs.",
  },
];

/**
 * Compare plans across high-level capability categories.
 */
export const pricingComparisonRows: PricingFeatureRow[] = [
  {
    name: "Content access",
    values: {
      free: "Limited",
      pro: "Full",
      pro_plus: "Full + 1-1 support",
      enterprise: "Full + org-level support",
    },
  },
  {
    name: "Live project breakdowns",
    values: {
      free: true,
      pro: true,
      pro_plus: true,
      enterprise: true,
    },
  },
  {
    name: "Personal time with founder",
    values: {
      free: false,
      pro: true,
      pro_plus: true,
      enterprise: true,
    },
  },
  {
    name: "AI Chef implementation help",
    values: {
      free: false,
      pro: true,
      pro_plus: true,
      enterprise: true,
    },
  },
  {
    name: "Direct support of product + dev efforts",
    values: {
      free: false,
      pro: "Expanded",
      pro_plus: "Priority 1-1",
      enterprise: "Maximum",
    },
  },
  {
    name: "Team / business support",
    values: {
      free: false,
      pro: false,
      pro_plus: false,
      enterprise: true,
    },
  },
  {
    name: "GitHub org/team repo indexing",
    values: {
      free: false,
      pro: false,
      pro_plus: false,
      enterprise: true,
    },
  },
];

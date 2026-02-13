export type PricingPlan = {
  id: string;
  name: string;
  description: string;
  price: string;
  period: string;
  features: string[];
  buttonText: string;
  variant: "default" | "outline" | "secondary";
  popular?: boolean;
  supportImpact?: string;
};

export type PricingFeatureRow = {
  name: string;
  values: Record<string, string | boolean>;
};

export const pricingPageCopy = {
  headline: "Fund Better Builder Outcomes",
  description:
    "Choose a plan that helps sustain my health and focused development time while improving the saas.recipes learning and devtool resource.",
  supportNote:
    "Paid plans are direct support for consistent maintenance, deeper breakdowns, and better practical learning resources for the community.",
};

export const pricingPlans: PricingPlan[] = [
  {
    id: "free",
    name: "Explorer",
    description: "The SaaS.Recipes platform is free & secure for anyone to try.",
    price: "$0",
    period: "/month",
    features: [
      "Limited access to selected recipe breakdowns",
      "Preview live project examples",
      "Community support",
    ],
    buttonText: "Start Exploring",
    variant: "outline",
  },
  {
    id: "starter",
    name: "Starter Support",
    description: "Affordable support for builders who want full core access.",
    price: "$9",
    period: "/month",
    features: [
      "Full access to all learning and repo breakdown content",
      "Supports ongoing maintenance and platform improvements",
      "Community support",
      "No AI Chef or personal time included",
    ],
    buttonText: "Start Starter Support",
    variant: "outline",
    supportImpact:
      "Your plan helps fund healthier work rhythms and faster product improvements.",
  },
  {
    id: "supporter",
    name: "Builder Support",
    description: "Includes AI Chef and direct personal guidance.",
    price: "$19",
    period: "/month",
    features: [
      "AI Chef support for implementation guidance",
      "Direct personal time for help and feedback",
      "Everything in Starter Support",
      "Directly supports my health and focused development time",
      "Priority updates as the devtool resource evolves",
    ],
    buttonText: "Choose Builder Support",
    variant: "default",
    popular: true,
    supportImpact:
      "Your plan helps fund healthier work rhythms and faster product improvements.",
  },
  {
    id: "enterprise",
    name: "Enterprise Support",
    description:
      "Business support for teams that want org-wide repo indexing and coaching.",
    price: "$99",
    period: "/month",
    features: [
      "Everything in Builder Support",
      "Index an entire GitHub organization/team repository portfolio",
      "Hands-on support to help your team 'cook' better development workflows",
      "Priority business support and roadmap collaboration",
    ],
    buttonText: "Choose Enterprise Support",
    variant: "outline",
    supportImpact:
      "Funds the deepest product investment and team-level improvements for high-impact users.",
  },
];

export const pricingComparisonRows: PricingFeatureRow[] = [
  {
    name: "Content access",
    values: {
      free: "Limited",
      starter: "Full",
      supporter: "Full",
      enterprise: "Full + org-level support",
    },
  },
  {
    name: "Live project breakdowns",
    values: {
      free: true,
      starter: true,
      supporter: true,
      enterprise: true,
    },
  },
  {
    name: "Personal time with founder",
    values: {
      free: false,
      starter: false,
      supporter: true,
      enterprise: true,
    },
  },
  {
    name: "AI Chef implementation help",
    values: {
      free: false,
      starter: false,
      supporter: true,
      enterprise: true,
    },
  },
  {
    name: "Direct support of health + dev efforts",
    values: {
      free: false,
      starter: "Core",
      supporter: "Expanded",
      enterprise: "Maximum",
    },
  },
  {
    name: "Team / business support",
    values: {
      free: false,
      starter: false,
      supporter: false,
      enterprise: true,
    },
  },
  {
    name: "GitHub org/team repo indexing",
    values: {
      free: false,
      starter: false,
      supporter: false,
      enterprise: true,
    },
  },
];

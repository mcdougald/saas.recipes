/**
 * Allowed icon identifiers for help center category cards.
 */
export type HelpCategoryIcon =
  | "sparkles"
  | "bookOpen"
  | "settings"
  | "creditCard"
  | "shield"
  | "messageSquare"
  | "keyRound";

/**
 * A high-level help center category used for quick navigation.
 */
export interface HelpCategory {
  id: string;
  title: string;
  description: string;
  icon: HelpCategoryIcon;
  color: string;
  bgColor: string;
  borderColor: string;
  articleCount: number;
}

/**
 * A top article surfaced in the help center listing.
 */
export interface HelpArticle {
  id: string;
  title: string;
  description: string;
  category: string;
  readTime: string;
  views: string;
  href: string;
}

/**
 * A single FAQ entry shown inside a section accordion.
 */
export interface HelpFAQ {
  id: string;
  question: string;
  answer: string;
}

/**
 * FAQ section used by the help center accordion.
 */
export interface HelpFAQSection {
  id: string;
  category: string;
  questions: HelpFAQ[];
}

/**
 * Suggested topics used for quick-query chips in the hero.
 */
export const HELP_CENTER_SUGGESTED_TOPICS = [
  "Getting started",
  "Recipes & repos",
  "Plans & pricing",
  "Billing",
  "AI Chef",
] as const;

/**
 * Primary category cards displayed in the help center.
 */
export const HELP_CENTER_CATEGORIES: HelpCategory[] = [
  {
    id: "getting-started",
    title: "Getting Started",
    description: "Set up your account and explore saas.recipes",
    icon: "sparkles",
    color: "text-primary",
    bgColor: "bg-primary/10",
    borderColor: "border-primary/20",
    articleCount: 8,
  },
  {
    id: "recipes-repositories",
    title: "Recipes & Repositories",
    description: "Browse recipes, repos, and codebase patterns",
    icon: "bookOpen",
    color: "text-amber-500",
    bgColor: "bg-amber-500/10",
    borderColor: "border-amber-500/20",
    articleCount: 14,
  },
  {
    id: "account-settings",
    title: "Account & Settings",
    description: "Profile, preferences, and security",
    icon: "settings",
    color: "text-blue-500",
    bgColor: "bg-blue-500/10",
    borderColor: "border-blue-500/20",
    articleCount: 6,
  },
  {
    id: "billing-subscriptions",
    title: "Billing & Subscriptions",
    description: "Plans, payment, and subscription management",
    icon: "creditCard",
    color: "text-emerald-500",
    bgColor: "bg-emerald-500/10",
    borderColor: "border-emerald-500/20",
    articleCount: 10,
  },
  {
    id: "security-privacy",
    title: "Security & Privacy",
    description: "2FA, passwords, and data security",
    icon: "shield",
    color: "text-red-500",
    bgColor: "bg-red-500/10",
    borderColor: "border-red-500/20",
    articleCount: 7,
  },
  {
    id: "support-contact",
    title: "Support & Contact",
    description: "Get help or reach the team",
    icon: "messageSquare",
    color: "text-pink-500",
    bgColor: "bg-pink-500/10",
    borderColor: "border-pink-500/20",
    articleCount: 4,
  },
  {
    id: "api-docs",
    title: "API & Developer Docs",
    description: "API access and integration guides",
    icon: "keyRound",
    color: "text-cyan-500",
    bgColor: "bg-cyan-500/10",
    borderColor: "border-cyan-500/20",
    articleCount: 12,
  },
];

/**
 * Popular articles users can jump into from the help center.
 */
export const HELP_CENTER_POPULAR_ARTICLES: HelpArticle[] = [
  {
    id: "getting-started-with-saas-recipes",
    title: "Getting started with saas.recipes",
    description:
      "Sign up, explore recipes and live project demos, and choose the right plan for you.",
    category: "Getting Started",
    readTime: "5 min",
    views: "12.5k",
    href: "/dashboard",
  },
  {
    id: "understanding-plans",
    title: "Understanding plans: Free, Basic, Pro & Enterprise",
    description:
      "What's included in each plan and how to upgrade or change your subscription.",
    category: "Billing & Subscriptions",
    readTime: "4 min",
    views: "9.1k",
    href: "/pricing",
  },
  {
    id: "using-dashboard-live-projects",
    title: "Using the dashboard and live projects",
    description:
      "Navigate the dashboard, view live project demos, and use repository recipes.",
    category: "Recipes & Repositories",
    readTime: "6 min",
    views: "8.2k",
    href: "/dashboard",
  },
  {
    id: "setup-two-factor-authentication",
    title: "Setting up two-factor authentication",
    description:
      "Step-by-step instructions to secure your saas.recipes account with 2FA.",
    category: "Security & Privacy",
    readTime: "3 min",
    views: "15.3k",
    href: "/settings/account",
  },
  {
    id: "manage-billing-payment-methods",
    title: "Managing billing and payment methods",
    description:
      "Update payment details, view invoices, and manage your subscription.",
    category: "Billing & Subscriptions",
    readTime: "4 min",
    views: "7.4k",
    href: "/payment-dashboard",
  },
  {
    id: "account-settings-preferences",
    title: "Account settings and preferences",
    description:
      "Update your profile, email, password, and notification preferences.",
    category: "Account & Settings",
    readTime: "4 min",
    views: "6.7k",
    href: "/settings",
  },
];

/**
 * FAQ sections and entries rendered in the accordion.
 */
export const HELP_CENTER_FAQ_SECTIONS: HelpFAQSection[] = [
  {
    id: "getting-started",
    category: "Getting Started",
    questions: [
      {
        id: "create-account",
        question: "How do I create an account?",
        answer:
          "Click Sign up in the header and enter your email and a password. After verifying your email, you can explore saas.recipes and browse recipes and demos according to your plan.",
      },
      {
        id: "included-in-each-plan",
        question: "What's included in each plan?",
        answer:
          "Free gives limited access to browse recipes and view demos. Basic includes full access to notes, repository recipes, and all live projects. Pro adds the AI Chef and My Help. Enterprise is for teams: everything in Pro plus team workspace, sharing, and priority support.",
      },
      {
        id: "how-to-get-started",
        question: "How do I get started?",
        answer:
          "Sign up for a free account, then use the dashboard to browse recipes and live project demos. Upgrade to Basic for full access to recipes and projects, or to Pro for the AI Chef and My Help when you're ready.",
      },
    ],
  },
  {
    id: "recipes-content",
    category: "Recipes & Content",
    questions: [
      {
        id: "what-are-recipes",
        question: "What are recipes?",
        answer:
          "Recipes are proven patterns and implementations from indie devs and teams, auth, billing, security, and more. You get codebase insights, real examples, and patterns that match how you work. Browse by category or use the dashboard to explore.",
      },
      {
        id: "reuse-recipe-code",
        question: "Can I use recipe code in my own project?",
        answer:
          "Yes. Recipes are meant to be copied and adapted. Use what fits your stack, skip the wiring, and ship faster. Check each recipe for license and usage details.",
      },
    ],
  },
  {
    id: "account-settings",
    category: "Account & Settings",
    questions: [
      {
        id: "change-password",
        question: "How do I change my password?",
        answer:
          "Go to Settings > Account (or Security). Enter your current password and your new password twice. Use at least 8 characters with a mix of letters, numbers, and symbols.",
      },
      {
        id: "change-email-address",
        question: "Can I change my email address?",
        answer:
          "Yes. Update your email in Settings > Account. You'll need to verify the new address before it becomes active; check your spam folder for the verification email.",
      },
      {
        id: "enable-2fa",
        question: "How do I enable two-factor authentication?",
        answer:
          "Go to Settings > Account (or Security) and turn on Two-Factor Authentication. Scan the QR code with an authenticator app (for example, Google Authenticator or Authy) and store your backup codes somewhere safe.",
      },
    ],
  },
  {
    id: "billing-payments",
    category: "Billing & Payments",
    questions: [
      {
        id: "accepted-payment-methods",
        question: "What payment methods do you accept?",
        answer:
          "We accept major credit cards (Visa, Mastercard, American Express), PayPal, and for annual plans, bank transfer. Payments are processed securely through our payment provider.",
      },
      {
        id: "cancel-anytime",
        question: "Can I cancel my subscription anytime?",
        answer:
          "Yes. Cancel from Settings > Billing or the payment dashboard. Your subscription stays active until the end of the current billing period, and you keep access until then.",
      },
      {
        id: "refund-policy",
        question: "Do you offer refunds?",
        answer:
          "We offer a 30-day money-back guarantee for new subscriptions. Contact support within 30 days for a full refund. Annual plan refunds may be prorated for unused time.",
      },
    ],
  },
];

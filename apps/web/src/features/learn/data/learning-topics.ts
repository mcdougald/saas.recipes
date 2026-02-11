export interface RecipeExample {
  name: string;
  stack: string;
  focus: string;
}

export interface LearningTopic {
  slug: string;
  title: string;
  description: string;
  goals: string[];
  recipes: RecipeExample[];
  practicePrompts: string[];
}

export const learningTopics: LearningTopic[] = [
  {
    slug: "system-design",
    title: "System Design",
    description:
      "Learn how production recipes split services, model traffic, and scale safely.",
    goals: [
      "Map user journeys to bounded services and shared infrastructure.",
      "Choose sync vs async communication based on latency and failure tolerance.",
      "Design for reliability with backpressure, retries, and fallbacks.",
    ],
    recipes: [
      {
        name: "Multi-tenant SaaS API",
        stack: "Next.js + Postgres + Redis",
        focus: "Tenant isolation, caching layers, and request shaping.",
      },
      {
        name: "Event-driven Billing Service",
        stack: "Node.js + Stripe + Queue workers",
        focus: "Webhooks, idempotency, and eventual consistency.",
      },
      {
        name: "Realtime Collaboration Core",
        stack: "WebSockets + Durable storage",
        focus: "Presence, fan-out strategy, and conflict resolution.",
      },
    ],
    practicePrompts: [
      "Draw a service map for an onboarding-to-upgrade flow.",
      "Identify one read path that needs caching and one that should stay strongly consistent.",
      "Define SLOs and failure modes for your critical API path.",
    ],
  },
  {
    slug: "architecture-patterns",
    title: "Architecture Patterns",
    description:
      "Understand how modern recipe codebases structure modules, boundaries, and evolution.",
    goals: [
      "Compare modular monolith and microservice boundaries in real projects.",
      "Spot domain seams that reduce coupling and improve ownership.",
      "Apply CQRS, pub-sub, and background workers where they add clarity.",
    ],
    recipes: [
      {
        name: "Vertical Slice Product App",
        stack: "Next.js App Router + Server Actions",
        focus: "Feature folders, domain ownership, and clear interfaces.",
      },
      {
        name: "Domain Events Backbone",
        stack: "TypeScript + Message bus",
        focus: "Loose coupling and auditability through event contracts.",
      },
      {
        name: "Worker-first Processing",
        stack: "API + Queue + Cron",
        focus: "Offloading expensive work and smoothing traffic spikes.",
      },
    ],
    practicePrompts: [
      "Refactor one feature into a vertical slice with explicit boundaries.",
      "Model a domain event that replaces a direct service dependency.",
      "Choose one endpoint that should become an async workflow.",
    ],
  },
  {
    slug: "data-modeling",
    title: "Data Modeling",
    description:
      "Learn schema design and query patterns from mature SaaS recipe repositories.",
    goals: [
      "Model entities around business invariants, not just UI screens.",
      "Design indexes that match read-heavy product queries.",
      "Use migrations safely with reversible, low-risk rollouts.",
    ],
    recipes: [
      {
        name: "Subscription Commerce Schema",
        stack: "Postgres + Drizzle ORM",
        focus: "Plans, entitlements, invoices, and proration history.",
      },
      {
        name: "Activity Feed Pipeline",
        stack: "Append-only events + projections",
        focus: "Write optimization with read-side materialization.",
      },
      {
        name: "Permission Model Blueprint",
        stack: "RBAC + team-scoped resources",
        focus: "Role inheritance and efficient authorization checks.",
      },
    ],
    practicePrompts: [
      "Draft the minimal schema for organizations, users, and memberships.",
      "Choose indexes for your top three dashboard queries.",
      "Write a migration plan that avoids locking hot tables.",
    ],
  },
  {
    slug: "devops-delivery",
    title: "DevOps & Delivery",
    description:
      "Study how recipe teams ship fast with CI, observability, and safe deployment controls.",
    goals: [
      "Build CI pipelines that enforce quality without slowing iteration.",
      "Use preview environments for earlier product and QA feedback.",
      "Roll out changes safely with feature flags and progressive release.",
    ],
    recipes: [
      {
        name: "Monorepo CI Workflow",
        stack: "Turborepo + pnpm + GitHub Actions",
        focus: "Caching, affected builds, and parallel validation.",
      },
      {
        name: "Progressive Delivery Pipeline",
        stack: "Feature flags + metrics + rollback hooks",
        focus: "Gradual rollout with measurable guardrails.",
      },
      {
        name: "Observability Starter",
        stack: "Logs + traces + SLO alerts",
        focus: "Faster debugging and release confidence.",
      },
    ],
    practicePrompts: [
      "Define your promotion path from PR to production.",
      "Select one high-risk feature and design a safe rollout plan.",
      "Write alert thresholds tied to user-visible impact.",
    ],
  },
  {
    slug: "security-essentials",
    title: "Security Essentials",
    description:
      "Understand practical security controls that appear repeatedly in proven recipe codebases.",
    goals: [
      "Harden authn/authz flows for multi-tenant SaaS contexts.",
      "Protect secrets and sensitive data across environments.",
      "Reduce common web attack risks with layered controls.",
    ],
    recipes: [
      {
        name: "Auth Flow Hardening",
        stack: "Session auth + MFA + risk checks",
        focus: "Session lifecycle, rotation, and anomaly signals.",
      },
      {
        name: "API Security Baseline",
        stack: "Rate limits + validation + audit logs",
        focus: "Abuse resistance and traceable access controls.",
      },
      {
        name: "Secure Data Handling",
        stack: "Encryption + scoped secrets + backups",
        focus: "Data protection and incident readiness.",
      },
    ],
    practicePrompts: [
      "Threat-model your sign-in and password reset flows.",
      "Inventory secrets and assign ownership plus rotation cadence.",
      "Add one audit trail that improves incident investigations.",
    ],
  },
];

export const learningTopicMap = new Map(
  learningTopics.map((topic) => [topic.slug, topic]),
);

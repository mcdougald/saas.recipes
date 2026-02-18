/**
 * A curated, free recipe walkthrough shown inside a learning topic.
 */
export interface RecipeExample {
  name: string;
  stack: string;
  focus: string;
}

/**
 * Premium content buckets available in the academy experience.
 */
export const premiumContentKinds = [
  "academy",
  "notes",
  "guides",
  "case-studies",
] as const;

export type PremiumContentKind = (typeof premiumContentKinds)[number];

/**
 * Metadata for one premium learning asset shown as a teaser.
 */
export interface PremiumContentItem {
  kind: PremiumContentKind;
  title: string;
  teaser: string;
  outcome: string;
}

/**
 * Full data contract for one learning topic in the learn feature.
 */
export interface LearningTopic {
  slug: string;
  title: string;
  description: string;
  goals: string[];
  recipes: RecipeExample[];
  practicePrompts: string[];
  premiumContent: PremiumContentItem[];
}

/**
 * Top-level topic catalog used by the overview and per-topic pages.
 */
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
    premiumContent: [
      {
        kind: "academy",
        title: "System Design Academy Sprint",
        teaser:
          "A structured 10-day plan to move from architecture diagrams to release-ready services.",
        outcome:
          "Ship a scoped architecture decision record tied to one customer-critical workflow.",
      },
      {
        kind: "notes",
        title: "Reliability Notes Pack",
        teaser:
          "Field notes on retries, queue semantics, and backpressure from production teams.",
        outcome:
          "Adopt one reliability checklist that catches failure modes before launch.",
      },
      {
        kind: "guides",
        title: "Latency Budget Guide",
        teaser:
          "A practical framework for breaking down end-to-end latency across layers.",
        outcome:
          "Define per-service latency targets for one high-traffic endpoint.",
      },
      {
        kind: "case-studies",
        title: "Slack-Style Realtime Case Study",
        teaser:
          "Deep dive into fan-out, presence sync, and conflict resolution trade-offs.",
        outcome:
          "Choose a realtime architecture path with documented failure handling.",
      },
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
    premiumContent: [
      {
        kind: "academy",
        title: "Architecture Patterns Intensive",
        teaser:
          "Weekly implementation workshops on modular monolith boundaries and team ownership.",
        outcome:
          "Create a feature ownership map that reduces coupling across teams.",
      },
      {
        kind: "notes",
        title: "Boundary Smell Notes",
        teaser:
          "Annotated examples of anti-patterns that cause hidden architecture drift.",
        outcome:
          "Identify and prioritize the top two boundary issues in your codebase.",
      },
      {
        kind: "guides",
        title: "Event Contracts Guide",
        teaser:
          "Step-by-step guidance for introducing domain events without breaking consumers.",
        outcome:
          "Publish a versioned event contract for one critical integration path.",
      },
      {
        kind: "case-studies",
        title: "Monolith to Modular Case Study",
        teaser:
          "How a SaaS team evolved architecture over 18 months without freezing delivery.",
        outcome:
          "Plan a phased migration roadmap that preserves feature velocity.",
      },
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
    premiumContent: [
      {
        kind: "academy",
        title: "Data Modeling Academy Lab",
        teaser:
          "Guided sessions for schema evolution, indexing strategy, and migration safety.",
        outcome:
          "Design a forward-compatible schema and migration plan for your next feature.",
      },
      {
        kind: "notes",
        title: "Query Optimization Notes",
        teaser:
          "Real query plans and tuning decisions pulled from production datasets.",
        outcome:
          "Improve one slow dashboard query with an index and query rewrite.",
      },
      {
        kind: "guides",
        title: "Zero-Downtime Migration Guide",
        teaser:
          "Checklist-driven approach to staged rollouts on large, active tables.",
        outcome:
          "Run a migration plan that minimizes lock risk and rollback complexity.",
      },
      {
        kind: "case-studies",
        title: "Billing Schema Evolution Case Study",
        teaser:
          "Lessons from introducing entitlements and proration without data regressions.",
        outcome:
          "Adopt patterns for additive schema changes in revenue-critical systems.",
      },
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
    premiumContent: [
      {
        kind: "academy",
        title: "Delivery Academy Playbook",
        teaser:
          "A practical release curriculum for CI health, previews, and progressive rollout.",
        outcome:
          "Launch a safer deployment workflow with measurable release confidence.",
      },
      {
        kind: "notes",
        title: "Incident Response Notes",
        teaser:
          "Operational notes from postmortems focused on release and observability gaps.",
        outcome:
          "Strengthen one alerting and on-call runbook before the next incident.",
      },
      {
        kind: "guides",
        title: "Progressive Delivery Guide",
        teaser:
          "How to wire feature flags, metrics, and rollback into one release loop.",
        outcome:
          "Roll out one risky feature gradually with defined health thresholds.",
      },
      {
        kind: "case-studies",
        title: "High-Tempo Team Case Study",
        teaser:
          "How a lean team reduced deploy risk while shipping daily.",
        outcome:
          "Pick a CI and rollout pattern to support faster but safer releases.",
      },
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
    premiumContent: [
      {
        kind: "academy",
        title: "Security Academy Essentials",
        teaser:
          "Scenario-driven training for auth hardening, secrets, and incident readiness.",
        outcome:
          "Implement one high-impact control that lowers account takeover risk.",
      },
      {
        kind: "notes",
        title: "SaaS Security Notes Library",
        teaser:
          "Concise threat notes and mitigation patterns mapped to common attack paths.",
        outcome:
          "Create a focused threat model for your sign-in and access-control surfaces.",
      },
      {
        kind: "guides",
        title: "Defense-in-Depth Guide",
        teaser:
          "Practical layers for validation, rate limiting, auditability, and recovery.",
        outcome:
          "Harden one endpoint family with measurable abuse resistance.",
      },
      {
        kind: "case-studies",
        title: "Auth Incident Case Study",
        teaser:
          "A real-world timeline of detection, containment, and control improvements.",
        outcome:
          "Draft a response protocol for one plausible security incident.",
      },
    ],
  },
];

/**
 * O(1) lookup table for topic resolution by slug.
 */
export const learningTopicMap = new Map(
  learningTopics.map((topic) => [topic.slug, topic]),
);

/**
 * Normalizes potentially encoded route slugs for map lookup.
 */
function normalizeTopicSlug(slug: string) {
  return decodeURIComponent(slug).trim().toLowerCase();
}

/**
 * Finds one topic by slug after normalization.
 */
export function getLearningTopicBySlug(slug: string) {
  return learningTopicMap.get(normalizeTopicSlug(slug));
}

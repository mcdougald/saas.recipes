import {
  type ContentStatus,
  type CourseDifficulty,
  type PreviewDepth,
} from "./courses";

/**
 * Define one reusable code snippet in the learn library.
 */
export interface Snippet {
  slug: string;
  title: string;
  stack: string;
  level: CourseDifficulty;
  scenario: string;
  focus: string;
  code: string;
  tradeoffs: string[];
  antiPatterns: string[];
  tags: string[];
  relatedGuideSlugs: string[];
  relatedCourseSlugs: string[];
  isPremium: boolean;
  previewDepth: PreviewDepth;
  status: ContentStatus;
  lastUpdatedAt: string;
}

/**
 * Store starter snippets aligned to courses and guides.
 */
export const snippets: Snippet[] = [
  {
    slug: "feature-flag-progressive-rollout-guard",
    title: "Feature Flag Progressive Rollout Guard",
    stack: "Next.js + PostHog",
    level: "intermediate",
    scenario:
      "Release risky features gradually without causing hydration mismatch or broad regressions.",
    focus:
      "Combine server-side feature gating with deterministic bucketing for stable cohorts.",
    code: `export async function isNewEditorEnabled(userId: string) {
  const flagEnabled = await posthog.isFeatureEnabled("new-editor", userId);
  if (!flagEnabled) return false;

  const cohortBucket = hash(userId) % 100;
  return cohortBucket < 20;
}`,
    tradeoffs: [
      "Deterministic bucketing limits randomness but keeps behavior predictable.",
      "Server-side checks add latency if provider calls are not cached.",
    ],
    antiPatterns: [
      "Client-only gating that causes mismatched server and client renders.",
      "Rollout without guardrail metrics or rollback path.",
    ],
    tags: ["feature-flags", "rollouts", "release-safety"],
    relatedGuideSlugs: ["progressive-delivery-with-feature-flags"],
    relatedCourseSlugs: ["ship-reliable-nextjs-saas"],
    isPremium: false,
    previewDepth: "full",
    status: "published",
    lastUpdatedAt: "2026-03-12",
  },
  {
    slug: "stripe-webhook-idempotent-handler",
    title: "Stripe Webhook Idempotent Handler",
    stack: "Node.js + Stripe + Drizzle",
    level: "advanced",
    scenario:
      "Prevent duplicate side effects when webhook providers retry failed deliveries.",
    focus:
      "Persist event receipts and business writes in one transaction to enforce idempotency.",
    code: `const eventId = stripeEvent.id;

const existing = await db.query.webhookEvents.findFirst({
  where: eq(webhookEvents.id, eventId),
});

if (existing) {
  return new Response("ok");
}

await db.transaction(async (tx) => {
  await tx.insert(webhookEvents).values({ id: eventId });
  await syncSubscriptionState(tx, stripeEvent.data.object);
});`,
    tradeoffs: [
      "Idempotency tables add write overhead but dramatically reduce duplicate state risk.",
      "Transactions require careful timeout and retry configuration under load.",
    ],
    antiPatterns: [
      "Applying side effects before recording event receipt.",
      "Ignoring replay scenarios in billing-critical systems.",
    ],
    tags: ["billing", "webhooks", "idempotency", "transactions"],
    relatedGuideSlugs: ["idempotent-stripe-webhook-workflows"],
    relatedCourseSlugs: ["ship-reliable-nextjs-saas"],
    isPremium: false,
    previewDepth: "full",
    status: "published",
    lastUpdatedAt: "2026-03-12",
  },
  {
    slug: "safe-schema-migration-sequence",
    title: "Safe Schema Migration Sequence",
    stack: "Postgres + Drizzle",
    level: "intermediate",
    scenario:
      "Ship schema changes on busy tables without lock-heavy outages or risky cutovers.",
    focus:
      "Use additive migration phases and delayed read switching to reduce operational risk.",
    code: `await db.execute(sql\`alter table invoices add column billing_cycle text\`);

for await (const page of invoiceBackfillBatches()) {
  await db.transaction(async (tx) => {
    for (const invoice of page) {
      await tx
        .update(invoices)
        .set({ billingCycle: deriveBillingCycle(invoice) })
        .where(eq(invoices.id, invoice.id));
    }
  });
}`,
    tradeoffs: [
      "Phased migrations are slower to complete but safer for production traffic.",
      "Backfills require monitoring to avoid saturation of shared resources.",
    ],
    antiPatterns: [
      "Dropping old columns before parity validation.",
      "Running one unbounded backfill transaction over hot tables.",
    ],
    tags: ["database", "migrations", "reliability"],
    relatedGuideSlugs: ["low-risk-schema-migrations"],
    relatedCourseSlugs: ["data-modeling-for-product-teams"],
    isPremium: false,
    previewDepth: "full",
    status: "published",
    lastUpdatedAt: "2026-03-12",
  },
  {
    slug: "typed-env-contract-validation",
    title: "Typed Environment Contract Validation",
    stack: "TypeScript + Zod",
    level: "beginner",
    scenario:
      "Catch misconfigured environments before they break runtime behavior in production.",
    focus:
      "Create one strict env schema shared by server code, workers, and tests.",
    code: `const envSchema = z.object({
  DATABASE_URL: z.string().url(),
  STRIPE_SECRET_KEY: z.string().min(1),
  APP_BASE_URL: z.string().url(),
});

export const env = envSchema.parse(process.env);`,
    tradeoffs: [
      "Strict parsing can fail local startup, but that is safer than hidden runtime drift.",
      "Shared contracts require coordinated updates across teams.",
    ],
    antiPatterns: [
      "Using process variables directly throughout app code without validation.",
      "Allowing empty secret values in production builds.",
    ],
    tags: ["configuration", "runtime-safety", "operations"],
    relatedGuideSlugs: [],
    relatedCourseSlugs: ["ship-reliable-nextjs-saas"],
    isPremium: true,
    previewDepth: "teaser",
    status: "review",
    lastUpdatedAt: "2026-03-12",
  },
];

/**
 * Provide O(1) lookup for snippet resolution by slug.
 */
export const snippetMap = new Map(
  snippets.map((snippet) => [snippet.slug, snippet]),
);

/**
 * Normalize encoded snippet slugs before map access.
 *
 * @param slug - Snippet slug from route params or links.
 * @returns A normalized snippet slug string.
 */
export function normalizeSnippetSlug(slug: string): string {
  return decodeURIComponent(slug).trim().toLowerCase();
}

/**
 * Find one snippet by slug.
 *
 * @param slug - Snippet slug from route params or links.
 * @returns The matching snippet, or undefined when not found.
 */
export function getSnippetBySlug(slug: string): Snippet | undefined {
  return snippetMap.get(normalizeSnippetSlug(slug));
}

/**
 * List snippets currently marked as published.
 *
 * @returns Published snippets for learner-facing surfaces.
 */
export function listPublishedSnippets(): Snippet[] {
  return snippets.filter((snippet) => snippet.status === "published");
}

/**
 * List snippets matching one level.
 *
 * @param level - Difficulty level used for filtering.
 * @returns Snippets matching the requested level.
 */
export function listSnippetsByLevel(level: CourseDifficulty): Snippet[] {
  return snippets.filter((snippet) => snippet.level === level);
}

/**
 * List snippets matching one tag.
 *
 * @param tag - Tag label from UI filters.
 * @returns Published snippets containing the requested tag.
 */
export function listSnippetsByTag(tag: string): Snippet[] {
  const normalizedTag = tag.trim().toLowerCase();

  return snippets.filter(
    (snippet) =>
      snippet.status === "published" &&
      snippet.tags.some(
        (snippetTag) => snippetTag.trim().toLowerCase() === normalizedTag,
      ),
  );
}

import { type ContentStatus, type PreviewDepth } from "./courses";

/**
 * Define one step inside a practical implementation guide.
 */
export interface GuideImplementationStep {
  title: string;
  action: string;
  expectedResult: string;
}

/**
 * Define one guide used in the learn feature.
 */
export interface Guide {
  slug: string;
  title: string;
  problem: string;
  outcome: string;
  estimatedReadMinutes: number;
  implementationSteps: GuideImplementationStep[];
  relatedSnippetSlugs: string[];
  relatedCourseSlugs: string[];
  isPremium: boolean;
  previewDepth: PreviewDepth;
  status: ContentStatus;
  lastUpdatedAt: string;
}

/**
 * Store starter guide entries that map to course and snippet content.
 */
export const guides: Guide[] = [
  {
    slug: "progressive-delivery-with-feature-flags",
    title: "Progressive Delivery with Feature Flags",
    problem:
      "Teams ship risky features to all users at once, causing avoidable incidents.",
    outcome:
      "Release features to controlled cohorts with measurable health checks and rollback criteria.",
    estimatedReadMinutes: 14,
    implementationSteps: [
      {
        title: "Define rollout cohorts",
        action:
          "Segment users into deterministic cohorts by account id and risk profile.",
        expectedResult:
          "Rollout percentages remain stable between sessions and environments.",
      },
      {
        title: "Add guardrail metrics",
        action:
          "Track error rate, latency, and conversion for flagged and unflagged groups.",
        expectedResult:
          "You can detect regressions before expanding rollout size.",
      },
      {
        title: "Predefine rollback triggers",
        action:
          "Set thresholds that disable the feature automatically when breached.",
        expectedResult:
          "Rollback is immediate and consistent under incident pressure.",
      },
    ],
    relatedSnippetSlugs: ["feature-flag-progressive-rollout-guard"],
    relatedCourseSlugs: ["ship-reliable-nextjs-saas"],
    isPremium: true,
    previewDepth: "teaser",
    status: "published",
    lastUpdatedAt: "2026-03-12",
  },
  {
    slug: "idempotent-stripe-webhook-workflows",
    title: "Idempotent Stripe Webhook Workflows",
    problem:
      "Webhook retries produce duplicate writes and inconsistent billing state.",
    outcome:
      "Guarantee one logical side effect per event using durable idempotency storage.",
    estimatedReadMinutes: 12,
    implementationSteps: [
      {
        title: "Persist event ids first",
        action:
          "Record webhook event ids before mutating subscription or invoice state.",
        expectedResult: "Duplicate deliveries short-circuit safely.",
      },
      {
        title: "Wrap writes in one transaction",
        action:
          "Insert event receipts and apply billing updates in a single database transaction.",
        expectedResult:
          "State changes are either fully committed or fully rolled back.",
      },
    ],
    relatedSnippetSlugs: ["stripe-webhook-idempotent-handler"],
    relatedCourseSlugs: ["ship-reliable-nextjs-saas"],
    isPremium: false,
    previewDepth: "full",
    status: "published",
    lastUpdatedAt: "2026-03-12",
  },
  {
    slug: "low-risk-schema-migrations",
    title: "Low-Risk Schema Migrations",
    problem:
      "Direct table rewrites and lock-heavy migrations can cause outages during deploys.",
    outcome:
      "Apply additive, staged migration patterns that minimize lock time and rollback risk.",
    estimatedReadMinutes: 11,
    implementationSteps: [
      {
        title: "Apply additive schema first",
        action:
          "Add nullable columns or new tables before writing any backfills.",
        expectedResult: "Application reads stay compatible during transition.",
      },
      {
        title: "Backfill in bounded batches",
        action:
          "Run time-boxed backfills with progress checkpoints and retries.",
        expectedResult: "Hot tables avoid lock amplification under load.",
      },
      {
        title: "Flip reads after validation",
        action: "Switch reads to new fields only after parity checks pass.",
        expectedResult:
          "Cutover risk stays low and rollbacks stay straightforward.",
      },
    ],
    relatedSnippetSlugs: ["safe-schema-migration-sequence"],
    relatedCourseSlugs: ["data-modeling-for-product-teams"],
    isPremium: false,
    previewDepth: "full",
    status: "published",
    lastUpdatedAt: "2026-03-12",
  },
];

/**
 * Provide O(1) lookup for guide resolution by slug.
 */
export const guideMap = new Map(guides.map((guide) => [guide.slug, guide]));

/**
 * Normalize encoded guide slugs before map access.
 *
 * @param slug - Guide slug from route params or links.
 * @returns A normalized guide slug string.
 */
export function normalizeGuideSlug(slug: string): string {
  return decodeURIComponent(slug).trim().toLowerCase();
}

/**
 * Find one guide by slug.
 *
 * @param slug - Guide slug from route params or links.
 * @returns The matching guide, or undefined when not found.
 */
export function getGuideBySlug(slug: string): Guide | undefined {
  return guideMap.get(normalizeGuideSlug(slug));
}

/**
 * List all guides currently marked as published.
 *
 * @returns Published guide entries.
 */
export function listPublishedGuides(): Guide[] {
  return guides.filter((guide) => guide.status === "published");
}

/**
 * List guides related to one course slug.
 *
 * @param courseSlug - Parent course slug used for filtering.
 * @returns Published guides that link to the specified course.
 */
export function listGuidesByCourseSlug(courseSlug: string): Guide[] {
  const normalizedCourseSlug = normalizeGuideSlug(courseSlug);

  return guides.filter(
    (guide) =>
      guide.status === "published" &&
      guide.relatedCourseSlugs.some(
        (relatedCourseSlug) =>
          normalizeGuideSlug(relatedCourseSlug) === normalizedCourseSlug,
      ),
  );
}

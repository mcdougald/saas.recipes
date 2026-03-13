/**
 * Represents all supported content publishing states.
 */
export const contentStatuses = [
  "draft",
  "review",
  "published",
  "archived",
] as const;

/**
 * Represents one valid content publishing state.
 */
export type ContentStatus = (typeof contentStatuses)[number];

/**
 * Represents how much premium content detail can be previewed without access.
 */
export const previewDepthLevels = ["teaser", "partial", "full"] as const;

/**
 * Represents one valid premium preview depth mode.
 */
export type PreviewDepth = (typeof previewDepthLevels)[number];

/**
 * Represents all supported curriculum difficulty levels.
 */
export const courseDifficulties = [
  "beginner",
  "intermediate",
  "advanced",
] as const;

/**
 * Represents one valid curriculum difficulty level.
 */
export type CourseDifficulty = (typeof courseDifficulties)[number];

/**
 * Describe one measurable learner outcome tied to a course.
 */
export interface LearningOutcome {
  id: string;
  title: string;
  description: string;
  measurableCheck: string;
}

/**
 * Define one course in the learn catalog.
 */
export interface Course {
  slug: string;
  title: string;
  summary: string;
  difficulty: CourseDifficulty;
  estimatedHours: number;
  prerequisites: string[];
  learningOutcomes: LearningOutcome[];
  lessonSlugs: string[];
  isPremium: boolean;
  previewDepth: PreviewDepth;
  status: ContentStatus;
  lastUpdatedAt: string;
}

/**
 * Store starter course entries for the new education model.
 */
export const courses: Course[] = [
  {
    slug: "ship-reliable-nextjs-saas",
    title: "Ship Reliable Next.js SaaS",
    summary:
      "Build a dependable SaaS delivery workflow from architecture decisions to safe production rollout.",
    difficulty: "intermediate",
    estimatedHours: 5,
    prerequisites: [
      "Basic TypeScript fluency",
      "Hands-on Next.js App Router experience",
      "Familiarity with SQL-backed products",
    ],
    learningOutcomes: [
      {
        id: "outcome-service-boundaries",
        title: "Design resilient service boundaries",
        description:
          "Map product workflows into clear ownership boundaries with failure isolation.",
        measurableCheck:
          "Produce a boundary diagram for one critical user journey and explain two failure modes.",
      },
      {
        id: "outcome-safe-rollout",
        title: "Plan safer feature rollouts",
        description:
          "Create a progressive delivery strategy with guardrails and rollback triggers.",
        measurableCheck:
          "Write a rollout checklist including cohort size, metrics, and rollback thresholds.",
      },
    ],
    lessonSlugs: [
      "service-boundaries-for-saas-workflows",
      "queue-driven-reliability-basics",
      "progressive-rollout-playbook",
    ],
    isPremium: true,
    previewDepth: "partial",
    status: "published",
    lastUpdatedAt: "2026-03-12",
  },
  {
    slug: "data-modeling-for-product-teams",
    title: "Data Modeling for Product Teams",
    summary:
      "Model schemas and migrations that keep feature velocity high while reducing production risk.",
    difficulty: "beginner",
    estimatedHours: 4,
    prerequisites: [
      "Comfort reading SQL queries",
      "Understanding of one ORM in production",
    ],
    learningOutcomes: [
      {
        id: "outcome-entity-modeling",
        title: "Model entities around business rules",
        description:
          "Design schema structures based on product invariants instead of page-level UI.",
        measurableCheck:
          "Draft entities and constraints for organizations, memberships, and entitlements.",
      },
      {
        id: "outcome-zero-downtime",
        title: "Plan low-risk schema migrations",
        description:
          "Use additive, staged migration patterns for high-traffic product tables.",
        measurableCheck:
          "Create a two-step migration with backward compatibility and rollback notes.",
      },
    ],
    lessonSlugs: [
      "schema-modeling-from-product-invariants",
      "indexing-for-real-dashboard-queries",
      "low-risk-migration-sequencing",
    ],
    isPremium: false,
    previewDepth: "full",
    status: "published",
    lastUpdatedAt: "2026-03-12",
  },
];

/**
 * Provide O(1) lookup for course resolution by slug.
 */
export const courseMap = new Map(
  courses.map((course) => [course.slug, course]),
);

/**
 * Normalize encoded route slugs for consistent lookups.
 *
 * @param slug - Route slug potentially containing encoding or whitespace.
 * @returns A normalized slug string used by course selectors.
 */
export function normalizeCourseSlug(slug: string): string {
  return decodeURIComponent(slug).trim().toLowerCase();
}

/**
 * Find one course by slug.
 *
 * @param slug - Course slug from route params or links.
 * @returns The matching course, or undefined when not found.
 */
export function getCourseBySlug(slug: string): Course | undefined {
  return courseMap.get(normalizeCourseSlug(slug));
}

/**
 * List all courses currently marked as published.
 *
 * @returns Published courses ready for learner-facing pages.
 */
export function listPublishedCourses(): Course[] {
  return courses.filter((course) => course.status === "published");
}

/**
 * List courses by one difficulty level.
 *
 * @param difficulty - Difficulty level to filter against.
 * @returns Courses matching the requested difficulty.
 */
export function listCoursesByDifficulty(
  difficulty: CourseDifficulty,
): Course[] {
  return courses.filter((course) => course.difficulty === difficulty);
}

import { type ContentStatus } from "./courses";

/**
 * Represents all supported lesson content block variants.
 */
export const lessonContentBlockKinds = [
  "markdown",
  "checklist",
  "code",
  "callout",
] as const;

/**
 * Represents one valid lesson content block variant.
 */
export type LessonContentBlockKind = (typeof lessonContentBlockKinds)[number];

/**
 * Define one renderable section in a lesson body.
 */
export interface LessonContentBlock {
  id: string;
  kind: LessonContentBlockKind;
  title?: string;
  body: string;
  codeLanguage?: string;
}

/**
 * Define one completion check used to validate learner understanding.
 */
export interface LessonCompletionCheck {
  prompt: string;
  successCriteria: string;
}

/**
 * Define one lesson tied to a course learning path.
 */
export interface Lesson {
  slug: string;
  courseSlug: string;
  title: string;
  position: number;
  objective: string;
  estimatedMinutes: number;
  prerequisites: string[];
  contentBlocks: LessonContentBlock[];
  exercisePrompts: string[];
  completionCheck: LessonCompletionCheck;
  status: ContentStatus;
  lastUpdatedAt: string;
}

/**
 * Store starter lesson entries used by course detail routes.
 */
export const lessons: Lesson[] = [
  {
    slug: "service-boundaries-for-saas-workflows",
    courseSlug: "ship-reliable-nextjs-saas",
    title: "Service Boundaries for SaaS Workflows",
    position: 1,
    objective:
      "Split one core workflow into service boundaries with clear ownership and failure isolation.",
    estimatedMinutes: 35,
    prerequisites: [
      "Understand one end-to-end product flow in your app",
      "Know the difference between sync and async processing",
    ],
    contentBlocks: [
      {
        id: "boundaries-intro",
        kind: "markdown",
        title: "Boundary framing",
        body: "Start from user journeys, then map where ownership and data guarantees should differ across services.",
      },
      {
        id: "boundary-checklist",
        kind: "checklist",
        title: "Boundary checklist",
        body: "- Separate write-critical paths from analytics paths\n- Document dependency contracts\n- Define retry boundaries by service",
      },
      {
        id: "boundary-pattern",
        kind: "code",
        title: "Typed boundary contract",
        body: 'export interface BillingEvents {\n  "invoice.paid": { invoiceId: string; accountId: string };\n  "invoice.failed": { invoiceId: string; retryAt: string };\n}',
        codeLanguage: "ts",
      },
    ],
    exercisePrompts: [
      "Draw boundaries for onboarding, billing, and notification services.",
      "Identify one dependency that should become an event contract.",
    ],
    completionCheck: {
      prompt: "What is one boundary decision that reduces blast radius?",
      successCriteria:
        "Learner names a concrete boundary plus one failure mode now isolated by that decision.",
    },
    status: "published",
    lastUpdatedAt: "2026-03-12",
  },
  {
    slug: "queue-driven-reliability-basics",
    courseSlug: "ship-reliable-nextjs-saas",
    title: "Queue-Driven Reliability Basics",
    position: 2,
    objective:
      "Apply queue patterns to reduce user-facing failures in async workflows.",
    estimatedMinutes: 40,
    prerequisites: ["Know one existing async job in your system"],
    contentBlocks: [
      {
        id: "queue-why",
        kind: "callout",
        title: "Why queues matter",
        body: "Queues absorb traffic spikes and protect request latency when downstream services are unstable.",
      },
      {
        id: "retry-guidance",
        kind: "markdown",
        title: "Retry guidance",
        body: "Use bounded retries with jitter and dead-letter paths. Never retry permanently invalid payloads.",
      },
    ],
    exercisePrompts: [
      "Select one synchronous endpoint and propose an async alternative.",
      "Draft retry and dead-letter rules for a webhook pipeline.",
    ],
    completionCheck: {
      prompt: "How do you decide between immediate failure and retry?",
      successCriteria:
        "Learner explains transient versus permanent failure handling with one real example.",
    },
    status: "published",
    lastUpdatedAt: "2026-03-12",
  },
  {
    slug: "schema-modeling-from-product-invariants",
    courseSlug: "data-modeling-for-product-teams",
    title: "Schema Modeling from Product Invariants",
    position: 1,
    objective:
      "Design data models around business constraints rather than UI surfaces.",
    estimatedMinutes: 30,
    prerequisites: ["Know your app's core entities and billing rules"],
    contentBlocks: [
      {
        id: "invariants-core",
        kind: "markdown",
        title: "Start from invariants",
        body: "Model constraints such as one active plan per workspace before modeling dashboard screens.",
      },
      {
        id: "constraint-example",
        kind: "code",
        title: "Constraint example",
        body: "create unique index one_active_subscription\non subscriptions(workspace_id)\nwhere status = 'active';",
        codeLanguage: "sql",
      },
    ],
    exercisePrompts: [
      "List three invariants your billing schema must enforce.",
      "Mark which invariants belong in database constraints versus app logic.",
    ],
    completionCheck: {
      prompt: "Which invariant is most risky if enforced only in UI logic?",
      successCriteria:
        "Learner identifies a high-impact invariant and justifies database-level enforcement.",
    },
    status: "published",
    lastUpdatedAt: "2026-03-12",
  },
];

/**
 * Provide O(1) lookup for lesson resolution by slug.
 */
export const lessonMap = new Map(
  lessons.map((lesson) => [lesson.slug, lesson]),
);

/**
 * Normalize encoded lesson slugs before map access.
 *
 * @param slug - Lesson slug from route params or links.
 * @returns A normalized lesson slug string.
 */
export function normalizeLessonSlug(slug: string): string {
  return decodeURIComponent(slug).trim().toLowerCase();
}

/**
 * Find one lesson by slug.
 *
 * @param slug - Lesson slug from route params or links.
 * @returns The matching lesson, or undefined when not found.
 */
export function getLessonBySlug(slug: string): Lesson | undefined {
  return lessonMap.get(normalizeLessonSlug(slug));
}

/**
 * List lessons for one course, ordered by position.
 *
 * @param courseSlug - Parent course slug.
 * @returns Published lesson entries sorted by lesson position.
 */
export function listLessonsByCourseSlug(courseSlug: string): Lesson[] {
  return lessons
    .filter(
      (lesson) =>
        lesson.status === "published" &&
        normalizeLessonSlug(lesson.courseSlug) ===
          normalizeLessonSlug(courseSlug),
    )
    .sort((first, second) => first.position - second.position);
}

# Learn Content Authoring Guide

This guide defines naming, slug strategy, and onboarding workflow for adding new `learn` content from a single author + AI collaboration model.

## Naming conventions

- Keep titles outcome-focused and action-oriented:
  - Good: `Progressive Delivery with Feature Flags`
  - Avoid: `Feature Flags Notes v2`
- Prefer concise sentence case for summaries and objectives.
- Keep fields deterministic and machine-friendly where possible.

## Slug strategy

- Use lowercase kebab-case only.
- Keep slugs stable once published.
- Use descriptive slugs over short abbreviations.
- Prefix lesson slugs with topic intent, not internal numbering.
- Do not reuse historical slugs across content types.

Examples:

- Course: `ship-reliable-nextjs-saas`
- Lesson: `queue-driven-reliability-basics`
- Guide: `low-risk-schema-migrations`
- Snippet: `stripe-webhook-idempotent-handler`

## Required fields checklist

### Course

- `slug`, `title`, `summary`, `difficulty`, `estimatedHours`
- `prerequisites`, `learningOutcomes`, `lessonSlugs`
- `isPremium`, `previewDepth`, `status`, `lastUpdatedAt`

### Lesson

- `slug`, `courseSlug`, `title`, `position`
- `objective`, `contentBlocks`, `exercisePrompts`
- `completionCheck`, `status`, `lastUpdatedAt`

### Guide

- `slug`, `title`, `problem`, `outcome`, `estimatedReadMinutes`
- `implementationSteps`, `relatedSnippetSlugs`, `relatedCourseSlugs`
- `isPremium`, `previewDepth`, `status`, `lastUpdatedAt`

### Snippet

- `slug`, `title`, `stack`, `level`, `scenario`, `focus`, `code`
- `tradeoffs`, `antiPatterns`, `tags`
- `relatedGuideSlugs`, `relatedCourseSlugs`
- `isPremium`, `previewDepth`, `status`, `lastUpdatedAt`

## Authoring workflow

1. Add content entries in:
   - `data/courses.ts`
   - `data/lessons.ts`
   - `data/guides.ts`
   - `data/snippets.ts`
2. Link related slugs across content types.
3. Run content validation:
   - `pnpm --filter web learn:lint-content`
4. Run stale-content report:
   - `pnpm --filter web learn:refresh-report`
5. Validate route rendering manually:
   - `/learn/courses`
   - `/learn/courses/[course]/[lesson]`
   - `/learn/guides`
   - `/learn/guides/[guide]`
   - `/learn/playbooks`

## AI-assisted quality checklist

Before publishing a new item, verify:

- Clarity: Is the objective obvious in one sentence?
- Accuracy: Are code and claims aligned with current stack versions?
- Actionability: Can a learner apply this within one sprint?
- Progression: Does it connect to a next lesson, guide, or snippet?
- Differentiation: Does it teach a practical decision or trade-off?
- Safety: Are security/reliability caveats explicit where needed?

## Premium preview guidance

- `teaser`: show only the top preview section and one CTA.
- `partial`: show about half of educational content, hide deeper steps.
- `full`: show complete content.

Each premium item should still provide free starter value through one practical preview.

# Learn Feature Improvement Plan

Execution plan for evolving `learn` into a stronger Next.js education product centered on courses, guides, and snippets.

## Outcomes

- Make content types explicit, scalable, and education-focused.
- Keep route code simple by moving data contracts to `data/`.
- Improve learner progression, not just page discoverability.
- Prepare premium delivery without tight coupling to page components.

## Educational implementation principles

- **Outcome-first**: each content item states what the learner can do after completion.
- **Progressive complexity**: beginner to advanced pathways are explicit and connected.
- **Practice-driven**: lessons and guides include concrete implementation prompts.
- **Context-rich snippets**: code examples include when to use, trade-offs, and failure cases.
- **Retention-aware**: "continue learning" and spaced review prompts are first-class.

## Phase 1 - Foundation (structure + contracts)

- [x] Add `Course`, `Guide`, and `Snippet` TypeScript interfaces under `data/`.
- [x] Add `Lesson` and `LearningOutcome` interfaces to support curriculum sequencing.
- [x] Split content catalogs into `data/courses.ts`, `data/guides.ts`, and `data/snippets.ts`.
- [x] Keep shared enums/constants in one place (difficulty, category, content status).
- [x] Add basic read helpers (`getCourseBySlug`, `getGuideBySlug`, `listSnippets`).
- [x] Add schema validation for required educational fields (objective, prerequisites, outcomes).

## Phase 2 - Route architecture (App Router)

- [x] Add `app/(dashboard)/learn/courses/page.tsx`.
- [x] Add `app/(dashboard)/learn/courses/[course]/[lesson]/page.tsx`.
- [x] Add `app/(dashboard)/learn/guides/[guide]/page.tsx`.
- [x] Move snippet page data from `playbooks/page.tsx` into shared data layer.
- [x] Add `generateStaticParams()` for stable course/guide routes.
- [x] Add route-level `generateMetadata()` for course and guide details.
- [x] Add lesson-level metadata and canonical route patterns.

## Phase 3 - Learning UX (discoverability + progression)

- [x] Add snippet filters (stack, category, level).
- [x] Add "next lesson" and "continue course" navigation patterns.
- [x] Add related-guide and related-snippet sections on detail pages.
- [x] Add empty-state UX for filtered results and missing content.
- [x] Add "what you will learn" and "when to use this" sections across content types.
- [x] Add lightweight completion checks (self-assessment or checkpoint prompts).

## Phase 4 - Content operations (single author + AI)

- [x] Add `lastUpdatedAt` and `status` metadata fields.
- [x] Add a content lint script for duplicate slugs and missing required fields.
- [x] Add docs for naming conventions and slug strategy.
- [x] Add onboarding docs for adding new courses/guides/snippets.
- [x] Add AI-assisted quality checklist for clarity, accuracy, and actionability.

## Phase 5 - Premium enablement

- [x] Add `isPremium` and `previewDepth` fields per content item.
- [x] Gate premium sections with clear upgrade CTAs and fallback previews.
- [x] Keep free starter value available for each content type.
- [x] Add analytics hooks for view, save, and upgrade-intent events.

## Phase 6 - Learning analytics and iteration

- [x] Track lesson-start, lesson-complete, and drop-off events.
- [x] Track snippet-copy and guide-to-snippet click-through rates.
- [x] Track "continue learning" return rate over 7-day windows.
- [x] Build a monthly content refresh loop based on low-completion and high-drop-off pages.

## Definition of done

- Courses, guides, and snippets are represented by typed catalogs.
- Routes consume resolver/helpers instead of hardcoded inline content arrays.
- Each detail route has metadata and stable URL conventions.
- UI supports discovery (filtering), progression (next steps), and practice.
- Premium and free experiences are explicit and testable.

## Implementation notes

- Content quality and schema checks are enforced through `learn:lint-content`.
- Refresh operations are supported by `learn:refresh-report`, with analytics events now emitted for completion, drop-off, snippet engagement, and upgrade intent.

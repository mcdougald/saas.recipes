# Learn Feature Overview

This folder powers the dashboard `learn` experience as an education product, not just a content browser. The implementation supports learner progression from discovery to mastery across topics, lessons, guides, and snippets.

## Implemented route map

```txt
app/(dashboard)/learn/page.tsx
  -> LearningOverviewPage
  -> LearnPageAnalytics

app/(dashboard)/learn/[topic]/page.tsx
  -> getLearningTopicBySlug(topic)
  -> LearningTopicPage
  -> LearnPageAnalytics

app/(dashboard)/learn/courses/page.tsx
  -> CourseCatalogPage
  -> LearnPageAnalytics

app/(dashboard)/learn/courses/[course]/[lesson]/page.tsx
  -> resolveLessonDetail()
  -> LessonDetailPage
  -> LearnPageAnalytics

app/(dashboard)/learn/guides/page.tsx
  -> guides index
  -> LearnPageAnalytics

app/(dashboard)/learn/guides/[guide]/page.tsx
  -> resolveGuideDetail()
  -> GuideDetailPage
  -> LearnPageAnalytics

app/(dashboard)/learn/playbooks/page.tsx
  -> SnippetLibraryPage
  -> LearnPageAnalytics
```

## Content model

Typed content catalogs live under `data/`:

- `courses.ts`
- `lessons.ts`
- `guides.ts`
- `snippets.ts`
- `learning-topics.ts` (topic-level explorer data)

Shared contract fields now include:

- `status`
- `lastUpdatedAt`
- `isPremium`
- `previewDepth`

Educational fields are enforced per type:

- courses: outcomes, prerequisites, lesson sequencing
- lessons: objective, content blocks, exercise prompts, completion checks
- guides: implementation steps and outcome framing
- snippets: trade-offs, anti-patterns, related learning links

## Learning UX features implemented

- Filterable snippet library with search, level, and tag filters.
- Empty-state UX for filtered/no-results views.
- Lesson progression controls ("mark complete", next lesson navigation).
- Related learning sections (lesson -> snippets, guide -> snippets/courses).
- "What you will learn" sections on course and lesson surfaces.
- Lightweight completion checks embedded in lesson pages.

## Premium behavior implemented

- Premium data fields (`isPremium`, `previewDepth`) across course/guide/snippet models.
- Teaser/partial preview behavior for premium lesson and guide content.
- Upgrade CTAs with tracked analytics events.
- Free starter value remains visible via preview sections.

## Analytics implemented

- Page-level view tracking for overview, topic, courses, lesson, guide, and snippets.
- Lesson lifecycle events:
  - `learn_lesson_started`
  - `learn_lesson_completed`
  - `learn_lesson_drop_off`
- Conversion behavior events:
  - topic save (`learn_topic_saved`)
  - snippet copy (`learn_snippet_copied`)
  - guide-to-snippet click-through (`learn_guide_to_snippet_clicked`)
  - upgrade intent (`learn_upgrade_intent_clicked`)
- Return behavior:
  - 7-day return marker (`learn_returned_within_7d`)

## Content operations tooling

- Content lint script:
  - `pnpm --filter web learn:lint-content`
- Monthly refresh report script:
  - `pnpm --filter web learn:refresh-report`
- Authoring and slug conventions:
  - `CONTENT-AUTHORING.md`

## Folder structure

```txt
learn/
  README.md
  IMPROVEMENT-PLAN.md
  CONTENT-AUTHORING.md
  data/
    learning-topics.ts
    courses.ts
    lessons.ts
    guides.ts
    snippets.ts
  lib/
    learn-resolvers.ts
  components/
    learning-overview-page.tsx
    learning-topic-page.tsx
    course-catalog-page.tsx
    lesson-detail-page.tsx
    guide-detail-page.tsx
    snippet-library-page.tsx
    learn-page-analytics.tsx
    learn-lesson-progress.tsx
    learn-upgrade-link.tsx
    guide-related-snippet-links.tsx
  server/
    learn-favorites.ts
  actions.ts
```

## Authoring model

Content is produced by one person with AI assistance. Quality control relies on typed schemas, linkable slug relationships, and automated lint/report scripts rather than multi-owner review workflows.

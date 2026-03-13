# Help Center Improvement Plan

Plan and execution tasks for making the `help-center` feature more helpful, better marketed/messaged, and ready for scalable multilingual content.

## Why This Exists

The current implementation is strong visually and functionally, but content and data are still tightly coupled in `help-center-data.ts`. That coupling makes it harder to:

- scale article/FAQ volume without large code edits,
- localize content cleanly across many locales,
- improve marketing-style messaging consistency by audience and intent,
- measure content quality and impact over time.

## Current Feature Snapshot

Current feature files:

- `help-center-data.ts` (all content in code)
- `components/help-center-client.tsx` (state + filtering + URL sync)
- `components/help-search-hero.tsx`
- `components/category-cards.tsx`
- `components/popular-articles.tsx`
- `components/faq-accordion.tsx`
- `components/faq-answer-components.tsx`

## Desired Outcomes

- More helpful answers: clearer user intent coverage and task-oriented copy.
- Better marketing/messaging ("marking"): stronger positioning, CTA quality, and value framing.
- i18n-first data design: content keys, locale separation, and translation safety.
- Better content operations: easier updates, quality checks, and analytics-driven iteration.

## Target Architecture (i18n-first)

Move from literal text in TypeScript to stable content IDs + translation catalogs.

### 1) Domain Model (source-of-truth metadata)

Keep structure and behavior metadata in TypeScript, but replace raw strings with translation keys:

- category IDs, slugs, icon keys, display order, tags, CTA type
- article IDs, route slugs, category relation, reading-time buckets
- FAQ IDs, category relation, answer renderer type (plain/rich/component)
- search synonyms per locale (optional, can be generated)

Suggested files:

- `data/help-center-schema.ts` (types + validation)
- `data/help-center-index.ts` (IDs, relations, sort order)
- `data/help-center-routing.ts` (slug <-> id mapping)

### 2) Locale Content Catalogs

Place locale strings in translation JSON files by namespace, for example:

- `messages/en/help-center.json`
- `messages/es/help-center.json`
- `messages/ja/help-center.json`

Each entry should be keyed by stable IDs, not literal titles:

- `categories.getting-started.title`
- `categories.getting-started.description`
- `faqs.getting-started.create-account.question`
- `faqs.getting-started.create-account.answer`
- `hero.valueProp.title`

### 3) Resolver Layer

Add a resolver that combines metadata + locale strings:

- `lib/help-center/resolve-help-center-content.ts`

Responsibilities:

- accept locale and optional fallback locale,
- resolve all keys from the catalog,
- return normalized UI-ready objects,
- log/report missing translation keys,
- provide deterministic fallback behavior.

### 4) Component Boundaries

- `help-center-client.tsx` should consume resolved content objects, not hardcoded text.
- Components should receive already-localized strings via props.
- Keep `faq-answer-components.tsx` for rich answer rendering, but key by answer type + faq ID.

## Data + Knowledge Information Plan

Treat help-center content as a knowledge graph, not a flat list.

### Core entities

- **Topic**: high-level support area (onboarding, billing, security, etc.)
- **Article**: deeper walkthrough content with intent + funnel stage tags
- **FAQ**: concise answers mapped to intents and objections
- **Journey**: sequences like onboarding, upgrade, cancellation prevention

### Required metadata per item

- `id` (stable, language-agnostic)
- `intent` (`discover`, `evaluate`, `troubleshoot`, `purchase`, `retain`)
- `audience` (`new-user`, `builder`, `team-admin`, etc.)
- `funnelStage` (`activation`, `conversion`, `retention`)
- `relatedIds` (cross-linking)
- `lastReviewedAt` + `owner`
- `qualityScore` (manual or computed)

This supports better search relevance, recommendation quality, and stronger marketing alignment.

## Marketing/Messaging ("Better Marking") Upgrade

Improve copy quality and conversion utility while keeping support intent clear:

- Add a message framework per section: **Problem -> Outcome -> Proof -> CTA**.
- Standardize tone: practical, confident, implementation-focused.
- Include value framing in hero/quick-links ("what this helps you ship faster").
- Add action-oriented FAQ answers with "next step" links.
- Differentiate informational vs conversion CTAs.

If "marking" also means structured markup/SEO, add:

- FAQPage structured data for FAQ sections,
- Article schema for long-form help articles,
- localized metadata and canonical strategy.

## Phased Task List

## Phase 1 - Foundation

- [ ] Create `data/help-center-schema.ts` and define all content entity types.
- [ ] Replace hardcoded display strings in `help-center-data.ts` with translation keys.
- [ ] Add key naming conventions and validation helpers.
- [ ] Add `resolve-help-center-content.ts` with fallback behavior.

## Phase 2 - i18n Migration

- [ ] Create `help-center` namespace in locale message files.
- [ ] Migrate existing English text into `messages/en/help-center.json`.
- [ ] Wire `useI18n`/`next-intl` lookup paths for help-center namespaces.
- [ ] Add missing-key diagnostics in dev mode.

## Phase 3 - Content Quality + Marketing

- [ ] Rewrite hero, category descriptions, and top FAQs using messaging framework.
- [ ] Add intent tags and audience tags for every article/FAQ.
- [ ] Add "next best action" links in FAQ answers.
- [ ] Introduce trust/proof snippets where useful (usage, outcomes, examples).

## Phase 4 - Knowledge Operations

- [ ] Add review workflow fields (`owner`, `lastReviewedAt`, `qualityScore`).
- [ ] Create a monthly stale-content report task.
- [ ] Add analytics events for search terms, zero-results, and CTA clicks.
- [ ] Define KPIs: deflection rate proxy, time-to-answer, CTA conversion from help pages.

## Definition of Done

- No user-facing help-center copy is hardcoded in component files.
- All help-center text resolves from locale namespaces with fallback support.
- Every FAQ and article has intent metadata + owner + review date.
- Search/usage analytics events are captured and visible.
- Copy is updated to clearer, task-first, marketing-aware language.

## Suggested Folder Layout (end state)

```txt
help-center/
  README.md
  data/
    help-center-schema.ts
    help-center-index.ts
    help-center-routing.ts
  lib/
    resolve-help-center-content.ts
    help-center-search.ts
  components/
    help-center-client.tsx
    category-cards.tsx
    popular-articles.tsx
    faq-accordion.tsx
    faq-answer-components.tsx
```

## External References (Next.js help-center/knowledge-base implementations)

- BaseHub Help Center Template (Next.js):  
  [https://github.com/basehub-ai/help-center-template](https://github.com/basehub-ai/help-center-template)  
  Useful folders: `app/_components`, `app/[category]`, `lib`.

- Newt Starter Next.js Help Center (App Router):  
  [https://github.com/Newt-Inc/newt-starter-nextjs-help-center](https://github.com/Newt-Inc/newt-starter-nextjs-help-center)  
  Useful folders: `app/articles/[slug]`, `app/search`, `components`, `lib`, `types`.

- Support Sphere (Next.js knowledge/help template):  
  [https://github.com/spurtcms/Support-Sphere](https://github.com/spurtcms/Support-Sphere)  
  Useful folders: `src/components`, `src/pages`, `src/styles`.

## Notes for This Repo

- Keep UI composition in existing components; prioritize data/translation decoupling first.
- Keep URL-driven section/query behavior from `help-center-client.tsx`.
- Prefer incremental migration (feature-flag or staged fallback) over a full rewrite.

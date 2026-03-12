# Repos Data Placement

This folder powers the tracked recipes dashboard data projection.

## Page placement map

```text
apps/web/src/app/(dashboard)/dashboard/page.tsx
  -> repositoryDashboardData
  -> getRepositoryDashboardSummary()
  -> renders:
     - RepoOverviewStats
     - RepositoryList

apps/web/src/app/(dashboard)/dashboard/[slug]/page.tsx
  -> getRepositoryBySlug(slug)
  -> renders:
     - RepositoryDetail
```

## Data flow

```text
.mocks/project-mock-03-11-2026.json
  -> repository-dashboard-data.ts
     - normalize/sanitize fields
     - compute trends:
       - commitsLast7Days / commitsLast30Days
       - additions/deletions/churn (30d)
       - deploymentsLast30Days
       - releasesLast90Days
       - topCategories / topFileTypes
  -> exported selectors:
     - repositoryDashboardData
     - getRepositoryBySlug()
     - getRepositorySlugs()
     - getRepositoryDashboardSummary()
```

## Why this exists

- Keep page components focused on rendering, not data shaping.
- Centralize mock parsing and trend calculations in one typed layer.
- Reuse the same list projection for both dashboard and detail routes.

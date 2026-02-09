# Data Evaluation: Project List Metrics & Visuals

This document outlines useful **metrics** and **visuals** for users browsing a list of project data objects. The structure is based on the mock data in [`.mocks/project-mock-02-09-2026.json`](../.mocks/project-mock-02-09-2026.json).

---

## 1. Data Object Shape (Summary)

Each list item is a **project** with:

| Layer | Key fields |
|-------|------------|
| **Root** | `id`, `name`, `slug`, `description`, `url`, `status`, `license`, `sourceType`, `inspirationScore`, `priority`, `createdAt`, `updatedAt` |
| **metadata** | `size`, `stars`, `forks`, `language`, `watchers`, `openIssues`, `visibility`, `lastSyncedAt` |
| **repo** | `owner`, `stars`, `topics[]`, `commit_count`, `contributor_count`, `openIssues`, `closedIssues`, `totalIssues`, `openPullRequests`, `mergedPullRequests`, `totalPullRequests`, `pushed_at`, `created_at`, `archived`, `default_branch` |
| **repo.packageJson** | `version`, `engines`, `workspaces`, `packageManager`, `license` |

---

## 2. Suggested Metrics for List Browsing

Metrics below are chosen so users can **compare**, **filter**, and **prioritize** projects at a glance.

### 2.1 Engagement & popularity

- **Stars** — `metadata.stars` / `repo.stars`  
  - Primary signal for community interest.
- **Forks** — `metadata.forks` / `repo.forks`  
  - Indicates reuse and potential ecosystem.
- **Watchers** — `metadata.watchers`  
  - Ongoing interest (e.g. release tracking).
- **Inspiration score** — `inspirationScore`  
  - Curated “how good is this as a template/inspiration” (if populated).

**Suggested list usage:** Sort by stars/forks; show badges (e.g. “High stars”, “Often forked”).

---

### 2.2 Activity & health

- **Last pushed** — `repo.pushed_at`  
  - Recency of development.
- **Open issues** — `metadata.openIssues` / `repo.openIssues`  
  - Maintenance burden / responsiveness signal.
- **Issue close rate** — `repo.closedIssues` / `repo.totalIssues` (when total > 0)  
  - How actively issues are triaged.
- **PR merge rate** — `repo.mergedPullRequests` / `repo.totalPullRequests`  
  - Collaboration and merge hygiene.
- **Contributor count** — `repo.contributor_count`  
  - Team/community size.
- **Commit count** — `repo.commit_count`  
  - Historical activity volume.

**Suggested list usage:** “Recently updated” filter; “Active” vs “Stale” labels; small sparkline or “last activity” age.

---

### 2.3 Stack & compatibility

- **Primary language** — `metadata.language`  
  - e.g. TypeScript, JavaScript.
- **Package manager** — `repo.packageJson.packageManager`  
  - e.g. pnpm, npm, yarn.
- **Node / engine** — `repo.packageJson.engines?.node`  
  - Runtime compatibility.
- **Monorepo** — Derived from `repo.packageJson.workspaces`  
  - Yes/no for multi-package setup.
- **License** — `license` / `repo.license`  
  - Legal reuse (e.g. MIT, GPL-3.0).

**Suggested list usage:** Filter by language, package manager, license; tags/chips in list rows.

---

### 2.4 Curation & status

- **Status** — `status` (e.g. `active`)  
  - Lifecycle state.
- **Source type** — `sourceType` (e.g. `template`)  
  - How the project is intended to be used.
- **Priority** — `priority`  
  - Editorial or ranking order.
- **Archived** — `repo.archived`  
  - Repo no longer actively maintained.

**Suggested list usage:** Filter by status/sourceType; sort or highlight by priority.

---

### 2.5 Size & complexity

- **Repo size** — `metadata.size`  
  - Approximate size (e.g. KB).
- **Version** — `repo.packageJson.version`  
  - Release maturity (semver).
- **Docs presence** — Derived from `repo.markdownFiles` (e.g. README, CONTRIBUTING)  
  - Boolean or count of key docs.

**Suggested list usage:** “Small / medium / large” buckets; “Has docs” badge.

---

## 3. Suggested Visuals for the List Experience

### 3.1 List / table view

- **Compact row:** name, description snippet, stars, language, “last pushed” age, status, license.
- **Sortable columns:** stars, forks, updatedAt, openIssues, contributor_count, size.
- **Chips/tags:** `repo.topics`, language, license, package manager.
- **Badges:** “Active”, “Template”, “Monorepo”, “Recently updated”, “High PR merge rate”.

### 3.2 Summary cards (above or beside the list)

- **Total projects** and counts by **status** / **sourceType**.
- **Top languages** (bar or pie).
- **License distribution** (bar or pie).
- **Activity:** share of projects updated in last 7 / 30 / 90 days.

### 3.3 Filters and facets

- **Status** — active / inactive / etc.
- **Source type** — template / example / other.
- **Language** — multi-select.
- **License** — permissive vs copyleft vs other.
- **Activity** — last pushed in last N days.
- **Size** — small / medium / large (from `metadata.size`).
- **Topics** — multi-select from `repo.topics` (aggregated across list).
- **Min stars / min contributors** — range or threshold.

### 3.4 Detail view (single project)

- **Header:** name, stars, forks, language, license, status, last pushed.
- **Tabs or sections:** Overview (description, url), Repo stats (issues, PRs, contributors, commits), Stack (engines, package manager, workspaces), Topics, Docs (from markdownFiles).
- **Small charts:** issue open/closed over time (if history exists); PR merged vs total; or simple “activity score” bar.

### 3.5 Optional dashboard (aggregate)

- **Stars distribution** — histogram or buckets.
- **Activity over time** — count of projects with `pushed_at` in each week/month.
- **Language × license** — heatmap or grouped bars.
- **Top topics** — tag cloud or bar chart from all `repo.topics`.

---

## 4. Implementation notes

- **Normalize dates:** Use `repo.pushed_at` or `updatedAt` consistently for “last activity” and cache computed ages.
- **Derived fields:** Compute “issue close rate”, “PR merge rate”, “has docs”, “is monorepo” at load or in a thin API layer so the list UI stays simple.
- **Nulls:** `repo.last_commit`, `repo.readme`, `logo`, `twitter` can be null; hide or show “N/A” so filters don’t break.
- **Performance:** For large lists, aggregate topics/languages for facets on the server; avoid scanning full payloads in the client for every filter change.

---

## 5. Quick reference: fields → metrics

| Metric / need | Field(s) |
|---------------|----------|
| Popularity | `metadata.stars`, `repo.stars`, `metadata.forks`, `repo.forks`, `metadata.watchers` |
| Recency | `repo.pushed_at`, `updatedAt`, `metadata.lastSyncedAt` |
| Maintenance | `metadata.openIssues`, `repo.openIssues`, `repo.closedIssues`, `repo.totalIssues` |
| Collaboration | `repo.mergedPullRequests`, `repo.totalPullRequests`, `repo.contributor_count` |
| Stack | `metadata.language`, `repo.packageJson.engines`, `repo.packageJson.packageManager`, `repo.packageJson.workspaces` |
| Legal | `license`, `repo.license` |
| Curation | `status`, `sourceType`, `priority`, `inspirationScore` |
| Size / maturity | `metadata.size`, `repo.packageJson.version` |
| Topics | `repo.topics` |

This structure should give users a clear, comparable, and filterable view when browsing a list of these project data objects.

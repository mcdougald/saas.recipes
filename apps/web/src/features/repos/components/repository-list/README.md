# Repository List Components

This directory contains the dashboard list view that compares tracked repositories at a glance.

## Informational data displayed

- **Portfolio rollup:** total commits, deployments, contributors, merge-rate average, and a comparative trend bar chart across all listed repositories.
- **Project identity:** owner/repo, source type, visibility, update recency, package manager, and quick links to recipe page/app/repo.
- **Developer relevance signals:** stars, forks, watchers, contributor count, open PR/issue pressure, merge rate, issue closure rate, and deployment success.
- **Trend visuals:** per-repository sparkline, normalized bars for commits/deployments/releases, and a churn split (additions vs deletions).
- **Context tags:** language, license, branch, package manager, topic tags, top change categories, and top file-type labels.

## Files

- `repository-list.tsx` - list shell + aggregate cards and portfolio visual.
- `repository-list-item.tsx` - dense per-repository card with metrics and links.
- `trend-visuals.tsx` - reusable mini chart primitives for list cards.

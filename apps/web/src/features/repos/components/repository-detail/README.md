# Repository Detail Components

This directory contains the `/dashboard/[slug]` repository detail experience with tabbed engineering analytics.

## Informational data displayed

- **Overview:** reach, momentum, delivery quality, codebase shape, trend pulse sparkline, and operational scorecards.
- **Contributors:** contributor roster, bot/human tags, commit/file volume, additions/deletions, and last-commit recency.
- **Dependencies:** package inventory with direct/dev/peer role tags, critical risk flags, version drift hints, and usage counts.
- **Deployments:** environment-level deployment throughput, success-rate progress, and recent deployment event feed.
- **PRs:** merge/open distribution, comment load, commit/file impact, and sampled pull request history.
- **Files:** markdown/documentation inventory, largest-file list, hotspot-file list, and architecture topic tags.

## Files

- `repository-detail.tsx` - page composition, header actions, and tabs wiring.
- `repository-detail-utils.ts` - normalization helpers, shared formatters, and typed detail model.
- `repository-detail-overview-tab.tsx` - overview tab content.
- `repository-detail-contributors-tab.tsx` - contributors tab content.
- `repository-detail-dependencies-tab.tsx` - dependencies tab content.
- `repository-detail-deployments-tab.tsx` - deployments tab content.
- `repository-detail-prs-tab.tsx` - pull requests tab content.
- `repository-detail-files-tab.tsx` - files/docs tab content.

import type {
  RepositoryDashboardListItem,
  RepositoryDashboardSummary,
} from "@/features/repos/types";

export const repositoryDashboardData: RepositoryDashboardListItem[] = [
  {
    id: "project-k62j6cuc3pt8ii6qea1su58p",
    name: "InReach",
    slug: "weareinreach-inreach",
    description:
      "InReach is the world's first open source verified LGBTQ+ resource platform.",
    status: "active",
    url: "https://app.inreach.org",
    license: "GPL-3.0",
    sourceType: "template",
    inspirationScore: 1,
    metadata: {
      stars: 46,
      forks: 5,
      openIssues: 9,
      watchers: 46,
      language: "TypeScript",
      lastSyncedAt: "2026-02-04T03:44:08.417Z",
    },
    repo: {
      owner: "weareinreach",
      name: "InReach",
      default_branch: "dev",
      pushed_at: "2026-02-04T01:36:26.000Z",
      commit_count: 5690,
      contributor_count: 19,
      openPullRequests: 1,
      mergedPullRequests: 1394,
      totalPullRequests: 1552,
      topics: ["lgbtq", "nextjs", "prisma", "trpc", "typescript"],
    },
  },
  {
    id: "project-7q3i1mock5f8k2pj9as6c4te",
    name: "OpsBoard",
    slug: "acme-opsboard",
    description:
      "Internal operations portal for dispatch, incidents, and maintenance workflows.",
    status: "active",
    url: "https://opsboard.example.com",
    license: "MIT",
    sourceType: "reference",
    inspirationScore: 2,
    metadata: {
      stars: 128,
      forks: 18,
      openIssues: 22,
      watchers: 30,
      language: "TypeScript",
      lastSyncedAt: "2026-02-15T18:02:11.000Z",
    },
    repo: {
      owner: "acme",
      name: "opsboard",
      default_branch: "main",
      pushed_at: "2026-02-16T06:32:10.000Z",
      commit_count: 2381,
      contributor_count: 11,
      openPullRequests: 6,
      mergedPullRequests: 402,
      totalPullRequests: 471,
      topics: ["nextjs", "postgres", "monitoring", "dashboard"],
    },
  },
  {
    id: "project-z1r9p6mock5b3y8tw2u4h7na",
    name: "BillingPilot",
    slug: "acme-billingpilot",
    description:
      "Subscription billing and invoicing control plane used by multiple SaaS products.",
    status: "paused",
    url: "https://billingpilot.example.com",
    license: "Apache-2.0",
    sourceType: "starter",
    inspirationScore: 3,
    metadata: {
      stars: 87,
      forks: 13,
      openIssues: 14,
      watchers: 21,
      language: "Go",
      lastSyncedAt: "2026-02-10T14:22:55.000Z",
    },
    repo: {
      owner: "acme",
      name: "billingpilot",
      default_branch: "main",
      pushed_at: "2026-02-11T09:04:19.000Z",
      commit_count: 1442,
      contributor_count: 8,
      openPullRequests: 3,
      mergedPullRequests: 196,
      totalPullRequests: 229,
      topics: ["billing", "golang", "stripe", "apis"],
    },
  },
];

export function getRepositoryDashboardSummary(
  projects: RepositoryDashboardListItem[],
): RepositoryDashboardSummary {
  return {
    totalStars: projects.reduce((sum, project) => sum + project.metadata.stars, 0),
    totalContributors: projects.reduce(
      (sum, project) => sum + project.repo.contributor_count,
      0,
    ),
    totalOpenIssues: projects.reduce(
      (sum, project) => sum + project.metadata.openIssues,
      0,
    ),
    totalOpenPullRequests: projects.reduce(
      (sum, project) => sum + project.repo.openPullRequests,
      0,
    ),
  };
}

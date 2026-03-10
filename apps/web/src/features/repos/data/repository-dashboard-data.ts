import {
  type RepositoryDashboardItem,
  type RepositoryDashboardListItem,
  type RepositoryDashboardSummary,
  type RepositorySourceType,
  type RepositoryStatus,
  type RepositoryVisibility,
} from "@/features/repos/types";
import projectMockData from "../../../../../../.mocks/project-mock-02-09-2026.json";

const DAY_IN_MS = 24 * 60 * 60 * 1000;
const SUPPORTED_STATUSES = new Set<RepositoryStatus>([
  "active",
  "paused",
  "archived",
]);
const SUPPORTED_SOURCE_TYPES = new Set<RepositorySourceType>([
  "template",
  "reference",
  "starter",
]);
const SUPPORTED_VISIBILITY = new Set<RepositoryVisibility>([
  "public",
  "private",
  "internal",
]);

function safeNumber(value: unknown, fallback = 0): number {
  if (typeof value === "number" && Number.isFinite(value)) {
    return value;
  }

  return fallback;
}

function safeString(value: unknown, fallback = ""): string {
  return typeof value === "string" && value.length > 0 ? value : fallback;
}

function normalizeStatus(value: unknown): RepositoryStatus {
  return SUPPORTED_STATUSES.has(value as RepositoryStatus)
    ? (value as RepositoryStatus)
    : "active";
}

function normalizeSourceType(value: unknown): RepositorySourceType {
  return SUPPORTED_SOURCE_TYPES.has(value as RepositorySourceType)
    ? (value as RepositorySourceType)
    : "template";
}

function normalizeVisibility(value: unknown): RepositoryVisibility {
  return SUPPORTED_VISIBILITY.has(value as RepositoryVisibility)
    ? (value as RepositoryVisibility)
    : "public";
}

function normalizeIsoDate(
  value: unknown,
  fallback = "1970-01-01T00:00:00.000Z",
): string {
  return typeof value === "string" && value.length > 0 ? value : fallback;
}

function isPushedWithinDays(pushedAt: string, days: number): boolean {
  const parsedDate = Date.parse(pushedAt);
  if (Number.isNaN(parsedDate)) {
    return false;
  }

  return Date.now() - parsedDate <= days * DAY_IN_MS;
}

const rawProjects =
  (projectMockData as unknown as { data?: RepositoryDashboardItem[] }).data ??
  [];

/**
 * Provide repository dashboard rows from the latest mock payload's `data` array.
 */
export const repositoryDashboardData: RepositoryDashboardListItem[] =
  rawProjects.map((project) => ({
    id: safeString(project.id, "unknown-project"),
    name: safeString(project.name, "Unnamed repository"),
    slug: safeString(
      project.slug,
      safeString(project.name, "unknown").toLowerCase(),
    ),
    description: safeString(
      project.description,
      "No project description available.",
    ),
    status: normalizeStatus(project.status),
    url: safeString(project.url, "#"),
    license: typeof project.license === "string" ? project.license : null,
    sourceType: normalizeSourceType(project.sourceType),
    inspirationScore: safeNumber(project.inspirationScore),
    metadata: {
      size: safeNumber(project.metadata?.size),
      stars: safeNumber(project.metadata?.stars),
      forks: safeNumber(project.metadata?.forks),
      language: safeString(project.metadata?.language, "Unknown"),
      watchers: safeNumber(project.metadata?.watchers),
      openIssues: safeNumber(project.metadata?.openIssues),
      visibility: normalizeVisibility(project.metadata?.visibility),
      lastSyncedAt: normalizeIsoDate(project.metadata?.lastSyncedAt),
    },
    repo: {
      owner: safeString(project.repo?.owner, "unknown"),
      name: safeString(project.repo?.name, "unknown"),
      created_at: normalizeIsoDate(project.repo?.created_at),
      default_branch: safeString(project.repo?.default_branch, "main"),
      pushed_at: normalizeIsoDate(project.repo?.pushed_at),
      stars: safeNumber(project.repo?.stars),
      forks: safeNumber(project.repo?.forks),
      commit_count: safeNumber(project.repo?.commit_count),
      contributor_count: safeNumber(project.repo?.contributor_count),
      openIssues: safeNumber(project.repo?.openIssues),
      closedIssues: safeNumber(project.repo?.closedIssues),
      totalIssues: safeNumber(project.repo?.totalIssues),
      openPullRequests: safeNumber(project.repo?.openPullRequests),
      mergedPullRequests: safeNumber(project.repo?.mergedPullRequests),
      totalPullRequests: safeNumber(project.repo?.totalPullRequests),
      topics: Array.isArray(project.repo?.topics)
        ? project.repo.topics.filter(
            (topic): topic is string => typeof topic === "string",
          )
        : [],
      deployments: project.repo?.deployments ?? null,
      packageManager:
        typeof project.repo?.packageManager === "string"
          ? project.repo.packageManager
          : null,
      packageJson:
        project.repo?.packageJson &&
        typeof project.repo.packageJson === "object"
          ? project.repo.packageJson
          : null,
      dependencyCount: Array.isArray(project.repo?.dependencies)
        ? project.repo.dependencies.length
        : 0,
      workspacePackageCount: Array.isArray(project.repo?.workspacePackageJsons)
        ? project.repo.workspacePackageJsons.length
        : 0,
      totalFilesTouched: Array.isArray(project.repo?.commits)
        ? project.repo.commits.reduce(
            (sum, commit) => sum + safeNumber(commit.files_changed),
            0,
          )
        : 0,
    },
  }));

/**
 * Aggregate high-signal metrics for repository dashboard cards.
 *
 * @param projects - Repository items currently shown in the dashboard.
 * @returns Rollup values used by overview stat cards.
 */
export function getRepositoryDashboardSummary(
  projects: RepositoryDashboardListItem[],
): RepositoryDashboardSummary {
  const totalRepositories = projects.length;
  const totalStars = projects.reduce(
    (sum, project) => sum + project.metadata.stars,
    0,
  );
  const totalForks = projects.reduce(
    (sum, project) => sum + project.metadata.forks,
    0,
  );
  const totalContributors = projects.reduce(
    (sum, project) => sum + project.repo.contributor_count,
    0,
  );
  const totalCommits = projects.reduce(
    (sum, project) => sum + project.repo.commit_count,
    0,
  );
  const totalDependencies = projects.reduce(
    (sum, project) => sum + project.repo.dependencyCount,
    0,
  );
  const totalWorkspacePackages = projects.reduce(
    (sum, project) => sum + project.repo.workspacePackageCount,
    0,
  );
  const totalFilesTouched = projects.reduce(
    (sum, project) => sum + project.repo.totalFilesTouched,
    0,
  );
  const totalRepoSizeKb = projects.reduce(
    (sum, project) => sum + project.metadata.size,
    0,
  );
  const totalOpenIssues = projects.reduce(
    (sum, project) => sum + project.metadata.openIssues,
    0,
  );
  const totalOpenPullRequests = projects.reduce(
    (sum, project) => sum + project.repo.openPullRequests,
    0,
  );
  const totalPullRequests = projects.reduce(
    (sum, project) => sum + project.repo.totalPullRequests,
    0,
  );
  const totalMergedPullRequests = projects.reduce(
    (sum, project) => sum + project.repo.mergedPullRequests,
    0,
  );
  const deploymentSuccessRateValues = projects
    .map((project) => project.repo.deployments?.successRate)
    .filter(
      (value): value is number =>
        typeof value === "number" && Number.isFinite(value),
    );
  const averageDeploymentSuccessRate =
    deploymentSuccessRateValues.length > 0
      ? deploymentSuccessRateValues.reduce((sum, value) => sum + value, 0) /
        deploymentSuccessRateValues.length
      : null;
  const recentlyPushedLast30Days = projects.filter((project) =>
    isPushedWithinDays(project.repo.pushed_at, 30),
  ).length;

  return {
    totalRepositories,
    totalStars,
    totalForks,
    totalContributors,
    totalCommits,
    totalDependencies,
    totalWorkspacePackages,
    totalFilesTouched,
    totalRepoSizeKb,
    totalOpenIssues,
    totalOpenPullRequests,
    averageMergeRate:
      totalPullRequests > 0
        ? Math.round((totalMergedPullRequests / totalPullRequests) * 100)
        : 0,
    averageDeploymentSuccessRate:
      averageDeploymentSuccessRate === null
        ? null
        : Math.round(averageDeploymentSuccessRate),
    recentlyPushedLast30Days,
  };
}

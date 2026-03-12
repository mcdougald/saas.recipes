import {
  type RepositoryDashboardListItem,
  type RepositoryDashboardSummary,
  type RepositorySourceType,
  type RepositoryStatus,
  type RepositoryVisibility,
} from "@/features/repos/types";
import projectMockData from "../../../../../../.mocks/project-mock-03-11-2026.json";
import {
  type ProjectMockItem,
  type ProjectMockPayload,
} from "./project-mock-types";

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
type RawCommit = NonNullable<
  NonNullable<ProjectMockItem["repo"]>["commits"]
>[number];

function safeNumber(value: unknown, fallback = 0): number {
  if (typeof value === "number" && Number.isFinite(value)) {
    return value;
  }

  return fallback;
}

function safeString(value: unknown, fallback = ""): string {
  return typeof value === "string" && value.length > 0 ? value : fallback;
}

function clamp(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value));
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

function isRecentDate(value: unknown, days: number): boolean {
  if (typeof value !== "string") {
    return false;
  }

  const parsedDate = Date.parse(value);
  if (Number.isNaN(parsedDate)) {
    return false;
  }

  return Date.now() - parsedDate <= days * DAY_IN_MS;
}

function getRecentCommitDate(commit: RawCommit): string | null {
  if (typeof commit.authored_date === "string" && commit.authored_date.length) {
    return commit.authored_date;
  }

  if (
    typeof commit.committed_date === "string" &&
    commit.committed_date.length
  ) {
    return commit.committed_date;
  }

  if (typeof commit.created_at === "string" && commit.created_at.length) {
    return commit.created_at;
  }

  return null;
}

function getTopStringsByCount(source: unknown[], limit = 2): string[] {
  const counts = new Map<string, number>();
  for (const value of source) {
    if (typeof value !== "string" || value.length === 0) {
      continue;
    }

    counts.set(value, (counts.get(value) ?? 0) + 1);
  }

  return [...counts.entries()]
    .toSorted((a, b) => b[1] - a[1])
    .slice(0, limit)
    .map(([value]) => value);
}

function toObjectArray(source: unknown): Record<string, unknown>[] {
  if (!Array.isArray(source)) {
    return [];
  }

  return source.filter(
    (value): value is Record<string, unknown> =>
      typeof value === "object" && value !== null,
  );
}

function toObjectRecord(source: unknown): Record<string, unknown> | null {
  if (typeof source !== "object" || source === null) {
    return null;
  }

  return source as Record<string, unknown>;
}

function toStringArray(source: unknown): string[] {
  if (!Array.isArray(source)) {
    return [];
  }

  return source.filter(
    (value): value is string => typeof value === "string" && value.length > 0,
  );
}

function toAiSetupMetrics(
  source: unknown,
): RepositoryDashboardListItem["repo"]["aiSetupMetrics"] {
  const metrics = toObjectRecord(source);
  if (!metrics) {
    return null;
  }

  const churnRecord = toObjectRecord(metrics.churn);
  const topChangedFiles = toObjectArray(churnRecord?.topChangedFiles).map(
    (file) => ({
      path: safeString(file.path),
      changeCount: safeNumber(file.changeCount),
      lastChangedAt:
        typeof file.lastChangedAt === "string" ? file.lastChangedAt : null,
      additionsTotal: safeNumber(file.additionsTotal),
      deletionsTotal: safeNumber(file.deletionsTotal),
    }),
  );

  return {
    churn: churnRecord
      ? {
          totalAdditions: safeNumber(churnRecord.totalAdditions),
          totalDeletions: safeNumber(churnRecord.totalDeletions),
          totalChangeCount: safeNumber(churnRecord.totalChangeCount),
          touchedFileCount: safeNumber(churnRecord.touchedFileCount),
          touchedCommitCount: safeNumber(churnRecord.touchedCommitCount),
          analyzedCommitCount: safeNumber(churnRecord.analyzedCommitCount),
          topChangedFiles,
        }
      : null,
    detectedTools: toStringArray(metrics.detectedTools),
    totalFileCount: safeNumber(metrics.totalFileCount),
    instructionFiles: toObjectArray(metrics.instructionFiles).map((file) => ({
      path: safeString(file.path),
      type: safeString(file.type),
    })),
    toolingDirectories: toStringArray(metrics.toolingDirectories),
    fileExtensionCounts: toObjectArray(metrics.fileExtensionCounts).map(
      (entry) => ({
        extension: safeString(entry.extension, "unknown"),
        count: safeNumber(entry.count),
      }),
    ),
    instructionFileCount: safeNumber(metrics.instructionFileCount),
    totalConfigFileCount: safeNumber(metrics.totalConfigFileCount),
    toolingDirectoryCount: safeNumber(metrics.toolingDirectoryCount),
    instructionFileTypeCounts: toObjectArray(
      metrics.instructionFileTypeCounts,
    ).map((entry) => ({
      type: safeString(entry.type, "unknown"),
      count: safeNumber(entry.count),
    })),
  };
}

function toHotspotFiles(
  source: unknown,
): RepositoryDashboardListItem["repo"]["hotspotFiles"] {
  return toObjectArray(source).map((file) => ({
    path: safeString(file.path),
    changeCount: safeNumber(file.changeCount),
    lastChangedAt:
      typeof file.lastChangedAt === "string" ? file.lastChangedAt : null,
    additionsTotal: safeNumber(file.additionsTotal),
    deletionsTotal: safeNumber(file.deletionsTotal),
  }));
}

function toLargestFiles(
  source: unknown,
): RepositoryDashboardListItem["repo"]["largestFiles"] {
  return toObjectArray(source).map((file) => ({
    path: safeString(file.path),
    size: safeNumber(file.size),
    extension: typeof file.extension === "string" ? file.extension : null,
  }));
}

function getMergeEfficiency30Days(
  pullRequestAnalytics: Record<string, unknown> | null,
  fallbackMergedCount: number,
  fallbackTotalCount: number,
): number {
  const activityByMonth = toObjectArray(pullRequestAnalytics?.activityByMonth);
  const recentBucket = activityByMonth
    .toSorted((a, b) => {
      const aMonth = safeString(a.month);
      const bMonth = safeString(b.month);
      return bMonth.localeCompare(aMonth);
    })
    .at(0);

  const recentOpenedCount = safeNumber(recentBucket?.openedCount, -1);
  const recentMergedCount = safeNumber(recentBucket?.mergedCount, -1);
  if (recentOpenedCount > 0 && recentMergedCount >= 0) {
    return Math.round((recentMergedCount / recentOpenedCount) * 100);
  }

  if (fallbackTotalCount <= 0) {
    return 0;
  }

  return Math.round((fallbackMergedCount / fallbackTotalCount) * 100);
}

function getStabilityScore(params: {
  mergeEfficiency30Days: number;
  deploymentSuccessRate: number;
  avgCommitSize30Days: number;
  openIssueRatio: number;
}): number {
  const mergeComponent = clamp(params.mergeEfficiency30Days * 0.18, 0, 26);
  const deployComponent = clamp(params.deploymentSuccessRate * 0.16, 0, 22);
  const churnPenalty = clamp(params.avgCommitSize30Days / 4, 0, 24);
  const issuePenalty = clamp(params.openIssueRatio * 35, 0, 24);
  const score =
    58 + mergeComponent + deployComponent - churnPenalty - issuePenalty;
  return clamp(Math.round(score), 0, 100);
}

function getActivityScore(params: {
  commitsLast30Days: number;
  deploymentsLast30Days: number | null;
  releasesLast90Days: number | null;
  contributorCount: number;
}): number {
  const commitScore = clamp(params.commitsLast30Days, 0, 42);
  const deploymentScore = clamp(
    (params.deploymentsLast30Days ?? 0) * 2.4,
    0,
    24,
  );
  const releaseScore = clamp((params.releasesLast90Days ?? 0) * 4.5, 0, 16);
  const contributorScore = clamp(params.contributorCount * 0.75, 0, 18);
  return clamp(
    Math.round(commitScore + deploymentScore + releaseScore + contributorScore),
    0,
    100,
  );
}

const mockPayload = projectMockData as unknown as ProjectMockPayload;
const rawProjects = Array.isArray(mockPayload.data) ? mockPayload.data : [];

/**
 * Provide repository dashboard rows from the latest mock payload's `data` array.
 */
export const repositoryDashboardData: RepositoryDashboardListItem[] =
  rawProjects.map((project) => {
    const repo = project.repo ?? {};
    const commits = Array.isArray(repo.commits) ? repo.commits : [];
    const commitsLast7Days = commits.filter((commit) =>
      isRecentDate(getRecentCommitDate(commit), 7),
    );
    const commitsLast30Days = commits.filter((commit) =>
      isRecentDate(getRecentCommitDate(commit), 30),
    );
    const additionsLast30Days = commitsLast30Days.reduce(
      (sum, commit) => sum + safeNumber(commit.additions),
      0,
    );
    const deletionsLast30Days = commitsLast30Days.reduce(
      (sum, commit) => sum + safeNumber(commit.deletions),
      0,
    );
    const topCategories = getTopStringsByCount(
      commitsLast30Days.flatMap((commit) =>
        Array.isArray(commit.categories) ? commit.categories : [],
      ),
    );
    const topFileTypes = getTopStringsByCount(
      commitsLast30Days.flatMap((commit) =>
        Array.isArray(commit.file_types) ? commit.file_types : [],
      ),
    );
    const dependencyEntries = toObjectArray(repo.dependencies);
    const dependencyGroupEntries = toObjectArray(repo.dependencyGroups);
    const dependencyChangeEntries = toObjectArray(repo.dependencyChanges);
    const workspacePackageEntries = toObjectArray(repo.workspacePackageJsons);
    const contributorEntries = toObjectArray(repo.contributors);
    const pullRequestAnalytics = toObjectRecord(repo.pullRequests);
    const issueAnalytics = toObjectRecord(repo.issues);
    const markdownFiles = toObjectArray(repo.markdownFiles).map((file) => ({
      path: safeString(file.path),
      size: safeNumber(file.size),
      filename: safeString(file.filename),
      content: safeString(file.content),
    }));
    const aiSetupMetrics = toAiSetupMetrics(repo.aiSetupMetrics);
    const hotspotFiles = toHotspotFiles(repo.hotspotFiles);
    const largestFiles = toLargestFiles(repo.largestFiles);
    const recentReleases = repo.releases?.recentReleases;
    const releasesLast90Days = Array.isArray(recentReleases)
      ? recentReleases.filter((release) =>
          isRecentDate(release.publishedAt ?? release.createdAt, 90),
        ).length
      : null;
    const deploymentSuccessRate =
      typeof repo.deployments?.successRate === "number" &&
      Number.isFinite(repo.deployments.successRate)
        ? repo.deployments.successRate
        : 0;
    const deploymentsLast30Days =
      typeof repo.deployments?.deploymentsLast30Days === "number" &&
      Number.isFinite(repo.deployments.deploymentsLast30Days)
        ? repo.deployments.deploymentsLast30Days
        : null;
    const openIssueCount = safeNumber(repo.openIssues);
    const totalIssueCount = safeNumber(repo.totalIssues);
    const openIssueRatio =
      totalIssueCount > 0 ? clamp(openIssueCount / totalIssueCount, 0, 1) : 0;
    const avgCommitSize30Days =
      commitsLast30Days.length > 0
        ? Math.round(
            (additionsLast30Days + deletionsLast30Days) /
              commitsLast30Days.length,
          )
        : 0;
    const commitMomentumRatio =
      commitsLast30Days.length > 0
        ? Number(
            (
              (commitsLast7Days.length * (30 / 7)) /
              commitsLast30Days.length
            ).toFixed(2),
          )
        : 0;
    const mergeEfficiency30Days = getMergeEfficiency30Days(
      pullRequestAnalytics,
      safeNumber(repo.mergedPullRequests),
      safeNumber(repo.totalPullRequests),
    );
    const deploymentFrequencyPerWeek =
      deploymentsLast30Days === null
        ? null
        : Number(((deploymentsLast30Days / 30) * 7).toFixed(1));
    const releaseFrequencyPerMonth =
      releasesLast90Days === null
        ? null
        : Number((releasesLast90Days / 3).toFixed(1));
    const stabilityScore = getStabilityScore({
      mergeEfficiency30Days,
      deploymentSuccessRate,
      avgCommitSize30Days,
      openIssueRatio,
    });
    const activityScore = getActivityScore({
      commitsLast30Days: commitsLast30Days.length,
      deploymentsLast30Days,
      releasesLast90Days,
      contributorCount: safeNumber(repo.contributor_count),
    });

    return {
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
      trends: {
        commitsLast7Days: commitsLast7Days.length,
        commitsLast30Days: commitsLast30Days.length,
        additionsLast30Days,
        deletionsLast30Days,
        codeChurnLast30Days: additionsLast30Days + deletionsLast30Days,
        deploymentsLast30Days,
        releasesLast90Days,
        topCategories,
        topFileTypes,
        commitMomentumRatio,
        mergeEfficiency30Days,
        deploymentFrequencyPerWeek,
        releaseFrequencyPerMonth,
        avgCommitSize30Days,
        stabilityScore,
        activityScore,
      },
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
        owner: safeString(repo.owner, "unknown"),
        name: safeString(repo.name, "unknown"),
        created_at: normalizeIsoDate(repo.created_at),
        default_branch: safeString(repo.default_branch, "main"),
        pushed_at: normalizeIsoDate(repo.pushed_at),
        stars: safeNumber(repo.stars),
        forks: safeNumber(repo.forks),
        commit_count: safeNumber(repo.commit_count),
        contributor_count: safeNumber(repo.contributor_count),
        openIssues: safeNumber(repo.openIssues),
        closedIssues: safeNumber(repo.closedIssues),
        totalIssues: safeNumber(repo.totalIssues),
        openPullRequests: safeNumber(repo.openPullRequests),
        closedPullRequests: safeNumber(repo.closedPullRequests),
        mergedPullRequests: safeNumber(repo.mergedPullRequests),
        totalPullRequests: safeNumber(repo.totalPullRequests),
        latestVersion:
          typeof repo.latestVersion === "string" ? repo.latestVersion : null,
        topics: Array.isArray(repo.topics)
          ? repo.topics.filter(
              (topic): topic is string => typeof topic === "string",
            )
          : [],
        deployments: repo.deployments ?? null,
        releases: repo.releases ?? null,
        pullRequests:
          pullRequestAnalytics as RepositoryDashboardListItem["repo"]["pullRequests"],
        issues: issueAnalytics as RepositoryDashboardListItem["repo"]["issues"],
        contributors: contributorEntries,
        packageManager:
          typeof repo.packageManager === "string" ? repo.packageManager : null,
        packageJson:
          repo.packageJson && typeof repo.packageJson === "object"
            ? repo.packageJson
            : null,
        markdownFiles,
        aiSetupMetrics,
        dependencies: dependencyEntries,
        dependencyGroups: dependencyGroupEntries,
        dependencyChanges: dependencyChangeEntries,
        hotspotFiles,
        largestFiles,
        workspacePackageJsons: workspacePackageEntries,
        commits: commits as RepositoryDashboardListItem["repo"]["commits"],
        gitAnalysis: toObjectRecord(
          repo.gitAnalysis,
        ) as RepositoryDashboardListItem["repo"]["gitAnalysis"],
        dependencyCount: dependencyEntries.length,
        workspacePackageCount: workspacePackageEntries.length,
        totalFilesTouched: Array.isArray(repo.commits)
          ? repo.commits.reduce(
              (sum, commit) => sum + safeNumber(commit.files_changed),
              0,
            )
          : 0,
      },
    };
  });

/**
 * Resolve a repository dashboard item by its canonical slug.
 *
 * @param slug - Repository slug from the route segment.
 * @returns Matching repository dashboard item, or `undefined` when absent.
 */
export function getRepositoryBySlug(slug: string) {
  return repositoryDashboardData.find((project) => project.slug === slug);
}

/**
 * List all repository slugs for dynamic dashboard route generation.
 *
 * @returns Slugs used by repository detail routes.
 */
export function getRepositorySlugs() {
  return repositoryDashboardData.map((project) => project.slug);
}

/**
 * Find repositories related by language or source type.
 *
 * @param slug - Current repository slug.
 * @param limit - Max related repositories to return.
 * @returns Ordered related repositories excluding the current one.
 */
export function getRelatedRepositoriesBySlug(
  slug: string,
  limit = 4,
): RepositoryDashboardListItem[] {
  const current = getRepositoryBySlug(slug);
  if (!current) {
    return [];
  }

  return repositoryDashboardData
    .filter((project) => project.slug !== slug)
    .toSorted((a, b) => {
      const aScore =
        Number(a.metadata.language === current.metadata.language) +
        Number(a.sourceType === current.sourceType) +
        Number(a.metadata.stars > current.metadata.stars * 0.3);
      const bScore =
        Number(b.metadata.language === current.metadata.language) +
        Number(b.sourceType === current.sourceType) +
        Number(b.metadata.stars > current.metadata.stars * 0.3);

      if (bScore === aScore) {
        return b.inspirationScore - a.inspirationScore;
      }

      return bScore - aScore;
    })
    .slice(0, limit);
}

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

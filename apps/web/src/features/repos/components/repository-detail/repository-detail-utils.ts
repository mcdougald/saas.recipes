import { type RepositoryDashboardListItem } from "@/features/repos/types";

const numberFormatter = new Intl.NumberFormat("en-US", {
  maximumFractionDigits: 0,
});

const compactNumberFormatter = new Intl.NumberFormat("en-US", {
  notation: "compact",
  maximumFractionDigits: 1,
});

const dateFormatter = new Intl.DateTimeFormat("en-US", {
  month: "short",
  day: "numeric",
  year: "numeric",
});

type DataRecord = Record<string, unknown>;

function asRecord(value: unknown): DataRecord | null {
  if (typeof value !== "object" || value === null) {
    return null;
  }

  return value as DataRecord;
}

function asArray(value: unknown): unknown[] {
  return Array.isArray(value) ? value : [];
}

function stringValue(value: unknown, fallback = ""): string {
  return typeof value === "string" ? value : fallback;
}

function numberValue(value: unknown, fallback = 0): number {
  return typeof value === "number" && Number.isFinite(value) ? value : fallback;
}

function nullableDate(value: unknown): string | null {
  const normalized = stringValue(value);
  return normalized.length > 0 ? normalized : null;
}

function parseTimestamp(value: unknown): number | null {
  if (typeof value !== "string" || value.length === 0) {
    return null;
  }
  const parsed = Date.parse(value);
  return Number.isNaN(parsed) ? null : parsed;
}

function normalizeLabelKey(value: string): string {
  return value.toLowerCase().trim().replace(/\s+/g, "-");
}

function pushCount(
  counter: Map<string, number>,
  key: string,
  amount = 1,
): void {
  if (key.length === 0 || amount <= 0) {
    return;
  }
  counter.set(key, (counter.get(key) ?? 0) + amount);
}

function topEntriesFromCounter(
  counter: Map<string, number>,
  limit: number,
): DetailFileTypeEntry[] {
  return [...counter.entries()]
    .toSorted((a, b) => b[1] - a[1])
    .slice(0, limit)
    .map(([label, value]) => ({
      key: normalizeLabelKey(label),
      label,
      value,
    }));
}

function monthKeyFromDate(date: Date): string {
  return `${date.getUTCFullYear()}-${String(date.getUTCMonth() + 1).padStart(2, "0")}`;
}

function monthLabelFromKey(key: string): string {
  const [year, month] = key.split("-");
  const yearValue = Number.parseInt(year, 10);
  const monthValue = Number.parseInt(month, 10);
  if (
    Number.isNaN(yearValue) ||
    Number.isNaN(monthValue) ||
    monthValue < 1 ||
    monthValue > 12
  ) {
    return key;
  }
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    year: "2-digit",
    timeZone: "UTC",
  }).format(new Date(Date.UTC(yearValue, monthValue - 1, 1)));
}

/**
 * Format integer metrics for detail panels.
 *
 * @param value - Numeric value to render.
 * @returns Locale-aware integer string.
 */
export function formatNumber(value: number): string {
  return numberFormatter.format(value);
}

/**
 * Format large metrics in compact notation.
 *
 * @param value - Numeric value to render.
 * @returns Compact locale-aware string.
 */
export function formatCompactNumber(value: number): string {
  return compactNumberFormatter.format(value);
}

/**
 * Format ISO date labels for UI display.
 *
 * @param value - ISO date value.
 * @returns Short date label, or `Unknown` when missing.
 */
export function formatDate(value: string | null): string {
  if (!value) {
    return "Unknown";
  }

  const parsed = Date.parse(value);
  if (Number.isNaN(parsed)) {
    return "Unknown";
  }

  return dateFormatter.format(new Date(parsed));
}

/**
 * Build a canonical GitHub URL for the current project.
 *
 * @param project - Repository dashboard projection.
 * @returns Public GitHub repository URL.
 */
export function getRepositoryUrl(project: RepositoryDashboardListItem): string {
  return `https://github.com/${project.repo.owner}/${project.repo.name}`;
}

/**
 * Build a GitHub file URL for a path on the repository default branch.
 *
 * @param project - Repository dashboard projection.
 * @param path - Repository-relative file path.
 * @returns GitHub file URL when a path exists, otherwise repository root URL.
 */
export function getRepositoryFileUrl(
  project: RepositoryDashboardListItem,
  path: string,
): string {
  const normalizedPath = path.trim().replace(/^\/+/, "");
  if (!normalizedPath) {
    return getRepositoryUrl(project);
  }

  return `${getRepositoryUrl(project)}/blob/${project.repo.default_branch}/${normalizedPath}`;
}

/**
 * Represent one contributor row rendered in the detail tabs.
 */
export type DetailContributor = {
  name: string;
  username: string | null;
  avatarUrl: string | null;
  commits: number;
  additions: number;
  deletions: number;
  filesChanged: number;
  isBot: boolean;
  firstCommitAt: string | null;
  lastCommitAt: string | null;
};

/**
 * Represent one dependency row rendered in the detail tabs.
 */
export type DetailDependency = {
  packageName: string;
  category: string;
  version: string;
  latestVersion: string | null;
  license: string | null;
  usageCount: number;
  isDirect: boolean;
  isDevDependency: boolean;
  isPeerDependency: boolean;
  isCritical: boolean;
};

/**
 * Represent one deployment environment summary.
 */
export type DetailDeploymentEnvironment = {
  name: string;
  totalDeployments: number;
  deploymentsLast30Days: number;
  successRate: number;
  latestStatus: string;
  lastDeploymentAt: string | null;
  url: string | null;
};

/**
 * Represent one recent deployment event.
 */
export type DetailDeploymentEvent = {
  id: number;
  ref: string;
  sha: string | null;
  task: string;
  environment: string;
  createdAt: string | null;
  updatedAt: string | null;
  creator: string;
  statuses: number;
  description: string | null;
};

/**
 * Represent one pull request in the detail tab.
 */
export type DetailPullRequest = {
  number: number;
  title: string;
  state: string;
  merged: boolean;
  author: string;
  comments: number;
  reviewComments: number;
  commits: number;
  changedFiles: number;
  additions: number;
  deletions: number;
  draft: boolean;
  baseRef: string;
  headRef: string;
  createdAt: string | null;
  mergedAt: string | null;
  closedAt: string | null;
  htmlUrl: string | null;
};

/**
 * Represent one markdown or documentation file.
 */
export type DetailMarkdownFile = {
  path: string;
  size: number;
  filename: string;
  content: string;
  hasContent: boolean;
};

/**
 * Represent one file hotspot from analytics.
 */
export type DetailFileHotspot = {
  path: string;
  score: number;
};

/**
 * Represent one labeled datapoint for historical chart series.
 */
export type DetailSeriesPoint = {
  key: string;
  label: string;
  value: number;
};

/**
 * Represent one file-type aggregate from commit history.
 */
export type DetailFileTypeEntry = {
  key: string;
  label: string;
  value: number;
};

/**
 * Represent useful file-path composition hints for frontend developers.
 */
export type DetailPathInsights = {
  reactComponents: number;
  reactHooks: number;
  envFiles: number;
  testFiles: number;
  configFiles: number;
  markdownFiles: number;
};

/**
 * Represent condensed AI setup telemetry for repository detail views.
 */
export type DetailAiSetupMetrics = {
  detectedTools: string[];
  instructionFileCount: number;
  toolingDirectoryCount: number;
  totalConfigFileCount: number;
  touchedFileCount: number;
  touchedCommitCount: number;
  totalChangeCount: number;
  topChangedFiles: DetailFileHotspot[];
};

/**
 * Aggregate all normalized datasets consumed by detail tabs.
 */
export type RepositoryDetailModel = {
  contributors: DetailContributor[];
  dependencies: DetailDependency[];
  deploymentsByEnvironment: DetailDeploymentEnvironment[];
  recentDeployments: DetailDeploymentEvent[];
  recentPullRequests: DetailPullRequest[];
  markdownFiles: DetailMarkdownFile[];
  largestFiles: DetailFileHotspot[];
  hotspotFiles: DetailFileHotspot[];
  monthlyCommitSeries: DetailSeriesPoint[];
  weekdayCommitSeries: DetailSeriesPoint[];
  hourlyCommitSeries: DetailSeriesPoint[];
  fileTypeDistribution: DetailFileTypeEntry[];
  pathInsights: DetailPathInsights;
  topDirectories: DetailFileTypeEntry[];
  aiSetupMetrics: DetailAiSetupMetrics | null;
};

/**
 * Normalize repository analytics structures for detail tab rendering.
 *
 * @param project - Repository dashboard projection.
 * @returns Structured model with safe arrays for each detail tab.
 */
export function buildRepositoryDetailModel(
  project: RepositoryDashboardListItem,
): RepositoryDetailModel {
  const contributorRows = asArray(project.repo.contributors)
    .map((row) => asRecord(row))
    .filter((row): row is DataRecord => row !== null)
    .map<DetailContributor>((row) => ({
      name: stringValue(row.name, "Unknown"),
      username: nullableString(row.githubUsername),
      avatarUrl: nullableString(row.avatarUrl),
      commits: numberValue(row.commitCount),
      additions: numberValue(row.additions),
      deletions: numberValue(row.deletions),
      filesChanged: numberValue(row.filesChanged),
      isBot: Boolean(row.isBot),
      firstCommitAt: nullableDate(row.firstCommitAt),
      lastCommitAt: nullableDate(row.lastCommitAt),
    }))
    .toSorted((a, b) => b.commits - a.commits);

  const dependencyRows = asArray(project.repo.dependencies)
    .map((row) => asRecord(row))
    .filter((row): row is DataRecord => row !== null)
    .map<DetailDependency>((row) => ({
      packageName: stringValue(row.packageName, "unknown"),
      category: stringValue(row.category, "uncategorized"),
      version: stringValue(row.version, "unknown"),
      latestVersion: nullableString(row.latestVersion),
      license: nullableString(row.license),
      usageCount: numberValue(row.usageCount),
      isDirect: Boolean(row.isDirect),
      isDevDependency: Boolean(row.isDevDependency),
      isPeerDependency: Boolean(row.isPeerDependency),
      isCritical: Boolean(row.isCritical),
    }))
    .toSorted((a, b) => b.usageCount - a.usageCount);

  const deploymentRecord = asRecord(project.repo.deployments);
  const deploymentEnvironments = asArray(deploymentRecord?.environments)
    .map((row) => asRecord(row))
    .filter((row): row is DataRecord => row !== null)
    .map<DetailDeploymentEnvironment>((row) => ({
      name: stringValue(row.name, "unknown"),
      totalDeployments: numberValue(row.totalDeployments),
      deploymentsLast30Days: numberValue(row.deploymentsLast30Days),
      successRate: numberValue(row.successRate),
      latestStatus: stringValue(row.latestStatus, "unknown"),
      lastDeploymentAt: nullableDate(row.lastDeploymentAt),
      url: nullableString(row.url),
    }))
    .toSorted((a, b) => b.totalDeployments - a.totalDeployments);

  const recentDeployments = asArray(deploymentRecord?.recentDeployments)
    .map((row) => asRecord(row))
    .filter((row): row is DataRecord => row !== null)
    .map<DetailDeploymentEvent>((row) => {
      const creator = asRecord(row.creator);
      const statuses = asArray(row.statuses);
      return {
        id: numberValue(row.id),
        ref: stringValue(row.ref, "unknown"),
        sha: nullableString(row.sha),
        task: stringValue(row.task, "deploy"),
        environment: stringValue(row.environment, "unknown"),
        createdAt: nullableDate(row.createdAt),
        updatedAt: nullableDate(row.updatedAt),
        creator: stringValue(creator?.login, "unknown"),
        statuses: statuses.length,
        description: nullableString(row.description),
      };
    })
    .toSorted((a, b) => {
      const aDate = Date.parse(a.createdAt ?? "");
      const bDate = Date.parse(b.createdAt ?? "");
      return (
        (Number.isNaN(bDate) ? 0 : bDate) - (Number.isNaN(aDate) ? 0 : aDate)
      );
    });

  const pullRequestRecord = asRecord(project.repo.pullRequests);
  const recentPullRequests = asArray(pullRequestRecord?.recentPullRequests)
    .map((row) => asRecord(row))
    .filter((row): row is DataRecord => row !== null)
    .map<DetailPullRequest>((row) => {
      const author = asRecord(row.author);
      return {
        number: numberValue(row.number),
        title: stringValue(row.title, "Untitled pull request"),
        state: stringValue(row.state, "unknown"),
        merged: Boolean(row.merged),
        author: stringValue(author?.login, "unknown"),
        comments: numberValue(row.comments),
        reviewComments: numberValue(row.reviewComments),
        commits: numberValue(row.commits),
        changedFiles: numberValue(row.changedFiles),
        additions: numberValue(row.additions),
        deletions: numberValue(row.deletions),
        draft: Boolean(row.draft),
        baseRef: stringValue(row.baseRef, "unknown"),
        headRef: stringValue(row.headRef, "unknown"),
        createdAt: nullableDate(row.createdAt),
        mergedAt: nullableDate(row.mergedAt),
        closedAt: nullableDate(row.closedAt),
        htmlUrl: nullableString(row.htmlUrl),
      };
    })
    .toSorted((a, b) => {
      const aDate = Date.parse(a.createdAt ?? "");
      const bDate = Date.parse(b.createdAt ?? "");
      return (
        (Number.isNaN(bDate) ? 0 : bDate) - (Number.isNaN(aDate) ? 0 : aDate)
      );
    });

  const markdownFiles = asArray(project.repo.markdownFiles)
    .map((row) => asRecord(row))
    .filter((row): row is DataRecord => row !== null)
    .map<DetailMarkdownFile>((row) => ({
      path: stringValue(row.path),
      filename: stringValue(row.filename, "unknown.md"),
      size: numberValue(row.size),
      content: stringValue(row.content),
      hasContent: stringValue(row.content).length > 0,
    }))
    .filter((row) => row.path.length > 0)
    .toSorted((a, b) => b.size - a.size);

  const largestFiles = asArray(project.repo.largestFiles)
    .map((row) => asRecord(row))
    .filter((row): row is DataRecord => row !== null)
    .map<DetailFileHotspot>((row) => ({
      path: stringValue(row.path, "unknown"),
      score: numberValue(row.size, numberValue(row.score)),
    }))
    .toSorted((a, b) => b.score - a.score);

  const hotspotFiles = asArray(project.repo.hotspotFiles)
    .map((row) => asRecord(row))
    .filter((row): row is DataRecord => row !== null)
    .map<DetailFileHotspot>((row) => ({
      path: stringValue(row.path, "unknown"),
      score: numberValue(row.changeCount, numberValue(row.score)),
    }))
    .toSorted((a, b) => b.score - a.score);

  const aiSetupRecord = asRecord(project.repo.aiSetupMetrics);
  const aiSetupChurn = asRecord(aiSetupRecord?.churn);
  const aiSetupMetrics: DetailAiSetupMetrics | null = aiSetupRecord
    ? {
        detectedTools: asArray(aiSetupRecord.detectedTools).filter(
          (item): item is string => typeof item === "string" && item.length > 0,
        ),
        instructionFileCount: numberValue(aiSetupRecord.instructionFileCount),
        toolingDirectoryCount: numberValue(aiSetupRecord.toolingDirectoryCount),
        totalConfigFileCount: numberValue(aiSetupRecord.totalConfigFileCount),
        touchedFileCount: numberValue(aiSetupChurn?.touchedFileCount),
        touchedCommitCount: numberValue(aiSetupChurn?.touchedCommitCount),
        totalChangeCount: numberValue(aiSetupChurn?.totalChangeCount),
        topChangedFiles: asArray(aiSetupChurn?.topChangedFiles)
          .map((item) => asRecord(item))
          .filter((item): item is DataRecord => item !== null)
          .map((item) => ({
            path: stringValue(item.path, "unknown"),
            score: numberValue(item.changeCount),
          }))
          .toSorted((a, b) => b.score - a.score),
      }
    : null;

  const commits = asArray(project.repo.commits)
    .map((row) => asRecord(row))
    .filter((row): row is DataRecord => row !== null);
  const gitAnalysisRecord = asRecord(project.repo.gitAnalysis);
  const monthlyCommitCounter = new Map<string, number>();
  const fileTypeCounter = new Map<string, number>();
  const directoryCounter = new Map<string, number>();
  const weekdayCounter = new Map<string, number>([
    ["Sun", 0],
    ["Mon", 0],
    ["Tue", 0],
    ["Wed", 0],
    ["Thu", 0],
    ["Fri", 0],
    ["Sat", 0],
  ]);
  const hourlyCounter = new Map<string, number>(
    Array.from({ length: 24 }, (_, index) => [
      index.toString().padStart(2, "0"),
      0,
    ]),
  );
  const pathInsights: DetailPathInsights = {
    reactComponents: 0,
    reactHooks: 0,
    envFiles: 0,
    testFiles: 0,
    configFiles: 0,
    markdownFiles: markdownFiles.length,
  };
  const seenComponentPaths = new Set<string>();
  const seenHookPaths = new Set<string>();
  const seenEnvPaths = new Set<string>();
  const seenTestPaths = new Set<string>();
  const seenConfigPaths = new Set<string>();

  for (const commit of commits) {
    const authoredTimestamp = parseTimestamp(commit.authored_date);
    const committedTimestamp = parseTimestamp(commit.committed_date);
    const createdTimestamp = parseTimestamp(commit.created_at);
    const bestTimestamp =
      authoredTimestamp ?? committedTimestamp ?? createdTimestamp;
    if (bestTimestamp !== null) {
      const date = new Date(bestTimestamp);
      pushCount(monthlyCommitCounter, monthKeyFromDate(date));
      const weekdayKey = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"][
        date.getUTCDay()
      ];
      pushCount(weekdayCounter, weekdayKey);
      pushCount(hourlyCounter, date.getUTCHours().toString().padStart(2, "0"));
    }

    for (const typeValue of asArray(commit.file_types)) {
      if (typeof typeValue !== "string") {
        continue;
      }
      const cleaned = typeValue.trim();
      if (!cleaned) {
        continue;
      }
      pushCount(fileTypeCounter, cleaned.toLowerCase());
    }

    for (const pathValue of asArray(commit.changed_paths)) {
      if (typeof pathValue !== "string") {
        continue;
      }
      const normalizedPath = pathValue.trim();
      if (!normalizedPath) {
        continue;
      }

      const segments = normalizedPath.split("/");
      const topDirectory =
        segments.length > 1
          ? `${segments[0]}/${segments[1]}`
          : (segments[0] ?? "root");
      pushCount(directoryCounter, topDirectory);

      const lowerPath = normalizedPath.toLowerCase();
      if (
        /\.(tsx|jsx)$/.test(lowerPath) &&
        (lowerPath.includes("/components/") || lowerPath.includes("component"))
      ) {
        seenComponentPaths.add(lowerPath);
      }
      if (lowerPath.includes("use-") || lowerPath.includes("/hooks/")) {
        seenHookPaths.add(lowerPath);
      }
      if (
        lowerPath.includes(".env") ||
        lowerPath.endsWith("env.example") ||
        lowerPath.endsWith(".dev.vars")
      ) {
        seenEnvPaths.add(lowerPath);
      }
      if (
        lowerPath.includes(".test.") ||
        lowerPath.includes(".spec.") ||
        lowerPath.includes("/__tests__/") ||
        lowerPath.includes("/tests/")
      ) {
        seenTestPaths.add(lowerPath);
      }
      if (
        lowerPath.endsWith("package.json") ||
        lowerPath.includes("tsconfig") ||
        lowerPath.includes("eslint") ||
        lowerPath.includes("prettier") ||
        lowerPath.endsWith("next.config.js") ||
        lowerPath.endsWith("next.config.ts")
      ) {
        seenConfigPaths.add(lowerPath);
      }
    }
  }

  pathInsights.reactComponents = seenComponentPaths.size;
  pathInsights.reactHooks = seenHookPaths.size;
  pathInsights.envFiles = seenEnvPaths.size;
  pathInsights.testFiles = seenTestPaths.size;
  pathInsights.configFiles = seenConfigPaths.size;

  const gitHistoryRecord = asRecord(gitAnalysisRecord?.historical);
  const monthlyFromGitAnalysis = asArray(gitHistoryRecord?.commitsByMonth)
    .map((entry) => asRecord(entry))
    .filter((entry): entry is DataRecord => entry !== null)
    .map((entry) => {
      const key = stringValue(entry.month);
      const total = numberValue(entry.count, numberValue(entry.total));
      return { key, total };
    })
    .filter((entry) => entry.key.length > 0 && entry.total > 0);
  if (monthlyFromGitAnalysis.length > 0) {
    monthlyCommitCounter.clear();
    for (const point of monthlyFromGitAnalysis) {
      pushCount(monthlyCommitCounter, point.key, point.total);
    }
  }

  const weekdayFromGitAnalysis = asRecord(gitHistoryRecord?.commitsByDayOfWeek);
  if (weekdayFromGitAnalysis) {
    for (const day of ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]) {
      const apiKeys = {
        Sun: "sunday",
        Mon: "monday",
        Tue: "tuesday",
        Wed: "wednesday",
        Thu: "thursday",
        Fri: "friday",
        Sat: "saturday",
      } as const;
      const key = apiKeys[day as keyof typeof apiKeys];
      weekdayCounter.set(day, numberValue(weekdayFromGitAnalysis[key], 0));
    }
  }

  const hourlyFromGitAnalysis = asRecord(gitHistoryRecord?.commitsByHour);
  if (hourlyFromGitAnalysis) {
    for (let hour = 0; hour < 24; hour += 1) {
      const padded = hour.toString().padStart(2, "0");
      const directValue = numberValue(hourlyFromGitAnalysis[padded]);
      const fallbackValue = numberValue(hourlyFromGitAnalysis[String(hour)]);
      hourlyCounter.set(padded, directValue || fallbackValue);
    }
  }

  const monthlyCommitSeries: DetailSeriesPoint[] = [
    ...monthlyCommitCounter.entries(),
  ]
    .toSorted((a, b) => a[0].localeCompare(b[0]))
    .slice(-12)
    .map(([key, value]) => ({
      key,
      label: monthLabelFromKey(key),
      value,
    }));
  const weekdayCommitSeries: DetailSeriesPoint[] = [
    ...weekdayCounter.entries(),
  ].map(([label, value]) => ({
    key: normalizeLabelKey(label),
    label,
    value,
  }));
  const hourlyCommitSeries: DetailSeriesPoint[] = [
    ...hourlyCounter.entries(),
  ].map(([label, value]) => ({
    key: label,
    label,
    value,
  }));
  const fileTypeDistribution = topEntriesFromCounter(fileTypeCounter, 10);
  const topDirectories = topEntriesFromCounter(directoryCounter, 8);

  return {
    contributors: contributorRows,
    dependencies: dependencyRows,
    deploymentsByEnvironment: deploymentEnvironments,
    recentDeployments,
    recentPullRequests,
    markdownFiles,
    largestFiles,
    hotspotFiles,
    monthlyCommitSeries,
    weekdayCommitSeries,
    hourlyCommitSeries,
    fileTypeDistribution,
    pathInsights,
    topDirectories,
    aiSetupMetrics,
  };
}

function nullableString(value: unknown): string | null {
  const normalized = stringValue(value);
  return normalized.length > 0 ? normalized : null;
}

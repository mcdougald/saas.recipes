import {
  ArrowUpRight,
  Flame,
  GitBranch,
  GitCommitHorizontal,
  GitMerge,
  Globe,
  HardDrive,
  Package,
  Rocket,
  Scale,
  ShieldCheck,
  Target,
  Users,
} from "lucide-react";
import Link from "next/link";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import {
  type RepositoryDashboardListItem,
  type RepositoryStatus,
} from "@/features/repos/types";
import { cn } from "@/lib/utils";
import {
  RepositoryHistoryChart,
  type RepositoryHistoryPoint,
} from "./repository-history-chart";
import { DeltaSplit, TrendDeltaBadge } from "./trend-visuals";

const numberFormatter = new Intl.NumberFormat("en-US", {
  maximumFractionDigits: 0,
});

const compactNumberFormatter = new Intl.NumberFormat("en-US", {
  notation: "compact",
  maximumFractionDigits: 1,
});

const relativeTimeFormatter = new Intl.RelativeTimeFormat("en-US", {
  numeric: "auto",
});

const statusStyles: Record<RepositoryStatus, string> = {
  active: "",
  paused: "",
  archived:
    "border-slate-500/40 bg-slate-500/10 text-slate-700 dark:text-slate-300",
};

/** Format integer counts for compact dashboard display. */
function formatNumber(value: number): string {
  return numberFormatter.format(value);
}

/** Format large counts using compact notation. */
function formatCompactNumber(value: number): string {
  return compactNumberFormatter.format(value);
}

/** Round a numeric value into a whole-number percentage string. */
function formatPercent(value: number): string {
  return `${Math.round(value)}%`;
}

/** Format ratio values to a compact two-decimal multiplier. */
function formatMultiplier(value: number): string {
  return `${value.toFixed(2)}x`;
}

/** Calculate merged PR percentage from aggregate counts. */
function getMergeRate(project: RepositoryDashboardListItem): number {
  if (project.repo.totalPullRequests === 0) {
    return 0;
  }

  return Math.round(
    (project.repo.mergedPullRequests / project.repo.totalPullRequests) * 100,
  );
}

/** Calculate issue closure percentage from total and closed issues. */
function getIssueClosureRate(project: RepositoryDashboardListItem): number {
  if (project.repo.totalIssues === 0) {
    return 0;
  }

  return Math.round(
    (project.repo.closedIssues / project.repo.totalIssues) * 100,
  );
}

/** Compute full days since an ISO timestamp. */
function getDaysSince(value: string): number {
  const timestamp = Date.parse(value);
  if (Number.isNaN(timestamp)) {
    return 0;
  }

  return Math.max(
    0,
    Math.floor((Date.now() - timestamp) / (24 * 60 * 60 * 1000)),
  );
}

/** Render relative time from a timestamp to now. */
function formatTimeSince(value: string | null | undefined): string {
  if (!value) {
    return "unknown";
  }

  const parsed = Date.parse(value);
  if (Number.isNaN(parsed)) {
    return "unknown";
  }

  const deltaMs = Date.now() - parsed;
  const absMs = Math.abs(deltaMs);
  const minute = 60 * 1000;
  const hour = 60 * minute;
  const day = 24 * hour;
  const week = 7 * day;
  const month = 30 * day;
  const year = 365 * day;
  const units: Array<[Intl.RelativeTimeFormatUnit, number]> = [
    ["year", year],
    ["month", month],
    ["week", week],
    ["day", day],
    ["hour", hour],
    ["minute", minute],
  ];

  for (const [unit, unitMs] of units) {
    if (absMs >= unitMs || unit === "minute") {
      const amount = Math.max(1, Math.round(absMs / unitMs));
      const signedAmount = deltaMs >= 0 ? -amount : amount;
      return relativeTimeFormatter.format(signedAmount, unit);
    }
  }

  return "just now";
}

/** Convert repository size in KB into a readable KB/MB/GB label. */
function formatRepoSize(sizeKb: number): string {
  const absSize = Math.max(0, sizeKb);
  if (absSize < 1024) {
    return `${formatCompactNumber(absSize)} KB`;
  }
  if (absSize < 1024 * 1024) {
    return `${(absSize / 1024).toFixed(1)} MB`;
  }
  return `${(absSize / (1024 * 1024)).toFixed(2)} GB`;
}

function getIsoMonth(value: string): string | null {
  const parsedDate = Date.parse(value);
  if (Number.isNaN(parsedDate)) {
    return null;
  }

  return new Date(parsedDate).toISOString().slice(0, 7);
}

function formatMonthLabel(value: string): string {
  const [year, month] = value.split("-");
  const parsedYear = Number.parseInt(year ?? "", 10);
  const parsedMonth = Number.parseInt(month ?? "", 10);
  if (
    Number.isNaN(parsedYear) ||
    Number.isNaN(parsedMonth) ||
    parsedMonth < 1 ||
    parsedMonth > 12
  ) {
    return value;
  }

  return new Date(parsedYear, parsedMonth - 1, 1).toLocaleDateString("en-US", {
    month: "short",
  });
}

/** Build the canonical GitHub URL for a repository. */
function getRepoUrl(project: RepositoryDashboardListItem): string {
  return `https://github.com/${project.repo.owner}/${project.repo.name}`;
}

/** Resolve a public GitHub avatar URL from owner login. */
function getOwnerAvatarUrl(project: RepositoryDashboardListItem): string {
  return `https://github.com/${project.repo.owner}.png?size=80`;
}

/** Build a two-character fallback avatar label from project name. */
function getInitials(name: string): string {
  return name
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part.charAt(0).toUpperCase())
    .join("");
}

/** Create a practical positioning sentence for teams evaluating this repo. */
function getRecipePositioning(project: RepositoryDashboardListItem): string {
  if (
    project.trends.commitsLast30Days >= 25 &&
    project.metadata.stars >= 3000
  ) {
    return "Battle-tested and actively shipping. Great for production-ready pattern borrowing.";
  }

  if (project.metadata.stars >= 1500 || project.repo.contributor_count >= 40) {
    return "Strong social proof with enough maintainer depth to copy implementation ideas safely.";
  }

  return "Focused implementation recipe for teams validating architecture, tooling, and delivery flow.";
}

type DataRecord = Record<string, unknown>;
type DependencyBreakdown = {
  total: number;
  direct: number;
  dev: number;
  peer: number;
  critical: number;
  withKnownLicense: number;
};
type DocumentationFootprint = {
  fileCount: number;
  totalSizeKb: number;
};

function asRecord(value: unknown): DataRecord | null {
  if (typeof value !== "object" || value === null) {
    return null;
  }

  return value as DataRecord;
}

function asArray(value: unknown): unknown[] {
  return Array.isArray(value) ? value : [];
}

function asString(value: unknown): string | null {
  return typeof value === "string" && value.length > 0 ? value : null;
}

function asNumber(value: unknown): number | null {
  return typeof value === "number" && Number.isFinite(value) ? value : null;
}

function normalizeLabel(value: string): string {
  return value.replaceAll(/[_-]+/g, " ").replaceAll(/\s+/g, " ").trim();
}

function toTitleCase(value: string): string {
  return normalizeLabel(value)
    .split(" ")
    .map((word) =>
      word.length > 0 ? `${word[0]?.toUpperCase()}${word.slice(1)}` : "",
    )
    .join(" ");
}

function getDependencyBreakdown(project: RepositoryDashboardListItem) {
  return asArray(project.repo.dependencies)
    .map((entry) => asRecord(entry))
    .filter((entry): entry is DataRecord => entry !== null)
    .reduce<DependencyBreakdown>(
      (summary, dependency) => {
        summary.total += 1;

        if (dependency.isDirect === true) {
          summary.direct += 1;
        }
        if (dependency.isDevDependency === true) {
          summary.dev += 1;
        }
        if (dependency.isPeerDependency === true) {
          summary.peer += 1;
        }
        if (dependency.isCritical === true) {
          summary.critical += 1;
        }
        if (
          typeof dependency.license === "string" &&
          dependency.license.length > 0
        ) {
          summary.withKnownLicense += 1;
        }

        return summary;
      },
      {
        total: 0,
        direct: 0,
        dev: 0,
        peer: 0,
        critical: 0,
        withKnownLicense: 0,
      },
    );
}

function getLicensePosture(license: string | null): string {
  if (!license) {
    return "unknown terms";
  }

  const normalized = license.toUpperCase();
  if (
    normalized.includes("MIT") ||
    normalized.includes("APACHE") ||
    normalized.includes("BSD") ||
    normalized.includes("ISC")
  ) {
    return "permissive";
  }
  if (normalized.includes("GPL") || normalized.includes("AGPL")) {
    return "strong copyleft";
  }
  if (normalized.includes("LGPL") || normalized.includes("MPL")) {
    return "weak copyleft";
  }
  if (normalized.includes("UNLICENSED") || normalized.includes("PROPRIETARY")) {
    return "restricted use";
  }

  return "custom license";
}

function getBranchCoverage(project: RepositoryDashboardListItem): {
  defaultBranchPrs: number;
  totalRecentPrs: number;
  defaultBranchDeploys: number;
} {
  const defaultBranch = project.repo.default_branch;
  const pullRequestRecord = asRecord(project.repo.pullRequests);
  const recentPullRequests = asArray(pullRequestRecord?.recentPullRequests)
    .map((entry) => asRecord(entry))
    .filter((entry): entry is DataRecord => entry !== null);
  const defaultBranchPrs = recentPullRequests.filter(
    (entry) => asString(entry.baseRef) === defaultBranch,
  ).length;

  const recentDeployments = asArray(project.repo.deployments?.recentDeployments)
    .map((entry) => asRecord(entry))
    .filter((entry): entry is DataRecord => entry !== null);
  const defaultBranchDeploys = recentDeployments.filter((entry) => {
    const ref = asString(entry.ref);
    return ref === defaultBranch || ref === `refs/heads/${defaultBranch}`;
  }).length;

  return {
    defaultBranchPrs,
    totalRecentPrs: recentPullRequests.length,
    defaultBranchDeploys,
  };
}

function getPackageScriptCount(project: RepositoryDashboardListItem): number {
  const scripts = asRecord(project.repo.packageJson?.scripts);
  return scripts ? Object.keys(scripts).length : 0;
}

function getEngineCount(project: RepositoryDashboardListItem): number {
  const engines = asRecord(project.repo.packageJson?.engines);
  return engines ? Object.keys(engines).length : 0;
}

function getDocumentationFootprint(project: RepositoryDashboardListItem): {
  fileCount: number;
  totalSizeKb: number;
} {
  return asArray(project.repo.markdownFiles)
    .map((entry) => asRecord(entry))
    .filter((entry): entry is DataRecord => entry !== null)
    .reduce<DocumentationFootprint>(
      (summary, entry) => {
        summary.fileCount += 1;
        summary.totalSizeKb += asNumber(entry.size) ?? 0;
        return summary;
      },
      { fileCount: 0, totalSizeKb: 0 },
    );
}

function getAverageFilesPerCommit(
  project: RepositoryDashboardListItem,
): number {
  const commitsLast30Days = Math.max(1, project.trends.commitsLast30Days);
  return project.repo.totalFilesTouched / commitsLast30Days;
}

function getMomentumLabel(project: RepositoryDashboardListItem): string {
  const commits7dRunRate = project.trends.commitsLast7Days * (30 / 7);
  const baseline = Math.max(1, project.trends.commitsLast30Days);
  const ratio = commits7dRunRate / baseline;

  if (ratio >= 1.15) {
    return "accelerating";
  }
  if (ratio <= 0.75) {
    return "cooling";
  }
  return "steady";
}

function getCommitDate(record: DataRecord): string | null {
  for (const key of [
    "authored_date",
    "committed_date",
    "created_at",
  ] as const) {
    const raw = record[key];
    if (typeof raw === "string" && raw.length > 0) {
      return raw;
    }
  }

  return null;
}

function getLastCommitAt(project: RepositoryDashboardListItem): string {
  const lastCommitDate = asArray(project.repo.commits)
    .map((commit) => asRecord(commit))
    .filter((commit): commit is DataRecord => commit !== null)
    .map((commit) => getCommitDate(commit))
    .filter((value): value is string => value !== null)
    .map((value) => Date.parse(value))
    .filter((value) => !Number.isNaN(value))
    .toSorted((a, b) => b - a)[0];

  return lastCommitDate
    ? new Date(lastCommitDate).toISOString()
    : project.repo.pushed_at;
}

function getLastDeploymentAt(
  project: RepositoryDashboardListItem,
): string | null {
  const deploymentDate = project.repo.deployments?.lastDeploymentAt;
  if (typeof deploymentDate === "string" && deploymentDate.length > 0) {
    return deploymentDate;
  }

  return null;
}

function buildHistory(
  project: RepositoryDashboardListItem,
): RepositoryHistoryPoint[] {
  const pullRequests = asRecord(project.repo.pullRequests);
  const prHistory = asArray(pullRequests?.activityByMonth)
    .map((row) => asRecord(row))
    .filter((row): row is DataRecord => row !== null)
    .map((row) => ({
      month: typeof row.month === "string" ? row.month : "",
      openedPrs:
        typeof row.openedCount === "number" && Number.isFinite(row.openedCount)
          ? row.openedCount
          : 0,
      mergedPrs:
        typeof row.mergedCount === "number" && Number.isFinite(row.mergedCount)
          ? row.mergedCount
          : 0,
    }))
    .filter((row) => row.month.length > 0)
    .toSorted((a, b) => a.month.localeCompare(b.month));

  if (prHistory.length === 0) {
    return [
      {
        label: "7d",
        openedPrs: Math.max(0, Math.round(project.repo.openPullRequests * 0.5)),
        mergedPrs: Math.max(
          0,
          Math.round(project.repo.mergedPullRequests * 0.08),
        ),
        commits: project.trends.commitsLast7Days,
        deployments: Math.max(
          0,
          Math.round((project.trends.deploymentsLast30Days ?? 0) / 4),
        ),
      },
      {
        label: "30d",
        openedPrs: project.repo.openPullRequests,
        mergedPrs: Math.max(
          0,
          Math.round(project.repo.mergedPullRequests * 0.25),
        ),
        commits: project.trends.commitsLast30Days,
        deployments: project.trends.deploymentsLast30Days ?? 0,
      },
      {
        label: "90d",
        openedPrs: Math.max(project.repo.openPullRequests, 1) * 2,
        mergedPrs: Math.max(
          0,
          Math.round(project.repo.mergedPullRequests * 0.5),
        ),
        commits: Math.max(project.trends.commitsLast30Days, 1) * 2,
        deployments: Math.max(
          0,
          (project.trends.deploymentsLast30Days ?? 0) * 2,
        ),
      },
    ];
  }

  const commitCountsByMonth = new Map<string, number>();
  asArray(project.repo.commits)
    .map((commit) => asRecord(commit))
    .filter((commit): commit is DataRecord => commit !== null)
    .forEach((commit) => {
      const commitDate = getCommitDate(commit);
      if (!commitDate) {
        return;
      }
      const month = getIsoMonth(commitDate);
      if (!month) {
        return;
      }
      commitCountsByMonth.set(month, (commitCountsByMonth.get(month) ?? 0) + 1);
    });

  const deploymentCountsByMonth = new Map<string, number>();
  asArray(project.repo.deployments?.recentDeployments)
    .map((deployment) => asRecord(deployment))
    .filter((deployment): deployment is DataRecord => deployment !== null)
    .forEach((deployment) => {
      const createdAt =
        typeof deployment.createdAt === "string" ? deployment.createdAt : null;
      if (!createdAt) {
        return;
      }
      const month = getIsoMonth(createdAt);
      if (!month) {
        return;
      }
      deploymentCountsByMonth.set(
        month,
        (deploymentCountsByMonth.get(month) ?? 0) + 1,
      );
    });

  return prHistory.slice(-6).map((row) => ({
    label: formatMonthLabel(row.month),
    openedPrs: row.openedPrs,
    mergedPrs: row.mergedPrs,
    commits: commitCountsByMonth.get(row.month) ?? 0,
    deployments: deploymentCountsByMonth.get(row.month) ?? 0,
  }));
}

function historySum(
  history: RepositoryHistoryPoint[],
  key: "openedPrs" | "mergedPrs" | "commits" | "deployments",
): number {
  return history.reduce((sum, point) => sum + point[key], 0);
}

type RepositoryListItemProps = {
  /** Repository-backed dashboard item with repo health metrics. */
  project: RepositoryDashboardListItem;
};

/**
 * Render a compact, data-dense repository card.
 *
 * @param project - Repository dashboard item to summarize.
 * @returns Compact repository summary card with hoverable trends.
 */
export function RepositoryListItem({ project }: RepositoryListItemProps) {
  const mergeRate = getMergeRate(project);
  const issueClosureRate = getIssueClosureRate(project);
  const deploymentSuccessRate = project.repo.deployments?.successRate ?? 0;
  const deploymentCount = project.repo.deployments?.totalCount ?? 0;
  const deploymentsLast30Days = project.trends.deploymentsLast30Days ?? 0;
  const releasesLast90Days = project.trends.releasesLast90Days ?? 0;
  const visibility = project.metadata.visibility ?? "public";
  const packageManager =
    project.repo.packageManager ?? project.repo.packageJson?.packageManager;
  const normalizedPackageManager =
    packageManager?.split("@")[0] || packageManager || "Not detected";
  const isArchived = project.status === "archived";
  const description =
    project.description?.trim() ||
    "No public repository description is available yet.";
  const commitsLast7Days = project.trends.commitsLast7Days;
  const commitsLast30Days = project.trends.commitsLast30Days;
  const topCategories = project.trends.topCategories;
  const topFileTypes = project.trends.topFileTypes;
  const recipePositioning = getRecipePositioning(project);
  const dependencyBreakdown = getDependencyBreakdown(project);
  const licensePosture = getLicensePosture(project.license);
  const branchCoverage = getBranchCoverage(project);
  const packageScriptCount = getPackageScriptCount(project);
  const engineCount = getEngineCount(project);
  const docsFootprint = getDocumentationFootprint(project);
  const repoSizeLabel = formatRepoSize(project.metadata.size);
  const averageFilesPerCommit = getAverageFilesPerCommit(project);
  const momentumLabel = getMomentumLabel(project);
  const commitMomentumRatio = project.trends.commitMomentumRatio;
  const mergeEfficiency30Days = project.trends.mergeEfficiency30Days;
  const deploymentFrequencyPerWeek = project.trends.deploymentFrequencyPerWeek;
  const releaseFrequencyPerMonth = project.trends.releaseFrequencyPerMonth;
  const momentumDeltaPercent = Math.round((commitMomentumRatio - 1) * 100);
  const churnPerCommit =
    commitsLast30Days > 0
      ? Math.round(project.trends.codeChurnLast30Days / commitsLast30Days)
      : 0;
  const lastCommitAt = getLastCommitAt(project);
  const lastCommitDaysAgo = getDaysSince(lastCommitAt);
  const lastDeploymentAt = getLastDeploymentAt(project);
  const history = buildHistory(project);
  const historyOpenedPrs = historySum(history, "openedPrs");
  const historyMergedPrs = historySum(history, "mergedPrs");
  const historyMergeEfficiency =
    historyOpenedPrs > 0
      ? Math.round((historyMergedPrs / historyOpenedPrs) * 100)
      : 0;
  const primaryLanguage = project.metadata.language || "Unknown";
  const languageSignals = [primaryLanguage, ...topFileTypes.map(toTitleCase)]
    .filter(
      (value, index, list) => value.length > 0 && list.indexOf(value) === index,
    )
    .slice(0, 4);
  const recentPushAt = project.repo.pushed_at;
  const aiSetupMetrics = project.repo.aiSetupMetrics;
  const detectedToolsCount = aiSetupMetrics?.detectedTools.length ?? 0;
  const instructionFileCount = aiSetupMetrics?.instructionFileCount ?? 0;
  const toolingDirectoryCount = aiSetupMetrics?.toolingDirectoryCount ?? 0;
  const aiTouchedFiles = aiSetupMetrics?.churn?.touchedFileCount ?? 0;
  const dependencyGroupCount = project.repo.dependencyGroups?.length ?? 0;
  const dependencyChangeCount = project.repo.dependencyChanges?.length ?? 0;
  const hotspotFileCount = project.repo.hotspotFiles?.length ?? 0;
  const largestFileCount = project.repo.largestFiles?.length ?? 0;
  const watchersCount = project.metadata.watchers;
  const activityToneClassName =
    lastCommitDaysAgo <= 7
      ? "bg-emerald-500/10 text-emerald-700 dark:text-emerald-300"
      : lastCommitDaysAgo <= 30
        ? "bg-amber-500/10 text-amber-700 dark:text-amber-300"
        : "bg-rose-500/10 text-rose-700 dark:text-rose-300";

  return (
    <article className="group relative overflow-hidden rounded-md border bg-card p-2.5 shadow-xs transition-all hover:-translate-y-0.5 hover:shadow-md [content-visibility:auto]">
      <div className="pointer-events-none absolute inset-x-0 top-0 h-12 bg-linear-to-r from-primary/12 via-primary/5 to-transparent opacity-80" />

      <div className="relative flex flex-col gap-2.5">
        <div className="grid min-w-0 gap-2 lg:grid-cols-[minmax(0,1fr)_auto]">
          <div className="flex min-w-0 items-start gap-2">
            <Avatar className="mt-0.5 size-8 border">
              <AvatarImage
                src={getOwnerAvatarUrl(project)}
                alt={project.name}
              />
              <AvatarFallback>{getInitials(project.name)}</AvatarFallback>
            </Avatar>

            <div className="min-w-0 space-y-1.5">
              <div className="flex flex-wrap items-center gap-1.5">
                <h3 className="min-w-0 text-sm font-semibold tracking-tight">
                  {project.repo.owner}/{project.repo.name}
                </h3>
                <Badge
                  variant="outline"
                  className="h-5 px-1.5 text-[10px] capitalize"
                >
                  {project.sourceType}
                </Badge>
                {isArchived ? (
                  <Badge
                    variant="outline"
                    className={cn(
                      "h-5 px-1.5 text-[10px] capitalize",
                      statusStyles[project.status],
                    )}
                  >
                    archived
                  </Badge>
                ) : null}
                <Badge
                  variant="secondary"
                  className="h-5 px-1.5 text-[10px] capitalize"
                >
                  <ShieldCheck className="mr-1 size-3" />
                  {visibility}
                </Badge>
                <Badge
                  variant="secondary"
                  className={cn(
                    "h-5 px-1.5 text-[10px]",
                    activityToneClassName,
                  )}
                >
                  <GitCommitHorizontal className="mr-1 size-3" />
                  {lastCommitDaysAgo === 0
                    ? "commit today"
                    : `commit ${lastCommitDaysAgo}d ago`}
                </Badge>
                <TrendDeltaBadge
                  label="Momentum"
                  value={momentumDeltaPercent}
                />
                <TrendDeltaBadge
                  label="Merge"
                  value={mergeEfficiency30Days - historyMergeEfficiency}
                />
              </div>
              <p className="text-muted-foreground line-clamp-2 text-xs leading-5">
                {description}
              </p>
              <p className="text-muted-foreground line-clamp-1 inline-flex items-center gap-1 text-[11px]">
                <Target className="size-3.5 text-primary" />
                {recipePositioning}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-1.5 lg:w-[210px]">
            <div className="rounded-sm border bg-background/80 px-2 py-1.5">
              <p className="text-muted-foreground text-[10px]">Stars</p>
              <p className="text-sm font-semibold">
                {formatCompactNumber(project.metadata.stars)}
              </p>
            </div>
            <div className="rounded-sm border bg-background/80 px-2 py-1.5">
              <p className="text-muted-foreground text-[10px]">Forks</p>
              <p className="text-sm font-semibold">
                {formatCompactNumber(project.metadata.forks)}
              </p>
            </div>
            <div className="col-span-2 rounded-sm border bg-background/80 px-2 py-1.5">
              <p className="text-muted-foreground text-[10px]">Watchers</p>
              <p className="text-sm font-semibold">
                {formatCompactNumber(watchersCount)}
              </p>
            </div>
          </div>
        </div>

        <div className="text-muted-foreground flex flex-wrap items-center gap-1.5 text-[11px]">
          <Badge variant="outline" className="h-5 px-1.5 text-[10px]">
            <Package className="mr-1 size-3" />
            {normalizedPackageManager}
          </Badge>
          <Badge variant="outline" className="h-5 px-1.5 text-[10px]">
            <Flame className="mr-1 size-3" />
            {momentumLabel} ({formatMultiplier(commitMomentumRatio)})
          </Badge>
          <span className="inline-flex items-center gap-1 rounded-md border bg-muted/20 px-1.5 py-1">
            Created {formatTimeSince(project.repo.created_at)}
          </span>
          <span className="inline-flex items-center gap-1 rounded-md border bg-muted/20 px-1.5 py-1">
            <GitCommitHorizontal className="size-3.5" />
            Last commit {formatTimeSince(lastCommitAt)}
          </span>
          <span className="inline-flex items-center gap-1 rounded-md border bg-muted/20 px-1.5 py-1">
            <Rocket className="size-3.5" />
            Last deploy {formatTimeSince(lastDeploymentAt)}
          </span>
          <span className="inline-flex items-center gap-1 rounded-md border bg-muted/20 px-1.5 py-1">
            Weekly deploy freq{" "}
            {deploymentFrequencyPerWeek === null
              ? "N/A"
              : deploymentFrequencyPerWeek.toFixed(1)}
          </span>
          <span className="inline-flex items-center gap-1 rounded-md border bg-muted/20 px-1.5 py-1">
            Synced {formatTimeSince(project.metadata.lastSyncedAt)}
          </span>
        </div>

        <div className="grid items-start gap-2 xl:grid-cols-[minmax(0,1.35fr)_minmax(0,1fr)]">
          <section className="rounded-md border bg-muted/20 p-2">
            <div className="mb-1.5 flex items-center justify-between gap-2">
              <p className="text-muted-foreground text-[11px] font-medium">
                Signals and trends
              </p>
              <Badge variant="secondary" className="h-5 px-1.5 text-[10px]">
                Momentum: {momentumLabel} (
                {formatMultiplier(commitMomentumRatio)})
              </Badge>
            </div>
            <RepositoryHistoryChart history={history} />

            <div className="mt-1.5 grid gap-1.5 sm:grid-cols-2 lg:grid-cols-4">
              <div className="rounded-sm border bg-background/80 px-2 py-1.5">
                <p className="text-muted-foreground inline-flex items-center gap-1 text-[10px]">
                  <Users className="size-3.5" />
                  Contributors
                </p>
                <p className="text-sm font-semibold">
                  {formatNumber(project.repo.contributor_count)}
                </p>
              </div>
              <div className="rounded-sm border bg-background/80 px-2 py-1.5">
                <p className="text-muted-foreground inline-flex items-center gap-1 text-[10px]">
                  <GitMerge className="size-3.5" />
                  PR throughput
                </p>
                <p className="text-sm font-semibold">
                  {mergeEfficiency30Days}% merged
                </p>
                <p className="text-muted-foreground text-[10px]">
                  {formatNumber(historyMergedPrs)} merged /{" "}
                  {formatNumber(historyOpenedPrs)} opened
                </p>
              </div>
              <div className="rounded-sm border bg-background/80 px-2 py-1.5">
                <p className="text-muted-foreground inline-flex items-center gap-1 text-[10px]">
                  <Globe className="size-3.5" />
                  Deploy health
                </p>
                <p className="text-sm font-semibold">
                  {deploymentCount > 0
                    ? `${formatPercent(deploymentSuccessRate)}`
                    : "N/A"}
                </p>
                <p className="text-muted-foreground text-[10px]">
                  {formatNumber(deploymentsLast30Days)} deploys (30d)
                </p>
              </div>
              <div className="rounded-sm border bg-background/80 px-2 py-1.5">
                <p className="text-muted-foreground inline-flex items-center gap-1 text-[10px]">
                  <Scale className="size-3.5" />
                  Issue closure
                </p>
                <p className="text-sm font-semibold">{issueClosureRate}%</p>
                <p className="text-muted-foreground text-[10px]">
                  {formatNumber(project.repo.closedIssues)} closed /{" "}
                  {formatNumber(project.repo.totalIssues)} total
                </p>
              </div>
            </div>

            <div className="mt-1.5 grid gap-1.5 sm:grid-cols-2">
              <div className="rounded-sm border bg-background/80 px-2 py-1.5">
                <div className="mb-1 flex items-center justify-between gap-2 text-[11px]">
                  <p className="text-muted-foreground">Merge confidence</p>
                  <span className="font-medium">{mergeRate}%</span>
                </div>
                <Progress value={mergeRate} className="h-1.5" />
                <p className="text-muted-foreground mt-1 text-[10px]">
                  {formatNumber(commitsLast7Days)} commits (7d) •{" "}
                  {formatNumber(commitsLast30Days)} commits (30d)
                </p>
              </div>
              <div className="rounded-sm border bg-background/80 px-2 py-1.5">
                <DeltaSplit
                  additions={project.trends.additionsLast30Days}
                  deletions={project.trends.deletionsLast30Days}
                />
                <p className="text-muted-foreground mt-1 text-[10px]">
                  Churn per commit: {formatNumber(churnPerCommit)} lines
                </p>
              </div>
            </div>
          </section>

          <section className="rounded-md border bg-background/80 p-2">
            <div className="mb-1.5 flex items-center justify-between gap-2">
              <p className="text-muted-foreground text-[11px] font-medium">
                Repository architecture
              </p>
              <p className="text-muted-foreground text-[10px]">
                Stack, governance, branch flow, and footprint
              </p>
            </div>

            <div className="grid gap-1.5 sm:grid-cols-2 xl:grid-cols-3">
              <div className="rounded-sm border bg-muted/20 px-2 py-1.5">
                <p className="text-muted-foreground text-[10px]">Language</p>
                <p className="text-xs font-semibold">{primaryLanguage}</p>
                <p className="text-muted-foreground mt-0.5 text-[10px]">
                  Signals: {languageSignals.join(" • ")}
                </p>
                <p className="text-muted-foreground mt-0.5 text-[10px]">
                  Tooling: {normalizedPackageManager} with{" "}
                  {formatNumber(packageScriptCount)} scripts
                  {engineCount > 0
                    ? ` and ${formatNumber(engineCount)} engine constraints`
                    : ""}
                </p>
              </div>

              <div className="rounded-sm border bg-muted/20 px-2 py-1.5">
                <p className="text-muted-foreground text-[10px]">License</p>
                <p className="text-xs font-semibold">
                  {project.license ?? "Unknown"}
                </p>
                <p className="text-muted-foreground mt-0.5 text-[10px]">
                  {toTitleCase(licensePosture)} • {visibility} repository
                </p>
                <p className="text-muted-foreground mt-0.5 text-[10px]">
                  {formatNumber(dependencyBreakdown.withKnownLicense)} /{" "}
                  {formatNumber(dependencyBreakdown.total)} dependencies include
                  license metadata
                </p>
              </div>

              <div className="rounded-sm border bg-muted/20 px-2 py-1.5">
                <p className="text-muted-foreground inline-flex items-center gap-1 text-[10px]">
                  <GitBranch className="size-3" />
                  Default branch
                </p>
                <p className="text-xs font-semibold">
                  {project.repo.default_branch}
                </p>
                <p className="text-muted-foreground mt-0.5 text-[10px]">
                  {formatNumber(branchCoverage.defaultBranchPrs)} /{" "}
                  {formatNumber(branchCoverage.totalRecentPrs)} recent PRs
                  target this branch
                </p>
                <p className="text-muted-foreground mt-0.5 text-[10px]">
                  {formatNumber(branchCoverage.defaultBranchDeploys)} recent
                  deployments from default branch • push{" "}
                  {formatTimeSince(recentPushAt)}
                </p>
              </div>

              <div className="rounded-sm border bg-muted/20 px-2 py-1.5">
                <p className="text-muted-foreground inline-flex items-center gap-1 text-[10px]">
                  <HardDrive className="size-3" />
                  Size
                </p>
                <p className="text-xs font-semibold">{repoSizeLabel}</p>
                <p className="text-muted-foreground mt-0.5 text-[10px]">
                  {formatNumber(dependencyBreakdown.total)} deps (
                  {formatNumber(dependencyBreakdown.direct)} direct /{" "}
                  {formatNumber(dependencyBreakdown.dev)} dev /{" "}
                  {formatNumber(dependencyBreakdown.peer)} peer)
                </p>
                <p className="text-muted-foreground mt-0.5 text-[10px]">
                  {formatNumber(project.repo.workspacePackageCount)} workspace
                  packages • {averageFilesPerCommit.toFixed(1)} files
                  touched/commit (30d)
                </p>
              </div>

              <div className="rounded-sm border bg-muted/20 px-2 py-1.5">
                <p className="text-muted-foreground text-[10px]">AI setup</p>
                <p className="text-xs font-semibold">
                  {formatNumber(detectedToolsCount)} tools detected
                </p>
                <p className="text-muted-foreground mt-0.5 text-[10px]">
                  {formatNumber(instructionFileCount)} instruction files •{" "}
                  {formatNumber(toolingDirectoryCount)} tooling directories
                </p>
                <p className="text-muted-foreground mt-0.5 text-[10px]">
                  {formatNumber(aiTouchedFiles)} setup-touched files in churn
                  analysis
                </p>
              </div>

              <div className="rounded-sm border bg-muted/20 px-2 py-1.5">
                <p className="text-muted-foreground text-[10px]">
                  Dependency intelligence
                </p>
                <p className="text-xs font-semibold">
                  {formatNumber(dependencyGroupCount)} groups •{" "}
                  {formatNumber(dependencyChangeCount)} tracked version changes
                </p>
                <p className="text-muted-foreground mt-0.5 text-[10px]">
                  {formatNumber(hotspotFileCount)} hotspot files •{" "}
                  {formatNumber(largestFileCount)} large files cataloged
                </p>
                <p className="text-muted-foreground mt-0.5 text-[10px]">
                  {formatNumber(releasesLast90Days)} releases (90d)
                  {releaseFrequencyPerMonth === null
                    ? ""
                    : ` • ${releaseFrequencyPerMonth.toFixed(1)}/month`}
                </p>
              </div>
            </div>

            <div className="mt-1.5 flex flex-wrap gap-1.5">
              {project.repo.topics.slice(0, 4).map((topic) => (
                <Badge
                  key={topic}
                  variant="outline"
                  className="h-5 px-1.5 text-[10px]"
                >
                  #{topic}
                </Badge>
              ))}
              {topCategories.slice(0, 2).map((category) => (
                <Badge
                  key={`category-${category}`}
                  variant="secondary"
                  className="h-5 px-1.5 text-[10px]"
                >
                  area:{normalizeLabel(category)}
                </Badge>
              ))}
              {topFileTypes.slice(0, 2).map((fileType) => (
                <Badge
                  key={`filetype-${fileType}`}
                  variant="secondary"
                  className="h-5 px-1.5 text-[10px]"
                >
                  file:{normalizeLabel(fileType)}
                </Badge>
              ))}
              <Badge variant="outline" className="h-5 px-1.5 text-[10px]">
                docs:{formatNumber(docsFootprint.fileCount)} (
                {formatRepoSize(docsFootprint.totalSizeKb)})
              </Badge>
            </div>
          </section>
        </div>

        <div className="flex flex-wrap items-center gap-1.5">
          <Button
            variant="default"
            size="sm"
            className="h-7 px-2 text-[11px]"
            asChild
          >
            <Link href={`/dashboard/${project.slug}`}>
              Open recipe
              <ArrowUpRight className="size-3" />
            </Link>
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="h-7 px-2 text-[11px]"
            asChild
          >
            <a href={project.url} target="_blank" rel="noreferrer">
              Visit app
              <ArrowUpRight className="size-3" />
            </a>
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="h-7 px-2 text-[11px]"
            asChild
          >
            <a href={getRepoUrl(project)} target="_blank" rel="noreferrer">
              Open repo
              <ArrowUpRight className="size-3" />
            </a>
          </Button>
          <div className="text-muted-foreground ml-auto flex items-center gap-2 text-[11px]">
            <span>{formatNumber(commitsLast7Days)} commits (7d)</span>
            <span>{formatNumber(commitsLast30Days)} commits (30d)</span>
          </div>
        </div>
      </div>
    </article>
  );
}

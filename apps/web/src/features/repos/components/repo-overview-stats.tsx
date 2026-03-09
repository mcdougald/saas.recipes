import {
  Activity,
  Boxes,
  CheckCheck,
  FileCode2,
  FolderGit2,
  HardDrive,
  ShieldAlert,
  Star,
  Users,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import type { RepositoryDashboardSummary } from "@/features/repos/types";

const numberFormatter = new Intl.NumberFormat("en-US", {
  maximumFractionDigits: 0,
});

const compactNumberFormatter = new Intl.NumberFormat("en-US", {
  notation: "compact",
  maximumFractionDigits: 1,
});

function formatNumber(value: number): string {
  return numberFormatter.format(value);
}

function formatCompactNumber(value: number): string {
  return compactNumberFormatter.format(value);
}

function formatPercent(value: number): string {
  return `${Math.round(value)}%`;
}

function formatAverage(value: number): string {
  return value.toFixed(1);
}

function formatRatio(numerator: number, denominator: number): string {
  if (denominator <= 0) {
    return "N/A";
  }

  return `${(numerator / denominator).toFixed(2)}x`;
}

function formatStorage(kilobytes: number): string {
  if (kilobytes >= 1024 * 1024) {
    return `${(kilobytes / (1024 * 1024)).toFixed(1)} GB`;
  }

  if (kilobytes >= 1024) {
    return `${(kilobytes / 1024).toFixed(1)} MB`;
  }

  return `${formatNumber(kilobytes)} KB`;
}

type RepoOverviewStatsProps = {
  summary: RepositoryDashboardSummary;
};

type StatDetail = {
  label: string;
  value: string;
};

type StatCard = {
  label: string;
  value: string;
  icon: LucideIcon;
  note: string;
  details: StatDetail[];
};

type RepoOverviewStatCardProps = {
  card: StatCard;
};

function RepoOverviewStatCard({ card }: RepoOverviewStatCardProps) {
  const Icon = card.icon;

  return (
    <Card className="min-w-0 pt-1 pb-1 border bg-card/95 shadow-xs">
      <CardHeader className="space-y-2 pt-0 p-3 pb-2">
        <div className="flex items-start justify-between gap-2">
          <CardDescription className="text-foreground/85 inline-flex min-w-0 rounded-sm border bg-muted/40 px-1.5 py-0.5 text-[9px] font-semibold uppercase tracking-[0.08em]">
            <span className="truncate">{card.label}</span>
          </CardDescription>
          <span className="text-muted-foreground shrink-0 rounded-sm border bg-muted/25 p-1">
            <Icon className="size-3.5" />
          </span>
        </div>

        <div className="space-y-1">
          <CardTitle className="text-lg leading-none font-semibold tabular-nums sm:text-xl">{card.value}</CardTitle>
          <p className="text-muted-foreground line-clamp-1 text-[10px] leading-4">{card.note}</p>
        </div>
      </CardHeader>

      <CardContent className="p-3 pt-0">
        <dl className="grid grid-cols-2 gap-x-2 gap-y-1.5 border-t border-dashed pt-2">
          {card.details.map((detail) => (
            <div key={detail.label} className="min-w-0">
              <dt className="text-muted-foreground truncate text-[10px] leading-tight">{detail.label}</dt>
              <dd className="truncate text-xs leading-tight font-semibold tabular-nums sm:text-[13px]">
                {detail.value}
              </dd>
            </div>
          ))}
        </dl>
      </CardContent>
    </Card>
  );
}

/**
 * Render rollup repository metrics for quick dashboard scanning.
 *
 * @param summary - Aggregated repository metrics for the current dataset.
 * @returns A responsive grid of high-signal stat cards.
 */
export function RepoOverviewStats({ summary }: RepoOverviewStatsProps) {
  const staleRepositories = Math.max(0, summary.totalRepositories - summary.recentlyPushedLast30Days);
  const activeRepositoryRate =
    summary.totalRepositories > 0
      ? (summary.recentlyPushedLast30Days / summary.totalRepositories) * 100
      : 0;
  const averageContributorsPerRepo =
    summary.totalRepositories > 0 ? summary.totalContributors / summary.totalRepositories : 0;
  const averageOpenIssuesPerRepo =
    summary.totalRepositories > 0 ? summary.totalOpenIssues / summary.totalRepositories : 0;
  const averageOpenPrsPerRepo =
    summary.totalRepositories > 0 ? summary.totalOpenPullRequests / summary.totalRepositories : 0;
  const averageStarsPerRepo = summary.totalRepositories > 0 ? summary.totalStars / summary.totalRepositories : 0;
  const averageStarsPerContributor =
    summary.totalContributors > 0 ? summary.totalStars / summary.totalContributors : 0;
  const forkToStarRate = summary.totalStars > 0 ? (summary.totalForks / summary.totalStars) * 100 : 0;
  const averageCommitsPerRepo = summary.totalRepositories > 0 ? summary.totalCommits / summary.totalRepositories : 0;
  const averageDependenciesPerRepo =
    summary.totalRepositories > 0 ? summary.totalDependencies / summary.totalRepositories : 0;
  const averageWorkspacePackagesPerRepo =
    summary.totalRepositories > 0
      ? summary.totalWorkspacePackages / summary.totalRepositories
      : 0;
  const averageFilesTouchedPerRepo =
    summary.totalRepositories > 0 ? summary.totalFilesTouched / summary.totalRepositories : 0;
  const averageRepoSizeKb =
    summary.totalRepositories > 0 ? summary.totalRepoSizeKb / summary.totalRepositories : 0;

  const statCards: StatCard[] = [
    {
      label: "Tracked Repositories",
      value: formatNumber(summary.totalRepositories),
      icon: FolderGit2,
      note: "Current repository coverage and activity freshness.",
      details: [
        { label: "Active (30d)", value: formatNumber(summary.recentlyPushedLast30Days) },
        { label: "Stale (>30d)", value: formatNumber(staleRepositories) },
        { label: "Active rate", value: formatPercent(activeRepositoryRate) },
        { label: "Open PRs", value: formatNumber(summary.totalOpenPullRequests) },
      ],
    },
    {
      label: "Community Reach",
      value: formatCompactNumber(summary.totalStars),
      icon: Star,
      note: "Adoption and ecosystem gravity across tracked repos.",
      details: [
        { label: "Forks", value: formatCompactNumber(summary.totalForks) },
        { label: "Stars / repo", value: formatAverage(averageStarsPerRepo) },
        { label: "Fork-to-star", value: formatPercent(forkToStarRate) },
        { label: "Stars / contributor", value: formatAverage(averageStarsPerContributor) },
      ],
    },
    {
      label: "Contributors",
      value: formatNumber(summary.totalContributors),
      icon: Users,
      note: "Maintainer and contributor capacity across repositories.",
      details: [
        { label: "Avg / repo", value: formatAverage(averageContributorsPerRepo) },
        { label: "Open PRs / repo", value: formatAverage(averageOpenPrsPerRepo) },
        {
          label: "Open PRs / contributor",
          value:
            summary.totalContributors > 0
              ? formatAverage(summary.totalOpenPullRequests / summary.totalContributors)
              : "0.0",
        },
        { label: "Merge rate", value: formatPercent(summary.averageMergeRate) },
      ],
    },
    {
      label: "PR Throughput",
      value: formatPercent(summary.averageMergeRate),
      icon: CheckCheck,
      note: "Pull request flow and review throughput quality.",
      details: [
        { label: "Open PRs", value: formatNumber(summary.totalOpenPullRequests) },
        { label: "PRs / repo", value: formatAverage(averageOpenPrsPerRepo) },
        { label: "Issues / PR", value: formatRatio(summary.totalOpenIssues, summary.totalOpenPullRequests) },
        { label: "Active repos", value: formatNumber(summary.recentlyPushedLast30Days) },
      ],
    },
    {
      label: "Backlog Pressure",
      value: formatNumber(summary.totalOpenIssues),
      icon: ShieldAlert,
      note: "Open issue load and maintenance pressure indicators.",
      details: [
        { label: "Issues / repo", value: formatAverage(averageOpenIssuesPerRepo) },
        { label: "Open PRs", value: formatNumber(summary.totalOpenPullRequests) },
        { label: "Issue-to-PR", value: formatRatio(summary.totalOpenIssues, summary.totalOpenPullRequests) },
        { label: "Merge rate", value: formatPercent(summary.averageMergeRate) },
      ],
    },
    {
      label: "Deploy Reliability",
      value:
        summary.averageDeploymentSuccessRate === null
          ? "N/A"
          : formatPercent(summary.averageDeploymentSuccessRate),
      icon: Activity,
      note:
        summary.averageDeploymentSuccessRate === null
          ? "Deployment telemetry is not available for this dataset."
          : "Average deployment success across repositories with deployment metadata.",
      details:
        summary.averageDeploymentSuccessRate === null
          ? [
              { label: "Telemetry", value: "Missing" },
              { label: "Active repos", value: formatNumber(summary.recentlyPushedLast30Days) },
              { label: "Open PRs", value: formatNumber(summary.totalOpenPullRequests) },
              { label: "Open issues", value: formatNumber(summary.totalOpenIssues) },
            ]
          : [
              {
                label: "Failure rate",
                value: formatPercent(Math.max(0, 100 - summary.averageDeploymentSuccessRate)),
              },
              { label: "Merge rate", value: formatPercent(summary.averageMergeRate) },
              { label: "Open PRs", value: formatNumber(summary.totalOpenPullRequests) },
              { label: "Open issues", value: formatNumber(summary.totalOpenIssues) },
            ],
    },
    {
      label: "File Activity",
      value: formatCompactNumber(summary.totalFilesTouched),
      icon: FileCode2,
      note: "Total files touched across the tracked commit history.",
      details: [
        { label: "Total commits", value: formatCompactNumber(summary.totalCommits) },
        { label: "Files / repo", value: formatAverage(averageFilesTouchedPerRepo) },
        { label: "Commits / repo", value: formatAverage(averageCommitsPerRepo) },
        { label: "Active rate", value: formatPercent(activeRepositoryRate) },
      ],
    },
    {
      label: "Dependency Surface",
      value: formatCompactNumber(summary.totalDependencies),
      icon: Boxes,
      note: "Dependency and package complexity across repositories.",
      details: [
        { label: "Workspace packages", value: formatNumber(summary.totalWorkspacePackages) },
        { label: "Deps / repo", value: formatAverage(averageDependenciesPerRepo) },
        { label: "Packages / repo", value: formatAverage(averageWorkspacePackagesPerRepo) },
        { label: "Open issues", value: formatCompactNumber(summary.totalOpenIssues) },
      ],
    },
    {
      label: "Repository Size",
      value: formatStorage(summary.totalRepoSizeKb),
      icon: HardDrive,
      note: "Stored repository footprint using indexed metadata size.",
      details: [
        { label: "Avg size / repo", value: formatStorage(averageRepoSizeKb) },
        { label: "Total repos", value: formatNumber(summary.totalRepositories) },
        { label: "Total files touched", value: formatCompactNumber(summary.totalFilesTouched) },
        { label: "Total commits", value: formatCompactNumber(summary.totalCommits) },
      ],
    },
  ];

  return (
    <div className="grid gap-2 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5">
      {statCards.map((card) => (
        <RepoOverviewStatCard key={card.label} card={card} />
      ))}
    </div>
  );
}

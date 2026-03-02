import {
  Activity,
  CheckCheck,
  FolderGit2,
  ShieldAlert,
  Star,
  Users,
} from "lucide-react";

import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import type { RepositoryDashboardSummary } from "@/features/repos/types";

const numberFormatter = new Intl.NumberFormat("en-US", {
  maximumFractionDigits: 0,
});

function formatNumber(value: number): string {
  return numberFormatter.format(value);
}

type RepoOverviewStatsProps = {
  summary: RepositoryDashboardSummary;
};

type StatCard = {
  label: string;
  value: string;
  icon: typeof Star;
  accentClassName: string;
  helper: string;
  secondary: string;
};

/**
 * Render rollup repository metrics for quick dashboard scanning.
 *
 * @param summary - Aggregated repository metrics for the current dataset.
 * @returns A responsive grid of high-signal stat cards.
 */
export function RepoOverviewStats({ summary }: RepoOverviewStatsProps) {
  const averageContributorsPerRepo =
    summary.totalRepositories > 0 ? summary.totalContributors / summary.totalRepositories : 0;
  const averageOpenIssuesPerRepo =
    summary.totalRepositories > 0 ? summary.totalOpenIssues / summary.totalRepositories : 0;

  const statCards: StatCard[] = [
    {
      label: "Tracked Repositories",
      value: formatNumber(summary.totalRepositories),
      icon: FolderGit2,
      accentClassName: "from-indigo-500/20 to-indigo-500/5",
      helper: `${summary.recentlyPushedLast30Days} pushed in last 30 days`,
      secondary: `${summary.totalRepositories - summary.recentlyPushedLast30Days} stale >30 days`,
    },
    {
      label: "Community Reach",
      value: formatNumber(summary.totalStars),
      icon: Star,
      accentClassName: "from-amber-500/20 to-amber-500/5",
      helper: `${formatNumber(summary.totalForks)} forks`,
      secondary: "Stars + forks indicate ecosystem gravity",
    },
    {
      label: "Contributors",
      value: formatNumber(summary.totalContributors),
      icon: Users,
      accentClassName: "from-sky-500/20 to-sky-500/5",
      helper: `${averageContributorsPerRepo.toFixed(1)} avg per repo`,
      secondary: "Higher spread usually lowers delivery bottlenecks",
    },
    {
      label: "PR Throughput",
      value: `${summary.averageMergeRate}%`,
      icon: CheckCheck,
      accentClassName: "from-emerald-500/20 to-emerald-500/5",
      helper: `${formatNumber(summary.totalOpenPullRequests)} open PRs`,
      secondary: "Merge rate from merged vs total pull requests",
    },
    {
      label: "Backlog Pressure",
      value: formatNumber(summary.totalOpenIssues),
      icon: ShieldAlert,
      accentClassName: "from-orange-500/20 to-orange-500/5",
      helper: `${averageOpenIssuesPerRepo.toFixed(1)} open issues / repo`,
      secondary: "Open issues signal maintenance load",
    },
    {
      label: "Deploy Reliability",
      value:
        summary.averageDeploymentSuccessRate === null
          ? "N/A"
          : `${summary.averageDeploymentSuccessRate}%`,
      icon: Activity,
      accentClassName: "from-teal-500/20 to-teal-500/5",
      helper:
        summary.averageDeploymentSuccessRate === null
          ? "No deployment telemetry available"
          : "Average success rate across repos with deployments",
      secondary:
        summary.averageDeploymentSuccessRate === null
          ? "Add deployments metadata to unlock this signal"
          : "Useful proxy for release confidence",
    },
  ];

  return (
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
      {statCards.map((card) => {
        const Icon = card.icon;

        return (
          <Card key={card.label} className="relative overflow-hidden border">
            <div
              className={`pointer-events-none absolute inset-x-0 top-0 h-16 bg-linear-to-r ${card.accentClassName}`}
            />
            <CardHeader className="relative gap-1 pb-2">
              <CardDescription>{card.label}</CardDescription>
              <CardTitle className="flex items-center gap-2 text-2xl">
                <Icon className="size-4" />
                {card.value}
              </CardTitle>
              <p className="text-muted-foreground text-xs">{card.helper}</p>
              <p className="text-muted-foreground text-xs">{card.secondary}</p>
            </CardHeader>
          </Card>
        );
      })}
    </div>
  );
}

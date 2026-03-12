"use client";

import {
  Activity,
  GitBranch,
  GitMerge,
  GitPullRequest,
  Package,
  Rocket,
  Star,
} from "lucide-react";

import { Card, CardContent } from "@/components/ui/card";
import { type RepositoryDashboardListItem } from "@/features/repos/types";
import { formatCompactNumber, formatNumber } from "./repository-detail-utils";

type RepositoryDetailMetricCardsProps = {
  /** Repository analytics source used to render each highlight card. */
  project: RepositoryDashboardListItem;
  /** Watcher count from metadata for the community card. */
  watchers: number;
  /** Bot contributor count in the current repository model. */
  botContributorCount: number;
  /** Pull request merge rate percentage. */
  mergeRate: number;
  /** Open pull-request ratio percentage. */
  prOpenRatio: number;
  /** Issue closure rate percentage. */
  issueClosureRate: number;
  /** Deployment success rate percentage, when available. */
  deploymentSuccessRate: number | null;
};

/**
 * Render the cross-tab summary metric cards shown above tab content.
 *
 * @param props - Repository and derived metrics for summary cards.
 * @returns A six-card responsive grid with health and activity highlights.
 */
export function RepositoryDetailMetricCards({
  project,
  watchers,
  botContributorCount,
  mergeRate,
  prOpenRatio,
  issueClosureRate,
  deploymentSuccessRate,
}: RepositoryDetailMetricCardsProps) {
  return (
    <div className="grid grid-cols-2 gap-2 lg:grid-cols-3 xl:grid-cols-6">
      <Card>
        <CardContent className="space-y-1 p-3">
          <p className="text-muted-foreground inline-flex items-center gap-1 text-xs">
            <Star className="size-3.5" />
            Community
          </p>
          <p className="text-lg font-semibold">
            {formatCompactNumber(project.metadata.stars)}
          </p>
          <p className="text-muted-foreground text-[11px]">
            {formatCompactNumber(project.metadata.forks)} forks •{" "}
            {formatCompactNumber(watchers)} watchers
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="space-y-1 p-3">
          <p className="text-muted-foreground inline-flex items-center gap-1 text-xs">
            <GitBranch className="size-3.5" />
            Contributors
          </p>
          <p className="text-lg font-semibold">
            {formatNumber(project.repo.contributor_count)}
          </p>
          <p className="text-muted-foreground text-[11px]">
            {formatNumber(botContributorCount)} bots
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="space-y-1 p-3">
          <p className="text-muted-foreground inline-flex items-center gap-1 text-xs">
            <Activity className="size-3.5" />
            Throughput
          </p>
          <p className="text-lg font-semibold">
            {formatNumber(project.trends.commitsLast7Days)} / 7d
          </p>
          <p className="text-muted-foreground text-[11px]">
            {formatNumber(project.trends.commitsLast30Days)} commits in 30d
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="space-y-1 p-3">
          <p className="text-muted-foreground inline-flex items-center gap-1 text-xs">
            <GitMerge className="size-3.5" />
            Pull requests
          </p>
          <p className="text-lg font-semibold">{mergeRate}%</p>
          <p className="text-muted-foreground text-[11px]">
            merge • {prOpenRatio}% open
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="space-y-1 p-3">
          <p className="text-muted-foreground inline-flex items-center gap-1 text-xs">
            <GitPullRequest className="size-3.5" />
            Issues
          </p>
          <p className="text-lg font-semibold">{issueClosureRate}%</p>
          <p className="text-muted-foreground text-[11px]">
            {formatNumber(project.repo.openIssues)} open
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="space-y-1 p-3">
          <p className="text-muted-foreground inline-flex items-center gap-1 text-xs">
            <Rocket className="size-3.5" />
            Reliability
          </p>
          <p className="text-lg font-semibold">
            {deploymentSuccessRate === null
              ? "N/A"
              : `${Math.round(deploymentSuccessRate)}%`}
          </p>
          <p className="text-muted-foreground text-[11px]">
            <Package className="size-3.5" />
            {formatCompactNumber(project.repo.dependencyCount)} deps •{" "}
            {formatNumber(project.repo.workspacePackageCount)} packages
          </p>
        </CardContent>
      </Card>
    </div>
  );
}

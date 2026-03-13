"use client";

import { ArrowUpRight, ChevronLeft } from "lucide-react";
import Link from "next/link";
import { useMemo } from "react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useRepositoryDetailContext } from "../repository-detail-context";
import {
  formatCompactNumber,
  formatDate,
  formatNumber,
  getRepositoryUrl,
} from "../repository-detail-utils";

const MILLIS_IN_DAY = 24 * 60 * 60 * 1000;
const MILLIS_IN_HOUR = 60 * 60 * 1000;
const MILLIS_IN_MINUTE = 60 * 1000;

function formatRelativeTime(value: string | null): string {
  if (!value) {
    return "Unknown";
  }

  const timestamp = Date.parse(value);
  if (Number.isNaN(timestamp)) {
    return "Unknown";
  }

  const diffMs = Date.now() - timestamp;
  if (diffMs < MILLIS_IN_MINUTE) {
    return "just now";
  }
  if (diffMs < MILLIS_IN_HOUR) {
    return `${Math.round(diffMs / MILLIS_IN_MINUTE)}m ago`;
  }
  if (diffMs < MILLIS_IN_DAY) {
    return `${Math.round(diffMs / MILLIS_IN_HOUR)}h ago`;
  }

  const days = Math.round(diffMs / MILLIS_IN_DAY);
  if (days < 30) {
    return `${days}d ago`;
  }
  if (days < 365) {
    return `${Math.round(days / 30)}mo ago`;
  }
  return `${Math.round(days / 365)}y ago`;
}

/**
 * Render the repository detail hero header and quick status metadata.
 *
 * @returns Repository summary card with focused dashboard indicators.
 */
export function RepositoryDetailHeader() {
  const { project, model, mergeRate, issueClosureRate, deploymentSuccessRate } =
    useRepositoryDetailContext();
  const repositoryUrl = getRepositoryUrl(project);
  const faviconUrl = useMemo(() => {
    try {
      const appHost = new URL(project.url).hostname;
      return `https://www.google.com/s2/favicons?domain=${appHost}&sz=64`;
    } catch {
      return "https://www.google.com/s2/favicons?domain=github.com&sz=64";
    }
  }, [project.url]);
  const latestMergedPullRequestAt = useMemo(
    () =>
      model.recentPullRequests.find((pullRequest) => pullRequest.mergedAt)
        ?.mergedAt ?? null,
    [model.recentPullRequests],
  );
  const churnLast30Days =
    project.trends.additionsLast30Days + project.trends.deletionsLast30Days;
  const commitsLast30Days = project.trends.commitsLast30Days;
  const reliabilityScore = Math.round(
    deploymentSuccessRate === null
      ? (mergeRate + issueClosureRate) / 2
      : (mergeRate + issueClosureRate + deploymentSuccessRate) / 3,
  );

  return (
    <Card className="overflow-hidden border-primary/20 bg-linear-to-br from-primary/8 via-background to-background">
      <CardContent className="space-y-4 p-4">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <span
                className="size-10 shrink-0 rounded-md border bg-background/80 bg-center bg-no-repeat shadow-sm"
                style={{ backgroundImage: `url("${faviconUrl}")` }}
                aria-hidden
              />
              <div className="space-y-1">
                <p className="text-muted-foreground text-xs">
                  Repository intelligence
                </p>
                <h1 className="text-2xl font-semibold tracking-tight md:text-3xl">
                  {project.repo.owner}/{project.repo.name}
                </h1>
              </div>
            </div>
            <p className="text-muted-foreground max-w-3xl text-sm">
              {project.description}
            </p>
            <div className="flex flex-wrap gap-1.5">
              <Badge variant="outline" className="capitalize">
                {project.sourceType}
              </Badge>
              <Badge variant="outline" className="capitalize">
                {project.status}
              </Badge>
              <Badge variant="outline">{project.metadata.language}</Badge>
              <Badge variant="outline">{project.repo.default_branch}</Badge>
              <Badge variant="outline">
                {project.license ?? "Unknown license"}
              </Badge>
              <Badge variant="outline">
                Updated {formatDate(project.repo.pushed_at)}
              </Badge>
            </div>
          </div>

          <div className="flex flex-wrap gap-2">
            <Button variant="outline" size="sm" asChild>
              <Link href="/dashboard">
                <ChevronLeft className="size-3.5" />
                Back
              </Link>
            </Button>
            <Button variant="outline" size="sm" asChild>
              <a href={project.url} target="_blank" rel="noreferrer">
                Live app
                <ArrowUpRight className="size-3.5" />
              </a>
            </Button>
            <Button size="sm" asChild>
              <a href={repositoryUrl} target="_blank" rel="noreferrer">
                Open GitHub
                <ArrowUpRight className="size-3.5" />
              </a>
            </Button>
          </div>
        </div>

        <div className="grid gap-2 sm:grid-cols-2 xl:grid-cols-4">
          <div className="rounded-md border bg-background/70 p-3">
            <p className="text-muted-foreground text-[11px]">Community</p>
            <p className="text-lg font-semibold">
              {formatCompactNumber(project.metadata.stars)} stars
            </p>
            <p className="text-muted-foreground text-[11px]">
              {formatCompactNumber(project.metadata.forks)} forks •{" "}
              {formatNumber(project.repo.contributor_count)} contributors
            </p>
          </div>
          <div className="rounded-md border bg-background/70 p-3">
            <p className="text-muted-foreground text-[11px]">Activity (30d)</p>
            <p className="text-lg font-semibold">
              {formatNumber(commitsLast30Days)}
            </p>
            <p className="text-muted-foreground text-[11px]">
              {formatCompactNumber(churnLast30Days)} lines changed
            </p>
          </div>
          <div className="rounded-md border bg-background/70 p-3">
            <p className="text-muted-foreground text-[11px]">Delivery health</p>
            <p className="text-lg font-semibold">{reliabilityScore}%</p>
            <p className="text-muted-foreground text-[11px]">
              merge {mergeRate}% • issues {issueClosureRate}%
            </p>
          </div>
          <div className="rounded-md border bg-background/70 p-3">
            <p className="text-muted-foreground text-[11px]">Freshness</p>
            <p className="text-lg font-semibold">
              {formatRelativeTime(project.repo.pushed_at)}
            </p>
            <p className="text-muted-foreground text-[11px]">
              merged{" "}
              {latestMergedPullRequestAt
                ? formatRelativeTime(latestMergedPullRequestAt)
                : "N/A"}
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

import {
  ArrowUpRight,
  GitBranch,
  Github,
  GitMerge,
  MessageSquareText,
  Split,
} from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { type RepositoryDashboardListItem } from "@/features/repos/types";
import {
  formatCompactNumber,
  formatDate,
  formatNumber,
  getRepositoryUrl,
  type RepositoryDetailModel,
} from "./repository-detail-utils";

type RepositoryDetailPrsTabProps = {
  project: RepositoryDashboardListItem;
  model: RepositoryDetailModel;
  mergeRate: number;
};

/**
 * Render the pull request analytics tab.
 *
 * @param project - Repository dashboard projection for GitHub deep links.
 * @param model - Normalized repository detail datasets.
 * @param mergeRate - Merge-rate percentage for pull requests.
 * @returns Pull request metrics and sampled PR cards.
 */
export function RepositoryDetailPrsTab({
  project,
  model,
  mergeRate,
}: RepositoryDetailPrsTabProps) {
  const pullRequests = model.recentPullRequests;
  const repositoryUrl = getRepositoryUrl(project);

  if (pullRequests.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Pull requests</CardTitle>
        </CardHeader>
        <CardContent className="text-muted-foreground text-sm">
          No pull-request analytics are available in the current dataset.
        </CardContent>
      </Card>
    );
  }

  const mergedCount = pullRequests.filter((pr) => pr.merged).length;
  const openCount = pullRequests.filter((pr) => pr.state === "open").length;
  const avgComments =
    pullRequests.reduce((sum, pr) => sum + pr.comments, 0) /
    pullRequests.length;
  const avgChangedFiles =
    pullRequests.reduce((sum, pr) => sum + pr.changedFiles, 0) /
    pullRequests.length;
  const avgLineDelta =
    pullRequests.reduce((sum, pr) => sum + pr.additions + pr.deletions, 0) /
    pullRequests.length;
  const avgReviewComments =
    pullRequests.reduce((sum, pr) => sum + pr.reviewComments, 0) /
    pullRequests.length;

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-2 lg:grid-cols-5">
        <Card>
          <CardContent className="space-y-1 p-3">
            <p className="text-muted-foreground text-xs">Sampled PRs</p>
            <p className="text-xl font-semibold">{pullRequests.length}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="space-y-1 p-3">
            <p className="text-muted-foreground text-xs">Merged / open</p>
            <p className="text-xl font-semibold">
              {mergedCount} / {openCount}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="space-y-1 p-3">
            <p className="text-muted-foreground text-xs">Merge rate</p>
            <p className="text-xl font-semibold">{mergeRate}%</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="space-y-1 p-3">
            <p className="text-muted-foreground text-xs">Avg comments</p>
            <p className="text-xl font-semibold">
              {formatNumber(Math.round(avgComments))}
            </p>
            <p className="text-muted-foreground text-[11px]">
              {formatNumber(Math.round(avgReviewComments))} review comments
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="space-y-1 p-3">
            <p className="text-muted-foreground text-xs">Avg size</p>
            <p className="text-xl font-semibold">
              {formatNumber(Math.round(avgChangedFiles))} files
            </p>
            <p className="text-muted-foreground text-[11px]">
              {formatCompactNumber(Math.round(avgLineDelta))} lines
            </p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="inline-flex items-center gap-1 text-base">
            <Github className="size-4" />
            Pull request references
          </CardTitle>
        </CardHeader>
        <CardContent className="grid gap-2 sm:grid-cols-2 xl:grid-cols-4">
          <a
            href={`${repositoryUrl}/pulls`}
            target="_blank"
            rel="noreferrer"
            className="rounded-md border bg-muted/20 p-2 text-sm transition-colors hover:bg-muted/40"
          >
            <p className="font-medium">All pull requests</p>
            <p className="text-muted-foreground mt-1 text-xs">
              Browse open, merged, and closed PRs
            </p>
          </a>
          <a
            href={`${repositoryUrl}/pulls?q=is%3Apr+is%3Aopen`}
            target="_blank"
            rel="noreferrer"
            className="rounded-md border bg-muted/20 p-2 text-sm transition-colors hover:bg-muted/40"
          >
            <p className="font-medium">Open PR queue</p>
            <p className="text-muted-foreground mt-1 text-xs">
              Review active work in progress
            </p>
          </a>
          <a
            href={`${repositoryUrl}/branches`}
            target="_blank"
            rel="noreferrer"
            className="rounded-md border bg-muted/20 p-2 text-sm transition-colors hover:bg-muted/40"
          >
            <p className="font-medium">Branch activity</p>
            <p className="text-muted-foreground mt-1 text-xs">
              Inspect branch lifecycle and cleanup
            </p>
          </a>
          <a
            href={`${repositoryUrl}/compare`}
            target="_blank"
            rel="noreferrer"
            className="rounded-md border bg-muted/20 p-2 text-sm transition-colors hover:bg-muted/40"
          >
            <p className="font-medium">Compare refs</p>
            <p className="text-muted-foreground mt-1 text-xs">
              Compare base/head refs for release readiness
            </p>
          </a>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-base">Pull request throughput</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          <div className="text-muted-foreground grid grid-cols-[minmax(0,1.8fr)_110px_90px_80px_90px_120px] gap-2 px-2 text-[11px] font-medium">
            <span>Pull request</span>
            <span>Status</span>
            <span className="text-right">Commits</span>
            <span className="text-right">Files</span>
            <span className="text-right">Comments</span>
            <span className="text-right">Opened</span>
          </div>
          {pullRequests.slice(0, 35).map((pullRequest) => (
            <div
              key={`${pullRequest.number}-${pullRequest.title}`}
              className="grid grid-cols-[minmax(0,1.8fr)_110px_90px_80px_90px_120px] items-center gap-2 rounded-md border bg-muted/20 px-2 py-2"
            >
              <div className="min-w-0">
                <p className="truncate text-sm font-medium">
                  #{pullRequest.number} {pullRequest.title}
                </p>
                <p className="text-muted-foreground truncate text-xs">
                  by {pullRequest.author}
                </p>
                <div className="mt-1 flex items-center gap-2 text-[11px]">
                  <span className="text-emerald-600 dark:text-emerald-400">
                    +{formatCompactNumber(pullRequest.additions)}
                  </span>
                  <span className="text-rose-600 dark:text-rose-400">
                    -{formatCompactNumber(pullRequest.deletions)}
                  </span>
                  {pullRequest.htmlUrl ? (
                    <a
                      href={pullRequest.htmlUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="text-primary inline-flex items-center gap-1 hover:underline"
                    >
                      open
                      <ArrowUpRight className="size-3" />
                    </a>
                  ) : null}
                  <a
                    href={`https://github.com/${pullRequest.author}`}
                    target="_blank"
                    rel="noreferrer"
                    className="text-primary hover:underline"
                  >
                    @{pullRequest.author}
                  </a>
                </div>
                <p className="text-muted-foreground mt-1 inline-flex items-center gap-1 text-[11px]">
                  <GitBranch className="size-3.5" />
                  {pullRequest.baseRef} ← {pullRequest.headRef}
                </p>
              </div>
              <Badge
                variant={pullRequest.merged ? "secondary" : "outline"}
                className="w-fit capitalize"
              >
                {pullRequest.draft
                  ? "draft"
                  : pullRequest.merged
                    ? "merged"
                    : pullRequest.state}
              </Badge>
              <span className="inline-flex justify-end gap-1 text-sm font-medium">
                <GitMerge className="text-muted-foreground size-3.5" />
                {formatNumber(pullRequest.commits)}
              </span>
              <span className="inline-flex justify-end gap-1 text-sm font-medium">
                <Split className="text-muted-foreground size-3.5" />
                {formatNumber(pullRequest.changedFiles)}
              </span>
              <span className="inline-flex justify-end gap-1 text-sm font-medium">
                <MessageSquareText className="text-muted-foreground size-3.5" />
                {formatNumber(pullRequest.comments)}
              </span>
              <div className="text-right">
                <span className="text-muted-foreground block text-xs">
                  {formatDate(pullRequest.createdAt)}
                </span>
                <span className="text-muted-foreground block text-[10px]">
                  merged {formatDate(pullRequest.mergedAt)}
                </span>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}

"use client";

import { ArrowUpRight, ChevronLeft, GitBranch } from "lucide-react";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "@/contexts/auth-context";
import { type RepositoryDashboardListItem } from "@/features/repos/types";
import { RepositoryDetailMetricCards } from "./repository-detail-metric-cards";
import {
  type RepositoryDetailTabMetrics,
  RepositoryDetailTabs,
  type RepositoryDetailTabValue,
} from "./repository-detail-tabs";
import {
  buildRepositoryDetailModel,
  formatCompactNumber,
  formatDate,
  formatNumber,
  getRepositoryUrl,
} from "./repository-detail-utils";

type RepositoryDetailProps = {
  /** Repository dashboard projection selected by slug. */
  project: RepositoryDashboardListItem;
  /** Related repositories surfaced for continued exploration. */
  relatedProjects: RepositoryDashboardListItem[];
};

const DEFAULT_TAB: RepositoryDetailTabValue = "overview";
const TAB_HASHES = new Set<RepositoryDetailTabValue>([
  "overview",
  "contributors",
  "deps",
  "deployments",
  "prs",
  "files",
  "admin",
]);

const MILLIS_IN_DAY = 24 * 60 * 60 * 1000;
const MILLIS_IN_HOUR = 60 * 60 * 1000;
const MILLIS_IN_MINUTE = 60 * 1000;

function asTabFromHash(hash: string): RepositoryDetailTabValue | null {
  const normalized = hash.replace(/^#/, "").toLowerCase();
  if (!TAB_HASHES.has(normalized as RepositoryDetailTabValue)) {
    return null;
  }
  return normalized as RepositoryDetailTabValue;
}

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
 * Render a repository detail page with tabbed engineering analytics.
 *
 * @param project - Repository dashboard item to inspect.
 * @param relatedProjects - Similar repository recipes for navigation.
 * @returns Repository detail layout with overview and deep-dive tabs.
 */
export function RepositoryDetail({
  project,
  relatedProjects,
}: RepositoryDetailProps) {
  const { user } = useAuth();
  const [activeTab, setActiveTab] =
    useState<RepositoryDetailTabValue>(DEFAULT_TAB);
  const [isLocalhost, setIsLocalhost] = useState(false);
  const mergeRate =
    project.repo.totalPullRequests > 0
      ? Math.round(
          (project.repo.mergedPullRequests / project.repo.totalPullRequests) *
            100,
        )
      : 0;
  const issueClosureRate =
    project.repo.totalIssues > 0
      ? Math.round((project.repo.closedIssues / project.repo.totalIssues) * 100)
      : 0;
  const model = useMemo(() => buildRepositoryDetailModel(project), [project]);
  const latestMergedPullRequestAt = useMemo(
    () =>
      model.recentPullRequests.find((pullRequest) => pullRequest.mergedAt)
        ?.mergedAt ?? null,
    [model.recentPullRequests],
  );
  const deploymentSuccessRate = project.repo.deployments?.successRate ?? null;
  const totalCommits = project.repo.commit_count;
  const watchers = project.metadata.watchers;
  const repositoryAgeDays = Math.max(
    1,
    Math.round(
      (Date.now() -
        Date.parse(project.repo.created_at || project.repo.pushed_at)) /
        MILLIS_IN_DAY,
    ),
  );
  const repositoryAgeYears = (repositoryAgeDays / 365).toFixed(1);
  const averageCommitsPerMonth = Math.round(
    totalCommits / (repositoryAgeDays / 30),
  );
  const lineChangeLoad = Math.max(
    0,
    project.trends.additionsLast30Days + project.trends.deletionsLast30Days,
  );
  const churnPerRecentCommit =
    project.trends.commitsLast30Days > 0
      ? Math.round(lineChangeLoad / project.trends.commitsLast30Days)
      : 0;
  const prOpenRatio =
    project.repo.totalPullRequests > 0
      ? Math.round(
          (project.repo.openPullRequests / project.repo.totalPullRequests) *
            100,
        )
      : 0;
  const canViewAdminTab = isLocalhost || user?.admin === true;
  const commitVelocityMonthly = project.trends.commitsLast30Days;
  const commitVelocityWeekly =
    project.trends.commitsLast7Days > 0
      ? project.trends.commitsLast7Days
      : Math.max(1, Math.round(commitVelocityMonthly / 4));
  const commitVelocityDaily = Math.max(
    0.1,
    Number((commitVelocityMonthly / 30).toFixed(1)),
  );
  const commitCoverageRatio = Math.min(
    100,
    Math.round((commitVelocityMonthly / Math.max(totalCommits, 1)) * 100),
  );
  const velocityVsLifetimeMonthlyRatio = Math.min(
    100,
    Math.round(
      (commitVelocityMonthly / Math.max(averageCommitsPerMonth, 1)) * 100,
    ),
  );
  const repoAgeProgress = Math.min(
    100,
    Math.round((repositoryAgeDays / (5 * 365)) * 100),
  );
  const repositoryUrl = getRepositoryUrl(project);
  const faviconUrl = useMemo(() => {
    try {
      const appHost = new URL(project.url).hostname;
      return `https://www.google.com/s2/favicons?domain=${appHost}&sz=64`;
    } catch {
      return `https://www.google.com/s2/favicons?domain=github.com&sz=64`;
    }
  }, [project.url]);
  const botContributorCount = model.contributors.filter(
    (item) => item.isBot,
  ).length;
  const humanContributorCount = Math.max(
    0,
    model.contributors.length - botContributorCount,
  );
  const criticalDependencyCount = model.dependencies.filter(
    (item) => item.isCritical,
  ).length;
  const outdatedDependencyCount = model.dependencies.filter(
    (item) => item.latestVersion && item.latestVersion !== item.version,
  ).length;
  const deploymentEnvironmentCount = model.deploymentsByEnvironment.length;
  const deploymentCountLast30Days =
    project.trends.deploymentsLast30Days ??
    model.deploymentsByEnvironment.reduce(
      (sum, environment) => sum + environment.deploymentsLast30Days,
      0,
    );
  const pullRequestSampleCount = model.recentPullRequests.length;
  const docFileCount = model.markdownFiles.length;
  const hotspotFileCount = model.hotspotFiles.length;

  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }

    const hostname = window.location.hostname.toLowerCase();
    setIsLocalhost(
      hostname === "localhost" ||
        hostname === "127.0.0.1" ||
        hostname === "::1",
    );

    const routeTab = asTabFromHash(window.location.hash);
    if (routeTab) {
      setActiveTab(routeTab);
    }
  }, []);

  useEffect(() => {
    if (!canViewAdminTab && activeTab === "admin") {
      setActiveTab(DEFAULT_TAB);
    }
  }, [activeTab, canViewAdminTab]);

  const tabMetrics: RepositoryDetailTabMetrics = {
    contributors: { value: humanContributorCount, suffix: "humans" },
    deps: { value: criticalDependencyCount, suffix: "critical" },
    deployments: { value: deploymentEnvironmentCount, suffix: "envs" },
    prs: { value: pullRequestSampleCount, suffix: "sampled" },
    files: { value: hotspotFileCount, suffix: "hotspots" },
  };
  const activeTabHint = useMemo(() => {
    const metricPhrase = (value: number, label: string): string | null =>
      value > 0 ? `${formatNumber(value)} ${label}` : null;
    const joinPhrases = (phrases: Array<string | null>): string =>
      phrases
        .filter((phrase): phrase is string => Boolean(phrase))
        .join(" and ");
    const labelByTab: Record<
      Exclude<RepositoryDetailTabValue, "admin">,
      string
    > = {
      overview: "Repository health signals and summary scorecards.",
      contributors:
        joinPhrases([
          metricPhrase(humanContributorCount, "humans"),
          metricPhrase(botContributorCount, "bots"),
        ]) || "Contributor throughput and recency context.",
      deps:
        joinPhrases([
          metricPhrase(criticalDependencyCount, "critical"),
          metricPhrase(
            outdatedDependencyCount,
            "potentially outdated dependencies",
          ),
        ]) || "Dependency triage signals.",
      deployments:
        joinPhrases([
          metricPhrase(deploymentEnvironmentCount, "environments"),
          metricPhrase(
            deploymentCountLast30Days,
            "deploys in the last 30 days",
          ),
        ]) || "Deployment environment and frequency signals.",
      prs: `${metricPhrase(pullRequestSampleCount, "sampled pull requests") || "Pull request sample"} with merge and review load signals.`,
      files: `${
        joinPhrases([
          metricPhrase(docFileCount, "docs files"),
          metricPhrase(hotspotFileCount, "hotspot files"),
        ]) || "File-system analytics"
      } across commit history.`,
    };

    if (activeTab === "admin") {
      return "Raw diagnostic payloads for admins and localhost debugging.";
    }

    return labelByTab[activeTab];
  }, [
    activeTab,
    botContributorCount,
    criticalDependencyCount,
    deploymentCountLast30Days,
    deploymentEnvironmentCount,
    docFileCount,
    hotspotFileCount,
    humanContributorCount,
    outdatedDependencyCount,
    pullRequestSampleCount,
  ]);

  const handleTabChange = (value: string) => {
    const nextTab = asTabFromHash(value);
    if (!nextTab) {
      return;
    }
    if (nextTab === "admin" && !canViewAdminTab) {
      return;
    }

    setActiveTab(nextTab);

    if (typeof window !== "undefined") {
      window.history.replaceState(null, "", `#${nextTab}`);
    }
  };

  return (
    <div className="@container/main space-y-4 px-4 pb-6 lg:px-6">
      <Card className="overflow-hidden border-primary/20 bg-linear-to-br from-primary/8 via-background to-background">
        <CardContent className="space-y-4 p-4">
          <div className="flex flex-wrap items-start justify-between gap-4">
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
                <Badge variant="outline" className="capitalize">
                  {project.metadata.visibility}
                </Badge>
                <Badge variant="outline">{project.metadata.language}</Badge>
                <Badge variant="outline">{project.repo.default_branch}</Badge>
                {project.repo.packageManager ? (
                  <Badge variant="outline">{project.repo.packageManager}</Badge>
                ) : null}
                {project.repo.latestVersion ? (
                  <Badge variant="outline">
                    Latest {project.repo.latestVersion}
                  </Badge>
                ) : null}
                <Badge variant="outline">
                  {project.license ?? "Unknown license"}
                </Badge>
                <Badge variant="outline">
                  Updated {formatDate(project.repo.pushed_at)}
                </Badge>
                <Badge variant="outline">
                  {formatNumber(model.markdownFiles.length)} docs files
                </Badge>
                <Badge variant="outline">
                  Synced {formatDate(project.metadata.lastSyncedAt)}
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
          <div className="grid gap-2 sm:grid-cols-3">
            <div className="rounded-md border bg-background/70 p-3">
              <p className="text-muted-foreground text-[11px]">Created</p>
              <p className="text-sm font-semibold">
                {formatRelativeTime(project.repo.created_at)}
              </p>
              <p className="text-muted-foreground text-[11px]">
                {formatDate(project.repo.created_at)}
              </p>
            </div>
            <div className="rounded-md border bg-background/70 p-3">
              <p className="text-muted-foreground text-[11px]">Last merge</p>
              <p className="text-sm font-semibold">
                {formatRelativeTime(latestMergedPullRequestAt)}
              </p>
              <p className="text-muted-foreground text-[11px]">
                {latestMergedPullRequestAt
                  ? formatDate(latestMergedPullRequestAt)
                  : "No merged pull request detected"}
              </p>
            </div>
            <div className="rounded-md border bg-background/70 p-3">
              <p className="text-muted-foreground text-[11px]">Last push</p>
              <p className="text-sm font-semibold">
                {formatRelativeTime(project.repo.pushed_at)}
              </p>
              <p className="text-muted-foreground text-[11px]">
                {formatDate(project.repo.pushed_at)}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="border-primary/20 bg-primary/4">
        <CardContent className="grid gap-2 p-3 sm:grid-cols-2 xl:grid-cols-4">
          <div className="space-y-2 rounded-md border bg-background/70 p-3">
            <p className="text-muted-foreground text-[11px]">Total commits</p>
            <p className="text-xl font-semibold leading-none">
              {formatNumber(totalCommits)}
            </p>
            <p className="text-muted-foreground text-[11px]">
              {formatNumber(commitVelocityMonthly)} in last 30 days
            </p>
            <div className="h-1.5 w-full overflow-hidden rounded-full bg-muted">
              <div
                className="h-full rounded-full bg-primary/80"
                style={{ width: `${Math.max(6, commitCoverageRatio)}%` }}
              />
            </div>
          </div>
          <div className="space-y-2 rounded-md border bg-background/70 p-3">
            <p className="text-muted-foreground text-[11px]">Commit velocity</p>
            <p className="text-xl font-semibold leading-none">
              {formatNumber(commitVelocityMonthly)}
            </p>
            <p className="text-muted-foreground text-[11px]">
              {formatNumber(commitVelocityWeekly)}/week • {commitVelocityDaily}
              /day
            </p>
            <div className="h-1.5 w-full overflow-hidden rounded-full bg-muted">
              <div
                className="h-full rounded-full bg-emerald-500/80"
                style={{
                  width: `${Math.max(8, velocityVsLifetimeMonthlyRatio)}%`,
                }}
              />
            </div>
            <p className="text-muted-foreground text-[10px]">
              vs lifetime avg {formatNumber(averageCommitsPerMonth)}/month
            </p>
          </div>
          <div className="space-y-2 rounded-md border bg-background/70 p-3">
            <p className="text-muted-foreground text-[11px]">Repo age</p>
            <p className="text-xl font-semibold leading-none">
              {repositoryAgeYears}y
            </p>
            <p className="text-muted-foreground text-[11px]">
              {formatNumber(repositoryAgeDays)} days in production
            </p>
            <div className="h-1.5 w-full overflow-hidden rounded-full bg-muted">
              <div
                className="h-full rounded-full bg-sky-500/80"
                style={{ width: `${Math.max(8, repoAgeProgress)}%` }}
              />
            </div>
            <p className="text-muted-foreground text-[10px]">
              age scale calibrated to 5 years
            </p>
          </div>
          <div className="space-y-1 rounded-md border bg-background/70 p-3">
            <p className="text-muted-foreground text-[11px]">Churn intensity</p>
            <p className="text-xl font-semibold">
              {formatCompactNumber(lineChangeLoad)}
            </p>
            <p className="text-muted-foreground text-[11px]">
              {formatNumber(churnPerRecentCommit)} lines / recent commit
            </p>
          </div>
        </CardContent>
      </Card>

      <RepositoryDetailMetricCards
        project={project}
        watchers={watchers}
        botContributorCount={botContributorCount}
        mergeRate={mergeRate}
        prOpenRatio={prOpenRatio}
        issueClosureRate={issueClosureRate}
        deploymentSuccessRate={deploymentSuccessRate}
      />

      <RepositoryDetailTabs
        activeTab={activeTab}
        onValueChange={handleTabChange}
        canViewAdminTab={canViewAdminTab}
        activeTabHint={activeTabHint}
        tabMetrics={tabMetrics}
        project={project}
        model={model}
        mergeRate={mergeRate}
        issueClosureRate={issueClosureRate}
      />

      {relatedProjects.length > 0 ? (
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base">Related repositories</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-2 md:grid-cols-2 xl:grid-cols-3">
            {relatedProjects.map((related) => (
              <Link
                key={related.id}
                href={`/dashboard/${related.slug}`}
                className="rounded-md border bg-muted/20 p-3 transition-colors hover:bg-muted/40"
              >
                <p className="text-sm font-medium">
                  {related.repo.owner}/{related.repo.name}
                </p>
                <p className="text-muted-foreground mt-1 text-xs">
                  {related.metadata.language} • {related.sourceType} •{" "}
                  {formatCompactNumber(related.metadata.stars)} stars
                </p>
                <p className="text-muted-foreground mt-1 inline-flex items-center gap-1 text-[11px]">
                  <GitBranch className="size-3.5" />
                  {formatDate(related.repo.pushed_at)}
                </p>
              </Link>
            ))}
          </CardContent>
        </Card>
      ) : null}
    </div>
  );
}

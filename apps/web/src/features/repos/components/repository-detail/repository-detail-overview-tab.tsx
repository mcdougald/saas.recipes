import {
  CalendarClock,
  CheckCircle2,
  Clock3,
  FileCode2,
  Flame,
  GitBranch,
  GitCommitHorizontal,
  History,
  Layers3,
  Milestone,
  Rocket,
  ShieldCheck,
  Star,
  Timer,
  Users,
} from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { type RepositoryDashboardListItem } from "@/features/repos/types";
import {
  ComparativeBars,
  DeltaSplit,
  TrendSparkline,
} from "../repository-list/trend-visuals";
import {
  formatCompactNumber,
  formatNumber,
  type RepositoryDetailModel,
} from "./repository-detail-utils";

type RepositoryDetailOverviewTabProps = {
  project: RepositoryDashboardListItem;
  model: RepositoryDetailModel;
  mergeRate: number;
  issueClosureRate: number;
};

/**
 * Render the repository overview tab with executive and engineering signals.
 *
 * @param project - Repository dashboard projection.
 * @param model - Normalized repository detail datasets.
 * @param mergeRate - Merge-rate percentage for pull requests.
 * @param issueClosureRate - Issue closure percentage.
 * @returns Overview cards and trend visuals.
 */
export function RepositoryDetailOverviewTab({
  project,
  model,
  mergeRate,
  issueClosureRate,
}: RepositoryDetailOverviewTabProps) {
  const deploymentSuccessRate = project.repo.deployments?.successRate ?? 0;
  const deploymentCount = project.repo.deployments?.totalCount ?? 0;
  const commitsLast30Days = project.trends.commitsLast30Days;
  const commitsLast7Days = project.trends.commitsLast7Days;
  const releasesLast90Days = project.trends.releasesLast90Days ?? 0;
  const deploymentsLast30Days = project.trends.deploymentsLast30Days ?? 0;
  const churnLast30Days = project.trends.codeChurnLast30Days;
  const repositoryAgeDays = Math.max(
    1,
    Math.round(
      (Date.now() -
        Date.parse(project.repo.created_at || project.repo.pushed_at)) /
        (24 * 60 * 60 * 1000),
    ),
  );
  const repositoryAgeYears = (repositoryAgeDays / 365).toFixed(1);
  const averageMonthlyCommits = Math.max(
    1,
    Math.round(project.repo.commit_count / (repositoryAgeDays / 30)),
  );
  const commitsPerContributor = Number(
    (commitsLast30Days / Math.max(1, project.repo.contributor_count)).toFixed(
      1,
    ),
  );
  const churnPerCommit = Math.round(
    churnLast30Days / Math.max(commitsLast30Days, 1),
  );
  const releaseCadenceMonthly = Number((releasesLast90Days / 3).toFixed(1));
  const mergePressure = Math.round(
    (project.repo.openPullRequests /
      Math.max(project.repo.totalPullRequests, 1)) *
      100,
  );
  const reliabilityScore =
    deploymentCount > 0
      ? Math.round((mergeRate + issueClosureRate + deploymentSuccessRate) / 3)
      : Math.round((mergeRate + issueClosureRate) / 2);
  const momentumVsBaseline = Math.round(
    (commitsLast30Days / Math.max(averageMonthlyCommits, 1)) * 100,
  );
  const commitTrend = [
    commitsLast7Days,
    Math.max(1, Math.round(commitsLast30Days / 4)),
    deploymentsLast30Days,
    releasesLast90Days,
    Math.max(1, Math.round(reliabilityScore / 10)),
  ];

  const monthlySeries = model.monthlyCommitSeries;
  const maxMonthlyValue = Math.max(
    ...monthlySeries.map((item) => item.value),
    1,
  );
  const latestMonthlyPoint =
    monthlySeries.length > 0 ? monthlySeries[monthlySeries.length - 1] : null;
  const previousMonthlyPoint =
    monthlySeries.length > 1 ? monthlySeries[monthlySeries.length - 2] : null;
  const latestMonthlyDelta = latestMonthlyPoint
    ? latestMonthlyPoint.value - (previousMonthlyPoint?.value ?? 0)
    : 0;
  const rollingThreeMonthAverage =
    monthlySeries.length > 0
      ? Math.round(
          monthlySeries.slice(-3).reduce((sum, point) => sum + point.value, 0) /
            Math.max(1, Math.min(3, monthlySeries.length)),
        )
      : 0;
  const peakMonthlyPoint = monthlySeries.reduce(
    (peak, point) => (point.value > peak.value ? point : peak),
    monthlySeries[0] ?? { key: "none", label: "N/A", value: 0 },
  );
  const weekdayBars = model.weekdayCommitSeries;
  const hourlyHighlights = model.hourlyCommitSeries.filter((point) =>
    ["00", "06", "12", "18", "23"].includes(point.label),
  );
  const topFileTypes = model.fileTypeDistribution.slice(0, 4).map((entry) => ({
    key: entry.key,
    label: entry.label,
    value: entry.value,
  }));
  const topDirectories = model.topDirectories.slice(0, 5).map((entry) => ({
    key: entry.key,
    label: entry.label,
    value: entry.value,
  }));

  return (
    <div className="space-y-4">
      <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
        <Card className="border-primary/20 bg-linear-to-br from-primary/8 via-background to-background">
          <CardHeader className="pb-2">
            <CardTitle className="text-muted-foreground inline-flex items-center gap-1 text-xs font-medium">
              <Flame className="size-3.5" />
              Velocity baseline
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-1">
            <p className="text-2xl font-semibold">
              {formatNumber(commitsLast30Days)}
            </p>
            <p className="text-muted-foreground text-xs">
              commits in 30d, {formatNumber(commitsLast7Days)} in 7d
            </p>
            <p className="text-muted-foreground text-xs">
              {momentumVsBaseline}% of lifetime monthly average
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-muted-foreground inline-flex items-center gap-1 text-xs font-medium">
              <ShieldCheck className="size-3.5" />
              Reliability score
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-1">
            <p className="text-2xl font-semibold">{reliabilityScore}%</p>
            <p className="text-muted-foreground text-xs">
              merge {mergeRate}% • issues {issueClosureRate}%
            </p>
            <Progress value={reliabilityScore} className="mt-1 h-1.5" />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-muted-foreground inline-flex items-center gap-1 text-xs font-medium">
              <Users className="size-3.5" />
              Collaboration density
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-1">
            <p className="text-2xl font-semibold">{commitsPerContributor}</p>
            <p className="text-muted-foreground text-xs">
              commits per contributor in last 30 days
            </p>
            <p className="text-muted-foreground text-xs">
              {formatNumber(project.repo.contributor_count)} contributors total
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-muted-foreground inline-flex items-center gap-1 text-xs font-medium">
              <Milestone className="size-3.5" />
              Release posture
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-1">
            <p className="text-2xl font-semibold">{releaseCadenceMonthly}/mo</p>
            <p className="text-muted-foreground text-xs">
              {formatNumber(releasesLast90Days)} releases in 90d
            </p>
            <p className="text-muted-foreground text-xs">
              open PR pressure: {mergePressure}%
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-3 xl:grid-cols-[1.2fr_minmax(0,1fr)]">
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Execution pulse</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <TrendSparkline
              values={commitTrend}
              className="text-primary h-12 w-full"
            />
            <div className="grid gap-2 sm:grid-cols-2">
              <div className="rounded-md border bg-muted/20 px-2 py-1.5">
                <p className="text-muted-foreground inline-flex items-center gap-1 text-[11px]">
                  <GitCommitHorizontal className="size-3.5" />
                  Commits (7d)
                </p>
                <p className="mt-1 text-sm font-semibold">
                  {formatNumber(commitsLast7Days)}
                </p>
              </div>
              <div className="rounded-md border bg-muted/20 px-2 py-1.5">
                <p className="text-muted-foreground inline-flex items-center gap-1 text-[11px]">
                  <Rocket className="size-3.5" />
                  Deploys (30d)
                </p>
                <p className="mt-1 text-sm font-semibold">
                  {formatNumber(deploymentsLast30Days)}
                </p>
              </div>
              <div className="rounded-md border bg-muted/20 px-2 py-1.5">
                <p className="text-muted-foreground inline-flex items-center gap-1 text-[11px]">
                  <Milestone className="size-3.5" />
                  Releases (90d)
                </p>
                <p className="mt-1 text-sm font-semibold">
                  {formatNumber(releasesLast90Days)}
                </p>
              </div>
              <div className="rounded-md border bg-muted/20 px-2 py-1.5">
                <p className="text-muted-foreground inline-flex items-center gap-1 text-[11px]">
                  <CheckCircle2 className="size-3.5" />
                  Deployment success
                </p>
                <p className="mt-1 text-sm font-semibold">
                  {deploymentCount > 0
                    ? `${Math.round(deploymentSuccessRate)}%`
                    : "N/A"}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Delivery scorecards</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="space-y-1.5">
              <div className="flex items-center justify-between text-xs">
                <span className="text-muted-foreground">
                  Reliability composite
                </span>
                <span className="font-semibold">{reliabilityScore}%</span>
              </div>
              <Progress value={reliabilityScore} className="h-1.5" />
            </div>
            <div className="space-y-1.5">
              <div className="flex items-center justify-between text-xs">
                <span className="text-muted-foreground">Merge rate</span>
                <span className="font-semibold">{mergeRate}%</span>
              </div>
              <Progress value={mergeRate} className="h-1.5" />
            </div>
            <div className="space-y-1.5">
              <div className="flex items-center justify-between text-xs">
                <span className="text-muted-foreground">Issue closure</span>
                <span className="font-semibold">{issueClosureRate}%</span>
              </div>
              <Progress value={issueClosureRate} className="h-1.5" />
            </div>

            <div className="flex flex-wrap gap-1.5 pt-1">
              <Badge variant="outline">
                <Layers3 className="mr-1 size-3.5" />
                {model.markdownFiles.length} docs files
              </Badge>
              <Badge variant="outline">
                {model.dependencies.length} dependency entries
              </Badge>
              <Badge variant="outline">
                {model.recentPullRequests.length} sampled PRs
              </Badge>
              <Badge variant="secondary">
                {formatNumber(churnPerCommit)} churn / commit
              </Badge>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-3 xl:grid-cols-[1.2fr_minmax(0,1fr)]">
        <Card>
          <CardHeader>
            <CardTitle className="inline-flex items-center gap-1 text-base">
              <History className="size-4" />
              Historical git activity
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {monthlySeries.length > 0 ? (
              <div className="space-y-1.5">
                <p className="text-muted-foreground text-xs">
                  Commits by month (last {monthlySeries.length})
                </p>
                <div className="grid gap-2 sm:grid-cols-3">
                  <div className="rounded-md border bg-muted/20 p-2">
                    <p className="text-muted-foreground text-[11px]">
                      Latest month
                    </p>
                    <p className="text-sm font-semibold">
                      {latestMonthlyPoint?.label ?? "N/A"} •{" "}
                      {formatNumber(latestMonthlyPoint?.value ?? 0)}
                    </p>
                  </div>
                  <div className="rounded-md border bg-muted/20 p-2">
                    <p className="text-muted-foreground text-[11px]">
                      Month-over-month
                    </p>
                    <p
                      className={`text-sm font-semibold ${
                        latestMonthlyDelta >= 0
                          ? "text-emerald-600 dark:text-emerald-400"
                          : "text-rose-600 dark:text-rose-400"
                      }`}
                    >
                      {latestMonthlyDelta >= 0 ? "+" : ""}
                      {formatNumber(latestMonthlyDelta)}
                    </p>
                  </div>
                  <div className="rounded-md border bg-muted/20 p-2">
                    <p className="text-muted-foreground text-[11px]">
                      3-month average
                    </p>
                    <p className="text-sm font-semibold">
                      {formatNumber(rollingThreeMonthAverage)}
                    </p>
                  </div>
                </div>
                <div className="rounded-md border bg-muted/20 p-2">
                  <TrendSparkline
                    values={monthlySeries.map((point) => point.value)}
                    className="text-primary h-14 w-full"
                  />
                </div>
                <div className="space-y-1">
                  {monthlySeries.map((point) => (
                    <div
                      key={point.key}
                      className="grid grid-cols-[70px_minmax(0,1fr)_52px] items-center gap-2"
                    >
                      <span className="text-muted-foreground text-[11px]">
                        {point.label}
                      </span>
                      <div className="h-2 rounded-full bg-muted/60">
                        <div
                          className="bg-primary h-2 rounded-full"
                          style={{
                            width: `${Math.max(
                              6,
                              Math.round((point.value / maxMonthlyValue) * 100),
                            )}%`,
                          }}
                        />
                      </div>
                      <span className="text-right text-xs font-medium">
                        {formatNumber(point.value)}
                      </span>
                    </div>
                  ))}
                </div>
                <p className="text-muted-foreground text-[11px]">
                  Peak month: {peakMonthlyPoint.label} with{" "}
                  {formatNumber(peakMonthlyPoint.value)} commits
                </p>
              </div>
            ) : (
              <p className="text-muted-foreground text-sm">
                Historical commit data was not present in git analysis.
              </p>
            )}

            <div className="grid gap-2 sm:grid-cols-2">
              <div className="rounded-md border bg-muted/20 p-2">
                <p className="text-muted-foreground inline-flex items-center gap-1 text-[11px]">
                  <CalendarClock className="size-3.5" />
                  Weekday pattern
                </p>
                <ComparativeBars
                  bars={weekdayBars.map((bar) => ({
                    key: bar.key,
                    label: bar.label,
                    value: bar.value,
                  }))}
                />
              </div>
              <div className="rounded-md border bg-muted/20 p-2">
                <p className="text-muted-foreground inline-flex items-center gap-1 text-[11px]">
                  <Clock3 className="size-3.5" />
                  Commit hour highlights
                </p>
                <ComparativeBars
                  bars={hourlyHighlights.map((bar) => ({
                    key: bar.key,
                    label: `${bar.label}:00`,
                    value: bar.value,
                  }))}
                />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="inline-flex items-center gap-1 text-base">
              <FileCode2 className="size-4" />
              Codebase change map
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <DeltaSplit
              additions={project.trends.additionsLast30Days}
              deletions={project.trends.deletionsLast30Days}
            />
            <div className="rounded-md border bg-muted/20 p-2">
              <p className="text-muted-foreground text-[11px]">
                Top changed file types
              </p>
              {topFileTypes.length > 0 ? (
                <ComparativeBars bars={topFileTypes} />
              ) : (
                <p className="text-muted-foreground mt-2 text-xs">
                  No file-type history available.
                </p>
              )}
            </div>
            <div className="rounded-md border bg-muted/20 p-2">
              <p className="text-muted-foreground text-[11px]">
                Top changed directories
              </p>
              {topDirectories.length > 0 ? (
                <ComparativeBars bars={topDirectories} />
              ) : (
                <p className="text-muted-foreground mt-2 text-xs">
                  No directory-level change history available.
                </p>
              )}
            </div>
            <div className="grid grid-cols-2 gap-2">
              <div className="rounded-md border bg-muted/20 p-2">
                <p className="text-muted-foreground text-[11px]">
                  React components
                </p>
                <p className="mt-1 text-base font-semibold">
                  {formatNumber(model.pathInsights.reactComponents)}
                </p>
              </div>
              <div className="rounded-md border bg-muted/20 p-2">
                <p className="text-muted-foreground text-[11px]">
                  Hooks touched
                </p>
                <p className="mt-1 text-base font-semibold">
                  {formatNumber(model.pathInsights.reactHooks)}
                </p>
              </div>
            </div>
            <div className="grid grid-cols-3 gap-2">
              <div className="rounded-md border bg-muted/20 p-2">
                <p className="text-muted-foreground inline-flex items-center gap-1 text-[11px]">
                  <Timer className="size-3.5" />
                  Repo age
                </p>
                <p className="mt-1 text-sm font-semibold">
                  {repositoryAgeYears}y
                </p>
              </div>
              <div className="rounded-md border bg-muted/20 p-2">
                <p className="text-muted-foreground inline-flex items-center gap-1 text-[11px]">
                  <Star className="size-3.5" />
                  Reach
                </p>
                <p className="mt-1 text-sm font-semibold">
                  {formatCompactNumber(project.metadata.stars)}
                </p>
              </div>
              <div className="rounded-md border bg-muted/20 p-2">
                <p className="text-muted-foreground inline-flex items-center gap-1 text-[11px]">
                  <GitBranch className="size-3.5" />
                  Packages
                </p>
                <p className="mt-1 text-sm font-semibold">
                  {formatNumber(project.repo.workspacePackageCount)}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

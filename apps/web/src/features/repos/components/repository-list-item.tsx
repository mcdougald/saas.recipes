import {
  ArrowUpRight,
  BookOpenCheck,
  Clock3,
  GitCommitHorizontal,
  GitFork,
  GitMerge,
  GitPullRequest,
  Globe,
  Package,
  Scale,
  ShieldCheck,
  Star,
  Users,
} from "lucide-react";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import {
  type RepositoryDashboardListItem,
  type RepositoryStatus,
} from "@/features/repos/types";
import { cn } from "@/lib/utils";

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

const statusStyles: Record<RepositoryStatus, string> = {
  active: "",
  paused: "",
  archived:
    "border-slate-500/40 bg-slate-500/10 text-slate-700 dark:text-slate-300",
};

/** Formats integer counts for compact, locale-aware display. */
function formatNumber(value: number): string {
  return numberFormatter.format(value);
}

/** Formats large counts using compact notation for dense dashboard cards. */
function formatCompactNumber(value: number): string {
  return compactNumberFormatter.format(value);
}

/** Converts an ISO date string into a short US date label. */
function formatDate(value: string): string {
  return dateFormatter.format(new Date(value));
}

/** Rounds a numeric value into a whole-number percentage string. */
function formatPercent(value: number): string {
  return `${Math.round(value)}%`;
}

/** Calculates merged PR percentage from aggregate pull request counts. */
function getMergeRate(project: RepositoryDashboardListItem): number {
  if (project.repo.totalPullRequests === 0) {
    return 0;
  }

  return Math.round(
    (project.repo.mergedPullRequests / project.repo.totalPullRequests) * 100,
  );
}

/** Calculates issue closure percentage from total and closed issues. */
function getIssueClosureRate(project: RepositoryDashboardListItem): number {
  if (project.repo.totalIssues === 0) {
    return 0;
  }

  return Math.round(
    (project.repo.closedIssues / project.repo.totalIssues) * 100,
  );
}

/** Computes full days since the provided ISO timestamp. */
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

/** Builds the canonical GitHub repository URL from owner and repo name. */
function getRepoUrl(project: RepositoryDashboardListItem): string {
  return `https://github.com/${project.repo.owner}/${project.repo.name}`;
}

/** Resolves the owner's public GitHub avatar URL. */
function getOwnerAvatarUrl(project: RepositoryDashboardListItem): string {
  return `https://github.com/${project.repo.owner}.png?size=80`;
}

/** Creates a two-character fallback identity from a project name. */
function getInitials(name: string): string {
  return name
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part.charAt(0).toUpperCase())
    .join("");
}

type RepositoryListItemProps = {
  /** A single repository-backed dashboard item with repo health metrics. */
  project: RepositoryDashboardListItem;
};

/**
 * Render a high-signal repository card with grouped health and adoption signals.
 *
 * @param project - Repository-backed dashboard item to summarize.
 * @returns A dense repository summary card with grouped signals and metadata.
 */
export function RepositoryListItem({ project }: RepositoryListItemProps) {
  const mergeRate = getMergeRate(project);
  const issueClosureRate = getIssueClosureRate(project);
  const deploymentSuccessRate = project.repo.deployments?.successRate ?? 0;
  const deploymentCount = project.repo.deployments?.totalCount ?? 0;
  const visibility = project.metadata.visibility ?? "public";
  const packageManager =
    project.repo.packageManager ?? project.repo.packageJson?.packageManager;
  const normalizedPackageManager =
    packageManager?.split("@")[0] || packageManager || "Not detected";
  const isArchived = project.status === "archived";
  const pushedDaysAgo = getDaysSince(project.repo.pushed_at);
  const description =
    project.description?.trim() ||
    "No public repository description is available yet.";
  const activityToneClassName =
    pushedDaysAgo <= 7
      ? "bg-emerald-500/10 text-emerald-700 dark:text-emerald-300"
      : pushedDaysAgo <= 30
        ? "bg-amber-500/10 text-amber-700 dark:text-amber-300"
        : "bg-rose-500/10 text-rose-700 dark:text-rose-300";

  return (
    <article className="group relative overflow-hidden rounded-lg border bg-card p-3 shadow-xs transition-all hover:-translate-y-0.5 hover:shadow-md [content-visibility:auto] lg:p-4">
      <div className="pointer-events-none absolute inset-x-0 top-0 h-16 bg-linear-to-r from-primary/12 via-primary/5 to-transparent opacity-80" />

      <div className="relative flex flex-col gap-3 xl:flex-row xl:items-start xl:justify-between">
        <div className="min-w-0 flex-1 space-y-3">
          <div className="flex min-w-0 items-start gap-3">
            <Avatar className="mt-0.5 size-10 border">
              <AvatarImage
                src={getOwnerAvatarUrl(project)}
                alt={project.name}
              />
              <AvatarFallback>{getInitials(project.name)}</AvatarFallback>
            </Avatar>

            <div className="min-w-0 flex-1 space-y-2">
              <div className="flex flex-wrap items-center gap-1.5">
                <h3 className="min-w-0 text-sm font-semibold tracking-tight sm:text-base">
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
                  <Clock3 className="mr-1 size-3" />
                  {pushedDaysAgo === 0
                    ? "Updated today"
                    : `${pushedDaysAgo}d ago`}
                </Badge>
                <Badge variant="secondary" className="h-5 px-1.5 text-[10px]">
                  <Package className="mr-1 size-3" />
                  {normalizedPackageManager}
                </Badge>
              </div>

              <div className="text-muted-foreground flex flex-wrap items-center gap-x-3 gap-y-1 text-[11px]">
                <p className="inline-flex items-center gap-1">
                  <Clock3 className="size-3" />
                  Synced {formatDate(project.metadata.lastSyncedAt)}
                </p>
                <p className="inline-flex items-center gap-1">
                  <Clock3 className="size-3" />
                  Pushed {formatDate(project.repo.pushed_at)}
                </p>
              </div>
            </div>
          </div>

          <section className="rounded-md border bg-muted/20 px-3 py-2.5">
            <p className="text-muted-foreground text-[10px] font-semibold uppercase tracking-[0.08em]">
              What it does
            </p>
            <p className="mt-1.5 max-w-3xl text-sm leading-6 text-foreground/90">
              {description}
            </p>
          </section>
        </div>

        <div className="flex shrink-0 flex-wrap items-center gap-1.5 xl:justify-end">
          <Button
            variant="outline"
            size="sm"
            className="h-8 px-2.5 text-xs"
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
            className="h-8 px-2.5 text-xs"
            asChild
          >
            <a href={getRepoUrl(project)} target="_blank" rel="noreferrer">
              Open repo
              <ArrowUpRight className="size-3" />
            </a>
          </Button>
        </div>
      </div>

      <div className="relative mt-3 grid gap-2.5 xl:grid-cols-[minmax(0,1.6fr)_minmax(0,1fr)]">
        <section className="rounded-md border bg-muted/20 p-3">
          <p className="text-muted-foreground text-[11px] font-medium">
            Signals and trends
          </p>

          <div className="mt-2 grid gap-2 lg:grid-cols-3">
            <div className="rounded-md border bg-background/80 p-2.5">
              <p className="inline-flex items-center gap-1 text-[11px] font-medium">
                <Star className="text-muted-foreground size-3.5" />
                Reach
              </p>
              <dl className="mt-2 grid gap-1.5">
                <div className="flex items-center justify-between gap-3 rounded-sm border bg-muted/20 px-2 py-1.5">
                  <dt className="text-muted-foreground text-[10px]">Stars</dt>
                  <dd className="text-xs font-semibold">
                    {formatCompactNumber(project.metadata.stars)}
                  </dd>
                </div>
                <div className="flex items-center justify-between gap-3 rounded-sm border bg-muted/20 px-2 py-1.5">
                  <dt className="text-muted-foreground text-[10px]">Forks</dt>
                  <dd className="text-xs font-semibold">
                    {formatCompactNumber(project.metadata.forks)}
                  </dd>
                </div>
                <div className="flex items-center justify-between gap-3 rounded-sm border bg-muted/20 px-2 py-1.5">
                  <dt className="text-muted-foreground text-[10px]">
                    Watchers
                  </dt>
                  <dd className="text-xs font-semibold">
                    {formatCompactNumber(project.metadata.watchers)}
                  </dd>
                </div>
              </dl>
            </div>

            <div className="rounded-md border bg-background/80 p-2.5">
              <p className="inline-flex items-center gap-1 text-[11px] font-medium">
                <Users className="text-muted-foreground size-3.5" />
                Collaboration
              </p>
              <dl className="mt-2 grid gap-1.5">
                <div className="flex items-center justify-between gap-3 rounded-sm border bg-muted/20 px-2 py-1.5">
                  <dt className="text-muted-foreground text-[10px]">
                    Contributors
                  </dt>
                  <dd className="text-xs font-semibold">
                    {formatNumber(project.repo.contributor_count)}
                  </dd>
                </div>
                <div className="flex items-center justify-between gap-3 rounded-sm border bg-muted/20 px-2 py-1.5">
                  <dt className="text-muted-foreground text-[10px]">
                    Open PRs
                  </dt>
                  <dd className="text-xs font-semibold">
                    {formatNumber(project.repo.openPullRequests)}
                  </dd>
                </div>
                <div className="flex items-center justify-between gap-3 rounded-sm border bg-muted/20 px-2 py-1.5">
                  <dt className="text-muted-foreground text-[10px]">
                    Open issues
                  </dt>
                  <dd className="text-xs font-semibold">
                    {formatNumber(project.metadata.openIssues)}
                  </dd>
                </div>
                <div className="flex items-center justify-between gap-3 rounded-sm border bg-muted/20 px-2 py-1.5">
                  <dt className="text-muted-foreground text-[10px]">Commits</dt>
                  <dd className="text-xs font-semibold">
                    {formatCompactNumber(project.repo.commit_count)}
                  </dd>
                </div>
              </dl>
            </div>

            <div className="rounded-md border bg-background/80 p-2.5">
              <p className="inline-flex items-center gap-1 text-[11px] font-medium">
                <GitMerge className="text-muted-foreground size-3.5" />
                Delivery
              </p>
              <div className="mt-2 grid gap-2">
                <div className="rounded-sm border bg-muted/20 px-2 py-2">
                  <div className="mb-1 flex items-center justify-between gap-3 text-[11px]">
                    <p className="text-muted-foreground inline-flex items-center gap-1">
                      <GitMerge className="size-3" />
                      Merge rate
                    </p>
                    <span className="font-medium">{mergeRate}%</span>
                  </div>
                  <Progress value={mergeRate} className="h-1.5" />
                </div>

                <div className="rounded-sm border bg-muted/20 px-2 py-2">
                  <div className="mb-1 flex items-center justify-between gap-3 text-[11px]">
                    <p className="text-muted-foreground inline-flex items-center gap-1">
                      <BookOpenCheck className="size-3" />
                      Issue closure
                    </p>
                    <span className="font-medium">{issueClosureRate}%</span>
                  </div>
                  <Progress
                    value={issueClosureRate}
                    className="h-1.5 bg-muted **:data-[slot=progress-indicator]:bg-primary/80"
                  />
                </div>

                <div className="rounded-sm border bg-muted/20 px-2 py-2">
                  <div className="mb-1 flex items-center justify-between gap-3 text-[11px]">
                    <p className="text-muted-foreground inline-flex items-center gap-1">
                      <Globe className="size-3" />
                      Deployment success
                    </p>
                    <span className="font-medium">
                      {deploymentCount > 0
                        ? `${formatPercent(deploymentSuccessRate)} (${deploymentCount})`
                        : "No deploys"}
                    </span>
                  </div>
                  <Progress
                    value={deploymentCount > 0 ? deploymentSuccessRate : 0}
                    className="h-1.5 bg-muted **:data-[slot=progress-indicator]:bg-primary/80"
                  />
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="rounded-md border bg-background/80 p-3">
          <p className="text-muted-foreground text-[11px] font-medium">
            Repository context
          </p>

          <div className="mt-2 grid gap-1.5 sm:grid-cols-2">
            <div className="rounded-md border bg-muted/30 px-2 py-1.5">
              <p className="text-muted-foreground text-[10px]">Language</p>
              <p className="text-xs font-medium">
                {project.metadata.language || "Unknown"}
              </p>
            </div>
            <div className="rounded-md border bg-muted/30 px-2 py-1.5">
              <p className="text-muted-foreground text-[10px]">License</p>
              <p className="text-xs font-medium">
                {project.license ?? "Unknown"}
              </p>
            </div>
            <div className="rounded-md border bg-muted/30 px-2 py-1.5">
              <p className="text-muted-foreground text-[10px]">
                Default branch
              </p>
              <p className="text-xs font-medium">
                {project.repo.default_branch}
              </p>
            </div>
            <div className="rounded-md border bg-muted/30 px-2 py-1.5">
              <p className="text-muted-foreground text-[10px]">
                Package manager
              </p>
              <p className="text-xs font-medium">{normalizedPackageManager}</p>
            </div>
            <div className="rounded-md border bg-muted/30 px-2 py-1.5">
              <p className="text-muted-foreground inline-flex items-center gap-1 text-[10px]">
                <GitCommitHorizontal className="size-3" />
                Commits
              </p>
              <p className="text-xs font-medium">
                {formatCompactNumber(project.repo.commit_count)}
              </p>
            </div>
            <div className="rounded-md border bg-muted/30 px-2 py-1.5">
              <p className="text-muted-foreground inline-flex items-center gap-1 text-[10px]">
                <Scale className="size-3" />
                Size
              </p>
              <p className="text-xs font-medium">
                {formatCompactNumber(project.metadata.size)} KB
              </p>
            </div>
          </div>

          {project.repo.topics.length > 0 ? (
            <div className="mt-2.5 flex flex-wrap gap-1.5">
              {project.repo.topics.slice(0, 5).map((topic) => (
                <Badge
                  key={topic}
                  variant="outline"
                  className="h-5 px-1.5 text-[10px]"
                >
                  #{topic}
                </Badge>
              ))}
            </div>
          ) : null}
        </section>
      </div>
    </article>
  );
}

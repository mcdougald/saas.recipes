import {
  ArrowUpRight,
  Clock3,
  GitFork,
  GitPullRequest,
  Globe,
  HardDrive,
  Package,
  ShieldCheck,
  Sparkles,
  Star,
  Users,
  Workflow,
} from "lucide-react";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";
import type {
  RepositoryDashboardListItem,
  RepositoryStatus,
} from "@/features/repos/types";

const numberFormatter = new Intl.NumberFormat("en-US", {
  maximumFractionDigits: 0,
});

const dateFormatter = new Intl.DateTimeFormat("en-US", {
  month: "short",
  day: "numeric",
  year: "numeric",
});

const statusStyles: Record<RepositoryStatus, string> = {
  active: "",
  paused: "",
  archived: "border-slate-500/40 bg-slate-500/10 text-slate-700 dark:text-slate-300",
};

/** Formats integer counts for compact, locale-aware display. */
function formatNumber(value: number): string {
  return numberFormatter.format(value);
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

  return Math.round((project.repo.mergedPullRequests / project.repo.totalPullRequests) * 100);
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
 * Renders a high-signal repository card with activity, quality, and metadata chips.
 *
 * Intentionally hides the active/paused operational badge to keep the surface
 * focused on repository signals rather than internal workflow state.
 */
export function RepositoryListItem({ project }: RepositoryListItemProps) {
  const mergeRate = getMergeRate(project);
  const deploymentSuccessRate = project.repo.deployments?.successRate ?? 0;
  const deploymentCount = project.repo.deployments?.totalCount ?? 0;
  const visibility = project.metadata.visibility ?? "public";
  const packageManager = project.repo.packageManager ?? project.repo.packageJson?.packageManager;
  const isArchived = project.status === "archived";

  return (
    <article className="group relative overflow-hidden rounded-xl border bg-card p-3 transition-all hover:-translate-y-0.5 hover:shadow-sm lg:p-4">
      <div className="pointer-events-none absolute inset-x-0 top-0 h-14 bg-linear-to-r from-primary/10 via-primary/5 to-transparent opacity-50" />

      <div className="relative flex flex-wrap items-start justify-between gap-2.5">
        <div className="flex min-w-0 items-start gap-2.5">
          <Avatar className="mt-0.5 size-9 border">
            <AvatarImage src={getOwnerAvatarUrl(project)} alt={project.name} />
            <AvatarFallback>{getInitials(project.name)}</AvatarFallback>
          </Avatar>

          <div className="space-y-1.5">
            <div className="flex flex-wrap items-center gap-1.5">
              <h3 className="text-sm font-semibold tracking-tight sm:text-base">
                {project.repo.owner}/{project.repo.name}
              </h3>
              <Badge variant="outline" className="h-5 px-1.5 text-[10px] capitalize">
                {project.sourceType}
              </Badge>
              {isArchived ? (
                <Badge
                  variant="outline"
                  className={cn("h-5 px-1.5 text-[10px] capitalize", statusStyles[project.status])}
                >
                  archived
                </Badge>
              ) : null}
              <Badge variant="secondary" className="h-5 px-1.5 text-[10px] capitalize">
                <ShieldCheck className="mr-1 size-3" />
                {visibility}
              </Badge>
              {packageManager ? (
                <Badge variant="secondary" className="h-5 px-1.5 text-[10px]">
                  <Package className="mr-1 size-3" />
                  {packageManager}
                </Badge>
              ) : null}
            </div>

            <p className="text-muted-foreground max-w-2xl text-xs leading-relaxed sm:text-sm">
              {project.description}
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-1.5">
          <Badge variant="secondary" className="h-6 px-2 text-[11px] font-medium">
            <Sparkles className="mr-1 size-3" />
            Inspiration {project.inspirationScore}
          </Badge>
          <Button variant="outline" size="sm" className="h-7 px-2 text-xs" asChild>
            <a href={project.url} target="_blank" rel="noreferrer">
              Visit app
              <ArrowUpRight className="size-3" />
            </a>
          </Button>
          <Button variant="outline" size="sm" className="h-7 px-2 text-xs" asChild>
            <a href={getRepoUrl(project)} target="_blank" rel="noreferrer">
              Open repo
              <ArrowUpRight className="size-3" />
            </a>
          </Button>
        </div>
      </div>

      <div className="relative mt-3 grid gap-1.5 sm:grid-cols-3 lg:grid-cols-6">
        <div className="bg-muted/40 rounded-md border px-2 py-1.5">
          <p className="text-muted-foreground inline-flex items-center gap-1 text-[10px]">
            <Star className="size-3.5" />
            Stars
          </p>
          <p className="text-sm font-semibold">{formatNumber(project.metadata.stars)}</p>
        </div>
        <div className="bg-muted/40 rounded-md border px-2 py-1.5">
          <p className="text-muted-foreground inline-flex items-center gap-1 text-[10px]">
            <GitFork className="size-3.5" />
            Forks
          </p>
          <p className="text-sm font-semibold">{formatNumber(project.metadata.forks)}</p>
        </div>
        <div className="bg-muted/40 rounded-md border px-2 py-1.5">
          <p className="text-muted-foreground inline-flex items-center gap-1 text-[10px]">
            <Users className="size-3.5" />
            Contributors
          </p>
          <p className="text-sm font-semibold">
            {formatNumber(project.repo.contributor_count)}
          </p>
        </div>
        <div className="bg-muted/40 rounded-md border px-2 py-1.5">
          <p className="text-muted-foreground inline-flex items-center gap-1 text-[10px]">
            <GitPullRequest className="size-3.5" />
            Open PRs
          </p>
          <p className="text-sm font-semibold">
            {formatNumber(project.repo.openPullRequests)}
          </p>
        </div>
        <div className="bg-muted/40 rounded-md border px-2 py-1.5">
          <p className="text-muted-foreground inline-flex items-center gap-1 text-[10px]">
            <Globe className="size-3.5" />
            Watchers
          </p>
          <p className="text-sm font-semibold">{formatNumber(project.metadata.watchers)}</p>
        </div>
        <div className="bg-muted/40 rounded-md border px-2 py-1.5">
          <p className="text-muted-foreground inline-flex items-center gap-1 text-[10px]">
            <HardDrive className="size-3.5" />
            Size
          </p>
          <p className="text-sm font-semibold">{formatNumber(project.metadata.size)} KB</p>
        </div>
      </div>

      <div className="relative mt-3 grid gap-1.5 lg:grid-cols-2">
        <div className="rounded-md border bg-muted/20 px-2 py-1.5">
          <div className="mb-1 flex items-center justify-between text-[11px]">
            <p className="text-muted-foreground inline-flex items-center gap-1">
              <Sparkles className="size-3" />
              Merge rate
            </p>
            <span className="font-medium">{mergeRate}%</span>
          </div>
          <Progress value={mergeRate} className="h-1.5" />
        </div>

        <div className="rounded-md border bg-emerald-500/8 px-2 py-1.5">
          <div className="mb-1 flex items-center justify-between text-[11px]">
            <p className="text-muted-foreground inline-flex items-center gap-1">
              <Workflow className="size-3" />
              Deployment success
            </p>
            <span className="font-medium">
              {formatPercent(deploymentSuccessRate)} ({deploymentCount})
            </span>
          </div>
          <Progress
            value={deploymentSuccessRate}
            className="h-1.5 bg-emerald-500/20 **:data-[slot=progress-indicator]:bg-emerald-500"
          />
        </div>
      </div>

      <div className="text-muted-foreground relative mt-2 flex flex-wrap items-center gap-2 text-[11px]">
        <p className="inline-flex items-center gap-1">
          <Clock3 className="size-3" />
          Synced {formatDate(project.metadata.lastSyncedAt)}
        </p>
        <p className="inline-flex items-center gap-1">
          <Clock3 className="size-3" />
          Pushed {formatDate(project.repo.pushed_at)}
        </p>
      </div>

      <div className="relative mt-2.5 flex flex-wrap gap-1.5">
        <Badge variant="outline" className="h-5 px-1.5 text-[10px]">
          {project.metadata.language}
        </Badge>
        <Badge variant="outline" className="h-5 px-1.5 text-[10px]">
          License: {project.license ?? "Unknown"}
        </Badge>
        <Badge variant="outline" className="h-5 px-1.5 text-[10px]">
          Branch: {project.repo.default_branch}
        </Badge>
        <Badge variant="outline" className="h-5 px-1.5 text-[10px]">
          Commits: {formatNumber(project.repo.commit_count)}
        </Badge>
        <Badge variant="outline" className="h-5 px-1.5 text-[10px]">
          Open Issues: {formatNumber(project.metadata.openIssues)}
        </Badge>
        {project.repo.topics.slice(0, 4).map((topic) => (
          <Badge key={topic} variant="outline" className="h-5 px-1.5 text-[10px]">
            #{topic}
          </Badge>
        ))}
      </div>
    </article>
  );
}

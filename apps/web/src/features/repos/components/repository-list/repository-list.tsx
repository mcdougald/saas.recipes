"use client";

import {
  Activity,
  ArrowDownUp,
  FolderGit2,
  GitMerge,
  Rocket,
  Search,
  SlidersHorizontal,
  Users,
  X,
} from "lucide-react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import {
  useCallback,
  useDeferredValue,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  type RepositoryDashboardListItem,
  type RepositorySourceType,
  type RepositoryStatus,
  type RepositoryVisibility,
} from "@/features/repos/types";
import { RepositoryListItem } from "./repository-list-item";
import { ComparativeBars } from "./trend-visuals";

const compactNumberFormatter = new Intl.NumberFormat("en-US", {
  notation: "compact",
  maximumFractionDigits: 1,
});

/** Format large values for compact display chips. */
function formatCompactNumber(value: number): string {
  return compactNumberFormatter.format(value);
}

type RepositorySortKey =
  | "inspiration"
  | "stars"
  | "commits30"
  | "deployments30"
  | "stability"
  | "activity"
  | "updated";
type SortDirection = "asc" | "desc";
type StatusFilter = RepositoryStatus | "all";
type SourceFilter = RepositorySourceType | "all";
type VisibilityFilter = RepositoryVisibility | "all";

const DEFAULT_SORT_KEY: RepositorySortKey = "inspiration";
const DEFAULT_SORT_DIRECTION: SortDirection = "desc";
const PAGE_SIZE = 24;
const URL_PARAM_QUERY = "q";
const URL_PARAM_STATUS = "status";
const URL_PARAM_SOURCE = "source";
const URL_PARAM_VISIBILITY = "visibility";
const URL_PARAM_LANGUAGE = "language";
const URL_PARAM_SORT = "sort";
const URL_PARAM_DIRECTION = "dir";

/**
 * Resolve the sort key from URL state with fallback validation.
 *
 * @param value - Raw URL query value.
 * @returns Canonical repository sort key.
 */
function parseSortKey(value: string | null): RepositorySortKey {
  if (
    value === "inspiration" ||
    value === "stars" ||
    value === "commits30" ||
    value === "deployments30" ||
    value === "stability" ||
    value === "activity" ||
    value === "updated"
  ) {
    return value;
  }

  return DEFAULT_SORT_KEY;
}

/**
 * Resolve sort direction from URL state with fallback validation.
 *
 * @param value - Raw URL query value.
 * @returns Canonical ascending or descending direction.
 */
function parseSortDirection(value: string | null): SortDirection {
  return value === "asc" || value === "desc" ? value : DEFAULT_SORT_DIRECTION;
}

/**
 * Resolve repository status filter from URL state.
 *
 * @param value - Raw URL query value.
 * @returns Valid status filter or `all`.
 */
function parseStatusFilter(value: string | null): StatusFilter {
  if (value === "active" || value === "paused" || value === "archived") {
    return value;
  }

  return "all";
}

/**
 * Resolve repository source-type filter from URL state.
 *
 * @param value - Raw URL query value.
 * @returns Valid source filter or `all`.
 */
function parseSourceFilter(value: string | null): SourceFilter {
  if (value === "template" || value === "reference" || value === "starter") {
    return value;
  }

  return "all";
}

/**
 * Resolve repository visibility filter from URL state.
 *
 * @param value - Raw URL query value.
 * @returns Valid visibility filter or `all`.
 */
function parseVisibilityFilter(value: string | null): VisibilityFilter {
  if (value === "public" || value === "private" || value === "internal") {
    return value;
  }

  return "all";
}

type RepositoryListProps = {
  /** Repository projections visible in the dashboard list. */
  projects: RepositoryDashboardListItem[];
};

/**
 * Render all tracked repository cards with aggregate trend visuals.
 *
 * @param projects - Repository projections sorted for display.
 * @returns Dashboard section containing aggregate and per-repo data.
 */
export function RepositoryList({ projects }: RepositoryListProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const sentinelRef = useRef<HTMLDivElement | null>(null);
  const statusFilter = parseStatusFilter(searchParams.get(URL_PARAM_STATUS));
  const sourceFilter = parseSourceFilter(searchParams.get(URL_PARAM_SOURCE));
  const visibilityFilter = parseVisibilityFilter(
    searchParams.get(URL_PARAM_VISIBILITY),
  );
  const languageFilter = searchParams.get(URL_PARAM_LANGUAGE) ?? "all";
  const sortKey = parseSortKey(searchParams.get(URL_PARAM_SORT));
  const sortDirection = parseSortDirection(
    searchParams.get(URL_PARAM_DIRECTION),
  );
  const [searchInput, setSearchInput] = useState(
    searchParams.get(URL_PARAM_QUERY) ?? "",
  );
  const deferredSearchInput = useDeferredValue(
    searchInput.trim().toLowerCase(),
  );
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);

  const languageOptions = useMemo(() => {
    const counts = new Map<string, number>();
    for (const project of projects) {
      const language = project.metadata.language?.trim();
      if (!language) {
        continue;
      }
      counts.set(language, (counts.get(language) ?? 0) + 1);
    }

    return [...counts.entries()]
      .toSorted((a, b) => {
        if (b[1] === a[1]) {
          return a[0].localeCompare(b[0]);
        }
        return b[1] - a[1];
      })
      .slice(0, 24)
      .map(([language]) => language);
  }, [projects]);

  const updateUrlState = useCallback(
    (updates: Record<string, string | null>) => {
      const currentSearch = window.location.search.startsWith("?")
        ? window.location.search.slice(1)
        : window.location.search;
      const params = new URLSearchParams(currentSearch);

      for (const [key, value] of Object.entries(updates)) {
        if (value && value.length > 0 && value !== "all") {
          params.set(key, value);
        } else {
          params.delete(key);
        }
      }

      const nextSearch = params.toString();
      if (nextSearch === currentSearch) {
        return;
      }

      const nextUrl = nextSearch ? `${pathname}?${nextSearch}` : pathname;
      router.replace(nextUrl, { scroll: false });
    },
    [pathname, router],
  );

  useEffect(() => {
    setSearchInput(searchParams.get(URL_PARAM_QUERY) ?? "");
    setVisibleCount(PAGE_SIZE);
  }, [searchParams]);

  useEffect(() => {
    const timeoutId = window.setTimeout(() => {
      updateUrlState({
        [URL_PARAM_QUERY]:
          deferredSearchInput.length > 0 ? deferredSearchInput : null,
      });
    }, 200);

    return () => {
      window.clearTimeout(timeoutId);
    };
  }, [deferredSearchInput, updateUrlState]);

  const filteredProjects = useMemo(() => {
    return projects.filter((project) => {
      if (statusFilter !== "all" && project.status !== statusFilter) {
        return false;
      }
      if (sourceFilter !== "all" && project.sourceType !== sourceFilter) {
        return false;
      }
      if (
        visibilityFilter !== "all" &&
        project.metadata.visibility !== visibilityFilter
      ) {
        return false;
      }
      if (
        languageFilter !== "all" &&
        project.metadata.language.toLowerCase() !== languageFilter.toLowerCase()
      ) {
        return false;
      }

      if (deferredSearchInput.length === 0) {
        return true;
      }

      const searchableText = [
        project.name,
        project.description,
        project.repo.owner,
        project.repo.name,
        project.metadata.language,
        project.sourceType,
        ...project.repo.topics,
      ]
        .join(" ")
        .toLowerCase();

      return searchableText.includes(deferredSearchInput);
    });
  }, [
    deferredSearchInput,
    languageFilter,
    projects,
    sourceFilter,
    statusFilter,
    visibilityFilter,
  ]);

  const orderedProjects = useMemo(() => {
    const directionMultiplier = sortDirection === "asc" ? 1 : -1;

    const getSortValue = (project: RepositoryDashboardListItem): number => {
      if (sortKey === "stars") {
        return project.metadata.stars;
      }
      if (sortKey === "commits30") {
        return project.trends.commitsLast30Days;
      }
      if (sortKey === "deployments30") {
        return project.trends.deploymentsLast30Days ?? 0;
      }
      if (sortKey === "stability") {
        return project.trends.stabilityScore;
      }
      if (sortKey === "activity") {
        return project.trends.activityScore;
      }
      if (sortKey === "updated") {
        const timestamp = Date.parse(project.repo.pushed_at);
        return Number.isNaN(timestamp) ? 0 : timestamp;
      }

      return project.inspirationScore;
    };

    return filteredProjects.toSorted((a, b) => {
      const aValue = getSortValue(a);
      const bValue = getSortValue(b);
      if (aValue === bValue) {
        return (
          directionMultiplier * (b.metadata.stars - a.metadata.stars) ||
          a.name.localeCompare(b.name)
        );
      }
      return directionMultiplier * (aValue - bValue);
    });
  }, [filteredProjects, sortDirection, sortKey]);

  const activeCount = filteredProjects.filter(
    (project) => project.status === "active",
  ).length;
  const pausedCount = filteredProjects.filter(
    (project) => project.status === "paused",
  ).length;
  const archivedCount = filteredProjects.filter(
    (project) => project.status === "archived",
  ).length;

  const totalCommits30Days = filteredProjects.reduce(
    (sum, project) => sum + project.trends.commitsLast30Days,
    0,
  );
  const totalDeployments30Days = filteredProjects.reduce(
    (sum, project) => sum + (project.trends.deploymentsLast30Days ?? 0),
    0,
  );
  const totalContributors = filteredProjects.reduce(
    (sum, project) => sum + project.repo.contributor_count,
    0,
  );
  const totalCodeChurn30Days = filteredProjects.reduce(
    (sum, project) => sum + project.trends.codeChurnLast30Days,
    0,
  );
  const totalPullRequests = filteredProjects.reduce(
    (sum, project) => sum + project.repo.totalPullRequests,
    0,
  );
  const totalMergedPullRequests = filteredProjects.reduce(
    (sum, project) => sum + project.repo.mergedPullRequests,
    0,
  );
  const averageMergeRate =
    totalPullRequests > 0
      ? Math.round((totalMergedPullRequests / totalPullRequests) * 100)
      : 0;

  const visibleProjects = orderedProjects.slice(0, visibleCount);
  const hasMore = visibleProjects.length < orderedProjects.length;

  useEffect(() => {
    if (!hasMore) {
      return;
    }
    const node = sentinelRef.current;
    if (!node) {
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        const isIntersecting = entries.some((entry) => entry.isIntersecting);
        if (!isIntersecting) {
          return;
        }
        setVisibleCount((current) =>
          Math.min(current + PAGE_SIZE, orderedProjects.length),
        );
      },
      { rootMargin: "700px 0px 700px 0px", threshold: 0.01 },
    );

    observer.observe(node);
    return () => {
      observer.disconnect();
    };
  }, [hasMore, orderedProjects.length]);

  return (
    <Card className="border-none bg-transparent py-3 shadow-none">
      <CardHeader className="space-y-3 p-0">
        <CardTitle>Tracked Repositories</CardTitle>
        <CardDescription>
          Curated repositories optimized for high-volume browsing with
          URL-synced filters, sorting, and infinite scrolling.
        </CardDescription>
        <div className="grid gap-2 md:grid-cols-2 xl:grid-cols-4">
          <div className="rounded-md border bg-card/60 p-3">
            <p className="text-muted-foreground inline-flex items-center gap-1 text-xs">
              <Activity className="size-3.5" />
              Commits (30d)
            </p>
            <p className="mt-1 text-xl font-semibold">
              {formatCompactNumber(totalCommits30Days)}
            </p>
          </div>
          <div className="rounded-md border bg-card/60 p-3">
            <p className="text-muted-foreground inline-flex items-center gap-1 text-xs">
              <Rocket className="size-3.5" />
              Deployments (30d)
            </p>
            <p className="mt-1 text-xl font-semibold">
              {formatCompactNumber(totalDeployments30Days)}
            </p>
          </div>
          <div className="rounded-md border bg-card/60 p-3">
            <p className="text-muted-foreground inline-flex items-center gap-1 text-xs">
              <Users className="size-3.5" />
              Contributors
            </p>
            <p className="mt-1 text-xl font-semibold">
              {formatCompactNumber(totalContributors)}
            </p>
          </div>
          <div className="rounded-md border bg-card/60 p-3">
            <p className="text-muted-foreground inline-flex items-center gap-1 text-xs">
              <GitMerge className="size-3.5" />
              Avg. merge rate
            </p>
            <p className="mt-1 text-xl font-semibold">{averageMergeRate}%</p>
          </div>
        </div>
        <div className="rounded-md border bg-card/40 p-2.5">
          <div className="grid gap-2 lg:grid-cols-[minmax(0,1.4fr)_repeat(5,minmax(0,1fr))]">
            <div className="relative">
              <Search className="text-muted-foreground pointer-events-none absolute top-2.5 left-2.5 size-4" />
              <Input
                value={searchInput}
                onChange={(event) => {
                  setSearchInput(event.target.value);
                }}
                placeholder="Search name, owner, topics, language..."
                className="h-9 pl-8"
                aria-label="Search repositories"
              />
            </div>

            <Select
              value={statusFilter}
              onValueChange={(value) => {
                updateUrlState({ [URL_PARAM_STATUS]: value });
              }}
            >
              <SelectTrigger className="h-9 w-full">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All statuses</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="paused">Paused</SelectItem>
                <SelectItem value="archived">Archived</SelectItem>
              </SelectContent>
            </Select>

            <Select
              value={sourceFilter}
              onValueChange={(value) => {
                updateUrlState({ [URL_PARAM_SOURCE]: value });
              }}
            >
              <SelectTrigger className="h-9 w-full">
                <SelectValue placeholder="Source" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All source types</SelectItem>
                <SelectItem value="template">Template</SelectItem>
                <SelectItem value="reference">Reference</SelectItem>
                <SelectItem value="starter">Starter</SelectItem>
              </SelectContent>
            </Select>

            <Select
              value={visibilityFilter}
              onValueChange={(value) => {
                updateUrlState({ [URL_PARAM_VISIBILITY]: value });
              }}
            >
              <SelectTrigger className="h-9 w-full">
                <SelectValue placeholder="Visibility" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All visibility</SelectItem>
                <SelectItem value="public">Public</SelectItem>
                <SelectItem value="private">Private</SelectItem>
                <SelectItem value="internal">Internal</SelectItem>
              </SelectContent>
            </Select>

            <Select
              value={languageFilter}
              onValueChange={(value) => {
                updateUrlState({ [URL_PARAM_LANGUAGE]: value });
              }}
            >
              <SelectTrigger className="h-9 w-full">
                <SelectValue placeholder="Language" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All languages</SelectItem>
                {languageOptions.map((language) => (
                  <SelectItem key={language} value={language}>
                    {language}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <div className="grid grid-cols-[minmax(0,1fr)_auto_auto] gap-2">
              <Select
                value={sortKey}
                onValueChange={(value) => {
                  updateUrlState({ [URL_PARAM_SORT]: value });
                }}
              >
                <SelectTrigger className="h-9 w-full">
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="inspiration">Inspiration score</SelectItem>
                  <SelectItem value="stars">Stars</SelectItem>
                  <SelectItem value="commits30">Commits (30d)</SelectItem>
                  <SelectItem value="deployments30">
                    Deployments (30d)
                  </SelectItem>
                  <SelectItem value="stability">Stability score</SelectItem>
                  <SelectItem value="activity">Activity score</SelectItem>
                  <SelectItem value="updated">Recently pushed</SelectItem>
                </SelectContent>
              </Select>
              <Button
                type="button"
                variant="outline"
                size="icon"
                className="h-9 w-9"
                onClick={() => {
                  updateUrlState({
                    [URL_PARAM_DIRECTION]:
                      sortDirection === "desc" ? "asc" : "desc",
                  });
                }}
                aria-label={`Toggle sort direction: currently ${sortDirection}`}
              >
                <ArrowDownUp className="size-4" />
              </Button>
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="h-9 w-9"
                onClick={() => {
                  setSearchInput("");
                  updateUrlState({
                    [URL_PARAM_QUERY]: null,
                    [URL_PARAM_STATUS]: null,
                    [URL_PARAM_SOURCE]: null,
                    [URL_PARAM_VISIBILITY]: null,
                    [URL_PARAM_LANGUAGE]: null,
                    [URL_PARAM_SORT]: null,
                    [URL_PARAM_DIRECTION]: null,
                  });
                }}
                aria-label="Reset all filters"
              >
                <X className="size-4" />
              </Button>
            </div>
          </div>
        </div>

        <div className="flex flex-wrap gap-2">
          <Badge variant="secondary">
            {orderedProjects.length} shown / {projects.length} total
          </Badge>
          <Badge variant="outline">{activeCount} active</Badge>
          <Badge variant="outline">{pausedCount} paused</Badge>
          <Badge variant="outline">{archivedCount} archived</Badge>
          <Badge variant="outline">
            <SlidersHorizontal className="mr-1 size-3.5" />
            {sortKey} ({sortDirection})
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="space-y-4 p-0">
        {visibleProjects.map((project) => (
          <RepositoryListItem key={project.id} project={project} />
        ))}
        <div ref={sentinelRef} className="h-2 w-full" aria-hidden="true" />
        {hasMore ? (
          <div className="text-muted-foreground rounded-md border border-dashed bg-muted/20 p-3 text-center text-xs">
            Loading more repositories... ({visibleProjects.length}/
            {orderedProjects.length})
          </div>
        ) : (
          <div className="text-muted-foreground rounded-md border border-dashed bg-muted/20 p-3 text-center text-xs">
            End of list ({orderedProjects.length} repositories loaded)
          </div>
        )}
      </CardContent>
    </Card>
  );
}

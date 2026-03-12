import {
  ArrowUpRight,
  Bot,
  GitCommitHorizontal,
  UserRound,
} from "lucide-react";
import { useMemo, useState } from "react";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { type RepositoryDashboardListItem } from "@/features/repos/types";
import {
  formatCompactNumber,
  formatDate,
  formatNumber,
  type RepositoryDetailModel,
} from "./repository-detail-utils";

type RepositoryDetailContributorsTabProps = {
  project: RepositoryDashboardListItem;
  model: RepositoryDetailModel;
};

function getInitials(name: string): string {
  return name
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part.charAt(0).toUpperCase())
    .join("");
}

/**
 * Render the contributors tab with activity-focused contributor rows.
 *
 * @param model - Normalized repository detail datasets.
 * @returns Contributor cards sorted by commit count.
 */
export function RepositoryDetailContributorsTab({
  project,
  model,
}: RepositoryDetailContributorsTabProps) {
  const [query, setQuery] = useState("");
  const [roleFilter, setRoleFilter] = useState<"all" | "human" | "bot">("all");
  const [sortBy, setSortBy] = useState<
    "commits" | "files" | "churn" | "recent"
  >("commits");
  const [sortOrder, setSortOrder] = useState<"desc" | "asc">("desc");
  const normalizedQuery = query.trim().toLowerCase();
  const filteredContributors = useMemo(() => {
    const roleFiltered = model.contributors.filter((contributor) => {
      if (roleFilter === "all") {
        return true;
      }
      if (roleFilter === "human") {
        return !contributor.isBot;
      }
      return contributor.isBot;
    });

    const textFiltered = roleFiltered.filter((contributor) => {
      if (!normalizedQuery) {
        return true;
      }
      return (
        contributor.name.toLowerCase().includes(normalizedQuery) ||
        contributor.username?.toLowerCase().includes(normalizedQuery) === true
      );
    });

    return textFiltered.toSorted((a, b) => {
      let delta = 0;
      if (sortBy === "files") {
        delta = a.filesChanged - b.filesChanged;
      } else if (sortBy === "churn") {
        delta = a.additions + a.deletions - (b.additions + b.deletions);
      } else if (sortBy === "recent") {
        const aDate = Date.parse(a.lastCommitAt ?? "");
        const bDate = Date.parse(b.lastCommitAt ?? "");
        delta =
          (Number.isNaN(aDate) ? 0 : aDate) - (Number.isNaN(bDate) ? 0 : bDate);
      } else {
        delta = a.commits - b.commits;
      }
      return sortOrder === "desc" ? -delta : delta;
    });
  }, [model.contributors, normalizedQuery, roleFilter, sortBy, sortOrder]);
  const topContributors = filteredContributors.slice(0, 80);
  const highestCommitCount = topContributors[0]?.commits ?? 1;
  const totalCommits = model.contributors.reduce(
    (sum, contributor) => sum + contributor.commits,
    0,
  );
  const totalChurn = model.contributors.reduce(
    (sum, contributor) => sum + contributor.additions + contributor.deletions,
    0,
  );
  const botCount = model.contributors.filter((row) => row.isBot).length;
  const avgFilesPerContributor =
    model.contributors.length > 0
      ? Math.round(
          model.contributors.reduce(
            (sum, contributor) => sum + contributor.filesChanged,
            0,
          ) / model.contributors.length,
        )
      : 0;

  if (model.contributors.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Contributors</CardTitle>
        </CardHeader>
        <CardContent className="text-muted-foreground text-sm">
          No contributor analytics are available in the current dataset.
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-2 lg:grid-cols-4">
        <Card>
          <CardContent className="space-y-1 p-3">
            <p className="text-muted-foreground text-xs">Contributors</p>
            <p className="text-xl font-semibold">{model.contributors.length}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="space-y-1 p-3">
            <p className="text-muted-foreground text-xs">Sampled commits</p>
            <p className="text-xl font-semibold">
              {formatCompactNumber(totalCommits)}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="space-y-1 p-3">
            <p className="text-muted-foreground text-xs">Line churn</p>
            <p className="text-xl font-semibold">
              {formatCompactNumber(totalChurn)}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="space-y-1 p-3">
            <p className="text-muted-foreground text-xs">Bot / avg files</p>
            <p className="text-xl font-semibold">
              {botCount} / {avgFilesPerContributor}
            </p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-base">
            Contributor activity matrix
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          <div className="grid gap-2 md:grid-cols-[minmax(0,1.2fr)_180px_180px_140px]">
            <Input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Filter by contributor name or @username"
              aria-label="Filter contributors"
            />
            <Select
              value={roleFilter}
              onValueChange={(value: string) =>
                setRoleFilter(value as "all" | "human" | "bot")
              }
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Role filter" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All contributors</SelectItem>
                <SelectItem value="human">Humans only</SelectItem>
                <SelectItem value="bot">Bots only</SelectItem>
              </SelectContent>
            </Select>
            <Select
              value={sortBy}
              onValueChange={(value: string) =>
                setSortBy(value as "commits" | "files" | "churn" | "recent")
              }
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="commits">Sort by commits</SelectItem>
                <SelectItem value="files">Sort by files touched</SelectItem>
                <SelectItem value="churn">Sort by churn</SelectItem>
                <SelectItem value="recent">Sort by recency</SelectItem>
              </SelectContent>
            </Select>
            <Select
              value={sortOrder}
              onValueChange={(value: string) =>
                setSortOrder(value as "desc" | "asc")
              }
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Sort direction" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="desc">Descending</SelectItem>
                <SelectItem value="asc">Ascending</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="text-muted-foreground grid grid-cols-[minmax(0,1.7fr)_90px_90px_110px_110px_120px] gap-2 px-2 text-[11px] font-medium">
            <span>Contributor</span>
            <span className="text-right">Commits</span>
            <span className="text-right">Files</span>
            <span className="text-right">Net lines</span>
            <span className="text-right">First seen</span>
            <span className="text-right">Last commit</span>
          </div>
          <ScrollArea className="max-h-136 rounded-md border">
            <div className="space-y-1.5 p-2 max-h-136 overflow-y-auto">
              {topContributors.map((contributor) => {
                const netLines = contributor.additions - contributor.deletions;
                const authorSearchQuery = contributor.username
                  ? `author:${contributor.username}`
                  : contributor.name;
                const contributorSearchUrl = `https://github.com/${project.repo.owner}/${project.repo.name}/search?q=${encodeURIComponent(
                  authorSearchQuery,
                )}&type=commits`;
                return (
                  <div
                    key={`${contributor.name}-${contributor.username ?? "user"}`}
                    className="space-y-1 rounded-md border bg-muted/20 px-2 py-2"
                  >
                    <div className="grid grid-cols-[minmax(0,1.7fr)_90px_90px_110px_110px_120px] items-center gap-2">
                      <div className="flex min-w-0 items-center gap-2">
                        <Avatar className="size-8 border">
                          <AvatarImage
                            src={contributor.avatarUrl ?? undefined}
                          />
                          <AvatarFallback>
                            {getInitials(contributor.name)}
                          </AvatarFallback>
                        </Avatar>
                        <div className="min-w-0">
                          <p className="truncate text-sm font-medium">
                            {contributor.name}
                          </p>
                          <p className="text-muted-foreground truncate text-xs">
                            {contributor.username
                              ? `@${contributor.username}`
                              : "unlinked identity"}
                          </p>
                        </div>
                        <div className="ml-auto flex items-center gap-1">
                          <a
                            href={contributorSearchUrl}
                            target="_blank"
                            rel="noreferrer"
                            className="text-muted-foreground hover:text-primary inline-flex items-center gap-0.5 rounded-sm border px-1.5 py-0.5 text-[10px]"
                          >
                            search
                            <ArrowUpRight className="size-3" />
                          </a>
                          {contributor.isBot ? (
                            <Badge
                              variant="secondary"
                              className="h-5 shrink-0 px-1.5 text-[10px]"
                            >
                              <Bot className="mr-1 size-3" />
                              bot
                            </Badge>
                          ) : (
                            <Badge
                              variant="outline"
                              className="h-5 shrink-0 px-1.5 text-[10px]"
                            >
                              <UserRound className="mr-1 size-3" />
                              human
                            </Badge>
                          )}
                        </div>
                      </div>
                      <p className="text-right text-sm font-medium">
                        {formatNumber(contributor.commits)}
                      </p>
                      <p className="text-right text-sm font-medium">
                        {formatNumber(contributor.filesChanged)}
                      </p>
                      <p
                        className={`text-right text-sm font-medium ${
                          netLines >= 0
                            ? "text-emerald-600 dark:text-emerald-400"
                            : "text-rose-600 dark:text-rose-400"
                        }`}
                      >
                        {netLines >= 0 ? "+" : ""}
                        {formatCompactNumber(netLines)}
                      </p>
                      <p className="text-muted-foreground text-right text-xs">
                        {formatDate(contributor.firstCommitAt)}
                      </p>
                      <p className="text-muted-foreground text-right text-xs">
                        {formatDate(contributor.lastCommitAt)}
                      </p>
                    </div>
                    <div className="bg-border/60 h-1 rounded-full">
                      <div
                        className="bg-primary h-1 rounded-full"
                        style={{
                          width: `${Math.max(
                            6,
                            Math.round(
                              (contributor.commits /
                                Math.max(1, highestCommitCount)) *
                                100,
                            ),
                          )}%`,
                        }}
                      />
                    </div>
                  </div>
                );
              })}
              {topContributors.length === 0 ? (
                <p className="text-muted-foreground p-2 text-sm">
                  No contributors matched the current filters.
                </p>
              ) : null}
            </div>
          </ScrollArea>
          <p className="text-muted-foreground inline-flex items-center gap-1 pt-1 text-[11px]">
            <GitCommitHorizontal className="size-3.5" />
            Showing {topContributors.length} of {filteredContributors.length}{" "}
            filtered contributors
          </p>
        </CardContent>
      </Card>
    </div>
  );
}

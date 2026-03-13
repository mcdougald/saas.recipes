import {
  type ColumnDef,
  flexRender,
  getCoreRowModel,
  getSortedRowModel,
  type SortingState,
  useReactTable,
} from "@tanstack/react-table";
import {
  ArrowDown,
  ArrowUp,
  ArrowUpDown,
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
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { type RepositoryDashboardListItem } from "@/features/repos/types";
import {
  formatCompactNumber,
  formatDate,
  formatNumber,
  type RepositoryDetailModel,
} from "../repository-detail-utils";

type RepositoryDetailContributorsTabProps = {
  project: RepositoryDashboardListItem;
  model: RepositoryDetailModel;
};

type ContributorRow = RepositoryDetailModel["contributors"][number];

type ContributorSortKey =
  | "commits"
  | "filesChanged"
  | "netLines"
  | "lastCommitAt";

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
 * @param project - Repository dashboard projection for contributor deep links.
 * @param model - Normalized repository detail datasets.
 * @returns Contributor table sorted by selected metric.
 */
export function RepositoryDetailContributorsTab({
  project,
  model,
}: RepositoryDetailContributorsTabProps) {
  const [query, setQuery] = useState("");
  const [roleFilter, setRoleFilter] = useState<"all" | "human" | "bot">("all");
  const [sorting, setSorting] = useState<SortingState>([
    { id: "commits", desc: true },
  ]);
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

    return roleFiltered.filter((contributor) => {
      if (!normalizedQuery) {
        return true;
      }
      return (
        contributor.name.toLowerCase().includes(normalizedQuery) ||
        contributor.username?.toLowerCase().includes(normalizedQuery) === true
      );
    });
  }, [model.contributors, normalizedQuery, roleFilter]);
  const topContributors = filteredContributors.slice(0, 80);
  const highestCommitCount = topContributors.reduce(
    (max, contributor) => Math.max(max, contributor.commits),
    1,
  );
  const activeSort = sorting[0];
  const sortBy =
    (activeSort?.id as ContributorSortKey | undefined) ?? "commits";
  const sortOrder = activeSort?.desc === false ? "asc" : "desc";
  const columns = useMemo<ColumnDef<ContributorRow>[]>(
    () => [
      {
        id: "contributor",
        header: "Contributor",
        cell: ({ row }) => {
          const contributor = row.original;
          const authorSearchQuery = contributor.username
            ? `author:${contributor.username}`
            : contributor.name;
          const contributorSearchUrl = `https://github.com/${project.repo.owner}/${project.repo.name}/search?q=${encodeURIComponent(
            authorSearchQuery,
          )}&type=commits`;

          return (
            <div className="flex min-w-0 items-center gap-2">
              <Avatar className="size-8 border">
                <AvatarImage src={contributor.avatarUrl ?? undefined} />
                <AvatarFallback>{getInitials(contributor.name)}</AvatarFallback>
              </Avatar>
              <div className="min-w-0">
                <p className="truncate text-sm font-medium">
                  {contributor.name}
                </p>
                <p className="text-muted-foreground truncate text-xs">
                  {contributor.username ? (
                    <a
                      href={`https://github.com/${contributor.username}`}
                      target="_blank"
                      rel="noreferrer"
                      className="hover:text-primary inline-flex items-center gap-0.5 transition-colors"
                    >
                      @{contributor.username}
                      <ArrowUpRight className="size-3" />
                    </a>
                  ) : (
                    "unlinked identity"
                  )}
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
          );
        },
      },
      {
        accessorKey: "commits",
        header: ({ column }) => (
          <button
            type="button"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            className="ml-auto inline-flex items-center gap-1 text-right hover:text-foreground"
          >
            Commits
            {column.getIsSorted() === "desc" ? (
              <ArrowDown className="size-3.5" />
            ) : column.getIsSorted() === "asc" ? (
              <ArrowUp className="size-3.5" />
            ) : (
              <ArrowUpDown className="size-3.5 opacity-60" />
            )}
          </button>
        ),
        cell: ({ row }) => {
          const commitCount = row.original.commits;
          return (
            <div className="space-y-1">
              <p className="text-right text-sm font-medium">
                {formatNumber(commitCount)}
              </p>
              <div className="bg-border/70 h-1 rounded-full">
                <div
                  className="bg-primary h-1 rounded-full"
                  style={{
                    width: `${Math.max(
                      6,
                      Math.round(
                        (commitCount / Math.max(1, highestCommitCount)) * 100,
                      ),
                    )}%`,
                  }}
                />
              </div>
            </div>
          );
        },
      },
      {
        accessorKey: "filesChanged",
        header: ({ column }) => (
          <button
            type="button"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            className="ml-auto inline-flex items-center gap-1 text-right hover:text-foreground"
          >
            Files
            {column.getIsSorted() === "desc" ? (
              <ArrowDown className="size-3.5" />
            ) : column.getIsSorted() === "asc" ? (
              <ArrowUp className="size-3.5" />
            ) : (
              <ArrowUpDown className="size-3.5 opacity-60" />
            )}
          </button>
        ),
        cell: ({ row }) => (
          <p className="text-right text-sm font-medium">
            {formatNumber(row.original.filesChanged)}
          </p>
        ),
      },
      {
        id: "netLines",
        accessorFn: (row) => row.additions - row.deletions,
        header: ({ column }) => (
          <button
            type="button"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            className="ml-auto inline-flex items-center gap-1 text-right hover:text-foreground"
          >
            Net lines
            {column.getIsSorted() === "desc" ? (
              <ArrowDown className="size-3.5" />
            ) : column.getIsSorted() === "asc" ? (
              <ArrowUp className="size-3.5" />
            ) : (
              <ArrowUpDown className="size-3.5 opacity-60" />
            )}
          </button>
        ),
        cell: ({ row }) => {
          const netLines = row.original.additions - row.original.deletions;
          return (
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
          );
        },
      },
      {
        id: "firstCommitAt",
        accessorFn: (row) => {
          const timestamp = Date.parse(row.firstCommitAt ?? "");
          return Number.isNaN(timestamp) ? 0 : timestamp;
        },
        header: ({ column }) => (
          <button
            type="button"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            className="ml-auto inline-flex items-center gap-1 text-right hover:text-foreground"
          >
            First seen
            {column.getIsSorted() === "desc" ? (
              <ArrowDown className="size-3.5" />
            ) : column.getIsSorted() === "asc" ? (
              <ArrowUp className="size-3.5" />
            ) : (
              <ArrowUpDown className="size-3.5 opacity-60" />
            )}
          </button>
        ),
        cell: ({ row }) => (
          <p className="text-muted-foreground text-right text-xs">
            {formatDate(row.original.firstCommitAt)}
          </p>
        ),
      },
      {
        id: "lastCommitAt",
        accessorFn: (row) => {
          const timestamp = Date.parse(row.lastCommitAt ?? "");
          return Number.isNaN(timestamp) ? 0 : timestamp;
        },
        header: ({ column }) => (
          <button
            type="button"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            className="ml-auto inline-flex items-center gap-1 text-right hover:text-foreground"
          >
            Last commit
            {column.getIsSorted() === "desc" ? (
              <ArrowDown className="size-3.5" />
            ) : column.getIsSorted() === "asc" ? (
              <ArrowUp className="size-3.5" />
            ) : (
              <ArrowUpDown className="size-3.5 opacity-60" />
            )}
          </button>
        ),
        cell: ({ row }) => (
          <p className="text-muted-foreground text-right text-xs">
            {formatDate(row.original.lastCommitAt)}
          </p>
        ),
      },
    ],
    [highestCommitCount, project.repo.name, project.repo.owner],
  );
  const table = useReactTable({
    data: topContributors,
    columns,
    state: {
      sorting,
    },
    onSortingChange: setSorting,
    enableSortingRemoval: false,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
  });
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
                setSorting([
                  {
                    id: value as ContributorSortKey,
                    desc: sortOrder === "desc",
                  },
                ])
              }
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="commits">Sort by commits</SelectItem>
                <SelectItem value="filesChanged">
                  Sort by files touched
                </SelectItem>
                <SelectItem value="netLines">Sort by net lines</SelectItem>
                <SelectItem value="lastCommitAt">Sort by recency</SelectItem>
              </SelectContent>
            </Select>
            <Select
              value={sortOrder}
              onValueChange={(value: string) =>
                setSorting([
                  {
                    id: sortBy,
                    desc: value === "desc",
                  },
                ])
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

          <ScrollArea className="max-h-136 rounded-md border">
            <div className="p-2">
              <Table>
                <TableHeader>
                  {table.getHeaderGroups().map((headerGroup) => (
                    <TableRow key={headerGroup.id}>
                      {headerGroup.headers.map((header) => (
                        <TableHead
                          key={header.id}
                          className={
                            header.id === "contributor"
                              ? "min-w-[360px]"
                              : "text-right"
                          }
                        >
                          {header.isPlaceholder
                            ? null
                            : flexRender(
                                header.column.columnDef.header,
                                header.getContext(),
                              )}
                        </TableHead>
                      ))}
                    </TableRow>
                  ))}
                </TableHeader>
                <TableBody>
                  {table.getRowModel().rows.length > 0 ? (
                    table.getRowModel().rows.map((row) => (
                      <TableRow key={row.id}>
                        {row.getVisibleCells().map((cell) => (
                          <TableCell
                            key={cell.id}
                            className={
                              cell.column.id === "contributor"
                                ? "min-w-[360px]"
                                : "text-right"
                            }
                          >
                            {flexRender(
                              cell.column.columnDef.cell,
                              cell.getContext(),
                            )}
                          </TableCell>
                        ))}
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell
                        colSpan={columns.length}
                        className="py-6 text-center"
                      >
                        <p className="text-muted-foreground text-sm">
                          No contributors matched the current filters.
                        </p>
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
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

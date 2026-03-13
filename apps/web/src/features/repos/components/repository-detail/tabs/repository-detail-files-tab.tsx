import {
  ArrowUpRight,
  Binary,
  FileCode2,
  Flame,
  FolderOpenDot,
  PanelLeftOpen,
  Sparkles,
} from "lucide-react";
import { useMemo, useState } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { type RepositoryDashboardListItem } from "@/features/repos/types";
import { ComparativeBars } from "../../repository-list/trend-visuals";
import {
  formatCompactNumber,
  formatNumber,
  getRepositoryFileUrl,
  type RepositoryDetailModel,
} from "../repository-detail-utils";
import { RepositoryDetailTabErrorBoundary } from "./repository-detail-error-boundary";

type RepositoryDetailFilesTabProps = {
  project: RepositoryDashboardListItem;
  model: RepositoryDetailModel;
};

const MILLIS_IN_DAY = 24 * 60 * 60 * 1000;
const MILLIS_IN_HOUR = 60 * 60 * 1000;
const MILLIS_IN_MINUTE = 60 * 1000;

function formatRelativeTime(value: string | null | undefined): string {
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

function toDirectoryKey(path: string): string {
  const segments = path.split("/");
  if (segments.length > 1) {
    return `${segments[0]}/${segments[1]}`;
  }
  return segments[0] ?? "root";
}

/**
 * Render file-system oriented analytics for docs and hotspots.
 *
 * @param project - Repository dashboard projection.
 * @param model - Normalized repository detail datasets.
 * @returns File and documentation analytics cards.
 */
export function RepositoryDetailFilesTab({
  project,
  model,
}: RepositoryDetailFilesTabProps) {
  const repositoryUrl = getRepositoryFileUrl(project, "");
  const docFiles = model.markdownFiles.slice(0, 36);
  const largestFiles = model.largestFiles.slice(0, 14);
  const hotspotFiles = model.hotspotFiles.slice(0, 14);
  const totalDocBytes = model.markdownFiles.reduce(
    (sum, file) => sum + file.size,
    0,
  );
  const topLargestScore = largestFiles[0]?.score ?? 1;
  const topHotspotScore = hotspotFiles[0]?.score ?? 1;
  const topFileTypes = model.fileTypeDistribution.slice(0, 8);
  const topDirectories = model.topDirectories.slice(0, 8);
  const insightCards = [
    {
      key: "components",
      label: "React components",
      value: model.pathInsights.reactComponents,
    },
    { key: "hooks", label: "Hooks", value: model.pathInsights.reactHooks },
    { key: "env", label: "Env files", value: model.pathInsights.envFiles },
    { key: "tests", label: "Test files", value: model.pathInsights.testFiles },
    {
      key: "config",
      label: "Config files",
      value: model.pathInsights.configFiles,
    },
    { key: "docs", label: "Docs", value: model.pathInsights.markdownFiles },
  ].filter((card) => card.value > 0);
  const defaultSelectedPath =
    docFiles.find((file) => file.hasContent)?.path ?? docFiles[0]?.path ?? null;
  const [selectedPath, setSelectedPath] = useState<string | null>(
    defaultSelectedPath,
  );
  const [markdownViewMode, setMarkdownViewMode] = useState<"preview" | "code">(
    "preview",
  );
  const selectedFile = useMemo(
    () =>
      docFiles.find((file) => file.path === selectedPath) ??
      docFiles.find((file) => file.hasContent) ??
      docFiles[0] ??
      null,
    [docFiles, selectedPath],
  );
  const fileSignals = Array.from(
    new Set([
      ...project.trends.topFileTypes.map((item) => item.toLowerCase()),
      ...project.trends.topCategories.map((item) => item.toLowerCase()),
    ]),
  ).slice(0, 12);
  const aiSetupMetrics = model.aiSetupMetrics;
  const { fileLastTouchedAtMap, directoryLastTouchedAtMap } = useMemo(() => {
    const fileMap = new Map<string, string>();
    const directoryMap = new Map<string, string>();

    for (const commit of project.repo.commits ?? []) {
      const commitTime =
        commit.authored_date ??
        commit.committed_date ??
        commit.created_at ??
        null;
      if (!commitTime) {
        continue;
      }

      for (const path of commit.changed_paths ?? []) {
        if (!path) {
          continue;
        }
        const previousFileTime = fileMap.get(path);
        if (
          !previousFileTime ||
          Date.parse(commitTime) > Date.parse(previousFileTime)
        ) {
          fileMap.set(path, commitTime);
        }

        const directoryKey = toDirectoryKey(path);
        const previousDirectoryTime = directoryMap.get(directoryKey);
        if (
          !previousDirectoryTime ||
          Date.parse(commitTime) > Date.parse(previousDirectoryTime)
        ) {
          directoryMap.set(directoryKey, commitTime);
        }
      }
    }

    return {
      fileLastTouchedAtMap: fileMap,
      directoryLastTouchedAtMap: directoryMap,
    };
  }, [project.repo.commits]);

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-2 lg:grid-cols-4">
        <Card>
          <CardContent className="space-y-1 p-3">
            <p className="text-muted-foreground text-xs">
              Repo size (metadata)
            </p>
            <p className="text-xl font-semibold">
              {formatCompactNumber(project.metadata.size)} KB
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="space-y-1 p-3">
            <p className="text-muted-foreground text-xs">
              Files touched (sampled)
            </p>
            <p className="text-xl font-semibold">
              {formatNumber(project.repo.totalFilesTouched)}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="space-y-1 p-3">
            <p className="text-muted-foreground text-xs">Workspace packages</p>
            <p className="text-xl font-semibold">
              {formatNumber(project.repo.workspacePackageCount)}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="space-y-1 p-3">
            <p className="text-muted-foreground text-xs">Markdown docs</p>
            <p className="text-xl font-semibold">
              {formatNumber(model.markdownFiles.length)}
            </p>
            <p className="text-muted-foreground text-[11px]">
              {formatCompactNumber(totalDocBytes)} B indexed
            </p>
          </CardContent>
        </Card>
      </div>

      {fileSignals.length > 0 ? (
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="inline-flex items-center gap-1 text-base">
              <FolderOpenDot className="size-4" />
              Change signatures
            </CardTitle>
          </CardHeader>
          <CardContent className="flex flex-wrap gap-1.5">
            {fileSignals.map((signal) => (
              <Badge key={signal} variant="outline">
                {signal}
              </Badge>
            ))}
          </CardContent>
        </Card>
      ) : null}

      <div className="grid gap-3 xl:grid-cols-[1.1fr_1fr]">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base">File type distribution</CardTitle>
          </CardHeader>
          <CardContent>
            <RepositoryDetailTabErrorBoundary tabLabel="Files / file type distribution">
              {topFileTypes.length > 0 ? (
                <ComparativeBars
                  bars={topFileTypes.map((item) => ({
                    key: item.key,
                    label: item.label,
                    value: item.value,
                  }))}
                />
              ) : (
                <p className="text-muted-foreground text-sm">
                  No file-type distribution was available from git history.
                </p>
              )}
            </RepositoryDetailTabErrorBoundary>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base">
              Repository composition insights
            </CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-2 gap-2">
            {insightCards.length > 0 ? (
              insightCards.map((item) => (
                <div
                  key={item.key}
                  className="rounded-md border bg-muted/20 p-2"
                >
                  <p className="text-muted-foreground text-[11px]">
                    {item.label}
                  </p>
                  <p className="mt-1 text-base font-semibold">
                    {formatNumber(item.value)}
                  </p>
                </div>
              ))
            ) : (
              <p className="text-muted-foreground text-sm">
                Path composition metrics were not available for this repository.
              </p>
            )}
          </CardContent>
        </Card>
      </div>

      {aiSetupMetrics ? (
        <RepositoryDetailTabErrorBoundary tabLabel="Files / AI setup footprint">
          <Card className="border-primary/20 bg-linear-to-br from-primary/5 via-background to-background">
            <CardHeader className="pb-2">
              <CardTitle className="inline-flex items-center gap-1 text-base">
                <Sparkles className="size-4" />
                AI setup footprint
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="grid gap-2 sm:grid-cols-2 xl:grid-cols-7">
                <div className="rounded-md border bg-muted/20 p-2">
                  <p className="text-muted-foreground text-[11px]">
                    Detected tools
                  </p>
                  <p className="mt-1 text-base font-semibold">
                    {formatNumber(aiSetupMetrics.detectedTools.length)}
                  </p>
                </div>
                <div className="rounded-md border bg-muted/20 p-2">
                  <p className="text-muted-foreground text-[11px]">
                    Instruction files
                  </p>
                  <p className="mt-1 text-base font-semibold">
                    {formatNumber(aiSetupMetrics.instructionFileCount)}
                  </p>
                </div>
                <div className="rounded-md border bg-muted/20 p-2">
                  <p className="text-muted-foreground text-[11px]">
                    Tooling dirs
                  </p>
                  <p className="mt-1 text-base font-semibold">
                    {formatNumber(aiSetupMetrics.toolingDirectoryCount)}
                  </p>
                </div>
                <div className="rounded-md border bg-muted/20 p-2">
                  <p className="text-muted-foreground text-[11px]">
                    Config files
                  </p>
                  <p className="mt-1 text-base font-semibold">
                    {formatNumber(aiSetupMetrics.totalConfigFileCount)}
                  </p>
                </div>
                <div className="rounded-md border bg-muted/20 p-2">
                  <p className="text-muted-foreground text-[11px]">
                    Touched files
                  </p>
                  <p className="mt-1 text-base font-semibold">
                    {formatNumber(aiSetupMetrics.touchedFileCount)}
                  </p>
                </div>
                <div className="rounded-md border bg-muted/20 p-2">
                  <p className="text-muted-foreground text-[11px]">
                    Touched commits
                  </p>
                  <p className="mt-1 text-base font-semibold">
                    {formatNumber(aiSetupMetrics.touchedCommitCount)}
                  </p>
                </div>
                <div className="rounded-md border bg-muted/20 p-2">
                  <p className="text-muted-foreground text-[11px]">
                    Change events
                  </p>
                  <p className="mt-1 text-base font-semibold">
                    {formatNumber(aiSetupMetrics.totalChangeCount)}
                  </p>
                </div>
              </div>
              {aiSetupMetrics.detectedTools.length > 0 ? (
                <div className="flex flex-wrap gap-1.5">
                  {aiSetupMetrics.detectedTools.map((tool) => (
                    <Badge key={tool} variant="outline">
                      {tool}
                    </Badge>
                  ))}
                </div>
              ) : null}
              {aiSetupMetrics.topChangedFiles.length > 0 ? (
                <div className="space-y-1.5 rounded-md border bg-muted/20 p-2">
                  <p className="text-muted-foreground text-[11px]">
                    Highest churn AI setup files
                  </p>
                  {aiSetupMetrics.topChangedFiles.slice(0, 8).map((file) => (
                    <div
                      key={`ai-churn-${file.path}`}
                      className="grid grid-cols-[minmax(0,1fr)_70px_85px] items-center gap-2 text-xs"
                    >
                      <a
                        href={getRepositoryFileUrl(project, file.path)}
                        target="_blank"
                        rel="noreferrer"
                        className="truncate transition-colors hover:text-primary"
                      >
                        {file.path}
                      </a>
                      <span className="text-right font-medium">
                        {formatCompactNumber(file.score)}
                      </span>
                      <span className="text-muted-foreground text-right">
                        {formatRelativeTime(
                          fileLastTouchedAtMap.get(file.path) ?? null,
                        )}
                      </span>
                    </div>
                  ))}
                </div>
              ) : null}
            </CardContent>
          </Card>
        </RepositoryDetailTabErrorBoundary>
      ) : null}

      <div className="grid gap-3 xl:grid-cols-3">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base">Hot directories</CardTitle>
          </CardHeader>
          <CardContent className="space-y-1.5">
            {topDirectories.length > 0 ? (
              topDirectories.map((directory) => (
                <div
                  key={`dir-${directory.key}`}
                  className="grid grid-cols-[minmax(0,1fr)_65px_85px] items-center gap-2 rounded-md border bg-muted/20 px-2 py-1.5 text-xs"
                >
                  <span className="truncate">{directory.label}</span>
                  <span className="text-right font-medium">
                    {formatCompactNumber(directory.value)}
                  </span>
                  <span className="text-muted-foreground text-right">
                    {formatRelativeTime(
                      directoryLastTouchedAtMap.get(directory.label) ?? null,
                    )}
                  </span>
                </div>
              ))
            ) : (
              <p className="text-muted-foreground text-sm">
                Directory-level change data was not found.
              </p>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="inline-flex items-center gap-1 text-base">
              <FileCode2 className="size-4" />
              Largest files
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {largestFiles.length > 0 ? (
              largestFiles.map((file, index) => (
                <div
                  key={file.path}
                  className="space-y-1 rounded-md border bg-muted/20 p-2 text-xs"
                >
                  <div className="grid grid-cols-[minmax(0,1fr)_65px_80px] items-center gap-2">
                    <a
                      href={getRepositoryFileUrl(project, file.path)}
                      target="_blank"
                      rel="noreferrer"
                      className="truncate transition-colors hover:text-primary"
                    >
                      <span className="text-muted-foreground mr-1">
                        {index + 1}.
                      </span>
                      {file.path}
                    </a>
                    <span className="text-right text-muted-foreground">
                      {formatCompactNumber(file.score)}
                    </span>
                    <span className="text-muted-foreground text-right">
                      {formatRelativeTime(
                        fileLastTouchedAtMap.get(file.path) ?? null,
                      )}
                    </span>
                  </div>
                  <div className="bg-border/70 h-1.5 rounded-full">
                    <div
                      className="bg-primary h-1.5 rounded-full"
                      style={{
                        width: `${Math.max(
                          8,
                          Math.round((file.score / topLargestScore) * 100),
                        )}%`,
                      }}
                    />
                  </div>
                </div>
              ))
            ) : (
              <p className="text-muted-foreground text-sm">
                No largest-file analytics are available.
              </p>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="inline-flex items-center gap-1 text-base">
              <Flame className="size-4" />
              Hotspot files
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {hotspotFiles.length > 0 ? (
              hotspotFiles.map((file, index) => (
                <div
                  key={file.path}
                  className="space-y-1 rounded-md border bg-muted/20 p-2 text-xs"
                >
                  <div className="grid grid-cols-[minmax(0,1fr)_65px_80px] items-center gap-2">
                    <a
                      href={getRepositoryFileUrl(project, file.path)}
                      target="_blank"
                      rel="noreferrer"
                      className="truncate transition-colors hover:text-primary"
                    >
                      <span className="text-muted-foreground mr-1">
                        {index + 1}.
                      </span>
                      {file.path}
                    </a>
                    <span className="text-right text-muted-foreground">
                      {formatCompactNumber(file.score)}
                    </span>
                    <span className="text-muted-foreground text-right">
                      {formatRelativeTime(
                        fileLastTouchedAtMap.get(file.path) ?? null,
                      )}
                    </span>
                  </div>
                  <div className="bg-border/70 h-1.5 rounded-full">
                    <div
                      className="h-1.5 rounded-full bg-amber-500"
                      style={{
                        width: `${Math.max(
                          8,
                          Math.round((file.score / topHotspotScore) * 100),
                        )}%`,
                      }}
                    />
                  </div>
                </div>
              ))
            ) : (
              <p className="text-muted-foreground text-sm">
                No hotspot analytics are available.
              </p>
            )}
          </CardContent>
        </Card>
      </div>

      <Card className="min-h-136">
        <CardHeader>
          <CardTitle className="inline-flex items-center gap-1 text-base">
            <PanelLeftOpen className="size-4" />
            File explorer and markdown renderer
          </CardTitle>
        </CardHeader>
        <CardContent className="grid gap-3 lg:grid-cols-[minmax(0,0.62fr)_minmax(0,1.38fr)]">
          {docFiles.length > 0 ? (
            <>
              <div className="space-y-2">
                <p className="text-muted-foreground text-xs">
                  Select a file to preview. Files with complete contents are
                  viewable.
                </p>
                <ScrollArea className="h-120 rounded-md border">
                  <div className="space-y-1 p-2">
                    {docFiles.map((file) => {
                      const isSelected = selectedFile?.path === file.path;
                      return (
                        <button
                          key={file.path}
                          type="button"
                          onClick={() => setSelectedPath(file.path)}
                          className={`w-full rounded-md border px-2 py-1.5 text-left transition-colors ${
                            isSelected
                              ? "border-primary/40 bg-primary/10"
                              : "bg-muted/20 hover:bg-muted/40"
                          }`}
                        >
                          <div className="flex items-start justify-between gap-2">
                            <div className="min-w-0">
                              <p className="truncate text-xs font-medium">
                                {file.filename}
                              </p>
                              <p className="text-muted-foreground truncate text-[11px]">
                                {file.path}
                              </p>
                            </div>
                            <div className="text-right">
                              <p className="text-muted-foreground text-[10px]">
                                {formatCompactNumber(file.size)} B
                              </p>
                              <p className="text-muted-foreground text-[10px]">
                                {formatRelativeTime(
                                  fileLastTouchedAtMap.get(file.path) ?? null,
                                )}
                              </p>
                              <Badge
                                variant={
                                  file.hasContent ? "secondary" : "outline"
                                }
                                className="mt-1 h-4 px-1 text-[10px]"
                              >
                                {file.hasContent ? "viewable" : "metadata only"}
                              </Badge>
                            </div>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </ScrollArea>
              </div>

              <div className="space-y-2">
                {selectedFile ? (
                  <>
                    <div className="flex items-center justify-between gap-2">
                      <a
                        href={getRepositoryFileUrl(project, selectedFile.path)}
                        target="_blank"
                        rel="noreferrer"
                        className="text-muted-foreground inline-flex min-w-0 items-center gap-1 truncate text-xs transition-colors hover:text-primary"
                      >
                        <span className="truncate">{selectedFile.path}</span>
                        <ArrowUpRight className="size-3" />
                      </a>
                      <Badge
                        variant="outline"
                        className="h-5 px-1.5 text-[10px]"
                      >
                        {formatCompactNumber(selectedFile.size)} B
                      </Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <p className="text-muted-foreground text-[11px]">
                        Last touched{" "}
                        {formatRelativeTime(
                          fileLastTouchedAtMap.get(selectedFile.path) ?? null,
                        )}
                      </p>
                      <Tabs
                        value={markdownViewMode}
                        onValueChange={(value) =>
                          setMarkdownViewMode(value as "preview" | "code")
                        }
                      >
                        <TabsList className="h-7">
                          <TabsTrigger
                            value="preview"
                            className="h-6 px-2 text-[11px]"
                          >
                            Preview
                          </TabsTrigger>
                          <TabsTrigger
                            value="code"
                            className="h-6 px-2 text-[11px]"
                          >
                            <Binary className="mr-1 size-3" />
                            Code
                          </TabsTrigger>
                        </TabsList>
                      </Tabs>
                    </div>
                  </>
                ) : (
                  <p className="text-muted-foreground text-xs">
                    No file selected
                  </p>
                )}
                {selectedFile?.hasContent ? (
                  <ScrollArea className="h-120 rounded-md border bg-linear-to-br from-background via-muted/10 to-muted/30">
                    <div className="space-y-3 p-3">
                      <div className="flex items-center justify-between gap-2 rounded-md border bg-background/80 px-2 py-1">
                        <p className="text-muted-foreground text-[11px]">
                          Markdown preview
                        </p>
                        <a
                          href={repositoryUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="text-muted-foreground text-[11px] transition-colors hover:text-primary"
                        >
                          repository root
                        </a>
                      </div>
                      <RepositoryDetailTabErrorBoundary tabLabel="Files / markdown renderer">
                        {markdownViewMode === "preview" ? (
                          <div className="space-y-3 text-sm leading-6 [&_a]:text-primary [&_a]:underline-offset-2 [&_a:hover]:underline [&_blockquote]:border-l-2 [&_blockquote]:pl-3 [&_code]:rounded [&_code]:bg-muted/60 [&_code]:px-1 [&_h1]:text-xl [&_h1]:font-semibold [&_h2]:text-lg [&_h2]:font-semibold [&_h3]:text-base [&_h3]:font-semibold [&_li]:my-1 [&_ol]:list-decimal [&_ol]:pl-5 [&_pre]:overflow-x-auto [&_pre]:rounded-md [&_pre]:border [&_pre]:bg-muted/40 [&_pre]:p-3 [&_pre_code]:bg-transparent [&_pre_code]:p-0 [&_table]:w-full [&_table]:border-collapse [&_td]:border [&_td]:px-2 [&_td]:py-1 [&_th]:border [&_th]:bg-muted/20 [&_th]:px-2 [&_th]:py-1 [&_ul]:list-disc [&_ul]:pl-5">
                            <ReactMarkdown remarkPlugins={[remarkGfm]}>
                              {selectedFile.content}
                            </ReactMarkdown>
                          </div>
                        ) : (
                          <pre className="overflow-x-auto rounded-md border bg-muted/40 p-3 font-mono text-xs leading-5 text-foreground/90">
                            <code>{selectedFile.content}</code>
                          </pre>
                        )}
                      </RepositoryDetailTabErrorBoundary>
                    </div>
                  </ScrollArea>
                ) : (
                  <div className="text-muted-foreground flex h-120 items-center justify-center rounded-md border border-dashed text-sm">
                    Selected file does not include full content in this dataset.
                  </div>
                )}
              </div>
            </>
          ) : (
            <p className="text-muted-foreground text-sm">
              No markdown file data was provided.
            </p>
          )}
        </CardContent>
      </Card>

      {project.repo.topics.length > 0 ? (
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="inline-flex items-center gap-1 text-base">
              <FolderOpenDot className="size-4" />
              Topics and architecture hints
            </CardTitle>
          </CardHeader>
          <CardContent className="flex flex-wrap gap-1.5">
            {project.repo.topics.slice(0, 24).map((topic) => (
              <Badge key={topic} variant="outline">
                #{topic}
              </Badge>
            ))}
          </CardContent>
        </Card>
      ) : null}
    </div>
  );
}

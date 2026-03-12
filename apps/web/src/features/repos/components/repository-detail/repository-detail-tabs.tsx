"use client";

import {
  FileCode2,
  GitPullRequest,
  Package,
  Rocket,
  Shield,
  Users,
} from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { type RepositoryDashboardListItem } from "@/features/repos/types";
import { RepositoryDetailAdminTab } from "./repository-detail-admin-tab";
import { RepositoryDetailContributorsTab } from "./repository-detail-contributors-tab";
import { RepositoryDetailDependenciesTab } from "./repository-detail-dependencies-tab";
import { RepositoryDetailDeploymentsTab } from "./repository-detail-deployments-tab";
import { RepositoryDetailTabErrorBoundary } from "./repository-detail-error-boundary";
import { RepositoryDetailFilesTab } from "./repository-detail-files-tab";
import { RepositoryDetailOverviewTab } from "./repository-detail-overview-tab";
import { RepositoryDetailPrsTab } from "./repository-detail-prs-tab";
import {
  formatCompactNumber,
  type RepositoryDetailModel,
} from "./repository-detail-utils";

/**
 * Enumerate the supported repository detail tab identifiers.
 */
export type RepositoryDetailTabValue =
  | "overview"
  | "contributors"
  | "deps"
  | "deployments"
  | "prs"
  | "files"
  | "admin";

/**
 * Represent badge metrics rendered in tab triggers.
 */
export type RepositoryDetailTabMetrics = Record<
  Exclude<RepositoryDetailTabValue, "overview" | "admin">,
  { value: number; suffix: string }
>;

type RepositoryDetailTabsProps = {
  /** Active tab value controlled by the parent route state. */
  activeTab: RepositoryDetailTabValue;
  /** Handle tab changes and synchronize hash routing. */
  onValueChange: (value: string) => void;
  /** Enable the admin tab for privileged users. */
  canViewAdminTab: boolean;
  /** Hint shown directly under the tab strip. */
  activeTabHint: string;
  /** Badge counters displayed under each tab label. */
  tabMetrics: RepositoryDetailTabMetrics;
  /** Repository item powering all tab panes. */
  project: RepositoryDashboardListItem;
  /** Normalized tab model generated from repository analytics. */
  model: RepositoryDetailModel;
  /** Pull-request merge rate shown in overview and PR tabs. */
  mergeRate: number;
  /** Issue closure rate shown in the overview tab. */
  issueClosureRate: number;
};

/**
 * Render the repository detail tab strip and tab content panels.
 *
 * @param props - Tab state, metrics, and tab content payloads.
 * @returns Sticky tab navigation and tab panels for repository insights.
 */
export function RepositoryDetailTabs({
  activeTab,
  onValueChange,
  canViewAdminTab,
  activeTabHint,
  tabMetrics,
  project,
  model,
  mergeRate,
  issueClosureRate,
}: RepositoryDetailTabsProps) {
  const triggerBaseClassName =
    "group flex min-w-36 flex-col items-center justify-start gap-1 rounded-sm border border-transparent px-4 py-3 text-center transition-all duration-200 hover:border-primary/40 hover:bg-primary/15 hover:text-foreground hover:shadow-sm data-[state=active]:border-primary/35 data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:ring-2 data-[state=active]:ring-primary/35 data-[state=active]:shadow-sm";
  const labelClassName =
    "inline-flex h-5 items-center justify-center gap-1 text-[0.95rem] font-semibold leading-tight";

  return (
    <Tabs value={activeTab} onValueChange={onValueChange} className="space-y-3">
      <TabsList className="supports-backdrop-filter:bg-background/85 sticky top-2 z-10 flex h-auto w-full justify-start gap-2 overflow-x-auto rounded-md border border-primary/25 bg-linear-to-r from-primary/8 via-background to-background p-2 shadow-sm backdrop-blur">
        <TabsTrigger value="overview" className={triggerBaseClassName}>
          <span className={labelClassName}>Overview</span>
        </TabsTrigger>
        <TabsTrigger
          value="contributors"
          className={`${triggerBaseClassName} min-w-40`}
        >
          <span className={labelClassName}>
            <Users className="size-3.5" />
            Contributors
          </span>
          {tabMetrics.contributors.value > 0 ? (
            <Badge variant="secondary" className="h-5 px-1.5 text-[10px]">
              {formatCompactNumber(tabMetrics.contributors.value)}{" "}
              {tabMetrics.contributors.suffix}
            </Badge>
          ) : null}
        </TabsTrigger>
        <TabsTrigger
          value="deps"
          className={`${triggerBaseClassName} min-w-40`}
        >
          <span className={labelClassName}>
            <Package className="size-3.5" />
            Dependencies
          </span>
          {tabMetrics.deps.value > 0 ? (
            <Badge variant="secondary" className="h-5 px-1.5 text-[10px]">
              {formatCompactNumber(tabMetrics.deps.value)}{" "}
              {tabMetrics.deps.suffix}
            </Badge>
          ) : null}
        </TabsTrigger>
        <TabsTrigger
          value="deployments"
          className={`${triggerBaseClassName} min-w-40`}
        >
          <span className={labelClassName}>
            <Rocket className="size-3.5" />
            Deployments
          </span>
          {tabMetrics.deployments.value > 0 ? (
            <Badge variant="secondary" className="h-5 px-1.5 text-[10px]">
              {formatCompactNumber(tabMetrics.deployments.value)}{" "}
              {tabMetrics.deployments.suffix}
            </Badge>
          ) : null}
        </TabsTrigger>
        <TabsTrigger value="prs" className={`${triggerBaseClassName} min-w-40`}>
          <span className={labelClassName}>
            <GitPullRequest className="size-3.5" />
            Pull requests
          </span>
          {tabMetrics.prs.value > 0 ? (
            <Badge variant="secondary" className="h-5 px-1.5 text-[10px]">
              {formatCompactNumber(tabMetrics.prs.value)}{" "}
              {tabMetrics.prs.suffix}
            </Badge>
          ) : null}
        </TabsTrigger>
        <TabsTrigger value="files" className={triggerBaseClassName}>
          <span className={labelClassName}>
            <FileCode2 className="size-3.5" />
            Files
          </span>
          {tabMetrics.files.value > 0 ? (
            <Badge variant="secondary" className="h-5 px-1.5 text-[10px]">
              {formatCompactNumber(tabMetrics.files.value)}{" "}
              {tabMetrics.files.suffix}
            </Badge>
          ) : null}
        </TabsTrigger>
        {canViewAdminTab ? (
          <TabsTrigger value="admin" className={triggerBaseClassName}>
            <span className={labelClassName}>
              <Shield className="size-3.5" />
              Admin
            </span>
          </TabsTrigger>
        ) : null}
      </TabsList>

      <Card className="border-dashed">
        <CardContent className="p-2">
          <p className="text-muted-foreground text-xs">{activeTabHint}</p>
        </CardContent>
      </Card>

      <TabsContent value="overview">
        <RepositoryDetailTabErrorBoundary tabLabel="Overview">
          <RepositoryDetailOverviewTab
            project={project}
            model={model}
            mergeRate={mergeRate}
            issueClosureRate={issueClosureRate}
          />
        </RepositoryDetailTabErrorBoundary>
      </TabsContent>

      <TabsContent value="contributors">
        <RepositoryDetailTabErrorBoundary tabLabel="Contributors">
          <RepositoryDetailContributorsTab project={project} model={model} />
        </RepositoryDetailTabErrorBoundary>
      </TabsContent>

      <TabsContent value="deps">
        <RepositoryDetailTabErrorBoundary tabLabel="Dependencies">
          <RepositoryDetailDependenciesTab model={model} />
        </RepositoryDetailTabErrorBoundary>
      </TabsContent>

      <TabsContent value="deployments">
        <RepositoryDetailTabErrorBoundary tabLabel="Deployments">
          <RepositoryDetailDeploymentsTab project={project} model={model} />
        </RepositoryDetailTabErrorBoundary>
      </TabsContent>

      <TabsContent value="prs">
        <RepositoryDetailTabErrorBoundary tabLabel="Pull requests">
          <RepositoryDetailPrsTab
            project={project}
            model={model}
            mergeRate={mergeRate}
          />
        </RepositoryDetailTabErrorBoundary>
      </TabsContent>

      <TabsContent value="files">
        <RepositoryDetailTabErrorBoundary tabLabel="Files">
          <RepositoryDetailFilesTab project={project} model={model} />
        </RepositoryDetailTabErrorBoundary>
      </TabsContent>

      {canViewAdminTab ? (
        <TabsContent value="admin">
          <RepositoryDetailTabErrorBoundary tabLabel="Admin">
            <RepositoryDetailAdminTab project={project} model={model} />
          </RepositoryDetailTabErrorBoundary>
        </TabsContent>
      ) : null}
    </Tabs>
  );
}

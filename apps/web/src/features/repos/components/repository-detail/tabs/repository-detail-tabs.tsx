"use client";

import { FileCode2, Package, Rocket, Shield, Users } from "lucide-react";
import { type ComponentType, type SVGProps } from "react";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useRepositoryDetailContext } from "../repository-detail-context";
import { formatCompactNumber, formatNumber } from "../repository-detail-utils";
import { RepositoryDetailAdminTab } from "./repository-detail-admin-tab";
import { RepositoryDetailContributorsTab } from "./repository-detail-contributors-tab";
import { RepositoryDetailDependenciesTab } from "./repository-detail-dependencies-tab";
import { RepositoryDetailDeploymentsTab } from "./repository-detail-deployments-tab";
import { RepositoryDetailTabErrorBoundary } from "./repository-detail-error-boundary";
import { RepositoryDetailFilesTab } from "./repository-detail-files-tab";
import { RepositoryDetailOverviewTab } from "./repository-detail-overview-tab";
import { RepositoryDetailPrsTab } from "./repository-detail-prs-tab";

/**
 * Enumerate the supported repository detail tab identifiers.
 */
export type RepositoryDetailTabValue =
  | "overview"
  | "contributors"
  | "deps"
  | "delivery"
  | "files"
  | "admin";

type RepositoryDetailTabsProps = {
  /** Active tab value controlled by the parent route state. */
  activeTab: RepositoryDetailTabValue;
  /** Handle tab changes and synchronize hash routing. */
  onValueChange: (value: string) => void;
};

type TriggerDefinition = {
  value: RepositoryDetailTabValue;
  label: string;
  icon: ComponentType<SVGProps<SVGSVGElement>> | null;
  getPreview: TriggerPreviewGenerator;
  adminOnly?: boolean;
};

type PreviewFactoryInput = {
  contributorCount: number;
  criticalDependencyCount: number;
  deploymentCountLast30Days: number;
  pullRequestSampleCount: number;
  hotspotFileCount: number;
  mergeRate: number;
  issueClosureRate: number;
};

type TriggerPreviewGenerator = (input: PreviewFactoryInput) => string;

/**
 * Define tab trigger metadata, labels, and preview slot content.
 */
export const REPOSITORY_DETAIL_TRIGGER_DEFINITIONS: TriggerDefinition[] = [
  {
    value: "overview",
    label: "Overview",
    icon: null,
    getPreview: () => "Summary snapshot",
  },
  {
    value: "contributors",
    label: "Contributors",
    icon: Users,
    getPreview: ({ contributorCount }) =>
      `${formatCompactNumber(contributorCount)} humans`,
  },
  {
    value: "deps",
    label: "Dependencies",
    icon: Package,
    getPreview: ({ criticalDependencyCount }) =>
      `${formatCompactNumber(criticalDependencyCount)} critical`,
  },
  {
    value: "delivery",
    label: "Delivery",
    icon: Rocket,
    getPreview: ({
      deploymentCountLast30Days,
      pullRequestSampleCount,
      mergeRate,
      issueClosureRate,
    }) =>
      `${formatNumber(deploymentCountLast30Days)} deploys • ${formatNumber(pullRequestSampleCount)} PRs • ${Math.round((mergeRate + issueClosureRate) / 2)}%`,
  },
  {
    value: "files",
    label: "Files",
    icon: FileCode2,
    getPreview: ({ hotspotFileCount }) =>
      `${formatCompactNumber(hotspotFileCount)} hotspots`,
  },
  {
    value: "admin",
    label: "Admin",
    icon: Shield,
    getPreview: () => "Raw diagnostics",
    adminOnly: true,
  },
];

/**
 * Render the repository detail tab strip and tab content panels.
 *
 * @param props - Tab state, metrics, and tab content payloads.
 * @returns Sticky tab navigation and tab panels for repository insights.
 */
export function RepositoryDetailTabs({
  activeTab,
  onValueChange,
}: RepositoryDetailTabsProps) {
  const {
    project,
    relatedProjects,
    model,
    mergeRate,
    issueClosureRate,
    canViewAdminTab,
  } = useRepositoryDetailContext();
  const contributorCount = model.contributors.filter(
    (item) => !item.isBot,
  ).length;
  const criticalDependencyCount = model.dependencies.filter(
    (item) => item.isCritical,
  ).length;
  const deploymentCountLast30Days =
    project.trends.deploymentsLast30Days ??
    model.deploymentsByEnvironment.reduce(
      (sum, environment) => sum + environment.deploymentsLast30Days,
      0,
    );
  const pullRequestSampleCount = model.recentPullRequests.length;
  const hotspotFileCount = model.hotspotFiles.length;
  const triggerBaseClassName =
    "group flex h-full min-h-18 min-w-36 flex-col items-center justify-between gap-1 rounded-sm border border-transparent px-4 py-3 text-center transition-all duration-200 hover:border-primary/40 hover:bg-primary/15 hover:text-foreground hover:shadow-sm data-[state=active]:border-primary/35 data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:ring-2 data-[state=active]:ring-primary/35 data-[state=active]:shadow-sm";
  const labelClassName =
    "inline-flex h-5 items-center justify-center gap-1 text-[0.95rem] font-semibold leading-tight";
  const previewSlotClassName =
    "flex h-5 items-center justify-center text-[11px] text-muted-foreground";
  const visibleTriggers = REPOSITORY_DETAIL_TRIGGER_DEFINITIONS.filter(
    (trigger) => !(trigger.adminOnly && !canViewAdminTab),
  );

  return (
    <Tabs value={activeTab} onValueChange={onValueChange} className="space-y-3">
      <TabsList className="supports-backdrop-filter:bg-background/85 sticky top-2 z-10 flex min-h-22 w-full items-stretch justify-start gap-2 overflow-x-auto overflow-y-hidden rounded-md border border-primary/25 bg-linear-to-r from-primary/8 via-background to-background p-2 shadow-sm backdrop-blur">
        {visibleTriggers.map((trigger) => {
          const Icon = trigger.icon;
          const previewLabel = trigger.getPreview({
            contributorCount,
            criticalDependencyCount,
            deploymentCountLast30Days,
            pullRequestSampleCount,
            hotspotFileCount,
            mergeRate,
            issueClosureRate,
          });

          return (
            <TabsTrigger
              key={trigger.value}
              value={trigger.value}
              className={triggerBaseClassName}
            >
              <span className={labelClassName}>
                {Icon ? <Icon className="size-3.5 shrink-0" /> : null}
                {trigger.label}
              </span>
              <span className={previewSlotClassName}>
                {previewLabel || "No preview"}
              </span>
            </TabsTrigger>
          );
        })}
      </TabsList>

      <TabsContent value="overview">
        <RepositoryDetailTabErrorBoundary tabLabel="Overview">
          <RepositoryDetailOverviewTab
            project={project}
            model={model}
            mergeRate={mergeRate}
            issueClosureRate={issueClosureRate}
            relatedProjects={relatedProjects}
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

      <TabsContent value="delivery">
        <RepositoryDetailTabErrorBoundary tabLabel="Delivery">
          <div className="space-y-3">
            <RepositoryDetailDeploymentsTab project={project} model={model} />
            <RepositoryDetailPrsTab
              project={project}
              model={model}
              mergeRate={mergeRate}
            />
          </div>
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

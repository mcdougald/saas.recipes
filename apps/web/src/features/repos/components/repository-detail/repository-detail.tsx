"use client";

import { useEffect, useMemo, useState } from "react";

import { useAuth } from "@/contexts/auth-context";
import { type RepositoryDashboardListItem } from "@/features/repos/types";
import { RepositoryDetailHeader } from "./layout/repository-detail-header";
import { RepositoryDetailProvider } from "./repository-detail-context";
import { buildRepositoryDetailModel } from "./repository-detail-utils";
import {
  RepositoryDetailTabs,
  type RepositoryDetailTabValue,
} from "./tabs/repository-detail-tabs";

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
  "delivery",
  "files",
  "admin",
]);

function asTabFromHash(hash: string): RepositoryDetailTabValue | null {
  const normalized = hash.replace(/^#/, "").toLowerCase();
  if (normalized === "deployments" || normalized === "prs") {
    return "delivery";
  }
  if (!TAB_HASHES.has(normalized as RepositoryDetailTabValue)) {
    return null;
  }
  return normalized as RepositoryDetailTabValue;
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
  const deploymentSuccessRate = project.repo.deployments?.successRate ?? null;
  const prOpenRatio =
    project.repo.totalPullRequests > 0
      ? Math.round(
          (project.repo.openPullRequests / project.repo.totalPullRequests) *
            100,
        )
      : 0;
  const canViewAdminTab = isLocalhost || user?.admin === true;

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
    <RepositoryDetailProvider
      value={{
        project,
        relatedProjects,
        model,
        mergeRate,
        issueClosureRate,
        prOpenRatio,
        deploymentSuccessRate,
        canViewAdminTab,
      }}
    >
      <div className="@container/main space-y-4 px-4 pb-6 lg:px-6">
        <RepositoryDetailHeader />
        <RepositoryDetailTabs
          activeTab={activeTab}
          onValueChange={handleTabChange}
        />
      </div>
    </RepositoryDetailProvider>
  );
}

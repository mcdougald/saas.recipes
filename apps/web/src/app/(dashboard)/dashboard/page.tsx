import Link from "next/link";

import { DashboardPageHeader } from "@/components/dashboard/page-header";
import { Button } from "@/components/ui/button";
import { RepoOverviewStats } from "@/features/repos/components/repo-overview-stats";
import { RepositoryList } from "@/features/repos/components/repository-list";
import {
  getRepositoryDashboardSummary,
  repositoryDashboardData,
} from "@/features/repos/data/repository-dashboard-data";

export default function Page() {
  const summary = getRepositoryDashboardSummary(repositoryDashboardData);
  const featuredRecipe = repositoryDashboardData[0] ?? null;

  return (
    <>
      <DashboardPageHeader
        title={'Tracked "Recipes"'}
        description="Snapshots of health, delivery activity, and codebase signals across live projects."
      />

      <div className="@container/main px-4 lg:px-6 space-y-6">
        <RepoOverviewStats summary={summary} />
        <RepositoryList projects={repositoryDashboardData} />
      </div>
    </>
  );
}

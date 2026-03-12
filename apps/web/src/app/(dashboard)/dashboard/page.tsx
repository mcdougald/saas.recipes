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
        {featuredRecipe ? (
          <div className="rounded-md border bg-card p-3">
            <p className="text-muted-foreground text-xs">
              Explore full recipe pages with trend breakdowns and repository
              detail views.
            </p>
            <Button asChild size="sm" className="mt-2">
              <Link href={`/dashboard/${featuredRecipe.slug}`}>
                Open featured recipe: {featuredRecipe.repo.owner}/
                {featuredRecipe.repo.name}
              </Link>
            </Button>
          </div>
        ) : null}
        <RepoOverviewStats summary={summary} />
        <RepositoryList projects={repositoryDashboardData} />
      </div>
    </>
  );
}

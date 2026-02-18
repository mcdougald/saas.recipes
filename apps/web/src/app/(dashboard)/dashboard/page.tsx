import { RepoOverviewStats } from "@/features/repos/components/repo-overview-stats";
import { RepositoryList } from "@/features/repos/components/repository-list";
import {
  getRepositoryDashboardSummary,
  repositoryDashboardData,
} from "@/features/repos/data/repository-dashboard-data";

export default function Page() {
  const summary = getRepositoryDashboardSummary(repositoryDashboardData);

  return (
    <>
      <div className="px-4 lg:px-6 py-4">
        <div className="flex flex-col gap-2">
          <h1 className="text-2xl font-bold tracking-tight">Home Dashboard</h1>
          <p className="text-muted-foreground">
            Snapshot of repository health, delivery activity, and codebase signals.
          </p>
        </div>
      </div>

      <div className="@container/main px-4 lg:px-6 space-y-6">
        <RepoOverviewStats summary={summary} />
        <RepositoryList projects={repositoryDashboardData} />
      </div>
    </>
  );
}

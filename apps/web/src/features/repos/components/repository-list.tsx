import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import type { RepositoryDashboardListItem } from "@/features/repos/types";

import { RepositoryListItem } from "./repository-list-item";

type RepositoryListProps = {
  projects: RepositoryDashboardListItem[];
};

export function RepositoryList({ projects }: RepositoryListProps) {
  const activeCount = projects.filter((project) => project.status === "active").length;
  const pausedCount = projects.filter((project) => project.status === "paused").length;
  const archivedCount = projects.filter((project) => project.status === "archived").length;
  const orderedProjects = projects.toSorted((a, b) => {
    if (b.inspirationScore === a.inspirationScore) {
      return b.metadata.stars - a.metadata.stars;
    }

    return b.inspirationScore - a.inspirationScore;
  });

  return (
    <Card className="border-none shadow-none p-0">
      <CardHeader className="space-y-3 p-0">
        <CardTitle>Tracked Repositories</CardTitle>
        <CardDescription>
          Curated repositories ranked by inspiration score and delivery health.
        </CardDescription>
        <div className="flex flex-wrap gap-2">
          <Badge variant="secondary">{projects.length} total</Badge>
          <Badge variant="outline">{activeCount} active</Badge>
          <Badge variant="outline">{pausedCount} paused</Badge>
          <Badge variant="outline">{archivedCount} archived</Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-4 p-0">
        {orderedProjects.map((project) => (
          <RepositoryListItem key={project.id} project={project} />
        ))}
      </CardContent>
    </Card>
  );
}

import { GitFork, GitPullRequest, Star, Users } from "lucide-react";

import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import type { RepositoryDashboardSummary } from "@/features/repos/types";

const numberFormatter = new Intl.NumberFormat("en-US", {
  maximumFractionDigits: 0,
});

function formatNumber(value: number): string {
  return numberFormatter.format(value);
}

type RepoOverviewStatsProps = {
  summary: RepositoryDashboardSummary;
};

type StatCard = {
  label: string;
  value: number;
  icon: typeof Star;
  accentClassName: string;
  helper: string;
};

export function RepoOverviewStats({ summary }: RepoOverviewStatsProps) {
  const statCards: StatCard[] = [
    {
      label: "Total Stars",
      value: summary.totalStars,
      icon: Star,
      accentClassName: "from-amber-500/20 to-amber-500/5",
      helper: "Community demand signal",
    },
    {
      label: "Contributors",
      value: summary.totalContributors,
      icon: Users,
      accentClassName: "from-sky-500/20 to-sky-500/5",
      helper: "Distinct engineers observed",
    },
    {
      label: "Open Issues",
      value: summary.totalOpenIssues,
      icon: GitFork,
      accentClassName: "from-orange-500/20 to-orange-500/5",
      helper: "Current backlog pressure",
    },
    {
      label: "Open Pull Requests",
      value: summary.totalOpenPullRequests,
      icon: GitPullRequest,
      accentClassName: "from-emerald-500/20 to-emerald-500/5",
      helper: "Active delivery in flight",
    },
  ];

  return (
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
      {statCards.map((card) => {
        const Icon = card.icon;

        return (
          <Card key={card.label} className="relative overflow-hidden border">
            <div
              className={`pointer-events-none absolute inset-x-0 top-0 h-16 bg-linear-to-r ${card.accentClassName}`}
            />
            <CardHeader className="relative gap-1 pb-2">
              <CardDescription>{card.label}</CardDescription>
              <CardTitle className="flex items-center gap-2 text-2xl">
                <Icon className="size-4" />
                {formatNumber(card.value)}
              </CardTitle>
              <p className="text-muted-foreground text-xs">{card.helper}</p>
            </CardHeader>
          </Card>
        );
      })}
    </div>
  );
}

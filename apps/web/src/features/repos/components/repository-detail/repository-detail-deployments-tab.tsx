import { ArrowUpRight, Clock3, Github, Globe, Rocket } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { type RepositoryDashboardListItem } from "@/features/repos/types";
import {
  formatDate,
  formatNumber,
  getRepositoryUrl,
  type RepositoryDetailModel,
} from "./repository-detail-utils";

type RepositoryDetailDeploymentsTabProps = {
  project: RepositoryDashboardListItem;
  model: RepositoryDetailModel;
};

/**
 * Render deployments tab with environment-level and event-level data.
 *
 * @param project - Repository dashboard projection for GitHub link construction.
 * @param model - Normalized repository detail datasets.
 * @returns Deployment environment cards and recent deployment feed.
 */
export function RepositoryDetailDeploymentsTab({
  project,
  model,
}: RepositoryDetailDeploymentsTabProps) {
  const environments = model.deploymentsByEnvironment;
  const recentDeployments = model.recentDeployments;
  const repositoryUrl = getRepositoryUrl(project);
  const deploymentsLast30Days = environments.reduce(
    (sum, environment) => sum + environment.deploymentsLast30Days,
    0,
  );
  const weightedSuccessRate =
    environments.length > 0
      ? Math.round(
          environments.reduce(
            (sum, environment) =>
              sum + environment.successRate * environment.totalDeployments,
            0,
          ) /
            Math.max(
              1,
              environments.reduce(
                (sum, environment) => sum + environment.totalDeployments,
                0,
              ),
            ),
        )
      : 0;

  if (environments.length === 0 && recentDeployments.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Deployments</CardTitle>
        </CardHeader>
        <CardContent className="text-muted-foreground text-sm">
          No deployment analytics are available in the current dataset.
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-2 lg:grid-cols-4">
        <Card>
          <CardContent className="space-y-1 p-3">
            <p className="text-muted-foreground text-xs">Environments</p>
            <p className="text-xl font-semibold">
              {formatNumber(environments.length)}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="space-y-1 p-3">
            <p className="text-muted-foreground text-xs">Recent deploys</p>
            <p className="text-xl font-semibold">
              {formatNumber(recentDeployments.length)}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="space-y-1 p-3">
            <p className="text-muted-foreground text-xs">Deploys in 30d</p>
            <p className="text-xl font-semibold">
              {formatNumber(deploymentsLast30Days)}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="space-y-1 p-3">
            <p className="text-muted-foreground text-xs">Weighted success</p>
            <p className="text-xl font-semibold">{weightedSuccessRate}%</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="inline-flex items-center gap-1 text-base">
            <Github className="size-4" />
            Deployment references
          </CardTitle>
        </CardHeader>
        <CardContent className="grid gap-2 sm:grid-cols-2 xl:grid-cols-4">
          <a
            href={`${repositoryUrl}/deployments`}
            target="_blank"
            rel="noreferrer"
            className="rounded-md border bg-muted/20 p-2 text-sm transition-colors hover:bg-muted/40"
          >
            <p className="font-medium">GitHub deployments</p>
            <p className="text-muted-foreground mt-1 text-xs">
              Open deployment list and statuses
            </p>
          </a>
          <a
            href={`${repositoryUrl}/actions`}
            target="_blank"
            rel="noreferrer"
            className="rounded-md border bg-muted/20 p-2 text-sm transition-colors hover:bg-muted/40"
          >
            <p className="font-medium">GitHub Actions</p>
            <p className="text-muted-foreground mt-1 text-xs">
              Review workflow runs and failures
            </p>
          </a>
          <a
            href={`${repositoryUrl}/releases`}
            target="_blank"
            rel="noreferrer"
            className="rounded-md border bg-muted/20 p-2 text-sm transition-colors hover:bg-muted/40"
          >
            <p className="font-medium">Release timeline</p>
            <p className="text-muted-foreground mt-1 text-xs">
              Compare deployments against tagged releases
            </p>
          </a>
          <a
            href={`${repositoryUrl}/commits/${project.repo.default_branch}`}
            target="_blank"
            rel="noreferrer"
            className="rounded-md border bg-muted/20 p-2 text-sm transition-colors hover:bg-muted/40"
          >
            <p className="font-medium">Branch commits</p>
            <p className="text-muted-foreground mt-1 text-xs">
              Inspect commit velocity on default branch
            </p>
          </a>
        </CardContent>
      </Card>

      <div className="grid gap-2 lg:grid-cols-2">
        {environments.map((environment) => (
          <Card key={environment.name}>
            <CardContent className="space-y-2 p-3">
              <div className="flex items-start justify-between gap-2">
                <div>
                  <p className="text-sm font-medium">{environment.name}</p>
                  <p className="text-muted-foreground text-xs">
                    Last deploy {formatDate(environment.lastDeploymentAt)}
                  </p>
                </div>
                <Badge variant="outline" className="capitalize">
                  {environment.latestStatus}
                </Badge>
              </div>

              <div className="grid grid-cols-3 gap-1.5 text-xs">
                <div className="rounded-sm border bg-muted/20 px-2 py-1.5">
                  <p className="text-muted-foreground">Total</p>
                  <p className="mt-0.5 font-semibold">
                    {formatNumber(environment.totalDeployments)}
                  </p>
                </div>
                <div className="rounded-sm border bg-muted/20 px-2 py-1.5">
                  <p className="text-muted-foreground">Last 30d</p>
                  <p className="mt-0.5 font-semibold">
                    {formatNumber(environment.deploymentsLast30Days)}
                  </p>
                </div>
                <div className="rounded-sm border bg-muted/20 px-2 py-1.5">
                  <p className="text-muted-foreground">Success</p>
                  <p className="mt-0.5 font-semibold">
                    {Math.round(environment.successRate)}%
                  </p>
                </div>
              </div>

              <div className="space-y-1">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-muted-foreground">Success rate</span>
                  <span className="font-medium">
                    {Math.round(environment.successRate)}%
                  </span>
                </div>
                <Progress value={environment.successRate} className="h-1.5" />
              </div>

              {environment.url ? (
                <a
                  href={environment.url}
                  target="_blank"
                  rel="noreferrer"
                  className="text-primary inline-flex items-center gap-1 text-xs hover:underline"
                >
                  <Globe className="size-3.5" />
                  Open environment URL
                </a>
              ) : null}
            </CardContent>
          </Card>
        ))}
      </div>

      {recentDeployments.length > 0 ? (
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base">Recent deployments</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="text-muted-foreground grid grid-cols-[90px_minmax(0,1fr)_95px_90px_110px] gap-2 px-2 text-[11px] font-medium">
              <span>ID</span>
              <span>Ref / task</span>
              <span>Environment</span>
              <span className="text-right">Statuses</span>
              <span className="text-right">Created</span>
            </div>
            {recentDeployments.slice(0, 16).map((deployment) => (
              <div
                key={`${deployment.id}-${deployment.ref}`}
                className="grid grid-cols-[90px_minmax(0,1fr)_95px_90px_110px] items-center gap-2 rounded-md border bg-muted/20 px-2 py-2"
              >
                <p className="text-sm font-medium">#{deployment.id}</p>
                <div className="min-w-0">
                  <p className="truncate text-sm font-medium">
                    {deployment.ref}
                  </p>
                  <p className="text-muted-foreground truncate text-xs">
                    {deployment.task} by {deployment.creator}
                  </p>
                  <div className="mt-1 flex flex-wrap items-center gap-2 text-[11px]">
                    {deployment.sha ? (
                      <a
                        href={`${repositoryUrl}/commit/${deployment.sha}`}
                        target="_blank"
                        rel="noreferrer"
                        className="text-primary inline-flex items-center gap-1 hover:underline"
                      >
                        commit {deployment.sha.slice(0, 7)}
                        <ArrowUpRight className="size-3" />
                      </a>
                    ) : null}
                    <a
                      href={`https://github.com/${deployment.creator}`}
                      target="_blank"
                      rel="noreferrer"
                      className="text-primary hover:underline"
                    >
                      @{deployment.creator}
                    </a>
                  </div>
                </div>
                <Badge variant="outline">{deployment.environment}</Badge>
                <span className="text-muted-foreground inline-flex items-center justify-end gap-1 text-xs">
                  <Rocket className="size-3.5" />
                  {deployment.statuses}
                </span>
                <span className="text-muted-foreground inline-flex items-center justify-end gap-1 text-xs">
                  <Clock3 className="size-3.5" />
                  {formatDate(deployment.createdAt)}
                </span>
              </div>
            ))}
          </CardContent>
        </Card>
      ) : null}
    </div>
  );
}

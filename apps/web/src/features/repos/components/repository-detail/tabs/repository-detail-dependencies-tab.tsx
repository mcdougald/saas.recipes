import {
  AlertTriangle,
  ArrowUpRight,
  Compass,
  LibraryBig,
  Package,
  ShieldCheck,
  Sparkles,
  Wrench,
} from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  getKeyDependencyMetadata,
  KEY_DEPENDENCY_GROUPS,
  type KeyDependencyCategory,
  type KeyDependencyMetadata,
} from "@/features/repos/data/key-dependencies";
import {
  formatCompactNumber,
  formatNumber,
  type RepositoryDetailModel,
} from "../repository-detail-utils";

type RepositoryDetailDependenciesTabProps = {
  model: RepositoryDetailModel;
};

const KEY_CATEGORY_LABELS: Record<KeyDependencyCategory, string> = {
  asyncWorkflow: "Async workflows",
  databases: "Databases",
  frameworks: "Frameworks",
  rpc: "RPC",
};

const CATEGORY_ORDER: KeyDependencyCategory[] = [
  "frameworks",
  "databases",
  "rpc",
  "asyncWorkflow",
];

/**
 * Render the dependencies tab for package risk and usage inspection.
 *
 * @param model - Normalized repository detail datasets.
 * @returns Dependency cards grouped by usage intensity.
 */
export function RepositoryDetailDependenciesTab({
  model,
}: RepositoryDetailDependenciesTabProps) {
  const uniqueDependencies = Array.from(
    model.dependencies
      .reduce((map, dependency) => {
        const key = dependency.packageName.toLowerCase().trim();
        const existing = map.get(key);
        if (!existing) {
          map.set(key, dependency);
          return map;
        }

        map.set(key, {
          ...existing,
          usageCount: existing.usageCount + dependency.usageCount,
          isCritical: existing.isCritical || dependency.isCritical,
          isDirect: existing.isDirect || dependency.isDirect,
          isDevDependency:
            existing.isDevDependency || dependency.isDevDependency,
          isPeerDependency:
            existing.isPeerDependency || dependency.isPeerDependency,
          latestVersion: existing.latestVersion ?? dependency.latestVersion,
          license: existing.license ?? dependency.license,
        });
        return map;
      }, new Map<string, (typeof model.dependencies)[number]>())
      .values(),
  ).toSorted((left, right) => right.usageCount - left.usageCount);
  const topDependencies = uniqueDependencies.slice(0, 50);
  const criticalCount = uniqueDependencies.filter(
    (dep) => dep.isCritical,
  ).length;
  const directCount = uniqueDependencies.filter((dep) => dep.isDirect).length;
  const devOnlyCount = uniqueDependencies.filter(
    (dep) => dep.isDevDependency && !dep.isDirect,
  ).length;
  const peerCount = uniqueDependencies.filter(
    (dep) => dep.isPeerDependency,
  ).length;
  const outdatedCount = uniqueDependencies.filter(
    (dep) => dep.latestVersion && dep.latestVersion !== dep.version,
  ).length;
  const keyDependencyRows = uniqueDependencies
    .map((dependency) => ({
      dependency,
      keyMetadata: getKeyDependencyMetadata(dependency.packageName),
    }))
    .filter(
      (
        row,
      ): row is {
        dependency: (typeof model.dependencies)[number];
        keyMetadata: NonNullable<ReturnType<typeof getKeyDependencyMetadata>>;
      } => Boolean(row.keyMetadata),
    )
    .toSorted(
      (left, right) => right.dependency.usageCount - left.dependency.usageCount,
    );
  const keyDependencyCatalogCount = CATEGORY_ORDER.reduce(
    (count, category) => count + KEY_DEPENDENCY_GROUPS[category].length,
    0,
  );
  const keyDependencyCountByCategory: Record<KeyDependencyCategory, number> = {
    asyncWorkflow: 0,
    databases: 0,
    frameworks: 0,
    rpc: 0,
  };
  for (const row of keyDependencyRows) {
    keyDependencyCountByCategory[row.keyMetadata.category] += 1;
  }
  const missingCategorySuggestions: Array<{
    category: KeyDependencyCategory;
    suggestions: readonly KeyDependencyMetadata[];
  }> = CATEGORY_ORDER.filter(
    (category) => keyDependencyCountByCategory[category] === 0,
  ).map((category) => ({
    category,
    suggestions: KEY_DEPENDENCY_GROUPS[category].slice(0, 2),
  }));
  const driftingKeyDependencies = keyDependencyRows.filter(
    ({ dependency }) =>
      dependency.latestVersion &&
      dependency.latestVersion !== dependency.version,
  );
  const directRatio = Math.round(
    (directCount / Math.max(uniqueDependencies.length, 1)) * 100,
  );
  const criticalRatio = Math.round(
    (criticalCount / Math.max(uniqueDependencies.length, 1)) * 100,
  );

  if (uniqueDependencies.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Dependencies</CardTitle>
        </CardHeader>
        <CardContent className="text-muted-foreground text-sm">
          No dependency analytics are available in the current dataset.
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-2 lg:grid-cols-6">
        <Card>
          <CardContent className="space-y-1 p-3">
            <p className="text-muted-foreground text-xs">Total</p>
            <p className="text-xl font-semibold">
              {formatNumber(uniqueDependencies.length)}
            </p>
            <p className="text-muted-foreground text-[11px]">
              inventory entries
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="space-y-1 p-3">
            <p className="text-muted-foreground text-xs">Direct</p>
            <p className="text-xl font-semibold">{formatNumber(directCount)}</p>
            <p className="text-muted-foreground text-[11px]">
              {directRatio}% share
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="space-y-1 p-3">
            <p className="text-muted-foreground text-xs">Dev-only</p>
            <p className="text-xl font-semibold">
              {formatNumber(devOnlyCount)}
            </p>
            <p className="text-muted-foreground text-[11px]">
              build/test surface
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="space-y-1 p-3">
            <p className="text-muted-foreground text-xs">Peer</p>
            <p className="text-xl font-semibold">{formatNumber(peerCount)}</p>
            <p className="text-muted-foreground text-[11px]">
              integration contracts
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="space-y-1 p-3">
            <p className="text-muted-foreground text-xs">Outdated</p>
            <p className="text-xl font-semibold">
              {formatNumber(outdatedCount)}
            </p>
            <p className="text-muted-foreground text-[11px]">version drift</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="space-y-1 p-3">
            <p className="text-muted-foreground text-xs">Critical</p>
            <p
              className={`text-xl font-semibold ${
                criticalCount > 0 ? "text-rose-600 dark:text-rose-400" : ""
              }`}
            >
              {formatNumber(criticalCount)}
            </p>
            <p className="text-muted-foreground text-[11px]">
              {criticalRatio}% critical
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-3 xl:grid-cols-[1.1fr_minmax(0,1fr)]">
        <Card className="border-primary/20 bg-linear-to-br from-primary/6 via-background to-background">
          <CardHeader className="pb-2">
            <CardTitle className="inline-flex items-center gap-1 text-base">
              <LibraryBig className="size-4" />
              Curated dependency intelligence
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex flex-wrap items-center gap-1.5">
              <Badge variant="secondary">
                {formatNumber(keyDependencyRows.length)} matched from curated
                registry
              </Badge>
              <Badge variant="outline">
                {formatNumber(keyDependencyCatalogCount)} tracked in catalog
              </Badge>
              <Badge variant="outline">
                {formatNumber(driftingKeyDependencies.length)} need review
              </Badge>
            </div>
            <div className="space-y-2">
              {CATEGORY_ORDER.map((category) => {
                const matchedCount = keyDependencyCountByCategory[category];
                const catalogCount = KEY_DEPENDENCY_GROUPS[category].length;
                const ratio = Math.round(
                  (matchedCount / Math.max(catalogCount, 1)) * 100,
                );
                return (
                  <div key={category} className="space-y-1">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-muted-foreground">
                        {KEY_CATEGORY_LABELS[category]}
                      </span>
                      <span className="font-medium">
                        {formatNumber(matchedCount)} /{" "}
                        {formatNumber(catalogCount)}
                      </span>
                    </div>
                    <div className="h-1.5 w-full overflow-hidden rounded-full bg-muted">
                      <div
                        className="bg-primary h-full rounded-full"
                        style={{ width: `${Math.max(4, ratio)}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="inline-flex items-center gap-1 text-base">
              <Compass className="size-4" />
              Missing category opportunities
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {missingCategorySuggestions.length === 0 ? (
              <p className="text-muted-foreground text-sm">
                Every curated category has at least one detected package in this
                repository.
              </p>
            ) : (
              missingCategorySuggestions.map(({ category, suggestions }) => (
                <div
                  key={category}
                  className="rounded-md border bg-muted/20 p-2"
                >
                  <p className="text-sm font-medium">
                    {KEY_CATEGORY_LABELS[category]}
                  </p>
                  <p className="text-muted-foreground text-xs">
                    Consider evaluating these ecosystem options:
                  </p>
                  <div className="mt-1.5 flex flex-wrap gap-1">
                    {suggestions.map((item) => (
                      <a
                        key={`${category}-${item.name}`}
                        href={item.docsUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="text-primary hover:text-primary/80 inline-flex items-center gap-1 rounded-md border px-2 py-1 text-[11px] hover:underline"
                      >
                        {item.name}
                        <ArrowUpRight className="size-3" />
                      </a>
                    ))}
                  </div>
                </div>
              ))
            )}
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="inline-flex items-center gap-1 text-base">
            <Sparkles className="size-4" />
            Key platform dependency spotlight
          </CardTitle>
        </CardHeader>
        <CardContent className="grid gap-2 sm:grid-cols-2 xl:grid-cols-3">
          {keyDependencyRows.length > 0 ? (
            keyDependencyRows
              .slice(0, 12)
              .map(({ dependency, keyMetadata }) => {
                const hasDrift =
                  dependency.latestVersion &&
                  dependency.latestVersion !== dependency.version;
                return (
                  <div
                    key={`${dependency.packageName}-key`}
                    className="space-y-2 rounded-md border bg-muted/20 p-3"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="min-w-0">
                        <p className="truncate text-sm font-semibold">
                          {dependency.packageName}
                        </p>
                        <p className="text-muted-foreground line-clamp-2 text-xs">
                          {keyMetadata.description}
                        </p>
                      </div>
                      <Badge variant="outline">
                        {KEY_CATEGORY_LABELS[keyMetadata.category]}
                      </Badge>
                    </div>
                    <div className="flex flex-wrap gap-1">
                      <Badge variant="outline">v{dependency.version}</Badge>
                      {dependency.latestVersion ? (
                        <Badge variant={hasDrift ? "secondary" : "outline"}>
                          latest {dependency.latestVersion}
                        </Badge>
                      ) : null}
                      <Badge variant="outline">
                        usage {formatCompactNumber(dependency.usageCount)}
                      </Badge>
                      {dependency.isCritical ? (
                        <Badge variant="destructive">critical</Badge>
                      ) : null}
                    </div>
                    {keyMetadata.tags?.length ? (
                      <div className="flex flex-wrap gap-1">
                        {keyMetadata.tags.slice(0, 3).map((tag) => (
                          <Badge
                            key={`${dependency.packageName}-${tag}`}
                            variant="secondary"
                          >
                            {tag}
                          </Badge>
                        ))}
                      </div>
                    ) : null}
                    <div className="flex flex-wrap gap-2 text-xs">
                      <a
                        href={keyMetadata.docsUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="text-primary inline-flex items-center gap-1 hover:underline"
                      >
                        docs
                        <ArrowUpRight className="size-3" />
                      </a>
                      {keyMetadata.repoUrl ? (
                        <a
                          href={keyMetadata.repoUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="text-primary inline-flex items-center gap-1 hover:underline"
                        >
                          repo
                          <ArrowUpRight className="size-3" />
                        </a>
                      ) : null}
                    </div>
                  </div>
                );
              })
          ) : (
            <p className="text-muted-foreground text-sm">
              No dependencies in this repository matched the curated key
              dependency registry.
            </p>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="inline-flex items-center gap-1 text-base">
            <Wrench className="size-4" />
            Dependency inventory
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          <div className="text-muted-foreground grid grid-cols-[minmax(0,1.7fr)_130px_160px_120px_100px] gap-2 px-2 text-[11px] font-medium">
            <span>Package</span>
            <span>Version drift</span>
            <span>Role</span>
            <span className="text-right">Usage</span>
            <span className="text-right">License</span>
          </div>
          {topDependencies.map((dependency) => {
            const hasDrift =
              dependency.latestVersion &&
              dependency.latestVersion !== dependency.version;
            return (
              <div
                key={`${dependency.packageName}-${dependency.version}`}
                className="grid grid-cols-[minmax(0,1.7fr)_130px_160px_120px_100px] items-center gap-2 rounded-md border bg-muted/20 px-2 py-2 transition-colors hover:bg-muted/35"
              >
                <div className="min-w-0">
                  <p className="truncate text-sm font-medium">
                    {dependency.packageName}
                  </p>
                  <p className="text-muted-foreground truncate text-xs">
                    {dependency.category}
                  </p>
                </div>
                <div className="text-xs">
                  <p className="font-medium">{dependency.version}</p>
                  <p className="text-muted-foreground">
                    {dependency.latestVersion ?? "n/a"}
                  </p>
                </div>
                <div className="flex flex-wrap gap-1">
                  {dependency.isCritical ? (
                    <Badge
                      variant="destructive"
                      className="h-5 px-1.5 text-[10px]"
                    >
                      <AlertTriangle className="mr-1 size-3" />
                      critical
                    </Badge>
                  ) : (
                    <Badge variant="outline" className="h-5 px-1.5 text-[10px]">
                      <ShieldCheck className="mr-1 size-3" />
                      standard
                    </Badge>
                  )}
                  {dependency.isDirect ? (
                    <Badge
                      variant="secondary"
                      className="h-5 px-1.5 text-[10px]"
                    >
                      <Package className="mr-1 size-3" />
                      direct
                    </Badge>
                  ) : null}
                  {dependency.isDevDependency ? (
                    <Badge variant="outline" className="h-5 px-1.5 text-[10px]">
                      dev
                    </Badge>
                  ) : null}
                  {dependency.isPeerDependency ? (
                    <Badge variant="outline" className="h-5 px-1.5 text-[10px]">
                      peer
                    </Badge>
                  ) : null}
                </div>
                <div className="text-right text-sm font-medium">
                  {formatCompactNumber(dependency.usageCount)}
                </div>
                <div className="text-muted-foreground truncate text-right text-xs">
                  {dependency.license ?? "Unknown"}
                  {hasDrift ? " • update" : ""}
                </div>
              </div>
            );
          })}
        </CardContent>
      </Card>
    </div>
  );
}

"use client";

import { useMemo, useState } from "react";

import {
  DataChartLegend,
  formatCompactNumber,
  SparkChart,
} from "@/components/charts";
import { getGrayscaleChartColor } from "@/components/charts/utils/chart-utils";

const OPENED_PRS_COLOR = getGrayscaleChartColor(3);
const MERGED_PRS_COLOR = getGrayscaleChartColor(1);
const COMMITS_COLOR = getGrayscaleChartColor(0);
const DEPLOYMENTS_COLOR = getGrayscaleChartColor(2);

/**
 * Represent one period in the repository history chart.
 */
export type RepositoryHistoryPoint = {
  label: string;
  openedPrs: number;
  mergedPrs: number;
  commits: number;
  deployments: number;
};

type RepositoryHistoryChartProps = {
  history: RepositoryHistoryPoint[];
};

type HistoryMetricKey = "openedPrs" | "commits" | "deployments";
type HistoryRangeKey = "3m" | "1y" | "all";

type MetricCardProps = {
  title: string;
  primaryValue: string;
  secondaryValue: string;
  trendLabel: string;
  sparkData: Array<{ label: string; value: number }>;
  sparkColor: string;
  timelineLabel: string;
  isEmpty: boolean;
  emptyMessage: string;
};

const HISTORY_RANGE_OPTIONS: Array<{
  key: HistoryRangeKey;
  label: string;
}> = [
  { key: "3m", label: "Last 3 months" },
  { key: "1y", label: "Last year" },
  { key: "all", label: "All-time" },
];

function buildSparkData(
  history: RepositoryHistoryPoint[],
  key: HistoryMetricKey,
): Array<{ label: string; value: number }> {
  return history.map((point) => ({
    label: point.label,
    value: point[key],
  }));
}

function hasNonZeroSeriesValue(
  data: Array<{ label: string; value: number }>,
): boolean {
  return data.some((point) => point.value > 0);
}

function selectHistoryRange(
  history: RepositoryHistoryPoint[],
  range: HistoryRangeKey,
): RepositoryHistoryPoint[] {
  if (range === "all") {
    return history;
  }
  if (range === "1y") {
    return history.slice(-12);
  }
  return history.slice(-3);
}

function getTrendLabel(data: Array<{ label: string; value: number }>): string {
  if (!hasNonZeroSeriesValue(data)) {
    return "No activity in selected range";
  }

  if (data.length < 2) {
    return "Not enough history yet";
  }

  const first = data[0]?.value ?? 0;
  const last = data[data.length - 1]?.value ?? first;
  const delta = last - first;

  if (delta === 0) {
    return "Flat trend";
  }

  const deltaLabel = `${delta > 0 ? "+" : ""}${formatCompactNumber(delta)}`;
  if (first === 0) {
    return `${deltaLabel} vs first period`;
  }

  const percent = Math.round((Math.abs(delta) / first) * 100);
  const direction = delta > 0 ? "up" : "down";
  return `${deltaLabel} (${percent}% ${direction})`;
}

function MetricCard({
  title,
  primaryValue,
  secondaryValue,
  trendLabel,
  sparkData,
  sparkColor,
  timelineLabel,
  isEmpty,
  emptyMessage,
}: MetricCardProps) {
  return (
    <div className="rounded-sm border bg-background/75 p-1.5">
      <div className="mb-1 flex items-center justify-between gap-2">
        <p className="text-muted-foreground text-[10px] font-medium">{title}</p>
        <p className="text-muted-foreground text-[10px]">{timelineLabel}</p>
      </div>
      <div className="mb-1 flex items-baseline justify-between gap-2">
        <p className="text-[11px] font-semibold">{primaryValue}</p>
        <p className="text-muted-foreground text-[10px]">{secondaryValue}</p>
      </div>
      {isEmpty ? (
        <div className="flex h-16 items-center justify-center rounded-sm border border-dashed border-border/70 bg-muted/20 px-2">
          <p className="text-muted-foreground text-center text-[10px]">
            {emptyMessage}
          </p>
        </div>
      ) : (
        <SparkChart className="h-16" data={sparkData} color={sparkColor} />
      )}
      <p className="text-muted-foreground mt-1 text-[10px]">{trendLabel}</p>
    </div>
  );
}

/**
 * Render compact trend mini-charts for PR, commit, and deployment history.
 *
 * @param history - Ordered period points used for chart plotting.
 * @returns Three chart variants with shared trend legends.
 */
export function RepositoryHistoryChart({
  history,
}: RepositoryHistoryChartProps) {
  const [historyRange, setHistoryRange] = useState<HistoryRangeKey>("3m");
  const rangeHistory = useMemo(
    () => selectHistoryRange(history, historyRange),
    [history, historyRange],
  );

  const openedPrTotal = rangeHistory.reduce(
    (sum, point) => sum + point.openedPrs,
    0,
  );
  const mergedPrTotal = rangeHistory.reduce(
    (sum, point) => sum + point.mergedPrs,
    0,
  );
  const commitTotal = rangeHistory.reduce(
    (sum, point) => sum + point.commits,
    0,
  );
  const deploymentTotal = rangeHistory.reduce(
    (sum, point) => sum + point.deployments,
    0,
  );
  const mergeEfficiency =
    openedPrTotal > 0 ? Math.round((mergedPrTotal / openedPrTotal) * 100) : 0;
  const firstPeriodLabel = rangeHistory[0]?.label ?? "N/A";
  const lastPeriodLabel = rangeHistory[rangeHistory.length - 1]?.label ?? "N/A";

  const timelineLabel = `${firstPeriodLabel} -> ${lastPeriodLabel}`;
  const prSparkData = buildSparkData(rangeHistory, "openedPrs");
  const commitSparkData = buildSparkData(rangeHistory, "commits");
  const deploymentSparkData = buildSparkData(rangeHistory, "deployments");

  return (
    <div className="space-y-1.5">
      <div className="flex flex-wrap items-center justify-between gap-1.5">
        <p className="text-muted-foreground text-[10px]">
          Filter activity history
        </p>
        <div className="inline-flex items-center rounded-sm border bg-muted/20 p-0.5">
          {HISTORY_RANGE_OPTIONS.map((option) => {
            const isActive = option.key === historyRange;
            return (
              <button
                key={option.key}
                type="button"
                aria-pressed={isActive}
                onClick={() => setHistoryRange(option.key)}
                className={`rounded-[3px] px-2 py-1 text-[10px] transition-colors ${
                  isActive
                    ? "bg-background text-foreground shadow-sm"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {option.label}
              </button>
            );
          })}
        </div>
      </div>

      <div className="grid gap-1.5 lg:grid-cols-3">
        <MetricCard
          title="PR flow"
          primaryValue={`${formatCompactNumber(openedPrTotal)} opened`}
          secondaryValue={`${formatCompactNumber(mergedPrTotal)} merged · ${mergeEfficiency}%`}
          trendLabel={getTrendLabel(prSparkData)}
          sparkData={prSparkData}
          sparkColor={OPENED_PRS_COLOR}
          timelineLabel={timelineLabel}
          isEmpty={!rangeHistory.length || openedPrTotal + mergedPrTotal === 0}
          emptyMessage="No pull request activity available."
        />
        <MetricCard
          title="Commit throughput"
          primaryValue={`${formatCompactNumber(commitTotal)} total`}
          secondaryValue={`${formatCompactNumber(rangeHistory[rangeHistory.length - 1]?.commits ?? 0)} latest`}
          trendLabel={getTrendLabel(commitSparkData)}
          sparkData={commitSparkData}
          sparkColor={COMMITS_COLOR}
          timelineLabel={timelineLabel}
          isEmpty={!rangeHistory.length || commitTotal === 0}
          emptyMessage="No commit history available."
        />
        <MetricCard
          title="Deployment cadence"
          primaryValue={`${formatCompactNumber(deploymentTotal)} total`}
          secondaryValue={`${formatCompactNumber(rangeHistory[rangeHistory.length - 1]?.deployments ?? 0)} latest`}
          trendLabel={getTrendLabel(deploymentSparkData)}
          sparkData={deploymentSparkData}
          sparkColor={DEPLOYMENTS_COLOR}
          timelineLabel={timelineLabel}
          isEmpty={!rangeHistory.length || deploymentTotal === 0}
          emptyMessage="No deployment history available."
        />

        <DataChartLegend
          className="px-1 text-[10px]"
          items={[
            { key: "openedPrs", label: "PRs opened", color: OPENED_PRS_COLOR },
            { key: "mergedPrs", label: "PRs merged", color: MERGED_PRS_COLOR },
            { key: "commits", label: "Commits", color: COMMITS_COLOR },
            {
              key: "deployments",
              label: "Deployments",
              color: DEPLOYMENTS_COLOR,
            },
          ]}
        />
      </div>
    </div>
  );
}

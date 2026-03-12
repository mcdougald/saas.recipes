"use client";

import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Line,
  LineChart,
  XAxis,
  YAxis,
} from "recharts";

import {
  type ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";

const pullRequestChartConfig = {
  openedPrs: {
    label: "PRs opened",
    color: "var(--chart-1)",
  },
  mergedPrs: {
    label: "PRs merged",
    color: "var(--chart-2)",
  },
} satisfies ChartConfig;

const commitsChartConfig = {
  commits: {
    label: "Commits",
    color: "var(--chart-4)",
  },
} satisfies ChartConfig;

const deploymentsChartConfig = {
  deployments: {
    label: "Deployments",
    color: "var(--chart-3)",
  },
} satisfies ChartConfig;

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

/**
 * Render compact trend mini-charts for PR, commit, and deployment history.
 *
 * @param history - Ordered period points used for chart plotting.
 * @returns Three chart variants with shared trend legends.
 */
export function RepositoryHistoryChart({
  history,
}: RepositoryHistoryChartProps) {
  const safeHistory = history.length
    ? history
    : [
        {
          label: "N/A",
          openedPrs: 0,
          mergedPrs: 0,
          commits: 0,
          deployments: 0,
        },
      ];
  const openedPrTotal = safeHistory.reduce(
    (sum, point) => sum + point.openedPrs,
    0,
  );
  const mergedPrTotal = safeHistory.reduce(
    (sum, point) => sum + point.mergedPrs,
    0,
  );
  const commitTotal = safeHistory.reduce(
    (sum, point) => sum + point.commits,
    0,
  );
  const deploymentTotal = safeHistory.reduce(
    (sum, point) => sum + point.deployments,
    0,
  );
  const mergeEfficiency =
    openedPrTotal > 0 ? Math.round((mergedPrTotal / openedPrTotal) * 100) : 0;

  return (
    <div className="grid gap-1.5 lg:grid-cols-3">
      <div className="rounded-sm border bg-background/75 p-1.5">
        <div className="mb-1 flex items-center justify-between gap-2">
          <p className="text-muted-foreground text-[10px] font-medium">
            PR flow
          </p>
          <p className="text-[10px] font-medium">{mergeEfficiency}% merged</p>
        </div>
        <ChartContainer
          config={pullRequestChartConfig}
          className="h-[108px] w-full"
        >
          <BarChart
            data={safeHistory}
            margin={{ top: 2, right: 4, left: -6, bottom: 0 }}
          >
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="label"
              tickLine={false}
              axisLine={false}
              tickMargin={6}
              minTickGap={12}
            />
            <YAxis tickLine={false} axisLine={false} width={18} />
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent indicator="dot" />}
            />
            <Bar
              dataKey="openedPrs"
              fill="var(--color-openedPrs)"
              radius={[2, 2, 0, 0]}
              maxBarSize={10}
            />
            <Bar
              dataKey="mergedPrs"
              fill="var(--color-mergedPrs)"
              radius={[2, 2, 0, 0]}
              maxBarSize={10}
            />
          </BarChart>
        </ChartContainer>
      </div>

      <div className="rounded-sm border bg-background/75 p-1.5">
        <div className="mb-1 flex items-center justify-between gap-2">
          <p className="text-muted-foreground text-[10px] font-medium">
            Commit throughput
          </p>
          <p className="text-[10px] font-medium">{commitTotal} total</p>
        </div>
        <ChartContainer
          config={commitsChartConfig}
          className="h-[108px] w-full"
        >
          <AreaChart
            data={safeHistory}
            margin={{ top: 2, right: 4, left: -6, bottom: 0 }}
          >
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="label"
              tickLine={false}
              axisLine={false}
              tickMargin={6}
              minTickGap={12}
            />
            <YAxis tickLine={false} axisLine={false} width={18} />
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent indicator="dot" />}
            />
            <Area
              dataKey="commits"
              type="monotone"
              stroke="var(--color-commits)"
              fill="var(--color-commits)"
              fillOpacity={0.22}
              strokeWidth={2}
              dot={false}
              activeDot={{ r: 3 }}
            />
          </AreaChart>
        </ChartContainer>
      </div>

      <div className="rounded-sm border bg-background/75 p-1.5">
        <div className="mb-1 flex items-center justify-between gap-2">
          <p className="text-muted-foreground text-[10px] font-medium">
            Deployment cadence
          </p>
          <p className="text-[10px] font-medium">{deploymentTotal} total</p>
        </div>
        <ChartContainer
          config={deploymentsChartConfig}
          className="h-[108px] w-full"
        >
          <LineChart
            data={safeHistory}
            margin={{ top: 2, right: 4, left: -6, bottom: 0 }}
          >
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="label"
              tickLine={false}
              axisLine={false}
              tickMargin={6}
              minTickGap={12}
            />
            <YAxis tickLine={false} axisLine={false} width={18} />
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent indicator="dot" />}
            />
            <Line
              dataKey="deployments"
              type="monotone"
              stroke="var(--color-deployments)"
              strokeWidth={2}
              dot={{ r: 2 }}
              activeDot={{ r: 3.5 }}
            />
          </LineChart>
        </ChartContainer>
      </div>

      <div className="text-muted-foreground flex flex-wrap gap-x-3 gap-y-1 px-1 text-[10px]">
        <span className="inline-flex items-center gap-1">
          <span className="bg-chart-1 size-1.5 rounded-full" />
          PRs opened
        </span>
        <span className="inline-flex items-center gap-1">
          <span className="bg-chart-2 size-1.5 rounded-full" />
          PRs merged
        </span>
        <span className="inline-flex items-center gap-1">
          <span className="bg-chart-4 size-1.5 rounded-full" />
          Commits
        </span>
        <span className="inline-flex items-center gap-1">
          <span className="bg-chart-3 size-1.5 rounded-full" />
          Deployments
        </span>
      </div>
    </div>
  );
}

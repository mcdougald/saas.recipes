"use client";

import * as React from "react";
import { Area, AreaChart } from "recharts";

import { ChartContainer, ChartTooltip } from "@/components/ui/chart";
import { cn } from "@/lib/utils";
import { getGrayscaleChartColor } from "../utils/chart-utils";
import { DataChartTooltipContent } from "./chart-tooltip";

/**
 * Describe a single spark-chart data point.
 */
export interface SparkDatum {
  label: string;
  value: number;
}

/**
 * Configure reusable spark chart rendering.
 */
export interface SparkChartProps extends React.ComponentProps<"div"> {
  data: SparkDatum[];
  color?: string;
  showTooltip?: boolean;
}

const SPARK_CHART_CONFIG = {
  value: {
    label: "Value",
    color: getGrayscaleChartColor(1),
  },
};

/**
 * Render a minimal trend chart inspired by Tremor's SparkChart pattern.
 *
 * @param props Spark chart presentation options.
 * @returns A compact chart suitable for KPI cards.
 */
export function SparkChart({
  data,
  color = getGrayscaleChartColor(1),
  showTooltip = true,
  className,
  ...props
}: SparkChartProps) {
  const gradientId = React.useId().replace(/:/g, "");

  return (
    <div className={cn("h-14 w-full", className)} {...props}>
      <ChartContainer
        config={SPARK_CHART_CONFIG}
        className="h-full w-full [&_.recharts-cartesian-grid]:hidden"
      >
        <AreaChart
          data={data}
          margin={{ top: 2, right: 0, left: 0, bottom: 2 }}
        >
          <defs>
            <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor={color} stopOpacity={0.35} />
              <stop offset="95%" stopColor={color} stopOpacity={0.03} />
            </linearGradient>
          </defs>

          {showTooltip ? (
            <ChartTooltip
              cursor={false}
              content={
                <DataChartTooltipContent
                  hideIndicator
                  labelFormatter={(label, payload) =>
                    payload?.[0]?.payload?.label ?? label
                  }
                />
              }
            />
          ) : null}

          <Area
            dataKey="value"
            stroke={color}
            strokeWidth={2}
            fill={`url(#${gradientId})`}
            type="monotone"
            isAnimationActive={false}
          />
        </AreaChart>
      </ChartContainer>
    </div>
  );
}

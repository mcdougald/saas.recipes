"use client";

import { CartesianGrid, Line, LineChart, XAxis, YAxis } from "recharts";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ChartContainer, ChartTooltip } from "@/components/ui/chart";
import { DataChartLegend } from "../components/chart-legend";
import { DataChartTooltipContent } from "../components/chart-tooltip";
import { getGrayscaleChartColor } from "../utils/chart-utils";
import { formatDateLabel } from "../utils/formatters";

const data = [
  { date: "2026-03-01", uptime: 99.94, latency: 210 },
  { date: "2026-03-02", uptime: 99.98, latency: 196 },
  { date: "2026-03-03", uptime: 99.91, latency: 224 },
  { date: "2026-03-04", uptime: 99.97, latency: 201 },
  { date: "2026-03-05", uptime: 99.99, latency: 188 },
  { date: "2026-03-06", uptime: 99.95, latency: 213 },
  { date: "2026-03-07", uptime: 99.96, latency: 205 },
];

const UPTIME_COLOR = getGrayscaleChartColor(0);
const LATENCY_COLOR = getGrayscaleChartColor(2);

const chartConfig = {
  uptime: {
    label: "Uptime %",
    color: UPTIME_COLOR,
  },
  latency: {
    label: "Latency ms",
    color: LATENCY_COLOR,
  },
};

/**
 * Render a reusable line graph container for service health metrics.
 *
 * @returns Card containing a line chart with dual series.
 */
export function LineGraphCard() {
  return (
    <Card className="border-border/50">
      <CardHeader>
        <CardTitle>Line Graph</CardTitle>
        <CardDescription>Uptime and p95 latency over a week</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <DataChartLegend
          items={[
            { key: "uptime", label: "Uptime %", color: UPTIME_COLOR },
            { key: "latency", label: "Latency ms", color: LATENCY_COLOR },
          ]}
        />
        <ChartContainer config={chartConfig} className="h-[260px] w-full">
          <LineChart
            data={data}
            margin={{ top: 6, right: 10, left: 6, bottom: 0 }}
          >
            <CartesianGrid vertical={false} strokeDasharray="2 3" />
            <XAxis
              dataKey="date"
              tickLine={false}
              axisLine={false}
              tickFormatter={(value) => formatDateLabel(value)}
            />
            <YAxis yAxisId="uptime" domain={[99.85, 100]} hide />
            <YAxis yAxisId="latency" orientation="right" hide />
            <ChartTooltip
              cursor={{ stroke: "hsl(var(--muted-foreground) / 0.45)" }}
              content={
                <DataChartTooltipContent
                  labelFormatter={(label) => formatDateLabel(String(label))}
                  valueFormatter={(value, key) =>
                    key === "uptime"
                      ? `${Number(value).toFixed(2)}%`
                      : `${value}ms`
                  }
                />
              }
            />
            <Line
              yAxisId="uptime"
              type="monotone"
              dataKey="uptime"
              stroke={UPTIME_COLOR}
              strokeWidth={2}
              dot={false}
            />
            <Line
              yAxisId="latency"
              type="monotone"
              dataKey="latency"
              stroke={LATENCY_COLOR}
              strokeWidth={2}
              dot={false}
            />
          </LineChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}

"use client";

import { Area, AreaChart, CartesianGrid, XAxis, YAxis } from "recharts";

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
import { formatCompactNumber, formatDateLabel } from "../utils/formatters";

const data = [
  { date: "2026-03-01", signups: 1450, activations: 710 },
  { date: "2026-03-02", signups: 1720, activations: 905 },
  { date: "2026-03-03", signups: 1640, activations: 860 },
  { date: "2026-03-04", signups: 1930, activations: 1040 },
  { date: "2026-03-05", signups: 2210, activations: 1215 },
  { date: "2026-03-06", signups: 2090, activations: 1128 },
  { date: "2026-03-07", signups: 2415, activations: 1320 },
];

const SIGNUPS_COLOR = getGrayscaleChartColor(0);
const ACTIVATIONS_COLOR = getGrayscaleChartColor(2);

const chartConfig = {
  signups: {
    label: "Signups",
    color: SIGNUPS_COLOR,
  },
  activations: {
    label: "Activations",
    color: ACTIVATIONS_COLOR,
  },
};

/**
 * Render a reusable area graph container for trend metrics.
 *
 * @returns Card containing an area chart with tooltip and legend.
 */
export function AreaGraphCard() {
  return (
    <Card className="border-border/50">
      <CardHeader>
        <CardTitle>Area Graph</CardTitle>
        <CardDescription>Weekly signups vs activations</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <DataChartLegend
          items={[
            { key: "signups", label: "Signups", color: SIGNUPS_COLOR },
            {
              key: "activations",
              label: "Activations",
              color: ACTIVATIONS_COLOR,
            },
          ]}
        />
        <ChartContainer config={chartConfig} className="h-[260px] w-full">
          <AreaChart
            data={data}
            margin={{ top: 6, right: 10, left: 4, bottom: 0 }}
          >
            <defs>
              <linearGradient id="areaSignups" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={SIGNUPS_COLOR} stopOpacity={0.3} />
                <stop
                  offset="95%"
                  stopColor={SIGNUPS_COLOR}
                  stopOpacity={0.05}
                />
              </linearGradient>
              <linearGradient id="areaActivations" x1="0" y1="0" x2="0" y2="1">
                <stop
                  offset="5%"
                  stopColor={ACTIVATIONS_COLOR}
                  stopOpacity={0.3}
                />
                <stop
                  offset="95%"
                  stopColor={ACTIVATIONS_COLOR}
                  stopOpacity={0.05}
                />
              </linearGradient>
            </defs>
            <CartesianGrid vertical={false} strokeDasharray="2 3" />
            <XAxis
              dataKey="date"
              tickLine={false}
              axisLine={false}
              tickFormatter={(value) => formatDateLabel(value)}
            />
            <YAxis
              tickLine={false}
              axisLine={false}
              width={44}
              tickFormatter={(value) => formatCompactNumber(value)}
            />
            <ChartTooltip
              cursor={{ stroke: "hsl(var(--muted-foreground) / 0.45)" }}
              content={
                <DataChartTooltipContent
                  labelFormatter={(label) => formatDateLabel(String(label))}
                  valueFormatter={(value) => formatCompactNumber(Number(value))}
                />
              }
            />
            <Area
              dataKey="signups"
              stroke={SIGNUPS_COLOR}
              strokeWidth={2}
              fill="url(#areaSignups)"
              type="monotone"
            />
            <Area
              dataKey="activations"
              stroke={ACTIVATIONS_COLOR}
              strokeWidth={2}
              fill="url(#areaActivations)"
              type="monotone"
            />
          </AreaChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}

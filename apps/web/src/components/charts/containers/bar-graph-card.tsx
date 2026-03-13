"use client";

import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ChartContainer, ChartTooltip } from "@/components/ui/chart";
import { DataChartTooltipContent } from "../components/chart-tooltip";
import { getGrayscaleChartColor } from "../utils/chart-utils";
import { formatCompactNumber } from "../utils/formatters";

const data = [
  { channel: "Organic", users: 5200 },
  { channel: "Direct", users: 3800 },
  { channel: "Referral", users: 2840 },
  { channel: "Paid", users: 4680 },
  { channel: "Social", users: 1980 },
];

const USERS_COLOR = getGrayscaleChartColor(1);

const chartConfig = {
  users: {
    label: "Users",
    color: USERS_COLOR,
  },
};

/**
 * Render a reusable bar graph container for categorical comparisons.
 *
 * @returns Card containing a bar graph with shared tooltip.
 */
export function BarGraphCard() {
  return (
    <Card className="border-border/50">
      <CardHeader>
        <CardTitle>Bar Graph</CardTitle>
        <CardDescription>Acquisition users by channel</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="h-[260px] w-full">
          <BarChart
            data={data}
            margin={{ top: 6, right: 8, left: 8, bottom: 0 }}
          >
            <CartesianGrid vertical={false} strokeDasharray="2 3" />
            <XAxis dataKey="channel" tickLine={false} axisLine={false} />
            <YAxis
              tickLine={false}
              axisLine={false}
              width={44}
              tickFormatter={(value) => formatCompactNumber(value)}
            />
            <ChartTooltip
              cursor={{ fill: "hsl(var(--muted) / 0.35)" }}
              content={
                <DataChartTooltipContent
                  valueFormatter={(value) => formatCompactNumber(Number(value))}
                />
              }
            />
            <Bar dataKey="users" fill={USERS_COLOR} radius={[4, 4, 0, 0]} />
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}

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
import { DataChartLegend } from "../components/chart-legend";
import { DataChartTooltipContent } from "../components/chart-tooltip";
import { formatCompactNumber } from "../utils/formatters";

const data = [
  { month: "Oct", selfServe: 540, salesLed: 220 },
  { month: "Nov", selfServe: 620, salesLed: 260 },
  { month: "Dec", selfServe: 710, salesLed: 300 },
  { month: "Jan", selfServe: 780, salesLed: 380 },
  { month: "Feb", selfServe: 860, salesLed: 410 },
  { month: "Mar", selfServe: 920, salesLed: 450 },
];

const chartConfig = {
  selfServe: {
    label: "Self-serve",
    color: "var(--chart-1)",
  },
  salesLed: {
    label: "Sales-led",
    color: "var(--chart-2)",
  },
};

/**
 * Render a reusable stacked bar graph for segmented comparisons.
 *
 * @returns Card containing a stacked bar chart with legend.
 */
export function StackedBarChartCard() {
  return (
    <Card className="border-border/50">
      <CardHeader>
        <CardTitle>Stacked Bar Graph</CardTitle>
        <CardDescription>New customers by acquisition motion</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <DataChartLegend
          items={[
            { key: "selfServe", label: "Self-serve", color: "var(--chart-1)" },
            { key: "salesLed", label: "Sales-led", color: "var(--chart-2)" },
          ]}
        />
        <ChartContainer config={chartConfig} className="h-[260px] w-full">
          <BarChart
            data={data}
            margin={{ top: 6, right: 8, left: 8, bottom: 0 }}
          >
            <CartesianGrid vertical={false} />
            <XAxis dataKey="month" tickLine={false} axisLine={false} />
            <YAxis
              tickLine={false}
              axisLine={false}
              width={40}
              tickFormatter={(value) => formatCompactNumber(value)}
            />
            <ChartTooltip
              content={
                <DataChartTooltipContent
                  valueFormatter={(value) => formatCompactNumber(Number(value))}
                />
              }
            />
            <Bar
              dataKey="selfServe"
              stackId="customers"
              fill="var(--chart-1)"
              radius={[4, 4, 0, 0]}
            />
            <Bar
              dataKey="salesLed"
              stackId="customers"
              fill="var(--chart-2)"
              radius={[4, 4, 0, 0]}
            />
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}

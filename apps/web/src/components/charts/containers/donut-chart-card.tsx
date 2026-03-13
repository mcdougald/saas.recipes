"use client";

import { Cell, Pie, PieChart } from "recharts";

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

const data = [
  { plan: "Starter", value: 2100, color: getGrayscaleChartColor(0) },
  { plan: "Growth", value: 1580, color: getGrayscaleChartColor(1) },
  { plan: "Scale", value: 840, color: getGrayscaleChartColor(2) },
  { plan: "Enterprise", value: 340, color: getGrayscaleChartColor(3) },
];

const chartConfig = {
  value: {
    label: "Customers",
    color: getGrayscaleChartColor(0),
  },
};

/**
 * Render a reusable donut chart container for composition breakdowns.
 *
 * @returns Card containing a donut chart with category legend.
 */
export function DonutChartCard() {
  return (
    <Card className="border-border/50">
      <CardHeader>
        <CardTitle>Donut Chart</CardTitle>
        <CardDescription>Customer mix by active plan</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <ChartContainer config={chartConfig} className="h-[260px] w-full">
          <PieChart>
            <ChartTooltip
              content={
                <DataChartTooltipContent
                  labelFormatter={(_, payload) => payload?.[0]?.payload?.plan}
                  valueFormatter={(value) =>
                    `${Number(value).toLocaleString()} users`
                  }
                />
              }
            />
            <Pie
              data={data}
              dataKey="value"
              nameKey="plan"
              cx="50%"
              cy="50%"
              innerRadius={56}
              outerRadius={92}
              stroke="transparent"
            >
              {data.map((entry) => (
                <Cell key={entry.plan} fill={entry.color} />
              ))}
            </Pie>
          </PieChart>
        </ChartContainer>
        <DataChartLegend
          items={data.map((item) => ({
            key: item.plan,
            label: item.plan,
            color: item.color,
          }))}
        />
      </CardContent>
    </Card>
  );
}

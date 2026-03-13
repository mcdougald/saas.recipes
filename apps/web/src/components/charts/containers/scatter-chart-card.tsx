"use client";

import {
  CartesianGrid,
  Scatter,
  ScatterChart,
  XAxis,
  YAxis,
  ZAxis,
} from "recharts";

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

const data = [
  { repo: "alpha", contributors: 14, stars: 1400, velocity: 38 },
  { repo: "bravo", contributors: 8, stars: 820, velocity: 26 },
  { repo: "charlie", contributors: 21, stars: 2950, velocity: 44 },
  { repo: "delta", contributors: 6, stars: 430, velocity: 19 },
  { repo: "echo", contributors: 17, stars: 2100, velocity: 36 },
  { repo: "foxtrot", contributors: 12, stars: 1260, velocity: 31 },
];

const SCATTER_COLOR = getGrayscaleChartColor(1);

const chartConfig = {
  stars: {
    label: "Stars",
    color: SCATTER_COLOR,
  },
};

/**
 * Render a reusable scatter chart container for correlation analysis.
 *
 * @returns Card containing a scatter chart with bubble sizing.
 */
export function ScatterChartCard() {
  return (
    <Card className="border-border/50">
      <CardHeader>
        <CardTitle>Scatter Chart</CardTitle>
        <CardDescription>Contributors vs stars by repository</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="h-[260px] w-full">
          <ScatterChart margin={{ top: 10, right: 8, left: 8, bottom: 4 }}>
            <CartesianGrid strokeDasharray="2 3" />
            <XAxis
              type="number"
              dataKey="contributors"
              name="Contributors"
              tickLine={false}
              axisLine={false}
            />
            <YAxis
              type="number"
              dataKey="stars"
              name="Stars"
              tickLine={false}
              axisLine={false}
              tickFormatter={(value) => `${Math.round(value / 1000)}k`}
            />
            <ZAxis type="number" dataKey="velocity" range={[70, 260]} />
            <ChartTooltip
              cursor={{
                stroke: "hsl(var(--muted-foreground) / 0.55)",
                strokeDasharray: "3 3",
              }}
              content={
                <DataChartTooltipContent
                  labelFormatter={(_, payload) => payload?.[0]?.payload?.repo}
                  valueFormatter={(value, key) => {
                    if (key === "stars") {
                      return `${Number(value).toLocaleString()} stars`;
                    }
                    if (key === "contributors") {
                      return `${value} contributors`;
                    }
                    return value;
                  }}
                />
              }
            />
            <Scatter data={data} fill={SCATTER_COLOR} />
          </ScatterChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}

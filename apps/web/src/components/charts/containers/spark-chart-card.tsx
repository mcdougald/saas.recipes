"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { SparkChart } from "../components/spark-chart";

const data = [
  { label: "Mon", value: 28 },
  { label: "Tue", value: 34 },
  { label: "Wed", value: 30 },
  { label: "Thu", value: 42 },
  { label: "Fri", value: 39 },
  { label: "Sat", value: 47 },
  { label: "Sun", value: 45 },
];

/**
 * Render a reusable spark chart card for compact KPI trends.
 *
 * @returns Card containing a minimalist spark chart.
 */
export function SparkChartCard() {
  return (
    <Card className="border-border/50">
      <CardHeader className="space-y-1 pb-3">
        <CardTitle>Spark Chart</CardTitle>
        <CardDescription>Weekly conversion trend (%)</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-1">
          <p className="text-2xl font-semibold">45.0%</p>
          <p className="text-xs text-muted-foreground">+6.8% vs prior week</p>
        </div>
        <SparkChart className="mt-4" data={data} color="var(--chart-2)" />
      </CardContent>
    </Card>
  );
}

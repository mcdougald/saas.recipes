"use client";

import { AreaGraphCard } from "./area-graph-card";
import { BarGraphCard } from "./bar-graph-card";
import { DonutChartCard } from "./donut-chart-card";
import { LineGraphCard } from "./line-chart-card";
import { ScatterChartCard } from "./scatter-chart-card";
import { SparkChartCard } from "./spark-chart-card";
import { StackedBarChartCard } from "./stacked-bar-chart-card";

/**
 * Render a responsive gallery of reusable basic chart containers.
 *
 * @returns A chart grid with common visualization patterns.
 */
export function BasicChartsGrid() {
  return (
    <section className="grid gap-4 md:grid-cols-2">
      <AreaGraphCard />
      <LineGraphCard />
      <BarGraphCard />
      <StackedBarChartCard />
      <DonutChartCard />
      <ScatterChartCard />
      <SparkChartCard />
    </section>
  );
}

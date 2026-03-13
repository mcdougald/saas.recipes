"use client";

import type * as React from "react";

import { cn } from "@/lib/utils";

/**
 * Describe one legend entry for a chart series.
 */
export interface ChartLegendItem {
  key: string;
  label: string;
  color: string;
}

/**
 * Configure the reusable chart legend component.
 */
export interface DataChartLegendProps extends React.ComponentProps<"div"> {
  items: ChartLegendItem[];
}

/**
 * Render a lightweight custom legend for chart cards and dashboards.
 *
 * @param props Legend presentation options.
 * @returns A responsive row of legend entries.
 */
export function DataChartLegend({
  items,
  className,
  ...props
}: DataChartLegendProps) {
  return (
    <div
      className={cn(
        "flex flex-wrap items-center justify-start gap-2.5 text-xs text-muted-foreground",
        className,
      )}
      {...props}
    >
      {items.map((item) => (
        <div
          key={item.key}
          className="bg-background/70 rounded-sm border border-border/60 px-2 py-1"
        >
          <div className="flex items-center gap-2">
            <span
              aria-hidden
              className="size-2 rounded-[2px]"
              style={{ backgroundColor: item.color }}
            />
            <span>{item.label}</span>
          </div>
        </div>
      ))}
    </div>
  );
}

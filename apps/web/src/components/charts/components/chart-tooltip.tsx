"use client";

import type * as React from "react";

import { ChartTooltipContent } from "@/components/ui/chart";
import { cn } from "@/lib/utils";

type TooltipValue = number | string | ReadonlyArray<number | string>;
type TooltipPayload = {
  value?: TooltipValue;
  name?: string;
  payload?: Record<string, unknown>;
};

/**
 * Configure shared tooltip behavior for chart containers.
 */
export type DataChartTooltipContentProps = React.ComponentProps<
  typeof ChartTooltipContent
> & {
  valueFormatter?: (value: TooltipValue, key: string) => React.ReactNode;
};

/**
 * Render a reusable chart tooltip with consistent spacing and value formatting.
 *
 * @param props Tooltip configuration and formatter options.
 * @returns A themed tooltip content component for Recharts.
 */
export function DataChartTooltipContent({
  className,
  valueFormatter,
  ...props
}: DataChartTooltipContentProps) {
  return (
    <ChartTooltipContent
      className={cn(
        "bg-popover/98 text-popover-foreground rounded-md border border-border/80 shadow-lg ring-1 ring-border/40 backdrop-blur-sm",
        className,
      )}
      formatter={(value, name) => {
        if (!valueFormatter) {
          return value;
        }

        if (value === undefined) {
          return value;
        }

        return valueFormatter(value, String(name));
      }}
      {...props}
    />
  );
}

/**
 * Create a standard tooltip label formatter that reads from a field key.
 *
 * @param key Field key to extract from each row.
 * @returns Formatter for `ChartTooltipContent`.
 */
export const createLabelFormatter =
  (key: string) =>
  (_label: React.ReactNode, payload?: TooltipPayload[]): React.ReactNode => {
    const row = payload?.[0]?.payload;
    if (!row || !(key in row)) {
      return null;
    }
    return String(row[key]);
  };

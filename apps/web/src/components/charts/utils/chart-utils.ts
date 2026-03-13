"use client";

import { type ChartConfig } from "@/components/ui/chart";

/**
 * Represent supported utility class types for chart color mapping.
 */
export type ColorUtility = "bg" | "stroke" | "fill" | "text";

/**
 * Provide a shared chart color palette inspired by Tremor chart utilities.
 */
export const chartColors = {
  blue: {
    bg: "bg-chart-1",
    stroke: "stroke-chart-1",
    fill: "fill-chart-1",
    text: "text-chart-1",
  },
  emerald: {
    bg: "bg-chart-2",
    stroke: "stroke-chart-2",
    fill: "fill-chart-2",
    text: "text-chart-2",
  },
  violet: {
    bg: "bg-chart-3",
    stroke: "stroke-chart-3",
    fill: "fill-chart-3",
    text: "text-chart-3",
  },
  amber: {
    bg: "bg-chart-4",
    stroke: "stroke-chart-4",
    fill: "fill-chart-4",
    text: "text-chart-4",
  },
  gray: {
    bg: "bg-chart-5",
    stroke: "stroke-chart-5",
    fill: "fill-chart-5",
    text: "text-chart-5",
  },
  cyan: {
    bg: "bg-cyan-500",
    stroke: "stroke-cyan-500",
    fill: "fill-cyan-500",
    text: "text-cyan-500",
  },
  pink: {
    bg: "bg-pink-500",
    stroke: "stroke-pink-500",
    fill: "fill-pink-500",
    text: "text-pink-500",
  },
  lime: {
    bg: "bg-lime-500",
    stroke: "stroke-lime-500",
    fill: "fill-lime-500",
    text: "text-lime-500",
  },
  fuchsia: {
    bg: "bg-fuchsia-500",
    stroke: "stroke-fuchsia-500",
    fill: "fill-fuchsia-500",
    text: "text-fuchsia-500",
  },
} as const satisfies {
  [color: string]: { [K in ColorUtility]: string };
};

/**
 * Define the default grayscale palette for chart series.
 */
export const DEFAULT_GRAYSCALE_CHART_COLORS = [
  "hsl(var(--foreground))",
  "hsl(var(--muted-foreground))",
  "hsl(var(--muted-foreground) / 0.82)",
  "hsl(var(--muted-foreground) / 0.68)",
  "hsl(var(--muted-foreground) / 0.54)",
] as const;

/**
 * Define supported chart color keys in the local palette.
 */
export type AvailableChartColorsKeys = keyof typeof chartColors;

/**
 * List all available chart colors.
 */
export const AvailableChartColors: AvailableChartColorsKeys[] = Object.keys(
  chartColors,
) as Array<AvailableChartColorsKeys>;

/**
 * Resolve a grayscale chart color by series index.
 *
 * @param index - Series index in rendered order.
 * @returns CSS color token for the requested index.
 */
export const getGrayscaleChartColor = (index: number): string =>
  DEFAULT_GRAYSCALE_CHART_COLORS[
    ((index % DEFAULT_GRAYSCALE_CHART_COLORS.length) +
      DEFAULT_GRAYSCALE_CHART_COLORS.length) %
      DEFAULT_GRAYSCALE_CHART_COLORS.length
  ];

/**
 * Build a deterministic category -> color mapping.
 *
 * @param categories Category keys from dataset series.
 * @param colors Ordered list of reusable chart colors.
 * @returns A map keyed by category name.
 */
export const constructCategoryColors = (
  categories: string[],
  colors: AvailableChartColorsKeys[],
): Map<string, AvailableChartColorsKeys> => {
  const categoryColors = new Map<string, AvailableChartColorsKeys>();
  categories.forEach((category, index) => {
    categoryColors.set(category, colors[index % colors.length]);
  });
  return categoryColors;
};

/**
 * Resolve the utility class for a given chart color + utility type.
 *
 * @param color Palette color key.
 * @param type Utility class type to extract.
 * @returns The utility class name with fallback to gray.
 */
export const getColorClassName = (
  color: AvailableChartColorsKeys,
  type: ColorUtility,
): string => {
  const fallbackColor = {
    bg: "bg-chart-5",
    stroke: "stroke-chart-5",
    fill: "fill-chart-5",
    text: "text-chart-5",
  };

  return chartColors[color]?.[type] ?? fallbackColor[type];
};

/**
 * Compute the Y-axis domain when optional min/max values are provided.
 *
 * @param autoMinValue Enable automatic lower bound from data.
 * @param minValue Explicit lower bound when auto minimum is disabled.
 * @param maxValue Explicit upper bound.
 * @returns Tuple used by Recharts YAxis `domain`.
 */
export const getYAxisDomain = (
  autoMinValue: boolean,
  minValue: number | undefined,
  maxValue: number | undefined,
): [number | "auto", number | "auto"] => {
  const minDomain = autoMinValue ? "auto" : (minValue ?? 0);
  const maxDomain = maxValue ?? "auto";
  return [minDomain, maxDomain];
};

/**
 * Check whether all items share one unique value for a specific key.
 *
 * @param array Collection of records to inspect.
 * @param keyToCheck Record key to compare.
 * @returns True when exactly one unique value exists.
 */
export const hasOnlyOneValueForKey = <
  T extends Record<string, unknown>,
  K extends keyof T,
>(
  array: T[],
  keyToCheck: K,
): boolean => {
  const values = new Set<unknown>();

  for (const obj of array) {
    if (!(keyToCheck in obj)) {
      continue;
    }

    values.add(obj[keyToCheck]);
    if (values.size > 1) {
      return false;
    }
  }

  return values.size === 1;
};

/**
 * Build a `ChartConfig` from data categories and selected palette colors.
 *
 * @param categories Ordered series names.
 * @param colors Optional palette override.
 * @returns Shadcn chart config with CSS custom property colors.
 */
export const buildChartConfig = (
  categories: string[],
  colors: AvailableChartColorsKeys[] = AvailableChartColors,
): ChartConfig => {
  const colorMap = constructCategoryColors(categories, colors);
  const configEntries = categories.map((category) => {
    const colorKey = colorMap.get(category) ?? "gray";
    return [
      category,
      {
        label: toTitleCase(category),
        color: `var(--${getColorClassName(colorKey, "text").replace(
          "text-",
          "",
        )})`,
      },
    ] as const;
  });

  return Object.fromEntries(configEntries);
};

/**
 * Convert a kebab/snake/camel label into title case text.
 *
 * @param value Raw key value.
 * @returns Human-readable title.
 */
export const toTitleCase = (value: string): string =>
  value
    .replace(/([a-z0-9])([A-Z])/g, "$1 $2")
    .replace(/[-_]/g, " ")
    .replace(/\s+/g, " ")
    .trim()
    .replace(/\w\S*/g, (word) => {
      const [first, ...rest] = word;
      return `${first.toUpperCase()}${rest.join("").toLowerCase()}`;
    });

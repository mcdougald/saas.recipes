"use client";

/**
 * Format a numeric value in compact notation.
 *
 * @param value Number to format.
 * @returns Localized compact representation.
 */
export const formatCompactNumber = (value: number): string =>
  new Intl.NumberFormat("en-US", {
    notation: "compact",
    maximumFractionDigits: 1,
  }).format(value);

/**
 * Format a numeric value as currency.
 *
 * @param value Number to format.
 * @param currency ISO currency code.
 * @returns Localized currency string.
 */
export const formatCurrency = (value: number, currency = "USD"): string =>
  new Intl.NumberFormat("en-US", {
    style: "currency",
    currency,
    maximumFractionDigits: 0,
  }).format(value);

/**
 * Format date labels for axis ticks and tooltips.
 *
 * @param value Date-like value to parse.
 * @param options Intl date formatting options.
 * @returns Formatted date label.
 */
export const formatDateLabel = (
  value: string | number | Date,
  options: Intl.DateTimeFormatOptions = { month: "short", day: "numeric" },
): string =>
  new Date(value).toLocaleDateString("en-US", {
    ...options,
  });

/**
 * Build deterministic sample time-series data for demos and placeholders.
 *
 * @param points Number of data points to create.
 * @param keys Metric keys to generate per row.
 * @returns Array of generated records.
 */
export const createDemoSeries = (
  points: number,
  keys: readonly string[],
): Array<Record<string, number | string>> => {
  const now = Date.now();
  return Array.from({ length: points }, (_, index) => {
    const date = new Date(now - (points - index) * 24 * 60 * 60 * 1000);
    const row: Record<string, number | string> = {
      date: date.toISOString().slice(0, 10),
    };

    keys.forEach((key, keyIndex) => {
      const wave = Math.sin((index + keyIndex) / 3);
      const drift = 120 + index * 5;
      const seasonal = Math.round((wave + 1) * 45);
      row[key] = drift + seasonal + keyIndex * 35;
    });

    return row;
  });
};

# Charting Components

Reusable charting primitives and container cards for the Next.js app.

## Directory layout

- `components/`: shared legend, tooltip, and spark chart primitives.
- `containers/`: ready-to-render chart cards (area, bar, donut, line, stacked, scatter, spark).
- `utils/`: Tremor-inspired chart helpers plus formatters.

## Quick usage

```tsx
import { BasicChartsGrid } from "@/components/charts";

export default function ChartsPage() {
  return <BasicChartsGrid />;
}
```

## Utilities

`utils/chart-utils.ts` includes:

- `chartColors`
- `constructCategoryColors`
- `getColorClassName`
- `getYAxisDomain`
- `hasOnlyOneValueForKey`
- `buildChartConfig`

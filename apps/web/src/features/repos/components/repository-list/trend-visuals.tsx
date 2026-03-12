type TrendSparklineProps = {
  values: number[];
  className?: string;
};

/**
 * Render a compact sparkline from a series of numeric values.
 *
 * @param values - Ordered numeric points to plot.
 * @param className - Optional class name for the SVG container.
 * @returns A minimal SVG line chart for dense dashboards.
 */
export function TrendSparkline({ values, className }: TrendSparklineProps) {
  const safeValues = values.length > 0 ? values : [0];
  const max = Math.max(...safeValues, 1);
  const min = Math.min(...safeValues, 0);
  const span = Math.max(max - min, 1);
  const width = 160;
  const height = 42;
  const points = safeValues.map((value, index) => {
    const x = (index / Math.max(safeValues.length - 1, 1)) * width;
    const y = height - ((value - min) / span) * (height - 6) - 3;
    return `${x.toFixed(1)},${y.toFixed(1)}`;
  });

  return (
    <svg
      viewBox={`0 0 ${width} ${height}`}
      className={className}
      role="img"
      aria-label="Trend sparkline"
      preserveAspectRatio="none"
    >
      <polyline
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        points={points.join(" ")}
      />
    </svg>
  );
}

type TrendBar = {
  key: string;
  label: string;
  value: number;
};

type ComparativeBarsProps = {
  bars: TrendBar[];
};

/**
 * Visualize related metrics as normalized horizontal comparison bars.
 *
 * @param bars - Labelled values displayed at relative widths.
 * @returns Small bar chart suited for repository cards.
 */
export function ComparativeBars({ bars }: ComparativeBarsProps) {
  const largest = Math.max(...bars.map((bar) => bar.value), 1);

  return (
    <div className="space-y-2">
      {bars.map((bar) => (
        <div key={bar.key} className="space-y-1">
          <div className="text-muted-foreground flex items-center justify-between gap-2 text-[10px]">
            <span>{bar.label}</span>
            <span className="text-foreground font-medium">{bar.value}</span>
          </div>
          <div className="h-1.5 rounded-full bg-muted/60">
            <div
              className="h-full rounded-full bg-primary/80"
              style={{
                width: `${Math.max(6, Math.round((bar.value / largest) * 100))}%`,
              }}
            />
          </div>
        </div>
      ))}
    </div>
  );
}

type DeltaSplitProps = {
  additions: number;
  deletions: number;
};

/**
 * Compare additions and deletions as a split stacked bar.
 *
 * @param additions - Added lines within the selected period.
 * @param deletions - Deleted lines within the selected period.
 * @returns Proportional split bar showing code churn composition.
 */
export function DeltaSplit({ additions, deletions }: DeltaSplitProps) {
  const total = additions + deletions;
  const additionWidth = total > 0 ? Math.round((additions / total) * 100) : 50;
  const deletionWidth = Math.max(0, 100 - additionWidth);

  return (
    <div className="space-y-1.5">
      <div className="text-muted-foreground flex items-center justify-between text-[10px]">
        <span>Code churn composition</span>
        <span className="text-foreground font-medium">{total}</span>
      </div>
      <div className="flex h-2 overflow-hidden rounded-full bg-muted/60">
        <div
          className="h-full bg-emerald-500/70"
          style={{ width: `${additionWidth}%` }}
        />
        <div
          className="h-full bg-rose-500/70"
          style={{ width: `${deletionWidth}%` }}
        />
      </div>
      <div className="text-muted-foreground flex items-center justify-between text-[10px]">
        <span>+{additions}</span>
        <span>-{deletions}</span>
      </div>
    </div>
  );
}

type TrendDeltaBadgeProps = {
  label: string;
  value: number;
  suffix?: string;
};

/**
 * Render a compact badge showing positive/negative directional movement.
 *
 * @param label - Label describing the compared metric.
 * @param value - Signed change value where positive means improvement.
 * @param suffix - Optional unit suffix appended after the number.
 * @returns Small trend chip with directional color treatment.
 */
export function TrendDeltaBadge({
  label,
  value,
  suffix = "%",
}: TrendDeltaBadgeProps) {
  const rounded = Math.round(value);
  const isUp = rounded >= 0;

  return (
    <div className="inline-flex items-center gap-1 rounded-md border bg-background/70 px-1.5 py-1 text-[10px]">
      <span className="text-muted-foreground">{label}</span>
      <span
        className={
          isUp
            ? "font-semibold text-emerald-700 dark:text-emerald-300"
            : "font-semibold text-rose-700 dark:text-rose-300"
        }
      >
        {isUp ? "+" : ""}
        {rounded}
        {suffix}
      </span>
    </div>
  );
}

type SignalMeterProps = {
  label: string;
  value: number;
  helper?: string;
};

/**
 * Show a normalized score as a compact progress meter.
 *
 * @param label - Score label shown above the meter.
 * @param value - Score value expected in the 0-100 range.
 * @param helper - Optional short context shown under the meter.
 * @returns Tiny score module used in dense repository headers.
 */
export function SignalMeter({ label, value, helper }: SignalMeterProps) {
  const safeValue = Math.max(0, Math.min(100, Math.round(value)));
  const toneClassName =
    safeValue >= 75
      ? "bg-emerald-500/70"
      : safeValue >= 45
        ? "bg-amber-500/70"
        : "bg-rose-500/70";

  return (
    <div className="rounded-sm border bg-background/70 px-2 py-1.5">
      <div className="mb-1 flex items-center justify-between gap-2 text-[10px]">
        <p className="text-muted-foreground">{label}</p>
        <p className="text-foreground font-semibold">{safeValue}</p>
      </div>
      <div className="h-1.5 overflow-hidden rounded-full bg-muted/60">
        <div
          className={`h-full ${toneClassName}`}
          style={{ width: `${safeValue}%` }}
        />
      </div>
      {helper ? (
        <p className="text-muted-foreground mt-1 text-[10px]">{helper}</p>
      ) : null}
    </div>
  );
}

"use client";

import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import * as React from "react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { useI18n } from "@/hooks/use-i18n";

type ToggleThemeVariant = "icon" | "labeled";

/**
 * Render an interactive theme switch that toggles between light and dark modes.
 *
 * @param props.variant Control whether the switch renders icon-only or with a text label.
 * @param props.className Merge additional classes into the root button.
 * @returns A button that flips the current theme between black/white modes.
 */
export function ToggleTheme({
  variant = "icon",
  className,
}: {
  variant?: ToggleThemeVariant;
  className?: string;
}) {
  const { t } = useI18n();
  const { resolvedTheme, setTheme } = useTheme();
  const [mounted, setMounted] = React.useState(false);
  const isDark = resolvedTheme === "dark";

  React.useEffect(() => {
    setMounted(true);
  }, []);

  const handleToggle = React.useCallback(() => {
    setTheme(isDark ? "light" : "dark");
  }, [isDark, setTheme]);

  return (
    <Button
      type="button"
      variant="ghost"
      size={variant === "icon" ? "icon" : "default"}
      aria-label={t("theme.label")}
      aria-pressed={isDark}
      onClick={handleToggle}
      className={cn(
        "relative overflow-hidden border border-black/15 bg-white/90 text-black shadow-sm backdrop-blur transition-all hover:bg-white",
        "dark:border-white/20 dark:bg-black/90 dark:text-white dark:hover:bg-black",
        variant === "icon"
          ? "size-9 rounded-full"
          : "h-10 rounded-full px-2.5 font-medium",
        className,
      )}
    >
      {variant === "labeled" ? (
        <span className="pr-2 text-[11px] font-semibold uppercase tracking-wide text-black/70 dark:text-white/70">
          {t("theme.label")}
        </span>
      ) : null}
      <span className="relative inline-flex h-6 w-11 shrink-0 items-center rounded-full border border-black/15 bg-black/8 p-0.5 dark:border-white/20 dark:bg-white/10">
        <span
          className={cn(
            "absolute inset-y-1 h-4 w-4 rounded-full bg-black shadow-sm transition-transform dark:bg-white",
            mounted && isDark ? "translate-x-5" : "translate-x-0",
          )}
        />
        <Sun
          className={cn(
            "relative z-10 ml-0.5 h-3 w-3 transition-colors",
            !mounted || !isDark ? "text-white" : "text-black/40",
          )}
        />
        <Moon
          className={cn(
            "relative z-10 ml-auto mr-0.5 h-3 w-3 transition-colors",
            mounted && isDark ? "text-black" : "text-white/50",
          )}
        />
      </span>
    </Button>
  );
}

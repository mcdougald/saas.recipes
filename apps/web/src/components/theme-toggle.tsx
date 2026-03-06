"use client";

import { Monitor, Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import * as React from "react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useI18n } from "@/hooks/use-i18n";

type ToggleThemeVariant = "icon" | "labeled" | "footer";
type ThemeMode = "light" | "dark" | "system";

function isThemeMode(value: string): value is ThemeMode {
  return value === "light" || value === "dark" || value === "system";
}

function syncDocumentThemeClass(nextTheme: ThemeMode) {
  if (typeof document === "undefined" || typeof window === "undefined") {
    return;
  }

  const shouldUseDark =
    nextTheme === "dark" ||
    (nextTheme === "system" &&
      window.matchMedia("(prefers-color-scheme: dark)").matches);

  document.documentElement.classList.toggle("dark", shouldUseDark);
}

function resolveNextTheme(nextTheme: ThemeMode): "light" | "dark" {
  if (nextTheme === "light" || nextTheme === "dark") {
    return nextTheme;
  }

  if (typeof window === "undefined") {
    return "light";
  }

  return window.matchMedia("(prefers-color-scheme: dark)").matches
    ? "dark"
    : "light";
}

/**
 * Render an interactive theme switch that toggles between light and dark modes.
 *
 * @param props.variant Control whether the switch renders icon-only, labeled, or footer-optimized.
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
  const { resolvedTheme, setTheme, theme } = useTheme();
  const [mounted, setMounted] = React.useState(false);
  const [optimisticResolvedTheme, setOptimisticResolvedTheme] = React.useState<
    "light" | "dark" | null
  >(null);
  const effectiveResolvedTheme = optimisticResolvedTheme ?? resolvedTheme;
  const isDark = effectiveResolvedTheme === "dark";
  const isFooter = variant === "footer";
  const isLabeled = variant === "labeled" || isFooter;
  const selectedTheme = theme ?? "system";

  React.useEffect(() => {
    setMounted(true);
  }, []);

  React.useEffect(() => {
    if (resolvedTheme === "light" || resolvedTheme === "dark") {
      setOptimisticResolvedTheme(null);
    }
  }, [resolvedTheme]);

  const handleThemeChange = React.useCallback(
    (nextTheme: ThemeMode) => {
      setOptimisticResolvedTheme(resolveNextTheme(nextTheme));
      syncDocumentThemeClass(nextTheme);
      setTheme(nextTheme);
    },
    [setTheme],
  );

  const handleToggle = React.useCallback(() => {
    handleThemeChange(isDark ? "light" : "dark");
  }, [handleThemeChange, isDark]);

  if (variant === "icon") {
    const TriggerIcon = !mounted || selectedTheme === "system" ? Monitor : isDark ? Moon : Sun;

    return (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className={cn("rounded-full text-muted-foreground hover:text-foreground", className)}
            aria-label={t("theme.label")}
          >
            <TriggerIcon className="h-[1.1rem] w-[1.1rem]" />
            <span className="sr-only">{t("theme.label")}</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-44">
          <DropdownMenuLabel>{t("theme.label")}</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuRadioGroup
            value={selectedTheme}
            onValueChange={(value) => {
              if (!isThemeMode(value)) return;
              handleThemeChange(value);
            }}
          >
            <DropdownMenuRadioItem value="light">Light</DropdownMenuRadioItem>
            <DropdownMenuRadioItem value="dark">Dark</DropdownMenuRadioItem>
            <DropdownMenuRadioItem value="system">System</DropdownMenuRadioItem>
          </DropdownMenuRadioGroup>
        </DropdownMenuContent>
      </DropdownMenu>
    );
  }

  return (
    <Button
      type="button"
      variant="ghost"
      size="default"
      aria-label={t("theme.label")}
      aria-pressed={isDark}
      onClick={handleToggle}
      className={cn(
        "group relative overflow-hidden border border-black/8 bg-white text-black shadow-sm transition-all",
        "dark:border-white/12 dark:bg-black dark:text-white",
        isFooter
          ? "h-12 rounded-full bg-card border-none shadow-none px-3.5 font-medium dark:border-white/10 dark:bg-zinc-950"
          : "h-11 rounded-md border-black/6 bg-card px-3 font-medium dark:border-white/10 dark:bg-zinc-950",
        className,
      )}
    >
      {isLabeled ? (
        <span
          className={cn(
            "font-semibold uppercase text-black/45 dark:text-white/45",
            isFooter ? "pr-2.5 text-[10px] tracking-[0.16em]" : "pr-2 text-[11px] tracking-wide",
          )}
        >
          {t("theme.label")}
        </span>
      ) : null}

      <span
        className={cn(
          "relative inline-flex shrink-0 items-center rounded-full border border-black/8 bg-zinc-200 p-0.5 transition-colors duration-300 dark:border-white/12 dark:bg-zinc-800",
          isFooter ? "h-8 w-16" : "h-7 w-14",
        )}
      >
        <Sun
          className={cn(
            "absolute transition-all duration-400",
            isFooter ? "left-2 h-4 w-4" : "left-1.5 h-3.5 w-3.5",
            !mounted || !isDark ? "scale-100 text-amber-500 opacity-100" : "scale-75 text-zinc-500 opacity-45",
          )}
        />
        <Moon
          className={cn(
            "absolute transition-all duration-400",
            isFooter ? "right-2 h-4 w-4" : "right-1.5 h-3.5 w-3.5",
            mounted && isDark ? "scale-100 text-indigo-200 opacity-100" : "scale-75 text-zinc-400 opacity-45",
          )}
        />

        <span
          className={cn(
            "absolute left-0.5 rounded-full bg-white shadow-[0_1px_6px_rgba(0,0,0,0.2)] transition-transform duration-400 ease-out group-hover:scale-[1.02] dark:bg-black",
            isFooter ? "h-7 w-7" : "h-6 w-6",
            mounted && isDark ? (isFooter ? "translate-x-8" : "translate-x-7") : "translate-x-0",
          )}
        >
          <Sun
            className={cn(
              "absolute inset-0 m-auto transition-all duration-400",
              isFooter ? "h-4 w-4" : "h-3.5 w-3.5",
              !mounted || !isDark ? "rotate-0 scale-100 text-amber-500 opacity-100" : "-rotate-45 scale-0 text-zinc-400 opacity-0",
            )}
          />
          <Moon
            className={cn(
              "absolute inset-0 m-auto transition-all duration-400",
              isFooter ? "h-4 w-4" : "h-3.5 w-3.5",
              mounted && isDark ? "rotate-0 scale-100 text-indigo-200 opacity-100" : "rotate-45 scale-0 text-zinc-400 opacity-0",
            )}
          />
        </span>
      </span>
    </Button>
  );
}

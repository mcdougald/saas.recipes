"use client";

import { type ReactNode } from "react";

import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

type NavBadgeColor = "violet" | "green";
type NavBadgeVariant = "default" | "subtle";

interface NavBadgeProps {
  children: ReactNode;
  color?: NavBadgeColor;
  variant?: NavBadgeVariant;
}

/**
 * Render a compact badge for sidebar nav items.
 *
 * @param props - Badge content and visual options.
 * @param props.children - Visible badge text.
 * @param props.color - Optional semantic color hint.
 * @param props.variant - Badge variant for default or subdued contexts.
 * @returns Styled badge element hidden in icon-collapsed sidebar mode.
 */
export function NavBadge({
  children,
  color,
  variant = "default",
}: NavBadgeProps) {
  const colorClass =
    color === "green"
      ? "border-emerald-400/40 bg-emerald-500/14 text-emerald-900 dark:text-emerald-200"
      : color === "violet"
        ? "border-violet-400/40 bg-violet-500/14 text-violet-900 dark:text-violet-200"
        : "border-foreground/15 bg-foreground/6 text-foreground/90";

  return (
    <Badge
      className={cn(
        "ml-auto inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-medium shadow-[inset_0_1px_0_hsl(var(--background)/0.7)] group-data-[collapsible=icon]:hidden",
        variant === "subtle"
          ? "border-foreground/12 bg-foreground/4 text-foreground/80"
          : colorClass,
      )}
    >
      {children}
    </Badge>
  );
}

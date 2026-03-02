import type { ReactNode } from "react";

import { cn } from "@/lib/utils";

/**
 * Define the configurable API for dashboard page headers.
 */
export interface DashboardPageHeaderProps {
  /**
   * Render the primary page title.
   */
  title: ReactNode;
  /**
   * Render supporting copy below the title.
   */
  description?: ReactNode;
  /**
   * Render optional content above the title.
   */
  eyebrow?: ReactNode;
  /**
   * Render optional right-aligned actions.
   */
  actions?: ReactNode;
  /**
   * Render optional content below the description.
   */
  children?: ReactNode;
  /**
   * Override the root container classes.
   */
  containerClassName?: string;
  /**
   * Override the title and description content wrapper classes.
   */
  contentClassName?: string;
  /**
   * Override the header row layout classes.
   */
  layoutClassName?: string;
  /**
   * Override the title classes.
   */
  titleClassName?: string;
  /**
   * Override the description classes.
   */
  descriptionClassName?: string;
  /**
   * Override the actions wrapper classes.
   */
  actionsClassName?: string;
}

/**
 * Render a reusable header for dashboard pages.
 *
 * @param props - Header content and style overrides.
 * @returns A responsive page header container with title and description.
 *
 * @example
 * <DashboardPageHeader
 *   title="Tracked Recipes"
 *   description="Monitor health, activity, and delivery."
 * />
 */
export function DashboardPageHeader({
  title,
  description,
  eyebrow,
  actions,
  children,
  containerClassName,
  contentClassName,
  layoutClassName,
  titleClassName,
  descriptionClassName,
  actionsClassName,
}: DashboardPageHeaderProps) {
  return (
    <div className={cn("px-4 py-4 lg:px-6", containerClassName)}>
      <div
        className={cn(
          "flex flex-col gap-2",
          actions && "sm:flex-row sm:items-start sm:justify-between sm:gap-4",
          layoutClassName,
        )}
      >
        <div className={cn("space-y-2", contentClassName)}>
          {eyebrow}
          <h1 className={cn("text-3xl font-bold tracking-tight md:text-4xl", titleClassName)}>
            {title}
          </h1>
          {description ? (
            <p className={cn("text-muted-foreground", descriptionClassName)}>{description}</p>
          ) : null}
          {children}
        </div>
        {actions ? <div className={cn("shrink-0", actionsClassName)}>{actions}</div> : null}
      </div>
    </div>
  );
}

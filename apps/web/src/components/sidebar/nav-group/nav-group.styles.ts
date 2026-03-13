/**
 * Shared sidebar navigation item classes.
 */
export const MENU_ITEM_BASE_CLASS =
  "group/link relative overflow-hidden rounded-md border border-transparent transition-colors duration-150 hover:border-foreground/12 hover:bg-foreground/3 hover:text-inherit group-data-[collapsible=icon]:mx-auto group-data-[collapsible=icon]:justify-center";

/**
 * Active state styling for sidebar menu items.
 */
export const MENU_ITEM_ACTIVE_CLASS =
  "border-foreground/44 bg-foreground/8 text-inherit shadow-[inset_1px_0_0_hsl(var(--foreground)/0.26),inset_0_1px_0_hsl(var(--background)/1),0_8px_18px_hsl(var(--foreground)/0.16)] hover:border-foreground/62 hover:shadow-[inset_1px_0_0_hsl(var(--foreground)/0.34),inset_0_1px_0_hsl(var(--background)/1),0_10px_24px_hsl(var(--foreground)/0.24)] before:pointer-events-none before:absolute before:inset-[1px] before:rounded-[calc(var(--radius)-2px)] before:[background:repeating-conic-gradient(from_0deg,hsl(var(--primary)/0.34)_0deg,hsl(var(--primary)/0)_14deg,hsl(var(--ring)/0.52)_22deg,hsl(var(--primary)/0)_34deg)] before:animate-[spin_12s_linear_infinite] before:opacity-92 hover:before:opacity-100 after:pointer-events-none after:absolute after:inset-0 after:rounded-[inherit] after:p-px after:content-[''] after:[background:conic-gradient(from_0deg,hsl(var(--primary)/0.45),hsl(var(--ring)/0.95),hsl(var(--primary)/0.88),hsl(var(--ring)/0.92),hsl(var(--primary)/0.45))] after:[mask:linear-gradient(#fff_0_0)_content-box,linear-gradient(#fff_0_0)] after:mask-exclude after:opacity-90 after:animate-[spin_3.4s_linear_infinite] hover:after:opacity-100 hover:after:animate-[spin_1.6s_linear_infinite] dark:border-foreground/42 dark:bg-foreground/14 dark:hover:border-foreground/62 dark:shadow-[inset_1px_0_0_hsl(var(--foreground)/0.24),inset_0_1px_0_hsl(var(--background)/0.65),0_8px_22px_hsl(var(--background)/0.86)] dark:hover:shadow-[inset_1px_0_0_hsl(var(--foreground)/0.34),inset_0_1px_0_hsl(var(--background)/0.78),0_10px_28px_hsl(var(--background)/0.95)] dark:before:[background:repeating-conic-gradient(from_0deg,hsl(var(--primary)/0.46)_0deg,hsl(var(--primary)/0)_13deg,hsl(var(--ring)/0.66)_21deg,hsl(var(--primary)/0)_33deg)]";

/**
 * Base icon color transitions for sidebar menu items.
 */
export const MENU_ICON_BASE_CLASS =
  "transition-colors text-muted-foreground group-hover/link:text-foreground";

/**
 * Icon style for active sidebar menu items.
 */
export const MENU_ICON_ACTIVE_CLASS = "text-foreground";

/**
 * Disabled visual style for locked menu items.
 */
export const MENU_ITEM_LOCKED_CLASS =
  "cursor-not-allowed border-dashed border-foreground/15 bg-foreground/2.5 text-muted-foreground hover:border-foreground/20 hover:bg-foreground/4 hover:text-muted-foreground";

/**
 * Icon style for locked menu items.
 */
export const MENU_ICON_LOCKED_CLASS = "text-muted-foreground/75";

const GROUP_TONE_CLASSES = [
  "border-sidebar-border/70 bg-sidebar-accent/20",
  "border-sidebar-border/65 bg-sidebar-accent/12",
  "border-sidebar-border/60 bg-sidebar-accent/16",
] as const;

/**
 * Resolve a visual tone class for a sidebar group index.
 *
 * @param groupIndex - Zero-based index of the group in sidebar ordering.
 * @returns A tone class string used to vary group section surfaces.
 */
export function getGroupToneClass(groupIndex: number): string {
  return GROUP_TONE_CLASSES[groupIndex % GROUP_TONE_CLASSES.length] ?? "";
}

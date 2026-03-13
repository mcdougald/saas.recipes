import { type NavCollapsible, type NavItem } from "@/lib/types";

/**
 * Determine whether a route should be considered active for a nav item.
 *
 * Supports exact route matches, configured `activeUrls` patterns
 * (including Next.js dynamic segment notation), and optional top-level
 * section matching for main navigation groups.
 *
 * @param href - Current pathname.
 * @param item - Navigation item to evaluate.
 * @param mainNav - Match by first path segment when true.
 * @returns True when the item should render as active.
 */
export function checkIsActive(
  href: string,
  item: NavItem,
  mainNav = false,
): boolean {
  const currentPath = normalizePath(href);
  const patternMatches = getActivePatterns(item).some((pattern) =>
    matchesPathPattern(currentPath, pattern),
  );

  if (patternMatches) {
    return true;
  }

  if (isNavCollapsible(item)) {
    return item.items.some((subItem) => checkIsActive(currentPath, subItem));
  }

  const itemUrl = hrefToPath(item.url);

  return (
    currentPath === itemUrl ||
    normalizePath(currentPath) === normalizePath(itemUrl) ||
    (mainNav &&
      currentPath.split("/")[1] !== "" &&
      currentPath.split("/")[1] === normalizePath(itemUrl).split("/")[1])
  );
}

/**
 * Determine whether a menu item should render as locked.
 *
 * @param item - Navigation item config.
 * @param isAuthenticated - Whether the current user is authenticated.
 * @returns True when auth is required and user is unauthenticated.
 */
export function checkIsLocked(
  item: NavItem,
  isAuthenticated: boolean,
): boolean {
  return Boolean(item.requiresAuth && !isAuthenticated);
}

/**
 * Determine whether any item in a group is active for current pathname.
 *
 * @param href - Current pathname.
 * @param items - Group menu items.
 * @returns True when at least one group item is active.
 */
export function checkIsGroupActive(href: string, items: NavItem[]): boolean {
  return items.some((item) => checkIsActive(href, item, true));
}

/**
 * Compare current path with a path pattern that can contain dynamic
 * segments in `[param]` format.
 *
 * @param currentPath - Current pathname.
 * @param pattern - Path pattern to evaluate.
 * @returns True when pattern matches current path.
 */
export function matchesPathPattern(
  currentPath: string,
  pattern: string,
): boolean {
  const normalizedCurrent = normalizePath(currentPath);
  const normalizedPattern = normalizePath(pattern);

  if (normalizedCurrent === normalizedPattern) {
    return true;
  }

  const currentParts = normalizedCurrent.split("/").filter(Boolean);
  const patternParts = normalizedPattern.split("/").filter(Boolean);

  if (currentParts.length !== patternParts.length) {
    return false;
  }

  return patternParts.every((segment, index) => {
    if (segment.startsWith("[") && segment.endsWith("]")) {
      return currentParts[index]?.length > 0;
    }

    return segment === currentParts[index];
  });
}

/**
 * Normalize a path by removing query/hash and trailing slashes.
 *
 * @param path - Input path.
 * @returns Normalized pathname with stable slash behavior.
 */
export function normalizePath(path: string | null | undefined): string {
  if (!path) {
    return "/";
  }

  const normalized = path.split("?")[0]?.split("#")[0] ?? "/";
  if (normalized === "/") {
    return normalized;
  }

  return normalized.endsWith("/") ? normalized.slice(0, -1) : normalized;
}

/**
 * Convert a Next.js `href` value into pathname text.
 *
 * @param href - `next/link` href string or pathname object.
 * @returns Pathname when present, else null.
 */
export function hrefToPath(
  href: string | { pathname?: string | null } | null | undefined,
): string | null {
  if (!href) {
    return null;
  }

  if (typeof href === "string") {
    return href;
  }

  return href.pathname ?? null;
}

/**
 * Resolve all active path patterns for a nav item.
 *
 * @param item - Navigation item.
 * @returns Normalized path patterns for active-state checks.
 */
export function getActivePatterns(item: NavItem): string[] {
  const patterns: string[] = [];

  if ("url" in item) {
    const itemUrl = hrefToPath(item.url);
    if (itemUrl) {
      patterns.push(itemUrl);
    }
  }

  if (item.activeUrls?.length) {
    patterns.push(...item.activeUrls);
  }

  return patterns.map((pattern) => normalizePath(pattern));
}

/**
 * Narrow a union nav item to collapsible item variant.
 *
 * @param item - Navigation item union value.
 * @returns True when item contains nested child items.
 */
export function isNavCollapsible(item: NavItem): item is NavCollapsible {
  return Array.isArray((item as NavCollapsible).items);
}

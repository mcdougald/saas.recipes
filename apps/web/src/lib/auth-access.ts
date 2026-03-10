/**
 * Describe user-like values that may contain admin authorization claims.
 */
export interface AdminClaimUserLike {
  /**
   * Represent legacy boolean or truthy admin flags.
   */
  admin?: unknown;
  /**
   * Represent alternative admin boolean flag names.
   */
  isAdmin?: unknown;
  /**
   * Represent a single role claim value.
   */
  role?: unknown;
  /**
   * Represent multi-role claim values.
   */
  roles?: unknown;
}

const ADMIN_ROLE_VALUES = new Set([
  "admin",
  "super-admin",
  "super_admin",
  "superadmin",
  "owner",
]);

function toClaimText(value: unknown): string {
  return typeof value === "string" ? value.trim().toLowerCase() : "";
}

function parseBooleanLike(value: unknown): boolean {
  if (typeof value === "boolean") {
    return value;
  }

  if (typeof value === "number") {
    return value === 1;
  }

  const normalized = toClaimText(value);
  if (!normalized) {
    return false;
  }

  return normalized === "1" || normalized === "true" || normalized === "yes";
}

function hasAdminRoleClaim(value: unknown): boolean {
  if (Array.isArray(value)) {
    return value.some((entry) => hasAdminRoleClaim(entry));
  }

  const normalized = toClaimText(value);
  return normalized.length > 0 && ADMIN_ROLE_VALUES.has(normalized);
}

/**
 * Determine whether a user-like object has admin access claims.
 *
 * @param user - Auth/session user candidate that may contain role or admin flags.
 * @returns True when the user should be treated as an admin.
 * @example
 * ```ts
 * hasAdminAccess({ admin: true }); // true
 * hasAdminAccess({ role: "admin" }); // true
 * hasAdminAccess({ roles: ["member", "owner"] }); // true
 * ```
 */
export function hasAdminAccess(
  user: AdminClaimUserLike | null | undefined,
): boolean {
  if (!user) {
    return false;
  }

  return (
    parseBooleanLike(user.admin) ||
    parseBooleanLike(user.isAdmin) ||
    hasAdminRoleClaim(user.role) ||
    hasAdminRoleClaim(user.roles)
  );
}

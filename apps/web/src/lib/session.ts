import { auth } from "@/lib/auth";
import { cookies, headers } from "next/headers";
import { redirect } from "next/navigation";

type Session = Awaited<ReturnType<typeof auth.api.getSession>>;

/**
 * Check whether auth checks should be bypassed in local development.
 *
 * @returns True when running in development on localhost.
 */
async function shouldBypassAuthGuards(): Promise<boolean> {
  if (process.env.NODE_ENV === "development") {
    return true;
  }

  const headersList = await headers();
  const host = headersList.get("x-forwarded-host") ?? headersList.get("host") ?? "";
  const hostname = host.split(":")[0].toLowerCase();
  return hostname === "localhost" || hostname === "127.0.0.1" || hostname === "::1";
}

/**
 * Describe the normalized app-level user shape available in session payloads.
 */
export interface AppSessionUser {
  /**
   * Return the authenticated user id.
   */
  id: string;
  /**
   * Return the display name from auth.
   */
  name: string;
  /**
   * Return the primary user email.
   */
  email: string;
  /**
   * Return the optional avatar URL.
   */
  image?: string | null;
  /**
   * Return true when the user has admin privileges.
   */
  admin: boolean;
  /**
   * Return the current billing tier, when present.
   */
  subscriptionTier?: string | null;
}

/**
 * Normalize Better Auth session user data into an app-safe shape.
 *
 * @param session - Raw Better Auth session payload.
 * @returns Session user with safe defaults, or null when unauthenticated.
 */
export function getAppSessionUser(session: Session | null): AppSessionUser | null {
  if (!session?.user?.id || !session.user.email || !session.user.name) {
    return null;
  }

  const sessionUser = session.user as typeof session.user & {
    admin?: boolean;
    subscriptionTier?: string | null;
  };

  return {
    id: sessionUser.id,
    name: sessionUser.name,
    email: sessionUser.email,
    image: sessionUser.image ?? null,
    admin: sessionUser.admin === true,
    subscriptionTier: sessionUser.subscriptionTier ?? null,
  };
}

/**
 * Resolve the current server session from Better Auth.
 *
 * @returns Auth session payload when available, otherwise null.
 */
export async function getServerSession(): Promise<Session | null> {
  try {
    const cookieStore = await cookies();
    const headersList = await headers();

    const cookieHeader = cookieStore
      .getAll()
      .map((c) => `${c.name}=${c.value}`)
      .join("; ");

    const host = headersList.get("host") || "localhost";
    const protocol = headersList.get("x-forwarded-proto") || "http";
    const url = `${protocol}://${host}/api/auth/session`;

    const request = new Request(url, {
      method: "GET",
      headers: {
        cookie: cookieHeader,
        host: host,
      },
    });

    const session = await auth.api.getSession({
      headers: request.headers,
    });

    return session;
  } catch (error) {
    console.error("Failed to get server session:", error);
    return null;
  }
}

/**
 * Check whether the current request is authenticated.
 *
 * @returns True when the request has a signed-in user.
 */
export async function isAuthenticated(): Promise<boolean> {
  if (await shouldBypassAuthGuards()) {
    return true;
  }

  const session = await getServerSession();
  return !!getAppSessionUser(session);
}

/**
 * Check whether the current request belongs to an admin user.
 *
 * @returns True when the request has an authenticated admin.
 */
export async function isAdmin(): Promise<boolean> {
  const session = await getServerSession();
  const user = getAppSessionUser(session);
  return user?.admin === true;
}

/**
 * Require an authenticated admin user for a server route.
 *
 * Redirect behavior:
 * - unauthenticated -> `/sign-in`
 * - authenticated but non-admin -> `/forbidden`
 *
 * @returns Normalized admin user record for downstream logic.
 */
export async function requireAdminUser(): Promise<AppSessionUser> {
  const session = await getServerSession();
  const user = getAppSessionUser(session);

  if (!user) {
    redirect("/sign-in");
  }

  if (!user.admin) {
    redirect("/forbidden");
  }

  return user;
}

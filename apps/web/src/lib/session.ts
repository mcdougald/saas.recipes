import { auth } from "@/lib/auth";
import { cookies, headers } from "next/headers";

export async function getServerSession() {
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

export async function isAuthenticated(): Promise<boolean> {
  // Allow access in development mode without authentication
  if (process.env.NODE_ENV === "development") {
    return true;
  }

  const headersList = await headers();
  const host = headersList.get("x-forwarded-host") ?? headersList.get("host") ?? "";
  const hostname = host.split(":")[0].toLowerCase();
  const isLocalhost = hostname === "localhost" || hostname === "127.0.0.1" || hostname === "::1";

  if (isLocalhost) {
    return true;
  }

  const session = await getServerSession();
  return !!session?.user;
}

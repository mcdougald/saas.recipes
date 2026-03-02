"use client";

import { createAuthClient } from "better-auth/react";

function isLocalhostURL(url: string) {
  return /^https?:\/\/(localhost|127\.0\.0\.1)(:\d+)?/i.test(url);
}

function resolveClientAuthBaseURL() {
  const configuredBaseURL =
    process.env.NEXT_PUBLIC_BETTER_AUTH_URL || process.env.NEXT_PUBLIC_APP_URL;

  // Protect production builds from accidentally pointing to localhost.
  if (configuredBaseURL) {
    if (
      process.env.NODE_ENV === "production" &&
      isLocalhostURL(configuredBaseURL)
    ) {
      return typeof window !== "undefined" ? window.location.origin : undefined;
    }

    return configuredBaseURL;
  }

  return typeof window !== "undefined" ? window.location.origin : undefined;
}

const betterAuthBaseURL = resolveClientAuthBaseURL();

if (process.env.NODE_ENV !== "production") {
  console.info("[auth-client] Better Auth client baseURL", {
    baseURL: betterAuthBaseURL ?? "window.location.origin",
  });
}

export const authClient = createAuthClient(
  betterAuthBaseURL
    ? {
        baseURL: betterAuthBaseURL,
      }
    : {},
);

export const { signIn, signUp, signOut, useSession } = authClient;

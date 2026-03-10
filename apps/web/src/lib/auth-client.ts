"use client";

import { createAuthClient } from "better-auth/react";

function isLocalhostUrl(url: string) {
  return /^https?:\/\/(localhost|127\.0\.0\.1)(:\d+)?/i.test(url);
}

function resolveClientAuthBaseUrl() {
  const configuredBaseUrl =
    process.env.NEXT_PUBLIC_BETTER_AUTH_URL || process.env.NEXT_PUBLIC_APP_URL;

  // Protect production builds from accidentally pointing to localhost.
  if (configuredBaseUrl) {
    if (
      process.env.NODE_ENV === "production" &&
      isLocalhostUrl(configuredBaseUrl)
    ) {
      return typeof window !== "undefined" ? window.location.origin : undefined;
    }

    return configuredBaseUrl;
  }

  return typeof window !== "undefined" ? window.location.origin : undefined;
}

const betterAuthBaseUrl = resolveClientAuthBaseUrl();

if (process.env.NODE_ENV !== "production") {
  console.info("[auth-client] Better Auth client baseURL", {
    baseURL: betterAuthBaseUrl ?? "window.location.origin",
  });
}

export const authClient = createAuthClient(
  betterAuthBaseUrl
    ? {
        baseURL: betterAuthBaseUrl,
      }
    : {},
);

export const { signIn, signUp, signOut, useSession } = authClient;

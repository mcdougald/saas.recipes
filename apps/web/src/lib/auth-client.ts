"use client";

import { createAuthClient } from "better-auth/react";

const betterAuthBaseURL =
  process.env.NEXT_PUBLIC_BETTER_AUTH_URL ||
  process.env.NEXT_PUBLIC_APP_URL ||
  "http://localhost:4000";

if (process.env.NODE_ENV !== "production") {
  console.info("[auth-client] Better Auth client baseURL", {
    baseURL: betterAuthBaseURL,
  });
}

export const authClient = createAuthClient({
  baseURL: betterAuthBaseURL,
});

export const { signIn, signUp, signOut, useSession } = authClient;

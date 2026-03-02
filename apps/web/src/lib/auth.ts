import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { db } from "@/lib/db";
import * as schema from "@/lib/db/schema";

const betterAuthBaseURL =
  process.env.BETTER_AUTH_URL ||
  process.env.NEXT_PUBLIC_BETTER_AUTH_URL ||
  process.env.NEXT_PUBLIC_APP_URL ||
  "http://localhost:4000";

const githubClientId = process.env.GITHUB_CLIENT_ID;
const githubClientSecret = process.env.GITHUB_CLIENT_SECRET;
const isGitHubAuthConfigured = Boolean(githubClientId && githubClientSecret);

const socialProviders = isGitHubAuthConfigured
  ? {
      github: {
        clientId: githubClientId!,
        clientSecret: githubClientSecret!,
      },
    }
  : {};

if (process.env.NODE_ENV !== "production") {
  console.info("[auth] Better Auth config", {
    baseURL: betterAuthBaseURL,
    githubConfigured: isGitHubAuthConfigured,
    hasGithubClientId: Boolean(githubClientId),
    hasGithubClientSecret: Boolean(githubClientSecret),
  });

  if (!isGitHubAuthConfigured) {
    console.warn(
      "[auth] GitHub social sign-in disabled. Set both GITHUB_CLIENT_ID and GITHUB_CLIENT_SECRET to enable it.",
    );
  }
}

export const auth = betterAuth({
  database: drizzleAdapter(db, {
    provider: "pg",
    schema: {
      user: schema.user,
      session: schema.session,
      account: schema.account,
      verification: schema.verification,
    },
  }),
  emailAndPassword: {
    enabled: true,
    requireEmailVerification: false, // Set to true in production with email service
  },
  socialProviders,
  secret:
    process.env.BETTER_AUTH_SECRET || "your-secret-key-change-in-production",
  baseURL: betterAuthBaseURL,
});

export type Session = typeof auth.$Infer.Session;

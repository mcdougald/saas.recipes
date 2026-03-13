import { PostHog } from "posthog-node";

import { isPostHogServerEnabled } from "@/lib/posthog-environment";

let posthogClient: PostHog | null = null;
const noOpPostHogClient = {
  capture: () => undefined,
  shutdown: async () => undefined,
} as unknown as PostHog;

/**
 * Return a configured server-side PostHog client when tracking is enabled.
 *
 * @returns Active PostHog client, or a no-op client in localhost/development.
 */
export function getPostHogClient() {
  const apiKey = process.env.NEXT_PUBLIC_POSTHOG_KEY;
  const isEnabled = isPostHogServerEnabled({
    nodeEnv: process.env.NODE_ENV,
    apiKey,
    urlCandidates: [
      process.env.NEXT_PUBLIC_APP_URL,
      process.env.NEXT_PUBLIC_BETTER_AUTH_URL,
      process.env.BETTER_AUTH_URL,
      process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : undefined,
    ],
  });

  if (!isEnabled) {
    return noOpPostHogClient;
  }

  if (!posthogClient) {
    posthogClient = new PostHog(apiKey!, {
      host: process.env.NEXT_PUBLIC_POSTHOG_HOST,
      flushAt: 1,
      flushInterval: 0,
    });
  }
  return posthogClient;
}

/**
 * Flush queued server-side PostHog events and close the client.
 *
 * @returns A promise that resolves when shutdown completes.
 */
export async function shutdownPostHog() {
  if (posthogClient) {
    await posthogClient.shutdown();
  }
}

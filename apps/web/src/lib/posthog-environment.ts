const LOCALHOST_HOSTNAMES = new Set(["localhost", "127.0.0.1", "::1"]);

/**
 * Determine whether a hostname points to a local environment.
 *
 * @param hostname - Hostname value to evaluate.
 * @returns True when the hostname resolves to localhost.
 */
export function isLocalhostHostname(hostname: string) {
  return LOCALHOST_HOSTNAMES.has(hostname.toLowerCase());
}

/**
 * Determine whether a URL points to a local environment.
 *
 * @param url - Absolute or relative URL string to evaluate.
 * @returns True when the URL resolves to localhost.
 */
export function isLocalhostUrl(url: string) {
  if (!url) return false;

  try {
    const parsedUrl = new URL(url);
    return isLocalhostHostname(parsedUrl.hostname);
  } catch {
    return false;
  }
}

/**
 * Determine whether client-side PostHog should initialize.
 *
 * @param options - Runtime values that affect client analytics behavior.
 * @param options.nodeEnv - Current NODE_ENV value.
 * @param options.hostname - Current browser hostname.
 * @param options.apiKey - Public PostHog project key.
 * @returns True when PostHog can initialize and emit client events.
 */
export function isPostHogClientEnabled(options: {
  nodeEnv: string | undefined;
  hostname: string;
  apiKey: string | undefined;
}) {
  if (options.nodeEnv !== "production") return false;
  if (!options.apiKey) return false;
  if (isLocalhostHostname(options.hostname)) return false;
  return true;
}

/**
 * Determine whether server-side PostHog should initialize.
 *
 * @param options - Runtime values that affect server analytics behavior.
 * @param options.nodeEnv - Current NODE_ENV value.
 * @param options.apiKey - PostHog project key used by the server SDK.
 * @param options.urlCandidates - Optional app URL values to verify host safety.
 * @returns True when PostHog can initialize and emit server events.
 */
export function isPostHogServerEnabled(options: {
  nodeEnv: string | undefined;
  apiKey: string | undefined;
  urlCandidates: Array<string | undefined>;
}) {
  if (options.nodeEnv !== "production") return false;
  if (!options.apiKey) return false;

  const knownUrl = options.urlCandidates.find((candidate) =>
    Boolean(candidate),
  );
  if (knownUrl && isLocalhostUrl(knownUrl)) return false;

  return true;
}

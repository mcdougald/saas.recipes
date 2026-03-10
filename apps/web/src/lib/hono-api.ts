const HONO_API_TIMEOUT_MS = 6_000;
const DEFAULT_ORPC_BASE_PATH = "/rpc";

type HonoProbeMethod = "GET" | "POST";

/**
 * Describe a single API probe target for admin observability views.
 */
export interface HonoProbeTarget {
  /**
   * Render a human-readable label in the dashboard.
   */
  label: string;
  /**
   * Resolve the HTTP path against the configured Hono base URL.
   */
  path?: string;
  /**
   * Resolve an oRPC procedure name, for example `health.check`.
   */
  procedure?: string;
  /**
   * Select the request method used for probing.
   */
  method?: HonoProbeMethod;
  /**
   * Pass an optional JSON body for POST probes.
   */
  body?: unknown;
}

/**
 * Describe the normalized response captured from a Hono API probe.
 */
export interface HonoProbeResult {
  /**
   * Return the endpoint metadata that was probed.
   */
  target: HonoProbeTarget;
  /**
   * Return the resolved request path used for this probe.
   */
  requestPath: string;
  /**
   * Return true when a probe completed with a 2xx status.
   */
  ok: boolean;
  /**
   * Return the HTTP status code when the request reached the API.
   */
  status: number | null;
  /**
   * Return the status text supplied by the API.
   */
  statusText: string;
  /**
   * Return response time in milliseconds.
   */
  latencyMs: number;
  /**
   * Return a short response preview for diagnostics.
   */
  bodyPreview: string;
  /**
   * Return an error message when probing failed before an HTTP response.
   */
  errorMessage: string | null;
}

/**
 * Resolve the Hono API base URL for server-side calls.
 *
 * @returns Canonical base URL with no trailing slash.
 */
export function getHonoApiBaseUrl(): string {
  const configuredUrl =
    process.env.API_BASE_URL ??
    process.env.NEXT_PUBLIC_API_BASE_URL ??
    (process.env.NODE_ENV === "production"
      ? "https://api.saas.recipes"
      : "http://localhost:8787");

  return configuredUrl.replace(/\/+$/, "");
}

/**
 * Build the list of admin probe targets for the API monitor page.
 *
 * @returns Ordered list of endpoints to probe.
 *
 * @example
 * getHonoProbeTargets();
 * // [{ label: "Health", path: "/health" }, ...]
 */
export function getHonoProbeTargets(): HonoProbeTarget[] {
  const configuredJsonTargets = process.env.HONO_ADMIN_PROBES_JSON;
  if (configuredJsonTargets) {
    try {
      const parsed = JSON.parse(configuredJsonTargets) as HonoProbeTarget[];
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed;
      }
    } catch {
      // Fall back to string-based endpoint configuration below.
    }
  }

  const configuredEndpoints = process.env.HONO_ADMIN_ENDPOINTS;
  if (!configuredEndpoints) {
    return [
      {
        label: "oRPC health.check",
        procedure: "health.check",
        method: "POST",
        body: {},
      },
      { label: "REST health", path: "/health", method: "GET" },
      { label: "REST metrics", path: "/metrics", method: "GET" },
    ];
  }

  return configuredEndpoints
    .split(",")
    .map((value) => value.trim())
    .filter(Boolean)
    .map((path) => ({
      label: path === "/" ? "Root" : path.replace(/^\/+/, "").toUpperCase(),
      path: path.startsWith("/") ? path : `/${path}`,
      method: "GET",
    }));
}

/**
 * Resolve request path, method, and body for a probe target.
 *
 * @param target - Probe target definition.
 * @returns Normalized request details used by `fetch`.
 */
function resolveProbeRequest(target: HonoProbeTarget): {
  requestPath: string;
  method: HonoProbeMethod;
  body: string | undefined;
} {
  if (target.path) {
    const method = target.method ?? "GET";
    return {
      requestPath: target.path.startsWith("/")
        ? target.path
        : `/${target.path}`,
      method,
      body:
        method === "POST" && target.body !== undefined
          ? JSON.stringify(target.body)
          : undefined,
    };
  }

  if (target.procedure) {
    const rpcBasePath =
      process.env.HONO_RPC_BASE_PATH?.trim().replace(/\/+$/, "") ||
      DEFAULT_ORPC_BASE_PATH;
    const method = target.method ?? "POST";
    return {
      requestPath: `${rpcBasePath}/${target.procedure}`,
      method,
      body:
        method === "POST"
          ? JSON.stringify(target.body !== undefined ? target.body : {})
          : undefined,
    };
  }

  return {
    requestPath: "/",
    method: "GET",
    body: undefined,
  };
}

/**
 * Build candidate oRPC paths for procedure probing.
 *
 * @param procedure - Procedure identifier such as `health.check`.
 * @returns Candidate request paths in probe order.
 */
function buildOrpcCandidatePaths(procedure: string): string[] {
  const rpcBasePath =
    process.env.HONO_RPC_BASE_PATH?.trim().replace(/\/+$/, "") ||
    DEFAULT_ORPC_BASE_PATH;
  const normalizedProcedure = procedure.replace(/^\/+/, "");

  const dotPath = `${rpcBasePath}/${normalizedProcedure}`;
  const slashPath = `${rpcBasePath}/${normalizedProcedure.replace(/\./g, "/")}`;
  const uniquePaths = new Set([dotPath, slashPath]);

  return Array.from(uniquePaths);
}

/**
 * Probe a Hono endpoint and capture status, timing, and response hints.
 *
 * @param target - Endpoint metadata to probe.
 * @returns Probe response details for admin diagnostics.
 */
export async function probeHonoEndpoint(
  target: HonoProbeTarget,
): Promise<HonoProbeResult> {
  const startedAt = Date.now();
  const abortController = new AbortController();
  const timeout = setTimeout(
    () => abortController.abort(),
    HONO_API_TIMEOUT_MS,
  );
  const resolvedRequest = resolveProbeRequest(target);

  try {
    const candidateRequests =
      target.procedure && !target.path
        ? buildOrpcCandidatePaths(target.procedure).flatMap((requestPath) => {
            const preferredMethod = target.method ?? "POST";
            const methods: HonoProbeMethod[] =
              preferredMethod === "POST" ? ["POST", "GET"] : [preferredMethod];
            return methods.map((method) => ({
              requestPath,
              method,
              body:
                method === "POST"
                  ? JSON.stringify(target.body ?? {})
                  : undefined,
            }));
          })
        : [resolvedRequest];

    let response: Response | null = null;
    let requestPath = resolvedRequest.requestPath;
    let requestMethod = resolvedRequest.method;

    for (const candidateRequest of candidateRequests) {
      response = await fetch(
        `${getHonoApiBaseUrl()}${candidateRequest.requestPath}`,
        {
          method: candidateRequest.method,
          cache: "no-store",
          signal: abortController.signal,
          headers: {
            Accept: "application/json, text/plain;q=0.9, */*;q=0.8",
            ...(candidateRequest.method === "POST"
              ? { "Content-Type": "application/json" }
              : {}),
          },
          body: candidateRequest.body,
        },
      );

      requestPath = candidateRequest.requestPath;
      requestMethod = candidateRequest.method;

      if (response.ok) {
        break;
      }
    }

    if (!response) {
      throw new Error("No probe response returned.");
    }

    const bodyText = await response.text();
    const preview =
      bodyText.length > 220
        ? `${bodyText.slice(0, 220).trimEnd()}...`
        : bodyText;

    return {
      target,
      requestPath: `${requestMethod} ${requestPath}`,
      ok: response.ok,
      status: response.status,
      statusText: response.statusText,
      latencyMs: Date.now() - startedAt,
      bodyPreview: preview || "(empty response body)",
      errorMessage: null,
    };
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    return {
      target,
      requestPath: `${resolvedRequest.method} ${resolvedRequest.requestPath}`,
      ok: false,
      status: null,
      statusText: "Request failed",
      latencyMs: Date.now() - startedAt,
      bodyPreview: "(no response body)",
      errorMessage: message,
    };
  } finally {
    clearTimeout(timeout);
  }
}

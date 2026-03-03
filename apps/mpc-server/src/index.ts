import { createServer, type IncomingMessage, type ServerResponse } from "node:http";

type EnvConfig = {
  host: string;
  port: number;
  authToken: string;
};

const parsePort = (value: string | undefined): number => {
  if (!value) {
    return 4300;
  }

  const parsed = Number.parseInt(value, 10);
  if (!Number.isInteger(parsed) || parsed <= 0 || parsed > 65535) {
    throw new Error("MPC_SERVER_PORT must be a valid TCP port (1-65535).");
  }

  return parsed;
};

const getEnvConfig = (): EnvConfig => {
  const authToken = process.env.MPC_SERVER_AUTH_TOKEN;
  if (!authToken || authToken.trim().length < 12) {
    throw new Error(
      "MPC_SERVER_AUTH_TOKEN is required and must be at least 12 characters long.",
    );
  }

  return {
    host: process.env.MPC_SERVER_HOST ?? "127.0.0.1",
    port: parsePort(process.env.MPC_SERVER_PORT),
    authToken,
  };
};

const writeJson = (
  res: ServerResponse<IncomingMessage>,
  statusCode: number,
  body: Record<string, string | boolean>,
): void => {
  res.writeHead(statusCode, { "content-type": "application/json; charset=utf-8" });
  res.end(JSON.stringify(body));
};

const isAuthorized = (req: IncomingMessage, authToken: string): boolean => {
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    return false;
  }

  const [scheme, token] = authHeader.split(" ");
  return scheme === "Bearer" && token === authToken;
};

const main = (): void => {
  const config = getEnvConfig();

  const server = createServer((req, res) => {
    if (!req.url || !req.method) {
      writeJson(res, 400, { ok: false, error: "Invalid request." });
      return;
    }

    if (req.url === "/health") {
      writeJson(res, 200, { ok: true, service: "mpc-server" });
      return;
    }

    if (req.url === "/rpc" && req.method === "POST") {
      if (!isAuthorized(req, config.authToken)) {
        writeJson(res, 401, { ok: false, error: "Unauthorized." });
        return;
      }

      writeJson(res, 200, {
        ok: true,
        message: "Authorized request received. Replace with your MPC/MCP handlers.",
      });
      return;
    }

    writeJson(res, 404, { ok: false, error: "Not found." });
  });

  server.listen(config.port, config.host, () => {
    process.stdout.write(
      `mpc-server listening on http://${config.host}:${config.port} (token auth enabled)\n`,
    );
  });
};

try {
  main();
} catch (error) {
  const message = error instanceof Error ? error.message : "Unknown startup error.";
  process.stderr.write(`Failed to start mpc-server: ${message}\n`);
  process.exit(1);
}

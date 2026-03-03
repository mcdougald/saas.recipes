# mpc-server

Simple TypeScript server workspace for hosting an MPC/MCP-style endpoint with environment-variable-based access control.

## Environment variables

Required:

- `MPC_SERVER_AUTH_TOKEN` - Bearer token required for `/rpc` requests.

Optional:

- `MPC_SERVER_PORT` - Server port (default: `4300`).
- `MPC_SERVER_HOST` - Bind host (default: `127.0.0.1`).

## Run

```bash
pnpm --filter mpc-server dev
```

## Endpoints

- `GET /health` - health check (no auth).
- `POST /rpc` - protected endpoint (requires `Authorization: Bearer <token>`).

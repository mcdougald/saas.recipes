const normalizeDependencyName = (dependencyName: string): string =>
  dependencyName.trim().toLowerCase();

export type KeyDependencyCategory =
  | "asyncWorkflow"
  | "databases"
  | "frameworks"
  | "rpc";

export type KeyDependencyMetadata = {
  aliases?: readonly string[];
  category: KeyDependencyCategory;
  description: string;
  docsUrl: string;
  name: string;
  repoUrl?: string;
  tags?: readonly string[];
};

/**
 * Curated registry of dependencies we treat as "key" signals during repository sync.
 *
 * ## How this is used
 * - Queue processing receives raw dependency names from job config.
 * - `filterKeyDependencyNames(...)` normalizes and filters those names against this registry.
 * - If no names remain after filtering, dependency-reference-analysis jobs are skipped
 *   with the `no-key-dependencies` reason.
 * - If matches exist, canonical names are passed to dependency-reference-analysis for
 *   source scanning and DB persistence.
 *
 * ## Schema notes
 * - `name` must be the canonical npm package or scope entry used for matching.
 * - `aliases` are optional alternate spellings/typos/legacy names that map to `name`.
 * - `description`, `docsUrl`, and `repoUrl` provide human-readable context for future
 *   tooling, reporting, and operator visibility.
 * - `category` keeps broad grouping semantics used by this file's exported structure.
 *
 * Keep entries lowercase where possible and prefer stable, official docs/repo URLs.
 */
export const KEY_DEPENDENCY_GROUPS = {
  asyncWorkflow: [
    {
      category: "asyncWorkflow",
      description: "Temporal TypeScript client for workflow orchestration.",
      docsUrl: "https://docs.temporal.io/develop/typescript",
      name: "@temporalio/client",
      repoUrl: "https://github.com/temporalio/sdk-typescript",
      tags: ["workflow-engine"],
    },
    {
      category: "asyncWorkflow",
      description:
        "Temporal worker runtime for executing workflows and activities.",
      docsUrl: "https://docs.temporal.io/develop/typescript/core-application",
      name: "@temporalio/worker",
      repoUrl: "https://github.com/temporalio/sdk-typescript",
      tags: ["workflow-engine"],
    },
    {
      category: "asyncWorkflow",
      description: "Trigger.dev SDK for durable background jobs.",
      docsUrl: "https://trigger.dev/docs",
      name: "@trigger.dev/sdk",
      repoUrl: "https://github.com/triggerdotdev/trigger.dev",
      tags: ["job-runner"],
    },
    {
      category: "asyncWorkflow",
      description: "Lightweight Mongo-backed job scheduler.",
      docsUrl: "https://github.com/agenda/agenda#readme",
      name: "agenda",
      repoUrl: "https://github.com/agenda/agenda",
      tags: ["job-runner"],
    },
    {
      category: "asyncWorkflow",
      description: "Simple Redis-backed task queue.",
      docsUrl: "https://github.com/bee-queue/bee-queue#readme",
      name: "bee-queue",
      repoUrl: "https://github.com/bee-queue/bee-queue",
      tags: ["queue"],
    },
    {
      category: "asyncWorkflow",
      description: "Node.js job scheduler with worker threads.",
      docsUrl: "https://github.com/breejs/bree#readme",
      name: "bree",
      repoUrl: "https://github.com/breejs/bree",
      tags: ["scheduler"],
    },
    {
      category: "asyncWorkflow",
      description: "Redis-backed queue package (Bull v3).",
      docsUrl: "https://github.com/OptimalBits/bull#readme",
      name: "bull",
      repoUrl: "https://github.com/OptimalBits/bull",
      tags: ["queue"],
    },
    {
      category: "asyncWorkflow",
      description: "Modern Redis-backed queue and worker library.",
      docsUrl: "https://docs.bullmq.io/",
      name: "bullmq",
      repoUrl: "https://github.com/taskforcesh/bullmq",
      tags: ["queue"],
    },
    {
      category: "asyncWorkflow",
      description: "Type-safe command-line interface toolkit.",
      docsUrl: "https://github.com/privatenumber/cleye#readme",
      name: "cleye",
      repoUrl: "https://github.com/privatenumber/cleye",
      tags: ["cli"],
    },
    {
      category: "asyncWorkflow",
      description: "Event-driven background jobs and scheduled functions.",
      docsUrl: "https://www.inngest.com/docs",
      name: "inngest",
      repoUrl: "https://github.com/inngest/inngest",
      tags: ["event-driven", "job-runner"],
    },
    {
      category: "asyncWorkflow",
      description: "Cron-like scheduler for Node.js tasks.",
      docsUrl: "https://github.com/node-cron/node-cron#readme",
      name: "node-cron",
      repoUrl: "https://github.com/node-cron/node-cron",
      tags: ["scheduler"],
    },
    {
      category: "asyncWorkflow",
      description: "Concurrency-controlled promise mapper.",
      docsUrl: "https://github.com/sindresorhus/p-map#readme",
      name: "p-map",
      repoUrl: "https://github.com/sindresorhus/p-map",
      tags: ["concurrency"],
    },
    {
      category: "asyncWorkflow",
      description: "Promise queue with concurrency and rate controls.",
      docsUrl: "https://github.com/sindresorhus/p-queue#readme",
      name: "p-queue",
      repoUrl: "https://github.com/sindresorhus/p-queue",
      tags: ["queue", "concurrency"],
    },
    {
      category: "asyncWorkflow",
      description: "Promise rate limiter.",
      docsUrl: "https://github.com/sindresorhus/p-throttle#readme",
      name: "p-throttle",
      repoUrl: "https://github.com/sindresorhus/p-throttle",
      tags: ["rate-limit"],
    },
    {
      category: "asyncWorkflow",
      description: "Promise timeout utility.",
      docsUrl: "https://github.com/sindresorhus/p-timeout#readme",
      name: "p-timeout",
      repoUrl: "https://github.com/sindresorhus/p-timeout",
      tags: ["timeout"],
    },
    {
      category: "asyncWorkflow",
      description: "PostgreSQL-backed background job queue.",
      docsUrl: "https://github.com/timgit/pg-boss#readme",
      name: "pg-boss",
      repoUrl: "https://github.com/timgit/pg-boss",
      tags: ["queue", "postgres"],
    },
    {
      category: "asyncWorkflow",
      description: "Task runner for command-line workflows.",
      docsUrl: "https://github.com/privatenumber/tasuku#readme",
      name: "tasuku",
      repoUrl: "https://github.com/privatenumber/tasuku",
      tags: ["cli"],
    },
    {
      aliases: ["temporalio"],
      category: "asyncWorkflow",
      description:
        "Temporal workflow engine package family alias entry for compatibility.",
      docsUrl: "https://docs.temporal.io/",
      name: "temporalio",
      repoUrl: "https://github.com/temporalio",
      tags: ["workflow-engine", "alias"],
    },
    {
      aliases: ["trigger.dev"],
      category: "asyncWorkflow",
      description:
        "Trigger.dev package family alias entry for compatibility filtering.",
      docsUrl: "https://trigger.dev/docs",
      name: "trigger.dev",
      repoUrl: "https://github.com/triggerdotdev/trigger.dev",
      tags: ["job-runner", "alias"],
    },
  ],
  databases: [
    {
      category: "databases",
      description: "SQLite3 bindings for Node.js with synchronous API.",
      docsUrl: "https://github.com/WiseLibs/better-sqlite3#readme",
      name: "better-sqlite3",
      repoUrl: "https://github.com/WiseLibs/better-sqlite3",
      tags: ["sqlite"],
    },
    {
      category: "databases",
      description: "TypeScript ORM with SQL-first query builder APIs.",
      docsUrl: "https://orm.drizzle.team/docs/overview",
      name: "drizzle-orm",
      repoUrl: "https://github.com/drizzle-team/drizzle-orm",
      tags: ["orm"],
    },
    {
      aliases: ["kynesly"],
      category: "databases",
      description: "Type-safe SQL query builder for TypeScript.",
      docsUrl: "https://kysely.dev/docs/intro",
      name: "kysely",
      repoUrl: "https://github.com/kysely-org/kysely",
      tags: ["query-builder"],
    },
    {
      category: "databases",
      description: "Flexible SQL query builder for JavaScript.",
      docsUrl: "https://knexjs.org/",
      name: "knex",
      repoUrl: "https://github.com/knex/knex",
      tags: ["query-builder"],
    },
    {
      category: "databases",
      description: "MongoDB object modeling for Node.js.",
      docsUrl: "https://mongoosejs.com/docs/",
      name: "mongoose",
      repoUrl: "https://github.com/Automattic/mongoose",
      tags: ["orm", "mongodb"],
    },
    {
      category: "databases",
      description: "MySQL client for Node.js.",
      docsUrl: "https://github.com/sidorares/node-mysql2#readme",
      name: "mysql2",
      repoUrl: "https://github.com/sidorares/node-mysql2",
      tags: ["mysql"],
    },
    {
      category: "databases",
      description: "PostgreSQL client for Node.js.",
      docsUrl: "https://node-postgres.com/",
      name: "pg",
      repoUrl: "https://github.com/brianc/node-postgres",
      tags: ["postgres"],
    },
    {
      category: "databases",
      description: "Type-safe ORM for Node.js and TypeScript.",
      docsUrl: "https://www.prisma.io/docs",
      name: "prisma",
      repoUrl: "https://github.com/prisma/prisma",
      tags: ["orm"],
    },
    {
      category: "databases",
      description: "Promise-based ORM for Node.js.",
      docsUrl: "https://sequelize.org/docs/v6/",
      name: "sequelize",
      repoUrl: "https://github.com/sequelize/sequelize",
      tags: ["orm"],
    },
    {
      category: "databases",
      description: "Asynchronous SQLite3 bindings for Node.js.",
      docsUrl: "https://github.com/TryGhost/node-sqlite3#readme",
      name: "sqlite3",
      repoUrl: "https://github.com/TryGhost/node-sqlite3",
      tags: ["sqlite"],
    },
    {
      category: "databases",
      description: "Data Mapper and Active Record ORM for TypeScript.",
      docsUrl: "https://typeorm.io/docs/",
      name: "typeorm",
      repoUrl: "https://github.com/typeorm/typeorm",
      tags: ["orm"],
    },
  ],
  frameworks: [
    {
      category: "frameworks",
      description: "Node.js adapter for Hono framework.",
      docsUrl: "https://hono.dev/docs/getting-started/nodejs",
      name: "@hono/node-server",
      repoUrl: "https://github.com/honojs/hono",
      tags: ["hono", "backend"],
    },
    {
      category: "frameworks",
      description: "WebSocket adapter utilities for Hono.",
      docsUrl: "https://hono.dev/docs/helpers/websocket",
      name: "@hono/node-ws",
      repoUrl: "https://github.com/honojs/middleware",
      tags: ["hono", "websocket"],
    },
    {
      category: "frameworks",
      description: "OpenAPI integration for Hono + Zod routes.",
      docsUrl: "https://hono.dev/examples/zod-openapi",
      name: "@hono/zod-openapi",
      repoUrl: "https://github.com/honojs/middleware",
      tags: ["hono", "openapi"],
    },
    {
      category: "frameworks",
      description: "Core NestJS framework package.",
      docsUrl: "https://docs.nestjs.com/",
      name: "@nestjs/core",
      repoUrl: "https://github.com/nestjs/nest",
      tags: ["nestjs", "backend"],
    },
    {
      category: "frameworks",
      description: "NestJS platform adapter for Express.",
      docsUrl: "https://docs.nestjs.com/techniques/performance#express",
      name: "@nestjs/platform-express",
      repoUrl: "https://github.com/nestjs/nest",
      tags: ["nestjs", "express"],
    },
    {
      category: "frameworks",
      description: "NestJS platform adapter for Fastify.",
      docsUrl: "https://docs.nestjs.com/techniques/performance#fastify",
      name: "@nestjs/platform-fastify",
      repoUrl: "https://github.com/nestjs/nest",
      tags: ["nestjs", "fastify"],
    },
    {
      category: "frameworks",
      description: "Minimal web framework for Node.js.",
      docsUrl: "https://expressjs.com/",
      name: "express",
      repoUrl: "https://github.com/expressjs/express",
      tags: ["backend"],
    },
    {
      category: "frameworks",
      description: "Fast and low-overhead web framework for Node.js.",
      docsUrl: "https://fastify.dev/docs/latest/Reference/",
      name: "fastify",
      repoUrl: "https://github.com/fastify/fastify",
      tags: ["backend"],
    },
    {
      category: "frameworks",
      description:
        "Framework for building cross-platform desktop applications.",
      docsUrl: "https://www.electronjs.org/docs/latest",
      name: "electron",
      repoUrl: "https://github.com/electron/electron",
      tags: ["desktop", "framework"],
    },
    {
      category: "frameworks",
      description: "Web framework for edge/runtime APIs.",
      docsUrl: "https://hono.dev/docs/",
      name: "hono",
      repoUrl: "https://github.com/honojs/hono",
      tags: ["backend", "edge"],
    },
    {
      category: "frameworks",
      description: "React framework for full-stack web applications.",
      docsUrl: "https://nextjs.org/docs",
      name: "next",
      repoUrl: "https://github.com/vercel/next.js",
      tags: ["frontend", "fullstack"],
    },
    {
      category: "frameworks",
      description: "Library for building user interfaces.",
      docsUrl: "https://react.dev/",
      name: "react",
      repoUrl: "https://github.com/facebook/react",
      tags: ["frontend"],
    },
    {
      category: "frameworks",
      description: "React renderer for web applications.",
      docsUrl: "https://react.dev/reference/react-dom",
      name: "react-dom",
      repoUrl: "https://github.com/facebook/react",
      tags: ["frontend"],
    },
    {
      category: "frameworks",
      description: "Compiler-driven framework for declarative UI.",
      docsUrl: "https://svelte.dev/docs",
      name: "svelte",
      repoUrl: "https://github.com/sveltejs/svelte",
      tags: ["frontend"],
    },
    {
      category: "frameworks",
      description: "Progressive framework for building web UIs.",
      docsUrl: "https://vuejs.org/guide/introduction.html",
      name: "vue",
      repoUrl: "https://github.com/vuejs/core",
      tags: ["frontend"],
    },
  ],
  rpc: [
    {
      category: "rpc",
      description: "oRPC client utilities for type-safe RPC calls.",
      docsUrl: "https://orpc.unnoq.com/docs/client/overview",
      name: "@orpc/client",
      repoUrl: "https://github.com/unnoq/orpc",
      tags: ["orpc"],
    },
    {
      category: "rpc",
      description: "OpenAPI adapters for oRPC.",
      docsUrl: "https://orpc.unnoq.com/docs/openapi/overview",
      name: "@orpc/openapi",
      repoUrl: "https://github.com/unnoq/orpc",
      tags: ["orpc", "openapi"],
    },
    {
      category: "rpc",
      description: "oRPC server-side procedure and router utilities.",
      docsUrl: "https://orpc.unnoq.com/docs/server/overview",
      name: "@orpc/server",
      repoUrl: "https://github.com/unnoq/orpc",
      tags: ["orpc"],
    },
    {
      category: "rpc",
      description: "TanStack Query integration for oRPC.",
      docsUrl: "https://orpc.unnoq.com/docs/tanstack-query/overview",
      name: "@orpc/tanstack-query",
      repoUrl: "https://github.com/unnoq/orpc",
      tags: ["orpc", "tanstack-query"],
    },
    {
      category: "rpc",
      description: "Zod integration utilities for oRPC.",
      docsUrl: "https://orpc.unnoq.com/docs/zod/overview",
      name: "@orpc/zod",
      repoUrl: "https://github.com/unnoq/orpc",
      tags: ["orpc", "zod"],
    },
    {
      category: "rpc",
      description: "tRPC client package for type-safe APIs.",
      docsUrl: "https://trpc.io/docs/client/vanilla",
      name: "@trpc/client",
      repoUrl: "https://github.com/trpc/trpc",
      tags: ["trpc"],
    },
    {
      category: "rpc",
      description: "tRPC server package for end-to-end type safety.",
      docsUrl: "https://trpc.io/docs/server",
      name: "@trpc/server",
      repoUrl: "https://github.com/trpc/trpc",
      tags: ["trpc"],
    },
    {
      category: "rpc",
      description: "TanStack React Query adapter for tRPC.",
      docsUrl: "https://trpc.io/docs/client/tanstack-react-query/overview",
      name: "@trpc/tanstack-react-query",
      repoUrl: "https://github.com/trpc/trpc",
      tags: ["trpc", "tanstack-query"],
    },
    {
      category: "rpc",
      description:
        "TanStack scope alias entry for compatibility filtering and query tooling detection.",
      docsUrl: "https://tanstack.com/",
      name: "@tanstack",
      repoUrl: "https://github.com/TanStack",
      tags: ["tanstack", "alias"],
    },
    {
      category: "rpc",
      description: "React Query bindings for tRPC.",
      docsUrl: "https://trpc.io/docs/client/react",
      name: "@trpc/react-query",
      repoUrl: "https://github.com/trpc/trpc",
      tags: ["trpc", "react-query"],
    },
    {
      category: "rpc",
      description:
        "Legacy package-name alias used in some repositories for tRPC.",
      docsUrl: "https://trpc.io/docs",
      name: "trpc",
      repoUrl: "https://github.com/trpc/trpc",
      tags: ["trpc", "alias"],
    },
  ],
} as const satisfies Record<
  KeyDependencyCategory,
  readonly KeyDependencyMetadata[]
>;

export const KEY_DEPENDENCIES: readonly KeyDependencyMetadata[] = Object.values(
  KEY_DEPENDENCY_GROUPS,
)
  .flat()
  .map(
    (dependency): KeyDependencyMetadata => ({
      ...dependency,
      aliases:
        "aliases" in dependency && dependency.aliases
          ? dependency.aliases.map((alias: string) =>
              normalizeDependencyName(alias),
            )
          : undefined,
      name: normalizeDependencyName(dependency.name),
    }),
  )
  .sort((left, right) => left.name.localeCompare(right.name));

export const KEY_DEPENDENCY_NAMES: readonly string[] = KEY_DEPENDENCIES.map(
  (dependency) => dependency.name,
);

const KEY_DEPENDENCY_METADATA_BY_NAME = new Map(
  KEY_DEPENDENCIES.map((dependency) => [dependency.name, dependency] as const),
);

const KEY_DEPENDENCY_ALIAS_TO_NAME = new Map(
  KEY_DEPENDENCIES.flatMap((dependency) => {
    const aliases = dependency.aliases ?? [];
    return [dependency.name, ...aliases].map(
      (alias) => [normalizeDependencyName(alias), dependency.name] as const,
    );
  }),
);

export const resolveKeyDependencyName = (
  dependencyName: string,
): string | undefined =>
  KEY_DEPENDENCY_ALIAS_TO_NAME.get(normalizeDependencyName(dependencyName));

export const getKeyDependencyMetadata = (
  dependencyName: string,
): KeyDependencyMetadata | undefined => {
  const resolvedDependencyName = resolveKeyDependencyName(dependencyName);
  return resolvedDependencyName
    ? KEY_DEPENDENCY_METADATA_BY_NAME.get(resolvedDependencyName)
    : undefined;
};

export const filterKeyDependencyNames = (dependencyNames: string[]): string[] =>
  Array.from(
    new Set(
      dependencyNames
        .map((dependencyName) => resolveKeyDependencyName(dependencyName))
        .filter((dependencyName): dependencyName is string =>
          Boolean(dependencyName),
        ),
    ),
  );

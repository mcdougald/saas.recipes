import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import * as schema from "./schema";

const connectionString = process.env.DATABASE_URL || "";

// Create a dummy client if DATABASE_URL is not set (for build time)
// Note: This allows the build to succeed without a database connection
// At runtime, API routes will fail gracefully if database is not configured
const client = connectionString 
  ? postgres(connectionString)
  : null;

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const db = client ? drizzle(client, { schema }) : null as any;

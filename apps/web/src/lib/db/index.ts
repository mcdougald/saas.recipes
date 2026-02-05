import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import * as schema from "./schema";

const connectionString = process.env.DATABASE_URL || "";

// Create a dummy client if DATABASE_URL is not set (for build time)
const client = connectionString 
  ? postgres(connectionString)
  : null;

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const db = client ? drizzle(client, { schema }) : null as any;

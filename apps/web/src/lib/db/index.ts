import { neon } from "@neondatabase/serverless";
import { drizzle, type NeonHttpDatabase } from "drizzle-orm/neon-http";
import * as schema from "./schema";

type Database = NeonHttpDatabase<typeof schema>;

let dbInstance: Database | null = null;

function createDb(): Database {
  if (dbInstance) {
    return dbInstance;
  }

  const databaseUrl = process.env.DATABASE_URL ?? process.env.POSTGRES_URL;
  if (!databaseUrl) {
    throw new Error(
      "Database is not configured. Set DATABASE_URL (or POSTGRES_URL) in your environment.",
    );
  }

  dbInstance = drizzle(neon(databaseUrl), { schema });
  return dbInstance;
}

export const db: Database = new Proxy({} as Database, {
  get(_target, prop, receiver) {
    const instance = createDb();
    const value = Reflect.get(instance as object, prop, receiver);
    return typeof value === "function" ? value.bind(instance) : value;
  },
});

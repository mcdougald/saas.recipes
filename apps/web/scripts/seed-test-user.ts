/**
 * Seed script to create a test user
 * Run with: pnpm db:seed
 * 
 * Creates a test user with:
 * - Email: test@test.com
 * - Password: password
 * 
 * Uses the same password hashing as better-auth (scrypt with @noble/hashes)
 */

import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { user, account } from "../src/lib/db/schema";
import { eq } from "drizzle-orm";
import { scryptAsync } from "@noble/hashes/scrypt.js";
import { bytesToHex, randomBytes } from "@noble/hashes/utils.js";

// Better-auth scrypt config (must match better-auth's config)
const config = {
  N: 16384,
  r: 16,
  p: 1,
  dkLen: 64,
};

async function hashPassword(password: string): Promise<string> {
  const salt = bytesToHex(randomBytes(16));
  const key = await scryptAsync(password.normalize("NFKC"), salt, {
    N: config.N,
    p: config.p,
    r: config.r,
    dkLen: config.dkLen,
    maxmem: 128 * config.N * config.r * 2,
  });
  return `${salt}:${bytesToHex(key)}`;
}

function generateId(): string {
  return bytesToHex(randomBytes(16));
}

async function main() {
  const connectionString = process.env.DATABASE_URL;
  
  if (!connectionString) {
    console.error("❌ DATABASE_URL environment variable is not set");
    console.log("Please set DATABASE_URL in your .env file");
    process.exit(1);
  }

  console.log("🔌 Connecting to database...");
  const client = postgres(connectionString);
  const db = drizzle(client);

  const testEmail = "test@test.com";
  const testPassword = "password";
  const testName = "Test User";

  try {
    // Check if user already exists
    const existingUser = await db
      .select()
      .from(user)
      .where(eq(user.email, testEmail))
      .limit(1);

    if (existingUser.length > 0) {
      console.log("✅ Test user already exists!");
      console.log(`   Email: ${testEmail}`);
      console.log(`   Password: ${testPassword}`);
      await client.end();
      return;
    }

    // Create unique IDs
    const userId = generateId();
    const accountId = generateId();

    // Hash the password using better-auth's format
    console.log("🔐 Hashing password...");
    const hashedPassword = await hashPassword(testPassword);

    // Create the user
    console.log("👤 Creating test user...");
    await db.insert(user).values({
      id: userId,
      name: testName,
      email: testEmail,
      emailVerified: true,
      subscriptionTier: "free",
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    // Create the account with credential provider
    console.log("🔑 Creating account credentials...");
    await db.insert(account).values({
      id: accountId,
      accountId: userId,
      providerId: "credential",
      userId: userId,
      password: hashedPassword,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    console.log("");
    console.log("✅ Test user created successfully!");
    console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
    console.log(`   Email:    ${testEmail}`);
    console.log(`   Password: ${testPassword}`);
    console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
    console.log("");

  } catch (error) {
    console.error("❌ Error creating test user:", error);
    process.exit(1);
  } finally {
    await client.end();
  }
}

main();

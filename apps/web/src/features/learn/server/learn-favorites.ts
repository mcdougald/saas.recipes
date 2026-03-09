import { generateRandomUUID } from "@/helpers/generate-random-uuid";
import { db } from "@/lib/db";
import { userFavorite } from "@/lib/db/schema";
import { getServerSession } from "@/lib/session";
import { and, eq } from "drizzle-orm";

interface ToggleLearningTopicFavoriteInput {
  slug: string;
  title: string;
  description: string;
}

async function getCurrentUserId(): Promise<string | null> {
  const session = await getServerSession();
  return session?.user.id ?? null;
}

async function requireCurrentUserId(): Promise<string> {
  const userId = await getCurrentUserId();

  if (!userId) {
    throw new Error("You must be signed in to manage favorites.");
  }

  return userId;
}

/**
 * List the learn topic slugs favorited by the current user.
 *
 * @returns Topic slugs that should render as saved in the learn UI. Returns an
 * empty array for anonymous visitors.
 */
export async function listCurrentUserFavoriteTopicSlugs(): Promise<string[]> {
  const userId = await getCurrentUserId();

  if (!userId) {
    return [];
  }

  const rows = await db
    .select({ slug: userFavorite.entitySlug })
    .from(userFavorite)
    .where(
      and(
        eq(userFavorite.userId, userId),
        eq(userFavorite.entityType, "learn_topic"),
      ),
    );

  return rows.map((row) => row.slug);
}

/**
 * Toggle one learning topic inside the current user's favorites workspace.
 *
 * @param input - Topic metadata used to create or remove the favorite record.
 * @returns The updated favorite state after the write completes.
 */
export async function toggleCurrentUserLearningTopicFavorite(
  input: ToggleLearningTopicFavoriteInput,
): Promise<{ favorited: boolean }> {
  const userId = await requireCurrentUserId();
  const existingFavorite = await db
    .select({ id: userFavorite.id })
    .from(userFavorite)
    .where(
      and(
        eq(userFavorite.userId, userId),
        eq(userFavorite.entityType, "learn_topic"),
        eq(userFavorite.entitySlug, input.slug),
      ),
    )
    .limit(1);

  if (existingFavorite[0]) {
    await db
      .delete(userFavorite)
      .where(eq(userFavorite.id, existingFavorite[0].id));

    return { favorited: false };
  }

  await db.insert(userFavorite).values({
    id: generateRandomUUID(),
    userId,
    entityType: "learn_topic",
    entitySlug: input.slug,
    source: "learn",
    entityTitle: input.title,
    entitySummary: input.description,
    lastViewedAt: new Date(),
  });

  return { favorited: true };
}

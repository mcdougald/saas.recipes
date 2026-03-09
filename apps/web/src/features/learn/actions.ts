"use server";

import { revalidatePath } from "next/cache";
import { toggleCurrentUserLearningTopicFavorite } from "./server/learn-favorites";

interface ToggleLearningTopicFavoriteInput {
  slug: string;
  title: string;
  description: string;
}

/**
 * Toggle the current user's saved state for a learn topic.
 *
 * @param input - Topic metadata needed to create or remove the favorite row.
 * @returns The updated favorite state after persistence.
 */
export async function toggleLearningTopicFavoriteAction(
  input: ToggleLearningTopicFavoriteInput,
): Promise<{ favorited: boolean }> {
  const result = await toggleCurrentUserLearningTopicFavorite(input);

  revalidatePath("/learn");
  revalidatePath(`/learn/${input.slug}`);
  revalidatePath("/your-recipes");

  return result;
}

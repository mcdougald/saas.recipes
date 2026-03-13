import {
  HELP_CENTER_ARTICLE_DEFINITIONS,
  HELP_CENTER_CATEGORY_DEFINITIONS,
} from "@/features/help-center/data/help-center-index";

/**
 * Build a lookup map from article id to route href.
 */
const helpCenterArticleHrefById = new Map<string, string>(
  HELP_CENTER_ARTICLE_DEFINITIONS.map((article) => [article.id, article.href]),
);

/**
 * Build a lookup map from category id to category slug.
 */
const helpCenterCategorySlugById = new Map<string, string>(
  HELP_CENTER_CATEGORY_DEFINITIONS.map((category) => [
    category.id,
    category.slug,
  ]),
);

/**
 * Resolve the best route for a help-center article id.
 *
 * @param articleId - Stable article identifier.
 * @returns Matching href when found; otherwise null.
 */
export function getHelpCenterHrefForArticleId(
  articleId: string,
): string | null {
  return helpCenterArticleHrefById.get(articleId) ?? null;
}

/**
 * Resolve the slug for a help-center category id.
 *
 * @param categoryId - Stable category identifier.
 * @returns Matching category slug when found; otherwise null.
 */
export function getHelpCenterCategorySlug(categoryId: string): string | null {
  return helpCenterCategorySlugById.get(categoryId) ?? null;
}

/**
 * Build a category route path from a category id.
 *
 * @param categoryId - Stable category identifier.
 * @returns Category path when slug exists; otherwise null.
 */
export function getHelpCenterCategoryPath(categoryId: string): string | null {
  const slug = getHelpCenterCategorySlug(categoryId);
  return slug ? `/help-center/categories/${slug}` : null;
}

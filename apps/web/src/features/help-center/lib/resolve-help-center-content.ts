import {
  HELP_CENTER_ARTICLE_DEFINITIONS,
  HELP_CENTER_CATEGORY_DEFINITIONS,
  HELP_CENTER_FAQ_SECTION_DEFINITIONS,
  HELP_CENTER_SUGGESTED_TOPIC_DEFINITIONS,
} from "@/features/help-center/data/help-center-index";
import {
  type HelpCenterTranslationKey,
  type ResolvedHelpArticle,
  type ResolvedHelpCategory,
  type ResolvedHelpFAQ,
  type ResolvedHelpFAQSection,
} from "@/features/help-center/data/help-center-schema";

/**
 * Translate a key for a given locale.
 */
export type HelpCenterTranslationResolver = (
  key: HelpCenterTranslationKey,
  locale: string,
) => string | undefined;

/**
 * Capture one missing translation key for diagnostics.
 */
export interface MissingHelpCenterTranslation {
  key: HelpCenterTranslationKey;
  localeTried: string;
}

/**
 * Configure the resolver that materializes localized help-center content.
 */
export interface ResolveHelpCenterContentOptions {
  locale: string;
  fallbackLocale: string;
  resolveTranslation: HelpCenterTranslationResolver;
}

/**
 * Represent fully localized help-center content payload.
 */
export interface ResolvedHelpCenterContent {
  suggestedTopics: readonly string[];
  categories: readonly ResolvedHelpCategory[];
  articles: readonly ResolvedHelpArticle[];
  faqSections: readonly ResolvedHelpFAQSection[];
  missingTranslations: readonly MissingHelpCenterTranslation[];
}

/**
 * Resolve localized help-center content from key-based definitions.
 *
 * @param options - Locale, fallback locale, and translation resolver.
 * @returns Localized content payload plus missing translation diagnostics.
 */
export function resolveHelpCenterContent(
  options: ResolveHelpCenterContentOptions,
): ResolvedHelpCenterContent {
  const missingTranslations: MissingHelpCenterTranslation[] = [];

  const resolveText = (key: HelpCenterTranslationKey): string => {
    const localeValue = options.resolveTranslation(key, options.locale);
    if (typeof localeValue === "string" && localeValue.length > 0) {
      return localeValue;
    }

    const fallbackValue = options.resolveTranslation(
      key,
      options.fallbackLocale,
    );
    if (typeof fallbackValue === "string" && fallbackValue.length > 0) {
      missingTranslations.push({
        key,
        localeTried: options.locale,
      });
      return fallbackValue;
    }

    missingTranslations.push({
      key,
      localeTried: `${options.locale},${options.fallbackLocale}`,
    });
    return `[${key}]`;
  };

  const suggestedTopics = HELP_CENTER_SUGGESTED_TOPIC_DEFINITIONS.map((topic) =>
    resolveText(topic.labelKey),
  );

  const categories: ResolvedHelpCategory[] =
    HELP_CENTER_CATEGORY_DEFINITIONS.map((category) => ({
      ...category,
      title: resolveText(category.titleKey),
      description: resolveText(category.descriptionKey),
    }));

  const articles: ResolvedHelpArticle[] = HELP_CENTER_ARTICLE_DEFINITIONS.map(
    (article) => ({
      ...article,
      title: resolveText(article.titleKey),
      description: resolveText(article.descriptionKey),
      category: resolveText(article.categoryLabelKey),
      readTime: resolveText(article.readTimeKey),
      views: resolveText(article.viewsKey),
    }),
  );

  const faqSections: ResolvedHelpFAQSection[] =
    HELP_CENTER_FAQ_SECTION_DEFINITIONS.map((section) => {
      const resolvedQuestions: ResolvedHelpFAQ[] = section.questions.map(
        (faq) => ({
          ...faq,
          question: resolveText(faq.questionKey),
          answer: resolveText(faq.answerKey),
        }),
      );

      return {
        ...section,
        category: resolveText(section.categoryLabelKey),
        questions: resolvedQuestions,
      };
    });

  return {
    suggestedTopics,
    categories,
    articles,
    faqSections,
    missingTranslations,
  };
}

/**
 * Build a simple dictionary-backed translation resolver for local testing.
 *
 * @param localeDictionaries - Dictionaries keyed by locale then translation key.
 * @returns A resolver function suitable for `resolveHelpCenterContent`.
 *
 * @example
 * const resolver = createDictionaryTranslationResolver({
 *   en: { "helpCenter.suggestedTopics.gettingStarted": "Getting started" },
 * });
 */
export function createDictionaryTranslationResolver(
  localeDictionaries: Record<string, Record<string, string>>,
): HelpCenterTranslationResolver {
  return (key, locale) => localeDictionaries[locale]?.[key];
}

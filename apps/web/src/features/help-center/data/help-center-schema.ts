/**
 * Declare stable translation keys used by help-center content.
 */
export type HelpCenterTranslationKey = `helpCenter.${string}`;

/**
 * Enumerate user intent categories for help-center content.
 */
export type HelpCenterIntent =
  | "discover"
  | "evaluate"
  | "troubleshoot"
  | "purchase"
  | "retain";

/**
 * Enumerate audience segments for help-center content.
 */
export type HelpCenterAudience =
  | "new-user"
  | "indie-builder"
  | "team-admin"
  | "developer"
  | "decision-maker";

/**
 * Enumerate lifecycle stages represented in help-center content.
 */
export type HelpCenterFunnelStage = "activation" | "conversion" | "retention";

/**
 * Enumerate icon identifiers allowed for help-center categories.
 */
export type HelpCategoryIcon =
  | "sparkles"
  | "bookOpen"
  | "settings"
  | "creditCard"
  | "shield"
  | "messageSquare"
  | "keyRound";

/**
 * Enumerate section identifiers rendered by the help-center page.
 */
export type HelpCenterSection = "categories" | "articles" | "faq";

/**
 * Capture operational metadata shared by content entities.
 */
export interface HelpCenterOperationalMetadata {
  owner: string;
  qualityScore: number;
  lastReviewedAt: string;
}

/**
 * Define a suggested search topic shown in the help-center hero.
 */
export interface HelpCenterSuggestedTopicDefinition {
  id: string;
  labelKey: HelpCenterTranslationKey;
}

/**
 * Define category metadata and translation keys for the help center.
 */
export interface HelpCategoryDefinition extends HelpCenterOperationalMetadata {
  id: string;
  slug: string;
  titleKey: HelpCenterTranslationKey;
  descriptionKey: HelpCenterTranslationKey;
  icon: HelpCategoryIcon;
  articleCount: number;
  intent: HelpCenterIntent;
  audience: HelpCenterAudience;
  funnelStage: HelpCenterFunnelStage;
  relatedIds: readonly string[];
}

/**
 * Define article metadata and translation keys for the help center.
 */
export interface HelpArticleDefinition extends HelpCenterOperationalMetadata {
  id: string;
  slug: string;
  titleKey: HelpCenterTranslationKey;
  descriptionKey: HelpCenterTranslationKey;
  categoryId: string;
  categoryLabelKey: HelpCenterTranslationKey;
  readTimeKey: HelpCenterTranslationKey;
  viewsKey: HelpCenterTranslationKey;
  href: string;
  intent: HelpCenterIntent;
  audience: HelpCenterAudience;
  funnelStage: HelpCenterFunnelStage;
  relatedIds: readonly string[];
}

/**
 * Define FAQ metadata and translation keys for the help center.
 */
export interface HelpFAQDefinition extends HelpCenterOperationalMetadata {
  id: string;
  questionKey: HelpCenterTranslationKey;
  answerKey: HelpCenterTranslationKey;
  answerRenderer: "plain" | "rich" | "component";
  intent: HelpCenterIntent;
  audience: HelpCenterAudience;
  funnelStage: HelpCenterFunnelStage;
  relatedIds: readonly string[];
}

/**
 * Define a section of FAQ entries grouped by category.
 */
export interface HelpFAQSectionDefinition {
  id: string;
  categoryId: string;
  categoryLabelKey: HelpCenterTranslationKey;
  questions: readonly HelpFAQDefinition[];
}

/**
 * Represent a fully localized category object ready for rendering.
 */
export interface ResolvedHelpCategory extends HelpCategoryDefinition {
  title: string;
  description: string;
}

/**
 * Represent a fully localized article object ready for rendering.
 */
export interface ResolvedHelpArticle extends HelpArticleDefinition {
  title: string;
  description: string;
  category: string;
  readTime: string;
  views: string;
}

/**
 * Represent a fully localized FAQ object ready for rendering.
 */
export interface ResolvedHelpFAQ extends HelpFAQDefinition {
  question: string;
  answer: string;
}

/**
 * Represent a fully localized FAQ section ready for rendering.
 */
export interface ResolvedHelpFAQSection extends HelpFAQSectionDefinition {
  category: string;
  questions: readonly ResolvedHelpFAQ[];
}

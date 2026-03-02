export const fallbackLng = "en";
export const defaultNS = "translation";
export const localeCookieName = "locale";

export const supportedLngs = [
  "en",
  "de",
  "ja",
  "es",
  "fa",
  "fr",
  "it",
  "el",
  "ko",
  "uk",
  "nl",
  "sv",
  "pl",
  "pt",
  "ru",
  "tr",
  "hi",
  "id",
  "vi",
  "ms",
  "he",
  "ar",
  "th",
  "bo",
  "bn",
  "ta",
  "si",
  "zh-CN",
  "zh-TW",
] as const;

export type SupportedLanguage = (typeof supportedLngs)[number];

export const supportedLngSet = new Set<SupportedLanguage>(supportedLngs);

export function matchSupportedLanguage(language?: string | null): SupportedLanguage | null {
  if (!language) return null;
  if (supportedLngSet.has(language as SupportedLanguage)) {
    return language as SupportedLanguage;
  }

  const baseLanguage = language.split("-")[0];
  if (supportedLngSet.has(baseLanguage as SupportedLanguage)) {
    return baseLanguage as SupportedLanguage;
  }

  return null;
}

export function normalizeToSupportedLanguage(language?: string | null): SupportedLanguage {
  const matchedLanguage = matchSupportedLanguage(language);
  if (matchedLanguage) return matchedLanguage;
  return fallbackLng;
}

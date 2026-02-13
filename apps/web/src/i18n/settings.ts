export const fallbackLng = "en";
export const defaultNS = "translation";

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

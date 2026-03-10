import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { env, pipeline } from "@huggingface/transformers";

import {
  fallbackLng,
  type SupportedLanguage,
  supportedLngs,
} from "../src/i18n/settings";

type TranslationMap = Record<string, string>;
type TranslatorDType = "fp32" | "fp16" | "q8" | "q4" | "q4f16";
type PlaceholderToken = {
  token: string;
  value: string;
};
type TranslationAssessment = {
  suspicious: boolean;
  reasons: string[];
};
type TranslationStats = {
  translated: number;
  retried: number;
  keptCurrent: number;
  keptSource: number;
  suspicious: number;
};
type ScriptFamily =
  | "latin"
  | "arabic"
  | "cyrillic"
  | "greek"
  | "devanagari"
  | "hangul"
  | "han"
  | "hebrew"
  | "thai"
  | "bengali"
  | "tamil"
  | "sinhala"
  | "tibetan"
  | "hiragana"
  | "katakana";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const appRoot = path.resolve(__dirname, "..");
const localesRoot = path.join(appRoot, "src", "i18n", "messages");
const baseLocalePath = path.join(localesRoot, `${fallbackLng}.json`);
const placeholderReplacePattern =
  /\{\{[^}]+\}\}|%[a-zA-Z]|@[a-zA-Z0-9._-]+|[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}|https?:\/\/\S+|•+/g;
const placeholderExtractPattern =
  /\{\{[^}]+\}\}|%[a-zA-Z]|@[a-zA-Z0-9._-]+|[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}|https?:\/\/\S+|•+/g;
const tokenRemnantPattern = /__(?:EDGE|TERM|PH)_\d+__/;
const protectedLiterals = [
  "SaaS Recipes",
  "saas.recipes",
  "GitHub",
  "PostHog",
  "Next.js",
  "TypeScript",
  "@trev.fyi",
  "you@example.com",
].sort((left, right) => right.length - left.length);
const nllbLanguageByLocale: Record<SupportedLanguage, string> = {
  en: "eng_Latn",
  de: "deu_Latn",
  ja: "jpn_Jpan",
  es: "spa_Latn",
  fa: "pes_Arab",
  fr: "fra_Latn",
  it: "ita_Latn",
  el: "ell_Grek",
  ko: "kor_Hang",
  uk: "ukr_Cyrl",
  nl: "nld_Latn",
  sv: "swe_Latn",
  pl: "pol_Latn",
  pt: "por_Latn",
  ru: "rus_Cyrl",
  tr: "tur_Latn",
  hi: "hin_Deva",
  id: "ind_Latn",
  vi: "vie_Latn",
  ms: "zsm_Latn",
  he: "heb_Hebr",
  ar: "arb_Arab",
  th: "tha_Thai",
  bo: "bod_Tibt",
  bn: "ben_Beng",
  ta: "tam_Taml",
  si: "sin_Sinh",
  "zh-CN": "zho_Hans",
  "zh-TW": "zho_Hant",
};
const validDTypes = new Set(["fp32", "fp16", "q8", "q4", "q4f16"]);
const modelId =
  process.env.I18N_LOCAL_MODEL_ID ?? "Xenova/nllb-200-distilled-600M";
const modelCacheDir =
  process.env.I18N_MODEL_CACHE_DIR ??
  path.join(appRoot, ".cache", "transformers");
const configuredDType = process.env.I18N_MODEL_DTYPE ?? "q8";
const modelDType = (
  validDTypes.has(configuredDType) ? configuredDType : "q8"
) as TranslatorDType;
const configuredRetryDType = process.env.I18N_RETRY_MODEL_DTYPE ?? "fp32";
const retryModelDType = (
  validDTypes.has(configuredRetryDType) ? configuredRetryDType : "fp32"
) as TranslatorDType;
const batchSize = parsePositiveInteger(
  process.env.I18N_TRANSLATION_BATCH_SIZE,
  64,
);
const preciseModelThreshold = parsePositiveInteger(
  process.env.I18N_PRECISE_MODEL_MAX_SOURCE_LENGTH,
  32,
);
const missingOnly = process.argv.includes("--missing-only");
const offlineOnly = process.argv.includes("--offline");
const targetLocales = parseTargetLocales(process.argv.slice(2));
const translatorPromises = new Map<TranslatorDType, Promise<any>>();
const localeScriptFamilies: Record<SupportedLanguage, ScriptFamily[]> = {
  en: ["latin"],
  de: ["latin"],
  ja: ["han", "hiragana", "katakana"],
  es: ["latin"],
  fa: ["arabic"],
  fr: ["latin"],
  it: ["latin"],
  el: ["greek"],
  ko: ["hangul"],
  uk: ["cyrillic"],
  nl: ["latin"],
  sv: ["latin"],
  pl: ["latin"],
  pt: ["latin"],
  ru: ["cyrillic"],
  tr: ["latin"],
  hi: ["devanagari"],
  id: ["latin"],
  vi: ["latin"],
  ms: ["latin"],
  he: ["hebrew"],
  ar: ["arabic"],
  th: ["thai"],
  bo: ["tibetan"],
  bn: ["bengali"],
  ta: ["tamil"],
  si: ["sinhala"],
  "zh-CN": ["han"],
  "zh-TW": ["han"],
};
const scriptRegexByFamily: Record<ScriptFamily, RegExp> = {
  latin: /\p{Script_Extensions=Latin}/u,
  arabic: /\p{Script_Extensions=Arabic}/u,
  cyrillic: /\p{Script_Extensions=Cyrillic}/u,
  greek: /\p{Script_Extensions=Greek}/u,
  devanagari: /\p{Script_Extensions=Devanagari}/u,
  hangul: /\p{Script_Extensions=Hangul}/u,
  han: /\p{Script_Extensions=Han}/u,
  hebrew: /\p{Script_Extensions=Hebrew}/u,
  thai: /\p{Script_Extensions=Thai}/u,
  bengali: /\p{Script_Extensions=Bengali}/u,
  tamil: /\p{Script_Extensions=Tamil}/u,
  sinhala: /\p{Script_Extensions=Sinhala}/u,
  tibetan: /\p{Script_Extensions=Tibetan}/u,
  hiragana: /\p{Script_Extensions=Hiragana}/u,
  katakana: /\p{Script_Extensions=Katakana}/u,
};

function parsePositiveInteger(
  value: string | undefined,
  fallbackValue: number,
): number {
  const parsed = Number(value);
  if (!Number.isInteger(parsed) || parsed <= 0) {
    return fallbackValue;
  }
  return parsed;
}

function parseTargetLocales(args: string[]): SupportedLanguage[] {
  const localeValues = args.flatMap((argument) => {
    if (argument.startsWith("--locale=")) {
      return argument.slice("--locale=".length).split(",");
    }
    if (argument.startsWith("--locales=")) {
      return argument.slice("--locales=".length).split(",");
    }
    return [];
  });

  if (localeValues.length === 0) {
    return [...supportedLngs];
  }

  const uniqueLocales = new Set<SupportedLanguage>();
  for (const rawLocale of localeValues) {
    const locale = rawLocale.trim();
    if (!locale) {
      continue;
    }
    if (!supportedLngs.includes(locale as SupportedLanguage)) {
      throw new Error(
        `Unsupported locale "${locale}". Expected one of: ${supportedLngs.join(", ")}.`,
      );
    }
    uniqueLocales.add(locale as SupportedLanguage);
  }

  return [...uniqueLocales];
}

function normalizeErrorMessage(error: unknown): string {
  if (error instanceof Error) {
    return error.message;
  }
  if (typeof error === "string") {
    return error;
  }
  return JSON.stringify(error);
}

async function readJsonFile(filePath: string): Promise<TranslationMap> {
  try {
    const content = await readFile(filePath, "utf8");
    return JSON.parse(content) as TranslationMap;
  } catch (error) {
    const typedError = error as NodeJS.ErrnoException;
    if (typedError.code === "ENOENT") {
      return {};
    }
    throw error;
  }
}

function protectText(text: string): {
  text: string;
  tokens: PlaceholderToken[];
} {
  const tokens: PlaceholderToken[] = [];
  const nextToken = (kind: "EDGE" | "TERM" | "PH", value: string): string => {
    const token = `__${kind}_${tokens.length}__`;
    tokens.push({ token, value });
    return token;
  };
  let workingText = text.replace(/^\s+|\s+$/g, (match) =>
    nextToken("EDGE", match),
  );

  for (const literal of protectedLiterals) {
    if (!workingText.includes(literal)) {
      continue;
    }
    workingText = workingText.split(literal).join(nextToken("TERM", literal));
  }

  workingText = workingText.replace(placeholderReplacePattern, (match) =>
    nextToken("PH", match),
  );
  return { text: workingText, tokens };
}

function restoreProtectedText(
  text: string,
  tokens: PlaceholderToken[],
): string {
  let restored = text;
  for (const { token, value } of tokens) {
    restored = restored.replaceAll(token, value);
  }
  return restored;
}

function shouldBypassTranslation(text: string): boolean {
  const trimmed = text.trim();
  if (!trimmed) {
    return true;
  }
  if (/^[\d\W_]+$/u.test(trimmed)) {
    return true;
  }
  if (protectedLiterals.includes(trimmed)) {
    return true;
  }
  return false;
}

function getPlaceholderMatches(text: string): string[] {
  return text.match(placeholderExtractPattern) ?? [];
}

function getProtectedLiteralsInText(text: string): string[] {
  return protectedLiterals.filter((literal) => text.includes(literal));
}

function getLetterMatches(text: string): string[] {
  return text.match(/\p{Letter}+/gu) ?? [];
}

function hasRepeatedWordRun(text: string): boolean {
  const words = getLetterMatches(text)
    .map((word) => word.toLocaleLowerCase())
    .filter((word) => word.length >= 3);
  let runLength = 1;
  for (let index = 1; index < words.length; index += 1) {
    if (words[index] === words[index - 1]) {
      runLength += 1;
      if (runLength >= 3) {
        return true;
      }
    } else {
      runLength = 1;
    }
  }
  return false;
}

function getUnexpectedScriptFamilies(
  text: string,
  locale: SupportedLanguage,
): ScriptFamily[] {
  const expectedScripts = new Set<ScriptFamily>([
    "latin",
    ...localeScriptFamilies[locale],
  ]);
  return (Object.keys(scriptRegexByFamily) as ScriptFamily[]).filter(
    (family) => {
      if (expectedScripts.has(family)) {
        return false;
      }
      return scriptRegexByFamily[family].test(text);
    },
  );
}

function missingExpectedNonLatinScript(
  text: string,
  locale: SupportedLanguage,
): boolean {
  const expectedScripts = localeScriptFamilies[locale].filter(
    (family) => family !== "latin",
  );
  if (expectedScripts.length === 0) {
    return false;
  }
  const letterCount = getLetterMatches(text).join("").length;
  if (letterCount < 6) {
    return false;
  }
  return !expectedScripts.some((family) =>
    scriptRegexByFamily[family].test(text),
  );
}

function assessTranslation(
  source: string,
  candidate: string,
  locale: SupportedLanguage,
): TranslationAssessment {
  const reasons: string[] = [];
  const normalizedCandidate = candidate.trim();
  const normalizedSource = source.trim();

  if (!normalizedCandidate) {
    reasons.push("empty");
  }
  if (tokenRemnantPattern.test(candidate)) {
    reasons.push("token-remnant");
  }
  if (
    normalizedCandidate === normalizedSource &&
    getLetterMatches(source).length > 0
  ) {
    reasons.push("unchanged-source");
  }
  if (/^\s*[-•]/u.test(candidate) && !/^\s*[-•]/u.test(source)) {
    reasons.push("unexpected-prefix");
  }
  if (hasRepeatedWordRun(candidate)) {
    reasons.push("repeated-words");
  }

  const sourcePlaceholders = getPlaceholderMatches(source);
  for (const placeholder of sourcePlaceholders) {
    if (!candidate.includes(placeholder)) {
      reasons.push(`missing-placeholder:${placeholder}`);
    }
  }

  const sourceLiterals = getProtectedLiteralsInText(source);
  for (const literal of sourceLiterals) {
    if (!candidate.includes(literal)) {
      reasons.push(`missing-literal:${literal}`);
    }
  }

  const sourceLength = Math.max(normalizedSource.length, 1);
  const candidateLength = normalizedCandidate.length;
  if (candidateLength > sourceLength * 3 && sourceLength < 120) {
    reasons.push("too-long");
  }
  if (candidateLength < sourceLength * 0.35 && sourceLength > 20) {
    reasons.push("too-short");
  }

  const unexpectedScripts = getUnexpectedScriptFamilies(candidate, locale);
  if (unexpectedScripts.length > 0) {
    reasons.push(`unexpected-script:${unexpectedScripts.join(",")}`);
  }
  if (missingExpectedNonLatinScript(candidate, locale)) {
    reasons.push("missing-target-script");
  }

  return {
    suspicious: reasons.length > 0,
    reasons,
  };
}

function chooseTranslatorOrder(source: string): TranslatorDType[] {
  const shouldPreferPreciseModel =
    source.length <= preciseModelThreshold ||
    getLetterMatches(source).length <= 4 ||
    getPlaceholderMatches(source).length > 0 ||
    getProtectedLiteralsInText(source).length > 0;

  const ordered: TranslatorDType[] = shouldPreferPreciseModel
    ? [retryModelDType, modelDType]
    : [modelDType, retryModelDType];

  return ordered.filter((dtype, index) => ordered.indexOf(dtype) === index);
}

async function getTranslator(dtype: TranslatorDType): Promise<any> {
  const existing = translatorPromises.get(dtype);
  if (existing) {
    return existing;
  }

  const nextPromise = (async () => {
    await mkdir(modelCacheDir, { recursive: true });
    env.cacheDir = modelCacheDir;
    env.allowLocalModels = true;
    env.allowRemoteModels = !offlineOnly;
    return pipeline("translation", modelId, {
      dtype,
    });
  })();

  translatorPromises.set(dtype, nextPromise);
  return nextPromise;
}

async function translateWithDType(
  text: string,
  language: SupportedLanguage,
  dtype: TranslatorDType,
): Promise<string> {
  const translator = await getTranslator(dtype);
  const result = (await translator(text, {
    src_lang: nllbLanguageByLocale[fallbackLng],
    tgt_lang: nllbLanguageByLocale[language],
  })) as Array<{ translation_text?: string }>;

  return result[0]?.translation_text?.trim() ?? "";
}

function collectKeysToTranslate(
  language: SupportedLanguage,
  baseTranslations: TranslationMap,
  currentTranslations: TranslationMap,
): string[] {
  if (language === fallbackLng) {
    return [];
  }

  const keys: string[] = [];
  for (const [key, baseValue] of Object.entries(baseTranslations)) {
    const currentValue = currentTranslations[key];
    if (!missingOnly) {
      keys.push(key);
      continue;
    }
    const isMissing =
      typeof currentValue !== "string" || currentValue.trim() === "";
    const stillEnglish = currentValue === baseValue;
    if (isMissing || stillEnglish) {
      keys.push(key);
    }
  }

  return keys;
}

async function translateBatch(
  language: SupportedLanguage,
  sourceBatch: TranslationMap,
  currentTranslations: TranslationMap,
  stats: TranslationStats,
): Promise<TranslationMap> {
  const translated: TranslationMap = {};

  for (const [key, value] of Object.entries(sourceBatch)) {
    if (shouldBypassTranslation(value)) {
      translated[key] = value;
      continue;
    }

    const protectedValue = protectText(value);
    const attempts = chooseTranslatorOrder(value);
    let acceptedTranslation: string | null = null;
    let acceptedAssessment: TranslationAssessment | null = null;

    for (const [attemptIndex, dtype] of attempts.entries()) {
      const rawTranslation = await translateWithDType(
        protectedValue.text,
        language,
        dtype,
      );
      const restoredTranslation = restoreProtectedText(
        rawTranslation || value,
        protectedValue.tokens,
      );
      const assessment = assessTranslation(
        value,
        restoredTranslation,
        language,
      );
      if (!assessment.suspicious) {
        acceptedTranslation = restoredTranslation;
        acceptedAssessment = assessment;
        if (attemptIndex > 0) {
          stats.retried += 1;
        }
        break;
      }
      acceptedAssessment = assessment;
    }

    if (acceptedTranslation) {
      translated[key] = acceptedTranslation;
      stats.translated += 1;
      continue;
    }

    stats.suspicious += 1;
    const currentValue = currentTranslations[key];
    const hasUsableCurrentValue =
      typeof currentValue === "string" &&
      currentValue.trim() !== "" &&
      !assessTranslation(value, currentValue, language).suspicious;

    if (hasUsableCurrentValue) {
      translated[key] = currentValue;
      stats.keptCurrent += 1;
      continue;
    }

    translated[key] = value;
    stats.keptSource += 1;
    console.warn(
      `Suspicious translation for ${language}:${key}; falling back to source. Reasons: ${acceptedAssessment?.reasons.join(", ") ?? "unknown"}.`,
    );
  }

  return translated;
}

async function generateTranslations(
  language: SupportedLanguage,
  baseTranslations: TranslationMap,
  currentTranslations: TranslationMap,
  keysToTranslate: string[],
  stats: TranslationStats,
  onChunkTranslated?: (partialGenerated: TranslationMap) => Promise<void>,
): Promise<TranslationMap> {
  const generated: TranslationMap = {};

  for (let index = 0; index < keysToTranslate.length; index += batchSize) {
    const chunkKeys = keysToTranslate.slice(index, index + batchSize);
    const chunkSource = Object.fromEntries(
      chunkKeys.map((key) => [key, baseTranslations[key]]),
    );
    const translatedChunk = await translateBatch(
      language,
      chunkSource,
      currentTranslations,
      stats,
    );
    Object.assign(generated, translatedChunk);
    if (onChunkTranslated) {
      await onChunkTranslated(generated);
    }
    console.log(
      `Translated ${Math.min(index + batchSize, keysToTranslate.length)}/${keysToTranslate.length} keys for ${language}.`,
    );
  }

  return generated;
}

function buildLocaleTranslations(
  language: SupportedLanguage,
  baseTranslations: TranslationMap,
  currentTranslations: TranslationMap,
  generatedTranslations: TranslationMap,
): TranslationMap {
  const next: TranslationMap = {};

  for (const [key, baseValue] of Object.entries(baseTranslations)) {
    if (language === fallbackLng) {
      next[key] = baseValue;
      continue;
    }

    const generatedValue = generatedTranslations[key];
    if (typeof generatedValue === "string" && generatedValue.trim() !== "") {
      next[key] = generatedValue;
      continue;
    }

    const currentValue = currentTranslations[key];
    if (typeof currentValue === "string" && currentValue.trim() !== "") {
      next[key] = currentValue;
      continue;
    }

    next[key] = baseValue;
  }

  return next;
}

async function writeLocaleIfChanged(
  languagePath: string,
  currentTranslations: TranslationMap,
  nextTranslations: TranslationMap,
): Promise<"created" | "updated" | "unchanged"> {
  const currentSerialized = JSON.stringify(currentTranslations);
  const nextSerialized = JSON.stringify(nextTranslations);
  const wasCreated = Object.keys(currentTranslations).length === 0;

  if (currentSerialized === nextSerialized) {
    return "unchanged";
  }

  await writeFile(
    languagePath,
    `${JSON.stringify(nextTranslations, null, 2)}\n`,
    "utf8",
  );
  return wasCreated ? "created" : "updated";
}

async function syncLocales() {
  if (targetLocales.length === 0) {
    throw new Error("No locales selected for sync.");
  }

  const baseTranslations = await readJsonFile(baseLocalePath);
  const baseKeyCount = Object.keys(baseTranslations).length;
  if (baseKeyCount === 0) {
    throw new Error(
      `Base locale is empty or missing at ${baseLocalePath}. Add keys before syncing locales.`,
    );
  }

  await mkdir(localesRoot, { recursive: true });

  let createdFiles = 0;
  let updatedFiles = 0;
  const stats: TranslationStats = {
    translated: 0,
    retried: 0,
    keptCurrent: 0,
    keptSource: 0,
    suspicious: 0,
  };
  const failedLanguages: string[] = [];

  console.log(
    `Using local model ${modelId} (${modelDType}) with cache at ${modelCacheDir}${offlineOnly ? " in offline-only mode" : ""}.`,
  );
  console.log(
    `Syncing ${targetLocales.length} locale(s) from ${fallbackLng}.json${missingOnly ? " (missing-only mode)." : "."}`,
  );

  for (const language of targetLocales) {
    const languagePath = path.join(localesRoot, `${language}.json`);
    const currentTranslations = await readJsonFile(languagePath);
    const keysToTranslate = collectKeysToTranslate(
      language,
      baseTranslations,
      currentTranslations,
    );

    console.log(`Processing locale ${language}...`);

    let generatedTranslations: TranslationMap = {};
    if (keysToTranslate.length > 0) {
      try {
        generatedTranslations = await generateTranslations(
          language,
          baseTranslations,
          currentTranslations,
          keysToTranslate,
          stats,
          async (partialGenerated) => {
            const partialTranslations = buildLocaleTranslations(
              language,
              baseTranslations,
              currentTranslations,
              partialGenerated,
            );
            const writeResult = await writeLocaleIfChanged(
              languagePath,
              currentTranslations,
              partialTranslations,
            );
            if (writeResult !== "unchanged") {
              console.log(
                `Saved ${language}.json (${writeResult}) with partial progress.`,
              );
            }
          },
        );
      } catch (error) {
        failedLanguages.push(language);
        console.error(
          `Failed translating ${language}; preserving current values. Reason: ${normalizeErrorMessage(error)}`,
        );
      }
    }

    const nextTranslations = buildLocaleTranslations(
      language,
      baseTranslations,
      currentTranslations,
      generatedTranslations,
    );
    const writeResult = await writeLocaleIfChanged(
      languagePath,
      currentTranslations,
      nextTranslations,
    );
    if (writeResult === "created") {
      createdFiles += 1;
    } else if (writeResult === "updated") {
      updatedFiles += 1;
    }
  }

  console.log(
    `i18n sync complete: ${targetLocales.length} locales, ${baseKeyCount} keys, ${stats.translated} translated, ${stats.retried} retried, ${stats.keptCurrent} kept-current, ${stats.keptSource} source-fallback, ${createdFiles} created, ${updatedFiles} updated.`,
  );
  if (stats.suspicious > 0) {
    console.warn(`Suspicious translations detected: ${stats.suspicious}.`);
  }
  if (failedLanguages.length > 0) {
    console.warn(
      `Locales with translation failures: ${failedLanguages.join(", ")}.`,
    );
  }
}

void syncLocales();

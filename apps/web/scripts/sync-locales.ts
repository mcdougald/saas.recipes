import { mkdir, readFile, writeFile } from "node:fs/promises";
import { createRequire } from "node:module";
import { existsSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { z } from "zod";
import { fallbackLng, supportedLngs } from "../src/i18n/settings";

type TranslationMap = Record<string, string>;
type PlaceholderToken = {
  token: string;
  value: string;
};

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const require = createRequire(import.meta.url);
const { generateObject } = require("ai") as {
  generateObject: (input: {
    model: unknown;
    schema: z.ZodTypeAny;
    prompt: string;
  }) => Promise<{ object: TranslationMap }>;
};
const { google } = require("@ai-sdk/google") as {
  google: (modelName: string) => unknown;
};
const appRoot = path.resolve(__dirname, "..");
const localesRoot = path.join(appRoot, "src", "i18n", "messages");
const baseLocalePath = path.join(localesRoot, `${fallbackLng}.json`);

function loadEnvFiles() {
  const envCandidates = [
    path.resolve(appRoot, ".env.local"),
    path.resolve(appRoot, ".env"),
    path.resolve(appRoot, "../../.env.local"),
    path.resolve(appRoot, "../../.env"),
  ];

  for (const envPath of envCandidates) {
    if (!existsSync(envPath)) {
      continue;
    }

    if (typeof process.loadEnvFile === "function") {
      process.loadEnvFile(envPath);
    }
  }
}

loadEnvFiles();

const modelName = process.env.I18N_TRANSLATION_MODEL ?? "gemini-2.0-flash";
const batchSize = Number(process.env.I18N_TRANSLATION_BATCH_SIZE ?? "30");
const forceRetranslate = process.argv.includes("--force");
const translationSchema = z.record(z.string(), z.string());
const placeholderPattern = /\{\{[^}]+\}\}|%[a-zA-Z]/g;
const languageNames = new Intl.DisplayNames(["en"], { type: "language" });

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

function formatLanguageName(language: string): string {
  const baseLanguage = language.split("-")[0];
  return languageNames.of(baseLanguage) ?? language;
}

function shouldUseMachineTranslation(
  baseTranslations: TranslationMap,
  currentTranslations: TranslationMap,
): boolean {
  for (const [key, baseValue] of Object.entries(baseTranslations)) {
    const currentValue = currentTranslations[key];
    if (
      typeof currentValue === "string" &&
      currentValue.trim() !== "" &&
      currentValue !== baseValue
    ) {
      return false;
    }
  }
  return true;
}

function collectKeysToTranslate(
  baseTranslations: TranslationMap,
  currentTranslations: TranslationMap,
  translateBaseMatches: boolean,
): string[] {
  const keys: string[] = [];
  for (const [key, baseValue] of Object.entries(baseTranslations)) {
    const currentValue = currentTranslations[key];
    const isMissing = typeof currentValue !== "string" || currentValue.trim() === "";
    const isBaseMatch = currentValue === baseValue;
    if (isMissing || (translateBaseMatches && isBaseMatch)) {
      keys.push(key);
    }
  }
  return keys;
}

function protectPlaceholders(text: string): { text: string; tokens: PlaceholderToken[] } {
  const tokens: PlaceholderToken[] = [];
  let index = 0;
  const protectedText = text.replace(placeholderPattern, (match) => {
    const token = `__PLACEHOLDER_${index}__`;
    tokens.push({ token, value: match });
    index += 1;
    return token;
  });
  return { text: protectedText, tokens };
}

function restorePlaceholders(text: string, tokens: PlaceholderToken[]): string {
  let restored = text;
  for (const { token, value } of tokens) {
    restored = restored.replaceAll(token, value);
  }
  return restored;
}

async function translateBatch(
  language: string,
  sourceBatch: TranslationMap,
): Promise<TranslationMap> {
  const preparedEntries = Object.entries(sourceBatch).map(([key, value]) => {
    const protectedValue = protectPlaceholders(value);
    return [key, protectedValue] as const;
  });

  const promptPayload = Object.fromEntries(
    preparedEntries.map(([key, protectedValue]) => [key, protectedValue.text]),
  );

  const { object } = await generateObject({
    model: google(modelName),
    schema: translationSchema,
    prompt: [
      `Translate the JSON values from English into ${formatLanguageName(language)} (${language}).`,
      "Return the same keys with translated string values only.",
      "Do not translate brand names: SaaS Recipes, GitHub, PostHog, Next.js.",
      "Never alter placeholder tokens like __PLACEHOLDER_0__ and keep punctuation/whitespace intent.",
      "If a string should remain unchanged, return it exactly as-is.",
      "",
      JSON.stringify(promptPayload),
    ].join("\n"),
  });

  const translated: TranslationMap = {};
  for (const [key, protectedValue] of preparedEntries) {
    const rawResult = object[key];
    const normalized =
      typeof rawResult === "string" && rawResult.trim() !== ""
        ? rawResult
        : protectedValue.text;
    translated[key] = restorePlaceholders(normalized, protectedValue.tokens);
  }

  return translated;
}

async function generateTranslations(
  language: string,
  baseTranslations: TranslationMap,
  keysToTranslate: string[],
): Promise<TranslationMap> {
  const generated: TranslationMap = {};

  for (let i = 0; i < keysToTranslate.length; i += batchSize) {
    const chunkKeys = keysToTranslate.slice(i, i + batchSize);
    const chunkSource: TranslationMap = Object.fromEntries(
      chunkKeys.map((key) => [key, baseTranslations[key]]),
    );
    const translatedChunk = await translateBatch(language, chunkSource);
    Object.assign(generated, translatedChunk);
    console.log(
      `Translated ${Math.min(i + batchSize, keysToTranslate.length)}/${keysToTranslate.length} keys for ${language}.`,
    );
  }

  return generated;
}

function buildLocaleTranslations(
  baseTranslations: TranslationMap,
  currentTranslations: TranslationMap,
  generatedTranslations: TranslationMap,
): TranslationMap {
  const next: TranslationMap = {};

  for (const [key, baseValue] of Object.entries(baseTranslations)) {
    const generatedValue = generatedTranslations[key];
    const currentValue = currentTranslations[key];

    if (typeof generatedValue === "string" && generatedValue.trim() !== "") {
      next[key] = generatedValue;
      continue;
    }

    if (typeof currentValue === "string" && currentValue.trim() !== "") {
      next[key] = currentValue;
      continue;
    }

    next[key] = baseValue;
  }

  return next;
}

async function syncLocales() {
  if (!process.env.GOOGLE_GENERATIVE_AI_API_KEY) {
    throw new Error(
      "Missing GOOGLE_GENERATIVE_AI_API_KEY. Set it before running i18n:sync so translations can be generated.",
    );
  }

  if (!Number.isInteger(batchSize) || batchSize <= 0) {
    throw new Error("I18N_TRANSLATION_BATCH_SIZE must be a positive integer.");
  }

  const baseTranslations = await readJsonFile(baseLocalePath);
  const baseKeyCount = Object.keys(baseTranslations).length;

  if (baseKeyCount === 0) {
    throw new Error(
      `Base locale is empty or missing at ${baseLocalePath}. Add keys before syncing locales.`,
    );
  }

  let createdFiles = 0;
  let updatedFiles = 0;
  let translatedEntries = 0;

  for (const language of supportedLngs) {
    const languagePath = path.join(localesRoot, `${language}.json`);
    await mkdir(localesRoot, { recursive: true });

    const currentTranslations = await readJsonFile(languagePath);
    const shouldTranslateBaseMatches =
      forceRetranslate || shouldUseMachineTranslation(baseTranslations, currentTranslations);
    const keysToTranslate =
      language === fallbackLng
        ? []
        : collectKeysToTranslate(
            baseTranslations,
            currentTranslations,
            shouldTranslateBaseMatches,
          );

    const generatedTranslations =
      keysToTranslate.length === 0
        ? {}
        : await generateTranslations(language, baseTranslations, keysToTranslate);
    translatedEntries += Object.keys(generatedTranslations).length;

    const nextTranslations = buildLocaleTranslations(
      baseTranslations,
      currentTranslations,
      generatedTranslations,
    );

    const currentSerialized = JSON.stringify(currentTranslations);
    const nextSerialized = JSON.stringify(nextTranslations);
    const wasCreated = Object.keys(currentTranslations).length === 0;

    if (currentSerialized !== nextSerialized) {
      await writeFile(
        languagePath,
        `${JSON.stringify(nextTranslations, null, 2)}\n`,
        "utf8",
      );
      if (wasCreated) {
        createdFiles += 1;
      } else {
        updatedFiles += 1;
      }
    }
  }

  console.log(
    `i18n sync complete: ${supportedLngs.length} locales, ${baseKeyCount} keys, ${translatedEntries} generated, ${createdFiles} created, ${updatedFiles} updated.`,
  );
}

void syncLocales();

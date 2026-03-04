import { mkdir, readFile, writeFile } from "node:fs/promises";
import { createRequire } from "node:module";
import { existsSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { z } from "zod";
import { fallbackLng, supportedLngs } from "../src/i18n/settings";

type TranslationMap = Record<string, string>;
type TranslationProvider = "auto" | "google" | "openai";
type ConcreteTranslationProvider = Exclude<TranslationProvider, "auto">;
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

const providerFromEnv = process.env.I18N_TRANSLATION_PROVIDER?.toLowerCase();
const translationProvider: TranslationProvider =
  providerFromEnv === "google" || providerFromEnv === "openai" || providerFromEnv === "auto"
    ? providerFromEnv
    : "auto";
const googleModelName = process.env.I18N_TRANSLATION_MODEL ?? "gemini-2.0-flash";
const openAiModelName = process.env.I18N_OPENAI_MODEL ?? "gpt-4o-mini";
const batchSize = Number(process.env.I18N_TRANSLATION_BATCH_SIZE ?? "30");
const requestDelayMs = Number(process.env.I18N_REQUEST_DELAY_MS ?? "1500");
const maxBatchRetries = Number(process.env.I18N_MAX_BATCH_RETRIES ?? "8");
const retryBaseDelayMs = Number(process.env.I18N_RETRY_BASE_DELAY_MS ?? "2000");
const retryMaxDelayMs = Number(process.env.I18N_RETRY_MAX_DELAY_MS ?? "90000");
const retryJitterMs = Number(process.env.I18N_RETRY_JITTER_MS ?? "400");
const forceRetranslate = process.argv.includes("--force");
const translationSchema = z.record(z.string(), z.string());
const placeholderPattern = /\{\{[^}]+\}\}|%[a-zA-Z]/g;
const languageNames = new Intl.DisplayNames(["en"], { type: "language" });
let lastTranslationRequestAt = 0;
const providerAvailability: Record<ConcreteTranslationProvider, boolean> = {
  google: Boolean(process.env.GOOGLE_GENERATIVE_AI_API_KEY),
  openai: Boolean(process.env.OPENAI_API_KEY),
};
const providerDisableReason: Partial<Record<ConcreteTranslationProvider, string>> = {};

function normalizeErrorMessage(error: unknown): string {
  if (error instanceof Error) {
    return error.message;
  }
  if (typeof error === "string") {
    return error;
  }
  return JSON.stringify(error);
}

function isQuotaExceededError(error: unknown): boolean {
  const message = normalizeErrorMessage(error).toLowerCase();
  return (
    message.includes("quota exceeded") ||
    message.includes("resource_exhausted") ||
    message.includes("statuscode: 429") ||
    message.includes("status code: 429")
  );
}

function isHardQuotaLimitError(error: unknown): boolean {
  const message = normalizeErrorMessage(error).toLowerCase();
  return (
    message.includes("limit: 0") ||
    message.includes("generaterequestsperdayperprojectpermodel-freetier") ||
    message.includes("daily") ||
    message.includes("billing details") ||
    message.includes("insufficient_quota")
  );
}

function isTransientError(error: unknown): boolean {
  const message = normalizeErrorMessage(error).toLowerCase();
  return (
    message.includes("statuscode: 429") ||
    message.includes("status code: 429") ||
    message.includes("resource_exhausted") ||
    message.includes("rate limit") ||
    message.includes("timed out") ||
    message.includes("timeout") ||
    message.includes("econnreset") ||
    message.includes("econnrefused") ||
    message.includes("503") ||
    message.includes("502")
  );
}

function extractRetryDelayMs(error: unknown): number | null {
  const message = normalizeErrorMessage(error);
  const directMatch = message.match(/retry in\s+([0-9.]+)s/i);
  if (directMatch?.[1]) {
    const seconds = Number(directMatch[1]);
    if (Number.isFinite(seconds) && seconds > 0) {
      return Math.ceil(seconds * 1000);
    }
  }

  const retryInfoMatch = message.match(/"retryDelay"\s*:\s*"([0-9]+)s"/i);
  if (retryInfoMatch?.[1]) {
    const seconds = Number(retryInfoMatch[1]);
    if (Number.isFinite(seconds) && seconds > 0) {
      return seconds * 1000;
    }
  }

  return null;
}

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => {
    setTimeout(resolve, Math.max(0, ms));
  });
}

async function enforceRequestDelay(): Promise<void> {
  const now = Date.now();
  const elapsed = now - lastTranslationRequestAt;
  if (elapsed < requestDelayMs) {
    await sleep(requestDelayMs - elapsed);
  }
  lastTranslationRequestAt = Date.now();
}

async function withRetries<T>(operationName: string, run: () => Promise<T>): Promise<T> {
  let lastError: unknown;

  for (let attempt = 1; attempt <= maxBatchRetries; attempt += 1) {
    try {
      return await run();
    } catch (error) {
      lastError = error;
      const hardQuota = isHardQuotaLimitError(error);
      const retryable = !hardQuota && isTransientError(error);

      if (!retryable || attempt === maxBatchRetries) {
        throw error;
      }

      const retryHintMs = extractRetryDelayMs(error) ?? 0;
      const exponentialBackoffMs = Math.min(retryMaxDelayMs, retryBaseDelayMs * 2 ** (attempt - 1));
      const jitter = Math.floor(Math.random() * retryJitterMs);
      const waitMs = Math.max(retryHintMs, exponentialBackoffMs) + jitter;

      console.warn(
        `[${operationName}] attempt ${attempt}/${maxBatchRetries} failed; retrying in ${Math.ceil(waitMs / 1000)}s.`,
      );
      await sleep(waitMs);
    }
  }

  throw lastError;
}

function availableProviders(): ConcreteTranslationProvider[] {
  return (["google", "openai"] as const).filter((provider) => providerAvailability[provider]);
}

function disableProvider(provider: ConcreteTranslationProvider, reason: string): void {
  providerAvailability[provider] = false;
  providerDisableReason[provider] = reason;
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

function createTranslationPrompt(language: string, promptPayload: TranslationMap): string {
  return [
    `Translate the JSON values from English into ${formatLanguageName(language)} (${language}).`,
    "Return the same keys with translated string values only.",
    "Do not translate brand names: SaaS Recipes, GitHub, PostHog, Next.js.",
    "Never alter placeholder tokens like __PLACEHOLDER_0__ and keep punctuation/whitespace intent.",
    "If a string should remain unchanged, return it exactly as-is.",
    "",
    JSON.stringify(promptPayload),
  ].join("\n");
}

async function translateWithGoogle(language: string, promptPayload: TranslationMap): Promise<TranslationMap> {
  if (!providerAvailability.google) {
    throw new Error(
      providerDisableReason.google ??
        "Google provider is unavailable for this run (key missing or quota exhausted).",
    );
  }

  const object = await withRetries(
    `google:${language}`,
    async () => {
      await enforceRequestDelay();
      const response = await generateObject({
        model: google(googleModelName),
        schema: translationSchema,
        prompt: createTranslationPrompt(language, promptPayload),
      });
      return response.object;
    },
  );

  return object;
}

function coerceJsonObject(text: string): unknown {
  const trimmed = text.trim();

  if (trimmed.startsWith("{")) {
    return JSON.parse(trimmed);
  }

  const fencedMatch = trimmed.match(/```(?:json)?\s*([\s\S]*?)\s*```/i);
  if (!fencedMatch) {
    throw new Error("OpenAI response did not contain a JSON object.");
  }

  return JSON.parse(fencedMatch[1]);
}

async function translateWithOpenAI(language: string, promptPayload: TranslationMap): Promise<TranslationMap> {
  if (!providerAvailability.openai) {
    throw new Error(
      providerDisableReason.openai ??
        "OpenAI provider is unavailable for this run (key missing or quota exhausted).",
    );
  }

  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    throw new Error(
      "Missing OPENAI_API_KEY. Set it or use I18N_TRANSLATION_PROVIDER=google with a valid Gemini quota.",
    );
  }

  const data = await withRetries(`openai:${language}`, async () => {
    await enforceRequestDelay();
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: openAiModelName,
        response_format: { type: "json_object" },
        messages: [
          {
            role: "system",
            content:
              "You are a localization assistant. Return only a valid JSON object mapping the exact same keys to translated string values.",
          },
          {
            role: "user",
            content: createTranslationPrompt(language, promptPayload),
          },
        ],
      }),
    });

    if (!response.ok) {
      const responseText = await response.text();
      throw new Error(
        `OpenAI translation request failed (${response.status} ${response.statusText}): ${responseText}`,
      );
    }

    return (await response.json()) as {
      choices?: Array<{ message?: { content?: string | null } }>;
    };
  });

  const content = data.choices?.[0]?.message?.content;
  if (!content) {
    throw new Error("OpenAI translation response did not include content.");
  }

  return translationSchema.parse(coerceJsonObject(content));
}

async function translateBatch(language: string, sourceBatch: TranslationMap): Promise<TranslationMap> {
  const preparedEntries = Object.entries(sourceBatch).map(([key, value]) => {
    const protectedValue = protectPlaceholders(value);
    return [key, protectedValue] as const;
  });

  const promptPayload = Object.fromEntries(
    preparedEntries.map(([key, protectedValue]) => [key, protectedValue.text]),
  );

  let object: TranslationMap;

  if (translationProvider === "google") {
    try {
      object = await translateWithGoogle(language, promptPayload);
    } catch (error) {
      if (isHardQuotaLimitError(error)) {
        disableProvider("google", `Google quota exhausted: ${normalizeErrorMessage(error)}`);
      }
      throw error;
    }
  } else if (translationProvider === "openai") {
    try {
      object = await translateWithOpenAI(language, promptPayload);
    } catch (error) {
      if (isHardQuotaLimitError(error)) {
        disableProvider("openai", `OpenAI quota exhausted: ${normalizeErrorMessage(error)}`);
      }
      throw error;
    }
  } else {
    let attemptedGoogle = false;
    try {
      if (providerAvailability.google) {
        attemptedGoogle = true;
        object = await translateWithGoogle(language, promptPayload);
      } else if (providerAvailability.openai) {
        object = await translateWithOpenAI(language, promptPayload);
      } else {
        throw new Error("No translation providers are available for this run.");
      }
    } catch (error) {
      if (attemptedGoogle && isHardQuotaLimitError(error)) {
        disableProvider("google", `Google quota exhausted: ${normalizeErrorMessage(error)}`);
      }

      if (!isQuotaExceededError(error) || !providerAvailability.openai) {
        throw error;
      }
      console.warn(
        `Google translation quota exhausted for ${language}; falling back to OpenAI (${openAiModelName}).`,
      );
      try {
        object = await translateWithOpenAI(language, promptPayload);
      } catch (fallbackError) {
        if (isHardQuotaLimitError(fallbackError)) {
          disableProvider("openai", `OpenAI quota exhausted: ${normalizeErrorMessage(fallbackError)}`);
        }
        throw fallbackError;
      }
    }
  }

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
  onChunkTranslated?: (partialGenerated: TranslationMap) => Promise<void>,
): Promise<TranslationMap> {
  const generated: TranslationMap = {};

  for (let i = 0; i < keysToTranslate.length; i += batchSize) {
    const chunkKeys = keysToTranslate.slice(i, i + batchSize);
    const chunkSource: TranslationMap = Object.fromEntries(
      chunkKeys.map((key) => [key, baseTranslations[key]]),
    );
    const translatedChunk = await translateBatch(language, chunkSource);
    Object.assign(generated, translatedChunk);
    if (onChunkTranslated) {
      await onChunkTranslated(generated);
    }
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

  await writeFile(languagePath, `${JSON.stringify(nextTranslations, null, 2)}\n`, "utf8");
  return wasCreated ? "created" : "updated";
}

async function syncLocales() {
  const hasGoogleKey = Boolean(process.env.GOOGLE_GENERATIVE_AI_API_KEY);
  const hasOpenAiKey = Boolean(process.env.OPENAI_API_KEY);

  if (translationProvider === "google" && !hasGoogleKey) {
    throw new Error(
      "Missing GOOGLE_GENERATIVE_AI_API_KEY. Set it or switch to I18N_TRANSLATION_PROVIDER=openai.",
    );
  }

  if (translationProvider === "openai" && !hasOpenAiKey) {
    throw new Error(
      "Missing OPENAI_API_KEY. Set it or switch to I18N_TRANSLATION_PROVIDER=google.",
    );
  }

  if (translationProvider === "auto" && !hasGoogleKey && !hasOpenAiKey) {
    throw new Error(
      "Missing translation credentials. Set GOOGLE_GENERATIVE_AI_API_KEY and/or OPENAI_API_KEY before running i18n:sync.",
    );
  }

  if (!Number.isInteger(batchSize) || batchSize <= 0) {
    throw new Error("I18N_TRANSLATION_BATCH_SIZE must be a positive integer.");
  }
  if (!Number.isInteger(requestDelayMs) || requestDelayMs < 0) {
    throw new Error("I18N_REQUEST_DELAY_MS must be a non-negative integer.");
  }
  if (!Number.isInteger(maxBatchRetries) || maxBatchRetries <= 0) {
    throw new Error("I18N_MAX_BATCH_RETRIES must be a positive integer.");
  }
  if (!Number.isInteger(retryBaseDelayMs) || retryBaseDelayMs <= 0) {
    throw new Error("I18N_RETRY_BASE_DELAY_MS must be a positive integer.");
  }
  if (!Number.isInteger(retryMaxDelayMs) || retryMaxDelayMs <= 0) {
    throw new Error("I18N_RETRY_MAX_DELAY_MS must be a positive integer.");
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
  const failedLanguages: string[] = [];

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

    console.log(`Processing locale ${language}...`);
    let generatedTranslations: TranslationMap = {};
    if (keysToTranslate.length > 0 && availableProviders().length > 0) {
      try {
        generatedTranslations = await generateTranslations(
          language,
          baseTranslations,
          keysToTranslate,
          async (partialGenerated) => {
            const partialLocaleTranslations = buildLocaleTranslations(
              baseTranslations,
              currentTranslations,
              partialGenerated,
            );
            const writeResult = await writeLocaleIfChanged(
              languagePath,
              currentTranslations,
              partialLocaleTranslations,
            );
            if (writeResult !== "unchanged") {
              console.log(`Saved ${language}.json (${writeResult}) with partial progress.`);
            }
          },
        );
      } catch (error) {
        failedLanguages.push(language);
        console.error(
          `Failed translating ${language}; preserving progress and continuing. Reason: ${normalizeErrorMessage(error)}`,
        );
      }
    } else if (keysToTranslate.length > 0) {
      failedLanguages.push(language);
      console.warn(
        `Skipping API translation for ${language}; no providers are currently available for this run.`,
      );
    }
    translatedEntries += Object.keys(generatedTranslations).length;

    const nextTranslations = buildLocaleTranslations(
      baseTranslations,
      currentTranslations,
      generatedTranslations,
    );
    const finalWriteResult = await writeLocaleIfChanged(
      languagePath,
      currentTranslations,
      nextTranslations,
    );
    if (finalWriteResult === "created") {
      createdFiles += 1;
    } else if (finalWriteResult === "updated") {
      updatedFiles += 1;
    }
  }

  console.log(
    `i18n sync complete: ${supportedLngs.length} locales, ${baseKeyCount} keys, ${translatedEntries} generated, ${createdFiles} created, ${updatedFiles} updated.`,
  );
  if (failedLanguages.length > 0) {
    console.warn(
      `Locales with translation failures (saved with best-effort progress): ${failedLanguages.join(", ")}.`,
    );
  }
  const unavailableProviders = (["google", "openai"] as const).filter(
    (provider) => !providerAvailability[provider],
  );
  if (unavailableProviders.length > 0) {
    const details = unavailableProviders
      .map((provider) => `${provider}: ${providerDisableReason[provider] ?? "unavailable"}`)
      .join(" | ");
    console.warn(`Disabled translation providers for this run -> ${details}`);
  }
}

void syncLocales();

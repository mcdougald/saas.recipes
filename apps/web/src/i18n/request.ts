import { cookies, headers } from "next/headers";
import { getRequestConfig } from "next-intl/server";

import {
  fallbackLng,
  localeCookieName,
  matchSupportedLanguage,
  normalizeToSupportedLanguage,
  type SupportedLanguage,
} from "@/i18n/settings";

type FlatMessages = Record<string, string>;
interface NestedMessages {
  [key: string]: string | NestedMessages;
}

function toIcuInterpolation(message: string): string {
  // Convert i18next placeholders ({{name}}) to ICU ({name}) for next-intl.
  return message.replace(/\{\{\s*([^}]+?)\s*\}\}/g, "{$1}");
}

function setNestedValue(
  target: NestedMessages,
  keyPath: string[],
  value: string,
): void {
  let current = target;

  for (let index = 0; index < keyPath.length - 1; index += 1) {
    const segment = keyPath[index];
    const existingValue = current[segment];

    if (!existingValue || typeof existingValue === "string") {
      current[segment] = {};
    }

    current = current[segment] as NestedMessages;
  }

  const finalKey = keyPath[keyPath.length - 1];
  current[finalKey] = value;
}

function toNestedMessages(flatMessages: FlatMessages): NestedMessages {
  const nestedMessages: NestedMessages = {};

  for (const [flatKey, message] of Object.entries(flatMessages)) {
    setNestedValue(
      nestedMessages,
      flatKey.split("."),
      typeof message === "string"
        ? toIcuInterpolation(message)
        : String(message),
    );
  }

  return nestedMessages;
}

function localeFromAcceptLanguage(
  headerValue: string | null,
): SupportedLanguage | null {
  if (!headerValue) {
    return null;
  }

  const candidates = headerValue
    .split(",")
    .map((part) => part.split(";")[0]?.trim())
    .filter(Boolean);

  for (const candidate of candidates) {
    const matchedLanguage = matchSupportedLanguage(candidate);
    if (matchedLanguage) {
      return matchedLanguage;
    }
  }

  return null;
}

export default getRequestConfig(async () => {
  const [cookieStore, requestHeaders] = await Promise.all([
    cookies(),
    headers(),
  ]);
  const cookieLocale = cookieStore.get(localeCookieName)?.value;
  const headerLocale = localeFromAcceptLanguage(
    requestHeaders.get("accept-language"),
  );
  const locale = normalizeToSupportedLanguage(
    matchSupportedLanguage(cookieLocale) ?? headerLocale,
  );

  const flatMessages = (await import(`./messages/${locale}.json`))
    .default as FlatMessages;
  const fallbackMessages =
    locale === fallbackLng
      ? flatMessages
      : ((await import(`./messages/${fallbackLng}.json`))
          .default as FlatMessages);
  const mergedMessages = { ...fallbackMessages, ...flatMessages };

  return {
    locale,
    messages: toNestedMessages(mergedMessages),
  };
});

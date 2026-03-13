"use client";

import { useRouter } from "next/navigation";
import { useLocale, useTranslations } from "next-intl";
import { useCallback } from "react";

import {
  localeCookieName,
  normalizeToSupportedLanguage,
} from "@/i18n/settings";

type TranslationValues = Record<string, string | number | boolean | Date>;

/**
 * Access localized translations and language switching helpers.
 *
 * @param namespace - Optional translation namespace to scope lookups.
 * @param options - Optional key prefix for nested translation keys.
 * @returns Translation helpers including `t`, current `language`, and `changeLanguage`.
 */
export function useI18n(namespace?: string, options?: { keyPrefix?: string }) {
  const router = useRouter();
  const language = useLocale();
  const translate = useTranslations(namespace);

  const t = useCallback(
    (key: string, values?: TranslationValues) => {
      const scopedKey = options?.keyPrefix
        ? `${options.keyPrefix}.${key}`
        : key;
      return translate(scopedKey as never, values as never);
    },
    [options?.keyPrefix, translate],
  );

  const changeLanguage = useCallback(
    (nextLanguage: string) => {
      const normalizedLanguage = normalizeToSupportedLanguage(nextLanguage);
      const currentLanguage = normalizeToSupportedLanguage(language);

      if (normalizedLanguage === currentLanguage) {
        return;
      }

      document.cookie = `${localeCookieName}=${encodeURIComponent(normalizedLanguage)}; path=/; max-age=31536000; samesite=lax`;
      router.refresh();
    },
    [language, router],
  );

  return {
    t,
    language,
    changeLanguage,
  };
}

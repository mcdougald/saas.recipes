"use client";

import { useCallback } from "react";
import { useRouter } from "next/navigation";
import { useLocale, useTranslations } from "next-intl";
import { localeCookieName, normalizeToSupportedLanguage } from "@/i18n/settings";

type TranslationValues = Record<string, string | number | boolean | Date>;

export function useI18n(namespace?: string, options?: { keyPrefix?: string }) {
  const router = useRouter();
  const language = useLocale();
  const translate = useTranslations(namespace);

  const t = useCallback(
    (key: string, values?: TranslationValues) => {
      const scopedKey = options?.keyPrefix ? `${options.keyPrefix}.${key}` : key;
      return translate(scopedKey as never, values as never);
    },
    [options?.keyPrefix, translate],
  );

  const changeLanguage = useCallback(
    (nextLanguage: string) => {
      const normalizedLanguage = normalizeToSupportedLanguage(nextLanguage);
      document.cookie = `${localeCookieName}=${encodeURIComponent(normalizedLanguage)}; path=/; max-age=31536000; samesite=lax`;
      router.refresh();
    },
    [router],
  );

  return {
    t,
    language,
    changeLanguage,
  };
}

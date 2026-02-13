"use client";

import type { Namespace } from "i18next";
import type { KeyPrefix } from "i18next";
import { useTranslation } from "react-i18next";

export function useI18n(ns?: Namespace, options?: { keyPrefix?: KeyPrefix<Namespace> }) {
  const translation = useTranslation(ns, options);

  return {
    ...translation,
    language: translation.i18n.resolvedLanguage ?? translation.i18n.language,
    changeLanguage: (lng: string) => translation.i18n.changeLanguage(lng),
  };
}

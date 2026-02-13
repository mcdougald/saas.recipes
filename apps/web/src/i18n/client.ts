"use client";

import i18n from "i18next";
import LanguageDetector from "i18next-browser-languagedetector";
import HttpBackend from "i18next-http-backend";
import { initReactI18next } from "react-i18next";
import { defaultNS, fallbackLng, supportedLngs } from "@/i18n/settings";

let isI18nInitialized = false;

export function initI18n() {
  if (isI18nInitialized || i18n.isInitialized) {
    return i18n;
  }

  i18n
    .use(HttpBackend)
    .use(LanguageDetector)
    .use(initReactI18next)
    .init({
      fallbackLng,
      supportedLngs,
      ns: [defaultNS],
      defaultNS,
      debug: process.env.NODE_ENV === "development",
      returnNull: false,
      interpolation: {
        escapeValue: false,
      },
      backend: {
        loadPath: "/locales/{{lng}}/{{ns}}.json",
      },
      detection: {
        order: ["querystring", "localStorage", "navigator", "htmlTag", "cookie"],
        caches: ["localStorage", "cookie"],
      },
      react: {
        useSuspense: false,
      },
    });

  isI18nInitialized = true;
  return i18n;
}

export { i18n };

"use client";

import * as React from "react";
import { i18n, initI18n } from "@/i18n/client";

initI18n();

export function I18nProvider({ children }: { children: React.ReactNode }) {
  React.useEffect(() => {
    const setDocumentLanguage = (language: string) => {
      document.documentElement.lang = language;
    };

    setDocumentLanguage(i18n.resolvedLanguage ?? i18n.language);
    i18n.on("languageChanged", setDocumentLanguage);

    return () => {
      i18n.off("languageChanged", setDocumentLanguage);
    };
  }, []);

  return <>{children}</>;
}

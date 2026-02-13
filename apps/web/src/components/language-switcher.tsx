"use client";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useI18n } from "@/hooks/use-i18n";
import { fallbackLng, supportedLngs, type SupportedLanguage } from "@/i18n/settings";

const languageLabels: Record<SupportedLanguage, string> = {
  en: "English",
  de: "Deutsch",
  ja: "Japanese",
  es: "Spanish",
  fa: "Persian",
  fr: "French",
  it: "Italian",
  el: "Greek",
  ko: "Korean",
  uk: "Ukrainian",
  nl: "Dutch",
  sv: "Swedish",
  pl: "Polish",
  pt: "Portuguese",
  ru: "Russian",
  tr: "Turkish",
  hi: "Hindi",
  id: "Indonesian",
  vi: "Vietnamese",
  ms: "Malay",
  he: "Hebrew",
  ar: "Arabic",
  th: "Thai",
  bo: "Tibetan",
  bn: "Bengali",
  ta: "Tamil",
  si: "Sinhala",
  "zh-CN": "Chinese (Simplified)",
  "zh-TW": "Chinese (Traditional)",
};

export function LanguageSwitcher() {
  const { t, language, changeLanguage } = useI18n();
  const activeLanguage =
    supportedLngs.find((lng) => lng === language) ?? fallbackLng;

  return (
    <Select value={activeLanguage} onValueChange={changeLanguage}>
      <SelectTrigger className="w-[150px]" aria-label={t("language.select")}>
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        {supportedLngs.map((lng) => (
          <SelectItem key={lng} value={lng}>
            {languageLabels[lng]}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}

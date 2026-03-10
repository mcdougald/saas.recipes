"use client";

import { Globe } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useI18n } from "@/hooks/use-i18n";
import {
  fallbackLng,
  type SupportedLanguage,
  supportedLngs,
} from "@/i18n/settings";
import { cn } from "@/lib/utils";

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

/**
 * Switch the active application language from an icon button menu.
 *
 * @param props.className Merge additional classes into the trigger button.
 * @returns A compact language selector optimized for header action bars.
 */
export function LanguageSwitcher({ className }: { className?: string }) {
  const { t, language, changeLanguage } = useI18n();
  const activeLanguage =
    supportedLngs.find((lng) => lng === language) ?? fallbackLng;
  const activeLanguageLabel = languageLabels[activeLanguage];

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className={cn(
            "rounded-full text-muted-foreground hover:text-foreground",
            className,
          )}
          aria-label={`${t("language.select")}: ${activeLanguageLabel}`}
        >
          <Globe className="h-[1.1rem] w-[1.1rem]" />
          <span className="sr-only">{t("language.select")}</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuLabel>{t("language.select")}</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuRadioGroup
          value={activeLanguage}
          onValueChange={(value) => changeLanguage(value as SupportedLanguage)}
        >
          {supportedLngs.map((lng) => (
            <DropdownMenuRadioItem key={lng} value={lng}>
              <span className="flex w-full items-center justify-between gap-3">
                <span>{languageLabels[lng]}</span>
                <span className="text-muted-foreground text-xs uppercase">
                  {lng}
                </span>
              </span>
            </DropdownMenuRadioItem>
          ))}
        </DropdownMenuRadioGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

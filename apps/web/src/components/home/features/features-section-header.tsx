"use client";

import { useI18n } from "@/hooks/use-i18n";

/**
 * Render the heading block for the home features section.
 *
 * @returns The localized section title and description.
 */
export function FeaturesSectionHeader() {
  const { t } = useI18n();

  return (
    <div className="mx-auto mb-14 max-w-xl text-center md:mb-16">
      <h2
        id="features-heading"
        className="mb-6 text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl"
      >
        {t("features.header.titlePrefix")}{" "}
        <span className="text-gradient-primary">
          {t("features.header.titleHighlight")}
        </span>
      </h2>
      <p className="text-lg leading-relaxed text-muted-foreground md:text-xl">
        {t("features.header.description")}
      </p>
    </div>
  );
}

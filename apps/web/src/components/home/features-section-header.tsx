"use client";

import { useI18n } from "@/hooks/use-i18n";

export function FeaturesSectionHeader() {
  const { t } = useI18n();

  return (
    <div className="mx-auto max-w-xl text-center mb-14 md:mb-16">
      <h2
        id="features-heading"
        className="text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl mb-6"
      >
        {t("features.header.titlePrefix")}{" "}
        <span className="text-gradient-primary">
          {t("features.header.titleHighlight")}
        </span>
      </h2>
      <p className="text-lg text-muted-foreground md:text-xl leading-relaxed">
        {t("features.header.description")}
      </p>
    </div>
  );
}

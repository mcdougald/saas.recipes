"use client";

import { useI18n } from "@/hooks/use-i18n";

export function HeroDescription() {
  const { t } = useI18n();

  return (
    <div className="mx-auto max-w-2xl space-y-4 text-center">
      <p className="text-lg text-muted-foreground md:text-xl">
        {t("hero.description.primary")}
      </p>
      <p className="text-lg text-muted-foreground md:text-xl">
        {t("hero.description.secondary")}
      </p>
    </div>
  );
}

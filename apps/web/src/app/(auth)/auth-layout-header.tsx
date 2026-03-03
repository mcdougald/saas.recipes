"use client";

import { useI18n } from "@/hooks/use-i18n";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export function AuthLayoutHeader() {
  const { t } = useI18n();

  return (
    <header className="shrink-0">
      <div className="grid w-full grid-cols-1 sm:grid-cols-2">
        <section className="bg-white text-black dark:bg-black dark:text-white">
          <div className="mx-auto flex w-full max-w-2xl items-center px-4 py-4 sm:px-6">
            <Link
              href="/"
              className="flex items-center gap-2 rounded-lg py-1 pl-1 pr-2 text-xl font-semibold tracking-tight transition-colors hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black/30 dark:focus-visible:ring-white/40"
              aria-label={t("authLayoutHeader.goHome")}
            >
              <Image
                src="/BlackSaasRecipesIcon.svg"
                alt={t("brand.logoAlt")}
                width={21}
                height={21}
                className="h-6 w-auto dark:hidden"
                priority
              />
              <Image
                src="/WhiteSaasRecipesIcon.svg"
                alt={t("brand.logoAlt")}
                width={21}
                height={21}
                className="hidden h-6 w-auto dark:block"
                priority
              />
              <span className="relative top-[1px] text-black dark:text-white">{t("brand.shortName")}</span>
            </Link>
          </div>
        </section>

        <section className="bg-black text-white dark:bg-white dark:text-black">
          <div className="mx-auto flex w-full max-w-2xl items-center justify-end px-4 py-4 sm:px-6">
            <Link
              href="/"
              className="group inline-flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-white/80 transition-all duration-200 hover:bg-white/10 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/50 dark:text-black/75 dark:hover:bg-black/10 dark:hover:text-black dark:focus-visible:ring-black/30"
            >
              <ArrowLeft
                className="h-4 w-4 transition-transform duration-200 group-hover:-translate-x-0.5"
                aria-hidden
              />
              <span>{t("authLayoutHeader.backToHome")}</span>
            </Link>
          </div>
        </section>
      </div>
    </header>
  );
}

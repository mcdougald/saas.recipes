"use client";

import { useI18n } from "@/hooks/use-i18n";
import Image from "next/image";
import Link from "next/link";

import { ToggleTheme } from "@/components/theme-toggle";

const footerLinks = [
  { href: "#features", labelKey: "landingFooter.links.features" },
  { href: "/pricing", labelKey: "landingFooter.links.pricing" },
  { href: "#how-it-works", labelKey: "landingFooter.links.howItWorks" },
  { href: "/sign-in", labelKey: "landingFooter.links.signIn" },
  { href: "/dashboard", labelKey: "landingFooter.links.dashboard" },
];

export function LandingFooter() {
  const { t } = useI18n();
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t bg-linear-to-b from-background to-muted/20" role="contentinfo">
      <div className="container mx-auto px-4 py-12">
        <div className="grid gap-10 md:grid-cols-[1.5fr_1fr_auto] md:items-start">
          <div className="space-y-4">
            <Link
              href="/"
              className="inline-flex items-center gap-2 font-semibold text-foreground text-xl tracking-tight"
            >
              <Image
                src="/SaasRecipesIcon.svg"
                alt={t("brand.logoAlt")}
                width={28}
                height={35}
                className="h-6 w-auto"
              />
              <span>{t("brand.shortName")}</span>
            </Link>
            <p className="max-w-md text-sm leading-6 text-muted-foreground">
              {t("landingFooter.description")}
            </p>
          </div>

          <nav aria-label={t("landingFooter.navLabel")}>
            <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
              {t("landingFooter.exploreTitle")}
            </p>
            <div className="flex flex-wrap items-center gap-x-6 gap-y-3">
              {footerLinks.map(({ href, labelKey }) => (
                <Link
                  key={href}
                  href={href}
                  className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                >
                  {t(labelKey)}
                </Link>
              ))}
            </div>
          </nav>

          <div className="space-y-3">
            <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
              {t("landingFooter.preferencesTitle")}
            </p>
            <ToggleTheme variant="labeled" />
          </div>
        </div>

        <div className="mt-10 flex flex-col gap-3 border-t pt-6 text-sm text-muted-foreground md:flex-row md:items-center md:justify-between">
          <p>{t("landingFooter.copyright", { year: currentYear })}</p>

          <Link
            href="https://trev.fyi"
            className="inline-flex items-center gap-2 font-medium text-foreground underline-offset-4 transition-colors hover:text-primary hover:underline"
          >
            {t("landingFooter.builtBy")} <span>{t("authLayoutFooter.creatorHandle")}</span>
          </Link>
        </div>
      </div>
    </footer>
  );
}

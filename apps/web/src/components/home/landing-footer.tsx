"use client";

import Link from "next/link";

import { SaasRecipesIcon } from "@/components/common/icons/saas-recipes-icon";
import { ToggleTheme } from "@/components/theme-toggle";
import { useI18n } from "@/hooks/use-i18n";

type FooterLink = {
  href: string;
  labelKey: string;
};

type TranslationParams = Record<string, string | number>;
type TranslationFn = (key: string, params?: TranslationParams) => string;

const footerLinks: FooterLink[] = [
  { href: "#features", labelKey: "landingFooter.links.features" },
  { href: "/pricing", labelKey: "landingFooter.links.pricing" },
  { href: "#how-it-works", labelKey: "landingFooter.links.howItWorks" },
  { href: "/dashboard", labelKey: "landingFooter.links.dashboard" },
  { href: "/sign-in", labelKey: "landingFooter.links.signIn" },
];

function LandingFooterLinks({ t }: { t: TranslationFn }) {
  return (
    <nav
      aria-label={t("landingFooter.navLabel")}
      className="flex flex-wrap items-center gap-2.5"
    >
      {footerLinks.map(({ href, labelKey }) => (
        <Link
          key={href}
          href={href}
          className="inline-flex items-center rounded-md border border-border/60 bg-card px-3 py-1.5 text-sm font-medium text-muted-foreground shadow-xs transition-all hover:-translate-y-0.5 hover:border-border hover:bg-background hover:text-foreground"
        >
          {t(labelKey)}
        </Link>
      ))}
    </nav>
  );
}

function FooterEaseSignals({ t }: { t: TranslationFn }) {
  const signals = [
    "landingFooter.signals.security",
    "landingFooter.signals.noCard",
    "landingFooter.signals.instantAccess",
  ] as const;

  return (
    <ul
      className="flex flex-wrap items-center gap-x-4 gap-y-2 text-xs text-muted-foreground"
      role="list"
    >
      {signals.map((signal) => (
        <li key={signal} className="inline-flex items-center gap-2">
          <span
            className="h-1.5 w-1.5 rounded-full bg-foreground/45"
            aria-hidden
          />
          <span>{t(signal)}</span>
        </li>
      ))}
    </ul>
  );
}

/**
 * Render a marketing-focused landing footer with low-friction auth calls-to-action.
 *
 * @returns A footer section that promotes easy sign-up while preserving quick navigation.
 */
export function LandingFooter() {
  const { t } = useI18n();
  const currentYear = new Date().getFullYear();

  return (
    <footer
      className="relative overflow-hidden border-t bg-linear-to-b from-background via-background to-muted/25"
      role="contentinfo"
    >
      <div className="container relative mx-auto px-4 py-14">
        <div className="grid gap-10 lg:grid-cols-[1.35fr_1fr] lg:gap-14">
          <section className="space-y-7 lg:space-y-8">
            <div className="space-y-4">
              <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                {t("landingFooter.eyebrow")}
              </p>
              <h2 className="max-w-2xl text-2xl leading-tight font-semibold tracking-tight text-foreground sm:text-3xl">
                {t("landingFooter.heading")}
              </h2>
              <p className="max-w-2xl text-sm leading-6 text-muted-foreground">
                {t("landingFooter.description")}
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-3.5">
              <Link
                href="/sign-up"
                className="inline-flex items-center rounded-md bg-foreground px-4 py-2.5 text-sm font-semibold text-background transition-opacity hover:opacity-90"
              >
                {t("landingFooter.cta.signUp")}
              </Link>
              <Link
                href="/sign-in"
                className="inline-flex items-center rounded-md border border-border px-4 py-2.5 text-sm font-semibold text-foreground transition-colors hover:bg-muted"
              >
                {t("landingFooter.links.signIn")}
              </Link>
            </div>

            <FooterEaseSignals t={t} />
          </section>

          <section className="space-y-6 z-10">
            <div className="space-y-3">
              <p className="mb-4 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                {t("landingFooter.exploreTitle")}
              </p>
              <LandingFooterLinks t={t} />
            </div>
            <ToggleTheme variant="footer" className="w-fit" />
          </section>
        </div>

        <div className="mt-10 flex flex-col gap-3 pt-4 text-sm text-muted-foreground md:flex-row md:items-center md:justify-between">
          <p>{t("landingFooter.copyright", { year: currentYear })}</p>

          <Link
            href="https://trev.fyi"
            className="inline-flex items-center gap-1.5 font-medium text-foreground decoration-foreground/35 underline underline-offset-6 transition-[color,text-decoration-color] hover:text-primary hover:decoration-primary/70"
          >
            {t("landingFooter.builtBy")}{" "}
            <span>{t("authLayoutFooter.creatorHandle")}</span>
          </Link>
        </div>

        <SaasRecipesIcon
          aria-hidden
          width={560}
          height={560}
          className="top-[100px]! pointer-events-none absolute -bottom-5 right-4 z-0 h-auto w-60 rotate-19 opacity-30 text-foreground/8 dark:text-foreground/14 sm:-bottom-20 sm:right-6 sm:w-72 md:top-70 md:right-8 md:w-80 lg:-bottom-3 lg:right-10 lg:w-88"
        />
      </div>
    </footer>
  );
}

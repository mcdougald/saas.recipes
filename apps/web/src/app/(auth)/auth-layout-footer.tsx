"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useI18n } from "@/hooks/use-i18n";
import { ToggleTheme } from "@/components/theme-toggle";

type FooterLink = {
  href: string;
  labelKey: string;
  isExternal?: boolean;
};

const CREATOR_LINK: FooterLink = {
  href: "https://trev.fyi",
  labelKey: "authLayoutFooter.creatorHandle",
  isExternal: true,
};

const SUPPORT_LINK: FooterLink = {
  href: "mailto:mcdougald.job@gmail.com",
  labelKey: "authLayoutFooter.needHelp",
};

const AUTH_LINKS: FooterLink[] = [
  { href: "/sign-in", labelKey: "common.signIn" },
  { href: "/sign-up", labelKey: "common.createAccount" },
  { href: "/forgot-password", labelKey: "common.resetPassword" },
];

function normalizeRoute(route: string) {
  if (!route) return "/";
  const normalized = route.endsWith("/") ? route.slice(0, -1) : route;
  return normalized || "/";
}

export function AuthLayoutFooter() {
  const { t } = useI18n();
  const currentYear = new Date().getFullYear();
  const pathname = usePathname();
  const activePath = normalizeRoute(pathname);

  return (
    <footer className="shrink-0" role="contentinfo">
      <div className="grid w-full grid-cols-1 sm:grid-cols-2">
        <section className="order-2 min-w-0 bg-white text-black dark:bg-black dark:text-white sm:order-1">
          <div className="mx-auto flex h-full w-full max-w-2xl flex-col gap-4 px-4 py-5 sm:px-6">
            <div className="flex flex-col items-center justify-between gap-3 text-center sm:flex-row sm:text-left">
              <div>
                <p className="text-sm font-medium text-black/90 dark:text-white/90">
                  {t("authLayoutFooter.welcomeTitle")}
                </p>
                <p className="text-xs text-black/65 dark:text-white/65">
                  {t("authLayoutFooter.welcomeDescription")}
                </p>
              </div>
             
            </div>

            <div className="flex flex-wrap items-center justify-center gap-2 text-xs sm:justify-start">
              {AUTH_LINKS.map((link) => {
                const isActive = activePath === normalizeRoute(link.href);

                if (isActive) {
                  return (
                    <span
                      key={link.href}
                      aria-current="page"
                      aria-disabled="true"
                      className="cursor-not-allowed rounded-md border border-primary/45 bg-primary/10 px-3 py-1.5 font-semibold text-primary"
                    >
                      {t(link.labelKey)}
                    </span>
                  );
                }

                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    className="rounded-md border border-black/15 bg-black/5 px-3 py-1.5 font-medium text-black/70 transition-colors hover:border-black/30 hover:text-black dark:border-white/20 dark:bg-white/10 dark:text-white/75 dark:hover:border-white/35 dark:hover:text-white"
                  >
                    {t(link.labelKey)}
                  </Link>
                );
              })}
            </div>
          </div>
        </section>

        <section className="order-1 min-w-0 bg-black text-white dark:bg-white dark:text-black sm:order-2">
          <div className="mx-auto flex h-full w-full max-w-2xl flex-col px-4 py-5 sm:px-6">
            <div className="mb-4 inline-flex w-fit items-center gap-2 rounded-full border border-white/25 bg-white/8 p-1 pr-3 shadow-sm backdrop-blur-sm dark:border-black/20 dark:bg-black/5">
              <span className="pl-3 text-[11px] font-semibold uppercase tracking-wide text-white/70 dark:text-black/70">
                {t("theme.label")}
              </span>
              <ToggleTheme />
            </div>

            <div className="flex h-full items-center">
              <div className="flex flex-wrap items-center justify-center gap-x-3 gap-y-2 text-xs text-white/70 dark:text-black/70 sm:justify-start">
                <span>
                  {t("authLayoutFooter.copyrightBy", { year: currentYear })}
                  <Link
                    href={CREATOR_LINK.href}
                    target={CREATOR_LINK.isExternal ? "_blank" : undefined}
                    rel={CREATOR_LINK.isExternal ? "noopener noreferrer" : undefined}
                    className="font-medium text-white underline decoration-white/30 underline-offset-2 transition-colors hover:text-white hover:decoration-white dark:text-black dark:decoration-black/30 dark:hover:text-black dark:hover:decoration-black"
                  >
                    {t(CREATOR_LINK.labelKey)}
                  </Link>
                </span>

                <span className="hidden h-3 w-px bg-white/25 dark:bg-black/25 sm:inline-block" aria-hidden />

                <Link
                  href={SUPPORT_LINK.href}
                  className="font-medium text-white/85 underline decoration-white/25 underline-offset-2 transition-colors hover:text-white hover:decoration-white dark:text-black/85 dark:decoration-black/25 dark:hover:text-black dark:hover:decoration-black"
                >
                  {t(SUPPORT_LINK.labelKey)}
                </Link>
              </div>
            </div>
          </div>
        </section>
      </div>
    </footer>
  );
}

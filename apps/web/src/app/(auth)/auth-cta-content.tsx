"use client";

import { usePathname } from "next/navigation";
import { BookOpen, ChefHat, Shield, Mail, KeyRound, Clock3 } from "lucide-react";
import { useI18n } from "@/hooks/use-i18n";

type CtaItem = {
  icon: React.ComponentType<{ className?: string; "aria-hidden"?: boolean }>;
  titleKey: string;
  descriptionKey: string;
};

type CtaVariant = {
  headingKeys: [string, string];
  badgeKey: string;
  descriptionKey: string;
  items: CtaItem[];
  footerTitleKey: string;
  footerCopyKey: string;
};

const DEFAULT_CTA: CtaVariant = {
  headingKeys: ["authCta.default.heading.line1", "authCta.default.heading.line2"],
  badgeKey: "authCta.default.badge",
  descriptionKey: "authCta.default.description",
  items: [
    {
      icon: BookOpen,
      titleKey: "authCta.default.items.library.title",
      descriptionKey: "authCta.default.items.library.description",
    },
    {
      icon: ChefHat,
      titleKey: "authCta.default.items.guidance.title",
      descriptionKey: "authCta.default.items.guidance.description",
    },
    {
      icon: Shield,
      titleKey: "authCta.default.items.patterns.title",
      descriptionKey: "authCta.default.items.patterns.description",
    },
  ],
  footerTitleKey: "authCta.default.footer.title",
  footerCopyKey: "authCta.default.footer.copy",
};

const FORGOT_PASSWORD_CTA: CtaVariant = {
  headingKeys: ["authCta.forgot.heading.line1", "authCta.forgot.heading.line2"],
  badgeKey: "authCta.forgot.badge",
  descriptionKey: "authCta.forgot.description",
  items: [
    {
      icon: Mail,
      titleKey: "authCta.forgot.items.emailRecovery.title",
      descriptionKey: "authCta.forgot.items.emailRecovery.description",
    },
    {
      icon: Clock3,
      titleKey: "authCta.forgot.items.quickTurnaround.title",
      descriptionKey: "authCta.forgot.items.quickTurnaround.description",
    },
    {
      icon: Shield,
      titleKey: "authCta.forgot.items.saferReset.title",
      descriptionKey: "authCta.forgot.items.saferReset.description",
    },
  ],
  footerTitleKey: "authCta.forgot.footer.title",
  footerCopyKey: "authCta.forgot.footer.copy",
};

const RESET_PASSWORD_CTA: CtaVariant = {
  headingKeys: ["authCta.reset.heading.line1", "authCta.reset.heading.line2"],
  badgeKey: "authCta.reset.badge",
  descriptionKey: "authCta.reset.description",
  items: [
    {
      icon: KeyRound,
      titleKey: "authCta.reset.items.uniquePassword.title",
      descriptionKey: "authCta.reset.items.uniquePassword.description",
    },
    {
      icon: Shield,
      titleKey: "authCta.reset.items.protectLogins.title",
      descriptionKey: "authCta.reset.items.protectLogins.description",
    },
    {
      icon: Clock3,
      titleKey: "authCta.reset.items.continueQuickly.title",
      descriptionKey: "authCta.reset.items.continueQuickly.description",
    },
  ],
  footerTitleKey: "authCta.reset.footer.title",
  footerCopyKey: "authCta.reset.footer.copy",
};

function getVariant(pathname: string): CtaVariant {
  if (pathname.endsWith("/forgot-password")) {
    return FORGOT_PASSWORD_CTA;
  }

  if (pathname.endsWith("/reset-password")) {
    return RESET_PASSWORD_CTA;
  }

  return DEFAULT_CTA;
}

/** Render contextual marketing content for auth pages. */
export function AuthCtaContent() {
  const { t } = useI18n();
  const pathname = usePathname();
  const cta = getVariant(pathname);

  return (
    <div className="relative max-md:text-center">
      <div
        className="absolute -left-10 -top-10 h-44 w-44 rounded-full bg-primary/20 blur-3xl max-lg:left-1/2 max-lg:-translate-x-1/2"
        aria-hidden
      />
      <div
        className="absolute -right-8 -bottom-10 h-40 w-40 rounded-full bg-primary/10 blur-3xl max-lg:right-1/2 max-lg:translate-x-1/2"
        aria-hidden
      />

      <div className="relative z-10 flex flex-col">
        <h2 className="mt-4 text-2xl leading-tight font-bold tracking-normal text-black dark:text-white sm:text-3xl md:text-4xl lg:text-[2.6rem]">
          {t(cta.headingKeys[0])}
          <br />
          {t(cta.headingKeys[1])}
        </h2>

        <p className="mt-5 inline-flex w-fit items-center gap-2 rounded-full border border-black/15 bg-white px-3 py-1 text-xs font-medium tracking-wide text-black/80 dark:border-white/20 dark:bg-zinc-900 dark:text-white/80 max-md:mx-auto">
          <span className="h-1.5 w-1.5 rounded-full bg-black/70 dark:bg-white/70" aria-hidden />
          {t(cta.badgeKey)}
        </p>

        <p className="mt-4 text-base text-black/70 dark:text-white/70 sm:text-lg md:max-w-lg max-md:mx-auto">
          {t(cta.descriptionKey)}
        </p>

        <ul
          className="mt-7 grid max-w-xl gap-3 text-sm text-black/70 dark:text-white/70 max-md:mx-auto"
          role="list"
        >
          {cta.items.map((item) => {
            const Icon = item.icon;
            return (
              <li
                key={item.titleKey}
                className="flex max-w-[400px] items-start gap-3 rounded-xl border border-black/10 bg-white p-4 shadow-sm dark:border-white/15 dark:bg-neutral-900 max-md:text-left"
              >
                <span className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-zinc-100 text-black/75 dark:bg-zinc-800 dark:text-white/80">
                  <Icon className="h-4 w-4" aria-hidden />
                </span>
                <span>
                  <span className="font-medium text-black dark:text-white">{t(item.titleKey)}</span>
                  <br />
                  {t(item.descriptionKey)}
                </span>
              </li>
            );
          })}
        </ul>

        <div className="mt-7 w-fit max-w-[400px] rounded-xl border border-black/15 bg-[#f5f5f5ef] p-4 text-sm text-black/70 shadow-sm dark:border-white/10 dark:bg-neutral-950 dark:text-white/70 max-md:mx-auto">
          <p className="font-medium text-black dark:text-white">{t(cta.footerTitleKey)}</p>
          <p className="mt-1 max-w-[440px]">{t(cta.footerCopyKey)}</p>
        </div>
      </div>
    </div>
  );
}

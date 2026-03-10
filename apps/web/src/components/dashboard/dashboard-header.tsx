"use client";

import { Home, Settings } from "lucide-react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import * as React from "react";
import { toast } from "sonner";

import { LanguageSwitcher } from "@/components/language-switcher";
import { ProfileDropdown } from "@/components/profile-dropdown";
import { ThemeCustomizer } from "@/components/theme-customizer";
import { ToggleTheme } from "@/components/theme-toggle";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { useAuth } from "@/contexts/auth-context";
import { useI18n } from "@/hooks/use-i18n";

/**
 * Render the sticky global dashboard header with auth-aware actions.
 *
 * @returns The dashboard top bar with preferences and auth controls.
 */
export function DashboardHeader() {
  const { t } = useI18n();
  const { isAuthenticated, isLoading } = useAuth();
  const [themeCustomizerOpen, setThemeCustomizerOpen] = React.useState(false);
  const [mounted, setMounted] = React.useState(false);
  const searchParams = useSearchParams();
  const router = useRouter();
  const quickActionClassName =
    "size-9 rounded-full text-muted-foreground transition-colors hover:text-foreground";

  React.useEffect(() => {
    setMounted(true);
  }, []);

  React.useEffect(() => {
    if (!mounted) return;

    const authParam = searchParams.get("auth");
    if (authParam === "success") {
      toast.success(t("auth.signInSuccess"), {
        description: t("auth.welcomeBack"),
      });
      const url = new URL(window.location.href);
      url.searchParams.delete("auth");
      router.replace(url.pathname + url.search, { scroll: false });
    }
  }, [mounted, searchParams, router, t]);

  return (
    <header className="sticky top-0 z-50 flex h-16 shrink-0 items-center gap-2 border-b border-border/50 bg-background/80 px-4 backdrop-blur-xl lg:px-6">
      <SidebarTrigger className="-ml-1 text-muted-foreground transition-colors hover:text-foreground" />
      <Separator orientation="vertical" className="mx-1 h-6 bg-border/60" />
      <div className="ml-auto flex items-center gap-2.5">
        <div className="flex items-center gap-1 rounded-full border border-border/55 bg-muted/30 p-1">
          <Button
            variant="ghost"
            size="icon"
            asChild
            className={quickActionClassName}
          >
            <Link href="/" aria-label={t("header.goToHomepage")}>
              <Home className="h-[1.15rem] w-[1.15rem]" />
            </Link>
          </Button>
          <LanguageSwitcher className={quickActionClassName} />
          <ToggleTheme className={quickActionClassName} />
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setThemeCustomizerOpen(true)}
            className={quickActionClassName}
          >
            <Settings className="h-[1.15rem] w-[1.15rem]" />
            <span className="sr-only">{t("header.openThemeCustomizer")}</span>
          </Button>
        </div>
        {isLoading ? (
          <div className="h-9 w-28" aria-hidden />
        ) : (
          <>
            <Separator orientation="vertical" className="h-6 bg-border/60" />
            {isAuthenticated ? (
              <ProfileDropdown />
            ) : (
              <div className="flex items-center gap-2">
                <Button
                  asChild
                  variant="ghost"
                  size="sm"
                  className="rounded-full"
                >
                  <Link href="/sign-in">{t("common.signIn")}</Link>
                </Button>
                <Button asChild size="sm" className="rounded-full">
                  <Link href="/sign-up">{t("common.getStarted")}</Link>
                </Button>
              </div>
            )}
          </>
        )}
      </div>
      <ThemeCustomizer
        open={themeCustomizerOpen}
        onOpenChange={setThemeCustomizerOpen}
      />
    </header>
  );
}

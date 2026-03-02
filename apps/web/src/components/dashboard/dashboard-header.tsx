"use client";

import { CommandSearch, SearchTrigger } from "@/components/command-search";
import { LanguageSwitcher } from "@/components/language-switcher";
import { ProfileDropdown } from "@/components/profile-dropdown";
import { ThemeCustomizer } from "@/components/theme-customizer";
import { ToggleTheme } from "@/components/theme-toggle";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { useI18n } from "@/hooks/use-i18n";
import { Home, Settings } from "lucide-react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import * as React from "react";
import { toast } from "sonner";

/**
 * Render the sticky global dashboard header with primary actions.
 *
 * @returns The dashboard top bar with search, preferences, and profile controls.
 */
export function DashboardHeader() {
  const { t } = useI18n();
  const [themeCustomizerOpen, setThemeCustomizerOpen] = React.useState(false);
  const [commandSearchOpen, setCommandSearchOpen] = React.useState(false);
  const [mounted, setMounted] = React.useState(false);
  const searchParams = useSearchParams();
  const router = useRouter();

  React.useEffect(() => {
    setMounted(true);
  }, []);

  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setCommandSearchOpen((open) => !open);
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
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
      <Separator orientation="vertical" className="mx-1 h-6! bg-border/60" />
      <SearchTrigger onClick={() => setCommandSearchOpen(true)} />
      <CommandSearch
        open={commandSearchOpen}
        onOpenChange={setCommandSearchOpen}
      />
      <div className="ml-auto flex items-center gap-2">
        <div className="flex items-center gap-0.5 rounded-full p-1 ">
          <Button
            variant="ghost"
            size="icon"
            asChild
            className="rounded-full text-muted-foreground hover:text-foreground"
          >
            <Link href="/" aria-label={t("header.goToHomepage")}>
              <Home className="h-[1.15rem] w-[1.15rem]" />
            </Link>
          </Button>
          <LanguageSwitcher />
          <ToggleTheme />
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setThemeCustomizerOpen(true)}
            className="rounded-full text-muted-foreground hover:text-foreground"
          >
            <Settings className="h-[1.15rem] w-[1.15rem]" />
            <span className="sr-only">{t("header.openThemeCustomizer")}</span>
          </Button>
        </div>
        <Separator orientation="vertical" className="h-6! bg-border/60" />
        <ProfileDropdown />
      </div>
      <ThemeCustomizer
        open={themeCustomizerOpen}
        onOpenChange={setThemeCustomizerOpen}
      />
    </header>
  );
}

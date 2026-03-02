"use client";

import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { useI18n } from "@/hooks/use-i18n";
import { Menu } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";

const SECTION_IDS = ["features", "how-it-works", "testimonials"] as const;
const ACTIVE_ZONE_TOP = 120; // px from top of viewport; section containing this is "active"

function getActiveSection(): (typeof SECTION_IDS)[number] | null {
  if (typeof document === "undefined") return null;
  for (const id of SECTION_IDS) {
    const el = document.getElementById(id);
    if (!el) continue;
    const rect = el.getBoundingClientRect();
    if (rect.top <= ACTIVE_ZONE_TOP && rect.bottom > ACTIVE_ZONE_TOP) {
      return id;
    }
  }
  return null;
}

export function LandingHeader() {
  const { t } = useI18n();
  const [open, setOpen] = useState(false);
  const [activeSection, setActiveSection] = useState<
    (typeof SECTION_IDS)[number] | null
  >(null);
  const navLinks = [
    {
      href: "#features",
      label: t("landingHeader.nav.features"),
      sectionId: "features" as const,
    },
    { href: "/pricing", label: t("landingHeader.nav.pricing"), sectionId: null },
    {
      href: "#how-it-works",
      label: t("landingHeader.nav.howItWorks"),
      sectionId: "how-it-works" as const,
    },
    {
      href: "#testimonials",
      label: t("landingHeader.nav.testimonials"),
      sectionId: "testimonials" as const,
    },
  ];

  const rafIdRef = useRef<number | null>(null);
  useEffect(() => {
    const onScroll = () => {
      if (rafIdRef.current !== null) return;
      rafIdRef.current = requestAnimationFrame(() => {
        rafIdRef.current = null;
        setActiveSection(getActiveSection());
      });
    };

    const initialRaf = requestAnimationFrame(() => {
      setActiveSection(getActiveSection());
    });
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      cancelAnimationFrame(initialRaf);
      if (rafIdRef.current !== null) cancelAnimationFrame(rafIdRef.current);
    };
  }, []);

  return (
    <header className="sticky top-0 z-50 border-b bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/80">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <Link
          href="/"
          className="flex items-center gap-2 font-semibold text-xl tracking-tight"
        >
          <Image
            src="/SaasRecipesIcon.svg"
            alt={t("brand.logoAlt")}
            width={28}
            height={35}
            className="h-6 w-auto"
          />
          <span className="hidden lg:block">{t("brand.shortName")}</span>
        </Link>

        <nav className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => {
            const isActive =
              link.sectionId !== null && link.sectionId === activeSection;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`text-sm font-medium transition-colors ${
                  isActive
                    ? "text-foreground font-semibold"
                    : "text-muted-foreground hover:text-foreground"
                }`}
                aria-current={isActive ? "true" : undefined}
              >
                {link.label}
              </Link>
            );
          })}
          <div className="flex items-center gap-3">
            <Link href="/sign-in">
              <Button
                variant="ghost"
                size="sm"
                className="cursor-pointer transition-all duration-200 hover:-translate-y-0.5 hover:shadow-sm active:translate-y-0"
              >
                {t("common.signIn")}
              </Button>
            </Link>
            <Link href="/sign-up">
              <Button
                size="sm"
                className="group cursor-pointer transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md active:translate-y-0"
              >
                {t("common.getStarted")}
                <span
                  className="ml-1.5 transition-transform duration-200 group-hover:translate-x-0.5"
                  aria-hidden
                >
                  →
                </span>
              </Button>
            </Link>
          </div>
        </nav>

        <Sheet open={open} onOpenChange={setOpen}>
          <SheetTrigger asChild className="md:hidden">
            <Button variant="ghost" size="icon" aria-label={t("landingHeader.openMenu")}>
              <Menu className="h-5 w-5" />
            </Button>
          </SheetTrigger>
          <SheetContent
            side="right"
            className="w-[280px] overflow-y-auto px-6 pb-8 pt-12"
          >
            <SheetHeader>
              <SheetTitle className="sr-only">{t("landingHeader.menuTitle")}</SheetTitle>
            </SheetHeader>
            <nav className="mt-[-20] flex flex-col gap-6">
              {navLinks.map((link) => {
                const isActive =
                  link.sectionId !== null && link.sectionId === activeSection;
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => setOpen(false)}
                    className={`rounded-md px-3 py-2 text-base font-medium transition-colors ${
                      isActive
                        ? "bg-primary/10 text-primary font-semibold"
                        : "text-foreground hover:bg-muted hover:text-primary"
                    }`}
                    aria-current={isActive ? "true" : undefined}
                  >
                    {link.label}
                  </Link>
                );
              })}
              <div className="flex flex-col gap-3 border-t pt-6">
                <Link href="/sign-in" onClick={() => setOpen(false)}>
                  <Button
                    variant="outline"
                    className="w-full cursor-pointer transition-all duration-200 hover:-translate-y-0.5 hover:shadow-sm active:translate-y-0"
                  >
                    {t("common.signIn")}
                  </Button>
                </Link>
                <Link href="/sign-up" onClick={() => setOpen(false)}>
                  <Button className="group w-full cursor-pointer transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md active:translate-y-0">
                    {t("common.getStarted")}
                    <span
                      className="ml-1.5 transition-transform duration-200 group-hover:translate-x-0.5"
                      aria-hidden
                    >
                      →
                    </span>
                  </Button>
                </Link>
              </div>
            </nav>
          </SheetContent>
        </Sheet>
      </div>
    </header>
  );
}

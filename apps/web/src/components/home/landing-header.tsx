"use client";

import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Menu } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";

const SECTION_IDS = ["features", "how-it-works", "testimonials"] as const;
const ACTIVE_ZONE_TOP = 120; // px from top of viewport; section containing this is "active"

const navLinks = [
  { href: "#features", label: "Features", sectionId: "features" as const },
  { href: "/pricing", label: "Pricing", sectionId: null },
  {
    href: "#how-it-works",
    label: "How it works",
    sectionId: "how-it-works" as const,
  },
  {
    href: "#testimonials",
    label: "Testimonials",
    sectionId: "testimonials" as const,
  },
];

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
  const [open, setOpen] = useState(false);
  const [activeSection, setActiveSection] = useState<
    (typeof SECTION_IDS)[number] | null
  >(null);

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
            alt="SaaS Recipes"
            width={28}
            height={35}
            className="h-6 w-auto"
          />
          <span>Recipes</span>
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
              <Button variant="ghost" size="sm">
                Sign in
              </Button>
            </Link>
            <Link href="/sign-up">
              <Button size="sm">
                Get started
                <span className="ml-1.5" aria-hidden>
                  →
                </span>
              </Button>
            </Link>
          </div>
        </nav>

        <Sheet open={open} onOpenChange={setOpen}>
          <SheetTrigger asChild className="md:hidden">
            <Button variant="ghost" size="icon" aria-label="Open menu">
              <Menu className="h-5 w-5" />
            </Button>
          </SheetTrigger>
          <SheetContent side="right" className="w-[280px]">
            <SheetHeader>
              <SheetTitle className="sr-only">Menu</SheetTitle>
            </SheetHeader>
            <nav className="flex flex-col gap-4 pt-8">
              {navLinks.map((link) => {
                const isActive =
                  link.sectionId !== null && link.sectionId === activeSection;
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => setOpen(false)}
                    className={`text-base font-medium transition-colors ${
                      isActive
                        ? "text-primary font-semibold"
                        : "text-foreground hover:text-primary"
                    }`}
                    aria-current={isActive ? "true" : undefined}
                  >
                    {link.label}
                  </Link>
                );
              })}
              <div className="flex flex-col gap-2 pt-4 border-t">
                <Link href="/sign-in" onClick={() => setOpen(false)}>
                  <Button variant="outline" className="w-full">
                    Sign in
                  </Button>
                </Link>
                <Link href="/sign-up" onClick={() => setOpen(false)}>
                  <Button className="w-full">Get started</Button>
                </Link>
              </div>
            </nav>
          </SheetContent>
        </Sheet>
      </div>
    </header>
  );
}

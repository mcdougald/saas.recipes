import Image from "next/image";
import Link from "next/link";

import { ToggleTheme } from "@/components/theme-toggle";

const footerLinks = [
  { href: "#features", label: "Features" },
  { href: "/pricing", label: "Pricing" },
  { href: "#how-it-works", label: "How it works" },
  { href: "/sign-in", label: "Sign in" },
  { href: "/dashboard", label: "Dashboard" },
];

export function LandingFooter() {
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
                alt="SaaS Recipes"
                width={28}
                height={35}
                className="h-6 w-auto"
              />
              <span>Recipes</span>
            </Link>
            <p className="max-w-md text-sm leading-6 text-muted-foreground">
              Discover battle-tested open source SaaS projects, compare their
              stacks, and ship faster with implementation patterns you can trust.
            </p>
          </div>

          <nav aria-label="Footer navigation">
            <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
              Explore
            </p>
            <div className="flex flex-wrap items-center gap-x-6 gap-y-3">
              {footerLinks.map(({ href, label }) => (
                <Link
                  key={href}
                  href={href}
                  className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                >
                  {label}
                </Link>
              ))}
            </div>
          </nav>

          <div className="space-y-3">
            <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
              Preferences
            </p>
            <div className="inline-flex items-center gap-3 rounded-lg border bg-background p-2 pr-3">
              <ToggleTheme />
              <span className="text-sm text-muted-foreground">Theme</span>
            </div>
          </div>
        </div>

        <div className="mt-10 flex flex-col gap-3 border-t pt-6 text-sm text-muted-foreground md:flex-row md:items-center md:justify-between">
          <p>{currentYear} SaaS Recipes. Crafted for builders.</p>

          <Link
            href="https://trev.fyi"
            className="inline-flex items-center gap-2 font-medium text-foreground underline-offset-4 transition-colors hover:text-primary hover:underline"
          >
            Built by <span>@trev.fyi</span>
          </Link>
        </div>
      </div>
    </footer>
  );
}

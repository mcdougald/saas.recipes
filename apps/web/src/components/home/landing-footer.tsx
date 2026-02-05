import { BarChart3 } from "lucide-react";
import Link from "next/link";

const footerLinks = [
  { href: "#features", label: "Features" },
  { href: "/pricing", label: "Pricing" },
  { href: "#how-it-works", label: "How it works" },
  { href: "/sign-in", label: "Sign in" },
  { href: "/dashboard", label: "Dashboard" },
];

export function LandingFooter() {
  return (
    <footer className="border-t bg-muted/30" role="contentinfo">
      <div className="container px-4 py-10">
        <div className="flex flex-col items-center gap-6 md:flex-row md:justify-between">
          <Link
            href="/"
            className="flex items-center gap-2 font-semibold text-foreground"
          >
            <BarChart3 className="h-5 w-5 text-primary" aria-hidden />
            <span>SaaS Recipes</span>
          </Link>
          <nav
            className="flex flex-wrap items-center justify-center gap-6"
            aria-label="Footer navigation"
          >
            {footerLinks.map(({ href, label }) => (
              <Link
                key={href}
                href={href}
                className="text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                {label}
              </Link>
            ))}
          </nav>
        </div>
        <p className="mt-8 flex gap-1 text-center text-sm text-muted-foreground md:text-left">
          Built by <Link
            href="https://trev.fyi"
            className="flex items-center gap-2 font-semibold text-foreground underline"
          >
            <span>@trev.fyi</span>
          </Link>
        </p>
      </div>
    </footer>
  );
}

import Image from "next/image";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export function AuthLayoutHeader() {
  return (
    <header className="shrink-0 border-b border-border/40 bg-background/90 backdrop-blur-md">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4 sm:px-6">
        <Link
          href="/"
          className="flex items-center gap-2 rounded-lg py-1 pl-1 pr-2 text-xl font-semibold tracking-tight transition-colors hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          aria-label="Go to SaaS Recipes home"
        >
          <Image
            src="/SaasRecipesIcon.svg"
            alt="SaaS Recipes"
            width={28}
            height={35}
            className="h-6 w-auto"
            priority
          />
          <span>Recipes</span>
        </Link>

        <Link
          href="/"
          className="group inline-flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-muted-foreground transition-all duration-200 hover:bg-muted/60 hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        >
          <ArrowLeft
            className="h-4 w-4 transition-transform duration-200 group-hover:-translate-x-0.5"
            aria-hidden
          />
          <span>Back to home</span>
        </Link>
      </div>
    </header>
  );
}

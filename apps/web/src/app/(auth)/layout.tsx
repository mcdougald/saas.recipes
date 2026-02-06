import type { Metadata } from "next";
import Link from "next/link";
import { BarChart3, BookOpen, Zap, Shield, ChefHat } from "lucide-react";

export const metadata: Metadata = {
  title: { template: "%s | SaaS Recipes", default: "Auth | SaaS Recipes" },
  description: "Sign in, sign up, or reset your password.",
};

function AuthCtaContent() {
  return (
    <div className="relative max-md:text-center max-md:items-center">
      {/* Decorative gradient blob */}
      <div
        className="absolute -left-8 -top-8 h-40 w-40 rounded-full bg-primary/20 blur-3xl max-lg:left-1/2 max-lg:-translate-x-1/2"
        aria-hidden
      />
      <div className="relative flex flex-col">
        <h2 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl md:text-4xl lg:text-[2.5rem]">
          Cookbook &amp; AI built from{" "}
          <span className="bg-linear-to-r from-primary to-primary/70 bg-clip-text text-transparent">
            Open-Source
          </span>{" "}
          code.
        </h2>
        <p className="mt-4 text-base text-muted-foreground sm:text-lg md:max-w-md max-md:mx-auto">
          Latest tooling and proven best-practices from inspirations track. Your
          code and stack, aligned with what works.
        </p>
        <ul
          className="mt-6 flex max-w-sm flex-col gap-2.5 text-sm text-muted-foreground max-md:mx-auto max-md:items-center"
          role="list"
        >
          <li className="flex items-center gap-3 max-md:justify-center">
            <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
              <BookOpen className="h-4 w-4" aria-hidden />
            </span>
            <span>Profitable &quot;kitchens&quot; and &quot;secret ingredients&quot;.</span>
          </li>
          <li className="flex items-center gap-3 max-md:justify-center">
            <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
              <ChefHat className="h-4 w-4" aria-hidden />
            </span>
            <span>AI chef suggested from the recipe set.</span>
          </li>
          <li className="flex items-center gap-3 max-md:justify-center">
            <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
              <Shield className="h-4 w-4" aria-hidden />
            </span>
            <span>Structure and security proven at scale.</span>
          </li>
        </ul>
        <p className="mt-6 w-fit rounded-lg border border-border/50 bg-muted/30 px-4 py-3 text-sm text-muted-foreground max-md:mx-auto max-md:max-w-sm">
          Free to start. Immediately improve your signature dish.
        </p>
      </div>
    </div>
  );
}

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-svh flex flex-col bg-linear-to-b from-background via-background to-muted/30">
      <header className="shrink-0 border-b border-border/40 bg-background/90 backdrop-blur-md">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-4 sm:px-6">
          <Link
            href="/"
            className="group flex items-center gap-2.5 rounded-lg py-1 pr-2 transition-colors hover:bg-muted/50 -m-1 pl-1"
          >
            <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10 text-primary transition-colors group-hover:bg-primary/15">
              <BarChart3 className="h-5 w-5" aria-hidden />
            </span>
            <span className="font-semibold tracking-tight text-foreground group-hover:text-primary">
              SaaS Recipes
            </span>
          </Link>
          <Link
            href="/"
            className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
          >
            ← Back to home
          </Link>
        </div>
      </header>
      <main className="flex flex-1 flex-col items-center p-4 pt-6 md:p-6 md:pt-8 lg:p-8 lg:pt-10">
        <div className="grid w-full max-w-5xl flex-1 grid-cols-1 items-start gap-8 overflow-x-auto pt-0 sm:overflow-visible sm:grid-cols-[minmax(340px,1fr)_minmax(320px,400px)] lg:gap-12 lg:pt-4">
          <div className="order-2 min-w-0 sm:order-1">
            <AuthCtaContent />
          </div>
          <div className="order-1 flex w-full justify-center sm:order-2 sm:min-w-0 sm:justify-end">
            {children}
          </div>
        </div>
      </main>
      <footer
        className="shrink-0 border-t border-border/40 bg-background/60 py-5"
        role="contentinfo"
      >
        <div className="flex flex-col items-center justify-center gap-3 text-center">
          <p className="text-sm text-muted-foreground">
            Thanks for being here — I&apos;m glad you&apos;re cooking in the community.
          </p>
          <p className="text-xs text-muted-foreground">
            Created by{" "}
            <a
              href="https://trev.fyi"
              target="_blank"
              rel="noopener noreferrer"
              className="font-medium text-foreground/90 underline decoration-primary/50 underline-offset-2 transition-colors hover:text-primary hover:decoration-primary"
            >
              trev.fyi
            </a>
          </p>
        </div>
      </footer>
    </div>
  );
}

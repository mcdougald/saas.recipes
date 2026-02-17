import Link from "next/link";

type FooterLink = {
  href: string;
  label: string;
  isExternal?: boolean;
};

const CREATOR_LINK: FooterLink = {
  href: "https://trev.fyi",
  label: "@trev.fyi",
  isExternal: true,
};

const SUPPORT_LINK: FooterLink = {
  href: "mailto:mcdougald.job@gmail.com",
  label: "Need help?",
};

export function AuthLayoutFooter() {
  return (
    <footer
      className="shrink-0 border-t border-border/50 bg-background/80 backdrop-blur supports-backdrop-filter:bg-background/65"
      role="contentinfo"
    >
      <div className="mx-auto flex w-full max-w-5xl flex-col items-center gap-3 px-4 py-5 text-center sm:px-6">
        <p className="text-sm text-muted-foreground">
          Welcome back to the kitchen. Sign in to start exploring free recipe
          insights and build your next SaaS idea.
        </p>

        <div className="flex flex-wrap items-center justify-center gap-x-3 gap-y-2 text-xs text-muted-foreground">
          <span>
            Created by{" "}
            <Link
              href={CREATOR_LINK.href}
              target={CREATOR_LINK.isExternal ? "_blank" : undefined}
              rel={CREATOR_LINK.isExternal ? "noopener noreferrer" : undefined}
              className="font-medium text-foreground/90 underline decoration-primary/50 underline-offset-2 transition-colors hover:text-primary hover:decoration-primary"
            >
              {CREATOR_LINK.label}
            </Link>
          </span>

          <span className="hidden h-3 w-px bg-border/70 sm:inline-block" aria-hidden />

          <Link
            href={SUPPORT_LINK.href}
            className="font-medium text-foreground/80 underline decoration-border underline-offset-2 transition-colors hover:text-primary hover:decoration-primary"
          >
            {SUPPORT_LINK.label}
          </Link>
        </div>
      </div>
    </footer>
  );
}

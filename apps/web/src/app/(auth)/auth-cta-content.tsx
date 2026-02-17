"use client";

import { usePathname } from "next/navigation";
import { BookOpen, ChefHat, Shield, Mail, KeyRound, Clock3 } from "lucide-react";

type CtaItem = {
  icon: React.ComponentType<{ className?: string; "aria-hidden"?: boolean }>;
  title: string;
  description: string;
};

type CtaVariant = {
  heading: [string, string];
  badge: string;
  description: string;
  items: CtaItem[];
  footerTitle: string;
  footerCopy: string;
};

const DEFAULT_CTA: CtaVariant = {
  heading: ["Stop guessing.", "Build from what already works."],
  badge: "Built from real shipped SaaS codebases",
  description:
    "Discover proven stacks, architecture choices, and implementation patterns from production open-source products so you can ship faster with less risk.",
  items: [
    {
      icon: BookOpen,
      title: "Curated library of recipes",
      description: "Learn from high-signal codebases, not random tutorials.",
    },
    {
      icon: ChefHat,
      title: "AI chef guidance",
      description: "Get practical suggestions tailored to your stack and goals.",
    },
    {
      icon: Shield,
      title: "Production-minded patterns",
      description: "Use structures and security practices tested in real apps.",
    },
  ],
  footerTitle: "Join free and start with your next idea in minutes.",
  footerCopy:
    "No credit card required. Save recipes, compare stacks, and come back to your research anytime.",
};

const FORGOT_PASSWORD_CTA: CtaVariant = {
  heading: ["You're almost back in.", "We'll help you recover quickly."],
  badge: "Fast, secure account recovery",
  description:
    "Share the email tied to your account and we'll send a password reset link. For security, we only send instructions to verified inboxes.",
  items: [
    {
      icon: Mail,
      title: "Email-based recovery",
      description: "Reset links are sent to the account email to protect access.",
    },
    {
      icon: Clock3,
      title: "Quick turnaround",
      description: "Most links arrive within a minute. Check spam if needed.",
    },
    {
      icon: Shield,
      title: "Safer reset flow",
      description: "Recovery requests never reveal whether an email exists.",
    },
  ],
  footerTitle: "Still blocked? You can always request another reset link.",
  footerCopy:
    "Use your most recent email and keep this tab open while you check your inbox.",
};

const RESET_PASSWORD_CTA: CtaVariant = {
  heading: ["Create a strong password.", "Finish securing your account."],
  badge: "Final step: update credentials",
  description:
    "You're one step away from getting back in. Choose a unique password you don't use elsewhere to keep your account protected.",
  items: [
    {
      icon: KeyRound,
      title: "Use a unique password",
      description: "Combine length, symbols, and uniqueness for stronger security.",
    },
    {
      icon: Shield,
      title: "Protect future logins",
      description: "A fresh password helps lock out stale or leaked credentials.",
    },
    {
      icon: Clock3,
      title: "Continue in seconds",
      description: "Once updated, you'll be redirected and ready to sign in.",
    },
  ],
  footerTitle: "Tip: save your password in a trusted password manager.",
  footerCopy:
    "That makes future sign-ins faster and significantly reduces lockout risk.",
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

export function AuthCtaContent() {
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

      <div className="relative flex flex-col">
        <h2 className="mt-4 text-2xl font-bold tracking-normal text-foreground sm:text-3xl md:text-4xl lg:text-[2.6rem]">
          {cta.heading[0]}
          <br />
          {cta.heading[1]}
        </h2>

        <p className="mt-5 inline-flex w-fit items-center gap-2 rounded-full border border-primary/20 bg-primary/4 px-3 py-1 text-xs font-medium tracking-wide text-primary/90 max-md:mx-auto">
          <span className="h-1.5 w-1.5 rounded-full bg-primary/80" aria-hidden />
          {cta.badge}
        </p>

        <p className="mt-4 text-base text-muted-foreground sm:text-lg md:max-w-lg max-md:mx-auto">
          {cta.description}
        </p>

        <ul
          className="mt-7 flex flex-wrap max-w-xl gap-3 text-sm text-muted-foreground max-md:mx-auto"
          role="list"
        >
          {cta.items.map((item) => {
            const Icon = item.icon;
            return (
              <li
                key={item.title}
                className="flex max-w-4/5 items-start gap-3 rounded-xl border border-border/50 bg-background/60 p-3.5 backdrop-blur-xs max-md:text-left"
              >
                <span className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                  <Icon className="h-4 w-4" aria-hidden />
                </span>
                <span>
                  <span className="font-medium text-foreground">{item.title}</span>
                  <br />
                  {item.description}
                </span>
              </li>
            );
          })}
        </ul>

        <div className="mt-7 w-fit max-w-xl rounded-xl border border-border/60 bg-muted/30 p-4 text-sm text-muted-foreground max-md:mx-auto">
          <p className="font-medium text-foreground">{cta.footerTitle}</p>
          <p className="mt-1 max-w-[440px]">{cta.footerCopy}</p>
        </div>
      </div>
    </div>
  );
}

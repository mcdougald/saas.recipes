"use client";

import {
  ArrowRight,
  CheckCircle2,
  Clock3,
  Github,
  ShieldCheck,
  Sparkles,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import posthog from "posthog-js";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useI18n } from "@/hooks/use-i18n";
import { signIn, signUp } from "@/lib/auth-client";

/** Render the sign-up card and registration actions. */
export default function SignUpPage() {
  const { t } = useI18n();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSocialLoading, setIsSocialLoading] = useState(false);
  const router = useRouter();
  const isBusy = isLoading || isSocialLoading;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      const result = await signUp.email({
        name,
        email,
        password,
      });

      if (result.error) {
        setError(result.error.message || t("auth.signUp.errors.createAccount"));
      } else {
        // Identify user and capture sign-up event on successful registration
        if (result.data?.user) {
          posthog.identify(result.data.user.id, {
            email: result.data.user.email,
            name: result.data.user.name,
          });

          posthog.capture("user_signed_up", {
            method: "email",
            email: result.data.user.email,
          });
        }

        router.push("/dashboard");
      }
    } catch (err) {
      console.error("Sign-up error:", err);
      posthog.captureException(err);
      setError(t("auth.signUp.errors.generic"));
    } finally {
      setIsLoading(false);
    }
  };

  const handleGithubSignIn = async () => {
    setError("");
    setIsSocialLoading(true);

    try {
      await signIn.social({
        provider: "github",
        callbackURL: "/dashboard?auth=success",
      });
    } catch (err) {
      console.error("GitHub sign-in error:", err);
      posthog.captureException(err);
      setError(t("auth.signUp.errors.github"));
      setIsSocialLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-md overflow-hidden border-border/60 bg-background/95 shadow-xl shadow-black/10 backdrop-blur-sm">
      <CardHeader className="space-y-3 pb-2 text-center">
        <p className="mx-auto inline-flex w-fit items-center gap-1.5 rounded-full border border-primary/20 bg-primary/3 px-3 py-1 text-xs font-medium text-primary">
          <Sparkles className="h-3.5 w-3.5" aria-hidden />
          {t("auth.signUp.badge")}
        </p>
        <CardTitle className="text-3xl font-semibold tracking-tight">
          {t("auth.signUp.title")}
        </CardTitle>
        <CardDescription className="mx-auto max-w-sm text-muted-foreground">
          {t("auth.signUp.description")}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-5">
        <div className="group relative mx-auto w-full max-w-88 overflow-hidden rounded-xl p-px transition-all duration-300 hover:-translate-y-0.5">
          <span
            aria-hidden
            className="pointer-events-none absolute -inset-[120%] animate-[spin_3.2s_linear_infinite] bg-[conic-gradient(from_90deg,#ffffff00_0%,#ffffff_20%,#ffffff00_34%,#ffffff00_100%)] opacity-80"
          />
          <Button
            type="button"
            className="relative z-10 h-12 w-full cursor-pointer overflow-hidden rounded-[11px] border border-white/20 bg-linear-to-r from-zinc-950 via-black to-zinc-900 px-4 text-white shadow-sm transition-all hover:shadow-lg hover:shadow-white/10"
            onClick={handleGithubSignIn}
            disabled={isBusy}
          >
            <span className="absolute inset-0 bg-linear-to-r from-white/0 via-white/10 to-white/0 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
            <span className="relative mr-3 flex h-8 w-8 items-center justify-center rounded-full border border-white/20 bg-white/10">
              <Github className="h-4 w-4" aria-hidden />
            </span>
            <span className="text-sm font-semibold">
              {isSocialLoading
                ? t("auth.signUp.github.connecting")
                : t("auth.signUp.github.cta")}
            </span>
            {!isSocialLoading ? (
              <ArrowRight
                className="ml-auto h-4 w-4 opacity-80 transition-transform duration-300 group-hover:translate-x-0.5"
                aria-hidden
              />
            ) : null}
          </Button>
        </div>
        <p className="text-center text-xs text-muted-foreground">
          {t("auth.signUp.github.helper")}
        </p>
        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <span className="w-full border-t" />
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-background px-2 text-muted-foreground">
              {t("auth.signUp.divider")}
            </span>
          </div>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <label htmlFor="name" className="text-sm font-medium">
              {t("auth.signUp.fields.name.label")}
            </label>
            <Input
              id="name"
              type="text"
              placeholder={t("auth.signUp.fields.name.placeholder")}
              value={name}
              onChange={(e) => setName(e.target.value)}
              autoComplete="name"
              required
              disabled={isBusy}
              className="h-10 border-border/70 bg-white text-foreground placeholder:text-muted-foreground dark:border-white/20 dark:bg-black"
            />
          </div>
          <div className="space-y-2">
            <label htmlFor="email" className="text-sm font-medium">
              {t("auth.signUp.fields.email.label")}
            </label>
            <Input
              id="email"
              type="email"
              placeholder={t("auth.signUp.fields.email.placeholder")}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              autoComplete="email"
              required
              disabled={isBusy}
              className="h-10 border-border/70 bg-white text-foreground placeholder:text-muted-foreground dark:border-white/20 dark:bg-black"
            />
          </div>
          <div className="space-y-2">
            <label htmlFor="password" className="text-sm font-medium">
              {t("auth.signUp.fields.password.label")}
            </label>
            <Input
              id="password"
              type="password"
              placeholder={t("auth.signUp.fields.password.placeholder")}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={8}
              autoComplete="new-password"
              disabled={isBusy}
              className="h-10 border-border/70 bg-white text-foreground placeholder:text-muted-foreground dark:border-white/20 dark:bg-black"
            />
            <p className="text-xs text-muted-foreground">
              {t("auth.signUp.passwordHint")}
            </p>
          </div>
          {error ? (
            <div
              className="rounded-md border border-destructive/30 bg-destructive/10 px-3 py-2 text-sm text-destructive"
              role="alert"
              aria-live="polite"
            >
              {error}
            </div>
          ) : null}
          <Button
            type="submit"
            className="w-full h-10 font-medium"
            disabled={isBusy}
          >
            {isLoading
              ? t("auth.signUp.submit.loading")
              : t("auth.signUp.submit.default")}
          </Button>
        </form>
        <ul className="space-y-2 mt-3 rounded-lg border border-border/60 bg-muted/20 p-3 text-xs text-muted-foreground">
          <li className="flex items-start gap-2">
            <CheckCircle2
              className="mt-0.5 h-3.5 w-3.5 shrink-0 text-primary"
              aria-hidden
            />
            {t("auth.signUp.benefits.recipes")}
          </li>
          <li className="flex items-start gap-2">
            <Clock3
              className="mb-0.5 h-3.5 w-3.5 shrink-0 text-primary"
              aria-hidden
            />
            {t("auth.signUp.benefits.setup")}
          </li>
          <li className="flex items-start gap-2">
            <ShieldCheck
              className="mb-0.5 h-3.5 w-3.5 shrink-0 text-primary"
              aria-hidden
            />
            {t("auth.signUp.benefits.free")}
          </li>
        </ul>

        <p className="text-center text-sm text-muted-foreground">
          {t("auth.signUp.alreadyHaveAccount")}{" "}
          <Link
            href="/sign-in"
            className="font-medium text-primary hover:underline"
          >
            {t("common.signIn")}
          </Link>
        </p>
      </CardContent>
    </Card>
  );
}

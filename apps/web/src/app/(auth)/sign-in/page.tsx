"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Github, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { signIn } from "@/lib/auth-client";
import { useI18n } from "@/hooks/use-i18n";

export default function SignInPage() {
  const { t } = useI18n();
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
      const result = await signIn.email({
        email,
        password,
      });

      if (result.error) {
        setError(result.error.message || t("auth.signIn.errors.invalidCredentials"));
      } else {
        router.push("/dashboard");
      }
    } catch (err) {
      console.error("Sign-in error:", err);
      setError(t("auth.signIn.errors.generic"));
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
      setError(t("auth.signIn.errors.github"));
      setIsSocialLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-md overflow-hidden border-border/60 bg-background/95 shadow-xl shadow-black/10 backdrop-blur-sm">
      <CardHeader className="space-y-3 pb-2 text-center">
        <div className="mx-auto inline-flex items-center gap-1.5 rounded-full border border-primary/25 bg-primary/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-wide text-primary">
          <Sparkles className="h-3.5 w-3.5" aria-hidden />
          {t("auth.signIn.badge")}
        </div>
        <CardTitle className="text-3xl font-semibold tracking-tight">
          {t("auth.signIn.title")}
        </CardTitle>
        <CardDescription className="mx-auto max-w-sm text-muted-foreground">
          <Image
            src="/images/CookCodingOnFire.svg"
            alt={t("auth.signIn.illustrationAlt")}
            width={220}
            height={165}
            className="mx-auto mt-2 h-auto w-44"
          />
          <p className="mt-2 text-muted-foreground">
            {t("auth.signIn.description")}
          </p>
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-5">
        <div className="group relative w-full overflow-hidden rounded-md p-px transition-all duration-300 hover:-translate-y-0.5">
          <span
            aria-hidden
            className="pointer-events-none absolute -inset-[140%] animate-[spin_2.8s_linear_infinite] bg-[conic-gradient(from_90deg,#ffffff00_0%,#ffffff_12%,#ffffff00_24%,#ffffff00_100%)] opacity-90"
          />
          <Button
            type="button"
            className="relative z-10 h-11 w-full cursor-pointer overflow-hidden rounded-[calc(var(--radius)-1px)] border border-white/20 bg-black font-medium text-white shadow-sm transition-all hover:bg-zinc-900 hover:shadow-lg hover:shadow-white/10"
            onClick={handleGithubSignIn}
            disabled={isBusy}
          >
            <span className="absolute inset-0 bg-linear-to-r from-white/0 via-white/10 to-white/0 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
            <Github className="mr-2 h-4 w-4" aria-hidden />
            <span>
              {isSocialLoading
                ? t("auth.signIn.github.connecting")
                : t("auth.signIn.github.cta")}
            </span>
            {!isSocialLoading ? (
              <ArrowRight className="ml-auto h-4 w-4" aria-hidden />
            ) : null}
          </Button>
        </div>
        <p className="mb-5! text-center text-xs text-muted-foreground">
          {t("auth.signIn.github.helper")}
        </p>
        <div className="mt-5 relative top-8">
          <div className="absolute inset-0 flex items-center">
            <span className="w-full border-t" />
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-background py-1 rounded-sm px-2 text-muted-foreground">
              {t("auth.signIn.divider")}
            </span>
          </div>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4 mt-15">
          <div className="space-y-2">
            <label htmlFor="email" className="text-sm font-medium pb-2">
              {t("auth.signIn.fields.email.label")}
            </label>
            <Input
              id="email"
              type="email"
              placeholder={t("auth.signIn.fields.email.placeholder")}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              autoComplete="email"
              required
              disabled={isBusy}
              className="mt-1.5 h-10 border-border/70 bg-white text-foreground placeholder:text-muted-foreground dark:border-white/20 dark:bg-black"
            />
          </div>
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label htmlFor="password" className="text-sm font-medium">
                {t("auth.signIn.fields.password.label")}
              </label>
              <Link
                href="/forgot-password"
                className="text-xs text-muted-foreground hover:text-primary hover:underline"
              >
                {t("auth.signIn.forgotPassword")}
              </Link>
            </div>
            <Input
              id="password"
              type="password"
              placeholder={t("auth.signIn.fields.password.placeholder")}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete="current-password"
              required
              disabled={isBusy}
              className="h-10 border-border/70 bg-white text-foreground placeholder:text-muted-foreground dark:border-white/20 dark:bg-black"
            />
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
            {isLoading ? t("auth.signIn.submit.loading") : t("common.signIn")}
          </Button>
        </form>
        <p className="text-center text-sm text-muted-foreground">
          {t("auth.signIn.noAccount")}{" "}
          <Link
            href="/sign-up"
            className="font-medium text-primary hover:underline"
          >
            {t("auth.signIn.createAccount")}
          </Link>
        </p>
      </CardContent>
    </Card>
  );
}

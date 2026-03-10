"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useState } from "react";

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

function ResetPasswordForm() {
  const { t } = useI18n();
  const searchParams = useSearchParams();
  const router = useRouter();
  const token = searchParams.get("token") ?? "";
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [done, setDone] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (password !== confirm) {
      setError(t("auth.resetPassword.errors.mismatch"));
      return;
    }
    if (password.length < 8) {
      setError(t("auth.resetPassword.errors.minLength"));
      return;
    }
    setIsLoading(true);
    try {
      await new Promise((r) => setTimeout(r, 800));
      setDone(true);
      setTimeout(() => router.push("/sign-in"), 2000);
    } catch {
      setError(t("auth.resetPassword.errors.generic"));
    } finally {
      setIsLoading(false);
    }
  };

  if (done) {
    return (
      <Card className="w-full max-w-md border-border/60 shadow-lg shadow-black/5">
        <CardHeader className="space-y-1.5 text-center pb-2">
          <CardTitle className="text-xl font-semibold tracking-tight">
            {t("auth.resetPassword.done.title")}
          </CardTitle>
          <CardDescription className="text-muted-foreground">
            {t("auth.resetPassword.done.description")}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Link href="/sign-in" className="block">
            <Button className="w-full h-10">
              {t("auth.resetPassword.done.cta")}
            </Button>
          </Link>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full max-w-md border-border/60 shadow-lg shadow-black/5">
      <CardHeader className="space-y-1.5 text-center pb-2">
        <CardTitle className="text-xl font-semibold tracking-tight">
          {t("auth.resetPassword.title")}
        </CardTitle>
        <CardDescription className="text-muted-foreground">
          {token
            ? t("auth.resetPassword.description.withToken")
            : t("auth.resetPassword.description.missingToken")}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {token ? (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <label htmlFor="password" className="text-sm font-medium">
                {t("auth.resetPassword.fields.newPassword.label")}
              </label>
              <Input
                id="password"
                type="password"
                placeholder={t(
                  "auth.resetPassword.fields.newPassword.placeholder",
                )}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength={8}
                disabled={isLoading}
                className="h-10"
              />
            </div>
            <div className="space-y-2">
              <label htmlFor="confirm" className="text-sm font-medium">
                {t("auth.resetPassword.fields.confirmPassword.label")}
              </label>
              <Input
                id="confirm"
                type="password"
                placeholder={t(
                  "auth.resetPassword.fields.confirmPassword.placeholder",
                )}
                value={confirm}
                onChange={(e) => setConfirm(e.target.value)}
                required
                minLength={8}
                disabled={isLoading}
                className="h-10"
              />
            </div>
            {error ? (
              <div
                className="rounded-md border border-destructive/30 bg-destructive/10 px-3 py-2 text-sm text-destructive"
                role="alert"
              >
                {error}
              </div>
            ) : null}
            <Button
              type="submit"
              className="w-full h-10 font-medium"
              disabled={isLoading}
            >
              {isLoading
                ? t("auth.resetPassword.submit.loading")
                : t("auth.resetPassword.submit.default")}
            </Button>
          </form>
        ) : null}
        <p className="text-center text-sm text-muted-foreground">
          <Link
            href="/forgot-password"
            className="font-medium text-primary hover:underline"
          >
            {t("auth.resetPassword.links.requestNewLink")}
          </Link>
          {" · "}
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

export default function ResetPasswordPage() {
  const { t } = useI18n();

  return (
    <Suspense
      fallback={
        <Card className="w-full max-w-md border-border/60">
          <CardContent className="py-10 text-center text-muted-foreground">
            {t("common.loading")}
          </CardContent>
        </Card>
      }
    >
      <ResetPasswordForm />
    </Suspense>
  );
}

"use client";

import { useState } from "react";
import Link from "next/link";
import posthog from "posthog-js";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useI18n } from "@/hooks/use-i18n";

export default function ForgotPasswordPage() {
  const { t } = useI18n();
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [sent, setSent] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setSent(false);
    try {
      // Placeholder: in a real app you'd call your auth provider's forgot-password API
      await new Promise((r) => setTimeout(r, 800));
      setSent(true);

      // Capture password reset request event
      posthog.capture("password_reset_requested", {
        email_provided: Boolean(email),
      });
    } catch {
      // no-op
    } finally {
      setIsLoading(false);
    }
  };

  if (sent) {
    return (
      <Card className="w-full max-w-md border-border/60 shadow-lg shadow-black/5">
        <CardHeader className="space-y-1.5 text-center pb-2">
          <CardTitle className="text-xl font-semibold tracking-tight">
            {t("auth.forgotPassword.sent.title")}
          </CardTitle>
          <CardDescription className="text-muted-foreground">
            {t("auth.forgotPassword.sent.descriptionPrefix")}{" "}
            <strong className="text-foreground">{email}</strong>,{" "}
            {t("auth.forgotPassword.sent.descriptionSuffix")}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Link href="/sign-in" className="block">
            <Button variant="outline" className="w-full h-10">
              {t("auth.forgotPassword.backToSignIn")}
            </Button>
          </Link>
          <p className="text-center text-sm text-muted-foreground">
            {t("auth.forgotPassword.sent.wrongEmail")}{" "}
            <button
              type="button"
              onClick={() => setSent(false)}
              className="font-medium text-primary hover:underline"
            >
              {t("auth.forgotPassword.sent.tryAgain")}
            </button>
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full max-w-md border-border/60 shadow-lg shadow-black/5">
      <CardHeader className="space-y-1.5 text-center pb-2">
        <CardTitle className="text-xl font-semibold tracking-tight">
          {t("auth.forgotPassword.title")}
        </CardTitle>
        <CardDescription className="text-muted-foreground">
          {t("auth.forgotPassword.description")}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <label htmlFor="email" className="text-sm font-medium">
              {t("auth.forgotPassword.fields.email.label")}
            </label>
            <Input
              id="email"
              type="email"
              placeholder={t("auth.forgotPassword.fields.email.placeholder")}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              disabled={isLoading}
              className="h-10"
            />
          </div>
          <Button
            type="submit"
            className="w-full h-10 font-medium"
            disabled={isLoading}
          >
            {isLoading
              ? t("auth.forgotPassword.submit.loading")
              : t("auth.forgotPassword.submit.default")}
          </Button>
        </form>
        <p className="text-center text-sm text-muted-foreground">
          <Link href="/sign-in" className="font-medium text-primary hover:underline">
            {t("auth.forgotPassword.backToSignIn")}
          </Link>
        </p>
      </CardContent>
    </Card>
  );
}

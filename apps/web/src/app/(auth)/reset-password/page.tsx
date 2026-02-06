"use client";

import { Suspense, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

function ResetPasswordForm() {
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
      setError("Passwords don't match");
      return;
    }
    if (password.length < 8) {
      setError("Use at least 8 characters");
      return;
    }
    setIsLoading(true);
    try {
      await new Promise((r) => setTimeout(r, 800));
      setDone(true);
      setTimeout(() => router.push("/sign-in"), 2000);
    } catch {
      setError("Something went wrong. Try again or request a new link.");
    } finally {
      setIsLoading(false);
    }
  };

  if (done) {
    return (
      <Card className="w-full max-w-md border-border/60 shadow-lg shadow-black/5">
        <CardHeader className="space-y-1.5 text-center pb-2">
          <CardTitle className="text-xl font-semibold tracking-tight">
            Password updated
          </CardTitle>
          <CardDescription className="text-muted-foreground">
            Redirecting you to sign in…
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Link href="/sign-in" className="block">
            <Button className="w-full h-10">Sign in now</Button>
          </Link>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full max-w-md border-border/60 shadow-lg shadow-black/5">
      <CardHeader className="space-y-1.5 text-center pb-2">
        <CardTitle className="text-xl font-semibold tracking-tight">
          Set new password
        </CardTitle>
        <CardDescription className="text-muted-foreground">
          {token
            ? "Enter your new password below."
            : "Use the link from your email to set a new password. If you landed here by mistake, request a new link from the sign-in page."}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {token ? (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <label htmlFor="password" className="text-sm font-medium">
                New password
              </label>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
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
                Confirm password
              </label>
              <Input
                id="confirm"
                type="password"
                placeholder="••••••••"
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
              {isLoading ? "Updating…" : "Update password"}
            </Button>
          </form>
        ) : null}
        <p className="text-center text-sm text-muted-foreground">
          <Link href="/forgot-password" className="font-medium text-primary hover:underline">
            Request a new reset link
          </Link>
          {" · "}
          <Link href="/sign-in" className="font-medium text-primary hover:underline">
            Sign in
          </Link>
        </p>
      </CardContent>
    </Card>
  );
}

export default function ResetPasswordPage() {
  return (
    <Suspense
      fallback={
        <Card className="w-full max-w-md border-border/60">
          <CardContent className="py-10 text-center text-muted-foreground">
            Loading…
          </CardContent>
        </Card>
      }
    >
      <ResetPasswordForm />
    </Suspense>
  );
}

"use client";

import { useState } from "react";
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

export default function ForgotPasswordPage() {
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
            Check your inbox
          </CardTitle>
          <CardDescription className="text-muted-foreground">
            If an account exists for <strong className="text-foreground">{email}</strong>, we’ve
            sent a reset link. It may take a minute; check spam if you don’t see it.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Link href="/sign-in" className="block">
            <Button variant="outline" className="w-full h-10">
              Back to sign in
            </Button>
          </Link>
          <p className="text-center text-sm text-muted-foreground">
            Wrong email?{" "}
            <button
              type="button"
              onClick={() => setSent(false)}
              className="font-medium text-primary hover:underline"
            >
              Try again
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
          Forgot password?
        </CardTitle>
        <CardDescription className="text-muted-foreground">
          Enter your account email and we’ll send a link to set a new password.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <label htmlFor="email" className="text-sm font-medium">
              Email
            </label>
            <Input
              id="email"
              type="email"
              placeholder="you@example.com"
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
            {isLoading ? "Sending…" : "Send reset link"}
          </Button>
        </form>
        <p className="text-center text-sm text-muted-foreground">
          <Link href="/sign-in" className="font-medium text-primary hover:underline">
            Back to sign in
          </Link>
        </p>
      </CardContent>
    </Card>
  );
}

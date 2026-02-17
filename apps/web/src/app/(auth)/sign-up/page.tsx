"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { CheckCircle2, Clock3, ShieldCheck, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { signUp } from "@/lib/auth-client";

export default function SignUpPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

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
        setError(result.error.message || "Couldn’t create account");
      } else {
        router.push("/dashboard");
      }
    } catch (err) {
      console.error("Sign-up error:", err);
      setError("Something went wrong. Try again?");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-md border-border/60 bg-background/95 shadow-xl shadow-black/5 backdrop-blur-xs">
      <CardHeader className="space-y-3 pb-2 text-center">
        <p className="mx-auto inline-flex w-fit items-center gap-1.5 rounded-full border border-primary/20 bg-primary/3 px-3 py-1 text-xs font-medium text-primary">
          <Sparkles className="h-3.5 w-3.5" aria-hidden />
          Start free in under a minute
        </p>
        <CardTitle className="text-4xl font-semibold tracking-tight">
          Create your chef account
        </CardTitle>
        <CardDescription className="mx-auto max-w-sm text-muted-foreground">
          Turn real SaaS codebases into your launch playbook. Save recipes, compare
          stacks, and ship with more confidence.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <label htmlFor="name" className="text-sm font-medium">
              Name
            </label>
            <Input
              id="name"
              type="text"
              placeholder="Alex Chen"
              value={name}
              onChange={(e) => setName(e.target.value)}
              autoComplete="name"
              required
              disabled={isLoading}
              className="h-10"
            />
          </div>
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
              autoComplete="email"
              required
              disabled={isLoading}
              className="h-10"
            />
          </div>
          <div className="space-y-2">
            <label htmlFor="password" className="text-sm font-medium">
              Password
            </label>
            <Input
              id="password"
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={8}
              autoComplete="new-password"
              disabled={isLoading}
              className="h-10"
            />
            <p className="text-xs text-muted-foreground">
              Use at least 8 characters. Your password is encrypted and never stored
              in plaintext.
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
            disabled={isLoading}
          >
            {isLoading ? "Creating your account…" : "Create free account"}
          </Button>
        </form>
        <ul className="space-y-2 mt-3 rounded-lg border border-border/60 bg-muted/20 p-3 text-xs text-muted-foreground">
          <li className="flex items-start gap-2">
            <CheckCircle2 className="mt-0.5 h-3.5 w-3.5 shrink-0 text-primary" aria-hidden />
            Access curated SaaS recipes and architecture breakdowns instantly.
          </li>
          <li className="flex items-start gap-2">
            <Clock3 className="mb-0.5 h-3.5 w-3.5 shrink-0 text-primary" aria-hidden />
            Set up once, then jump straight into your next build.
          </li>
          <li className="flex items-start gap-2">
            <ShieldCheck className="mb-0.5 h-3.5 w-3.5 shrink-0 text-primary" aria-hidden />
            Free to start. No credit card required.
          </li>
        </ul>
  
        <p className="text-center text-sm text-muted-foreground">
          Already have an account?{" "}
          <Link
            href="/sign-in"
            className="font-medium text-primary hover:underline"
          >
            Sign in
          </Link>
        </p>
      </CardContent>
    </Card>
  );
}

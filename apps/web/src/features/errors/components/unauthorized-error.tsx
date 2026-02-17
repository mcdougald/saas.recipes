"use client";

import { Button } from "@/components/ui/button";
import { LockKeyhole } from "lucide-react";
import { useRouter } from "next/navigation";

export function UnauthorizedError() {
  const router = useRouter();
  return (
    <div className="h-svh w-full bg-background">
      <div className="m-auto flex h-full w-full max-w-2xl flex-col items-center justify-center px-6">
        <div className="w-full rounded-2xl border bg-card p-8 text-center shadow-sm">
          <LockKeyhole className="mx-auto h-16 w-16 text-muted-foreground" />
          <p className="mt-6 text-xs tracking-[0.2em] text-muted-foreground uppercase">
            saas.recipes
          </p>
          <h1 className="mt-2 text-7xl leading-tight font-bold">401</h1>
          <h2 className="mt-2 text-xl font-semibold">
            Sign in to keep cooking
          </h2>
          <p className="mt-4 text-muted-foreground">
            You need an account to access this page and your saved workspace.
          </p>
          <p className="text-muted-foreground">
            Sign in to continue building, publishing, and scaling your recipe
            business.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <Button variant="outline" onClick={() => router.push("/sign-up")}>
              Create Free Account
            </Button>
            <Button onClick={() => router.push("/sign-in")}>Sign In</Button>
          </div>
        </div>
      </div>
    </div>
  );
}

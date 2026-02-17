"use client";

import { Button } from "@/components/ui/button";
import { FileQuestion } from "lucide-react";
import { useRouter } from "next/navigation";

export function NotFoundError() {
  const router = useRouter();

  return (
    <div className="h-svh w-full bg-background">
      <div className="m-auto flex h-full w-full max-w-2xl flex-col items-center justify-center px-6">
        <div className="w-full rounded-2xl border bg-card p-8 text-center shadow-sm">
          <FileQuestion className="mx-auto h-16 w-16 text-muted-foreground" />
          <p className="mt-6 text-xs tracking-[0.2em] text-muted-foreground uppercase">
            saas.recipes
          </p>
          <h1 className="mt-2 text-7xl leading-tight font-bold">404</h1>
          <h2 className="mt-2 text-xl font-semibold">
            This page is no longer on the menu
          </h2>
          <p className="mt-4 text-muted-foreground">
            The link may be outdated, moved, or removed.
          </p>
          <p className="text-muted-foreground">
            Head back to your dashboard and keep building your recipe business
            with saas.recipes.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <Button variant="outline" onClick={() => router.back()}>
              Go Back
            </Button>
            <Button onClick={() => router.push("/")}>Go to Dashboard</Button>
          </div>
        </div>
      </div>
    </div>
  );
}

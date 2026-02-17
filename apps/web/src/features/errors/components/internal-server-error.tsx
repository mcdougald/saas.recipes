"use client";

import { Button } from "@/components/ui/button";
import { ServerCrash } from "lucide-react";
import { useRouter } from "next/navigation";

export function InternalServerError() {
  const router = useRouter();
  return (
    <div className="h-svh w-full bg-background">
      <div className="m-auto flex h-full w-full max-w-2xl flex-col items-center justify-center px-6">
        <div className="w-full rounded-2xl border bg-card p-8 text-center shadow-sm">
          <ServerCrash className="mx-auto h-16 w-16 text-muted-foreground" />
          <p className="mt-6 text-xs tracking-[0.2em] text-muted-foreground uppercase">
            saas.recipes
          </p>
          <h1 className="mt-2 text-7xl leading-tight font-bold">500</h1>
          <h2 className="mt-2 text-xl font-semibold">
            Our kitchen hit a temporary snag
          </h2>
          <p className="mt-4 text-muted-foreground">
            Something failed on our side while loading your workspace.
          </p>
          <p className="text-muted-foreground">
            Your recipes and business data are safe. Try again in a moment, or
            visit Help Center for updates.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <Button
              variant="outline"
              onClick={() => router.push("/help-center")}
            >
              Help Center
            </Button>
            <Button onClick={() => window.location.reload()}>Try Again</Button>
          </div>
        </div>
      </div>
    </div>
  );
}

"use client";

import { Button } from "@/components/ui/button";
import { ShieldX } from "lucide-react";
import { useRouter } from "next/navigation";

export function ForbiddenError() {
  const router = useRouter();
  return (
    <div className="h-svh w-full bg-background">
      <div className="m-auto flex h-full w-full max-w-2xl flex-col items-center justify-center px-6">
        <div className="w-full rounded-2xl border bg-card p-8 text-center shadow-sm">
          <ShieldX className="mx-auto h-16 w-16 text-muted-foreground" />
          <p className="mt-6 text-xs tracking-[0.2em] text-muted-foreground uppercase">
            saas.recipes
          </p>
          <h1 className="mt-2 text-7xl leading-tight font-bold">403</h1>
          <h2 className="mt-2 text-xl font-semibold">This feature is locked</h2>
          <p className="mt-4 text-muted-foreground">
            Your current access level does not include this page yet.
          </p>
          <p className="text-muted-foreground">
            Upgrade your workspace to unlock premium recipe workflows, automation,
            and faster publishing.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <Button variant="outline" onClick={() => router.back()}>
              Go Back
            </Button>
            <Button onClick={() => router.push("/pricing")}>
              View Plans
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

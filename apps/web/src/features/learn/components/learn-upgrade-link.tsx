"use client";

import Link from "next/link";
import posthog from "posthog-js";

import { Button } from "@/components/ui/button";

interface LearnUpgradeLinkProps {
  source: string;
  label: string;
  variant?:
    | "default"
    | "destructive"
    | "outline"
    | "secondary"
    | "ghost"
    | "link";
  size?: "default" | "sm" | "lg" | "icon" | "icon-sm" | "icon-lg";
}

/**
 * Render a pricing CTA button with learn-specific upgrade analytics.
 *
 * @param props - CTA metadata and visual button configuration.
 * @returns A button link to pricing that captures upgrade intent.
 */
export function LearnUpgradeLink({
  source,
  label,
  variant = "default",
  size = "default",
}: LearnUpgradeLinkProps) {
  return (
    <Button asChild variant={variant} size={size}>
      <Link
        href="/pricing"
        onClick={() => {
          posthog.capture("learn_upgrade_intent_clicked", {
            source,
          });
        }}
      >
        {label}
      </Link>
    </Button>
  );
}

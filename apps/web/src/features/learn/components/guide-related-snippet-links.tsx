"use client";

import Link from "next/link";
import posthog from "posthog-js";

import { Button } from "@/components/ui/button";

interface GuideRelatedSnippetLinksProps {
  guideSlug: string;
  snippetSlugs: string[];
}

/**
 * Render guide-to-snippet links with click analytics.
 *
 * @param props - Guide and snippet slug relationships for tracking.
 * @returns Buttons that navigate to snippet library while capturing intent.
 */
export function GuideRelatedSnippetLinks({
  guideSlug,
  snippetSlugs,
}: GuideRelatedSnippetLinksProps) {
  return (
    <div className="flex flex-wrap gap-2">
      {snippetSlugs.map((snippetSlug) => (
        <Button key={snippetSlug} asChild size="sm" variant="outline">
          <Link
            href="/learn/playbooks"
            onClick={() => {
              posthog.capture("learn_guide_to_snippet_clicked", {
                guide_slug: guideSlug,
                snippet_slug: snippetSlug,
              });
            }}
          >
            Open snippet: {snippetSlug}
          </Link>
        </Button>
      ))}
    </div>
  );
}

import { type Metadata } from "next";

import { LearnPageAnalytics } from "@/features/learn/components/learn-page-analytics";
import { SnippetLibraryPage } from "@/features/learn/components/snippet-library-page";
import { snippets } from "@/features/learn/data/snippets";

export const metadata: Metadata = {
  title: "Snippets | Learn",
  description:
    "Filter practical SaaS implementation snippets by level, stack, and use-case.",
  alternates: {
    canonical: "/learn/playbooks",
  },
};

/**
 * Render the snippet library route using typed snippet data.
 */
export default function LearnPlaybooksPage() {
  return (
    <>
      <LearnPageAnalytics pageType="snippets" />
      <SnippetLibraryPage snippets={snippets} />
    </>
  );
}

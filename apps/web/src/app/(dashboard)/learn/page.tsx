import { type Metadata } from "next";

import { LearningOverviewPage } from "@/features/learn/components/learning-overview-page";

export const metadata: Metadata = {
  title: "Learn | SaaS Academy",
  description:
    "Study SaaS course lessons, implementation guides, and production snippets in one learning flow.",
  alternates: {
    canonical: "/learn",
  },
};

/**
 * Learn feature landing route.
 */
export default function LearnPage() {
  return <LearningOverviewPage />;
}

import { LearningOverviewPage } from "@/features/learn/components/learning-overview-page";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Learn | SaaS Academy",
  description:
    "Study real SaaS codebase recipes and unlock premium academy, notes, guides, and case studies.",
};

/**
 * Learn feature landing route.
 */
export default function LearnPage() {
  return <LearningOverviewPage />;
}

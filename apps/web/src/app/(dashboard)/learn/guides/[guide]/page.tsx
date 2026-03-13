import { type Metadata } from "next";
import { notFound } from "next/navigation";

import { GuideDetailPage } from "@/features/learn/components/guide-detail-page";
import { LearnPageAnalytics } from "@/features/learn/components/learn-page-analytics";
import {
  listGuideSlugs,
  resolveGuideDetail,
} from "@/features/learn/lib/learn-resolvers";

interface LearnGuidePageProps {
  params: Promise<{
    guide: string;
  }>;
}

/**
 * Generate static params for published guide routes.
 *
 * @returns Guide slug route params.
 */
export function generateStaticParams() {
  return listGuideSlugs().map((guide) => ({ guide }));
}

/**
 * Generate metadata for one guide route.
 *
 * @param props - Async route params from App Router.
 * @returns Guide-specific metadata payload.
 */
export async function generateMetadata({
  params,
}: LearnGuidePageProps): Promise<Metadata> {
  const { guide } = await params;
  const resolvedGuide = resolveGuideDetail(guide);

  if (!resolvedGuide) {
    return {
      title: "Guide | Learn",
    };
  }

  return {
    title: `${resolvedGuide.guide.title} | Learn`,
    description: resolvedGuide.guide.outcome,
    alternates: {
      canonical: `/learn/guides/${resolvedGuide.guide.slug}`,
    },
  };
}

/**
 * Render one guide detail route.
 *
 * @param props - Async route params from App Router.
 * @returns Guide detail page or notFound for invalid slugs.
 */
export default async function LearnGuidePage({ params }: LearnGuidePageProps) {
  const { guide } = await params;
  const resolvedGuide = resolveGuideDetail(guide);

  if (!resolvedGuide) {
    notFound();
  }

  return (
    <>
      <LearnPageAnalytics pageType="guide" slug={resolvedGuide.guide.slug} />
      <GuideDetailPage
        guide={resolvedGuide.guide}
        relatedSnippets={resolvedGuide.relatedSnippets}
        relatedCourses={resolvedGuide.relatedCourses}
      />
    </>
  );
}

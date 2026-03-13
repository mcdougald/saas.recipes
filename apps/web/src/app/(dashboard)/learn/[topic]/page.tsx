import { type Metadata } from "next";
import { notFound } from "next/navigation";

import { LearnPageAnalytics } from "@/features/learn/components/learn-page-analytics";
import { LearningTopicPage } from "@/features/learn/components/learning-topic-page";
import {
  getLearningTopicBySlug,
  learningTopics,
} from "@/features/learn/data/learning-topics";
import { listCurrentUserFavoriteTopicSlugs } from "@/features/learn/server/learn-favorites";

/**
 * Dynamic route parameters for a learning topic page.
 */
interface LearnTopicPageProps {
  params: Promise<{
    topic: string;
  }>;
}

/**
 * Pre-generates static topic routes for faster navigation.
 */
export function generateStaticParams() {
  return learningTopics.map((topic) => ({ topic: topic.slug }));
}

/**
 * Generates topic-specific metadata for marketing and SEO.
 */
export async function generateMetadata({
  params,
}: LearnTopicPageProps): Promise<Metadata> {
  const { topic } = await params;
  const learningTopic = getLearningTopicBySlug(topic);

  if (!learningTopic) {
    return {
      title: "Learn | SaaS Academy",
    };
  }

  return {
    title: `${learningTopic.title} | SaaS Academy`,
    description: `${learningTopic.description} Unlock premium academy, notes, guides, and case studies for deeper implementation support.`,
    alternates: {
      canonical: `/learn/${learningTopic.slug}`,
    },
  };
}

/**
 * Topic detail route for one learning track.
 */
export default async function LearnTopicPage({ params }: LearnTopicPageProps) {
  const { topic } = await params;
  const [learningTopic, favoriteTopicSlugs] = await Promise.all([
    Promise.resolve(getLearningTopicBySlug(topic)),
    listCurrentUserFavoriteTopicSlugs(),
  ]);

  if (!learningTopic) {
    notFound();
  }

  return (
    <>
      <LearnPageAnalytics pageType="topic" slug={learningTopic.slug} />
      <LearningTopicPage
        topic={learningTopic}
        isFavorited={favoriteTopicSlugs.includes(learningTopic.slug)}
      />
    </>
  );
}

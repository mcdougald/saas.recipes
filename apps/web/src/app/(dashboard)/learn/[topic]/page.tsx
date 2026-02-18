import { LearningTopicPage } from "@/features/learn/components/learning-topic-page";
import {
  getLearningTopicBySlug,
  learningTopics,
} from "@/features/learn/data/learning-topics";
import type { Metadata } from "next";
import { notFound } from "next/navigation";

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
  };
}

/**
 * Topic detail route for one learning track.
 */
export default async function LearnTopicPage({ params }: LearnTopicPageProps) {
  const { topic } = await params;
  const learningTopic = getLearningTopicBySlug(topic);

  if (!learningTopic) {
    notFound();
  }

  return <LearningTopicPage topic={learningTopic} />;
}

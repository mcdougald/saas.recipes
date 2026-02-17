import { LearningTopicPage } from "@/features/learn/components/learning-topic-page";
import {
  getLearningTopicBySlug,
  learningTopics,
} from "@/features/learn/data/learning-topics";
import { notFound } from "next/navigation";

interface LearnTopicPageProps {
  params: Promise<{
    topic: string;
  }>;
}

export function generateStaticParams() {
  return learningTopics.map((topic) => ({ topic: topic.slug }));
}

export default async function LearnTopicPage({ params }: LearnTopicPageProps) {
  const { topic } = await params;
  const learningTopic = getLearningTopicBySlug(topic);

  if (!learningTopic) {
    notFound();
  }

  return <LearningTopicPage topic={learningTopic} />;
}

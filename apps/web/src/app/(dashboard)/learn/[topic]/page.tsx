import { LearningTopicPage } from "@/features/learn/components/learning-topic-page";
import { learningTopicMap } from "@/features/learn/data/learning-topics";
import { notFound } from "next/navigation";

interface LearnTopicPageProps {
  params: {
    topic: string;
  };
}

export default function LearnTopicPage({ params }: LearnTopicPageProps) {
  const { topic } = params;
  const learningTopic = learningTopicMap.get(topic);

  if (!learningTopic) {
    notFound();
  }

  return <LearningTopicPage topic={learningTopic} />;
}

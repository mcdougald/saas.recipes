import { type Metadata } from "next";
import { notFound } from "next/navigation";

import { LearnPageAnalytics } from "@/features/learn/components/learn-page-analytics";
import { LessonDetailPage } from "@/features/learn/components/lesson-detail-page";
import {
  listCourseLessonPairs,
  resolveLessonDetail,
  resolveRelatedSnippetsForLesson,
} from "@/features/learn/lib/learn-resolvers";

interface LearnLessonPageProps {
  params: Promise<{
    course: string;
    lesson: string;
  }>;
}

/**
 * Generate static params for published course lesson routes.
 *
 * @returns Course and lesson route tuples.
 */
export function generateStaticParams() {
  return listCourseLessonPairs().map((pair) => ({
    course: pair.courseSlug,
    lesson: pair.lessonSlug,
  }));
}

/**
 * Generate metadata for one lesson detail route.
 *
 * @param props - Async route params from App Router.
 * @returns Metadata values scoped to the resolved lesson.
 */
export async function generateMetadata({
  params,
}: LearnLessonPageProps): Promise<Metadata> {
  const { course, lesson } = await params;
  const resolvedDetail = resolveLessonDetail(course, lesson);

  if (!resolvedDetail) {
    return {
      title: "Lesson | Learn",
    };
  }

  return {
    title: `${resolvedDetail.lesson.title} | ${resolvedDetail.course.title}`,
    description: resolvedDetail.lesson.objective,
    alternates: {
      canonical: `/learn/courses/${resolvedDetail.course.slug}/${resolvedDetail.lesson.slug}`,
    },
  };
}

/**
 * Render one course lesson route with progression context.
 *
 * @param props - Async route params from App Router.
 * @returns Lesson detail page or notFound for invalid slugs.
 */
export default async function LearnLessonPage({
  params,
}: LearnLessonPageProps) {
  const { course, lesson } = await params;
  const resolvedDetail = resolveLessonDetail(course, lesson);

  if (!resolvedDetail) {
    notFound();
  }

  const relatedSnippets = resolveRelatedSnippetsForLesson(
    resolvedDetail.lesson,
  );

  return (
    <>
      <LearnPageAnalytics
        pageType="lesson"
        slug={resolvedDetail.lesson.slug}
        courseSlug={resolvedDetail.course.slug}
      />
      <LessonDetailPage
        course={resolvedDetail.course}
        lesson={resolvedDetail.lesson}
        previousLesson={resolvedDetail.previousLesson}
        nextLesson={resolvedDetail.nextLesson}
        relatedSnippets={relatedSnippets}
      />
    </>
  );
}

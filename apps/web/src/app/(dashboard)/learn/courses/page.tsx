import { type Metadata } from "next";

import { CourseCatalogPage } from "@/features/learn/components/course-catalog-page";
import { LearnPageAnalytics } from "@/features/learn/components/learn-page-analytics";
import { listPublishedCourses } from "@/features/learn/data/courses";
import { lessons } from "@/features/learn/data/lessons";

export const metadata: Metadata = {
  title: "Courses | Learn",
  description:
    "Follow structured SaaS courses with lessons, outcomes, and practical checkpoints.",
  alternates: {
    canonical: "/learn/courses",
  },
};

/**
 * Render the published course catalog route.
 */
export default function LearnCoursesPage() {
  const publishedCourses = listPublishedCourses();

  return (
    <>
      <LearnPageAnalytics pageType="courses" />
      <CourseCatalogPage courses={publishedCourses} lessons={lessons} />
    </>
  );
}

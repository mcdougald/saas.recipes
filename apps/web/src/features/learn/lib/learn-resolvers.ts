import {
  type Course,
  courses,
  getCourseBySlug,
} from "@/features/learn/data/courses";
import {
  type Guide,
  getGuideBySlug,
  guides,
} from "@/features/learn/data/guides";
import {
  getLessonBySlug,
  type Lesson,
  listLessonsByCourseSlug,
} from "@/features/learn/data/lessons";
import {
  getSnippetBySlug,
  listPublishedSnippets,
  type Snippet,
} from "@/features/learn/data/snippets";

/**
 * Resolve one course with its published lessons.
 */
export interface ResolvedCourseDetail {
  course: Course;
  lessons: Lesson[];
}

/**
 * Resolve one lesson with adjacent lesson navigation.
 */
export interface ResolvedLessonDetail {
  course: Course;
  lesson: Lesson;
  previousLesson: Lesson | null;
  nextLesson: Lesson | null;
}

/**
 * Resolve one guide with related snippets and courses.
 */
export interface ResolvedGuideDetail {
  guide: Guide;
  relatedSnippets: Snippet[];
  relatedCourses: Course[];
}

/**
 * Resolve one course detail payload by slug.
 *
 * @param courseSlug - Course slug from route params.
 * @returns Course detail data, or null when slug is unknown.
 */
export function resolveCourseDetail(
  courseSlug: string,
): ResolvedCourseDetail | null {
  const course = getCourseBySlug(courseSlug);
  if (!course) return null;

  return {
    course,
    lessons: listLessonsByCourseSlug(course.slug),
  };
}

/**
 * Resolve lesson detail and adjacent navigation by slugs.
 *
 * @param courseSlug - Course slug from route params.
 * @param lessonSlug - Lesson slug from route params.
 * @returns Lesson detail with previous and next lesson references.
 */
export function resolveLessonDetail(
  courseSlug: string,
  lessonSlug: string,
): ResolvedLessonDetail | null {
  const course = getCourseBySlug(courseSlug);
  const lesson = getLessonBySlug(lessonSlug);
  if (!course || !lesson || lesson.courseSlug !== course.slug) {
    return null;
  }

  const courseLessons = listLessonsByCourseSlug(course.slug);
  const lessonIndex = courseLessons.findIndex(
    (courseLesson) => courseLesson.slug === lesson.slug,
  );
  if (lessonIndex < 0) {
    return null;
  }

  return {
    course,
    lesson,
    previousLesson: courseLessons[lessonIndex - 1] ?? null,
    nextLesson: courseLessons[lessonIndex + 1] ?? null,
  };
}

/**
 * Resolve one guide and hydrate related snippets and courses.
 *
 * @param guideSlug - Guide slug from route params.
 * @returns Guide detail payload, or null when guide is unknown.
 */
export function resolveGuideDetail(
  guideSlug: string,
): ResolvedGuideDetail | null {
  const guide = getGuideBySlug(guideSlug);
  if (!guide) return null;

  const relatedSnippets = guide.relatedSnippetSlugs
    .map((slug) => getSnippetBySlug(slug))
    .filter((snippet): snippet is Snippet => Boolean(snippet));
  const relatedCourses = guide.relatedCourseSlugs
    .map((slug) => getCourseBySlug(slug))
    .filter((course): course is Course => Boolean(course));

  return {
    guide,
    relatedSnippets,
    relatedCourses,
  };
}

/**
 * Resolve related snippets for one lesson using course relationships.
 *
 * @param lesson - Lesson currently being viewed.
 * @returns Published snippets related to the lesson's parent course.
 */
export function resolveRelatedSnippetsForLesson(lesson: Lesson): Snippet[] {
  return listPublishedSnippets().filter((snippet) =>
    snippet.relatedCourseSlugs.includes(lesson.courseSlug),
  );
}

/**
 * Resolve the next lesson recommendation for a course slug.
 *
 * @param courseSlug - Course slug used to derive learning progression.
 * @returns The first published lesson as a default continuation target.
 */
export function resolveContinueLessonForCourse(
  courseSlug: string,
): Lesson | null {
  return listLessonsByCourseSlug(courseSlug)[0] ?? null;
}

/**
 * Resolve all slugs used by static route generation.
 *
 * @returns Flattened pairs of course and lesson slugs.
 */
export function listCourseLessonPairs(): Array<{
  courseSlug: string;
  lessonSlug: string;
}> {
  return courses.flatMap((course) =>
    listLessonsByCourseSlug(course.slug).map((lesson) => ({
      courseSlug: course.slug,
      lessonSlug: lesson.slug,
    })),
  );
}

/**
 * Resolve guide slugs used by static route generation.
 *
 * @returns Published guide slugs.
 */
export function listGuideSlugs(): string[] {
  return guides
    .filter((guide) => guide.status === "published")
    .map((guide) => guide.slug);
}

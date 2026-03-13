import { ArrowRight, Clock3, LockKeyhole } from "lucide-react";
import Link from "next/link";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { type Course } from "@/features/learn/data/courses";
import { type Lesson } from "@/features/learn/data/lessons";
import { resolveContinueLessonForCourse } from "@/features/learn/lib/learn-resolvers";

interface CourseCatalogPageProps {
  courses: Course[];
  lessons: Lesson[];
}

/**
 * Render the learn courses catalog with progression entry points.
 *
 * @param props - Published course and lesson collections.
 * @returns Course cards with continue-learning navigation and outcomes.
 */
export function CourseCatalogPage({
  courses,
  lessons,
}: CourseCatalogPageProps) {
  const lessonsByCourseSlug = new Map<string, Lesson[]>();
  for (const lesson of lessons) {
    const existing = lessonsByCourseSlug.get(lesson.courseSlug) ?? [];
    existing.push(lesson);
    lessonsByCourseSlug.set(lesson.courseSlug, existing);
  }

  return (
    <div className="@container/main space-y-6 px-4 pb-6 lg:px-6">
      <Card className="border">
        <CardHeader>
          <CardTitle>Courses</CardTitle>
          <CardDescription>
            Structured learning paths that combine lessons, guided practice, and
            implementation checkpoints.
          </CardDescription>
        </CardHeader>
      </Card>

      <div className="grid gap-4 lg:grid-cols-2">
        {courses.map((course) => {
          const courseLessons = (
            lessonsByCourseSlug.get(course.slug) ?? []
          ).toSorted((first, second) => first.position - second.position);
          const continueLesson =
            resolveContinueLessonForCourse(course.slug) ?? courseLessons[0];

          return (
            <Card key={course.slug} className="border">
              <CardHeader className="space-y-3">
                <div className="flex flex-wrap items-center gap-2">
                  <Badge variant="secondary">{course.difficulty}</Badge>
                  <Badge variant="outline" className="gap-1">
                    <Clock3 aria-hidden className="size-3.5" />
                    {course.estimatedHours}h
                  </Badge>
                  {course.isPremium ? (
                    <Badge variant="outline" className="gap-1">
                      <LockKeyhole aria-hidden className="size-3.5" />
                      Premium
                    </Badge>
                  ) : null}
                </div>
                <CardTitle>{course.title}</CardTitle>
                <CardDescription>{course.summary}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <p className="text-sm font-medium">What you will learn</p>
                  {course.learningOutcomes.map((outcome) => (
                    <p
                      key={outcome.id}
                      className="text-sm text-muted-foreground"
                    >
                      - {outcome.title}: {outcome.description}
                    </p>
                  ))}
                </div>

                <div className="space-y-2">
                  <p className="text-sm font-medium">Lessons</p>
                  {courseLessons.length === 0 ? (
                    <p className="text-sm text-muted-foreground">
                      Lessons are being prepared for this course.
                    </p>
                  ) : (
                    courseLessons.map((lesson) => (
                      <p
                        key={lesson.slug}
                        className="text-sm text-muted-foreground"
                      >
                        {lesson.position}. {lesson.title}
                      </p>
                    ))
                  )}
                </div>

                <div className="flex flex-wrap gap-2">
                  {continueLesson ? (
                    <Button asChild>
                      <Link
                        href={`/learn/courses/${course.slug}/${continueLesson.slug}`}
                      >
                        {course.isPremium ? "Preview course" : "Start course"}
                        <ArrowRight aria-hidden className="size-4" />
                      </Link>
                    </Button>
                  ) : null}
                  <Button asChild variant="outline">
                    <Link href="/learn/playbooks">Practice with snippets</Link>
                  </Button>
                  {course.isPremium ? (
                    <Button asChild variant="outline">
                      <Link href="/pricing">Unlock full course</Link>
                    </Button>
                  ) : null}
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}

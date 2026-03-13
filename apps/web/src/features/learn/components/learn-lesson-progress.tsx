"use client";

import { CheckCircle2 } from "lucide-react";
import Link from "next/link";
import posthog from "posthog-js";
import { useEffect, useMemo, useState } from "react";

import { Button } from "@/components/ui/button";
import { type Lesson } from "@/features/learn/data/lessons";

interface LearnLessonProgressProps {
  courseSlug: string;
  lesson: Lesson;
  nextLessonSlug: string | null;
}

function getProgressStorageKey(courseSlug: string) {
  return `learn:course-progress:${courseSlug}`;
}

/**
 * Track and render lightweight lesson progression controls.
 *
 * @param props - Lesson metadata and next-step navigation inputs.
 * @returns Completion actions with continue-learning navigation.
 */
export function LearnLessonProgress({
  courseSlug,
  lesson,
  nextLessonSlug,
}: LearnLessonProgressProps) {
  const storageKey = useMemo(
    () => getProgressStorageKey(courseSlug),
    [courseSlug],
  );
  const [isCompleted, setIsCompleted] = useState(false);

  useEffect(() => {
    try {
      const rawValue = window.localStorage.getItem(storageKey);
      if (!rawValue) return;

      const completedSlugs = JSON.parse(rawValue) as string[];
      setIsCompleted(completedSlugs.includes(lesson.slug));
    } catch {
      setIsCompleted(false);
    }
  }, [lesson.slug, storageKey]);

  useEffect(() => {
    posthog.capture("learn_lesson_started", {
      course_slug: courseSlug,
      lesson_slug: lesson.slug,
    });

    return () => {
      if (!isCompleted) {
        posthog.capture("learn_lesson_drop_off", {
          course_slug: courseSlug,
          lesson_slug: lesson.slug,
        });
      }
    };
  }, [courseSlug, isCompleted, lesson.slug]);

  function markCompleted() {
    try {
      const rawValue = window.localStorage.getItem(storageKey);
      const completedSlugs = rawValue ? (JSON.parse(rawValue) as string[]) : [];
      const nextCompletedSlugs = Array.from(
        new Set([...completedSlugs, lesson.slug]),
      );

      window.localStorage.setItem(
        storageKey,
        JSON.stringify(nextCompletedSlugs),
      );
      setIsCompleted(true);
    } catch {
      setIsCompleted(true);
    }

    posthog.capture("learn_lesson_completed", {
      course_slug: courseSlug,
      lesson_slug: lesson.slug,
    });
  }

  return (
    <div className="flex flex-wrap items-center gap-2">
      <Button
        type="button"
        variant={isCompleted ? "secondary" : "default"}
        onClick={markCompleted}
      >
        <CheckCircle2 aria-hidden className="size-4" />
        {isCompleted ? "Lesson completed" : "Mark lesson complete"}
      </Button>
      {nextLessonSlug ? (
        <Button asChild variant="outline">
          <Link href={`/learn/courses/${courseSlug}/${nextLessonSlug}`}>
            Continue to next lesson
          </Link>
        </Button>
      ) : (
        <Button asChild variant="outline">
          <Link href="/learn/courses">Browse next course</Link>
        </Button>
      )}
    </div>
  );
}

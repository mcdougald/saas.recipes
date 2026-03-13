import { LockKeyhole } from "lucide-react";
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
import { LearnLessonProgress } from "@/features/learn/components/learn-lesson-progress";
import { LearnUpgradeLink } from "@/features/learn/components/learn-upgrade-link";
import { type Course } from "@/features/learn/data/courses";
import { type Lesson } from "@/features/learn/data/lessons";
import { type Snippet } from "@/features/learn/data/snippets";

interface LessonDetailPageProps {
  course: Course;
  lesson: Lesson;
  previousLesson: Lesson | null;
  nextLesson: Lesson | null;
  relatedSnippets: Snippet[];
}

/**
 * Render lesson detail with progression, practice prompts, and related snippets.
 *
 * @param props - Resolved lesson detail payload for one course lesson route.
 * @returns Lesson content surface with educational progression controls.
 */
export function LessonDetailPage({
  course,
  lesson,
  previousLesson,
  nextLesson,
  relatedSnippets,
}: LessonDetailPageProps) {
  const shouldShowPremiumPreview =
    course.isPremium && course.previewDepth !== "full";
  const visibleContentBlocks = shouldShowPremiumPreview
    ? lesson.contentBlocks.slice(
        0,
        Math.max(1, Math.floor(lesson.contentBlocks.length / 2)),
      )
    : lesson.contentBlocks;

  return (
    <div className="@container/main space-y-6 px-4 pb-6 lg:px-6">
      <Card className="border">
        <CardHeader className="space-y-3">
          <div className="flex flex-wrap items-center gap-2">
            <Badge variant="secondary">{course.title}</Badge>
            <Badge variant="outline">Lesson {lesson.position}</Badge>
            {course.isPremium ? (
              <Badge variant="outline" className="gap-1">
                <LockKeyhole aria-hidden className="size-3.5" />
                Premium track
              </Badge>
            ) : null}
          </div>
          <CardTitle>{lesson.title}</CardTitle>
          <CardDescription>{lesson.objective}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <p className="text-sm font-medium">What you will learn</p>
            {course.learningOutcomes.map((outcome) => (
              <p key={outcome.id} className="text-sm text-muted-foreground">
                - {outcome.title}
              </p>
            ))}
          </div>

          <div className="space-y-3">
            {visibleContentBlocks.map((block) => (
              <div key={block.id} className="rounded-md border p-4">
                {block.title ? (
                  <p className="font-medium">{block.title}</p>
                ) : null}
                {block.kind === "code" ? (
                  <pre className="mt-2 overflow-x-auto rounded-md border bg-muted/40 p-3 text-xs leading-5">
                    <code>{block.body}</code>
                  </pre>
                ) : (
                  <p className="mt-2 text-sm text-muted-foreground whitespace-pre-wrap">
                    {block.body}
                  </p>
                )}
              </div>
            ))}
          </div>

          {shouldShowPremiumPreview ? (
            <div className="rounded-md border border-dashed p-4 text-sm text-muted-foreground">
              This is a premium course preview. Upgrade to unlock the rest of
              this lesson and all completion check walkthroughs.
              <div className="mt-3">
                <LearnUpgradeLink
                  source="lesson_preview_gate"
                  label="Unlock full lesson"
                  size="sm"
                />
              </div>
            </div>
          ) : null}

          <div className="space-y-2">
            <p className="text-sm font-medium">Practice prompts</p>
            {lesson.exercisePrompts.map((prompt) => (
              <p key={prompt} className="text-sm text-muted-foreground">
                - {prompt}
              </p>
            ))}
          </div>

          <div className="rounded-md border p-4">
            <p className="text-sm font-medium">Completion check</p>
            <p className="mt-2 text-sm text-muted-foreground">
              Prompt: {lesson.completionCheck.prompt}
            </p>
            <p className="mt-1 text-sm text-muted-foreground">
              Success criteria: {lesson.completionCheck.successCriteria}
            </p>
          </div>

          <LearnLessonProgress
            courseSlug={course.slug}
            lesson={lesson}
            nextLessonSlug={nextLesson?.slug ?? null}
          />

          <div className="flex flex-wrap gap-2">
            {previousLesson ? (
              <Button asChild variant="outline">
                <Link
                  href={`/learn/courses/${course.slug}/${previousLesson.slug}`}
                >
                  Previous lesson
                </Link>
              </Button>
            ) : null}
            {nextLesson ? (
              <Button asChild variant="outline">
                <Link href={`/learn/courses/${course.slug}/${nextLesson.slug}`}>
                  Next lesson
                </Link>
              </Button>
            ) : null}
          </div>
        </CardContent>
      </Card>

      <Card className="border">
        <CardHeader>
          <CardTitle>Related snippets</CardTitle>
          <CardDescription>
            Apply this lesson immediately with snippets tied to the same course.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          {relatedSnippets.length === 0 ? (
            <p className="text-sm text-muted-foreground">
              Related snippets are being prepared.
            </p>
          ) : (
            relatedSnippets.slice(0, 3).map((snippet) => (
              <div key={snippet.slug} className="rounded-md border p-3">
                <p className="font-medium">{snippet.title}</p>
                <p className="text-sm text-muted-foreground mt-1">
                  {snippet.scenario}
                </p>
                <div className="mt-2">
                  <Button asChild size="sm" variant="outline">
                    <Link href="/learn/playbooks">Open snippet library</Link>
                  </Button>
                </div>
              </div>
            ))
          )}
        </CardContent>
      </Card>
    </div>
  );
}

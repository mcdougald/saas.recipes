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
import { GuideRelatedSnippetLinks } from "@/features/learn/components/guide-related-snippet-links";
import { LearnUpgradeLink } from "@/features/learn/components/learn-upgrade-link";
import { type Course } from "@/features/learn/data/courses";
import { type Guide } from "@/features/learn/data/guides";
import { type Snippet } from "@/features/learn/data/snippets";

interface GuideDetailPageProps {
  guide: Guide;
  relatedSnippets: Snippet[];
  relatedCourses: Course[];
}

/**
 * Render one guide detail page with implementation steps and related learning.
 *
 * @param props - Guide detail payload resolved from learn data catalogs.
 * @returns Guide content, related snippets, and related courses.
 */
export function GuideDetailPage({
  guide,
  relatedSnippets,
  relatedCourses,
}: GuideDetailPageProps) {
  const shouldShowPremiumPreview =
    guide.isPremium && guide.previewDepth !== "full";
  const visibleSteps = shouldShowPremiumPreview
    ? guide.implementationSteps.slice(
        0,
        Math.max(1, Math.floor(guide.implementationSteps.length / 2)),
      )
    : guide.implementationSteps;

  return (
    <div className="@container/main space-y-6 px-4 pb-6 lg:px-6">
      <Card className="border">
        <CardHeader className="space-y-3">
          <div className="flex flex-wrap items-center gap-2">
            <Badge variant="secondary">
              {guide.estimatedReadMinutes} min read
            </Badge>
            {guide.isPremium ? (
              <Badge variant="outline" className="gap-1">
                <LockKeyhole aria-hidden className="size-3.5" />
                Premium guide
              </Badge>
            ) : null}
          </div>
          <CardTitle>{guide.title}</CardTitle>
          <CardDescription>{guide.problem}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="rounded-md border p-4">
            <p className="text-sm font-medium">Outcome</p>
            <p className="mt-2 text-sm text-muted-foreground">
              {guide.outcome}
            </p>
          </div>

          <div className="space-y-3">
            <p className="text-sm font-medium">Implementation steps</p>
            {visibleSteps.map((step) => (
              <div key={step.title} className="rounded-md border p-4">
                <p className="font-medium">{step.title}</p>
                <p className="mt-2 text-sm text-muted-foreground">
                  Action: {step.action}
                </p>
                <p className="mt-1 text-sm text-muted-foreground">
                  Expected result: {step.expectedResult}
                </p>
              </div>
            ))}
          </div>

          {shouldShowPremiumPreview ? (
            <div className="rounded-md border border-dashed p-4 text-sm text-muted-foreground">
              This premium guide shows a starter preview. Upgrade for the full
              implementation steps and full checklist details.
              <div className="mt-3">
                <LearnUpgradeLink
                  source="guide_preview_gate"
                  label="Unlock full guide"
                  size="sm"
                />
              </div>
            </div>
          ) : null}
        </CardContent>
      </Card>

      <Card className="border">
        <CardHeader>
          <CardTitle>Related snippets</CardTitle>
          <CardDescription>
            Apply this guide faster with implementation-aligned snippets.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          {relatedSnippets.length === 0 ? (
            <p className="text-sm text-muted-foreground">
              Snippets for this guide are coming soon.
            </p>
          ) : (
            <>
              {relatedSnippets.map((snippet) => (
                <div key={snippet.slug} className="rounded-md border p-3">
                  <p className="font-medium">{snippet.title}</p>
                  <p className="mt-1 text-sm text-muted-foreground">
                    {snippet.scenario}
                  </p>
                </div>
              ))}
              <GuideRelatedSnippetLinks
                guideSlug={guide.slug}
                snippetSlugs={relatedSnippets.map((snippet) => snippet.slug)}
              />
            </>
          )}
        </CardContent>
      </Card>

      <Card className="border">
        <CardHeader>
          <CardTitle>Continue learning</CardTitle>
          <CardDescription>
            Jump into a connected course path that reinforces this guide.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          {relatedCourses.length === 0 ? (
            <p className="text-sm text-muted-foreground">
              Related courses are being mapped for this guide.
            </p>
          ) : (
            relatedCourses.map((course) => (
              <div key={course.slug} className="rounded-md border p-3">
                <p className="font-medium">{course.title}</p>
                <p className="mt-1 text-sm text-muted-foreground">
                  {course.summary}
                </p>
                <div className="mt-3">
                  <Button asChild size="sm" variant="outline">
                    <Link href="/learn/courses">Browse courses</Link>
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

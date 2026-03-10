import { ArrowRight, CheckCircle2, LockKeyhole, Sparkles } from "lucide-react";
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
import { LearningTopicExplorer } from "@/features/learn/components/learning-topic-explorer";
import { learningTopics } from "@/features/learn/data/learning-topics";
import { listCurrentUserFavoriteTopicSlugs } from "@/features/learn/server/learn-favorites";

/**
 * Render the learn overview page with premium AI notes positioning.
 */
export async function LearningOverviewPage() {
  const favoriteTopicSlugs = await listCurrentUserFavoriteTopicSlugs();
  const totalWalkthroughs = learningTopics.reduce(
    (count, topic) => count + topic.recipes.length,
    0,
  );
  const totalPremiumModules = learningTopics.reduce(
    (count, topic) => count + topic.premiumContent.length,
    0,
  );

  return (
    <>
      <div className="px-4 py-4 lg:px-6">
        <div className="relative overflow-hidden rounded-xl border bg-card p-6 lg:p-8">
          <div
            aria-hidden
            className="absolute -left-10 top-0 size-40 rounded-full bg-primary/15 blur-3xl"
          />
          <div
            aria-hidden
            className="absolute -bottom-10 right-0 size-44 rounded-full bg-primary/10 blur-3xl"
          />
          <div className="relative flex flex-col gap-5">
            <Badge variant="outline" className="w-fit gap-1.5">
              <Sparkles aria-hidden className="size-3.5" />
              AI-generated notes from real SaaS repos
            </Badge>

            <div className="space-y-2">
              <h1 className="text-2xl font-bold tracking-tight lg:text-3xl">
                SaaS Academy
              </h1>
              <p className="max-w-3xl text-muted-foreground">
                Turn top open-source codebases into clear, actionable learning.
                Get AI-generated implementation notes and latest trend notes so
                your team can ship with current patterns, not stale docs.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <Badge variant="secondary">{learningTopics.length} topics</Badge>
              <Badge variant="secondary">
                {totalWalkthroughs} free recipe walkthroughs
              </Badge>
              <Badge variant="secondary" className="gap-1">
                <LockKeyhole aria-hidden className="size-3.5" />
                {totalPremiumModules} premium modules
              </Badge>
            </div>

            <div className="flex flex-wrap gap-2">
              <Button asChild>
                <Link href="/pricing">
                  Unlock AI notes
                  <ArrowRight aria-hidden className="size-4" />
                </Link>
              </Button>
              <Button asChild variant="outline">
                <Link href="/learn/system-design">
                  Start with system design
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="@container/main space-y-6 px-4 pb-6 lg:px-6">
        <LearningTopicExplorer
          topics={learningTopics}
          favoriteTopicSlugs={favoriteTopicSlugs}
        />

        <div>
          <Card className="border w-fit">
            <CardHeader>
              <CardTitle>Unlock the full academy</CardTitle>
              <CardDescription>
                Premium gives your team structured learning plus continuously
                updated AI insights, not static reading material.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <p className="flex items-start gap-2 text-sm text-muted-foreground">
                  <CheckCircle2
                    aria-hidden
                    className="mt-0.5 size-4 shrink-0 text-primary"
                  />
                  AI-generated notes that summarize architecture, decisions, and
                  implementation steps by topic.
                </p>
                <p className="flex items-start gap-2 text-sm text-muted-foreground">
                  <CheckCircle2
                    aria-hidden
                    className="mt-0.5 size-4 shrink-0 text-primary"
                  />
                  Latest trend notes refreshed from emerging SaaS patterns
                  across production repositories.
                </p>
                <p className="flex items-start gap-2 text-sm text-muted-foreground">
                  <CheckCircle2
                    aria-hidden
                    className="mt-0.5 size-4 shrink-0 text-primary"
                  />
                  Academy paths with weekly milestones and case studies focused
                  on real delivery trade-offs.
                </p>
              </div>

              <Button asChild className="w-full sm:w-auto mt-2">
                <Link href="/pricing">
                  See premium plans
                  <ArrowRight aria-hidden className="size-4" />
                </Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </>
  );
}

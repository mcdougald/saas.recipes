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
import { ArrowRight, CheckCircle2, LockKeyhole, Sparkles } from "lucide-react";
import Link from "next/link";

/**
 * Landing page for the learn feature and premium academy positioning.
 */
export function LearningOverviewPage() {
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
              Learn from production-grade SaaS recipes
            </Badge>

            <div className="space-y-2">
              <h1 className="text-2xl font-bold tracking-tight lg:text-3xl">
                SaaS Academy
              </h1>
              <p className="max-w-3xl text-muted-foreground">
                Build real product intuition through hands-on codebase
                walkthroughs. Academy, notes, guides, and case studies are
                premium modules for teams that want structured implementation
                support.
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
                  Unlock premium learning
                  <ArrowRight aria-hidden className="size-4" />
                </Link>
              </Button>
              <Button asChild variant="outline">
                <Link href="/learn/system-design">Start with system design</Link>
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="@container/main space-y-6 px-4 pb-6 lg:px-6">
        <LearningTopicExplorer topics={learningTopics} />

        <div>
          <Card className="border w-fit">
            <CardHeader>
              <CardTitle>Unlock the full academy</CardTitle>
              <CardDescription>
                Premium gives your team structured modules and implementation
                depth, not just reading material.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <p className="flex items-start gap-2 text-sm text-muted-foreground">
                  <CheckCircle2
                    aria-hidden
                    className="mt-0.5 size-4 shrink-0 text-primary"
                  />
                  Academy paths with weekly milestones and outcomes.
                </p>
                <p className="flex items-start gap-2 text-sm text-muted-foreground">
                  <CheckCircle2
                    aria-hidden
                    className="mt-0.5 size-4 shrink-0 text-primary"
                  />
                  Tactical notes and guides mapped to common SaaS bottlenecks.
                </p>
                <p className="flex items-start gap-2 text-sm text-muted-foreground">
                  <CheckCircle2
                    aria-hidden
                    className="mt-0.5 size-4 shrink-0 text-primary"
                  />
                  Case studies showing real architecture and delivery trade-offs.
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

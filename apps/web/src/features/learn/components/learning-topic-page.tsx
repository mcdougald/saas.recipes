import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import type { LearningTopic } from "@/features/learn/data/learning-topics";
import { ArrowRight, LockKeyhole } from "lucide-react";
import Link from "next/link";

interface LearningTopicPageProps {
  topic: LearningTopic;
}

/**
 * Topic detail screen with free walkthroughs and premium module teasers.
 */
export function LearningTopicPage({ topic }: LearningTopicPageProps) {
  return (
    <>
      <div className="px-4 py-4 lg:px-6">
        <div className="rounded-xl border bg-card p-6 lg:p-7">
          <div className="flex flex-col gap-4">
            <div className="flex flex-wrap gap-2">
              <Badge variant="secondary">{topic.recipes.length} free recipes</Badge>
              <Badge variant="outline" className="gap-1">
                <LockKeyhole aria-hidden className="size-3.5" />
                {topic.premiumContent.length} premium modules
              </Badge>
            </div>

            <div className="space-y-2">
              <h1 className="text-2xl font-bold tracking-tight">{topic.title}</h1>
              <p className="text-muted-foreground">{topic.description}</p>
            </div>

            <div className="flex flex-wrap gap-2">
              <Button asChild size="sm">
                <Link href="/pricing">
                  Unlock premium modules
                  <ArrowRight aria-hidden className="size-4" />
                </Link>
              </Button>
              <Button asChild variant="outline" size="sm">
                <Link href="/learn">Browse all tracks</Link>
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="@container/main space-y-6 px-4 pb-6 lg:px-6">
        <Card className="border">
          <CardHeader>
            <CardTitle>Learning goals</CardTitle>
            <CardDescription>
              Outcomes to focus on while reading recipe codebases.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {topic.goals.map((goal) => (
              <p key={goal} className="text-sm text-muted-foreground">
                - {goal}
              </p>
            ))}
          </CardContent>
        </Card>

        <Card className="border">
          <CardHeader>
            <CardTitle>Free recipe walkthroughs</CardTitle>
            <CardDescription>
              Curated codebase patterns you can start reviewing immediately.
            </CardDescription>
          </CardHeader>
          <CardContent className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {topic.recipes.map((recipe) => (
              <div
                key={recipe.name}
                className="rounded-lg border border-border/70 p-4 space-y-3"
              >
                <div className="space-y-1">
                  <h3 className="font-semibold">{recipe.name}</h3>
                  <Badge variant="outline">{recipe.stack}</Badge>
                </div>
                <p className="text-sm text-muted-foreground">{recipe.focus}</p>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card className="border">
          <CardHeader>
            <CardTitle>Premium modules</CardTitle>
            <CardDescription>
              Academy, notes, guides, and case studies unlock deeper execution
              paths for this topic.
            </CardDescription>
          </CardHeader>
          <CardContent className="grid gap-4 md:grid-cols-2">
            {topic.premiumContent.map((content) => (
              <div
                key={content.title}
                className="rounded-lg border border-primary/20 bg-primary/3 p-4"
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="text-sm font-medium text-foreground">
                      {content.title}
                    </p>
                    <p className="mt-1 text-sm text-muted-foreground">
                      {content.teaser}
                    </p>
                  </div>
                  <Badge variant="outline" className="shrink-0 gap-1">
                    <LockKeyhole aria-hidden className="size-3.5" />
                    {content.kind}
                  </Badge>
                </div>
                <p className="mt-3 text-sm text-muted-foreground">
                  Outcome: {content.outcome}
                </p>
              </div>
            ))}
            <div className="rounded-lg border border-dashed p-4 text-sm text-muted-foreground md:col-span-2">
              Upgrade to unlock every premium module for this topic, including
              structured academy tracks, implementation notes, execution guides,
              and real-world case studies.
              <div className="mt-3">
                <Button asChild size="sm">
                  <Link href="/pricing">View premium plans</Link>
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border">
          <CardHeader>
            <CardTitle>Practice prompts</CardTitle>
            <CardDescription>
              Use these prompts to apply concepts to your own product.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {topic.practicePrompts.map((prompt) => (
              <p key={prompt} className="text-sm text-muted-foreground">
                - {prompt}
              </p>
            ))}
          </CardContent>
        </Card>
      </div>
    </>
  );
}

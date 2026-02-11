import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import type { LearningTopic } from "@/features/learn/data/learning-topics";

export function LearningTopicPage({ topic }: { topic: LearningTopic }) {
  return (
    <>
      <div className="px-4 py-4 lg:px-6">
        <div className="flex flex-col gap-2">
          <h1 className="text-2xl font-bold tracking-tight">{topic.title}</h1>
          <p className="text-muted-foreground">{topic.description}</p>
        </div>
      </div>

      <div className="@container/main space-y-6 px-4 lg:px-6">
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
            <CardTitle>Recipe walkthroughs</CardTitle>
            <CardDescription>
              Curated codebase patterns to analyze and compare.
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

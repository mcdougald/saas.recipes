import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { learningTopics } from "@/features/learn/data/learning-topics";
import Link from "next/link";

const learningCadence = [
  "Pick one concept area and two recipe walkthroughs each week.",
  "Map each recipe pattern to one current bottleneck in your product.",
  "Ship one small change after every study cycle to lock in learning.",
];

export function LearningOverviewPage() {
  return (
    <>
      <div className="px-4 py-4 lg:px-6">
        <div className="flex flex-col gap-2">
          <h1 className="text-2xl font-bold tracking-tight">Recipe Academy</h1>
          <p className="text-muted-foreground">
            Learn core SaaS engineering concepts through real codebase recipes.
          </p>
        </div>
      </div>

      <div className="@container/main space-y-6 px-4 lg:px-6 pb-6">
        <Card className="border">
          <CardHeader>
            <CardTitle>Learning tracks</CardTitle>
            <CardDescription>
              Explore topics by architecture, data, delivery, and security.
            </CardDescription>
          </CardHeader>
          <CardContent className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {learningTopics.map((topic) => (
              <Link key={topic.slug} href={`/learn/${topic.slug}`}>
                <Card className="h-full border-border/70 transition-colors hover:border-primary/40">
                  <CardHeader className="space-y-2">
                    <CardTitle className="text-base">{topic.title}</CardTitle>
                    <CardDescription>{topic.description}</CardDescription>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <Badge variant="outline">
                      {topic.recipes.length} recipe walkthroughs
                    </Badge>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </CardContent>
        </Card>

        <Card className="border">
          <CardHeader>
            <CardTitle>Suggested cadence</CardTitle>
            <CardDescription>
              A practical weekly system for turning recipes into shipped outcomes.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {learningCadence.map((item) => (
              <p key={item} className="text-sm text-muted-foreground">
                - {item}
              </p>
            ))}
          </CardContent>
        </Card>
      </div>
    </>
  );
}

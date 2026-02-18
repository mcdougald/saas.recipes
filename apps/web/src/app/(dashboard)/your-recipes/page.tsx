import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Heart, Import, ListChecks, Sparkles } from "lucide-react";

const implementationTracks = [
  {
    title: "Repository Import",
    status: "Planned",
    icon: Import,
    description:
      "Connect GitHub repositories and generate recipe workspaces from real codebases.",
    bullets: [
      "Import with owner/name, full URL, or quick-pick from recently starred repos.",
      "Run metadata sync for stack, package manager, stars, activity, and deployment health.",
      "Auto-create recipe cards with links to dashboard views, tasks, and AI Chef prompts.",
    ],
  },
  {
    title: "Favorites Workspace",
    status: "In Design",
    icon: Heart,
    description: "Save promising recipes and pin them into your build queue.",
    bullets: [
      "Favorite from dashboard cards, learn pages, and future repo detail screens.",
      "Create lightweight collections like 'Billing', 'Auth', and 'Onboarding patterns'.",
      "Track readiness states: watching, implementing, and shipped.",
    ],
  },
] as const;

const importFlow = [
  {
    step: "Step 1",
    title: "Connect source",
    detail: "Add a repo URL or choose from a GitHub picker.",
  },
  {
    step: "Step 2",
    title: "Analyze repository",
    detail: "Run the same repository signals used in the Explore dashboards.",
  },
  {
    step: "Step 3",
    title: "Create recipe workspace",
    detail: "Generate a recipe card, suggested tasks, and AI Chef starter prompts.",
  },
] as const;

const favoritesSignals = [
  "Priority score",
  "Last viewed",
  "Implementation status",
  "Team notes",
  "Linked tasks",
  "Source type",
] as const;

export default function YourRecipesPage() {
  return (
    <>
      <div className="px-4 py-4 lg:px-6">
        <div className="flex flex-col gap-2">
          <h1 className="text-2xl font-bold tracking-tight">Your Recipes</h1>
          <p className="text-muted-foreground max-w-3xl">
            This page will become your private build queue. The next release focuses on
            importing repositories as reusable recipes and organizing favorites into an
            execution-ready workflow.
          </p>
        </div>
      </div>

      <div className="@container/main space-y-6 px-4 pb-6 lg:px-6">
        <div className="grid gap-4 md:grid-cols-2">
          {implementationTracks.map((track) => {
            const Icon = track.icon;

            return (
              <Card key={track.title} className="border">
                <CardHeader className="space-y-3">
                  <div className="flex items-center justify-between gap-3">
                    <CardTitle className="inline-flex items-center gap-2 text-base">
                      <Icon className="size-4" />
                      {track.title}
                    </CardTitle>
                    <Badge variant="secondary">{track.status}</Badge>
                  </div>
                  <CardDescription>{track.description}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-2">
                  {track.bullets.map((item) => (
                    <p key={item} className="text-muted-foreground text-sm leading-relaxed">
                      - {item}
                    </p>
                  ))}
                </CardContent>
              </Card>
            );
          })}
        </div>

        <Card className="border">
          <CardHeader>
            <CardTitle className="inline-flex items-center gap-2 text-base">
              <ListChecks className="size-4" />
              Planned repository import flow
            </CardTitle>
            <CardDescription>
              A short, guided workflow for turning any OSS codebase into a recipe you can act
              on.
            </CardDescription>
          </CardHeader>
          <CardContent className="grid gap-3 md:grid-cols-3">
            {importFlow.map((item) => (
              <div key={item.step} className="bg-muted/40 rounded-lg border p-3">
                <p className="text-xs font-medium tracking-wide uppercase">{item.step}</p>
                <p className="mt-1 text-sm font-semibold">{item.title}</p>
                <p className="text-muted-foreground mt-1 text-sm">{item.detail}</p>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card className="border">
          <CardHeader>
            <CardTitle className="inline-flex items-center gap-2 text-base">
              <Sparkles className="size-4" />
              Favorites data model preview
            </CardTitle>
            <CardDescription>
              These are the signals we plan to show so favorites can move from inspiration to
              implementation.
            </CardDescription>
          </CardHeader>
          <CardContent className="flex flex-wrap gap-2">
            {favoritesSignals.map((signal) => (
              <Badge key={signal} variant="outline">
                {signal}
              </Badge>
            ))}
          </CardContent>
        </Card>
      </div>
    </>
  );
}

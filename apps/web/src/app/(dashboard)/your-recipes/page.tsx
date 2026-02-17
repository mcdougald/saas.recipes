import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

const quickStartSteps = [
  "Add your favorite SaaS recipes to this workspace.",
  "Organize recipes by stack, architecture, or use case.",
  "Use AI Chef to expand each recipe into implementation tasks.",
];

export default function YourRecipesPage() {
  return (
    <>
      <div className="px-4 py-4 lg:px-6">
        <div className="flex flex-col gap-2">
          <h1 className="text-2xl font-bold tracking-tight">Your Recipes</h1>
          <p className="text-muted-foreground">
            Curate and manage the SaaS blueprints you want to build next.
          </p>
        </div>
      </div>

      <div className="@container/main px-4 pb-6 lg:px-6">
        <Card className="border">
          <CardHeader>
            <CardTitle>Recipe Workspace</CardTitle>
            <CardDescription>
              This page is ready for your custom recipe library and workflow.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {quickStartSteps.map((step) => (
              <p key={step} className="text-sm text-muted-foreground">
                - {step}
              </p>
            ))}
          </CardContent>
        </Card>
      </div>
    </>
  );
}

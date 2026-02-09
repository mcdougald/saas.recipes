import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default function ContributorsPage() {
  return (
    <>
      <div className="px-4 lg:px-6 py-4">
        <div className="flex flex-col gap-2">
          <h1 className="text-2xl font-bold tracking-tight">Contributors</h1>
          <p className="text-muted-foreground">
            View project contributors and their activity
          </p>
        </div>
      </div>

      <div className="@container/main px-4 lg:px-6 space-y-6">
        <Card className="border">
          <CardHeader>
            <CardTitle>Contributors</CardTitle>
            <CardDescription>
              Team members and their contributions will be listed here
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground text-sm">
              Add avatars, commit counts, and role or permission info.
            </p>
          </CardContent>
        </Card>
      </div>
    </>
  );
}

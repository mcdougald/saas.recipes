import { DashboardPageHeader } from "@/components/dashboard/page-header";
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
      <DashboardPageHeader
        title="Contributors"
        description="View project contributors and their activity"
      />

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

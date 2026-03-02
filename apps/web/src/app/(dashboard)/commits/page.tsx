import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { DashboardPageHeader } from "@/components/dashboard/page-header";

export default function CommitsPage() {
  return (
    <>
      <DashboardPageHeader
        title="Commits"
        description="Browse and search commit history"
      />

      <div className="@container/main px-4 lg:px-6 space-y-6">
        <Card className="border">
          <CardHeader>
            <CardTitle>Commit history</CardTitle>
            <CardDescription>
              A list of commits will be displayed here
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground text-sm">
              Add a commit log table or list with message, author, date, and branch.
            </p>
          </CardContent>
        </Card>
      </div>
    </>
  );
}

import { DashboardPageHeader } from "@/components/dashboard/page-header";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default function IssuesPage() {
  return (
    <>
      <DashboardPageHeader
        title="Issues"
        description="Track and manage project issues and bug reports"
      />

      <div className="@container/main px-4 lg:px-6 space-y-6">
        <Card className="border">
          <CardHeader>
            <CardTitle>Issues</CardTitle>
            <CardDescription>
              Open and closed issues will be listed here
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground text-sm">
              Add filters by status, assignee, label, and a data table or list
              view.
            </p>
          </CardContent>
        </Card>
      </div>
    </>
  );
}

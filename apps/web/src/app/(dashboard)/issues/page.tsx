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
      <div className="px-4 lg:px-6 py-4">
        <div className="flex flex-col gap-2">
          <h1 className="text-2xl font-bold tracking-tight">Issues</h1>
          <p className="text-muted-foreground">
            Track and manage project issues and bug reports
          </p>
        </div>
      </div>

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
              Add filters by status, assignee, label, and a data table or list view.
            </p>
          </CardContent>
        </Card>
      </div>
    </>
  );
}

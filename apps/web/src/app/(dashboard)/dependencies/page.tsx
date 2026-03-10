import { DashboardPageHeader } from "@/components/dashboard/page-header";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default function DependenciesPage() {
  return (
    <>
      <DashboardPageHeader
        title="Dependencies"
        description="Manage project dependencies and check for updates"
      />

      <div className="@container/main px-4 lg:px-6 space-y-6">
        <Card className="border">
          <CardHeader>
            <CardTitle>Dependencies</CardTitle>
            <CardDescription>
              Package list and version info will be displayed here
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground text-sm">
              Add a table of packages with version, license, and update status.
            </p>
          </CardContent>
        </Card>
      </div>
    </>
  );
}

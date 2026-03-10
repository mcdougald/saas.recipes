import { DashboardPageHeader } from "@/components/dashboard/page-header";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default function AnalyticsPage() {
  return (
    <>
      <DashboardPageHeader
        title="Analytics"
        description="View project metrics, trends, and performance insights"
      />

      <div className="@container/main px-4 lg:px-6 space-y-6">
        <Card className="border">
          <CardHeader>
            <CardTitle>Analytics overview</CardTitle>
            <CardDescription>
              Charts and metrics will be displayed here
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground text-sm">
              Add charts, KPIs, and time-series data to this page.
            </p>
          </CardContent>
        </Card>
      </div>
    </>
  );
}

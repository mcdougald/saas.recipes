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
      <div className="px-4 lg:px-6 py-4">
        <div className="flex flex-col gap-2">
          <h1 className="text-2xl font-bold tracking-tight">Dependencies</h1>
          <p className="text-muted-foreground">
            Manage project dependencies and check for updates
          </p>
        </div>
      </div>

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

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default function CommitsPage() {
  return (
    <>
      <div className="px-4 lg:px-6 py-4">
        <div className="flex flex-col gap-2">
          <h1 className="text-2xl font-bold tracking-tight">Commits</h1>
          <p className="text-muted-foreground">
            Browse and search commit history
          </p>
        </div>
      </div>

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

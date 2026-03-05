import { DashboardPageHeader } from "@/components/dashboard/page-header";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  getHonoApiBaseUrl,
  getHonoProbeTargets,
  probeHonoEndpoint,
} from "@/lib/hono-api";

export const dynamic = "force-dynamic";

/**
 * Render the admin API observability dashboard for `api.saas.recipes`.
 *
 * @returns Server-rendered health and endpoint probe report.
 */
export default async function ApiHealthPage() {
  const targets = getHonoProbeTargets();
  const results = await Promise.all(targets.map((target) => probeHonoEndpoint(target)));
  const successfulCount = results.filter((result) => result.ok).length;
  const failedCount = results.length - successfulCount;
  const averageLatencyMs =
    results.length === 0
      ? 0
      : Math.round(
          results.reduce((accumulator, result) => accumulator + result.latencyMs, 0) /
            results.length,
        );

  return (
    <>
      <DashboardPageHeader
        title="API Monitor"
        description="Health checks and endpoint diagnostics for the Hono API host."
      />

      <div className="@container/main space-y-6 px-4 lg:px-6">
        <div className="grid gap-4 md:grid-cols-3">
          <Card className="border">
            <CardHeader className="space-y-1 pb-2">
              <CardTitle className="text-sm">API Host</CardTitle>
              <CardDescription>Configured Hono server origin</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="font-mono text-xs break-all">{getHonoApiBaseUrl()}</p>
            </CardContent>
          </Card>

          <Card className="border">
            <CardHeader className="space-y-1 pb-2">
              <CardTitle className="text-sm">Healthy Endpoints</CardTitle>
              <CardDescription>2xx probe responses</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-semibold">{successfulCount}</p>
            </CardContent>
          </Card>

          <Card className="border">
            <CardHeader className="space-y-1 pb-2">
              <CardTitle className="text-sm">Average Latency</CardTitle>
              <CardDescription>
                Across all configured probes ({results.length} calls)
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-3">
                <p className="text-2xl font-semibold">{averageLatencyMs} ms</p>
                {failedCount > 0 ? (
                  <Badge variant="destructive">{failedCount} failing</Badge>
                ) : (
                  <Badge variant="secondary">all passing</Badge>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        <Card className="border">
          <CardHeader>
            <CardTitle>Endpoint probes</CardTitle>
            <CardDescription>
              Live request checks from the dashboard server runtime.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Endpoint</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Latency</TableHead>
                  <TableHead>Preview</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {results.map((result) => (
                  <TableRow key={`${result.target.label}:${result.requestPath}`}>
                    <TableCell className="font-medium">
                      {result.target.label}
                      <p className="text-muted-foreground mt-1 font-mono text-xs">
                        {result.requestPath}
                      </p>
                    </TableCell>
                    <TableCell>
                      {result.ok ? (
                        <Badge variant="secondary">
                          {result.status} {result.statusText}
                        </Badge>
                      ) : (
                        <Badge variant="destructive">
                          {result.status ? `${result.status} ${result.statusText}` : "Unavailable"}
                        </Badge>
                      )}
                    </TableCell>
                    <TableCell>{result.latencyMs} ms</TableCell>
                    <TableCell className="text-muted-foreground max-w-[560px] truncate">
                      {result.errorMessage ? `Error: ${result.errorMessage}` : result.bodyPreview}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </>
  );
}

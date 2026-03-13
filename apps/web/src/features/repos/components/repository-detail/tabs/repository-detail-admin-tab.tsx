"use client";

import JsonView from "@uiw/react-json-view";
import { Braces, Check, Copy, Database, FileJson } from "lucide-react";
import { useMemo, useState } from "react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { type RepositoryDashboardListItem } from "@/features/repos/types";
import { type RepositoryDetailModel } from "../repository-detail-utils";

type RepositoryDetailAdminTabProps = {
  project: RepositoryDashboardListItem;
  model: RepositoryDetailModel;
};

/**
 * Render raw repository data for admin and local debugging workflows.
 *
 * @param props - Admin tab props with dashboard projection and normalized model.
 * @returns JSON viewers for source payloads and normalized tab model data.
 */
export function RepositoryDetailAdminTab({
  project,
  model,
}: RepositoryDetailAdminTabProps) {
  const [copiedKey, setCopiedKey] = useState<"project" | "model" | null>(null);
  const projectJson = useMemo(
    () => JSON.stringify(project, null, 2),
    [project],
  );
  const modelJson = useMemo(() => JSON.stringify(model, null, 2), [model]);
  const handleCopy = async (
    key: "project" | "model",
    payload: string,
  ): Promise<void> => {
    try {
      await navigator.clipboard.writeText(payload);
      setCopiedKey(key);
      window.setTimeout(() => setCopiedKey(null), 1500);
    } catch {
      setCopiedKey(null);
    }
  };

  return (
    <div className="space-y-3">
      <Card>
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between gap-2">
            <CardTitle className="inline-flex items-center gap-1 text-base">
              <Database className="size-4" />
              Raw project data
            </CardTitle>
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleCopy("project", projectJson)}
            >
              {copiedKey === "project" ? (
                <>
                  <Check className="size-3.5" />
                  Copied
                </>
              ) : (
                <>
                  <Copy className="size-3.5" />
                  Copy JSON
                </>
              )}
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <ScrollArea className="h-120 rounded-md border bg-muted/10 p-2">
            <JsonView
              value={project}
              collapsed={2}
              displayDataTypes={false}
              displayObjectSize={false}
              className="text-xs"
            />
          </ScrollArea>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between gap-2">
            <CardTitle className="inline-flex items-center gap-1 text-base">
              <Braces className="size-4" />
              Normalized tab model
            </CardTitle>
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleCopy("model", modelJson)}
            >
              {copiedKey === "model" ? (
                <>
                  <Check className="size-3.5" />
                  Copied
                </>
              ) : (
                <>
                  <Copy className="size-3.5" />
                  Copy JSON
                </>
              )}
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <ScrollArea className="h-96 rounded-md border bg-muted/10 p-2">
            <JsonView
              value={model}
              collapsed={2}
              displayDataTypes={false}
              displayObjectSize={false}
              className="text-xs"
            />
          </ScrollArea>
        </CardContent>
      </Card>

      <p className="text-muted-foreground inline-flex items-center gap-1 text-xs">
        <FileJson className="size-3.5" />
        Admin diagnostics include a collapsible JSON viewer and one-click copy.
      </p>
    </div>
  );
}

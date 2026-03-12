"use client";

import { AlertTriangle, RefreshCcw } from "lucide-react";
import { Component, type ErrorInfo, type ReactNode } from "react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

type RepositoryDetailTabErrorBoundaryProps = {
  tabLabel: string;
  children: ReactNode;
};

type RepositoryDetailTabErrorBoundaryState = {
  hasError: boolean;
  errorMessage: string | null;
};

/**
 * Isolate runtime errors to a single repository detail tab.
 *
 * @param props - Boundary props with tab label and tab content.
 * @returns Tab content, or a localized fallback with retry action.
 */
export class RepositoryDetailTabErrorBoundary extends Component<
  RepositoryDetailTabErrorBoundaryProps,
  RepositoryDetailTabErrorBoundaryState
> {
  state: RepositoryDetailTabErrorBoundaryState = {
    hasError: false,
    errorMessage: null,
  };

  static getDerivedStateFromError(
    error: unknown,
  ): RepositoryDetailTabErrorBoundaryState {
    const message =
      error instanceof Error && error.message.length > 0
        ? error.message
        : "Unknown runtime error";
    return {
      hasError: true,
      errorMessage: message,
    };
  }

  componentDidCatch(error: unknown, errorInfo: ErrorInfo): void {
    // Keep tab-level failures discoverable during local debugging.
    console.error("repository-detail tab render error", {
      error,
      errorInfo,
      tabLabel: this.props.tabLabel,
    });
  }

  private handleRetry = (): void => {
    this.setState({
      hasError: false,
      errorMessage: null,
    });
  };

  override render(): ReactNode {
    if (!this.state.hasError) {
      return this.props.children;
    }

    return (
      <Card className="border-dashed border-amber-400/50 bg-amber-500/5">
        <CardHeader>
          <CardTitle className="inline-flex items-center gap-1 text-base">
            <AlertTriangle className="size-4 text-amber-600 dark:text-amber-400" />
            {this.props.tabLabel} failed to render
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <p className="text-muted-foreground text-sm">
            This tab hit a runtime error. You can retry without reloading the
            full page.
          </p>
          {this.state.errorMessage ? (
            <p className="rounded-md border border-amber-300/40 bg-amber-200/10 p-2 font-mono text-xs">
              {this.state.errorMessage}
            </p>
          ) : null}
          <Button type="button" variant="outline" onClick={this.handleRetry}>
            <RefreshCcw className="size-3.5" />
            Retry tab
          </Button>
        </CardContent>
      </Card>
    );
  }
}

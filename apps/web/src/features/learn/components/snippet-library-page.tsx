"use client";

import { CheckCircle2, Copy, LockKeyhole, Search } from "lucide-react";
import Link from "next/link";
import posthog from "posthog-js";
import { useMemo, useState } from "react";
import { toast } from "sonner";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { type Snippet } from "@/features/learn/data/snippets";

interface SnippetLibraryPageProps {
  snippets: Snippet[];
}

/**
 * Render filterable snippet exploration with premium preview behavior.
 *
 * @param props - Snippet catalog rendered by the page route.
 * @returns Interactive snippet cards with filtering and analytics.
 */
export function SnippetLibraryPage({ snippets }: SnippetLibraryPageProps) {
  const [query, setQuery] = useState("");
  const [selectedLevel, setSelectedLevel] = useState<
    "all" | "beginner" | "intermediate" | "advanced"
  >("all");
  const [selectedTag, setSelectedTag] = useState<"all" | string>("all");

  const tags = useMemo(
    () =>
      Array.from(
        new Set(
          snippets.flatMap((snippet) =>
            snippet.tags.map((tag) => tag.trim().toLowerCase()),
          ),
        ),
      ).toSorted((first, second) => first.localeCompare(second)),
    [snippets],
  );

  const visibleSnippets = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();

    return snippets.filter((snippet) => {
      if (snippet.status !== "published") {
        return false;
      }

      if (selectedLevel !== "all" && snippet.level !== selectedLevel) {
        return false;
      }

      if (
        selectedTag !== "all" &&
        !snippet.tags.some(
          (tag) => tag.trim().toLowerCase() === selectedTag.toLowerCase(),
        )
      ) {
        return false;
      }

      if (!normalizedQuery) {
        return true;
      }

      const searchableText = [
        snippet.title,
        snippet.stack,
        snippet.scenario,
        snippet.focus,
        ...snippet.tags,
      ]
        .join(" ")
        .toLowerCase();

      return searchableText.includes(normalizedQuery);
    });
  }, [query, selectedLevel, selectedTag, snippets]);

  async function copySnippet(snippet: Snippet) {
    try {
      await navigator.clipboard.writeText(snippet.code);
      posthog.capture("learn_snippet_copied", {
        snippet_slug: snippet.slug,
        snippet_level: snippet.level,
      });
      toast.success("Snippet copied to clipboard.");
    } catch {
      toast.error("Could not copy snippet.");
    }
  }

  function onUpgradeClick(source: string) {
    posthog.capture("learn_upgrade_intent_clicked", {
      source,
      page_type: "snippets",
    });
  }

  return (
    <div className="@container/main space-y-6 px-4 pb-6 lg:px-6">
      <Card className="border">
        <CardHeader className="space-y-4">
          <div className="space-y-2">
            <CardTitle>Snippet library</CardTitle>
            <CardDescription>
              Filter by level and use-case, then map snippets to full guides and
              lessons.
            </CardDescription>
          </div>
          <label className="relative">
            <Search
              aria-hidden
              className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground"
            />
            <Input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              className="pl-9"
              placeholder="Search snippets by scenario, stack, or tags"
              aria-label="Search snippets"
            />
          </label>
          <div className="flex flex-wrap gap-2">
            {(["all", "beginner", "intermediate", "advanced"] as const).map(
              (level) => (
                <Button
                  key={level}
                  type="button"
                  size="sm"
                  variant={selectedLevel === level ? "default" : "outline"}
                  onClick={() => setSelectedLevel(level)}
                >
                  {level === "all"
                    ? "All levels"
                    : level[0].toUpperCase() + level.slice(1)}
                </Button>
              ),
            )}
          </div>
          <div className="flex flex-wrap gap-2">
            <Button
              type="button"
              size="sm"
              variant={selectedTag === "all" ? "default" : "outline"}
              onClick={() => setSelectedTag("all")}
            >
              All tags
            </Button>
            {tags.map((tag) => (
              <Button
                key={tag}
                type="button"
                size="sm"
                variant={selectedTag === tag ? "default" : "outline"}
                onClick={() => setSelectedTag(tag)}
              >
                {tag}
              </Button>
            ))}
          </div>
        </CardHeader>
      </Card>

      {visibleSnippets.length === 0 ? (
        <Card className="border border-dashed">
          <CardContent className="p-6 text-sm text-muted-foreground">
            No snippets match these filters. Try clearing one filter or using a
            broader search term.
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4 md:grid-cols-2">
          {visibleSnippets.map((snippet) => {
            const showTeaser =
              snippet.isPremium && snippet.previewDepth !== "full";

            return (
              <Card key={snippet.slug} className="border">
                <CardHeader className="space-y-2">
                  <div className="flex items-start justify-between gap-3">
                    <div className="space-y-1">
                      <CardTitle className="text-base">
                        {snippet.title}
                      </CardTitle>
                      <CardDescription>{snippet.scenario}</CardDescription>
                    </div>
                    <Badge variant="outline">{snippet.level}</Badge>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <Badge variant="secondary">{snippet.stack}</Badge>
                    {snippet.isPremium ? (
                      <Badge variant="outline" className="gap-1">
                        <LockKeyhole aria-hidden className="size-3.5" />
                        Premium
                      </Badge>
                    ) : null}
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-sm text-muted-foreground">
                    Focus: {snippet.focus}
                  </p>

                  <pre className="overflow-x-auto rounded-md border bg-muted/40 p-3 text-xs leading-5 text-foreground">
                    <code>
                      {showTeaser
                        ? `${snippet.code.split("\n").slice(0, 4).join("\n")}\n// ...unlock full snippet in premium`
                        : snippet.code}
                    </code>
                  </pre>

                  <div className="space-y-2">
                    <p className="text-sm font-medium">Trade-offs</p>
                    {snippet.tradeoffs.map((tradeoff) => (
                      <p
                        key={tradeoff}
                        className="text-sm text-muted-foreground"
                      >
                        - {tradeoff}
                      </p>
                    ))}
                  </div>

                  <div className="flex flex-wrap gap-2">
                    {snippet.tags.map((tag) => (
                      <Badge key={tag} variant="outline" className="text-xs">
                        {tag}
                      </Badge>
                    ))}
                  </div>

                  <div className="flex flex-wrap gap-2">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => copySnippet(snippet)}
                    >
                      <Copy aria-hidden className="size-4" />
                      Copy snippet
                    </Button>
                    {snippet.relatedGuideSlugs[0] ? (
                      <Button asChild variant="outline">
                        <Link
                          href={`/learn/guides/${snippet.relatedGuideSlugs[0]}`}
                          onClick={() =>
                            posthog.capture(
                              "learn_guide_from_snippet_clicked",
                              {
                                snippet_slug: snippet.slug,
                                guide_slug: snippet.relatedGuideSlugs[0],
                              },
                            )
                          }
                        >
                          Open related guide
                        </Link>
                      </Button>
                    ) : null}
                    {snippet.isPremium ? (
                      <Button
                        asChild
                        onClick={() => onUpgradeClick("snippet_card")}
                      >
                        <Link href="/pricing">Unlock premium</Link>
                      </Button>
                    ) : null}
                  </div>

                  {showTeaser ? (
                    <p className="rounded-md border border-dashed p-3 text-xs text-muted-foreground">
                      This premium snippet shows a safe starter preview. Upgrade
                      to access the full implementation and full anti-pattern
                      notes.
                    </p>
                  ) : (
                    <div className="space-y-2">
                      <p className="text-sm font-medium">
                        Anti-patterns to avoid
                      </p>
                      {snippet.antiPatterns.map((antiPattern) => (
                        <p
                          key={antiPattern}
                          className="flex items-start gap-2 text-sm text-muted-foreground"
                        >
                          <CheckCircle2
                            aria-hidden
                            className="mt-0.5 size-4 shrink-0 text-primary"
                          />
                          {antiPattern}
                        </p>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}

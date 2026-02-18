"use client";

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
import type {
  LearningTopic,
  PremiumContentKind,
} from "@/features/learn/data/learning-topics";
import { premiumContentKinds } from "@/features/learn/data/learning-topics";
import { ArrowUpRight, LockKeyhole, Search } from "lucide-react";
import Link from "next/link";
import { useMemo, useState } from "react";

type SortMode = "featured" | "alphabetical";

const premiumKindLabels: Record<PremiumContentKind, string> = {
  academy: "Academy",
  notes: "Notes",
  guides: "Guides",
  "case-studies": "Case Studies",
};

interface LearningTopicExplorerProps {
  topics: LearningTopic[];
}

/**
 * Interactive catalog for searching and filtering learning topics.
 */
export function LearningTopicExplorer({ topics }: LearningTopicExplorerProps) {
  const [query, setQuery] = useState("");
  const [sortMode, setSortMode] = useState<SortMode>("featured");
  const [selectedPremiumKind, setSelectedPremiumKind] = useState<
    "all" | PremiumContentKind
  >("all");

  const filteredTopics = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();
    const byPremium = topics.filter((topic) => {
      if (selectedPremiumKind === "all") {
        return true;
      }

      return topic.premiumContent.some(
        (content) => content.kind === selectedPremiumKind,
      );
    });

    const byQuery =
      normalizedQuery.length === 0
        ? byPremium
        : byPremium.filter((topic) => {
            const searchableText = [
              topic.title,
              topic.description,
              ...topic.goals,
              ...topic.practicePrompts,
              ...topic.recipes.map((recipe) => recipe.name),
              ...topic.recipes.map((recipe) => recipe.focus),
            ]
              .join(" ")
              .toLowerCase();

            return searchableText.includes(normalizedQuery);
          });

    if (sortMode === "alphabetical") {
      return byQuery.toSorted((a, b) => a.title.localeCompare(b.title));
    }

    return byQuery.toSorted((a, b) => b.recipes.length - a.recipes.length);
  }, [query, selectedPremiumKind, sortMode, topics]);

  return (
    <Card className="border">
      <CardHeader className="space-y-4">
        <div className="space-y-2">
          <CardTitle>Explore learning tracks</CardTitle>
          <CardDescription>
            Search by concepts, compare recipe depth, and preview locked premium
            modules before upgrading.
          </CardDescription>
        </div>

        <div className="grid gap-3 lg:grid-cols-[1fr_auto]">
          <label className="relative">
            <Search
              aria-hidden
              className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground"
            />
            <Input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              className="pl-9"
              placeholder="Search topics, goals, or recipe patterns"
              aria-label="Search learning tracks"
            />
          </label>
          <div className="flex gap-2">
            <Button
              type="button"
              variant={sortMode === "featured" ? "default" : "outline"}
              onClick={() => setSortMode("featured")}
            >
              Featured
            </Button>
            <Button
              type="button"
              variant={sortMode === "alphabetical" ? "default" : "outline"}
              onClick={() => setSortMode("alphabetical")}
            >
              A-Z
            </Button>
          </div>
        </div>

        <div className="flex flex-wrap gap-2">
          <Button
            type="button"
            size="sm"
            variant={selectedPremiumKind === "all" ? "default" : "outline"}
            onClick={() => setSelectedPremiumKind("all")}
          >
            All premium modules
          </Button>
          {premiumContentKinds.map((kind) => (
            <Button
              key={kind}
              type="button"
              size="sm"
              variant={selectedPremiumKind === kind ? "default" : "outline"}
              onClick={() => setSelectedPremiumKind(kind)}
            >
              {premiumKindLabels[kind]}
            </Button>
          ))}
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {filteredTopics.length === 0 ? (
          <div className="rounded-lg border border-dashed p-6 text-sm text-muted-foreground">
            No topics match this filter. Try a broader query or switch premium
            module filters.
          </div>
        ) : (
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {filteredTopics.map((topic) => (
              <Link
                key={topic.slug}
                href={`/learn/${topic.slug}`}
                className="group block"
                aria-label={`Open ${topic.title} topic`}
              >
                <Card className="relative h-full overflow-hidden border-border/70 bg-card dark:bg-muted/90 transition-all duration-300 hover:-translate-y-1 hover:border-primary/45 hover:shadow-lg focus-visible:-translate-y-1 focus-visible:border-primary/45 focus-visible:shadow-lg">
                  <div
                    aria-hidden
                    className="pointer-events-none absolute inset-x-0 top-0 h-16 bg-linear-to-b from-primary/10 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100 group-focus-visible:opacity-100"
                  />
                  <CardHeader className="space-y-3">
                    <div className="flex items-start justify-between gap-3">
                      <CardTitle className="text-base transition-colors duration-200 group-hover:text-primary group-focus-visible:text-primary">
                        {topic.title}
                      </CardTitle>
                      <ArrowUpRight
                        aria-hidden
                        className="mt-0.5 size-4 text-muted-foreground transition-all duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-primary group-focus-visible:translate-x-0.5 group-focus-visible:-translate-y-0.5 group-focus-visible:text-primary"
                      />
                    </div>
                    <CardDescription>{topic.description}</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-3 pt-0">
                    <div className="flex flex-wrap gap-2">
                      <Badge
                        variant="outline"
                        className="transition-colors duration-200 group-hover:border-primary/35 group-focus-visible:border-primary/35"
                      >
                        {topic.recipes.length} walkthroughs
                      </Badge>
                      <Badge
                        variant="outline"
                        className="gap-1 transition-colors duration-200 group-hover:border-primary/35 group-focus-visible:border-primary/35"
                      >
                        <LockKeyhole
                          aria-hidden
                          className="size-3.5 transition-transform duration-300 group-hover:scale-105 group-focus-visible:scale-105"
                        />
                        {topic.premiumContent.length} modules
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground transition-colors duration-200 group-hover:text-foreground/90 group-focus-visible:text-foreground/90">
                      {topic.goals[0]}
                    </p>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}

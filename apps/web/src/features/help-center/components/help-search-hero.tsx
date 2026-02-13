"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { SearchIcon } from "lucide-react";
import { FormEvent } from "react";

/**
 * Props for the help center search hero.
 */
interface HelpSearchHeroProps {
  searchQuery: string;
  suggestedTopics: readonly string[];
  resultCount: number;
  onSearchQueryChange: (query: string) => void;
  onSearchSubmit: (query: string) => void;
}

/**
 * Top search experience for the help center.
 *
 * This component is controlled by parent state so all downstream sections stay
 * synchronized with the current query.
 */
export function HelpSearchHero({
  searchQuery,
  suggestedTopics,
  resultCount,
  onSearchQueryChange,
  onSearchSubmit,
}: HelpSearchHeroProps) {
  const isFiltering = searchQuery.trim().length > 0;

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    onSearchSubmit(searchQuery.trim());
  }

  return (
    <div className="relative overflow-hidden rounded-xl border bg-linear-to-br from-primary/5 via-background to-primary/5 p-8 md:p-12">
      <div className="relative z-10 mx-auto max-w-2xl space-y-6 text-center">
        <h2 className="text-3xl font-bold tracking-tight md:text-4xl">
          How can we help?
        </h2>
        <p className="text-muted-foreground mx-auto max-w-lg text-sm md:text-base">
          Search for guides on recipes, the dashboard, plans, billing, and
          support.
        </p>
        <form className="space-y-3" onSubmit={handleSubmit}>
          <div className="flex gap-2">
            <div className="relative flex-1">
              <SearchIcon className="text-muted-foreground absolute left-3 top-1/2 size-4 -translate-y-1/2" />
              <Input
                type="search"
                placeholder="Search help articles..."
                value={searchQuery}
                onChange={(e) => onSearchQueryChange(e.target.value)}
                className="h-12 pl-10 pr-4"
                aria-label="Search help articles"
              />
            </div>
            <Button type="submit" size="lg" className="h-12 px-6">
              Search
            </Button>
          </div>
          <p className="text-muted-foreground text-xs">
            {isFiltering
              ? `${resultCount} result${resultCount === 1 ? "" : "s"} for "${searchQuery.trim()}"`
              : "Search all categories, articles, and FAQ answers"}
          </p>
        </form>
        <div className="flex flex-wrap items-center justify-center gap-2 text-xs text-muted-foreground">
          <span>Popular:</span>
          {suggestedTopics.map((topic) => (
              <button
                key={topic}
                type="button"
                onClick={() => onSearchSubmit(topic)}
                className="hover:text-foreground rounded-md border bg-background px-2 py-1 transition-colors"
              >
                {topic}
              </button>
            ))}
        </div>
      </div>
    </div>
  );
}

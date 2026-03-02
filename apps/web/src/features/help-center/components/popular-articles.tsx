"use client";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { HelpArticle } from "@/features/help-center/help-center-data";
import { ArrowRight, BookOpen, Clock, TrendingUp } from "lucide-react";
import Link from "next/link";

/**
 * Props for the popular article section.
 */
interface PopularArticlesProps {
  articles: HelpArticle[];
  searchQuery: string;
}

/**
 * Renders popular article cards, filtered by current query.
 */
export function PopularArticles({ articles, searchQuery }: PopularArticlesProps) {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold tracking-tight">
          Popular Articles
          {searchQuery ? (
            <span className="text-muted-foreground ml-2 text-sm font-normal">
              ({articles.length} match{articles.length === 1 ? "" : "es"})
            </span>
          ) : null}
        </h2>
        <Link
          href="/help-center#faq"
          className="text-muted-foreground hover:text-foreground text-sm transition-colors"
        >
          View FAQ →
        </Link>
      </div>

      {articles.length > 0 ? (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {articles.map((article) => (
            <Link key={article.id} href={article.href}>
              <Card className="h-full border-border/70 bg-linear-to-b from-card to-muted/20 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg">
                <CardContent className="flex h-full flex-col gap-3 p-5">
                  <div className="flex items-start justify-between gap-2">
                    <Badge variant="outline" className="h-5 px-2 text-[11px]">
                      {article.category}
                    </Badge>
                    <BookOpen className="text-muted-foreground size-4 shrink-0" />
                  </div>
                  <h3 className="line-clamp-2 text-sm font-semibold leading-snug">
                    {article.title}
                  </h3>
                  <p className="text-muted-foreground line-clamp-2 text-xs">
                    {article.description}
                  </p>
                  <div className="text-muted-foreground mt-auto flex items-center justify-between border-t pt-3 text-xs">
                    <span className="inline-flex items-center gap-1">
                      <Clock className="size-3" />
                      {article.readTime}
                    </span>
                    <span className="inline-flex items-center gap-1">
                      <TrendingUp className="size-3" />
                      {article.views}
                    </span>
                    <ArrowRight className="size-3.5 shrink-0" />
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      ) : (
        <Card className="border-dashed">
          <CardContent className="p-6 text-sm text-muted-foreground">
            No popular articles match{" "}
            <span className="font-medium">&quot;{searchQuery}&quot;</span>.
          </CardContent>
        </Card>
      )}
    </div>
  );
}

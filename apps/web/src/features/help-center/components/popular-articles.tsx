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
    <div className="space-y-6">
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
              <Card className="h-full border transition-all duration-300 hover:scale-[1.02] hover:shadow-lg">
                <CardContent className="flex flex-col gap-4 p-6">
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex-1 space-y-2">
                      <Badge variant="outline" className="text-xs">
                        {article.category}
                      </Badge>
                      <h3 className="font-semibold leading-tight">
                        {article.title}
                      </h3>
                      <p className="text-muted-foreground line-clamp-2 text-sm">
                        {article.description}
                      </p>
                    </div>
                    <BookOpen className="text-muted-foreground size-5 shrink-0" />
                  </div>
                  <div className="flex items-center justify-between border-t pt-4">
                    <div className="flex items-center gap-4 text-xs text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <Clock className="size-3" />
                        {article.readTime}
                      </div>
                      <div className="flex items-center gap-1">
                        <TrendingUp className="size-3" />
                        {article.views} views
                      </div>
                    </div>
                    <ArrowRight className="text-muted-foreground size-4" />
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

"use client";

import {
  ArrowRight,
  BookOpen,
  CreditCard,
  KeyRound,
  MessageSquare,
  Settings,
  Shield,
  Sparkles,
} from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { type HelpCategory } from "@/features/help-center/help-center-data";

const categoryIconMap = {
  sparkles: Sparkles,
  bookOpen: BookOpen,
  settings: Settings,
  creditCard: CreditCard,
  shield: Shield,
  messageSquare: MessageSquare,
  keyRound: KeyRound,
} as const;

/**
 * Props for rendering filtered help center category cards.
 */
interface CategoryCardsProps {
  categories: HelpCategory[];
  searchQuery: string;
  onSelectCategory?: (category: string) => void;
}

/**
 * Category card grid that can react to external search state.
 */
export function CategoryCards({
  categories,
  searchQuery,
  onSelectCategory,
}: CategoryCardsProps) {
  if (categories.length === 0) {
    return (
      <Card className="border-dashed">
        <CardContent className="p-6 text-sm text-muted-foreground">
          No categories match{" "}
          <span className="font-medium">&quot;{searchQuery}&quot;</span>. Try a
          broader term.
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-5">
      <div className="space-y-1">
        <h2 className="text-2xl font-bold tracking-tight">
          Browse by Category
        </h2>
        <p className="text-muted-foreground text-sm">
          Pick a lane and jump to practical guides used to ship real SaaS
          products faster.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {categories.map((category) => {
          const Icon = categoryIconMap[category.icon];
          return (
            <Card
              key={category.id}
              className="h-full py-1 overflow-hidden border-border/70 bg-linear-to-b from-card to-muted/20 transition-all hover:-translate-y-0.5 hover:shadow-lg"
            >
              <CardContent className="p-0 h-full">
                <button
                  type="button"
                  onClick={() => onSelectCategory?.(category.title)}
                  className="group flex h-full w-full flex-col gap-3 p-4 text-left"
                >
                  <div
                    className={`flex size-7 items-center justify-center rounded-lg border ${category.bgColor} ${category.borderColor} transition-transform group-hover:scale-105`}
                  >
                    <Icon className={`size-3.5 ${category.color}`} />
                  </div>
                  <div className="space-y-1">
                    <h3 className="text-sm font-semibold leading-tight">
                      {category.title}
                    </h3>
                    <p className="text-muted-foreground line-clamp-2 text-xs">
                      {category.description}
                    </p>
                  </div>
                  <div className="mt-auto flex items-center justify-between">
                    <Badge variant="secondary" className="h-5 px-2 text-[11px]">
                      {category.articleCount} guides
                    </Badge>
                    <span className="text-muted-foreground inline-flex items-center gap-1 text-xs font-medium">
                      Explore
                      <ArrowRight className="size-3.5 transition-transform group-hover:translate-x-0.5" />
                    </span>
                  </div>
                </button>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}

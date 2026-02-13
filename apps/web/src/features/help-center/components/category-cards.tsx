"use client";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import {
  BookOpen,
  CreditCard,
  KeyRound,
  MessageSquare,
  Settings,
  Shield,
  Sparkles,
} from "lucide-react";
import { HelpCategory } from "@/features/help-center/help-center-data";

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
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {categories.map((category) => {
        const Icon = categoryIconMap[category.icon];
        return (
          <Card
            key={category.id}
            className="group h-full border transition-all hover:shadow-md"
          >
            <CardContent className="flex flex-col gap-4 p-6">
              <div
                className={`flex size-12 items-center justify-center rounded-lg ${category.bgColor} ${category.borderColor} border transition-transform group-hover:scale-110`}
              >
                <Icon className={`size-6 ${category.color}`} />
              </div>
              <div className="space-y-1">
                <h3 className="font-semibold leading-tight">
                  {category.title}
                </h3>
                <p className="text-muted-foreground text-sm">
                  {category.description}
                </p>
              </div>
              <div className="mt-auto">
                <button
                  type="button"
                  onClick={() => onSelectCategory?.(category.title)}
                  className="cursor-pointer"
                >
                  <Badge variant="outline" className="text-xs">
                    {category.articleCount} articles
                  </Badge>
                </button>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}

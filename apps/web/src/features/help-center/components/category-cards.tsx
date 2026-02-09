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

const categories = [
  {
    title: "Getting Started",
    description: "Set up your account and explore saas.recipes",
    icon: Sparkles,
    color: "text-primary",
    bgColor: "bg-primary/10",
    borderColor: "border-primary/20",
    articleCount: 8,
  },
  {
    title: "Recipes & Repositories",
    description: "Browse recipes, repos, and codebase patterns",
    icon: BookOpen,
    color: "text-amber-500",
    bgColor: "bg-amber-500/10",
    borderColor: "border-amber-500/20",
    articleCount: 14,
  },
  {
    title: "Account & Settings",
    description: "Profile, preferences, and security",
    icon: Settings,
    color: "text-blue-500",
    bgColor: "bg-blue-500/10",
    borderColor: "border-blue-500/20",
    articleCount: 6,
  },
  {
    title: "Billing & Subscriptions",
    description: "Plans, payment, and subscription management",
    icon: CreditCard,
    color: "text-emerald-500",
    bgColor: "bg-emerald-500/10",
    borderColor: "border-emerald-500/20",
    articleCount: 10,
  },
  {
    title: "Security & Privacy",
    description: "2FA, passwords, and data security",
    icon: Shield,
    color: "text-red-500",
    bgColor: "bg-red-500/10",
    borderColor: "border-red-500/20",
    articleCount: 7,
  },
  {
    title: "Support & Contact",
    description: "Get help or reach the team",
    icon: MessageSquare,
    color: "text-pink-500",
    bgColor: "bg-pink-500/10",
    borderColor: "border-pink-500/20",
    articleCount: 4,
  },
  {
    title: "API & Developer Docs",
    description: "API access and integration guides",
    icon: KeyRound,
    color: "text-cyan-500",
    bgColor: "bg-cyan-500/10",
    borderColor: "border-cyan-500/20",
    articleCount: 12,
  },
];

export function CategoryCards() {
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {categories.map((category) => {
        const Icon = category.icon;
        return (
          <Card
            key={category.title}
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
                <Badge variant="outline" className="text-xs">
                  {category.articleCount} articles
                </Badge>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}

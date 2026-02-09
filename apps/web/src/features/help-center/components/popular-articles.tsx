"use client";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowRight, BookOpen, Clock, TrendingUp } from "lucide-react";
import Link from "next/link";

const popularArticles = [
  {
    title: "Getting started with saas.recipes",
    description:
      "Sign up, explore recipes and live project demos, and choose the right plan for you.",
    category: "Getting Started",
    readTime: "5 min",
    views: "12.5k",
    href: "/dashboard",
  },
  {
    title: "Understanding plans: Free, Basic, Pro & Enterprise",
    description:
      "What’s included in each plan and how to upgrade or change your subscription.",
    category: "Billing & Subscriptions",
    readTime: "4 min",
    views: "9.1k",
    href: "/pricing",
  },
  {
    title: "Using the dashboard and live projects",
    description:
      "Navigate the dashboard, view live project demos, and use repository recipes.",
    category: "Recipes & Repositories",
    readTime: "6 min",
    views: "8.2k",
    href: "/dashboard",
  },
  {
    title: "Setting up two-factor authentication",
    description:
      "Step-by-step instructions to secure your saas.recipes account with 2FA.",
    category: "Security & Privacy",
    readTime: "3 min",
    views: "15.3k",
    href: "/settings/account",
  },
  {
    title: "Managing billing and payment methods",
    description:
      "Update payment details, view invoices, and manage your subscription.",
    category: "Billing & Subscriptions",
    readTime: "4 min",
    views: "7.4k",
    href: "/payment-dashboard",
  },
  {
    title: "Account settings and preferences",
    description:
      "Update your profile, email, password, and notification preferences.",
    category: "Account & Settings",
    readTime: "4 min",
    views: "6.7k",
    href: "/settings",
  },
];

export function PopularArticles() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold tracking-tight">Popular Articles</h2>
        <Link
          href="/help-center#faq"
          className="text-muted-foreground hover:text-foreground text-sm transition-colors"
        >
          View FAQ →
        </Link>
      </div>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {popularArticles.map((article, index) => (
          <Link key={article.title} href={article.href}>
            <Card className="h-full border transition-all duration-300 hover:shadow-lg hover:scale-[1.02]">
              <CardContent className="flex flex-col gap-4 p-6">
                <div className="flex items-start justify-between gap-2">
                  <div className="flex-1 space-y-2">
                    <Badge variant="outline" className="text-xs">
                      {article.category}
                    </Badge>
                    <h3 className="font-semibold leading-tight">
                      {article.title}
                    </h3>
                    <p className="text-muted-foreground text-sm line-clamp-2">
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
    </div>
  );
}

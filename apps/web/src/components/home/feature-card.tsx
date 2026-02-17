"use client";

import Link from "next/link";
import { ArrowUpRight, Check } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { motion } from "motion/react";

import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

type FeatureCardProps = {
  icon: LucideIcon;
  title: string;
  description: string;
  bullets: readonly [string, string];
  index: number;
};

export function FeatureCard({
  icon: Icon,
  title,
  description,
  bullets,
  index,
}: FeatureCardProps) {
  return (
    <motion.div
      className="h-full"
      initial={{ opacity: 0, y: 8 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.3 }}
      transition={{
        duration: 0.45,
        delay: index * 0.08,
        ease: "easeOut",
      }}
    >
      <Link
        href="/dashboard"
        className="group block h-full rounded-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40 focus-visible:ring-offset-2"
      >
        <Card className="relative h-full overflow-hidden border-border/70 bg-card/90 p-0 backdrop-blur-sm transition-all duration-300 group-hover:-translate-y-1 group-hover:scale-[1.01] group-hover:border-primary/30 group-hover:shadow-xl group-hover:shadow-primary/10 group-focus-visible:-translate-y-1 group-focus-visible:border-primary/30 group-focus-visible:shadow-xl group-focus-visible:shadow-primary/10 active:scale-[0.995]">
          <div className="pointer-events-none absolute inset-0 -z-10 bg-[linear-gradient(120deg,transparent_10%,var(--primary)/14%,transparent_85%)] opacity-0 transition-opacity duration-500 group-hover:opacity-100 group-focus-visible:opacity-100" />
          <div className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(130%_60%_at_0%_0%,var(--primary)/12%,transparent_45%)] opacity-0 transition-opacity duration-300 group-hover:opacity-100 group-focus-visible:opacity-100" />
          <CardHeader className="space-y-3 p-4 sm:p-5">
            <div className="flex items-center gap-2.5">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-primary/20 bg-primary/10 text-primary transition-all duration-300 group-hover:scale-105 group-hover:bg-primary/15 group-hover:text-primary/90 group-focus-visible:scale-105 group-focus-visible:bg-primary/15">
                <Icon
                  className="h-4.5 w-4.5 transition-transform duration-300 group-hover:-rotate-6 group-hover:scale-110 group-focus-visible:-rotate-6 group-focus-visible:scale-110"
                  aria-hidden
                />
              </div>
              <div className="ml-auto flex items-center gap-1.5 text-primary/45 transition-colors duration-300 group-hover:text-primary/80 group-focus-visible:text-primary/80">
                <span className="h-1.5 w-1.5 rounded-full bg-current" />
                <span className="h-1.5 w-1.5 rounded-full bg-current opacity-80" />
                <span className="h-1.5 w-1.5 rounded-full bg-current opacity-60" />
              </div>
              <ArrowUpRight
                className="h-3.5 w-3.5 -translate-x-0.5 translate-y-0.5 text-primary/0 transition-all duration-300 group-hover:translate-x-0 group-hover:translate-y-0 group-hover:text-primary/85 group-focus-visible:translate-x-0 group-focus-visible:translate-y-0 group-focus-visible:text-primary/85"
                aria-hidden
              />
            </div>
            <CardTitle className="text-base font-semibold tracking-tight">
              {title}
            </CardTitle>
            <CardDescription className="text-sm leading-snug text-muted-foreground">
              {description}
            </CardDescription>
            <ul className="space-y-1.5 pt-0.5">
              {bullets.map((bullet) => (
                <li
                  key={bullet}
                  className="flex items-center gap-1.5 rounded-md border border-border/60 bg-muted/35 px-2 py-1 text-xs text-foreground/90 transition-all duration-200 group-hover:border-primary/20 group-hover:bg-primary/6 group-hover:translate-x-0.5 group-focus-visible:border-primary/20 group-focus-visible:bg-primary/6 group-focus-visible:translate-x-0.5"
                >
                  <span className="inline-flex h-3.5 w-3.5 shrink-0 items-center justify-center rounded-full bg-primary/15 text-primary transition-colors duration-200 group-hover:bg-primary/20 group-focus-visible:bg-primary/20">
                    <Check className="h-2.25 w-2.25" aria-hidden />
                  </span>
                  <span>{bullet}</span>
                </li>
              ))}
            </ul>
          </CardHeader>
        </Card>
      </Link>
    </motion.div>
  );
}

"use client";

import {
  Activity,
  CloudCog,
  Code2,
  Database,
  Layers,
  type LucideIcon,
  Paintbrush,
  ServerCog,
  Waypoints,
} from "lucide-react";
import { motion } from "motion/react";
import { useEffect, useState } from "react";

const CARD_CYCLE_INTERVAL_MS = 3800;
const stackLayout = [
  { top: 6, x: 0, rotate: -2.8, scale: 1, zIndex: 30, opacity: 1 },
  { top: 24, x: 10, rotate: 2, scale: 0.975, zIndex: 20, opacity: 0.9 },
  { top: 42, x: -8, rotate: -1.3, scale: 0.95, zIndex: 10, opacity: 0.82 },
] as const;

type RecipeItem = {
  label: string;
  widthClass: string;
};

type RecipeCardSection = {
  title: string;
  icon: LucideIcon;
  items: readonly RecipeItem[];
};

type RecipeCardSkeleton = {
  id: string;
  domain: string;
  repoLabel: string;
  focus: string;
  sections: readonly RecipeCardSection[];
};

const recipeCardSkeletons: readonly RecipeCardSkeleton[] = [
  {
    id: "recipe-card-frontend",
    domain: "Frontend",
    repoLabel: "Repo A",
    focus: "App shell + interaction architecture",
    sections: [
      {
        title: "Design",
        icon: Paintbrush,
        items: [
          { label: "UI system", widthClass: "w-20" },
          { label: "Navigation", widthClass: "w-16" },
          { label: "A11y", widthClass: "w-14" },
          { label: "Motion", widthClass: "w-12" },
        ],
      },
      {
        title: "State & Data",
        icon: Layers,
        items: [
          { label: "Server state", widthClass: "w-18" },
          { label: "Forms", widthClass: "w-14" },
          { label: "Performance", widthClass: "w-16" },
          { label: "Tracking", widthClass: "w-12" },
        ],
      },
    ],
  },
  {
    id: "recipe-card-backend",
    domain: "Backend",
    repoLabel: "Repo B",
    focus: "Service contracts + data correctness",
    sections: [
      {
        title: "Business Logic",
        icon: ServerCog,
        items: [
          { label: "API", widthClass: "w-32" },
          { label: "Jobs", widthClass: "w-28" },
          { label: "Rate limits", widthClass: "w-24" },
          { label: "Webhooks", widthClass: "w-26" },
        ],
      },
      {
        title: "Data Layer",
        icon: Database,
        items: [
          { label: "Schema", widthClass: "w-30" },
          { label: "Caching", widthClass: "w-24" },
          { label: "Integrity", widthClass: "w-20" },
          { label: "Backups", widthClass: "w-22" },
        ],
      },
    ],
  },
  {
    id: "recipe-card-devops",
    domain: "DevOps",
    repoLabel: "Repo C",
    focus: "Delivery pipeline + production guardrails",
    sections: [
      {
        title: "Releases",
        icon: CloudCog,
        items: [
          { label: "CI/CD", widthClass: "w-26" },
          { label: "IaC", widthClass: "w-14" },
          { label: "Rollouts", widthClass: "w-18" },
          { label: "Registry", widthClass: "w-22" },
        ],
      },
      {
        title: "Operations",
        icon: Activity,
        items: [
          { label: "Observability", widthClass: "w-24" },
          { label: "Incident flow", widthClass: "w-20" },
          { label: "Security", widthClass: "w-16" },
          { label: "Cost guard", widthClass: "w-14" },
        ],
      },
    ],
  },
] as const;

type RecipeCardSectionProps = {
  title: string;
  icon: LucideIcon;
  items: readonly RecipeItem[];
};

function RecipeCardSection({
  title,
  icon: Icon,
  items,
}: RecipeCardSectionProps) {
  return (
    <div>
      <p className="mb-1 inline-flex items-center gap-1 font-medium text-muted-foreground/75">
        <Icon className="size-3 text-primary/65" aria-hidden />
        {title}
      </p>
      <ul className="space-y-1">
        {items.map((item, itemIndex) => (
          <li
            key={`${title}-${item.label}-${itemIndex}`}
            className="ml-2 flex items-center gap-1.5"
          >
            <span className="w-16 truncate text-[9px] font-medium text-muted-foreground/75">
              {item.label}
            </span>
            <div
              className={`h-1.5 rounded-full bg-muted/70 ${item.widthClass}`}
            />
          </li>
        ))}
      </ul>
    </div>
  );
}

/**
 * Render stacked cooking-style recipe cards for the hero preview.
 *
 * @returns A subtle animated stack of fullstack domain recipe cards.
 */
export function RecipeCardsPreview() {
  const [cardOrder, setCardOrder] = useState(() =>
    recipeCardSkeletons.map((_, cardIndex) => cardIndex),
  );

  useEffect(() => {
    const intervalId = window.setInterval(() => {
      setCardOrder((currentOrder) => [
        ...currentOrder.slice(1),
        currentOrder[0] ?? 0,
      ]);
    }, CARD_CYCLE_INTERVAL_MS);

    return () => {
      window.clearInterval(intervalId);
    };
  }, []);

  return (
    <div className="z-20 mx-auto mt-6 w-full max-w-3xl px-2" aria-hidden>
      <div className="relative mx-auto h-60 w-full max-w-xl overflow-visible px-1 sm:h-80">
        {cardOrder.map((cardIndex, stackIndex) => {
          const card = recipeCardSkeletons[cardIndex];
          if (!card) return null;
          const layer = stackLayout[stackIndex];

          return (
            <motion.article
              key={card.id}
              className="absolute left-1/2 w-[min(calc(100%-0.5rem),25.5rem)] -translate-x-1/2 rounded-md border border-border/75 bg-background/95 p-3.5 text-left text-[11px] shadow-md shadow-primary/10 backdrop-blur-sm sm:w-[min(calc(100%-0.5rem),24rem)]"
              style={{ zIndex: layer.zIndex }}
              initial={false}
              animate={{
                top: layer.top,
                x: layer.x,
                rotate: layer.rotate,
                scale: layer.scale,
                opacity: layer.opacity,
              }}
              transition={{
                duration: 0.7,
                ease: [0.22, 0.61, 0.36, 1],
              }}
            >
              <div className="mb-2 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <p className="text-[10px] font-medium text-muted-foreground/70">
                    {card.domain}
                  </p>
                  <span className="inline-flex items-center rounded-full border border-border/60 bg-muted/35 px-1.5 py-0.5 text-[8px] font-medium text-muted-foreground/80">
                    <Code2 className="mr-1 size-2.5" aria-hidden />
                    {card.repoLabel}
                  </span>
                </div>
                <span className="inline-flex items-center gap-1 text-[9px] text-muted-foreground/65">
                  <Waypoints className="size-2.5" aria-hidden />
                </span>
              </div>
              <p className="mb-2 text-[9px] text-muted-foreground/65">
                {card.focus}
              </p>

              <div className="grid gap-x-3 gap-y-2.5 sm:grid-cols-2">
                {card.sections.map((section) => (
                  <RecipeCardSection
                    key={`${card.id}-${section.title}`}
                    title={section.title}
                    icon={section.icon}
                    items={section.items}
                  />
                ))}
              </div>
            </motion.article>
          );
        })}
      </div>
    </div>
  );
}

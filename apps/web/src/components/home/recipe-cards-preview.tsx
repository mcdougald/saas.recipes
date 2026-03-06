"use client";

import {
  ListChecks,
  Rocket,
  ShieldCheck,
  ShoppingBasket,
  type LucideIcon,
} from "lucide-react";
import { motion } from "motion/react";
import { useEffect, useState } from "react";

const CARD_CYCLE_INTERVAL_MS = 3800;
const stackLayout = [
  { top: 0, x: 0, rotate: -2.8, scale: 1, zIndex: 30, opacity: 1 },
  { top: 14, x: 10, rotate: 2, scale: 0.975, zIndex: 20, opacity: 0.9 },
  { top: 28, x: -8, rotate: -1.3, scale: 0.95, zIndex: 10, opacity: 0.82 },
] as const;

type SkeletonItem = {
  label: string;
  widthClass: string;
};

type RecipeCardSkeleton = {
  id: string;
  techItems: readonly SkeletonItem[];
  setupItems: readonly SkeletonItem[];
  testingItems: readonly SkeletonItem[];
  deploymentItems: readonly SkeletonItem[];
};

const recipeCardSkeletons: readonly RecipeCardSkeleton[] = [
  {
    id: "recipe-card-1",
    techItems: [
      { label: "UI", widthClass: "w-20" },
      { label: "API", widthClass: "w-24" },
      { label: "DB", widthClass: "w-18" },
    ],
    setupItems: [
      { label: "Init", widthClass: "w-22" },
      { label: "Env", widthClass: "w-20" },
      { label: "Seed", widthClass: "w-18" },
    ],
    testingItems: [
      { label: "Unit", widthClass: "w-22" },
      { label: "E2E", widthClass: "w-18" },
      { label: "A11y", widthClass: "w-20" },
    ],
    deploymentItems: [
      { label: "Build", widthClass: "w-20" },
      { label: "Release", widthClass: "w-24" },
      { label: "Monitor", widthClass: "w-22" },
    ],
  },
  {
    id: "recipe-card-2",
    techItems: [
      { label: "UI", widthClass: "w-18" },
      { label: "Auth", widthClass: "w-24" },
      { label: "Cache", widthClass: "w-22" },
    ],
    setupItems: [
      { label: "Scaffold", widthClass: "w-24" },
      { label: "Config", widthClass: "w-22" },
      { label: "Migrate", widthClass: "w-20" },
    ],
    testingItems: [
      { label: "Smoke", widthClass: "w-20" },
      { label: "Unit", widthClass: "w-22" },
      { label: "Load", widthClass: "w-18" },
    ],
    deploymentItems: [
      { label: "Build", widthClass: "w-18" },
      { label: "Deploy", widthClass: "w-22" },
      { label: "Alerts", widthClass: "w-20" },
    ],
  },
  {
    id: "recipe-card-3",
    techItems: [
      { label: "Web", widthClass: "w-20" },
      { label: "Jobs", widthClass: "w-22" },
      { label: "Logs", widthClass: "w-18" },
    ],
    setupItems: [
      { label: "Install", widthClass: "w-22" },
      { label: "Secrets", widthClass: "w-20" },
      { label: "Roles", widthClass: "w-18" },
    ],
    testingItems: [
      { label: "Lint", widthClass: "w-16" },
      { label: "E2E", widthClass: "w-20" },
      { label: "Perf", widthClass: "w-18" },
    ],
    deploymentItems: [
      { label: "CI", widthClass: "w-14" },
      { label: "Canary", widthClass: "w-22" },
      { label: "Rollout", widthClass: "w-20" },
    ],
  },
] as const;

type RecipeCardSectionProps = {
  title: string;
  icon: LucideIcon;
  items: readonly SkeletonItem[];
};

function RecipeCardSection({ title, icon: Icon, items }: RecipeCardSectionProps) {
  return (
    <div>
      <p className="mb-1 inline-flex items-center gap-1 font-medium text-muted-foreground/75">
        <Icon className="size-3 text-primary/65" aria-hidden />
        {title}
      </p>
      <ul className="space-y-1">
        {items.map((item, itemIndex) => (
          <li key={`${title}-${item.label}-${itemIndex}`} className="flex items-center gap-1.5 ml-2">
            <span className="w-10 text-[9px] font-medium text-muted-foreground/70">
              {item.label}
            </span>
            <div className={`h-1.5 rounded-full bg-muted/70 ${item.widthClass}`} />
          </li>
        ))}
      </ul>
    </div>
  );
}

/**
 * Render stacked cooking-style recipe cards for the hero preview.
 *
 * @returns A subtle animated stack of generic recipe cards.
 */
export function RecipeCardsPreview() {
  const [cardOrder, setCardOrder] = useState(() =>
    recipeCardSkeletons.map((_, cardIndex) => cardIndex)
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
    <div className="mx-auto mt-6 w-full max-w-3xl px-2" aria-hidden>
      <div className="relative mx-auto h-80 w-full max-w-xl">
        {cardOrder.map((cardIndex, stackIndex) => {
          const card = recipeCardSkeletons[cardIndex];
          if (!card) return null;
          const layer = stackLayout[stackIndex];

          return (
            <motion.article
              key={card.id}
              className="absolute left-1/2 w-full max-w-sm -translate-x-1/2 rounded-md border border-border/75 bg-background/95 p-3 text-[11px] text-left shadow-md shadow-primary/10 backdrop-blur-sm"
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
                  <p className="text-[10px] font-medium text-muted-foreground/70">Recipe: </p>
                <div className="h-2 w-18 rounded-full bg-muted/70" />
                </div>
                <div className="h-1.5 w-14 rounded-full bg-muted/55" />
              </div>

              <div className="grid gap-x-2 gap-y-2 sm:grid-cols-2">
                <RecipeCardSection
                  title="Tech"
                  icon={ShoppingBasket}
                  items={card.techItems}
                />
                <RecipeCardSection
                  title="Setup"
                  icon={ListChecks}
                  items={card.setupItems}
                />
                <RecipeCardSection
                  title="Testing"
                  icon={ShieldCheck}
                  items={card.testingItems}
                />
                <RecipeCardSection
                  title="Deployment"
                  icon={Rocket}
                  items={card.deploymentItems}
                />
              </div>
            </motion.article>
          );
        })}
      </div>
    </div>
  );
}

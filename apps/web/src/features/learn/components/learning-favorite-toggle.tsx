"use client";

import { Heart } from "lucide-react";
import { useState, useTransition } from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { toggleLearningTopicFavoriteAction } from "@/features/learn/actions";
import { cn } from "@/lib/utils";

interface LearningFavoriteToggleProps {
  slug: string;
  title: string;
  description: string;
  initialFavorited: boolean;
  className?: string;
}

/**
 * Render a client-side favorite toggle for a learn topic.
 *
 * @param slug - Stable topic slug used as the favorite entity id.
 * @param title - Topic title saved into the favorites workspace.
 * @param description - Topic summary persisted with the favorite row.
 * @param initialFavorited - Initial favorite state resolved on the server.
 * @param className - Optional styles for embedding in different learn layouts.
 * @returns A button that toggles the topic inside the user's favorites workspace.
 */
export function LearningFavoriteToggle({
  slug,
  title,
  description,
  initialFavorited,
  className,
}: LearningFavoriteToggleProps) {
  const [isFavorited, setIsFavorited] = useState(initialFavorited);
  const [isPending, startTransition] = useTransition();

  function handleClick() {
    const optimisticValue = !isFavorited;
    setIsFavorited(optimisticValue);

    startTransition(() => {
      void (async () => {
        try {
          const result = await toggleLearningTopicFavoriteAction({
            slug,
            title,
            description,
          });

          setIsFavorited(result.favorited);
          toast.success(
            result.favorited
              ? "Saved to your favorites workspace."
              : "Removed from your favorites workspace.",
          );
        } catch (error) {
          setIsFavorited(!optimisticValue);
          const message =
            error instanceof Error
              ? error.message
              : "Failed to update favorite.";
          toast.error(message);
        }
      })();
    });
  }

  return (
    <Button
      type="button"
      variant={isFavorited ? "default" : "outline"}
      size="icon-sm"
      className={cn("relative z-10 cursor-pointer", className)}
      aria-pressed={isFavorited}
      aria-label={
        isFavorited
          ? `Remove ${title} from favorites`
          : `Save ${title} to favorites`
      }
      disabled={isPending}
      onClick={handleClick}
    >
      <Heart
        className={cn("size-4", isFavorited && "fill-current")}
        aria-hidden
      />
    </Button>
  );
}

"use client";

import { Check, Monitor, Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const themeOptions = [
  { value: "light", label: "Light", icon: Sun },
  { value: "dark", label: "Dark", icon: Moon },
  { value: "system", label: "System", icon: Monitor },
] as const;

export function ToggleTheme() {
  const { theme, setTheme } = useTheme();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          size="icon"
          className={cn(
            "relative size-9 rounded-full border-border/70 bg-background/90 text-slate-700 shadow-sm transition-colors hover:bg-background",
            "dark:border-white/20 dark:bg-white/10 dark:text-slate-100 dark:hover:bg-white/15",
          )}
        >
          <Sun className="h-[1.1rem] w-[1.1rem] rotate-0 scale-100 text-amber-500 transition-all dark:-rotate-90 dark:scale-0 dark:text-amber-300" />
          <Moon className="absolute h-[1.1rem] w-[1.1rem] rotate-90 scale-0 text-indigo-300 transition-all dark:rotate-0 dark:scale-100 dark:text-indigo-200" />
          <span className="sr-only">Toggle theme</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-44">
        {themeOptions.map((option) => {
          const Icon = option.icon;
          const isActive = theme === option.value;

          return (
            <DropdownMenuItem
              key={option.value}
              onClick={() => setTheme(option.value)}
              className="gap-2"
            >
              <Icon className="h-4 w-4 text-muted-foreground" />
              {option.label}
              {isActive ? <Check className="ml-auto h-4 w-4" /> : null}
            </DropdownMenuItem>
          );
        })}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

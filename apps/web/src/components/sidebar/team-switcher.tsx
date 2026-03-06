"use client";

import { ChevronsUpDown, Plus } from "lucide-react";
import Link from "next/link";
import React, { useState } from "react";
import { SaasRecipesIcon } from "@/components/common/icons/saas-recipes-icon";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";
import { useAuth } from "@/contexts/auth-context";

const TEAM_ICON_PRIMARY_FILL = "#FFFFFF";
const TEAM_ICON_CLOUD_FILL = "#E5E7EB";
const TEAM_ICON_STROKE = "#09090B";

export function TeamSwitcher({
  teams,
}: {
  teams: {
    name: string;
    logo: React.ElementType;
    plan: string;
  }[];
}) {
  const { isMobile, state } = useSidebar();
  const { user } = useAuth();
  const [activeTeam, setActiveTeam] = useState(teams[0]);
  const isCollapsed = state === "collapsed";
  const canAddNewTeam = user?.subscriptionTier === "enterprise";

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton
              size="lg"
              className="group/team relative overflow-hidden data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
            >
              {/* Gradient Logo Container */}
              <div className="relative flex aspect-square size-8 items-center justify-center rounded-lg border border-zinc-200/20 bg-linear-to-br from-zinc-950 via-zinc-800 to-zinc-600 shadow-md shadow-black/35 transition-transform group-hover/team:scale-105">
                <SaasRecipesIcon
                  className="size-4"
                  primaryFill={TEAM_ICON_PRIMARY_FILL}
                  cloudFill={TEAM_ICON_CLOUD_FILL}
                  primaryStroke={TEAM_ICON_STROKE}
                  detailStroke={TEAM_ICON_STROKE}
                  hatLineStroke={TEAM_ICON_STROKE}
                  hatLineFill={TEAM_ICON_STROKE}
                  cloudStroke={TEAM_ICON_STROKE}
                />
                {/* Shine effect */}
                <div className="absolute inset-0 rounded-lg bg-linear-to-br from-white/15 to-transparent" />
              </div>

              {!isCollapsed && (
                <>
                  <div className="grid flex-1 text-left text-sm leading-tight">
                    <span className="truncate font-semibold">
                      {activeTeam.name}
                    </span>
                    <span className="truncate text-xs text-muted-foreground flex items-center gap-1">
                      {activeTeam.plan}
                    </span>
                  </div>
                  <ChevronsUpDown className="ml-auto size-4 text-muted-foreground transition-colors group-hover/team:text-foreground" />
                </>
              )}
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className="w-(--radix-dropdown-menu-trigger-width) min-w-56 rounded-xl border-border/50 bg-background/95 backdrop-blur-xl shadow-xl z-50"
            align="start"
            side={isMobile ? "bottom" : "right"}
            sideOffset={4}
          >
            <DropdownMenuLabel className="text-xs text-muted-foreground uppercase tracking-wider">
              Teams
            </DropdownMenuLabel>
            {teams.map((team, index) => (
              <DropdownMenuItem
                key={team.name}
                onClick={() => setActiveTeam(team)}
                className="gap-3 p-2.5 cursor-pointer rounded-lg transition-colors"
              >
                <div className="flex size-8 items-center justify-center rounded-lg border border-zinc-200/20 bg-linear-to-br from-zinc-950 via-zinc-800 to-zinc-600 shadow-sm shadow-black/30">
                  <SaasRecipesIcon
                    className="size-4"
                    primaryFill={TEAM_ICON_PRIMARY_FILL}
                    cloudFill={TEAM_ICON_CLOUD_FILL}
                    primaryStroke={TEAM_ICON_STROKE}
                    detailStroke={TEAM_ICON_STROKE}
                    hatLineStroke={TEAM_ICON_STROKE}
                    hatLineFill={TEAM_ICON_STROKE}
                    cloudStroke={TEAM_ICON_STROKE}
                  />
                </div>
                <div className="flex-1">
                  <div className="font-medium">{team.name}</div>
                  <div className="text-xs text-muted-foreground">
                    {team.plan}
                  </div>
                </div>
                <DropdownMenuShortcut className="bg-muted px-1.5 py-0.5 rounded text-[10px]">
                  ⌘{index + 1}
                </DropdownMenuShortcut>
              </DropdownMenuItem>
            ))}
            <DropdownMenuSeparator className="bg-border/50" />
            {canAddNewTeam ? (
              <DropdownMenuItem className="gap-3 p-2.5 cursor-pointer rounded-lg">
                <div className="flex size-8 items-center justify-center rounded-lg border border-dashed border-muted-foreground/30 bg-muted/50">
                  <Plus className="size-4 text-muted-foreground" />
                </div>
                <div className="text-muted-foreground font-medium">
                  Add new team
                </div>
              </DropdownMenuItem>
            ) : (
              <div className="rounded-lg border border-border/50 bg-muted/30 p-3 text-xs text-muted-foreground">
                <p>Adding teams requires an enterprise subscription.</p>
                <Link
                  href="/pricing"
                  className="mt-1 inline-flex font-medium text-foreground underline underline-offset-4 hover:text-primary"
                >
                  View pricing
                </Link>
              </div>
            )}
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}

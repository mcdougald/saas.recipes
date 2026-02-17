"use client";

import {
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
  Sidebar as UISidebar,
} from "@/components/ui/sidebar";
import { sidebarData } from "@/constants/sidebar-data";
import { useAuth } from "@/contexts/auth-context";
import { useSidebarConfig } from "@/contexts/sidebar-context";
import React from "react";
import { NavGroup } from "./nav-group";
import { NavUser } from "./nav-user";
import { TeamSwitcher } from "./team-switcher";

/**
 * Primary application sidebar shell used across dashboard routes.
 *
 * Responsibilities:
 * - Applies sidebar presentation settings from `useSidebarConfig`
 *   (variant, collapsible behavior, and side).
 * - Renders the canonical sidebar structure: header, navigation content,
 *   footer user profile, and rail.
 * - Hydrates team and navigation data from `sidebarData`.
 * - Connects authenticated user state to the footer account menu.
 *
 * Intended evolution:
 * This component is the orchestration layer for future sidebar features
 * (for example grouped navigation sections, search/filter UX, and richer
 * contextual panels). Keep leaf UI behavior in child components and keep
 * this component focused on composition and data wiring.
 */
export default function AppSidebar({
  ...props
}: React.ComponentProps<typeof UISidebar>) {
  const { user } = useAuth();
  const { config } = useSidebarConfig();
  const isLocalhost =
    typeof window !== "undefined" &&
    ["localhost", "127.0.0.1", "::1"].includes(window.location.hostname);
  const navGroups = sidebarData.navGroups.filter(
    (nav) => nav.title !== "Admin" || isLocalhost
  );

  return (
    <UISidebar
      variant={config.variant}
      collapsible={config.collapsible}
      side={config.side}
      {...props}
    >
      <SidebarHeader>
        <TeamSwitcher teams={sidebarData.teams} />
      </SidebarHeader>
      <SidebarContent>
        {navGroups.map((nav) => (
          <NavGroup key={nav.title} {...nav} />
        ))}
      </SidebarContent>
      <SidebarFooter>
        {user && (
          <NavUser
            user={{
              name: user.name,
              email: user.email,
              avatar: user.avatar || "",
            }}
          />
        )}
      </SidebarFooter>
      <SidebarRail />
    </UISidebar>
  );
}

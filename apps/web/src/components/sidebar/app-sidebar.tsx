"use client";

import {
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
  Sidebar as UISidebar,
  useSidebar,
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
 * - Toggles the sidebar open state on double-click for quick layout focus.
 * - Expands the sidebar when a resize drag starts while collapsed.
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
  const COLLAPSE_DRAG_THRESHOLD_PX = 24;
  const { onDoubleClick, ...sidebarProps } = props;
  const { user } = useAuth();
  const { isMobile, open, openMobile, setOpen, setOpenMobile } = useSidebar();
  const { config, data, startResizing } = useSidebarConfig();
  const isAdminNavEnabled = user?.admin === true;
  const navGroups = sidebarData.navGroups.filter(
    (nav) => nav.title !== "Admin" || isAdminNavEnabled
  );
  const handleSidebarDoubleClick: React.MouseEventHandler<HTMLDivElement> = (
    event
  ) => {
    onDoubleClick?.(event);
    if (event.defaultPrevented) {
      return;
    }

    if (isMobile) {
      setOpenMobile(!openMobile);
      return;
    }

    setOpen(!open);
  };
  const handleRailPointerDown: React.PointerEventHandler<HTMLButtonElement> = (
    event
  ) => {
    if (!isMobile && !open && event.button === 0) {
      const pointerId = event.pointerId;
      const startX = event.clientX;

      const expandOnDrag = (pointerEvent: PointerEvent) => {
        if (pointerEvent.pointerId !== pointerId) {
          return;
        }

        const deltaX = pointerEvent.clientX - startX;
        const isDraggingOutward =
          config.side === "left" ? deltaX > 0 : deltaX < 0;
        if (!isDraggingOutward) {
          return;
        }

        setOpen(true);
        cleanupExpandListeners();
      };

      const cleanupExpandListeners = () => {
        window.removeEventListener("pointermove", expandOnDrag);
        window.removeEventListener("pointerup", cleanupExpandListeners);
        window.removeEventListener("pointercancel", cleanupExpandListeners);
      };

      window.addEventListener("pointermove", expandOnDrag);
      window.addEventListener("pointerup", cleanupExpandListeners, {
        once: true,
      });
      window.addEventListener("pointercancel", cleanupExpandListeners, {
        once: true,
      });
    }
    if (!isMobile && open && event.button === 0) {
      const pointerId = event.pointerId;
      const startX = event.clientX;

      const collapseOnDrag = (pointerEvent: PointerEvent) => {
        if (pointerEvent.pointerId !== pointerId) {
          return;
        }

        const deltaX = pointerEvent.clientX - startX;
        const isDraggingInward = config.side === "left" ? deltaX < 0 : deltaX > 0;
        if (!isDraggingInward || Math.abs(deltaX) < COLLAPSE_DRAG_THRESHOLD_PX) {
          return;
        }

        setOpen(false);
        cleanupCollapseListeners();
      };

      const cleanupCollapseListeners = () => {
        window.removeEventListener("pointermove", collapseOnDrag);
        window.removeEventListener("pointerup", cleanupCollapseListeners);
        window.removeEventListener("pointercancel", cleanupCollapseListeners);
      };

      window.addEventListener("pointermove", collapseOnDrag);
      window.addEventListener("pointerup", cleanupCollapseListeners, {
        once: true,
      });
      window.addEventListener("pointercancel", cleanupCollapseListeners, {
        once: true,
      });
    }

    startResizing(event);
  };

  return (
    <UISidebar
      variant={config.variant}
      collapsible={config.collapsible}
      side={config.side}
      onDoubleClick={handleSidebarDoubleClick}
      style={
        {
          "--sidebar-width": `${data.width}px`,
        } as React.CSSProperties
      }
      {...sidebarProps}
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
      <SidebarRail
        enableClickToggle={false}
        className={data.isResizing ? "after:bg-sidebar-border" : undefined}
        onPointerDown={handleRailPointerDown}
      />
    </UISidebar>
  );
}

"use client";

import { CommandSearch, SearchTrigger } from "@/components/command-search";
import { Button } from "@/components/ui/button";
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
import { hasAdminAccess } from "@/lib/auth-access";
import { LogIn, Search, UserPlus } from "lucide-react";
import Link from "next/link";
import React from "react";
import { NavGroup } from "./nav-group";
import { NavUser } from "./nav-user";
import { TeamSwitcher } from "./team-switcher";

interface AppSidebarProps extends React.ComponentProps<typeof UISidebar> {
  initialAdminAccess?: boolean;
}

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
 * - Renders footer auth actions when a user session is unavailable.
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
  initialAdminAccess = false,
  ...props
}: AppSidebarProps) {
  const COLLAPSE_DRAG_THRESHOLD_PX = 24;
  const { onDoubleClick, ...sidebarProps } = props;
  const [commandSearchOpen, setCommandSearchOpen] = React.useState(false);
  const { user, isLoading } = useAuth();
  const isAuthenticated = Boolean(user);
  const { isMobile, open, openMobile, setOpen, setOpenMobile } = useSidebar();
  const { config, data, startResizing } = useSidebarConfig();
  const isAdminNavEnabled = initialAdminAccess || hasAdminAccess(user);
  const navGroups = sidebarData.navGroups.filter(
    (nav) => nav.title !== "Admin" || isAdminNavEnabled
  );

  React.useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") {
        event.preventDefault();
        setCommandSearchOpen((isOpen) => !isOpen);
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, []);

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
      <SidebarHeader className="gap-2.5 border-b border-sidebar-border/60 pb-3">
        <TeamSwitcher teams={sidebarData.teams} />
        <div className="group-data-[collapsible=icon]:hidden">
          <SearchTrigger
            onClick={() => setCommandSearchOpen(true)}
            className="w-full min-w-0 md:w-full lg:w-full"
          />
        </div>
        <div className="hidden group-data-[collapsible=icon]:block">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setCommandSearchOpen(true)}
            className="size-8 rounded-md border border-sidebar-border/60 bg-sidebar-accent/45"
            aria-label="Open command search"
          >
            <Search className="size-4" />
          </Button>
        </div>
        <CommandSearch
          open={commandSearchOpen}
          onOpenChange={setCommandSearchOpen}
        />
      </SidebarHeader>
      <SidebarContent>
        {navGroups.map((nav) => (
          <NavGroup key={nav.title} {...nav} isAuthenticated={isAuthenticated} />
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
        {!user && !isLoading && (
          <>
            <div className="group-data-[collapsible=icon]:hidden">
              <div className="rounded-md border border-sidebar-border/60 bg-sidebar-accent/35 p-3 shadow-xs">
                <p className="text-xs font-semibold text-sidebar-foreground">
                  Welcome back
                </p>
                <p className="mt-1 text-[11px] leading-relaxed text-muted-foreground">
                  Sign-in to unlock your personalized dashboard and saved recipes.
                </p>
                <div className="mt-3 grid gap-2">
                  <Button asChild size="sm" className="w-full shadow-sm">
                    <Link href="/sign-in">Sign-in</Link>
                  </Button>
                  <Button asChild variant="outline" size="sm" className="w-full bg-background/70">
                    <Link href="/sign-up">Create account</Link>
                  </Button>
                </div>
              </div>
            </div>
            <div className="hidden flex-col items-center gap-2 group-data-[collapsible=icon]:flex">
              <Button
                asChild
                variant="ghost"
                size="icon"
                className="size-8 rounded-md border border-sidebar-border/60 bg-sidebar-accent/45"
              >
                <Link href="/sign-in" aria-label="Sign-in">
                  <LogIn className="size-4" />
                </Link>
              </Button>
              <Button
                asChild
                variant="ghost"
                size="icon"
                className="size-8 rounded-md border border-sidebar-border/60 bg-sidebar-accent/45"
              >
                <Link href="/sign-up" aria-label="Sign up">
                  <UserPlus className="size-4" />
                </Link>
              </Button>
            </div>
          </>
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

"use client";

import { ChevronRight } from "lucide-react";
import { usePathname } from "next/navigation";
import React from "react";

import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  useSidebar,
} from "@/components/ui/sidebar";
import {
  type NavCollapsible,
  type NavGroup as NavGroupData,
  type NavItem,
  type NavLink,
} from "@/lib/types";
import { cn } from "@/lib/utils";
import { getGroupToneClass } from "./nav-group.styles";
import { checkIsGroupActive, checkIsLocked } from "./nav-group.utils";
import {
  SidebarMenuCollapsedDropdown,
  SidebarMenuCollapsible,
  SidebarMenuLink,
  SidebarMenuLockedItem,
} from "./nav-group-items";

/**
 * Renderable nav group props for the left application sidebar.
 */
export interface NavGroupProps extends NavGroupData {
  /**
   * Whether the current viewer has an authenticated session.
   */
  isAuthenticated: boolean;
  /**
   * Position index used for subtle visual section variation.
   */
  groupIndex: number;
}

function isNavLink(item: NavItem): item is NavLink {
  return "url" in item && item.url !== undefined;
}

function isNavCollapsible(item: NavItem): item is NavCollapsible {
  return "items" in item && Array.isArray(item.items);
}

/**
 * Render a titled navigation section in the sidebar.
 *
 * @param props - Group metadata and navigation items to render.
 * @param props.isAuthenticated - Indicates whether the current user is signed in.
 * @param props.groupIndex - Zero-based position of this group in the sidebar list.
 * @returns A sidebar group with direct links and collapsible navigation items.
 */
export function NavGroup({
  title,
  items,
  isAuthenticated,
  groupIndex,
}: NavGroupProps) {
  const pathname = usePathname();
  const { state } = useSidebar();
  const isGroupActive = checkIsGroupActive(pathname, items);
  const [isOpen, setIsOpen] = React.useState(
    state === "collapsed" ? true : isGroupActive,
  );

  React.useEffect(() => {
    if (state === "collapsed" || isGroupActive) {
      setIsOpen(true);
    }
  }, [state, isGroupActive]);

  return (
    <Collapsible
      open={isOpen}
      onOpenChange={setIsOpen}
      className="group/nav-group mx-2 rounded-lg group-data-[collapsible=icon]:mx-0"
      disabled={state === "collapsed"}
    >
      <SidebarGroup
        className={cn(
          "mb-2 rounded-lg border px-2 py-1.5 last:mb-0 transition-colors duration-200 hover:border-foreground/25 group-data-[collapsible=icon]:border-transparent group-data-[collapsible=icon]:bg-transparent group-data-[collapsible=icon]:p-0",
          getGroupToneClass(groupIndex),
          isGroupActive &&
            "relative overflow-hidden border-foreground/20 bg-white shadow-[0_1px_2px_hsl(var(--foreground)/0.08)] dark:border-foreground/15 dark:bg-black before:pointer-events-none before:absolute before:inset-0 before:rounded-[inherit] before:p-px before:content-[''] before:[background:conic-gradient(from_0deg,hsl(var(--foreground)/0),hsl(var(--foreground)/0.28),hsl(var(--foreground)/0)_40%)] before:animate-[spin_9s_linear_infinite] before:[mask:linear-gradient(#fff_0_0)_content-box,linear-gradient(#fff_0_0)] before:mask-exclude before:opacity-65",
          groupIndex === 0 && "mt-2",
        )}
      >
        <CollapsibleTrigger asChild>
          <SidebarGroupLabel
            asChild
            className="h-8 px-2 text-[10px] font-semibold uppercase tracking-[0.14em] text-muted-foreground/85 transition-colors group-hover/nav-group:text-foreground hover:text-foreground group-data-[collapsible=icon]:hidden"
          >
            <button
              type="button"
              aria-label={`Toggle ${title} section`}
              className="flex w-full items-center gap-2 rounded-md transition-colors"
            >
              <span className="leading-none transition-colors group-hover/nav-group:text-foreground">
                {title}
              </span>
              <span className="ml-auto rounded-full border border-foreground/10 bg-foreground/4.5 px-1.5 py-0.5 text-[9px] font-medium tracking-widest text-muted-foreground/70 transition-colors group-hover/nav-group:border-foreground/20 group-hover/nav-group:bg-foreground/8 group-hover/nav-group:text-foreground/90">
                {items.length}
              </span>
              <ChevronRight className="size-3.5 text-muted-foreground transition-transform duration-150 group-data-[state=open]/nav-group:rotate-90" />
            </button>
          </SidebarGroupLabel>
        </CollapsibleTrigger>

        <CollapsibleContent className="pt-1">
          <SidebarMenu className="gap-1.5">
            {items.map((item) => {
              const itemUrl = "url" in item && item.url ? item.url : "group";
              const key = `${item.title}-${itemUrl.toString()}`;
              const isLocked = checkIsLocked(item, isAuthenticated);

              if (isLocked) {
                return <SidebarMenuLockedItem key={key} item={item} />;
              }

              if (isNavLink(item)) {
                return (
                  <SidebarMenuLink key={key} item={item} href={pathname} />
                );
              }

              if (!isNavCollapsible(item)) {
                return null;
              }

              if (state === "collapsed") {
                return (
                  <SidebarMenuCollapsedDropdown
                    key={key}
                    item={item}
                    href={pathname}
                  />
                );
              }

              return (
                <SidebarMenuCollapsible key={key} item={item} href={pathname} />
              );
            })}
          </SidebarMenu>
        </CollapsibleContent>
      </SidebarGroup>
    </Collapsible>
  );
}

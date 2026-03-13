"use client";

import { ChevronRight, Lock } from "lucide-react";
import Link from "next/link";
import React from "react";
import { FaLock } from "react-icons/fa";

import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  useSidebar,
} from "@/components/ui/sidebar";
import { type NavCollapsible, type NavItem, type NavLink } from "@/lib/types";
import { cn } from "@/lib/utils";
import {
  MENU_ICON_ACTIVE_CLASS,
  MENU_ICON_BASE_CLASS,
  MENU_ICON_LOCKED_CLASS,
  MENU_ITEM_ACTIVE_CLASS,
  MENU_ITEM_BASE_CLASS,
  MENU_ITEM_LOCKED_CLASS,
} from "./nav-group.styles";
import { checkIsActive } from "./nav-group.utils";
import { NavBadge } from "./nav-group-badge";

interface SidebarMenuLinkProps {
  item: NavLink;
  href: string;
}

interface SidebarMenuCollapsibleProps {
  item: NavCollapsible;
  href: string;
}

interface SidebarMenuLockedItemProps {
  item: NavItem;
}

/**
 * Render a locked menu item that requires authentication.
 *
 * @param props - Locked item display props.
 * @param props.item - Navigation item metadata.
 * @returns Disabled sidebar button with lock affordance.
 */
export function SidebarMenuLockedItem({ item }: SidebarMenuLockedItemProps) {
  const lockedLabel = item.lockedBadge ?? "Sign in";

  return (
    <SidebarMenuItem>
      <SidebarMenuButton
        disabled
        aria-disabled="true"
        tooltip={`${item.title} (sign in required)`}
        className={cn(
          MENU_ITEM_BASE_CLASS,
          MENU_ITEM_LOCKED_CLASS,
          "group-data-[collapsible=icon]:overflow-visible",
        )}
      >
        {item.icon && (
          <item.icon
            className={cn(MENU_ICON_BASE_CLASS, MENU_ICON_LOCKED_CLASS)}
          />
        )}
        <span className="font-medium tracking-tight transition-[font-weight] duration-150 group-hover/link:font-semibold group-data-[collapsible=icon]:hidden">
          {item.title}
        </span>
        <span className="ml-auto text-[10px] font-medium uppercase tracking-[0.12em] text-muted-foreground/80 group-data-[collapsible=icon]:hidden">
          {lockedLabel}
        </span>
        <Lock className="size-1.5 text-muted-foreground/75 group-data-[collapsible=icon]:hidden" />
        <FaLock className="pointer-events-none absolute -top-1.5 -right-1 hidden size-[10px]! text-[#b6b6b6] hover:text-muted-foreground drop-shadow-[0_1px_1px_hsl(var(--background)/0.4)] group-data-[collapsible=icon]:block" />
      </SidebarMenuButton>
    </SidebarMenuItem>
  );
}

/**
 * Render a direct sidebar navigation link.
 *
 * @param props - Link item render props.
 * @param props.item - Link configuration.
 * @param props.href - Current pathname.
 * @returns Sidebar menu item linked with active state styling.
 */
export function SidebarMenuLink({ item, href }: SidebarMenuLinkProps) {
  const { setOpenMobile } = useSidebar();
  const isActive = checkIsActive(href, item);

  return (
    <SidebarMenuItem>
      <SidebarMenuButton
        asChild
        isActive={isActive}
        tooltip={item.title}
        className={cn(MENU_ITEM_BASE_CLASS, isActive && MENU_ITEM_ACTIVE_CLASS)}
      >
        <Link
          href={item.url}
          prefetch={!isActive}
          aria-current={isActive ? "page" : undefined}
          onClick={() => setOpenMobile(false)}
        >
          {item.icon && (
            <item.icon
              className={cn(
                MENU_ICON_BASE_CLASS,
                isActive && MENU_ICON_ACTIVE_CLASS,
              )}
            />
          )}
          <span className="font-medium tracking-tight transition-[font-weight] duration-150 group-hover/link:font-semibold group-data-[collapsible=icon]:hidden">
            {item.title}
          </span>
          {item.badge && (
            <NavBadge color={item.badgeColor}>{item.badge}</NavBadge>
          )}
        </Link>
      </SidebarMenuButton>
    </SidebarMenuItem>
  );
}

/**
 * Render a collapsible sidebar parent item with sub-links.
 *
 * @param props - Collapsible render props.
 * @param props.item - Parent collapsible nav item.
 * @param props.href - Current pathname.
 * @returns Collapsible parent item and nested link list.
 */
export function SidebarMenuCollapsible({
  item,
  href,
}: SidebarMenuCollapsibleProps) {
  const { setOpenMobile } = useSidebar();
  const isActive = checkIsActive(href, item, true);
  const [isOpen, setIsOpen] = React.useState(isActive);

  React.useEffect(() => {
    if (isActive) {
      setIsOpen(true);
    }
  }, [isActive]);

  return (
    <Collapsible
      asChild
      open={isOpen}
      onOpenChange={setIsOpen}
      className="group/collapsible"
    >
      <SidebarMenuItem>
        <CollapsibleTrigger asChild>
          <SidebarMenuButton
            tooltip={item.title}
            className={cn(
              MENU_ITEM_BASE_CLASS,
              isActive && MENU_ITEM_ACTIVE_CLASS,
            )}
          >
            {item.icon && (
              <item.icon
                className={cn(
                  MENU_ICON_BASE_CLASS,
                  isActive && MENU_ICON_ACTIVE_CLASS,
                )}
              />
            )}
            <span className="font-medium tracking-tight transition-[font-weight] duration-150 group-hover/link:font-semibold group-data-[collapsible=icon]:hidden">
              {item.title}
            </span>
            <span className="ml-auto flex items-center gap-1.5 group-data-[collapsible=icon]:hidden">
              {item.badge && (
                <NavBadge color={item.badgeColor}>{item.badge}</NavBadge>
              )}
              <ChevronRight className="size-4 text-muted-foreground transition-transform duration-150 group-data-[state=open]/collapsible:rotate-90" />
            </span>
          </SidebarMenuButton>
        </CollapsibleTrigger>
        <CollapsibleContent className="pt-1">
          <SidebarMenuSub className="ml-3.5 rounded-r-md border-l border-border/55 bg-foreground/1.5">
            {item.items.map((subItem) => {
              const isSubActive = checkIsActive(href, subItem);
              return (
                <SidebarMenuSubItem key={subItem.title}>
                  <SidebarMenuSubButton
                    asChild
                    isActive={isSubActive}
                    className={cn(
                      "group/sub relative overflow-hidden rounded-sm border border-transparent transition-colors duration-150 hover:border-foreground/15 hover:bg-foreground/6 hover:text-foreground",
                      isSubActive &&
                        "border-foreground/25 bg-linear-to-r from-white via-foreground/8 to-foreground/5 text-foreground shadow-[inset_0_1px_0_hsl(var(--background)/0.9),0_3px_10px_hsl(var(--foreground)/0.12)] before:pointer-events-none before:absolute before:inset-0 before:rounded-sm before:bg-linear-to-r before:from-white/20 before:to-transparent dark:from-black dark:via-foreground/12 dark:to-foreground/8 dark:shadow-[inset_0_1px_0_hsl(var(--background)/0.35),0_5px_12px_hsl(var(--background)/0.6)] dark:before:from-white/12",
                    )}
                  >
                    <Link
                      href={subItem.url}
                      prefetch={!isSubActive}
                      aria-current={isSubActive ? "page" : undefined}
                      onClick={() => setOpenMobile(false)}
                    >
                      {subItem.icon && (
                        <subItem.icon
                          className={cn(
                            "size-4 text-muted-foreground transition-colors group-hover/sub:text-foreground",
                            isSubActive && "text-foreground",
                          )}
                        />
                      )}
                      <span className="transition-[font-weight] duration-150 group-hover/sub:font-semibold">
                        {subItem.title}
                      </span>
                      {subItem.badge && (
                        <NavBadge color={subItem.badgeColor}>
                          {subItem.badge}
                        </NavBadge>
                      )}
                    </Link>
                  </SidebarMenuSubButton>
                </SidebarMenuSubItem>
              );
            })}
          </SidebarMenuSub>
        </CollapsibleContent>
      </SidebarMenuItem>
    </Collapsible>
  );
}

/**
 * Render a collapsed-mode dropdown menu for parent items.
 *
 * @param props - Collapsed dropdown render props.
 * @param props.item - Parent collapsible nav item.
 * @param props.href - Current pathname.
 * @returns Dropdown trigger plus flyout child links.
 */
export function SidebarMenuCollapsedDropdown({
  item,
  href,
}: SidebarMenuCollapsibleProps) {
  const isActive = checkIsActive(href, item, true);

  return (
    <SidebarMenuItem>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <SidebarMenuButton
            tooltip={item.title}
            className={cn(
              MENU_ITEM_BASE_CLASS,
              isActive && MENU_ITEM_ACTIVE_CLASS,
            )}
          >
            {item.icon && (
              <item.icon
                className={cn(
                  MENU_ICON_BASE_CLASS,
                  isActive && MENU_ICON_ACTIVE_CLASS,
                )}
              />
            )}
            <span className="font-medium transition-[font-weight] duration-150 group-hover/link:font-semibold group-data-[collapsible=icon]:hidden">
              {item.title}
            </span>
            {item.badge && (
              <NavBadge color={item.badgeColor}>{item.badge}</NavBadge>
            )}
            <ChevronRight className="ml-auto size-4 text-muted-foreground transition-transform duration-150 group-data-[state=open]/collapsible:rotate-90 group-data-[collapsible=icon]:hidden" />
          </SidebarMenuButton>
        </DropdownMenuTrigger>
        <DropdownMenuContent
          side="right"
          align="start"
          sideOffset={4}
          className="min-w-56 rounded-xl border-foreground/15 bg-background/95 p-1 backdrop-blur-xl shadow-xl"
        >
          <DropdownMenuLabel className="flex items-center gap-2 px-2 py-1.5 text-[10px] uppercase tracking-[0.14em] text-muted-foreground">
            {item.title}
            {item.badge && (
              <span className="rounded-full border border-foreground/15 bg-foreground/5 px-1.5 py-0.5 text-[10px] text-foreground/85">
                {item.badge}
              </span>
            )}
          </DropdownMenuLabel>
          <DropdownMenuSeparator className="bg-border/50" />
          {item.items.map((sub) => {
            const isSubActive = checkIsActive(href, sub);
            return (
              <DropdownMenuItem
                key={`${sub.title}-${sub.url}`}
                asChild
                className="rounded-lg px-1 py-0.5 focus:bg-transparent"
              >
                <Link
                  href={sub.url}
                  prefetch={!isSubActive}
                  aria-current={isSubActive ? "page" : undefined}
                  className={cn(
                    "group/drop relative flex items-center gap-2 overflow-hidden rounded-md border border-transparent px-2 py-2 transition-colors hover:border-foreground/25 hover:bg-foreground/8 hover:text-foreground",
                    isSubActive &&
                      "border-foreground/25 bg-linear-to-r from-white via-foreground/8 to-foreground/5 text-foreground shadow-[inset_0_1px_0_hsl(var(--background)/0.9),0_3px_10px_hsl(var(--foreground)/0.12)] before:pointer-events-none before:absolute before:inset-0 before:rounded-md before:bg-linear-to-r before:from-white/20 before:to-transparent dark:from-black dark:via-foreground/12 dark:to-foreground/8 dark:shadow-[inset_0_1px_0_hsl(var(--background)/0.35),0_5px_12px_hsl(var(--background)/0.6)] dark:before:from-white/12",
                  )}
                >
                  {sub.icon && (
                    <sub.icon
                      className={cn(
                        "size-4 text-muted-foreground transition-colors",
                        isSubActive && "text-foreground",
                      )}
                    />
                  )}
                  <span className="max-w-52 text-wrap transition-[font-weight] duration-150 group-hover/drop:font-semibold">
                    {sub.title}
                  </span>
                  {sub.badge && (
                    <span className="ml-auto rounded-full border border-foreground/15 bg-foreground/5 px-1.5 py-0.5 text-xs text-foreground/85">
                      {sub.badge}
                    </span>
                  )}
                </Link>
              </DropdownMenuItem>
            );
          })}
        </DropdownMenuContent>
      </DropdownMenu>
    </SidebarMenuItem>
  );
}

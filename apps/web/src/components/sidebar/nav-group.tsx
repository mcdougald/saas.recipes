"use client";

import { ChevronRight, Lock } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React, { type ReactNode } from "react";

import { Badge } from "@/components/ui/badge";
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
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  useSidebar,
} from "@/components/ui/sidebar";
import {
  type NavCollapsible,
  type NavGroup as NavGroupData,
  type NavItem,
  type NavLink,
} from "@/lib/types";
import { cn } from "@/lib/utils";

const MENU_ITEM_BASE_CLASS =
  "group/link relative overflow-hidden rounded-md border border-transparent transition-colors duration-150 hover:border-foreground/15 hover:bg-foreground/5 hover:text-foreground";

const MENU_ITEM_ACTIVE_CLASS =
  "border-foreground/25 bg-linear-to-r from-foreground/13 via-foreground/9 to-foreground/5 text-foreground shadow-[inset_0_1px_0_hsl(var(--background)/0.78),0_2px_5px_hsl(var(--foreground)/0.12)] before:pointer-events-none before:absolute before:inset-0 before:rounded-md before:bg-linear-to-r before:from-white/16 before:via-white/6 before:to-transparent dark:before:from-white/12 dark:before:via-white/4 dark:before:to-transparent";

const MENU_ICON_BASE_CLASS =
  "transition-colors text-muted-foreground group-hover/link:text-foreground";

const MENU_ICON_ACTIVE_CLASS = "text-foreground";
const MENU_ITEM_LOCKED_CLASS =
  "cursor-not-allowed border-dashed border-foreground/12 text-muted-foreground hover:border-foreground/12 hover:bg-transparent hover:text-muted-foreground";
const MENU_ICON_LOCKED_CLASS = "text-muted-foreground/75";

interface NavGroupProps extends NavGroupData {
  isAuthenticated: boolean;
  groupIndex: number;
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
  const pathName = usePathname();
  const { state } = useSidebar();
  const isGroupActive = checkIsGroupActive(pathName, items);
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
      className="group/nav-group"
      disabled={state === "collapsed"}
    >
      <SidebarGroup
        className={cn(
          "mb-2 rounded-md border border-sidebar-border/50 bg-sidebar-accent/15 px-2 py-1.5 last:mb-0 group-data-[collapsible=icon]:border-transparent group-data-[collapsible=icon]:bg-transparent",
          groupIndex === 0 && "mt-2",
        )}
      >
        <CollapsibleTrigger asChild>
          <SidebarGroupLabel
            asChild
            className="group-data-[collapsible=icon]:hidden h-7 px-2 text-[10px] font-semibold uppercase tracking-[0.14em] text-muted-foreground/80 transition-colors hover:text-foreground"
          >
            <button
              type="button"
              aria-label={`Toggle ${title} section`}
              className="flex w-full items-center gap-2"
            >
              <span>{title}</span>
              <span className="ml-auto text-[9px] font-medium tracking-widest text-muted-foreground/65">
                {items.length}
              </span>
              <ChevronRight className="size-3.5 text-muted-foreground transition-transform duration-150 group-data-[state=open]/nav-group:rotate-90" />
            </button>
          </SidebarGroupLabel>
        </CollapsibleTrigger>
        <CollapsibleContent className="pt-1">
          <SidebarMenu className="gap-1.5">
            {items.map((item) => {
              const key = `${item.title}-${item.url}`;
              const isLocked = checkIsLocked(item, isAuthenticated);

              if (isLocked)
                return <SidebarMenuLockedItem key={key} item={item} />;

              if (!item.items)
                return (
                  <SidebarMenuLink key={key} item={item} href={pathName} />
                );

              if (state === "collapsed")
                return (
                  <SidebarMenuCollapsedDropdown
                    key={key}
                    item={item}
                    href={pathName}
                  />
                );

              return (
                <SidebarMenuCollapsible key={key} item={item} href={pathName} />
              );
            })}
          </SidebarMenu>
        </CollapsibleContent>
      </SidebarGroup>
    </Collapsible>
  );
}

const NavBadge = ({
  children,
}: {
  children: ReactNode;
  color?: "violet" | "green";
}) => {
  return (
    <Badge className="ml-auto rounded-full border border-foreground/15 bg-foreground/5 px-2 py-0.5 text-[10px] font-medium text-foreground/85">
      {children}
    </Badge>
  );
};

const SidebarMenuLockedItem = ({ item }: { item: NavItem }) => {
  return (
    <SidebarMenuItem>
      <SidebarMenuButton
        disabled
        aria-disabled="true"
        tooltip={`${item.title} (sign in required)`}
        className={cn(MENU_ITEM_BASE_CLASS, MENU_ITEM_LOCKED_CLASS)}
      >
        {item.icon && (
          <item.icon
            className={cn(MENU_ICON_BASE_CLASS, MENU_ICON_LOCKED_CLASS)}
          />
        )}
        <span className="font-medium tracking-tight">{item.title}</span>
        <Lock className="ml-auto size-3.5 text-muted-foreground/75" />
      </SidebarMenuButton>
    </SidebarMenuItem>
  );
};

const SidebarMenuLink = ({ item, href }: { item: NavLink; href: string }) => {
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
          <span className="font-medium tracking-tight">{item.title}</span>
          {item.badge && (
            <NavBadge color={item.badgeColor}>{item.badge}</NavBadge>
          )}
        </Link>
      </SidebarMenuButton>
    </SidebarMenuItem>
  );
};

const SidebarMenuCollapsible = ({
  item,
  href,
}: {
  item: NavCollapsible;
  href: string;
}) => {
  const { setOpenMobile } = useSidebar();
  const isActive = checkIsActive(href, item, true);

  return (
    <Collapsible asChild defaultOpen={isActive} className="group/collapsible">
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
            <span className="font-medium tracking-tight">{item.title}</span>
            {item.badge && (
              <NavBadge color={item.badgeColor}>{item.badge}</NavBadge>
            )}
            <ChevronRight className="ml-auto size-4 text-muted-foreground transition-transform duration-150 group-data-[state=open]/collapsible:rotate-90" />
          </SidebarMenuButton>
        </CollapsibleTrigger>
        <CollapsibleContent className="CollapsibleContent pt-1">
          <SidebarMenuSub className="ml-3.5 border-l border-border/55">
            {item.items.map((subItem) => {
              const isSubActive = checkIsActive(href, subItem);
              return (
                <SidebarMenuSubItem key={subItem.title}>
                  <SidebarMenuSubButton
                    asChild
                    isActive={isSubActive}
                    className={cn(
                      "group/sub relative overflow-hidden rounded-sm border border-transparent transition-colors duration-150 hover:border-foreground/10 hover:bg-foreground/5",
                      isSubActive &&
                        "border-foreground/15 bg-foreground/7.5 text-foreground before:pointer-events-none before:absolute before:inset-0 before:rounded-sm before:bg-linear-to-r before:from-white/14 before:to-transparent dark:before:from-white/10",
                    )}
                  >
                    <Link
                      href={subItem.url}
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
                      <span>{subItem.title}</span>
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
};

const SidebarMenuCollapsedDropdown = ({
  item,
  href,
}: {
  item: NavCollapsible;
  href: string;
}) => {
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
            <span className="font-medium">{item.title}</span>
            {item.badge && (
              <NavBadge color={item.badgeColor}>{item.badge}</NavBadge>
            )}
            <ChevronRight className="ml-auto size-4 text-muted-foreground transition-transform duration-150 group-data-[state=open]/collapsible:rotate-90" />
          </SidebarMenuButton>
        </DropdownMenuTrigger>
        <DropdownMenuContent
          side="right"
          align="start"
          sideOffset={4}
          className="min-w-56 rounded-xl border-foreground/15 bg-background/95 p-1 backdrop-blur-xl shadow-xl"
        >
          <DropdownMenuLabel className="flex items-center gap-2 px-2 py-1.5 text-[10px] text-muted-foreground uppercase tracking-[0.14em]">
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
                  aria-current={isSubActive ? "page" : undefined}
                  className={cn(
                    "relative flex items-center gap-2 overflow-hidden rounded-md border border-transparent px-2 py-2 transition-colors hover:border-foreground/10 hover:bg-foreground/5",
                    isSubActive &&
                      "border-foreground/15 bg-foreground/7.5 text-foreground before:pointer-events-none before:absolute before:inset-0 before:rounded-md before:bg-linear-to-r before:from-white/14 before:to-transparent dark:before:from-white/10",
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
                  <span className="max-w-52 text-wrap">{sub.title}</span>
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
};

function checkIsActive(href: string, item: NavItem, mainNav = false) {
  return (
    href === item.url ||
    href.split("?")[0] === item.url ||
    !!item?.items?.filter((i) => i.url === href).length ||
    (mainNav &&
      href.split("/")[1] !== "" &&
      href.split("/")[1] === item?.url?.toString().split("/")[1])
  );
}

function checkIsLocked(item: NavItem, isAuthenticated: boolean) {
  return Boolean(item.requiresAuth && !isAuthenticated);
}

function checkIsGroupActive(href: string, items: NavItem[]) {
  return items.some((item) => checkIsActive(href, item, true));
}

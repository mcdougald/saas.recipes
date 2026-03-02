"use client";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import type { NavCollapsible, NavGroup, NavItem, NavLink } from "@/lib/types";
import { cn } from "@/lib/utils";
import { ChevronRight } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import type { ReactNode } from "react";
import { Badge } from "@/components/ui/badge";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
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

export function NavGroup({ title, items }: NavGroup) {
  const pathName = usePathname();
  const { state } = useSidebar();

  return (
    <SidebarGroup className="px-2 py-1">
      <SidebarGroupLabel className="px-2 text-[10px] font-semibold uppercase tracking-[0.14em] text-muted-foreground/75">
        {title}
      </SidebarGroupLabel>
      <SidebarMenu className="gap-1.5">
        {items.map((item) => {
          const key = `${item.title}-${item.url}`;

          if (!item.items)
            return <SidebarMenuLink key={key} item={item} href={pathName} />;

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
    </SidebarGroup>
  );
}

const NavBadge = ({
  children,
  color = "violet",
}: {
  children: ReactNode;
  color?: "violet" | "green";
}) => {
  const colorClasses =
    color === "green"
      ? "bg-green-500/10 text-green-600 dark:text-green-400"
      : "bg-violet-500/10 text-violet-600 dark:text-violet-400";

  return (
    <Badge
      className={`ml-auto rounded-full border border-transparent px-2 py-0.5 text-[10px] font-medium backdrop-blur-sm ${colorClasses}`}
    >
      {children}
    </Badge>
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
        className={cn(
          "group/link relative rounded-lg transition-all duration-200 hover:bg-accent/65",
          isActive &&
            "bg-primary/12 text-primary shadow-[inset_0_0_0_1px_hsl(var(--primary)/0.18)]",
        )}
      >
        <Link href={item.url} onClick={() => setOpenMobile(false)}>
          {/* Active indicator */}
          {isActive && (
            <div className="absolute left-0 top-1/2 h-5 w-0.5 -translate-y-1/2 rounded-r-full bg-primary" />
          )}
          {item.icon && (
            <item.icon
              className={cn(
                "transition-colors",
                isActive
                  ? "text-primary"
                  : "text-muted-foreground group-hover/link:text-foreground",
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
              "group/link rounded-lg transition-all duration-200 hover:bg-accent/65",
              isActive &&
                "bg-primary/10 text-primary shadow-[inset_0_0_0_1px_hsl(var(--primary)/0.16)]",
            )}
          >
            {item.icon && (
              <item.icon
                className={cn(
                  "transition-colors",
                  isActive
                    ? "text-primary"
                    : "text-muted-foreground group-hover/link:text-foreground",
                )}
              />
            )}
            <span className="font-medium tracking-tight">{item.title}</span>
            {item.badge && (
              <NavBadge color={item.badgeColor}>{item.badge}</NavBadge>
            )}
            <ChevronRight className="ml-auto size-4 text-muted-foreground transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
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
                      "rounded-md transition-all duration-200 hover:bg-accent/60",
                      isSubActive &&
                        "bg-primary/10 text-primary shadow-[inset_0_0_0_1px_hsl(var(--primary)/0.12)]",
                    )}
                  >
                    <Link
                      href={subItem.url}
                      onClick={() => setOpenMobile(false)}
                    >
                      {subItem.icon && <subItem.icon className="size-4" />}
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
              "rounded-lg transition-all duration-200 hover:bg-accent/65",
              isActive &&
                "bg-primary/12 text-primary shadow-[inset_0_0_0_1px_hsl(var(--primary)/0.18)]",
            )}
          >
            {item.icon && (
              <item.icon
                className={cn(
                  isActive
                    ? "text-primary"
                    : "text-muted-foreground",
                )}
              />
            )}
            <span className="font-medium">{item.title}</span>
            {item.badge && (
              <NavBadge color={item.badgeColor}>{item.badge}</NavBadge>
            )}
            <ChevronRight className="ml-auto size-4 text-muted-foreground transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
          </SidebarMenuButton>
        </DropdownMenuTrigger>
        <DropdownMenuContent
          side="right"
          align="start"
          sideOffset={4}
          className="min-w-56 rounded-xl border-border/60 bg-background/95 p-1 backdrop-blur-xl shadow-xl"
        >
          <DropdownMenuLabel className="flex items-center gap-2 px-2 py-1.5 text-[10px] text-muted-foreground uppercase tracking-[0.14em]">
            {item.title}
            {item.badge && (
              <span className="rounded-full bg-primary/12 px-1.5 py-0.5 text-[10px] text-primary">
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
                  className={cn(
                    "flex items-center gap-2 rounded-lg px-2 py-2 transition-colors hover:bg-accent/70",
                    isSubActive &&
                      "bg-primary/10 text-primary",
                  )}
                >
                  {sub.icon && <sub.icon className="size-4" />}
                  <span className="max-w-52 text-wrap">{sub.title}</span>
                  {sub.badge && (
                    <span className="ml-auto rounded-full bg-primary/10 px-1.5 py-0.5 text-xs text-primary">
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

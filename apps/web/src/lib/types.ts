import { type LinkProps } from "next/link";

interface User {
  id: string;
  name: string;
  email: string;
  avatar: string;
  role?: string;
  /**
   * Indicates whether the user has admin privileges.
   */
  admin?: boolean;
  subscriptionTier?: string | null;
}

interface Team {
  name: string;
  logo: React.ElementType;
  plan: string;
}

interface BaseNavItem {
  title: string;
  badge?: string;
  badgeColor?: "violet" | "green";
  icon?: React.ElementType;
  /**
   * Define extra route patterns that should mark this item as active.
   *
   * Supports static paths (for example `/dashboard`) and Next.js-style
   * dynamic segments (for example `/dashboard/[slug]`).
   */
  activeUrls?: string[];
  /**
   * Limit access to authenticated users.
   */
  requiresAuth?: boolean;
  /**
   * Override the badge copy shown while an item is locked.
   */
  lockedBadge?: string;
}

type NavSubItem = BaseNavItem & {
  url: LinkProps["href"];
};

type NavLink = BaseNavItem & {
  url: LinkProps["href"];
  items?: never;
};

type NavCollapsible = BaseNavItem & {
  items: NavSubItem[];
  url?: never;
};

type NavItem = NavCollapsible | NavLink;

interface NavGroup {
  title: string;
  items: NavItem[];
}

interface SidebarData {
  user?: User;
  teams: Team[];
  navGroups: NavGroup[];
}

interface ThemePreset {
  label?: string;
  styles: {
    light: Record<string, string>;
    dark: Record<string, string>;
  };
}

interface ColorTheme {
  name: string;
  value: string;
  preset: ThemePreset;
}

interface SidebarVariant {
  name: string;
  value: "sidebar" | "floating" | "inset";
  description: string;
}

interface SidebarCollapsibleOption {
  name: string;
  value: "offcanvas" | "icon" | "none";
  description: string;
}

interface SidebarSideOption {
  name: string;
  value: "left" | "right";
}

interface RadiusOption {
  name: string;
  value: string;
}

interface BrandColor {
  name: string;
  cssVar: string;
}

interface ImportedTheme {
  light: Record<string, string>;
  dark: Record<string, string>;
}

export type {
  BrandColor,
  ColorTheme,
  ImportedTheme,
  NavCollapsible,
  NavGroup,
  NavItem,
  NavLink,
  NavSubItem,
  RadiusOption,
  SidebarCollapsibleOption,
  SidebarData,
  SidebarSideOption,
  SidebarVariant,
  Team,
  ThemePreset,
  User,
};

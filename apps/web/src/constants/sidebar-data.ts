import type { SidebarData } from "@/lib/types";
import {
  IconBarrierBlock,
  IconBrain,
  IconBrowserCheck,
  IconBug,
  IconCalendar,
  IconChartBar,
  IconChecklist,
  IconCreditCard,
  IconError404,
  IconHelp,
  IconLayoutDashboard,
  IconLock,
  IconLockAccess,
  IconMessages,
  IconNotification,
  IconPackage,
  IconPalette,
  IconServerOff,
  IconSettings,
  IconTool,
  IconUserCog,
  IconUserOff,
  IconUsers,
} from "@tabler/icons-react";
import {
  Blocks,
  BookOpen,
  Database,
  GitCommit,
  KanbanIcon,
  Network,
  Rocket,
  ShieldCheck,
  Workflow,
} from "lucide-react";

export const sidebarData: SidebarData = {
  teams: [
    {
      name: "SaaS.Recipes",
      logo: BookOpen,
      plan: "Default",
    },
  ],
  navGroups: [
    {
      title: "Explore",
      items: [
        {
          title: "Dashboard",
          url: "/dashboard",
          icon: IconLayoutDashboard,
        },
        {
          title: "Analytics",
          url: "/analytics",
          icon: IconChartBar,
        },
        {
          title: "Commits",
          url: "/commits",
          icon: GitCommit,
        },
        {
          title: "Issues",
          url: "/issues",
          icon: IconBug,
        },
        {
          title: "Contributors",
          url: "/contributors",
          icon: IconUsers,
        },
        {
          title: "Dependencies",
          url: "/dependencies",
          icon: IconPackage,
        },
      ],
    },
    {
      title: "Build",
      items: [
        {
          title: "AI Chef",
          url: "/ai-chef",
          icon: IconBrain,
          badge: "New",
          badgeColor: "green",
        },
        {
          title: "Tasks",
          url: "/tasks",
          icon: IconChecklist,
        },
        // {
        //   title: "Users",
        //   url: "/users",
        //   icon: IconUsers,
        // },
        // {
        //   title: "Chats",
        //   url: "/chats",
        //   badge: "3",
        //   icon: IconMessages,
        // },
        // {
        //   title: "Calendar",
        //   url: "/calendar",
        //   icon: IconCalendar,
        // },
        {
          title: "Kanban",
          url: "/kanban",
          icon: KanbanIcon,
          badge: "New",
          badgeColor: "green",
        },
      ],
    },
    {
      title: "Learn",
      items: [
        {
          title: "SaaS Academy",
          url: "/learn",
          icon: BookOpen,
          badge: "New",
          badgeColor: "green",
        },
        {
          title: "Concepts",
          icon: Blocks,
          items: [
            {
              title: "System Design",
              url: "/learn/system-design",
              icon: Network,
            },
            {
              title: "Architecture Patterns",
              url: "/learn/architecture-patterns",
              icon: Workflow,
            },
            {
              title: "Data Modeling",
              url: "/learn/data-modeling",
              icon: Database,
            },
            {
              title: "DevOps & Delivery",
              url: "/learn/devops-delivery",
              icon: Rocket,
            },
            {
              title: "Security Essentials",
              url: "/learn/security-essentials",
              icon: ShieldCheck,
            },
          ],
        },
        {
          title: "Case Studies",
          url: "/learn/case-studies",
          icon: IconChartBar,
        },
        {
          title: "Snippets",
          url: "/learn/playbooks",
          icon: IconChecklist,
        },
      ],
    },
    {
      title: "Admin",
      items: [
        {
          title: "Auth",
          icon: IconLockAccess,
          items: [
            { title: "Sign in", url: "/sign-in" },
            { title: "Sign up", url: "/sign-up" },
            { title: "Forgot password", url: "/forgot-password" },
            { title: "Reset password", url: "/reset-password" },
          ],
        },
        {
          title: "Pricing",
          url: "/pricing",
          icon: IconCreditCard,
        },
        {
          title: "Errors",
          icon: IconBug,
          items: [
            {
              title: "Unauthorized",
              url: "/unauthorized",
              icon: IconLock,
            },
            {
              title: "Forbidden",
              url: "/forbidden",
              icon: IconUserOff,
            },
            {
              title: "Not Found",
              url: "/not-found",
              icon: IconError404,
            },
            {
              title: "Internal Server Error",
              url: "/internal-server-error",
              icon: IconServerOff,
            },
            {
              title: "Maintenance Error",
              url: "/maintenance-error",
              icon: IconBarrierBlock,
            },
          ],
        },
      ],
    },
    {
      title: "Other",
      items: [
        {
          title: "Settings",
          icon: IconSettings,
          items: [
            {
              title: "Profile",
              url: "/settings",
              icon: IconUserCog,
            },
            {
              title: "Account",
              url: "/settings/account",
              icon: IconTool,
            },
            {
              title: "Appearance",
              url: "/settings/appearance",
              icon: IconPalette,
            },
            {
              title: "Notifications",
              url: "/settings/notifications",
              icon: IconNotification,
            },
            {
              title: "Display",
              url: "/settings/display",
              icon: IconBrowserCheck,
            },
          ],
        },
        {
          title: "Help Center",
          url: "/help-center",
          icon: IconHelp,
          badge: "Coming Soon",
        },
      ],
    },
  ],
};

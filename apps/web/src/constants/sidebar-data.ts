import { Icons } from "@/features/discord/components/icons";
import type { SidebarData } from "@/lib/types";
import {
  IconArrowsExchange,
  IconBarrierBlock,
  IconBrain,
  IconBrowserCheck,
  IconBug,
  IconCalendar,
  IconChartBar,
  IconChecklist,
  IconCoin,
  IconCreditCard,
  IconError404,
  IconHelp,
  IconLayoutDashboard,
  IconLock,
  IconLockAccess,
  IconMessages,
  IconNotification,
  IconPalette,
  IconReportMoney,
  IconServerOff,
  IconSettings,
  IconTool,
  IconUserCog,
  IconUserOff,
  IconUsers,
} from "@tabler/icons-react";
import {
  AudioWaveform,
  Command,
  GalleryVerticalEnd,
  KanbanIcon,
  MailIcon,
} from "lucide-react";

export const sidebarData: SidebarData = {
  teams: [
    {
      name: "Shadcn Admin",
      logo: Command,
      plan: "NextJs + ShadcnUI",
    },
    {
      name: "Acme Inc",
      logo: GalleryVerticalEnd,
      plan: "Enterprise",
    },
    {
      name: "Acme Corp.",
      logo: AudioWaveform,
      plan: "Startup",
    },
  ],
  navGroups: [
    {
      title: "Dashboard",
      items: [
        {
          title: "Dashboard",
          url: "/dashboard",
          icon: IconLayoutDashboard,
        },
        {
          title: "Business Dashboard",
          url: "/dashboard2",
          icon: IconChartBar,
        },
        {
          title: "Payment Dashboard",
          icon: IconReportMoney,
          items: [
            {
              title: "Payment Dashboard",
              url: "/payment-dashboard",
              icon: IconCreditCard,
            },
            {
              title: "Payment Transactions",
              url: "/payment-transactions",
              icon: IconArrowsExchange,
            },
          ],
        },
      ],
    },
    {
      title: "General",
      items: [
        {
          title: "Mail",
          url: "/mail",
          icon: MailIcon,
          // badge: "Coming Soon",
          badge: "New",
          badgeColor: "green",
        },
        {
          title: "Discord",
          url: "/discord",
          icon: Icons.discord,
          badge: "New",
          badgeColor: "green",
        },
        {
          title: "Tasks",
          url: "/tasks",
          icon: IconChecklist,
        },
        {
          title: "Users",
          url: "/users",
          icon: IconUsers,
        },
        {
          title: "Chats",
          url: "/chats",
          badge: "3",
          icon: IconMessages,
        },
        {
          title: "Calendar",
          url: "/calendar",
          icon: IconCalendar,
        },
        {
          title: "AI Chef",
          url: "/ai-chef",
          icon: IconBrain,
          badge: "New",
          badgeColor: "green",
        },
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
      title: "Pages",
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
          // badge: "Coming Soon",
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

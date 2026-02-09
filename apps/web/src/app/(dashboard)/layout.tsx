import AppSidebar from "@/components/app-sidebar";
import { DashboardHeader } from "@/components/dashboard-header";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { SidebarConfigProvider } from "@/contexts/sidebar-context";
import { isAuthenticated } from "@/lib/session";
import { redirect } from "next/navigation";
import { Suspense } from "react";

export const dynamic = "force-dynamic";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const authenticated = await isAuthenticated();

  if (!authenticated) {
    redirect("/sign-in");
  }

  return (
    <SidebarConfigProvider>
      <SidebarProvider>
        <AppSidebar />
        <SidebarInset className="min-w-0">
          <Suspense>
            <DashboardHeader />
          </Suspense>
          <div className="flex min-h-0 min-w-0 flex-1 flex-col gap-4 overflow-auto p-4 pt-0">
            {children}
          </div>
        </SidebarInset>
      </SidebarProvider>
    </SidebarConfigProvider>
  );
}

import { DashboardPageHeader } from "@/components/dashboard/page-header";
import { HelpCenterClient } from "@/features/help-center/components/help-center-client";

/**
 * Help center dashboard page.
 */
export default function HelpCenterPage() {
  return (
    <>
      <DashboardPageHeader
        title="Help Center"
        description="Guides for recipes, dashboard, plans, billing, and support"
      />

      <div className="@container/main px-4 lg:px-6 space-y-8 pb-8">
        <HelpCenterClient />
      </div>
    </>
  );
}

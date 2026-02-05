import { Sidebar, MobileNav } from "@/components/dashboard/sidebar"
import { RightSidebar } from "@/components/dashboard/right-sidebar"

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="grid min-h-screen w-full md:grid-cols-[220px_1fr] lg:grid-cols-[280px_1fr_320px] xl:grid-cols-[280px_1fr_360px]">
      {/* Left Sidebar */}
      <div className="hidden border-r bg-muted/40 md:block">
        <Sidebar />
      </div>
      
      {/* Main Content */}
      <div className="flex flex-col">
        <MobileNav />
        <main className="flex flex-1 flex-col gap-4 p-4 lg:gap-6 lg:p-6 overflow-auto">
          {children}
        </main>
      </div>

      {/* Right Sidebar */}
      <div className="hidden border-l bg-muted/40 lg:block overflow-auto">
        <RightSidebar />
      </div>
    </div>
  )
}

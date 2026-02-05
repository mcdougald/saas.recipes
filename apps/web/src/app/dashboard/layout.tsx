"use client"

import { useState } from "react"
import { Sidebar, MobileNav } from "@/components/dashboard/sidebar"
import { RightSidebar } from "@/components/dashboard/right-sidebar"
import { Button } from "@/components/ui/button"
import { ChevronLeft, ChevronRight, PanelRightClose, PanelRightOpen } from "lucide-react"

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const [leftSidebarOpen, setLeftSidebarOpen] = useState(true)
  const [rightSidebarOpen, setRightSidebarOpen] = useState(true)

  return (
    <div className="relative flex min-h-screen w-full">
      {/* Left Sidebar */}
      <div 
        className={`hidden border-r bg-muted/40 md:block transition-all duration-300 ${
          leftSidebarOpen ? 'md:w-[220px] lg:w-[280px]' : 'md:w-0'
        }`}
      >
        {leftSidebarOpen && <Sidebar />}
      </div>
      
      {/* Main Content */}
      <div className="flex flex-1 flex-col">
        <MobileNav />
        
        {/* Sticky Header */}
        <header className="sticky top-0 z-10 flex h-14 items-center gap-4 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 px-4 lg:h-[60px] lg:px-6">
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="icon"
              className="hidden md:flex"
              onClick={() => setLeftSidebarOpen(!leftSidebarOpen)}
            >
              {leftSidebarOpen ? (
                <ChevronLeft className="h-4 w-4" />
              ) : (
                <ChevronRight className="h-4 w-4" />
              )}
              <span className="sr-only">Toggle left sidebar</span>
            </Button>
          </div>
          
          <div className="flex-1" />
          
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="icon"
              className="hidden lg:flex"
              onClick={() => setRightSidebarOpen(!rightSidebarOpen)}
            >
              {rightSidebarOpen ? (
                <PanelRightClose className="h-4 w-4" />
              ) : (
                <PanelRightOpen className="h-4 w-4" />
              )}
              <span className="sr-only">Toggle right sidebar</span>
            </Button>
          </div>
        </header>

        <main className="flex flex-1 flex-col gap-4 p-4 lg:gap-6 lg:p-6 overflow-auto">
          {children}
        </main>
      </div>

      {/* Right Sidebar */}
      <div 
        className={`hidden border-l bg-muted/40 lg:block overflow-auto transition-all duration-300 ${
          rightSidebarOpen ? 'lg:w-[320px] xl:w-[360px]' : 'lg:w-0'
        }`}
      >
        {rightSidebarOpen && <RightSidebar />}
      </div>
    </div>
  )
}

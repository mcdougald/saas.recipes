import { DashboardPageHeader } from "@/components/dashboard/page-header";
import { KanbanBoard } from "@/features/kanban/components/kanban-board";

export default function KanbanPage() {
  return (
    <>
      <DashboardPageHeader
        title="Kanban Board"
        description="Visualize and manage your tasks with drag and drop"
      />

      <div className="flex-1 overflow-hidden px-4 pb-4 lg:px-6">
        <KanbanBoard />
      </div>
    </>
  );
}

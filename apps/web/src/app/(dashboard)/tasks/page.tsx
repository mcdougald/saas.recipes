import { TasksPageClient } from "@/features/tasks/components/tasks-page-client";
import { listCurrentUserTasks } from "@/features/tasks/server/task-service";

/**
 * Render the server-backed tasks dashboard for the current user.
 */
export default async function TasksPage() {
  const tasks = await listCurrentUserTasks();
  return <TasksPageClient initialTasks={tasks} />;
}

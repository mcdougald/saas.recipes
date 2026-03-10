"use client";

import { CheckCircle, Circle, Clock, ListTodo } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

import { DashboardPageHeader } from "@/components/dashboard/page-header";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { createUserTaskAction } from "@/features/tasks/actions";
import { columns } from "@/features/tasks/components/columns";
import { DataTable } from "@/features/tasks/components/data-table";
import { type Task, type TaskFormSchema } from "@/features/tasks/utils/schema";

interface TasksPageClientProps {
  initialTasks: Task[];
}

/**
 * Render the interactive task dashboard backed by persisted user task rows.
 *
 * @param initialTasks - Server-fetched task rows for the signed-in user.
 * @returns The client dashboard with filters, stats, and task creation.
 */
export function TasksPageClient({ initialTasks }: TasksPageClientProps) {
  const [tasks, setTasks] = useState(initialTasks);

  async function handleAddTask(task: TaskFormSchema) {
    try {
      const createdTask = await createUserTaskAction(task);
      setTasks((prev) => [createdTask, ...prev]);
      return createdTask;
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Failed to create task.";
      toast.error(message);
      throw error;
    }
  }

  const stats = {
    total: tasks.length,
    done: tasks.filter((task) => task.status === "done").length,
    inProgress: tasks.filter((task) => task.status === "in_progress").length,
    todo: tasks.filter(
      (task) => task.status === "todo" || task.status === "backlog",
    ).length,
  };

  const completionRate =
    stats.total === 0 ? 0 : Math.round((stats.done / stats.total) * 100);

  const summaryCards = [
    {
      title: "Total Tasks",
      value: stats.total.toString(),
      description: "Persisted work items in your task workspace.",
      icon: Circle,
    },
    {
      title: "Completed",
      value: stats.done.toString(),
      description: `${completionRate}% of your current queue is complete.`,
      icon: CheckCircle,
    },
    {
      title: "In Progress",
      value: stats.inProgress.toString(),
      description: "Tasks actively being implemented right now.",
      icon: Clock,
    },
    {
      title: "Open Queue",
      value: stats.todo.toString(),
      description: "Backlog and todo items still waiting for execution.",
      icon: ListTodo,
    },
  ] as const;

  return (
    <>
      <DashboardPageHeader
        title="Tasks"
        description="Create and track implementation tasks tied to your signed-in workspace."
        actions={
          <Badge variant="outline" className="w-fit">
            Persisted workspace
          </Badge>
        }
      />

      <div className="@container/main space-y-6 px-4 lg:px-6">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {summaryCards.map((card) => (
            <Card key={card.title} className="border">
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <card.icon className="size-6 text-muted-foreground" />
                  <Badge variant="secondary">{card.value}</Badge>
                </div>

                <div className="space-y-2">
                  <p className="text-sm font-medium text-muted-foreground">
                    {card.title}
                  </p>
                  <div className="text-2xl font-bold">{card.value}</div>
                  <p className="text-sm text-muted-foreground">
                    {card.description}
                  </p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <Card className="border">
          <CardHeader>
            <CardTitle>All Tasks</CardTitle>
            <CardDescription>
              Tasks now load from and save back to your account-specific
              workspace.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <DataTable
              columns={columns}
              data={tasks}
              onAddTask={handleAddTask}
            />
          </CardContent>
        </Card>
      </div>
    </>
  );
}

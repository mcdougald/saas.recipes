import {
  kanbanStatusValues,
  taskPriorityValues,
} from "@/lib/db/feature-domain";
import { z } from "zod";

export const priorityEnum = z.enum(taskPriorityValues);
export const columnStatusEnum = z.enum(kanbanStatusValues);

export const kanbanTaskSchema = z.object({
  id: z.string(),
  title: z.string().min(1, "Title is required"),
  description: z.string().optional(),
  assignee: z
    .object({
      name: z.string(),
      avatar: z.string().optional(),
    })
    .optional(),
  priority: priorityEnum,
  status: columnStatusEnum,
});

export const kanbanColumnSchema = z.object({
  id: columnStatusEnum,
  title: z.string(),
  tasks: z.array(kanbanTaskSchema),
});

/**
 * Describe the supported priority values for kanban tasks.
 */
export type Priority = z.infer<typeof priorityEnum>;

/**
 * Describe the supported kanban column statuses.
 */
export type ColumnStatus = z.infer<typeof columnStatusEnum>;

/**
 * Describe one draggable kanban task card.
 */
export type KanbanTask = z.infer<typeof kanbanTaskSchema>;

/**
 * Describe one kanban column with its nested task list.
 */
export type KanbanColumn = z.infer<typeof kanbanColumnSchema>;

export const taskFormSchema = kanbanTaskSchema.omit({ id: true, status: true });
/**
 * Describe the validated payload used to create a new kanban task.
 */
export type TaskFormData = z.infer<typeof taskFormSchema>;

export const statusConfig: Record<
  ColumnStatus,
  { label: string; color: string }
> = {
  ideas: { label: "Ideas", color: "bg-gray-500" },
  todo: { label: "Todo", color: "bg-slate-500" },
  in_progress: { label: "Progress", color: "bg-blue-500" },
  done: { label: "Done", color: "bg-green-500" },
};

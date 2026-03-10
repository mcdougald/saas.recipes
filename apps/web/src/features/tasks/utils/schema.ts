import { z } from "zod";

import {
  taskLabelValues,
  taskListStatusValues,
  taskPriorityValues,
} from "@/lib/db/feature-domain";

export const taskStatusSchema = z.enum(taskListStatusValues);
export const taskLabelSchema = z.enum(taskLabelValues);
export const taskPrioritySchema = z.enum(taskPriorityValues);

export const taskSchema = z.object({
  id: z.string(),
  title: z.string(),
  status: taskStatusSchema,
  label: taskLabelSchema,
  priority: taskPrioritySchema,
});

export const taskFormSchema = z.object({
  id: z.string(),
  title: z.string().min(1, "Title is required"),
  description: z.string().optional(),
  status: taskStatusSchema,
  label: taskLabelSchema,
  priority: taskPrioritySchema,
});

/**
 * Describe one task record rendered in the table experience.
 */
export type Task = z.infer<typeof taskSchema>;

/**
 * Describe the validated payload used to create a task from the modal form.
 */
export type TaskFormSchema = z.infer<typeof taskFormSchema>;

"use server";

import { revalidatePath } from "next/cache";
import {
  createCurrentUserTask,
  listCurrentUserTasks,
} from "./server/task-service";
import { taskFormSchema, type Task, type TaskFormSchema } from "./utils/schema";

/**
 * Create a new user task from the dashboard modal.
 *
 * @param input - Untrusted task form values from the client.
 * @returns The persisted task row used by the task table UI.
 */
export async function createUserTaskAction(
  input: TaskFormSchema,
): Promise<Task> {
  const validatedInput = taskFormSchema.parse(input);
  const task = await createCurrentUserTask(validatedInput);

  revalidatePath("/tasks");
  revalidatePath("/your-recipes");

  return task;
}

/**
 * List the authenticated user's tasks for server-rendered pages.
 *
 * @returns The task rows to render inside the dashboard table.
 */
export async function listUserTasksAction(): Promise<Task[]> {
  return listCurrentUserTasks();
}

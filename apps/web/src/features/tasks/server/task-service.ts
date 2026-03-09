import { db } from "@/lib/db";
import { userTask } from "@/lib/db/schema";
import { getServerSession } from "@/lib/session";
import { desc, eq } from "drizzle-orm";
import { taskSchema, type Task, type TaskFormSchema } from "../utils/schema";

async function requireCurrentUserId() {
  const session = await getServerSession();
  const userId = session?.user.id;

  if (!userId) {
    throw new Error("You must be signed in to manage tasks.");
  }

  return userId;
}

/**
 * List the current user's persisted tasks for the dashboard task table.
 *
 * @returns Task rows ordered with the newest entries first.
 */
export async function listCurrentUserTasks(): Promise<Task[]> {
  const userId = await requireCurrentUserId();
  const rows = await db
    .select({
      id: userTask.id,
      title: userTask.title,
      status: userTask.status,
      label: userTask.label,
      priority: userTask.priority,
    })
    .from(userTask)
    .where(eq(userTask.userId, userId))
    .orderBy(desc(userTask.createdAt));

  return rows
    .filter((row) => row.status !== "ideas")
    .map((row) => taskSchema.parse(row));
}

/**
 * Create a new persisted task for the current user.
 *
 * @param input - Validated task payload from the add-task modal.
 * @returns The task row shape used by the task table UI.
 */
export async function createCurrentUserTask(
  input: TaskFormSchema,
): Promise<Task> {
  const userId = await requireCurrentUserId();

  await db.insert(userTask).values({
    id: input.id,
    userId,
    title: input.title,
    description: input.description,
    status: input.status,
    label: input.label,
    priority: input.priority,
    surface: "tasks",
  });

  return {
    id: input.id,
    title: input.title,
    status: input.status,
    label: input.label,
    priority: input.priority,
  };
}

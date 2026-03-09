export const taskLabelValues = ["bug", "feature"] as const;

/**
 * Describe the supported task label values shared by Drizzle and feature schemas.
 */
export type TaskLabel = (typeof taskLabelValues)[number];

export const taskPriorityValues = ["low", "medium", "high"] as const;

/**
 * Describe the supported task priority values shared by Drizzle and feature schemas.
 */
export type TaskPriority = (typeof taskPriorityValues)[number];

export const taskStatusValues = [
  "ideas",
  "backlog",
  "todo",
  "in_progress",
  "done",
  "canceled",
] as const;

/**
 * Describe the normalized task statuses persisted for user-owned work items.
 */
export type TaskStatus = (typeof taskStatusValues)[number];

export const taskListStatusValues = [
  "backlog",
  "todo",
  "in_progress",
  "done",
  "canceled",
] as const;

/**
 * Describe the subset of task statuses used by the list/table task experience.
 */
export type TaskListStatus = (typeof taskListStatusValues)[number];

export const taskSurfaceValues = ["tasks", "kanban", "your_recipes"] as const;

/**
 * Describe the product surface that owns or displays a task.
 */
export type TaskSurface = (typeof taskSurfaceValues)[number];

export const kanbanStatusValues = ["ideas", "todo", "in_progress", "done"] as const;

/**
 * Describe the subset of task statuses used by the kanban experience.
 */
export type KanbanStatus = (typeof kanbanStatusValues)[number];

export const favoriteEntityTypeValues = [
  "learn_topic",
  "playbook_snippet",
  "task",
  "recipe_workspace",
] as const;

/**
 * Describe the kinds of entities a user can save into their favorites workspace.
 */
export type FavoriteEntityType = (typeof favoriteEntityTypeValues)[number];

export const favoriteSourceValues = [
  "learn",
  "tasks",
  "dashboard",
  "playbooks",
  "your_recipes",
] as const;

/**
 * Describe the originating feature surface for a favorite record.
 */
export type FavoriteSource = (typeof favoriteSourceValues)[number];

export const favoriteReadinessValues = [
  "watching",
  "implementing",
  "shipped",
] as const;

/**
 * Describe the implementation readiness state for a saved favorite.
 */
export type FavoriteReadiness = (typeof favoriteReadinessValues)[number];

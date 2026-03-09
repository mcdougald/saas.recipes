import { relations } from "drizzle-orm";
import {
  boolean,
  index,
  integer,
  jsonb,
  pgEnum,
  pgTable,
  text,
  timestamp,
  uniqueIndex,
} from "drizzle-orm/pg-core";
import {
  favoriteEntityTypeValues,
  favoriteReadinessValues,
  favoriteSourceValues,
  taskLabelValues,
  taskPriorityValues,
  taskStatusValues,
  taskSurfaceValues,
} from "./feature-domain";

const taskStatusEnum = pgEnum("task_status", taskStatusValues);
const taskLabelEnum = pgEnum("task_label", taskLabelValues);
const taskPriorityEnum = pgEnum("task_priority", taskPriorityValues);
const taskSurfaceEnum = pgEnum("task_surface", taskSurfaceValues);
const favoriteEntityTypeEnum = pgEnum(
  "favorite_entity_type",
  favoriteEntityTypeValues,
);
const favoriteSourceEnum = pgEnum("favorite_source", favoriteSourceValues);
const favoriteReadinessEnum = pgEnum(
  "favorite_readiness",
  favoriteReadinessValues,
);

export const user = pgTable(
  "user",
  {
    id: text("id").primaryKey(),
    name: text("name").notNull(),
    email: text("email").notNull().unique(),
    emailVerified: boolean("emailVerified").notNull().default(false),
    admin: boolean("admin").notNull().default(false),
    image: text("image"),
    onboardingCompletedAt: timestamp("onboardingCompletedAt"),
    lastSeenAt: timestamp("lastSeenAt"),
    createdAt: timestamp("createdAt").notNull().defaultNow(),
    updatedAt: timestamp("updatedAt")
      .notNull()
      .defaultNow()
      .$onUpdate(() => new Date()),
    stripeCustomerId: text("stripeCustomerId"),
    subscriptionStatus: text("subscriptionStatus").default("free"),
    subscriptionTier: text("subscriptionTier").default("free"),
    subscriptionEndDate: timestamp("subscriptionEndDate"),
  },
  (table) => [
    uniqueIndex("user_stripeCustomerId_unique").on(table.stripeCustomerId),
  ],
);

export const session = pgTable(
  "session",
  {
    id: text("id").primaryKey(),
    expiresAt: timestamp("expiresAt").notNull(),
    token: text("token").notNull().unique(),
    createdAt: timestamp("createdAt").notNull().defaultNow(),
    updatedAt: timestamp("updatedAt")
      .notNull()
      .defaultNow()
      .$onUpdate(() => new Date()),
    ipAddress: text("ipAddress"),
    userAgent: text("userAgent"),
    userId: text("userId")
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }),
  },
  (table) => [index("session_userId_idx").on(table.userId)],
);

export const account = pgTable(
  "account",
  {
    id: text("id").primaryKey(),
    accountId: text("accountId").notNull(),
    providerId: text("providerId").notNull(),
    userId: text("userId")
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }),
    accessToken: text("accessToken"),
    refreshToken: text("refreshToken"),
    idToken: text("idToken"),
    accessTokenExpiresAt: timestamp("accessTokenExpiresAt"),
    refreshTokenExpiresAt: timestamp("refreshTokenExpiresAt"),
    scope: text("scope"),
    password: text("password"),
    createdAt: timestamp("createdAt").notNull().defaultNow(),
    updatedAt: timestamp("updatedAt")
      .notNull()
      .defaultNow()
      .$onUpdate(() => new Date()),
  },
  (table) => [
    index("account_userId_idx").on(table.userId),
    uniqueIndex("account_provider_account_unique").on(
      table.providerId,
      table.accountId,
    ),
  ],
);

export const verification = pgTable(
  "verification",
  {
    id: text("id").primaryKey(),
    identifier: text("identifier").notNull(),
    value: text("value").notNull(),
    expiresAt: timestamp("expiresAt").notNull(),
    createdAt: timestamp("createdAt").notNull().defaultNow(),
    updatedAt: timestamp("updatedAt")
      .notNull()
      .defaultNow()
      .$onUpdate(() => new Date()),
  },
  (table) => [
    uniqueIndex("verification_identifier_value_unique").on(
      table.identifier,
      table.value,
    ),
  ],
);

export const subscription = pgTable(
  "subscription",
  {
    id: text("id").primaryKey(),
    userId: text("userId")
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }),
    stripeSubscriptionId: text("stripeSubscriptionId").notNull().unique(),
    stripePriceId: text("stripePriceId").notNull(),
    stripeCurrentPeriodEnd: timestamp("stripeCurrentPeriodEnd").notNull(),
    status: text("status").notNull(),
    cancelAtPeriodEnd: boolean("cancelAtPeriodEnd").notNull().default(false),
    createdAt: timestamp("createdAt").notNull().defaultNow(),
    updatedAt: timestamp("updatedAt")
      .notNull()
      .defaultNow()
      .$onUpdate(() => new Date()),
  },
  (table) => [index("subscription_userId_idx").on(table.userId)],
);

export const pricingPlan = pgTable(
  "pricingPlan",
  {
    id: text("id").primaryKey(),
    name: text("name").notNull(),
    description: text("description"),
    stripePriceId: text("stripePriceId").notNull().unique(),
    stripeProductId: text("stripeProductId").notNull(),
    price: integer("price").notNull(),
    interval: text("interval").notNull(),
    features: text("features"),
    isActive: boolean("isActive").notNull().default(true),
    createdAt: timestamp("createdAt").notNull().defaultNow(),
    updatedAt: timestamp("updatedAt")
      .notNull()
      .defaultNow()
      .$onUpdate(() => new Date()),
  },
  (table) => [index("pricingPlan_stripeProductId_idx").on(table.stripeProductId)],
);

export const userPreference = pgTable("userPreference", {
  userId: text("userId")
    .primaryKey()
    .references(() => user.id, { onDelete: "cascade" }),
  locale: text("locale").notNull().default("en"),
  timezone: text("timezone").notNull().default("UTC"),
  defaultTaskSurface: taskSurfaceEnum("defaultTaskSurface")
    .notNull()
    .default("tasks"),
  showCompletedTasks: boolean("showCompletedTasks").notNull().default(true),
  learningEmailDigestEnabled: boolean("learningEmailDigestEnabled")
    .notNull()
    .default(true),
  createdAt: timestamp("createdAt").notNull().defaultNow(),
  updatedAt: timestamp("updatedAt")
    .notNull()
    .defaultNow()
    .$onUpdate(() => new Date()),
});

export const userTask = pgTable(
  "userTask",
  {
    id: text("id").primaryKey(),
    userId: text("userId")
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }),
    title: text("title").notNull(),
    description: text("description"),
    status: taskStatusEnum("status").notNull().default("todo"),
    label: taskLabelEnum("label").notNull().default("feature"),
    priority: taskPriorityEnum("priority").notNull().default("medium"),
    surface: taskSurfaceEnum("surface").notNull().default("tasks"),
    position: integer("position").notNull().default(0),
    assigneeName: text("assigneeName"),
    assigneeAvatar: text("assigneeAvatar"),
    sourceEntityType: favoriteEntityTypeEnum("sourceEntityType"),
    sourceEntitySlug: text("sourceEntitySlug"),
    isFavorite: boolean("isFavorite").notNull().default(false),
    dueAt: timestamp("dueAt"),
    completedAt: timestamp("completedAt"),
    archivedAt: timestamp("archivedAt"),
    metadata: jsonb("metadata").$type<Record<string, unknown>>(),
    createdAt: timestamp("createdAt").notNull().defaultNow(),
    updatedAt: timestamp("updatedAt")
      .notNull()
      .defaultNow()
      .$onUpdate(() => new Date()),
  },
  (table) => [
    index("userTask_user_surface_status_idx").on(
      table.userId,
      table.surface,
      table.status,
    ),
    index("userTask_user_position_idx").on(
      table.userId,
      table.surface,
      table.position,
    ),
    index("userTask_user_updatedAt_idx").on(table.userId, table.updatedAt),
  ],
);

export const userFavorite = pgTable(
  "userFavorite",
  {
    id: text("id").primaryKey(),
    userId: text("userId")
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }),
    entityType: favoriteEntityTypeEnum("entityType").notNull(),
    entitySlug: text("entitySlug").notNull(),
    source: favoriteSourceEnum("source").notNull().default("learn"),
    entityTitle: text("entityTitle").notNull(),
    entitySummary: text("entitySummary"),
    collection: text("collection"),
    readiness: favoriteReadinessEnum("readiness")
      .notNull()
      .default("watching"),
    linkedTaskCount: integer("linkedTaskCount").notNull().default(0),
    priorityScore: integer("priorityScore").notNull().default(0),
    notes: text("notes"),
    lastViewedAt: timestamp("lastViewedAt"),
    metadata: jsonb("metadata").$type<Record<string, unknown>>(),
    createdAt: timestamp("createdAt").notNull().defaultNow(),
    updatedAt: timestamp("updatedAt")
      .notNull()
      .defaultNow()
      .$onUpdate(() => new Date()),
  },
  (table) => [
    uniqueIndex("userFavorite_user_entity_unique").on(
      table.userId,
      table.entityType,
      table.entitySlug,
    ),
    index("userFavorite_user_readiness_idx").on(
      table.userId,
      table.readiness,
      table.updatedAt,
    ),
    index("userFavorite_user_source_idx").on(table.userId, table.source),
  ],
);

export const userRelations = relations(user, ({ many, one }) => ({
  sessions: many(session),
  accounts: many(account),
  subscriptions: many(subscription),
  preference: one(userPreference, {
    fields: [user.id],
    references: [userPreference.userId],
  }),
  tasks: many(userTask),
  favorites: many(userFavorite),
}));

export const sessionRelations = relations(session, ({ one }) => ({
  user: one(user, {
    fields: [session.userId],
    references: [user.id],
  }),
}));

export const accountRelations = relations(account, ({ one }) => ({
  user: one(user, {
    fields: [account.userId],
    references: [user.id],
  }),
}));

export const subscriptionRelations = relations(subscription, ({ one }) => ({
  user: one(user, {
    fields: [subscription.userId],
    references: [user.id],
  }),
}));

export const userPreferenceRelations = relations(userPreference, ({ one }) => ({
  user: one(user, {
    fields: [userPreference.userId],
    references: [user.id],
  }),
}));

export const userTaskRelations = relations(userTask, ({ one }) => ({
  user: one(user, {
    fields: [userTask.userId],
    references: [user.id],
  }),
}));

export const userFavoriteRelations = relations(userFavorite, ({ one }) => ({
  user: one(user, {
    fields: [userFavorite.userId],
    references: [user.id],
  }),
}));

/**
 * Describe one persisted application user row.
 */
export type DbUser = typeof user.$inferSelect;

/**
 * Describe the values required to create an application user row.
 */
export type NewDbUser = typeof user.$inferInsert;

/**
 * Describe one persisted user preference row.
 */
export type DbUserPreference = typeof userPreference.$inferSelect;

/**
 * Describe the values required to create a user preference row.
 */
export type NewDbUserPreference = typeof userPreference.$inferInsert;

/**
 * Describe one persisted user-owned task row.
 */
export type DbUserTask = typeof userTask.$inferSelect;

/**
 * Describe the values required to create a user-owned task row.
 */
export type NewDbUserTask = typeof userTask.$inferInsert;

/**
 * Describe one persisted user favorite row.
 */
export type DbUserFavorite = typeof userFavorite.$inferSelect;

/**
 * Describe the values required to create a user favorite row.
 */
export type NewDbUserFavorite = typeof userFavorite.$inferInsert;

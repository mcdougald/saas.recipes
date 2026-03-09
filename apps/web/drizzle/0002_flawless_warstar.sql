CREATE TABLE "userFavorite" (
	"id" text PRIMARY KEY NOT NULL,
	"userId" text NOT NULL,
	"entityType" "favorite_entity_type" NOT NULL,
	"entitySlug" text NOT NULL,
	"source" "favorite_source" DEFAULT 'learn' NOT NULL,
	"entityTitle" text NOT NULL,
	"entitySummary" text,
	"collection" text,
	"readiness" "favorite_readiness" DEFAULT 'watching' NOT NULL,
	"linkedTaskCount" integer DEFAULT 0 NOT NULL,
	"priorityScore" integer DEFAULT 0 NOT NULL,
	"notes" text,
	"lastViewedAt" timestamp,
	"metadata" jsonb,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"updatedAt" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "userPreference" (
	"userId" text PRIMARY KEY NOT NULL,
	"locale" text DEFAULT 'en' NOT NULL,
	"timezone" text DEFAULT 'UTC' NOT NULL,
	"defaultTaskSurface" "task_surface" DEFAULT 'tasks' NOT NULL,
	"showCompletedTasks" boolean DEFAULT true NOT NULL,
	"learningEmailDigestEnabled" boolean DEFAULT true NOT NULL,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"updatedAt" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "userTask" (
	"id" text PRIMARY KEY NOT NULL,
	"userId" text NOT NULL,
	"title" text NOT NULL,
	"description" text,
	"status" "task_status" DEFAULT 'todo' NOT NULL,
	"label" "task_label" DEFAULT 'feature' NOT NULL,
	"priority" "task_priority" DEFAULT 'medium' NOT NULL,
	"surface" "task_surface" DEFAULT 'tasks' NOT NULL,
	"position" integer DEFAULT 0 NOT NULL,
	"assigneeName" text,
	"assigneeAvatar" text,
	"sourceEntityType" "favorite_entity_type",
	"sourceEntitySlug" text,
	"isFavorite" boolean DEFAULT false NOT NULL,
	"dueAt" timestamp,
	"completedAt" timestamp,
	"archivedAt" timestamp,
	"metadata" jsonb,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"updatedAt" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "user" ALTER COLUMN "subscriptionStatus" SET DEFAULT 'free';--> statement-breakpoint
ALTER TABLE "user" ALTER COLUMN "subscriptionTier" SET DEFAULT 'free';--> statement-breakpoint
ALTER TABLE "user" ADD COLUMN "onboardingCompletedAt" timestamp;--> statement-breakpoint
ALTER TABLE "user" ADD COLUMN "lastSeenAt" timestamp;--> statement-breakpoint
ALTER TABLE "userFavorite" ADD CONSTRAINT "userFavorite_userId_user_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "userPreference" ADD CONSTRAINT "userPreference_userId_user_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "userTask" ADD CONSTRAINT "userTask_userId_user_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE UNIQUE INDEX "userFavorite_user_entity_unique" ON "userFavorite" USING btree ("userId","entityType","entitySlug");--> statement-breakpoint
CREATE INDEX "userFavorite_user_readiness_idx" ON "userFavorite" USING btree ("userId","readiness","updatedAt");--> statement-breakpoint
CREATE INDEX "userFavorite_user_source_idx" ON "userFavorite" USING btree ("userId","source");--> statement-breakpoint
CREATE INDEX "userTask_user_surface_status_idx" ON "userTask" USING btree ("userId","surface","status");--> statement-breakpoint
CREATE INDEX "userTask_user_position_idx" ON "userTask" USING btree ("userId","surface","position");--> statement-breakpoint
CREATE INDEX "userTask_user_updatedAt_idx" ON "userTask" USING btree ("userId","updatedAt");--> statement-breakpoint
CREATE INDEX "account_userId_idx" ON "account" USING btree ("userId");--> statement-breakpoint
CREATE UNIQUE INDEX "account_provider_account_unique" ON "account" USING btree ("providerId","accountId");--> statement-breakpoint
CREATE INDEX "pricingPlan_stripeProductId_idx" ON "pricingPlan" USING btree ("stripeProductId");--> statement-breakpoint
CREATE INDEX "session_userId_idx" ON "session" USING btree ("userId");--> statement-breakpoint
CREATE INDEX "subscription_userId_idx" ON "subscription" USING btree ("userId");--> statement-breakpoint
CREATE UNIQUE INDEX "user_stripeCustomerId_unique" ON "user" USING btree ("stripeCustomerId");--> statement-breakpoint
CREATE UNIQUE INDEX "verification_identifier_value_unique" ON "verification" USING btree ("identifier","value");
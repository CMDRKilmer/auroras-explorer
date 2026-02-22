CREATE TABLE "public"."user_plans" (
  "id" TEXT NOT NULL,
  "username" TEXT NOT NULL,
  "group_id" TEXT NOT NULL,
  "planet_id" TEXT NOT NULL,
  "plan_id" TEXT NOT NULL,
  "created_at" TEXT DEFAULT CURRENT_TIMESTAMP NOT NULL,
  "updated_at" TEXT DEFAULT CURRENT_TIMESTAMP NOT NULL,
  "created_by" TEXT NOT NULL,
  "updated_by" TEXT NOT NULL,
  PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "uniq_user_planet" ON "public"."user_plans"("username","planet_id");

CREATE TABLE "public"."group_plans" (
  "id" TEXT NOT NULL,
  "group_id" TEXT NOT NULL,
  "plan_id" TEXT NOT NULL,
  "plan_name" TEXT NOT NULL,
  "planet_id" TEXT NOT NULL,
  "data" JSONB NOT NULL,
  "buildings" TEXT[] DEFAULT '{}',
  "inputs" TEXT[] DEFAULT '{}',
  "outputs" TEXT[] DEFAULT '{}',
  "created_at" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  "updated_at" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  "created_by" TEXT NOT NULL,
  "updated_by" TEXT NOT NULL,
  PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "uniq_group_id_plan_id" ON "public"."group_plans"("group_id", "plan_id");

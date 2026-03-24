CREATE TABLE "public"."groups" (
  "id" TEXT NOT NULL,
  "name" TEXT NOT NULL,
  "fio_group_id" TEXT NOT NULL,
  "fio_api_token" TEXT NOT NULL,
  "created_at" TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
  "updated_at" TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
  "created_by" TEXT NOT NULL,
  "updated_by" TEXT NOT NULL,
  PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "uniq_group_fio_group_id" ON "public"."groups"("fio_group_id");

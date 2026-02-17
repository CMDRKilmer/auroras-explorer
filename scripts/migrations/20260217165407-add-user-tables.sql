CREATE TABLE "public"."users" (
  "username" TEXT NOT NULL,
  "token" TEXT NOT NULL,
  "created_at" timestamp NOT NULL,
  "updated_at" timestamp NOT NULL,
  PRIMARY KEY ("username")
);

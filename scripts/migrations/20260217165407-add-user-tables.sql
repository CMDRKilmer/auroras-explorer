CREATE TABLE "public"."users" (
  "username" TEXT NOT NULL,
  "fio_token" TEXT NOT NULL,
  "created_at" timestamp DEFAULT CURRENT_TIMESTAMP NOT NULL,
  "updated_at" timestamp DEFAULT CURRENT_TIMESTAMP NOT NULL,
  PRIMARY KEY ("username")
);

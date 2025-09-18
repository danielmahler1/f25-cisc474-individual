-- CreateTable
CREATE TABLE "public"."users" (
    "id" UUID NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "role" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."course" (
    "id" UUID NOT NULL,
    "code" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "term" TEXT NOT NULL,
    "user_id" UUID NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "course_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."assignment" (
    "id" UUID NOT NULL,
    "course_id" UUID NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "due_date" TIMESTAMP(3) NOT NULL,
    "max_attempts" INTEGER NOT NULL DEFAULT 1,
    "late_penalty" DOUBLE PRECISION,

    CONSTRAINT "assignment_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."submission" (
    "id" UUID NOT NULL,
    "assignment_id" UUID NOT NULL,
    "user_id" UUID NOT NULL,
    "submission_type" TEXT NOT NULL,
    "attempt_number" INTEGER NOT NULL DEFAULT 1,
    "auto_score" DOUBLE PRECISION,
    "final_score" DOUBLE PRECISION,
    "status" TEXT NOT NULL,
    "submitted_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "submission_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."enrollment" (
    "id" UUID NOT NULL,
    "user_id" UUID NOT NULL,
    "course_id" UUID NOT NULL,
    "role" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "enrollment_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."calendar_event" (
    "id" UUID NOT NULL,
    "user_id" UUID NOT NULL,
    "assignment_id" UUID NOT NULL,
    "due_at" TIMESTAMP(3) NOT NULL,
    "title" TEXT NOT NULL,

    CONSTRAINT "calendar_event_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "public"."users"("email");

-- CreateIndex
CREATE INDEX "course_user_id_idx" ON "public"."course"("user_id");

-- CreateIndex
CREATE INDEX "assignment_course_id_idx" ON "public"."assignment"("course_id");

-- CreateIndex
CREATE INDEX "assignment_due_date_idx" ON "public"."assignment"("due_date");

-- CreateIndex
CREATE INDEX "submission_user_id_idx" ON "public"."submission"("user_id");

-- CreateIndex
CREATE INDEX "submission_assignment_id_submitted_at_idx" ON "public"."submission"("assignment_id", "submitted_at");

-- CreateIndex
CREATE UNIQUE INDEX "submission_assignment_id_user_id_attempt_number_key" ON "public"."submission"("assignment_id", "user_id", "attempt_number");

-- CreateIndex
CREATE INDEX "enrollment_course_id_role_idx" ON "public"."enrollment"("course_id", "role");

-- CreateIndex
CREATE UNIQUE INDEX "enrollment_user_id_course_id_key" ON "public"."enrollment"("user_id", "course_id");

-- CreateIndex
CREATE INDEX "calendar_event_user_id_idx" ON "public"."calendar_event"("user_id");

-- CreateIndex
CREATE INDEX "calendar_event_assignment_id_due_at_idx" ON "public"."calendar_event"("assignment_id", "due_at");

-- AddForeignKey
ALTER TABLE "public"."course" ADD CONSTRAINT "course_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."assignment" ADD CONSTRAINT "assignment_course_id_fkey" FOREIGN KEY ("course_id") REFERENCES "public"."course"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."submission" ADD CONSTRAINT "submission_assignment_id_fkey" FOREIGN KEY ("assignment_id") REFERENCES "public"."assignment"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."submission" ADD CONSTRAINT "submission_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."enrollment" ADD CONSTRAINT "enrollment_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."enrollment" ADD CONSTRAINT "enrollment_course_id_fkey" FOREIGN KEY ("course_id") REFERENCES "public"."course"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."calendar_event" ADD CONSTRAINT "calendar_event_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."calendar_event" ADD CONSTRAINT "calendar_event_assignment_id_fkey" FOREIGN KEY ("assignment_id") REFERENCES "public"."assignment"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- CreateEnum
CREATE TYPE "TaskerAvailabilityReminderType" AS ENUM (
    'EXPIRING_SOON',
    'EXPIRED'
);

-- CreateEnum
CREATE TYPE "TaskerAvailabilityScheduleStatus" AS ENUM (
    'ACTIVE',
    'SUPERSEDED',
    'EXPIRED'
);

-- CreateEnum
CREATE TYPE "TaskerWeeklyAvailabilityStatus" AS ENUM (
    'ACTIVE',
    'INACTIVE'
);


-- ============================================================
-- 1. Preserve existing TaskerAvailability table
-- ============================================================

-- Remove old foreign key
ALTER TABLE "TaskerAvailability"
DROP CONSTRAINT "TaskerAvailability_taskerProfileId_fkey";


-- Rename the existing table temporarily.
-- The existing 72 records represent recurring weekly availability.
ALTER TABLE "TaskerAvailability"
RENAME TO "TaskerAvailability_legacy";


-- Rename old primary key constraint.
-- PostgreSQL keeps the constraint name when the table is renamed.
ALTER TABLE "TaskerAvailability_legacy"
RENAME CONSTRAINT "TaskerAvailability_pkey"
TO "TaskerAvailability_legacy_pkey";


-- Remove old indexes so their names can be reused
-- by the new TaskerAvailability table.
DROP INDEX IF EXISTS
"TaskerAvailability_taskerProfileId_dayOfWeek_specificDate_s_key";

DROP INDEX IF EXISTS
"TaskerAvailability_taskerProfileId_dayOfWeek_status_idx";

DROP INDEX IF EXISTS
"TaskerAvailability_taskerProfileId_specificDate_status_idx";


-- ============================================================
-- 2. Create TaskerWeeklyAvailability
-- ============================================================

CREATE TABLE "TaskerWeeklyAvailability" (
    "id" TEXT NOT NULL,
    "taskerProfileId" TEXT NOT NULL,
    "dayOfWeek" "DayOfWeek" NOT NULL,
    "startTime" TEXT NOT NULL,
    "endTime" TEXT NOT NULL,
    "status" "TaskerWeeklyAvailabilityStatus" NOT NULL DEFAULT 'ACTIVE',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "TaskerWeeklyAvailability_pkey"
        PRIMARY KEY ("id")
);


-- ============================================================
-- 3. Move existing recurring availability
-- ============================================================

INSERT INTO "TaskerWeeklyAvailability" (
    "id",
    "taskerProfileId",
    "dayOfWeek",
    "startTime",
    "endTime",
    "status",
    "createdAt",
    "updatedAt"
)
SELECT
    "id",
    "taskerProfileId",
    "dayOfWeek",
    "startTime",
    "endTime",
    CASE
        WHEN "status"::text = 'ACTIVE'
            THEN 'ACTIVE'::"TaskerWeeklyAvailabilityStatus"
        ELSE 'INACTIVE'::"TaskerWeeklyAvailabilityStatus"
    END,
    "createdAt",
    "updatedAt"
FROM "TaskerAvailability_legacy"
WHERE "type" = 'RECURRING';


-- ============================================================
-- 4. Create the new TaskerAvailability table
-- ============================================================

CREATE TABLE "TaskerAvailability" (
    "id" TEXT NOT NULL,
    "scheduleId" TEXT NOT NULL,
    "date" DATE NOT NULL,
    "startTime" TEXT NOT NULL,
    "endTime" TEXT NOT NULL,
    "status" "TaskerAvailabilityStatus" NOT NULL DEFAULT 'ACTIVE',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "TaskerAvailability_pkey"
        PRIMARY KEY ("id")
);


-- ============================================================
-- 5. Remove legacy availability table
-- ============================================================

DROP TABLE "TaskerAvailability_legacy";


-- ============================================================
-- 6. Create TaskerAvailabilitySchedule
-- ============================================================

CREATE TABLE "TaskerAvailabilitySchedule" (
    "id" TEXT NOT NULL,
    "taskerProfileId" TEXT NOT NULL,
    "version" INTEGER NOT NULL,
    "validFrom" DATE NOT NULL,
    "validUntil" DATE NOT NULL,
    "publishedAt" TIMESTAMP(3) NOT NULL,
    "status" "TaskerAvailabilityScheduleStatus" NOT NULL DEFAULT 'ACTIVE',
    "supersededAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "TaskerAvailabilitySchedule_pkey"
        PRIMARY KEY ("id")
);


-- ============================================================
-- 7. Create TaskerAvailabilityReminder
-- ============================================================

CREATE TABLE "TaskerAvailabilityReminder" (
    "id" TEXT NOT NULL,
    "taskerProfileId" TEXT NOT NULL,
    "scheduleId" TEXT NOT NULL,
    "reminderType" "TaskerAvailabilityReminderType" NOT NULL,
    "sentAt" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "TaskerAvailabilityReminder_pkey"
        PRIMARY KEY ("id")
);


-- ============================================================
-- 8. Create indexes
-- ============================================================

CREATE UNIQUE INDEX
"TaskerWeeklyAvailability_taskerProfileId_dayOfWeek_startTime_endTime_key"
ON "TaskerWeeklyAvailability" (
    "taskerProfileId",
    "dayOfWeek",
    "startTime",
    "endTime"
);

CREATE INDEX
"TaskerWeeklyAvailability_taskerProfileId_dayOfWeek_status_idx"
ON "TaskerWeeklyAvailability" (
    "taskerProfileId",
    "dayOfWeek",
    "status"
);


CREATE UNIQUE INDEX
"TaskerAvailabilitySchedule_taskerProfileId_version_key"
ON "TaskerAvailabilitySchedule" (
    "taskerProfileId",
    "version"
);

CREATE INDEX
"TaskerAvailabilitySchedule_taskerProfileId_status_idx"
ON "TaskerAvailabilitySchedule" (
    "taskerProfileId",
    "status"
);

CREATE INDEX
"TaskerAvailabilitySchedule_taskerProfileId_validFrom_validUntil_idx"
ON "TaskerAvailabilitySchedule" (
    "taskerProfileId",
    "validFrom",
    "validUntil"
);


CREATE UNIQUE INDEX
"TaskerAvailabilityReminder_scheduleId_reminderType_key"
ON "TaskerAvailabilityReminder" (
    "scheduleId",
    "reminderType"
);

CREATE INDEX
"TaskerAvailabilityReminder_taskerProfileId_sentAt_idx"
ON "TaskerAvailabilityReminder" (
    "taskerProfileId",
    "sentAt"
);


CREATE UNIQUE INDEX
"TaskerAvailability_scheduleId_date_startTime_endTime_key"
ON "TaskerAvailability" (
    "scheduleId",
    "date",
    "startTime",
    "endTime"
);

CREATE INDEX
"TaskerAvailability_scheduleId_date_status_idx"
ON "TaskerAvailability" (
    "scheduleId",
    "date",
    "status"
);


-- ============================================================
-- 9. Add foreign keys
-- ============================================================

ALTER TABLE "TaskerWeeklyAvailability"
ADD CONSTRAINT
"TaskerWeeklyAvailability_taskerProfileId_fkey"
FOREIGN KEY ("taskerProfileId")
REFERENCES "TaskerProfile"("id")
ON DELETE RESTRICT
ON UPDATE CASCADE;


ALTER TABLE "TaskerAvailabilitySchedule"
ADD CONSTRAINT
"TaskerAvailabilitySchedule_taskerProfileId_fkey"
FOREIGN KEY ("taskerProfileId")
REFERENCES "TaskerProfile"("id")
ON DELETE RESTRICT
ON UPDATE CASCADE;


ALTER TABLE "TaskerAvailability"
ADD CONSTRAINT
"TaskerAvailability_scheduleId_fkey"
FOREIGN KEY ("scheduleId")
REFERENCES "TaskerAvailabilitySchedule"("id")
ON DELETE RESTRICT
ON UPDATE CASCADE;


ALTER TABLE "TaskerAvailabilityReminder"
ADD CONSTRAINT
"TaskerAvailabilityReminder_taskerProfileId_fkey"
FOREIGN KEY ("taskerProfileId")
REFERENCES "TaskerProfile"("id")
ON DELETE RESTRICT
ON UPDATE CASCADE;


ALTER TABLE "TaskerAvailabilityReminder"
ADD CONSTRAINT
"TaskerAvailabilityReminder_scheduleId_fkey"
FOREIGN KEY ("scheduleId")
REFERENCES "TaskerAvailabilitySchedule"("id")
ON DELETE RESTRICT
ON UPDATE CASCADE;


-- ============================================================
-- 10. Remove old enum
-- ============================================================

DROP TYPE "TaskerAvailabilityType";
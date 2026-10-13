/*
  Warnings:

  - A unique constraint covering the columns `[googleId]` on the table `users` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "users" ADD COLUMN     "googleId" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "users_googleId_key" ON "users"("googleId");

-- RenameIndex
ALTER INDEX "TaskerAvailabilitySchedule_taskerProfileId_validFrom_validUntil" RENAME TO "TaskerAvailabilitySchedule_taskerProfileId_validFrom_validU_idx";

-- RenameIndex
ALTER INDEX "TaskerWeeklyAvailability_taskerProfileId_dayOfWeek_startTime_en" RENAME TO "TaskerWeeklyAvailability_taskerProfileId_dayOfWeek_startTim_key";

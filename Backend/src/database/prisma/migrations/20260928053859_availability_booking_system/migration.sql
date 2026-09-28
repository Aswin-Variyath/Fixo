/*
  Data migration:
  - Booking.startTime -> Booking.requestedStartTime
  - Existing TaskerAvailability records are RECURRING
*/

-- CreateEnum
CREATE TYPE "PaymentMethod" AS ENUM ('ONLINE', 'CASH');

-- CreateEnum
CREATE TYPE "PaymentStatus" AS ENUM ('PENDING', 'PROCESSING', 'PAID', 'FAILED', 'REFUNDED', 'CANCELLED');

-- CreateEnum
CREATE TYPE "TaskerAvailabilityOverrideSource" AS ENUM ('JOB_COMPLETION', 'TASKER_MANUAL', 'ADMIN');

-- CreateEnum
CREATE TYPE "TaskerAvailabilityOverrideStatus" AS ENUM ('OPEN', 'CLOSED');

-- CreateEnum
CREATE TYPE "TaskerAvailabilityType" AS ENUM ('RECURRING', 'ONE_OFF');

-- CreateEnum
CREATE TYPE "TaskerBlackoutStatus" AS ENUM ('ACTIVE', 'INACTIVE');

-- AlterEnum
ALTER TYPE "BookingStatus" ADD VALUE 'COMPLETION_PENDING';

-- DropIndex
DROP INDEX "TaskerAvailability_taskerProfileId_dayOfWeek_startTime_endT_key";

-- AlterTable
ALTER TABLE "Booking"
ADD COLUMN "actualEndTime" TIMESTAMP(3),
ADD COLUMN "actualStartTime" TIMESTAMP(3),
ADD COLUMN "billableMinutes" INTEGER,
ADD COLUMN "billingRate" DECIMAL(10,2),
ADD COLUMN "discountAmount" DECIMAL(10,2),
ADD COLUMN "finalAmount" DECIMAL(10,2),
ADD COLUMN "jobStartOtpHash" TEXT,
ADD COLUMN "otpVerifiedAt" TIMESTAMP(3),
ADD COLUMN "platformFee" DECIMAL(10,2),
ADD COLUMN "requestedStartTime" TEXT,
ADD COLUMN "serviceAmount" DECIMAL(10,2),
ADD COLUMN "taxAmount" DECIMAL(10,2);

-- Migrate existing Booking start times
UPDATE "Booking"
SET "requestedStartTime" = "startTime";

-- Make requestedStartTime required
ALTER TABLE "Booking"
ALTER COLUMN "requestedStartTime" SET NOT NULL;

-- Remove old Booking time columns
ALTER TABLE "Booking"
DROP COLUMN "startTime",
DROP COLUMN "endTime";

-- AlterTable
ALTER TABLE "TaskerAvailability"
ADD COLUMN "specificDate" DATE,
ADD COLUMN "type" "TaskerAvailabilityType",
ALTER COLUMN "dayOfWeek" DROP NOT NULL;

-- Migrate existing availability records
UPDATE "TaskerAvailability"
SET "type" = 'RECURRING';

-- Make type required
ALTER TABLE "TaskerAvailability"
ALTER COLUMN "type" SET NOT NULL;

-- CreateTable
CREATE TABLE "Payment" (
    "id" TEXT NOT NULL,
    "bookingId" TEXT NOT NULL,
    "amount" DECIMAL(10,2) NOT NULL,
    "status" "PaymentStatus" NOT NULL DEFAULT 'PENDING',
    "method" "PaymentMethod",
    "provider" TEXT,
    "providerPaymentId" TEXT,
    "paidAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Payment_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TaskerAvailabilityOverride" (
    "id" TEXT NOT NULL,
    "taskerProfileId" TEXT NOT NULL,
    "date" DATE NOT NULL,
    "startTime" TEXT NOT NULL,
    "endTime" TEXT NOT NULL,
    "status" "TaskerAvailabilityOverrideStatus" NOT NULL,
    "source" "TaskerAvailabilityOverrideSource" NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "TaskerAvailabilityOverride_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TaskerBlackout" (
    "id" TEXT NOT NULL,
    "taskerProfileId" TEXT NOT NULL,
    "date" DATE NOT NULL,
    "startTime" TEXT NOT NULL,
    "endTime" TEXT NOT NULL,
    "reason" TEXT,
    "status" "TaskerBlackoutStatus" NOT NULL DEFAULT 'ACTIVE',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "TaskerBlackout_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Payment_bookingId_key" ON "Payment"("bookingId");

-- CreateIndex
CREATE INDEX "Payment_status_idx" ON "Payment"("status");

-- CreateIndex
CREATE INDEX "Payment_providerPaymentId_idx" ON "Payment"("providerPaymentId");

-- CreateIndex
CREATE INDEX "TaskerAvailabilityOverride_taskerProfileId_date_status_idx"
ON "TaskerAvailabilityOverride"("taskerProfileId", "date", "status");

-- CreateIndex
CREATE INDEX "TaskerBlackout_taskerProfileId_date_status_idx"
ON "TaskerBlackout"("taskerProfileId", "date", "status");

-- CreateIndex
CREATE INDEX "TaskerAvailability_taskerProfileId_specificDate_status_idx"
ON "TaskerAvailability"("taskerProfileId", "specificDate", "status");

-- CreateIndex
CREATE UNIQUE INDEX "TaskerAvailability_taskerProfileId_dayOfWeek_specificDate_s_key"
ON "TaskerAvailability"(
    "taskerProfileId",
    "dayOfWeek",
    "specificDate",
    "startTime",
    "endTime"
);

-- AddForeignKey
ALTER TABLE "Payment"
ADD CONSTRAINT "Payment_bookingId_fkey"
FOREIGN KEY ("bookingId") REFERENCES "Booking"("id")
ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TaskerAvailabilityOverride"
ADD CONSTRAINT "TaskerAvailabilityOverride_taskerProfileId_fkey"
FOREIGN KEY ("taskerProfileId") REFERENCES "TaskerProfile"("id")
ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TaskerBlackout"
ADD CONSTRAINT "TaskerBlackout_taskerProfileId_fkey"
FOREIGN KEY ("taskerProfileId") REFERENCES "TaskerProfile"("id")
ON DELETE RESTRICT ON UPDATE CASCADE;
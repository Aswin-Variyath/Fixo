-- CreateEnum
CREATE TYPE "CategoryStatus" AS ENUM ('ACTIVE', 'INACTIVE');

-- CreateEnum
CREATE TYPE "DayOfWeek" AS ENUM ('MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY', 'SATURDAY', 'SUNDAY');

-- CreateEnum
CREATE TYPE "KycDocumentType" AS ENUM ('SELFIE', 'AADHAAR_FRONT', 'AADHAAR_BACK', 'BANK_PASSBOOK', 'EXPERIENCE_CERTIFICATE');

-- CreateEnum
CREATE TYPE "ServiceStatus" AS ENUM ('ACTIVE', 'INACTIVE');

-- CreateEnum
CREATE TYPE "TaskerAvailabilityStatus" AS ENUM ('ACTIVE', 'INACTIVE');

-- CreateEnum
CREATE TYPE "TaskerEducationType" AS ENUM ('SSLC', 'PLUS_TWO', 'DEGREE', 'MASTERS');

-- CreateEnum
CREATE TYPE "TaskerKycStatus" AS ENUM ('NOT_SUBMITTED', 'PENDING', 'VERIFIED', 'REJECTED');

-- CreateEnum
CREATE TYPE "TaskerProfileStatus" AS ENUM ('INCOMPLETE', 'COMPLETE');

-- CreateEnum
CREATE TYPE "TaskerServiceOfferingStatus" AS ENUM ('ACTIVE', 'INACTIVE');

-- CreateTable
CREATE TABLE "Category" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "description" TEXT,
    "imageUrl" TEXT,
    "displayOrder" INTEGER NOT NULL DEFAULT 0,
    "status" "CategoryStatus" NOT NULL DEFAULT 'ACTIVE',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Category_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CustomerAddress" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "label" TEXT NOT NULL,
    "addressLine" TEXT NOT NULL,
    "city" TEXT NOT NULL,
    "state" TEXT NOT NULL,
    "postalCode" TEXT NOT NULL,
    "country" TEXT NOT NULL,
    "latitude" DECIMAL(10,7) NOT NULL,
    "longitude" DECIMAL(10,7) NOT NULL,
    "isDefault" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "CustomerAddress_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "KycDocument" (
    "id" TEXT NOT NULL,
    "taskerKycId" TEXT NOT NULL,
    "type" "KycDocumentType" NOT NULL,
    "fileUrl" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "KycDocument_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Service" (
    "id" TEXT NOT NULL,
    "categoryId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "imageUrl" TEXT,
    "displayOrder" INTEGER NOT NULL DEFAULT 0,
    "status" "ServiceStatus" NOT NULL DEFAULT 'ACTIVE',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Service_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TaskerAvailability" (
    "id" TEXT NOT NULL,
    "taskerProfileId" TEXT NOT NULL,
    "dayOfWeek" "DayOfWeek" NOT NULL,
    "startTime" TEXT NOT NULL,
    "endTime" TEXT NOT NULL,
    "status" "TaskerAvailabilityStatus" NOT NULL DEFAULT 'ACTIVE',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "TaskerAvailability_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TaskerEducation" (
    "id" TEXT NOT NULL,
    "taskerKycId" TEXT NOT NULL,
    "type" "TaskerEducationType" NOT NULL,
    "qualification" TEXT NOT NULL,
    "institution" TEXT,
    "yearOfPassing" INTEGER,
    "certificateUrl" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "TaskerEducation_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TaskerKyc" (
    "id" TEXT NOT NULL,
    "taskerProfileId" TEXT NOT NULL,
    "bankAccountNumber" TEXT NOT NULL,
    "ifscCode" TEXT NOT NULL,
    "status" "TaskerKycStatus" NOT NULL DEFAULT 'NOT_SUBMITTED',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "TaskerKyc_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TaskerLocation" (
    "id" TEXT NOT NULL,
    "taskerProfileId" TEXT NOT NULL,
    "addressLine" TEXT NOT NULL,
    "city" TEXT NOT NULL,
    "state" TEXT NOT NULL,
    "postalCode" TEXT NOT NULL,
    "country" TEXT NOT NULL,
    "latitude" DECIMAL(10,7) NOT NULL,
    "longitude" DECIMAL(10,7) NOT NULL,
    "serviceRadiusKm" DECIMAL(6,2) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "TaskerLocation_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TaskerProfile" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "bio" TEXT,
    "profileImageUrl" TEXT,
    "experienceYears" INTEGER,
    "averageRating" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "totalReviews" INTEGER NOT NULL DEFAULT 0,
    "profileStatus" "TaskerProfileStatus" NOT NULL DEFAULT 'INCOMPLETE',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "TaskerProfile_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TaskerServiceOffering" (
    "id" TEXT NOT NULL,
    "taskerProfileId" TEXT NOT NULL,
    "serviceId" TEXT NOT NULL,
    "hourlyRate" DECIMAL(10,2),
    "dailyRate" DECIMAL(10,2),
    "status" "TaskerServiceOfferingStatus" NOT NULL DEFAULT 'ACTIVE',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "TaskerServiceOffering_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Category_name_key" ON "Category"("name");

-- CreateIndex
CREATE UNIQUE INDEX "Category_slug_key" ON "Category"("slug");

-- CreateIndex
CREATE INDEX "Category_status_displayOrder_idx" ON "Category"("status", "displayOrder");

-- CreateIndex
CREATE INDEX "CustomerAddress_userId_idx" ON "CustomerAddress"("userId");

-- CreateIndex
CREATE INDEX "KycDocument_taskerKycId_idx" ON "KycDocument"("taskerKycId");

-- CreateIndex
CREATE UNIQUE INDEX "KycDocument_taskerKycId_type_key" ON "KycDocument"("taskerKycId", "type");

-- CreateIndex
CREATE UNIQUE INDEX "Service_slug_key" ON "Service"("slug");

-- CreateIndex
CREATE INDEX "Service_categoryId_status_displayOrder_idx" ON "Service"("categoryId", "status", "displayOrder");

-- CreateIndex
CREATE UNIQUE INDEX "Service_categoryId_name_key" ON "Service"("categoryId", "name");

-- CreateIndex
CREATE INDEX "TaskerAvailability_taskerProfileId_dayOfWeek_status_idx" ON "TaskerAvailability"("taskerProfileId", "dayOfWeek", "status");

-- CreateIndex
CREATE UNIQUE INDEX "TaskerAvailability_taskerProfileId_dayOfWeek_startTime_endT_key" ON "TaskerAvailability"("taskerProfileId", "dayOfWeek", "startTime", "endTime");

-- CreateIndex
CREATE INDEX "TaskerEducation_taskerKycId_idx" ON "TaskerEducation"("taskerKycId");

-- CreateIndex
CREATE UNIQUE INDEX "TaskerEducation_taskerKycId_type_key" ON "TaskerEducation"("taskerKycId", "type");

-- CreateIndex
CREATE UNIQUE INDEX "TaskerKyc_taskerProfileId_key" ON "TaskerKyc"("taskerProfileId");

-- CreateIndex
CREATE UNIQUE INDEX "TaskerLocation_taskerProfileId_key" ON "TaskerLocation"("taskerProfileId");

-- CreateIndex
CREATE INDEX "TaskerLocation_latitude_longitude_idx" ON "TaskerLocation"("latitude", "longitude");

-- CreateIndex
CREATE UNIQUE INDEX "TaskerProfile_userId_key" ON "TaskerProfile"("userId");

-- CreateIndex
CREATE INDEX "TaskerServiceOffering_taskerProfileId_status_idx" ON "TaskerServiceOffering"("taskerProfileId", "status");

-- CreateIndex
CREATE INDEX "TaskerServiceOffering_serviceId_status_idx" ON "TaskerServiceOffering"("serviceId", "status");

-- CreateIndex
CREATE UNIQUE INDEX "TaskerServiceOffering_taskerProfileId_serviceId_key" ON "TaskerServiceOffering"("taskerProfileId", "serviceId");

-- AddForeignKey
ALTER TABLE "CustomerAddress" ADD CONSTRAINT "CustomerAddress_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "KycDocument" ADD CONSTRAINT "KycDocument_taskerKycId_fkey" FOREIGN KEY ("taskerKycId") REFERENCES "TaskerKyc"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Service" ADD CONSTRAINT "Service_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "Category"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TaskerAvailability" ADD CONSTRAINT "TaskerAvailability_taskerProfileId_fkey" FOREIGN KEY ("taskerProfileId") REFERENCES "TaskerProfile"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TaskerEducation" ADD CONSTRAINT "TaskerEducation_taskerKycId_fkey" FOREIGN KEY ("taskerKycId") REFERENCES "TaskerKyc"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TaskerKyc" ADD CONSTRAINT "TaskerKyc_taskerProfileId_fkey" FOREIGN KEY ("taskerProfileId") REFERENCES "TaskerProfile"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TaskerLocation" ADD CONSTRAINT "TaskerLocation_taskerProfileId_fkey" FOREIGN KEY ("taskerProfileId") REFERENCES "TaskerProfile"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TaskerProfile" ADD CONSTRAINT "TaskerProfile_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TaskerServiceOffering" ADD CONSTRAINT "TaskerServiceOffering_taskerProfileId_fkey" FOREIGN KEY ("taskerProfileId") REFERENCES "TaskerProfile"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TaskerServiceOffering" ADD CONSTRAINT "TaskerServiceOffering_serviceId_fkey" FOREIGN KEY ("serviceId") REFERENCES "Service"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

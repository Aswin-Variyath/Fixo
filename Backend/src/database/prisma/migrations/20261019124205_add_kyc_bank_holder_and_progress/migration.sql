/*
  Warnings:

  - Added the required column `bankAccountHolderName` to the `TaskerKyc` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "TaskerKyc" ADD COLUMN     "bankAccountHolderName" TEXT NOT NULL,
ADD COLUMN     "currentStep" TEXT NOT NULL DEFAULT 'SELFIE';

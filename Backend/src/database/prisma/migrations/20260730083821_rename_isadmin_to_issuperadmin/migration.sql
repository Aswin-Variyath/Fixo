/*
  Warnings:

  - You are about to drop the column `isSuper` on the `roles` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "roles" DROP COLUMN "isSuper",
ADD COLUMN     "isSuperAdmin" BOOLEAN NOT NULL DEFAULT false;

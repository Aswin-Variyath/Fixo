/*
  Warnings:

  - You are about to drop the column `code` on the `languages` table. All the data in the column will be lost.
  - You are about to drop the column `nativeName` on the `languages` table. All the data in the column will be lost.
  - You are about to drop the column `code` on the `roles` table. All the data in the column will be lost.
  - You are about to drop the column `description` on the `roles` table. All the data in the column will be lost.
  - You are about to drop the column `displayName` on the `roles` table. All the data in the column will be lost.
  - You are about to drop the column `isActive` on the `users` table. All the data in the column will be lost.
  - You are about to drop the column `isBlocked` on the `users` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[type]` on the table `languages` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[type]` on the table `roles` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `type` to the `languages` table without a default value. This is not possible if the table is not empty.
  - Added the required column `title` to the `roles` table without a default value. This is not possible if the table is not empty.
  - Added the required column `type` to the `roles` table without a default value. This is not possible if the table is not empty.
  - Made the column `lastName` on table `users` required. This step will fail if there are existing NULL values in that column.
  - Made the column `email` on table `users` required. This step will fail if there are existing NULL values in that column.
  - Made the column `phone` on table `users` required. This step will fail if there are existing NULL values in that column.
  - Made the column `password` on table `users` required. This step will fail if there are existing NULL values in that column.
  - Made the column `languageId` on table `users` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE "users" DROP CONSTRAINT "users_languageId_fkey";

-- DropForeignKey
ALTER TABLE "users" DROP CONSTRAINT "users_roleId_fkey";

-- DropIndex
DROP INDEX "languages_code_key";

-- DropIndex
DROP INDEX "roles_code_key";

-- AlterTable
ALTER TABLE "languages" DROP COLUMN "code",
DROP COLUMN "nativeName",
ADD COLUMN     "type" VARCHAR(10) NOT NULL;

-- AlterTable
ALTER TABLE "roles" DROP COLUMN "code",
DROP COLUMN "description",
DROP COLUMN "displayName",
ADD COLUMN     "title" VARCHAR(100) NOT NULL,
ADD COLUMN     "type" VARCHAR(50) NOT NULL;

-- AlterTable
ALTER TABLE "users" DROP COLUMN "isActive",
DROP COLUMN "isBlocked",
ALTER COLUMN "lastName" SET NOT NULL,
ALTER COLUMN "email" SET NOT NULL,
ALTER COLUMN "phone" SET NOT NULL,
ALTER COLUMN "password" SET NOT NULL,
ALTER COLUMN "languageId" SET NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "languages_type_key" ON "languages"("type");

-- CreateIndex
CREATE UNIQUE INDEX "roles_type_key" ON "roles"("type");

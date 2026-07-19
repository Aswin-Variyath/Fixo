-- AlterTable
ALTER TABLE "users" ADD COLUMN     "deletedAt" TIMESTAMP(3);

-- CreateIndex
CREATE INDEX "users_roleId_idx" ON "users"("roleId");

-- CreateIndex
CREATE INDEX "users_languageId_idx" ON "users"("languageId");

-- CreateIndex
CREATE INDEX "users_statusId_idx" ON "users"("statusId");

-- CreateIndex
CREATE INDEX "users_deletedAt_idx" ON "users"("deletedAt");

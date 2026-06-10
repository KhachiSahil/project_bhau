/*
  Warnings:

  - You are about to drop the column `cabOwnerId` on the `BookedDate` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "BookedDate" DROP CONSTRAINT "BookedDate_cabOwnerId_fkey";

-- DropIndex
DROP INDEX "BookedDate_cabOwnerId_date_cabBookingId_idx";

-- AlterTable
ALTER TABLE "BookedDate" DROP COLUMN "cabOwnerId";

-- CreateIndex
CREATE INDEX "BookedDate_cabBookingId_date_idx" ON "BookedDate"("cabBookingId", "date");

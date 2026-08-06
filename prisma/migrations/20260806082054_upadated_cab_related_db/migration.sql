/*
  Warnings:

  - Added the required column `cabId` to the `CabBooking` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "CabBooking_cabOwnerId_enquiryId_idx";

-- AlterTable
ALTER TABLE "CabBooking" ADD COLUMN     "cabId" UUID NOT NULL;

-- CreateTable
CREATE TABLE "Cab" (
    "id" UUID NOT NULL,
    "model" TEXT NOT NULL,
    "plateNumber" TEXT NOT NULL,
    "seats" INTEGER NOT NULL,
    "type" TEXT NOT NULL DEFAULT 'Sedan',
    "ownerId" UUID NOT NULL,

    CONSTRAINT "Cab_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Cab_plateNumber_key" ON "Cab"("plateNumber");

-- CreateIndex
CREATE INDEX "Cab_ownerId_idx" ON "Cab"("ownerId");

-- CreateIndex
CREATE INDEX "CabBooking_cabOwnerId_cabId_enquiryId_idx" ON "CabBooking"("cabOwnerId", "cabId", "enquiryId");

-- AddForeignKey
ALTER TABLE "Cab" ADD CONSTRAINT "Cab_ownerId_fkey" FOREIGN KEY ("ownerId") REFERENCES "CabOwner"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CabBooking" ADD CONSTRAINT "CabBooking_cabId_fkey" FOREIGN KEY ("cabId") REFERENCES "Cab"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

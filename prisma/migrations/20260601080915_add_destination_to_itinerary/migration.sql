/*
  Warnings:

  - A unique constraint covering the columns `[pickupLocationId,dropLocationId,destinationId,days]` on the table `Itinerary` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `destinationId` to the `Itinerary` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "Itinerary_pickupLocationId_dropLocationId_days_key";

-- AlterTable
ALTER TABLE "Itinerary" ADD COLUMN     "destinationId" UUID NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Itinerary_pickupLocationId_dropLocationId_destinationId_day_key" ON "Itinerary"("pickupLocationId", "dropLocationId", "destinationId", "days");

-- AddForeignKey
ALTER TABLE "Itinerary" ADD CONSTRAINT "Itinerary_destinationId_fkey" FOREIGN KEY ("destinationId") REFERENCES "Destination"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

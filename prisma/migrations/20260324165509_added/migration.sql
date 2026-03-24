/*
  Warnings:

  - A unique constraint covering the columns `[pickupLocationId,dropLocationId,days]` on the table `Itinerary` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `days` to the `Itinerary` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Itinerary" ADD COLUMN     "days" INTEGER NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Itinerary_pickupLocationId_dropLocationId_days_key" ON "Itinerary"("pickupLocationId", "dropLocationId", "days");

/*
  Warnings:

  - Made the column `enquiryId` on table `CabBooking` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE "CabBooking" DROP CONSTRAINT "CabBooking_enquiryId_fkey";

-- AlterTable
ALTER TABLE "CabBooking" ALTER COLUMN "enquiryId" SET NOT NULL;

-- CreateTable
CREATE TABLE "Itinerary" (
    "id" UUID NOT NULL,
    "pickupLocationId" UUID NOT NULL,
    "dropLocationId" UUID NOT NULL,
    "description" JSONB NOT NULL,

    CONSTRAINT "Itinerary_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "CabBooking" ADD CONSTRAINT "CabBooking_enquiryId_fkey" FOREIGN KEY ("enquiryId") REFERENCES "Enquiry"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Itinerary" ADD CONSTRAINT "Itinerary_pickupLocationId_fkey" FOREIGN KEY ("pickupLocationId") REFERENCES "Destination"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Itinerary" ADD CONSTRAINT "Itinerary_dropLocationId_fkey" FOREIGN KEY ("dropLocationId") REFERENCES "Destination"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

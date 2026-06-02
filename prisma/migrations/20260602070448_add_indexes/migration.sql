-- DropIndex
DROP INDEX "BookedDate_cabOwnerId_date_idx";

-- DropIndex
DROP INDEX "Enquiry_pickupDate_dropDate_employeeId_idx";

-- DropIndex
DROP INDEX "FollowUp_date_employeeId_idx";

-- DropIndex
DROP INDEX "HotelBookingDate_date_idx";

-- CreateIndex
CREATE INDEX "BookedDate_cabOwnerId_date_cabBookingId_idx" ON "BookedDate"("cabOwnerId", "date", "cabBookingId");

-- CreateIndex
CREATE INDEX "CabBooking_cabOwnerId_enquiryId_idx" ON "CabBooking"("cabOwnerId", "enquiryId");

-- CreateIndex
CREATE INDEX "Enquiry_pickupDate_dropDate_employeeId_customerId_destinati_idx" ON "Enquiry"("pickupDate", "dropDate", "employeeId", "customerId", "destinationId", "websiteId", "dropLocationId", "pickupLocationId");

-- CreateIndex
CREATE INDEX "FollowUp_date_employeeId_enquiryId_idx" ON "FollowUp"("date", "employeeId", "enquiryId");

-- CreateIndex
CREATE INDEX "Hotel_enquiryId_idx" ON "Hotel"("enquiryId");

-- CreateIndex
CREATE INDEX "HotelBookingDate_date_hotelId_idx" ON "HotelBookingDate"("date", "hotelId");

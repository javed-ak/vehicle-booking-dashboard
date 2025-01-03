/*
  Warnings:

  - Added the required column `bookingRequestId` to the `booked_slots` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "booked_slots" ADD COLUMN     "bookingRequestId" TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE "booked_slots" ADD CONSTRAINT "booked_slots_bookingRequestId_fkey" FOREIGN KEY ("bookingRequestId") REFERENCES "BookingRequest"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

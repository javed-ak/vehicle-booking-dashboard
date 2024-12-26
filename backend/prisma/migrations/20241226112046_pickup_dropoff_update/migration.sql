/*
  Warnings:

  - Added the required column `dropoff` to the `BookingRequest` table without a default value. This is not possible if the table is not empty.
  - Added the required column `pickup` to the `BookingRequest` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "BookingRequest" ADD COLUMN     "dropoff" TEXT NOT NULL,
ADD COLUMN     "pickup" TEXT NOT NULL;

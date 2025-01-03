-- CreateTable
CREATE TABLE "booked_slots" (
    "id" SERIAL NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "slot" TEXT NOT NULL,

    CONSTRAINT "booked_slots_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "booked_slots_date_slot_key" ON "booked_slots"("date", "slot");

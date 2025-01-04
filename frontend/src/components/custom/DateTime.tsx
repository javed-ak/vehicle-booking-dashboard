import { useEffect, useState } from "react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css"; // Import calendar styles
import { format, set } from "date-fns";
import { useRequestData } from "@/context/BookingRequestContext";
import axios from "axios";
import { BACKEND_URL } from "@/config";
import Loader from "./Loader";

export default function DateTime() {
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [bookedSlots, setBookedSlots] = useState<string[]>([]);
  const [bookedDates, setBookedDates] = useState<string[]>([]);
  const { requestData, setRequestData } = useRequestData();
  const [loading, setLoading] = useState(false);

  const timeSlots = {
    slot: ["12:00 am to 4:00 am", "4:00 am to 8:00 am", "8:00 am to 12:00 pm", "12:00 am to 04:00 pm", "04:00 pm to 08:00 pm", "08:00 pm to 12:00 am"]
  };

  const updateDateTimeInContext = (date: Date | null, time: string | null) => {
    if (date && time) {
      const formattedDateTime = `${format(date, "MMMM dd, yyyy")} - ${time}`;
      setRequestData((prev: any) => ({
        ...prev,
        dateTime: formattedDateTime, // Save formatted date-time string
      }));
    }

  };

  const handleDateChange = (date: Date) => {
    setSelectedDate(date);
    // updateDateTimeInContext(date, selectedTime);
    fetchBookedSlots(date);
  };

  const handleTimeSlotClick = (time: string) => {
    setSelectedTime(time);
    updateDateTimeInContext(selectedDate, time);
  };

  const getSelectedDateTimeString = () => {
    if (selectedDate && selectedTime) {
      return `${format(selectedDate, "MMMM dd, yyyy")} - ${selectedTime}`;
    }
    return "No date and time selected";
  };

  const fetchBookedSlots = async (date: Date) => {
    try {
      const formattedDate = format(date, "yyyy-MM-dd");
      const response = await axios.get(`${BACKEND_URL}/api/v1/booking/booked-slots/${formattedDate}`);
      if (!response.data.message) {
        const bookedSlotsData = response.data.map((slot: { slot: string }) => slot.slot);
        setBookedSlots(bookedSlotsData);
      } else {
        setBookedSlots([]);
      }

    } catch (error) {
      setBookedSlots([]);
      console.error("Error fetching booked slots", error);
    }
  };

  const fetchBookedDates = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${BACKEND_URL}/api/v1/booking/booked-dates`);

      const allSlotsPerDay = 3;
      const bookedDates = [];

      for (const [date, slots] of Object.entries(response.data)) {
        // @ts-ignore
        if (slots.length === allSlotsPerDay) {
          bookedDates.push(date);
        }
      }
      setBookedDates(bookedDates);
      setLoading(false);
    } catch (error) {
      setBookedDates([]);
      setLoading(false);
      console.error("Error fetching booked slots", error);
    }
  };


  const tileDisabled = ({ date }: { date: Date }) => {
    const formattedDate = format(date, "yyyy-MM-dd");
    return bookedDates.includes(formattedDate);
  };


  useEffect(() => {
    fetchBookedDates();
  }
    , []);

  if (loading) {
    return <Loader />;
  }

  return (
    <div>
      <div className="font-bold text-xl mb-5">Select Date & Time</div>

      {/* Calendar Component */}
      <div className="grid grid-cols-2">

        <div className="mb-5">
          <Calendar
            onChange={handleDateChange}
            value={selectedDate}
            minDate={new Date()} // Disable dates before today
            className="border rounded-lg p-3"
            tileClassName={({ date }) => {
              if (date.toDateString() === new Date().toDateString()) {
                return "current-date"; // Highlight today
              }
              if (selectedDate && date.toDateString() === selectedDate.toDateString()) {
                return "selected-date"; // Highlight selected date
              }
              return undefined;
            }}
            tileDisabled={tileDisabled} // Disable booked dates
          />
        </div>

        {/* Time Slots */}
        <div className="ml-4  h-72 overflow-auto border p-2 scrollable-div">
          <div className="font-bold text-lg mb-2 text-center">Time Slot</div>
          <div className="flex flex-col gap-4">
            {Object.entries(timeSlots).map(([period, slots]) => (
              <div key={period}>
                <div className="flex flex-col gap-2">
                  {slots.map((slot) => (
                    <button
                      key={slot}
                      className={`border p-3 rounded-lg transition-all ${bookedSlots.includes(slot)
                        ? "bg-gray-300 text-gray-700 cursor-not-allowed"
                        // Disable booked slot
                        : selectedTime === slot
                          ? "bg-orange-50 border-orange-500"
                          : "hover:bg-gray-100"
                        }`}
                      onClick={() => bookedSlots && !bookedSlots.includes(slot) && handleTimeSlotClick(slot)}
                      disabled={bookedSlots.includes(slot)}
                    >
                      {slot}
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Selected Date & Time */}
      <div className="mt-5">
        <div className="font-bold text-lg">Selected Date & Time:</div>
        <div className="text-gray-700">{requestData.dateTime ? requestData.dateTime : 'No date and time selected'}</div>
      </div>

      <style jsx>{`
        .current-date {
          background-color: #ffae4a !important;
          color: white !important;
          border-radius: 10%;
        }
        .selected-date {
          background-color: #F87315 !important;
          color: white !important;
          border-radius: 10%;
        }
      `}</style>
    </div>
  );
}

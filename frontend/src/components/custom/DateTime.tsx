import { useState } from "react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css"; // Import calendar styles
import { format } from "date-fns";
import { useRequestData } from "@/context/BookingRequestContext";

export default function DateTime() {
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const { requestData, setRequestData } = useRequestData();

  const timeSlots = {
    slot: ["10:00 am to 02:00 pm", "02:00 pm to 06:00 pm", "06:00 pm to 10:00 pm"]
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
    updateDateTimeInContext(date, selectedTime);
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
          />
        </div>

        {/* Time Slots */}
        <div>
          <div className="font-bold text-lg mb-2">Time Slot</div>
          <div className="flex flex-col gap-4">
            {Object.entries(timeSlots).map(([period, slots]) => (
              <div key={period}>
                <div className="flex flex-col gap-2">
                  {slots.map((slot) => (
                    <button
                      key={slot}
                      className={`border p-3 rounded-lg transition-all ${
                        selectedTime === slot
                          ? "bg-orange-50 border-orange-500"
                          : "hover:bg-gray-100"
                      }`}
                      onClick={() => handleTimeSlotClick(slot)}
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

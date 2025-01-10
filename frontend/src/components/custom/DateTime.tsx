import { useEffect, useState } from "react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css"; // Import calendar styles
import { format, set } from "date-fns";
import { useRequestData } from "@/context/BookingRequestContext";
import axios from "axios";
import { BACKEND_URL } from "@/config";
import Loader from "./Loader";
import { useShowNext } from "@/context/showNextContext";

export default function DateTime() {
  const [selectedDate, setSelectedDate] = useState<Date>();
  const [selectedSlots, setSelectedSlots] = useState<number[]>([]);
  const [bookedSlots, setBookedSlots] = useState<string[]>([]);
  const [bookedDates, setBookedDates] = useState<string[]>([]);
  const { requestData, setRequestData } = useRequestData();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { setShowNext } = useShowNext();

  const timeSlots = [
    "12:00 am to 1:00 am",
    "1:00 am to 2:00 am",
    "2:00 am to 3:00 am",
    "3:00 am to 4:00 am",
    "4:00 am to 5:00 am",
    "5:00 am to 6:00 am",
    "6:00 am to 7:00 am",
    "7:00 am to 8:00 am",
    "8:00 am to 9:00 am",
    "9:00 am to 10:00 am",
    "10:00 am to 11:00 am",
    "11:00 am to 12:00 pm",
    "12:00 pm to 1:00 pm",
    "1:00 pm to 2:00 pm",
    "2:00 pm to 3:00 pm",
    "3:00 pm to 4:00 pm",
    "4:00 pm to 5:00 pm",
    "5:00 pm to 6:00 pm",
    "6:00 pm to 7:00 pm",
    "7:00 pm to 8:00 pm",
    "8:00 pm to 9:00 pm",
    "9:00 pm to 10:00 pm",
    "10:00 pm to 11:00 pm",
    "11:00 pm to 12:00 am",
  ]

  const updateDateTimeInContext = (date: Date | null, time: string) => {
    if (date && time) {
      const formattedDateTime = `${format(date, "MMMM dd, yyyy")} - ${time}`;
      setRequestData((prev: any) => ({
        ...prev,
        dateTime: formattedDateTime, // Save formatted date-time string
      }));
      setError("");
      setShowNext({ show: true });
    }
    else {
      setError("Please select date");
    }
  };

  const handleSetSlots = () => {
    if (selectedSlots.length > 3) {
      if (isContinuous()) {
        const formattedSlots = `${timeSlots[selectedSlots[0]].slice(0, 8)} to ${timeSlots[selectedSlots[selectedSlots.length - 1]].slice(11, 18)}`;
        // @ts-ignore
        updateDateTimeInContext(selectedDate, formattedSlots);
      } else {
        setError("Please select continuous slots");
      }
    }
    else {
      setError("Please select atleast 4 slots");
    }
  }

  const handleDateChange = (date: Date) => {
    setSelectedDate(date);
    // updateDateTimeInContext(date, selectedTime);
    fetchBookedSlots(date);
  };

  const handleTimeSlotClick = (index: number) => {
    if (selectedSlots.includes(index)) {
      setSelectedSlots(selectedSlots.filter((s) => s !== index));
    }
    else {
      setSelectedSlots((prev) => [...prev, index]);
    }
    setSelectedSlots((cur) => cur.sort());
  };

  const isContinuous = () => {
    if (selectedSlots.length > 1) {
      for (let i = 0; i < selectedSlots.length - 1; i++) {
        if (selectedSlots[i + 1] - selectedSlots[i] !== 1) {
          return false;
        }
      }
      return true;
    }
    return false;
  };

  // const getSelectedDateTimeString = () => {
  //   if (selectedDate && selectedTime) {
  //     return `${format(selectedDate, "MMMM dd, yyyy")} - ${selectedTime}`;
  //   }
  //   return "No date and time selected";
  // };

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

      const allSlotsPerDay = 24;
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
    if (requestData.dateTime === "")
      setShowNext({ show: false });
    else
      setShowNext({ show: true });

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
        <div className="ml-4 relative border p-2 h-72">
          <div className="font-bold text-lg mb-2 text-center sticky top-0 ">
            Time Slot
          </div>
          <div className="flex flex-col gap-2 h-60 overflow-auto ">
            {timeSlots.map((slot, index) => (
              <button
                key={index}
                className={`border p-3 rounded-lg transition-all ${bookedSlots.includes(slot)
                  ? "bg-gray-300 text-gray-700 cursor-not-allowed"
                  : selectedSlots.includes(index)
                    ? "bg-orange-50 border-orange-500"
                    : "hover:bg-gray-100"
                  }`}
                onClick={() => bookedSlots && !bookedSlots.includes(slot) && handleTimeSlotClick(index)}
                disabled={bookedSlots.includes(slot)}
              >
                {slot}
              </button>
            ))}
          </div>
        </div>
      </div>
      <div className="flex justify-center mt-5">

        <div>
          {error && <p className="text-red-500 mr-8 text-lg mt-1">{error}</p>}
        </div>
      </div>
      {/* Selected Date & Time */}
      <div className="mt-5 flex justify-between">
        <div>
          <div className="font-bold text-lg">Selected Date & Time:</div>
          <div className="text-gray-700">{requestData.dateTime ? requestData.dateTime : 'No date and time selected'}</div>
        </div>
        <button
          className="bg-orange-500 hover:bg-orange-600 text-white font-bold py-2 px-4 rounded"
          onClick={handleSetSlots}
        >
          Set Date and Time
        </button>
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

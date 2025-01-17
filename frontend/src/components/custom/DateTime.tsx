import { useEffect, useState } from "react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css"; // Import calendar styles
import { format } from "date-fns";
import { useRequestData } from "@/context/BookingRequestContext";
import axios from "axios";
import { BACKEND_URL } from "@/config";
import Loader from "./Loader";
import { useShowNext } from "@/context/showNextContext";
import { Button } from "../ui/button";

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
    "12:00 am to 01:00 am",
    "01:00 am to 02:00 am",
    "02:00 am to 03:00 am",
    "03:00 am to 04:00 am",
    "04:00 am to 05:00 am",
    "05:00 am to 06:00 am",
    "06:00 am to 07:00 am",
    "07:00 am to 08:00 am",
    "08:00 am to 09:00 am",
    "09:00 am to 10:00 am",
    "10:00 am to 11:00 am",
    "11:00 am to 12:00 pm",
    "12:00 pm to 01:00 pm",
    "01:00 pm to 02:00 pm",
    "02:00 pm to 03:00 pm",
    "03:00 pm to 04:00 pm",
    "04:00 pm to 05:00 pm",
    "05:00 pm to 06:00 pm",
    "06:00 pm to 07:00 pm",
    "07:00 pm to 08:00 pm",
    "08:00 pm to 09:00 pm",
    "09:00 pm to 10:00 pm",
    "10:00 pm to 11:00 pm",
    "11:00 pm to 12:00 am",
  ];

  const updateDateTimeInContext = (date: Date | null, time: string) => {
    if (date && time) {
      const formattedDateTime = `${format(date, "MMMM dd, yyyy")} - ${time}`;
      setRequestData((prev: any) => ({
        ...prev,
        dateTime: formattedDateTime, // Save formatted date-time string
        selectedDate: date, // Save selected date
        selectedSlots, // Save selected slots
      }));
      setError("");
      setShowNext({ show: true });
    } else {
      setError("Please select date");
    }
  };

  const handleSetSlots = () => {
    if (selectedSlots.length > 3) {
      if (isContinuous()) {
        const formattedSlots = `${timeSlots[selectedSlots[0]].slice(
          0,
          8
        )} to ${timeSlots[selectedSlots[selectedSlots.length - 1]].slice(
          12,
          20
        )}`;
        updateDateTimeInContext(selectedDate, formattedSlots);
      } else {
        setError("Please select continuous slots");
      }
    } else {
      setError("Please select at least 4 slots");
    }
  };

  const handleDateChange = (date: Date) => {
    setSelectedDate(date);

    // Save selected date to context
    setRequestData((prev: any) => ({
      ...prev,
      selectedDate: date,
    }));

    fetchBookedSlots(date);
  };

  const handleTimeSlotClick = (index: number) => {
    if (selectedSlots.includes(index)) {
      setSelectedSlots(selectedSlots.filter((s) => s !== index));
    } else {
      setSelectedSlots((prev) => [...prev, index]);
    }
    setSelectedSlots((cur) => cur.sort((a, b) => a - b));
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

  const fetchBookedSlots = async (date: Date) => {
    try {
      const formattedDate = format(date, "yyyy-MM-dd");
      const response = await axios.get(
        `${BACKEND_URL}/api/v1/booking/booked-slots/${formattedDate}`
      );
      if (!response.data.message) {
        const bookedSlotsData = response.data.map(
          (slot: { slot: string }) => slot.slot
        );
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

    // Restore selected date and slots from context
    if (requestData.selectedDate) {
      setSelectedDate(new Date(requestData.selectedDate));
    }

    if (requestData.selectedSlots) {
      setSelectedSlots(requestData.selectedSlots);
    }

    if (requestData.dateTime === "") {
      setShowNext({ show: false });
    } else {
      setShowNext({ show: true });
    }
  }, []);

  useEffect(() => {
    if (
      requestData.selectedDate &&
      selectedDate?.toDateString() ===
      new Date(requestData.selectedDate).toDateString() &&
      JSON.stringify(selectedSlots) === JSON.stringify(requestData.selectedSlots)
    ) {
      setShowNext({ show: true }); // Enable "Next" button if no changes
    } else {
      setShowNext({ show: false }); // Disable "Next" button if changes are made
    }
  }, [selectedDate, selectedSlots, requestData]);

  if (loading) {
    return <Loader />;
  }

  return (
    <div>
      <div className="font-bold text-xl mb-5">Select Date & Time</div>

      <div className="lg:grid grid-cols-2">
        <div className="mb-5">
          <Calendar
            onChange={handleDateChange}
            value={selectedDate}
            minDate={new Date()}
            className="border rounded-lg p-3"
            tileClassName={({ date }) => {
              const today = new Date();
              if (
                selectedDate &&
                date.toDateString() === selectedDate.toDateString() &&
                date.toDateString() === today.toDateString()
              ) {
                return "selected-today-date";
              }
              if (date.toDateString() === today.toDateString()) {
                return "today-date";
              }
              if (selectedDate && date.toDateString() === selectedDate.toDateString()) {
                return "selected-date";
              }
              return undefined;
            }}
            tileDisabled={tileDisabled}
          />
        </div>

        <div className="lg:ml-4 relative border p-2 h-72 rounded-lg">
          <div className="font-bold text-lg mb-2 text-center sticky top-0 bg-white">
            Time Slot
            <div className="text-xs text-red-500 font-light">
              Minimum 4 slot booking acceptable*
            </div>
          </div>
          <div className="flex flex-col gap-2 h-56 overflow-auto">
            {timeSlots.map((slot, index) => (
              <button
                key={index}
                className={`border p-3 rounded-lg transition-all ${bookedSlots.includes(slot)
                  ? "bg-gray-300 text-gray-700 cursor-not-allowed"
                  : selectedSlots.includes(index)
                    ? "bg-orange-50 border-orangeColor"
                    : "hover:bg-gray-100"
                  }`}
                onClick={() =>
                  bookedSlots && !bookedSlots.includes(slot) && handleTimeSlotClick(index)
                }
                disabled={bookedSlots.includes(slot)}
              >
                {slot}
              </button>
            ))}
          </div>
        </div>
      </div>
      <div className="flex justify-center mt-5">
        <div>{error && <p className="text-red-500 text-sm mt-1">{error}</p>}</div>
      </div>

      <div className="mt-5 lg:flex justify-between">
        <div>
          <div className="font-bold text-lg">Selected Date & Time:</div>
          <div className="text-gray-700">
            {requestData.dateTime ? requestData.dateTime : "No date and time selected"}
          </div>
        </div>
        <Button
          className="mt-5 lg:mt-0"
          onClick={handleSetSlots}
          disabled={selectedSlots.length < 4 || !isContinuous()}
        >
          Confirm Date & Time
        </Button>
      </div>

      <style>{`
        .today-date {
          background-color: rgb(226, 119, 104) !important;
          color: white !important;
          border-radius: 10%;
        }
        .selected-date {
          background-color: #E95440 !important;
          color: white !important;
          border-radius: 10%;
        }
        .selected-today-date {
          background-color: #E95440 !important;
          color: white !important;
          border-radius: 10%;
        }
      `}</style>
    </div>
  );
}

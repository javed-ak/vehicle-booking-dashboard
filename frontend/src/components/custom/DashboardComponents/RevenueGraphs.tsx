import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  ResponsiveContainer,
  BarChart as RechartsBarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from "recharts";
import { useEffect, useState } from "react";
import axios from "axios";
import { BACKEND_URL } from "@/config";

interface Booking {
  id: string;
  vehicle: string;
  dateTime: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  pickup: string;
  dropoff: string;
  prepTime: number;
  note: string;
  status: string;
  createdAt: string; // ISO format
}

export default function WeeklyAndMonthlyBookings() {
  const [weeklyData, setWeeklyData] = useState<{ week: string; bookings: number }[]>([]);
  const [monthlyData, setMonthlyData] = useState<{ month: string; bookings: number }[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`${BACKEND_URL}/api/v1/booking/bulk`, {
          headers: {
            Authorization: localStorage.getItem("token"),
          },
        });
        const bookings: Booking[] = response.data;

        // Process data for both graphs
        setWeeklyData(getWeeklyDataForCurrentMonth(bookings));
        setMonthlyData(getMonthlyData(bookings));
      } catch (error) {
        console.error("Failed to fetch booking data:", error);
      }
    };

    fetchData();
  }, []);

  const getWeeklyDataForCurrentMonth = (bookings: Booking[]) => {
    const weekMap: Record<string, number> = {};
    const today = new Date();
    const currentMonth = today.getMonth(); // 0-based month index
    const currentYear = today.getFullYear();

    // Filter bookings for the current month
    const currentMonthBookings = bookings.filter((booking) => {
      const createdDate = new Date(booking.createdAt);
      return (
        createdDate.getMonth() === currentMonth && createdDate.getFullYear() === currentYear
      );
    });

    // Group bookings by week number
    currentMonthBookings.forEach((booking) => {
      const createdDate = new Date(booking.createdAt);
      const weekNumber = getWeekOfMonth(createdDate);

      weekMap[`Week ${weekNumber}`] = (weekMap[`Week ${weekNumber}`] || 0) + 1;
    });

    // Create data array for all weeks of the current month
    const totalWeeksInMonth = getTotalWeeksInMonth(currentYear, currentMonth);
    const weeklyData: { week: string; bookings: number }[] = [];
    for (let i = 1; i <= totalWeeksInMonth; i++) {
      weeklyData.push({
        week: `Week ${i}`,
        bookings: weekMap[`Week ${i}`] || 0,
      });
    }

    return weeklyData;
  };

  const getMonthlyData = (bookings: Booking[]) => {
    const monthMap: Record<string, number> = {};
    const today = new Date();
    const monthsToShow = 3; // Current + 2 future months

    // Group bookings by month
    bookings.forEach((booking) => {
      const createdDate = new Date(booking.createdAt);
      const monthYear = getMonthYear(createdDate);

      monthMap[monthYear] = (monthMap[monthYear] || 0) + 1;
    });

    // Add future months with 0 bookings
    const monthsData: { month: string; bookings: number }[] = [];
    for (let i = 0; i < monthsToShow; i++) {
      const date = new Date();
      date.setMonth(today.getMonth() + i);
      const monthYear = getMonthYear(date);

      monthsData.push({
        month: monthYear,
        bookings: monthMap[monthYear] || 0,
      });
    }

    return monthsData;
  };

  const getWeekOfMonth = (date: Date): number => {
    const firstDayOfMonth = new Date(date.getFullYear(), date.getMonth(), 1);
    return Math.ceil((date.getDate() + firstDayOfMonth.getDay()) / 7);
  };

  const getTotalWeeksInMonth = (year: number, month: number): number => {
    const lastDayOfMonth = new Date(year, month + 1, 0);
    return getWeekOfMonth(lastDayOfMonth);
  };

  const getMonthYear = (date: Date): string => {
    const options: Intl.DateTimeFormatOptions = { month: "short", year: "numeric" };
    return date.toLocaleDateString("en-US", options); // Example: "Jan 2025"
  };

  return (
    <div className="flex flex-col lg:flex-row gap-6">
      {/* Weekly Bookings Graph */}
      <Card className="flex-1">
        <CardHeader>
          <CardTitle>Weekly Bookings</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <RechartsBarChart data={weeklyData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="week" tick={{ fontSize: 12 }} />
              <YAxis />
              <Tooltip formatter={(value) => [`${value}`, "Bookings"]} />
              <Bar dataKey="bookings" fill="#E95440" />
            </RechartsBarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Monthly Bookings Graph */}
      <Card className="flex-1">
        <CardHeader>
          <CardTitle>Monthly Bookings</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <RechartsBarChart data={monthlyData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" tick={{ fontSize: 12 }} />
              <YAxis />
              <Tooltip formatter={(value) => [`${value}`, "Bookings"]} />
              <Bar dataKey="bookings" fill="#000" />
            </RechartsBarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  );
}

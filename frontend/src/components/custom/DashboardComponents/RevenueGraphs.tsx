import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ResponsiveContainer, BarChart as RechartsBarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';

// Booking data
const weeklyBookingData = [
  { week: 'Week 1', bookings: 25 },
  { week: 'Week 2', bookings: 32 },
  { week: 'Week 3', bookings: 45 },
  { week: 'Week 4', bookings: 50 }
];

const monthlyBookingData = [
  { month: 'Jan', bookings: 150 },
  { month: 'Feb', bookings: 180 },
  { month: 'Mar', bookings: 200 },
  { month: 'Apr', bookings: 250 },
  { month: 'May', bookings: 220 },
  { month: 'Jun', bookings: 300 }
];

export default function BookingGraphs() {
  return (
    <div className="grid grid-cols-2 gap-6 mb-6">
      {/* Weekly Booking Requests */}
      <Card>
        <CardHeader>
          <CardTitle>Weekly Booking Requests</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <RechartsBarChart data={weeklyBookingData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="week" />
              <YAxis />
              <Tooltip formatter={(value) => [`${value}`, 'Bookings']} />
              <Bar dataKey="bookings" fill="#34d399" />
            </RechartsBarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Monthly Booking Requests */}
      <Card>
        <CardHeader>
          <CardTitle>Monthly Booking Requests</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <RechartsBarChart data={monthlyBookingData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip formatter={(value) => [`${value}`, 'Bookings']} />
              <Bar dataKey="bookings" fill="#60a5fa" />
            </RechartsBarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  );
}

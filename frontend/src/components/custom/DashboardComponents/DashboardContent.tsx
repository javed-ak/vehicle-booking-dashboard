import RecentBookingRequests from "./RecentBookingRequests";
import RevenueGraphs from "./RevenueGraphs";
import SummaryCards from "./SummaryCards";

export default function DashboardContent() {
  return (
      <div className="p-6 overflow-y-auto flex-grow">
            {/* Summary Cards */}
            <SummaryCards />

            {/* Revenue Graphs */}
            <RevenueGraphs />

            {/* Recent Booking Requests */}
            <RecentBookingRequests />
          </div>
  )
}

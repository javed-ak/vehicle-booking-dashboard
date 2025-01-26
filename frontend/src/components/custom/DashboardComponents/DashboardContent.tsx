import RecentBookingRequests from "./RecentBookingRequests";
import RevenueGraphs from "./RevenueGraphs";
import SummaryCards from "./SummaryCards";

export default function DashboardContent({ setSlide }: { setSlide: any }) {
  return (
    <div className="p-6 overflow-y-auto flex-grow">
      <SummaryCards />
      <RevenueGraphs />
      <RecentBookingRequests setSlide={setSlide} />
    </div>
  )
}

import { LayoutDashboard, CalendarCheck, Car, FileSpreadsheet } from 'lucide-react';
import { useState } from 'react';
import { useDashboard } from '@/hooks';
import AllBookingRequests from './AllBookingRequests';
import DashboardContent from '@/components/custom/DashboardComponents/DashboardContent';
import Header from '@/components/custom/DashboardComponents/Header';

const BookingDashboard = () => {
  const [newRequests, setNewRequests] = useState(5);
  const { loading, dashboardData } = useDashboard();

  const [slide, setSlide] = useState(1)

  if (loading) {
    return <div>
      Loading...
    </div>
  }

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <div className="w-64 bg-slate-900 text-white p-4 space-y-4">
        <div className="text-2xl font-bold mb-8 text-center">
          Admin Dashboard
        </div>
        <div className={`flex items-center p-3 rounded cursor-pointer active:bg-zinc-700 text-white hover:bg-zinc-500`} onClick={() => {
          setSlide(1);
        }}>
          <div className="mr-3"><LayoutDashboard /></div>
          <span className="flex-grow">Dashboard</span>
        </div>
        <div className={`flex items-center p-3 rounded cursor-pointer active:bg-zinc-700 text-white hover:bg-zinc-500`} onClick={() => {
          setSlide(2);
        }}>
          <div className="mr-3"><CalendarCheck /></div>
          <span className="flex-grow">Booking Requests</span>
          <span className="bg-red-500 text-white rounded-full px-2 py-1 text-xs">
            {newRequests}
          </span>
        </div>
        <div className={`flex items-center p-3 rounded cursor-pointer active:bg-zinc-700 text-white hover:bg-zinc-500`} onClick={() => {
          setSlide(3);
        }}>
          <div className="mr-3"><Car /></div>
          <span className="flex-grow">Vehicle</span>
        </div>
        <div className={`flex items-center p-3 rounded cursor-pointer active:bg-zinc-700 text-white hover:bg-zinc-500`} onClick={() => {
          setSlide(4);
        }}>
          <div className="mr-3"><FileSpreadsheet /></div>
          <span className="flex-grow">Report</span>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-grow flex flex-col">
        {/* Header */}
        <Header />

        {/* Dashboard Content */}
        {slide == 1 && <DashboardContent />}
        {slide == 2 && <AllBookingRequests />}
      </div>
    </div>
  )
};

export default BookingDashboard;
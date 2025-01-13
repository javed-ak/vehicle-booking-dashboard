import { LayoutDashboard, CalendarCheck, Car, FileSpreadsheet, User } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useDashboard, useRequests } from '@/hooks';
import AllBookingRequests from './AllBookingRequests';
import DashboardContent from '@/components/custom/DashboardComponents/DashboardContent';
import Header from '@/components/custom/DashboardComponents/Header';
import AdminManagement from '@/components/custom/DashboardComponents/AdminManagement';
import axios from 'axios';
import AddVehicle from '@/components/custom/DashboardComponents/VehicleManagement';
import Loader from '@/components/custom/Loader';
import { useNavigate } from 'react-router-dom';
import { UserDataProvider } from '@/context/userContext';
import { BACKEND_URL } from "@/config";
const BookingDashboard = () => {
  const { requests } = useRequests();
  const { loading, dashboardData } = useDashboard();
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/signin');
    }
  }, []);

  function handleDownloadReport() {
    axios.get(`${BACKEND_URL}/api/v1/booking/report`, { responseType: 'arraybuffer' })
      .then((response) => {

        const blob = new Blob([response.data], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });

        const url = window.URL.createObjectURL(blob);

        const link = document.createElement("a");

        link.href = url;
        link.setAttribute("download", "Booking_Report.xlsx");

        document.body.appendChild(link);

        link.click();

        document.body.removeChild(link);

      })
      .catch((error) => {
        console.error("Error downloading the report:", error);
      });

  }

  const [slide, setSlide] = useState(1)

  if (loading) {
    return <div className='h-screen justify-center flex items-center text-xl'>
      <Loader />
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
        <div className={`flex items-center p-3 rounded cursor-pointer active:bg-zinc-700 text-white hover:bg-zinc-500`}
          onClick={() => {
            setSlide(2);
          }}>
          <div className="mr-3"><CalendarCheck /></div>
          <span className="flex-grow">Booking Requests</span>
          <span className={`bg-red-500 text-white rounded-full px-2 py-1 text-xs
          ${slide === 2 || requests == 0 ? 'hidden' : 'block'}`}>
            {requests}
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
          <div className="mr-3"><User /></div>
          <span className="flex-grow">Admin</span>
        </div>

        <div className={`flex items-center p-3 rounded cursor-pointer active:bg-zinc-700 text-white hover:bg-zinc-500`} onClick={handleDownloadReport}
        >
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
        {slide == 3 && <AddVehicle />}
        {slide == 4 && <AdminManagement />}
      </div>
    </div>
  )
};

export default function BookingDashboardComponent() {
  return (
    <UserDataProvider>
      <BookingDashboard />
    </UserDataProvider>
  );
}
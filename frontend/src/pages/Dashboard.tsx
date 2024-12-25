import { LayoutDashboard, CalendarCheck, Bell, Users, BarChart, User, LogOut, Settings, DollarSign, CheckCircle, XCircle, Car, FileSpreadsheet } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { ResponsiveContainer, BarChart as RechartsBarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useDashboard } from '@/hooks';

// Booking requests data
const allBookingRequests = [
  {
    id: 1,
    name: 'John Doe',
    date: '2024-06-15',
    status: 'Pending',
    details: 'Wedding Venue Booking',
    revenue: 5000
  },
  {
    id: 2,
    name: 'Jane Smith',
    date: '2024-06-14',
    status: 'Approved',
    details: 'Corporate Event',
    revenue: 7500
  },
  {
    id: 3,
    name: 'Alex Johnson',
    date: '2024-06-13',
    status: 'Pending',
    details: 'Birthday Party',
    revenue: 3500
  },
  {
    id: 4,
    name: 'Emily Brown',
    date: '2024-06-12',
    status: 'Rejected',
    details: 'Graduation Ceremony',
    revenue: 4200
  },
  {
    id: 5,
    name: 'Michael Wilson',
    date: '2024-06-11',
    status: 'Approved',
    details: 'Anniversary Celebration',
    revenue: 6000
  },
  {
    id: 6,
    name: 'Sarah Thompson',
    date: '2024-06-10',
    status: 'Pending',
    details: 'Charity Gala',
    revenue: 8500
  }
];

// Revenue data
const monthlyRevenueData = [
  { month: 'Jan', revenue: 12500 },
  { month: 'Feb', revenue: 15200 },
  { month: 'Mar', revenue: 18700 },
  { month: 'Apr', revenue: 22300 },
  { month: 'May', revenue: 19800 },
  { month: 'Jun', revenue: 25600 }
];

const yearlyRevenueData = [
  { year: '2022', revenue: 150000 },
  { year: '2023', revenue: 225000 },
  { year: '2024', revenue: 310000 }
];

const BookingDashboard = () => {
  const [newRequests, setNewRequests] = useState(5);
  const [activeView, setActiveView] = useState('dashboard');
  const { loading, dashboardData } = useDashboard()

  // Admin user details
  const adminUser = {
    name: 'Javed Akhtar',
    email: 'javedakhtar@gmail.com',
    role: 'Super Admin',
    avatar: '/path/to/avatar.jpg'
  };

  // Sidebar items
  const sidebarItems = [
    {
      icon: <LayoutDashboard />,
      label: 'Dashboard',
      view: 'dashboard'
    },
    {
      icon: <CalendarCheck />,
      label: 'Booking Requests',
      view: 'requests',
      notifications: newRequests
    }
  ];

  // Calculate summary statistics
  const totalBookings = dashboardData.length;
  const approvedBookings = dashboardData.filter(req => req.status === 'Approved').length;
  const rejectedBookings = dashboardData.filter(req => req.status === 'Rejected').length;
  const totalRevenue = allBookingRequests.reduce((sum, req) => sum + req.revenue, 0);
  const [slide, setSlide] = useState(1)

  // Logout handler
  const handleLogout = () => {
    console.log('Logging out');
  };

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
        {/* {sidebarItems.map((item) => (
          <div
            key={item.view}
            className={`flex items-center p-3 rounded cursor-pointer 
              ${activeView === item.view
                ? 'bg-zinc-700 text-white'
                : 'hover:bg-zinc-500'
              }`}
            onClick={() => setActiveView(item.view)}
          >
            <div className="mr-3">{item.icon}</div>
            <span className="flex-grow">{item.label}</span>
            {item.notifications && (
              <span className="bg-red-500 text-white rounded-full px-2 py-1 text-xs">
                {item.notifications}
              </span>
            )}
          </div>
        ))} */}
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
          <span className="flex-grow">Add Vehicle</span>
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
        <div className="bg-white shadow-sm p-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-800">Dashboard</h1>
          <div className="flex items-center space-x-4">
            <div className="relative">
              <Bell
                className={`h-6 w-6 ${newRequests > 0 ? 'text-orange-400 animate-bounce' : 'text-gray-500'}`}
              />
              {newRequests > 0 && (
                <span className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full px-2 py-1 text-xs">
                  {newRequests}
                </span>
              )}
            </div>

            {/* Admin Profile Dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Avatar className="cursor-pointer">
                  <AvatarImage src={adminUser.avatar} alt={adminUser.name} />
                  <AvatarFallback className="bg-orange-400 text-white">
                    {adminUser.name.split(' ').map(name => name[0]).join('')}
                  </AvatarFallback>
                </Avatar>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56">
                <DropdownMenuLabel>
                  <div className="flex flex-col">
                    <span className="font-medium">{adminUser.name}</span>
                    <span className="text-xs text-gray-500">{adminUser.email}</span>
                    <span className="text-xs text-orange-600">{adminUser.role}</span>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem>
                  <User className="mr-2 h-4 w-4" />
                  <span>Profile</span>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Settings className="mr-2 h-4 w-4" />
                  <span>Settings</span>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  className="text-red-600 focus:text-red-600"
                  onSelect={handleLogout}
                >
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Logout</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        {/* Dashboard Content */}
        {slide == 1 && (
          <div className="p-6 overflow-y-auto flex-grow">
            {/* Summary Cards */}
            <div className="grid grid-cols-3 gap-4 mb-6">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Requests</CardTitle>
                  <CalendarCheck className="h-4 w-4 text-green-500" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-orange-500">{totalBookings}</div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Accepted Requests</CardTitle>
                  <CheckCircle className="h-4 w-4 text-green-500" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-green-600">{approvedBookings}</div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Rejected Requests</CardTitle>
                  <XCircle className="h-4 w-4 text-red-500" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-red-600">{rejectedBookings}</div>
                </CardContent>
              </Card>
            </div>

            {/* Revenue Graphs */}
            <div className="grid grid-cols-2 gap-6 mb-6">
              <Card>
                <CardHeader>
                  <CardTitle>Weekly Bookings</CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <RechartsBarChart data={monthlyRevenueData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="month" />
                      <YAxis />
                      <Tooltip formatter={(value) => [`₹${value}`, 'Revenue']} />
                      <Bar dataKey="revenue" fill="#fb923c" />
                    </RechartsBarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle>Monthly Bookings</CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <RechartsBarChart data={yearlyRevenueData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="year" />
                      <YAxis />
                      <Tooltip formatter={(value) => [`₹${value}`, 'Revenue']} />
                      <Bar dataKey="revenue" fill="#fb923c" />
                    </RechartsBarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </div>

            {/* Recent Booking Requests */}
            <Card>
              <CardHeader>
                <CardTitle>Recent Booking Requests</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {dashboardData.slice(0, 5).map((request) => (
                    <div
                      key={request.id}
                      className="flex justify-between items-center p-4 bg-gray-100 rounded"
                    >
                      <div>
                        <div className="font-semibold">{request.firstName}</div>
                        <div className="text-sm text-gray-500">{request.vehicle}</div>
                      </div>
                      <div className="flex items-center space-x-4">
                        <div className="text-sm font-medium">{request.dateTime}</div>
                        <Button
                          variant="outline"
                          size="sm"
                          className={`
                          ${request.status === 'Pending'
                              ? 'text-orange-400 border-orange-400 hover:bg-orange-50'
                              : request.status === 'Approved'
                                ? 'text-green-500 border-green-500 hover:bg-green-50'
                                : 'text-red-500 border-red-500 hover:bg-red-50'
                            }`}
                        >
                          {request.status}
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        )}
        {slide == 2 && (
          <div className="p-6 overflow-y-auto flex-grow">
            {/* Recent Booking Requests */}
            <Card>
              <CardHeader>
                <CardTitle>Booking Requests</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {dashboardData.map((request) => (
                    <Link to={`/booking/${request.id}`}>
                      <div
                      key={request.id}
                      className="flex justify-between items-center p-4 my-4 bg-gray-100 rounded"
                    >
                      <div>
                        <div className="font-semibold">{request.firstName} {request.lastName}</div>
                        <div className="text-sm text-gray-500">{request.vehicle}</div>
                      </div>
                      <div className="flex items-center space-x-4">
                        <div className="text-sm font-medium">{request.dateTime}</div>
                        <Button
                          variant="outline"
                          size="sm"
                          className={`
                          ${request.status === 'Pending'
                              ? 'text-orange-400 border-orange-400 hover:bg-orange-50'
                              : request.status === 'Approved'
                                ? 'text-green-500 border-green-500 hover:bg-green-50'
                                : 'text-red-500 border-red-500 hover:bg-red-50'
                            }`}
                        >
                          {request.status}
                        </Button>
                      </div>
                    </div>
                    </Link>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  )
};

export default BookingDashboard;
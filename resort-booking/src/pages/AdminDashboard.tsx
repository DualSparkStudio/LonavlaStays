import React, { useState } from 'react';
import { Routes, Route, Link, useLocation } from 'react-router-dom';
import { 
  ChartBarIcon,
  CalendarDaysIcon,
  UserGroupIcon,
  HomeIcon,
  CurrencyDollarIcon,
  Cog6ToothIcon,
  DocumentTextIcon
} from '@heroicons/react/24/outline';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from 'recharts';
import { cn } from '../utils/cn';

const AdminDashboard: React.FC = () => {
  const location = useLocation();
  const [selectedPeriod, setSelectedPeriod] = useState('month');

  const navigation = [
    { name: 'Overview', href: '/admin', icon: ChartBarIcon },
    { name: 'Bookings', href: '/admin/bookings', icon: CalendarDaysIcon },
    { name: 'Rooms', href: '/admin/rooms', icon: HomeIcon },
    { name: 'Users', href: '/admin/users', icon: UserGroupIcon },
    { name: 'Revenue', href: '/admin/revenue', icon: CurrencyDollarIcon },
    { name: 'Reports', href: '/admin/reports', icon: DocumentTextIcon },
    { name: 'Settings', href: '/admin/settings', icon: Cog6ToothIcon },
  ];

  // Mock data for analytics
  const stats = {
    totalBookings: 1247,
    totalRevenue: 485600,
    occupancyRate: 84.5,
    averageRating: 4.8,
    newUsersThisMonth: 156,
    bookingsThisMonth: 203,
    revenueThisMonth: 89400,
    topRoomTypes: [
      { name: 'Ocean View Suite', bookings: 89, revenue: 40050 },
      { name: 'Garden Villa', bookings: 67, revenue: 21440 },
      { name: 'Deluxe Room', bookings: 47, revenue: 8460 }
    ]
  };

  const monthlyData = [
    { month: 'Jan', revenue: 45000, bookings: 120, occupancy: 78 },
    { month: 'Feb', revenue: 52000, bookings: 140, occupancy: 82 },
    { month: 'Mar', revenue: 48000, bookings: 125, occupancy: 80 },
    { month: 'Apr', revenue: 65000, bookings: 180, occupancy: 85 },
    { month: 'May', revenue: 72000, bookings: 195, occupancy: 88 },
    { month: 'Jun', revenue: 89400, bookings: 203, occupancy: 84 },
  ];

  const occupancyData = [
    { name: 'Occupied', value: 84, color: '#FF385C' },
    { name: 'Available', value: 16, color: '#E5E7EB' }
  ];

  const recentBookings = [
    { id: 'RST001234', guest: 'Sarah Johnson', room: 'Ocean View Suite', checkIn: '2024-01-15', checkOut: '2024-01-18', status: 'confirmed', amount: 1350 },
    { id: 'RST001235', guest: 'Michael Chen', room: 'Garden Villa', checkIn: '2024-01-16', checkOut: '2024-01-20', status: 'confirmed', amount: 1280 },
    { id: 'RST001236', guest: 'Emily Davis', room: 'Deluxe Room', checkIn: '2024-01-17', checkOut: '2024-01-19', status: 'pending', amount: 360 },
    { id: 'RST001237', guest: 'David Wilson', room: 'Ocean View Suite', checkIn: '2024-01-18', checkOut: '2024-01-22', status: 'confirmed', amount: 1800 },
    { id: 'RST001238', guest: 'Lisa Brown', room: 'Garden Villa', checkIn: '2024-01-19', checkOut: '2024-01-21', status: 'cancelled', amount: 640 },
  ];

  const isActive = (path: string) => {
    if (path === '/admin' && location.pathname === '/admin') return true;
    if (path !== '/admin' && location.pathname.startsWith(path)) return true;
    return false;
  };

  const DashboardOverview = () => (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <CalendarDaysIcon className="h-8 w-8 text-airbnb-red" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Bookings</p>
              <p className="text-2xl font-bold text-gray-900">{stats.totalBookings.toLocaleString()}</p>
            </div>
          </div>
          <div className="mt-4">
            <div className="flex items-center text-sm">
              <span className="text-green-600 font-medium">+{stats.bookingsThisMonth}</span>
              <span className="text-gray-500 ml-2">this month</span>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <CurrencyDollarIcon className="h-8 w-8 text-green-500" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Revenue</p>
              <p className="text-2xl font-bold text-gray-900">${stats.totalRevenue.toLocaleString()}</p>
            </div>
          </div>
          <div className="mt-4">
            <div className="flex items-center text-sm">
              <span className="text-green-600 font-medium">+${stats.revenueThisMonth.toLocaleString()}</span>
              <span className="text-gray-500 ml-2">this month</span>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <HomeIcon className="h-8 w-8 text-blue-500" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Occupancy Rate</p>
              <p className="text-2xl font-bold text-gray-900">{stats.occupancyRate}%</p>
            </div>
          </div>
          <div className="mt-4">
            <div className="flex items-center text-sm">
              <span className="text-green-600 font-medium">+2.5%</span>
              <span className="text-gray-500 ml-2">from last month</span>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <UserGroupIcon className="h-8 w-8 text-purple-500" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">New Users</p>
              <p className="text-2xl font-bold text-gray-900">{stats.newUsersThisMonth}</p>
            </div>
          </div>
          <div className="mt-4">
            <div className="flex items-center text-sm">
              <span className="text-green-600 font-medium">+12%</span>
              <span className="text-gray-500 ml-2">from last month</span>
            </div>
          </div>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Revenue Chart */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-900">Revenue Overview</h3>
            <select 
              value={selectedPeriod}
              onChange={(e) => setSelectedPeriod(e.target.value)}
              className="text-sm border border-gray-300 rounded-lg px-3 py-1"
            >
              <option value="week">This Week</option>
              <option value="month">This Month</option>
              <option value="year">This Year</option>
            </select>
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={monthlyData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip formatter={(value) => [`$${value.toLocaleString()}`, 'Revenue']} />
              <Line type="monotone" dataKey="revenue" stroke="#FF385C" strokeWidth={3} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Occupancy Chart */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-6">Current Occupancy</h3>
          <div className="flex items-center justify-center">
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={occupancyData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={120}
                  dataKey="value"
                >
                  {occupancyData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => [`${value}%`, 'Occupancy']} />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="flex justify-center mt-4">
            <div className="text-center">
              <div className="text-3xl font-bold text-gray-900">{stats.occupancyRate}%</div>
              <div className="text-sm text-gray-600">Currently Occupied</div>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Bookings */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">Recent Bookings</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Booking ID
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Guest
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Room
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Check-in
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Amount
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {recentBookings.map((booking) => (
                <tr key={booking.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {booking.id}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {booking.guest}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                    {booking.room}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                    {new Date(booking.checkIn).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={cn(
                      'inline-flex px-2 py-1 text-xs font-semibold rounded-full',
                      booking.status === 'confirmed' && 'bg-green-100 text-green-800',
                      booking.status === 'pending' && 'bg-yellow-100 text-yellow-800',
                      booking.status === 'cancelled' && 'bg-red-100 text-red-800'
                    )}>
                      {booking.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    ${booking.amount}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="flex">
        {/* Sidebar */}
        <div className="hidden md:flex md:w-64 md:flex-col">
          <div className="flex flex-col flex-grow pt-8 bg-white overflow-y-auto border-r border-gray-200">
            <div className="flex items-center flex-shrink-0 px-6">
              <div className="flex items-center">
                <div className="h-8 w-8 bg-gradient-airbnb rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-sm">A</span>
                </div>
                <span className="ml-2 text-lg font-bold text-gray-900">Admin Panel</span>
              </div>
            </div>
            <div className="mt-8 flex-grow flex flex-col">
              <nav className="flex-1 px-4 space-y-1">
                {navigation.map((item) => (
                  <Link
                    key={item.name}
                    to={item.href}
                    className={cn(
                      'group flex items-center px-2 py-2 text-sm font-medium rounded-md transition-colors',
                      isActive(item.href)
                        ? 'bg-airbnb-red text-white'
                        : 'text-gray-700 hover:text-gray-900 hover:bg-gray-100'
                    )}
                  >
                    <item.icon
                      className={cn(
                        'mr-3 flex-shrink-0 h-5 w-5',
                        isActive(item.href) ? 'text-white' : 'text-gray-400 group-hover:text-gray-500'
                      )}
                    />
                    {item.name}
                  </Link>
                ))}
              </nav>
            </div>
          </div>
        </div>

        {/* Main content */}
        <div className="flex flex-col flex-1">
          <main className="flex-1">
            <div className="py-8">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
                <Routes>
                  <Route path="/" element={<DashboardOverview />} />
                  <Route path="/bookings" element={
                    <div>
                      <h1 className="text-2xl font-semibold text-gray-900 mb-6">Bookings Management</h1>
                      <p className="text-gray-600">Bookings management interface will be implemented here.</p>
                    </div>
                  } />
                  <Route path="/rooms" element={
                    <div>
                      <h1 className="text-2xl font-semibold text-gray-900 mb-6">Rooms Management</h1>
                      <p className="text-gray-600">Rooms management interface will be implemented here.</p>
                    </div>
                  } />
                  <Route path="/users" element={
                    <div>
                      <h1 className="text-2xl font-semibold text-gray-900 mb-6">Users Management</h1>
                      <p className="text-gray-600">Users management interface will be implemented here.</p>
                    </div>
                  } />
                  <Route path="/revenue" element={
                    <div>
                      <h1 className="text-2xl font-semibold text-gray-900 mb-6">Revenue Analytics</h1>
                      <p className="text-gray-600">Revenue analytics will be implemented here.</p>
                    </div>
                  } />
                  <Route path="/reports" element={
                    <div>
                      <h1 className="text-2xl font-semibold text-gray-900 mb-6">Reports</h1>
                      <p className="text-gray-600">Reports interface will be implemented here.</p>
                    </div>
                  } />
                  <Route path="/settings" element={
                    <div>
                      <h1 className="text-2xl font-semibold text-gray-900 mb-6">Settings</h1>
                      <p className="text-gray-600">Settings interface will be implemented here.</p>
                    </div>
                  } />
                </Routes>
              </div>
            </div>
          </main>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard; 
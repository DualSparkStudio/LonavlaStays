import React, { useState } from 'react';
import { Bars3Icon, XMarkIcon } from '@heroicons/react/24/outline';
import { BrowserRouter as Router, Routes, Route, Link, useNavigate, Navigate, useParams } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import AnimatedSection from './components/ui/AnimatedSection';
import PublicLayout from './components/layout/PublicLayout';
import ScrollToTop from './components/layout/ScrollToTop';
import { BRAND_TAGLINE, demoRooms } from './data/resort';
import RoomsPage from './pages/RoomsPage';
import RoomDetailPage from './pages/RoomDetailPage';
import FacilitiesPage from './pages/FacilitiesPage';
import AboutPage from './pages/AboutPage';
import ContactPage from './pages/ContactPage';
import UserBookingsPage from './pages/UserBookingsPage';
import BookingPage from './pages/BookingPage';

// Demo bookings for admin
const demoAdminBookings = [
  {
    id: '1',
    room: demoRooms[0],
    guestName: 'John Smith',
    guestEmail: 'john.smith@email.com',
    checkIn: '2024-02-15',
    checkOut: '2024-02-18',
    guests: 2,
    total: 1485,
    status: 'confirmed',
    bookingRef: 'RB123456',
    bookedAt: '2024-01-20',
    phone: '+1 555-0123'
  },
  {
    id: '2',
    room: demoRooms[1],
    guestName: 'Sarah Johnson',
    guestEmail: 'sarah.j@email.com',
    checkIn: '2024-03-10',
    checkOut: '2024-03-14',
    guests: 4,
    total: 1280,
    status: 'pending',
    bookingRef: 'RB123457',
    bookedAt: '2024-01-25',
    phone: '+1 555-0124'
  },
  {
    id: '3',
    room: demoRooms[2],
    guestName: 'Michael Brown',
    guestEmail: 'mike.brown@email.com',
    checkIn: '2024-01-05',
    checkOut: '2024-01-08',
    guests: 6,
    total: 2550,
    status: 'completed',
    bookingRef: 'RB123458',
    bookedAt: '2023-12-15',
    phone: '+1 555-0125'
  }
];

// Demo users for admin
const demoUsers = [
  {
    id: '1',
    name: 'John Smith',
    email: 'john.smith@email.com',
    phone: '+1 555-0123',
    joinDate: '2023-06-15',
    totalBookings: 3,
    totalSpent: 4250,
    status: 'active'
  },
  {
    id: '2',
    name: 'Sarah Johnson',
    email: 'sarah.j@email.com',
    phone: '+1 555-0124',
    joinDate: '2023-08-22',
    totalBookings: 2,
    totalSpent: 1850,
    status: 'active'
  },
  {
    id: '3',
    name: 'Michael Brown',
    email: 'mike.brown@email.com',
    phone: '+1 555-0125',
    joinDate: '2023-05-10',
    totalBookings: 4,
    totalSpent: 6200,
    status: 'vip'
  }
];

const adminNavLinks = [
  { to: '/admin', page: 'dashboard', label: 'Dashboard' },
  { to: '/admin/rooms', page: 'rooms', label: 'Villas' },
  { to: '/admin/bookings', page: 'bookings', label: 'Bookings' },
  { to: '/admin/users', page: 'users', label: 'Users' },
  { to: '/admin/analytics', page: 'analytics', label: 'Analytics' },
] as const;

// Admin Header Component
const AdminHeader = ({ currentPage = 'dashboard' }: { currentPage?: string }) => {
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);

  const linkClass = (page: string) =>
    currentPage === page ? 'text-red-500' : 'text-gray-600 hover:text-gray-900';

  return (
    <header className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center min-h-16 py-2 md:py-0">
          <Link to="/admin" className="flex items-center min-w-0">
            <div className="h-8 w-8 shrink-0 bg-gradient-to-r from-red-500 to-pink-500 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-lg">⚙️</span>
            </div>
            <span className="ml-2 text-lg sm:text-xl font-bold text-gray-900 truncate">
              Resort<span className="text-red-500">Admin</span>
            </span>
          </Link>

          <nav className="hidden md:flex space-x-6 lg:space-x-8" aria-label="Admin">
            {adminNavLinks.map((item) => (
              <Link
                key={item.page}
                to={item.to}
                className={`${linkClass(item.page)} transition-colors text-sm lg:text-base`}
              >
                {item.label}
              </Link>
            ))}
          </nav>

          <div className="hidden md:flex items-center gap-3 shrink-0">
            <Link to="/" className="text-gray-600 hover:text-gray-900 font-medium transition-colors text-sm">
              View Site
            </Link>
            <button
              type="button"
              onClick={() => navigate('/admin/login')}
              className="bg-gray-200 hover:bg-gray-300 text-gray-800 px-4 py-2 rounded-full font-medium transition-colors text-sm"
            >
              Logout
            </button>
          </div>

          <button
            type="button"
            className="md:hidden inline-flex items-center justify-center h-10 w-10 rounded-lg border border-gray-200 text-gray-800"
            onClick={() => setMobileOpen((o) => !o)}
            aria-expanded={mobileOpen}
            aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
          >
            {mobileOpen ? <XMarkIcon className="h-6 w-6" /> : <Bars3Icon className="h-6 w-6" />}
          </button>
        </div>

        {mobileOpen && (
          <nav className="md:hidden border-t border-gray-200 py-3 space-y-1" aria-label="Admin mobile">
            {adminNavLinks.map((item) => (
              <Link
                key={item.page}
                to={item.to}
                onClick={() => setMobileOpen(false)}
                className={`block rounded-lg px-3 py-2.5 font-medium ${linkClass(item.page)}`}
              >
                {item.label}
              </Link>
            ))}
            <Link
              to="/"
              onClick={() => setMobileOpen(false)}
              className="block rounded-lg px-3 py-2.5 font-medium text-gray-600 hover:text-gray-900"
            >
              View Site
            </Link>
            <button
              type="button"
              onClick={() => {
                setMobileOpen(false);
                navigate('/admin/login');
              }}
              className="w-full text-left rounded-lg px-3 py-2.5 font-medium text-gray-800 bg-gray-100"
            >
              Logout
            </button>
          </nav>
        )}
      </div>
    </header>
  );
};

// Admin Login Component - Fixed functionality
const AdminLogin = () => {
  const navigate = useNavigate();
  const [credentials, setCredentials] = useState({ username: '', password: '' });
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    // Simulate loading
    await new Promise(resolve => setTimeout(resolve, 1000));

    // Simple demo login - in real app, validate against backend
    if (credentials.username === 'admin' && credentials.password === 'admin123') {
      navigate('/admin');
    } else {
      setError('Invalid credentials. Please check your username and password.');
    }
    setIsLoading(false);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="bg-white p-8 rounded-xl shadow-md max-w-md w-full">
        <div className="text-center mb-8">
          <div className="h-12 w-12 bg-gradient-to-r from-red-500 to-pink-500 rounded-lg flex items-center justify-center mx-auto mb-4">
            <span className="text-white font-bold text-2xl">⚙️</span>
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Admin Login</h2>
          <p className="text-gray-600">Sign in to access the admin dashboard</p>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg">
            {error}
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Username</label>
            <input
              type="text"
              required
              value={credentials.username}
              onChange={(e) => setCredentials({...credentials, username: e.target.value})}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500"
              placeholder="Enter username"
              disabled={isLoading}
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
            <input
              type="password"
              required
              value={credentials.password}
              onChange={(e) => setCredentials({...credentials, password: e.target.value})}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500"
              placeholder="Enter password"
              disabled={isLoading}
            />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-red-500 hover:bg-red-600 disabled:bg-red-300 disabled:cursor-not-allowed text-white font-medium py-3 rounded-lg transition-colors flex items-center justify-center"
          >
            {isLoading ? (
              <>
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Signing in...
              </>
            ) : (
              'Sign In'
            )}
          </button>
        </form>

        <div className="mt-6 p-4 bg-gray-50 rounded-lg">
          <p className="text-sm text-gray-600 text-center">
            <strong>Demo Credentials:</strong><br />
            Username: <code className="bg-white px-1 rounded">admin</code><br />
            Password: <code className="bg-white px-1 rounded">admin123</code>
          </p>
        </div>

        <div className="mt-6 text-center">
          <Link to="/" className="text-red-500 hover:text-red-600 text-sm font-medium">
            ← Back to Website
          </Link>
        </div>
      </div>
    </div>
  );
};

// Public Login Page - Fixed functionality
const PublicLogin = () => {
  const navigate = useNavigate();
  const [isSignUp, setIsSignUp] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    firstName: '',
    lastName: '',
    confirmPassword: ''
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setIsLoading(true);

    // Simulate loading
    await new Promise(resolve => setTimeout(resolve, 1000));

    if (isSignUp) {
      // Sign up validation
      if (formData.password !== formData.confirmPassword) {
        setError('Passwords do not match');
        setIsLoading(false);
        return;
      }
      if (formData.password.length < 6) {
        setError('Password must be at least 6 characters');
        setIsLoading(false);
        return;
      }
      // Check if signing up with admin email
      const isAdminEmail = formData.email.toLowerCase().includes('admin');
      if (isAdminEmail) {
        setSuccess('Admin account created successfully! You can now sign in with admin privileges.');
      } else {
        setSuccess('Account created successfully! You can now sign in.');
      }
      setIsSignUp(false);
      setFormData({ email: '', password: '', firstName: '', lastName: '', confirmPassword: '' });
    } else {
      // Sign in - demo functionality with admin check
      if (formData.email === 'user@demo.com' && formData.password === 'demo123') {
        setSuccess('Welcome back! Redirecting to dashboard...');
        setTimeout(() => navigate('/bookings'), 2000);
      } else if (formData.email === 'admin@demo.com' && formData.password === 'admin123') {
        setSuccess('Admin login successful! Redirecting to admin panel...');
        setTimeout(() => navigate('/admin'), 2000);
      } else {
        setError('Invalid email or password. Try: user@demo.com/demo123 or admin@demo.com/admin123');
      }
    }
    setIsLoading(false);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="bg-white p-8 rounded-xl shadow-md max-w-md w-full">
        <div className="text-center mb-8">
          <div className="h-12 w-12 bg-gradient-to-r from-red-500 to-pink-500 rounded-lg flex items-center justify-center mx-auto mb-4">
            <span className="text-white font-bold text-2xl">🏨</span>
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            {isSignUp ? 'Create Account' : 'Welcome Back'}
          </h2>
          <p className="text-gray-600">
            {isSignUp ? 'Join ResortStay to book your perfect getaway' : 'Sign in to your ResortStay account'}
          </p>
          {isSignUp && (
            <p className="text-xs text-gray-500 mt-2">
              💡 Tip: Use an email containing "admin" to create an admin account
            </p>
          )}
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg">
            {error}
          </div>
        )}

        {success && (
          <div className="mb-6 p-4 bg-green-100 border border-green-400 text-green-700 rounded-lg">
            {success}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {isSignUp && (
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">First Name</label>
                <input
                  type="text"
                  name="firstName"
                  required
                  value={formData.firstName}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500"
                  disabled={isLoading}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Last Name</label>
                <input
                  type="text"
                  name="lastName"
                  required
                  value={formData.lastName}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500"
                  disabled={isLoading}
                />
              </div>
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
            <input
              type="email"
              name="email"
              required
              value={formData.email}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500"
              placeholder="Enter your email"
              disabled={isLoading}
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
            <input
              type="password"
              name="password"
              required
              value={formData.password}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500"
              placeholder="Enter your password"
              disabled={isLoading}
            />
          </div>

          {isSignUp && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Confirm Password</label>
              <input
                type="password"
                name="confirmPassword"
                required
                value={formData.confirmPassword}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500"
                placeholder="Confirm your password"
                disabled={isLoading}
              />
            </div>
          )}

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-red-500 hover:bg-red-600 disabled:bg-red-300 disabled:cursor-not-allowed text-white font-medium py-3 rounded-lg transition-colors flex items-center justify-center"
          >
            {isLoading ? (
              <>
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                {isSignUp ? 'Creating Account...' : 'Signing In...'}
              </>
            ) : (
              isSignUp ? 'Create Account' : 'Sign In'
            )}
          </button>
        </form>

        <div className="mt-6 text-center">
          <button
            onClick={() => {
              setIsSignUp(!isSignUp);
              setError('');
              setSuccess('');
              setFormData({ email: '', password: '', firstName: '', lastName: '', confirmPassword: '' });
            }}
            className="text-red-500 hover:text-red-600 text-sm font-medium"
          >
            {isSignUp ? 'Already have an account? Sign in' : "Don't have an account? Sign up"}
          </button>
        </div>

        {!isSignUp && (
          <div className="mt-6 space-y-4">
            <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
              <p className="text-sm text-blue-800 text-center">
                <strong>👤 User Demo Login:</strong><br />
                Email: <code className="bg-white px-1 rounded">user@demo.com</code><br />
                Password: <code className="bg-white px-1 rounded">demo123</code>
              </p>
            </div>
            <div className="p-4 bg-red-50 rounded-lg border border-red-200">
              <p className="text-sm text-red-800 text-center">
                <strong>🔐 Admin Demo Login:</strong><br />
                Email: <code className="bg-white px-1 rounded">admin@demo.com</code><br />
                Password: <code className="bg-white px-1 rounded">admin123</code>
              </p>
            </div>
          </div>
        )}

        <div className="mt-6 text-center space-y-2">
          <Link to="/" className="block text-gray-500 hover:text-gray-700 text-sm font-medium">
            ← Back to Home
          </Link>
          <Link to="/admin/login" className="block text-red-500 hover:text-red-600 text-sm font-medium">
            🔐 Admin Login Portal
          </Link>
        </div>
      </div>
    </div>
  );
};

// Admin Dashboard Component
const AdminDashboard = () => {
  const navigate = useNavigate();

  const stats = [
    { label: 'Total Rooms', value: '3', icon: '🏨', color: 'blue', change: '+0%' },
    { label: 'Active Bookings', value: '2', icon: '📅', color: 'green', change: '+15%' },
    { label: 'Total Users', value: '3', icon: '👥', color: 'purple', change: '+8%' },
    { label: 'Revenue Today', value: '$1,485', icon: '💰', color: 'red', change: '+12%' },
  ];

  const recentBookings = demoAdminBookings.slice(0, 3);

  return (
    <div className="min-h-screen bg-gray-50">
      <AdminHeader currentPage="dashboard" />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Dashboard</h1>
          <p className="text-gray-600">Welcome back! Here's what's happening at your resort today.</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat, index) => (
            <div key={index} className="bg-white rounded-xl p-6 shadow-md">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">{stat.label}</p>
                  <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                  <p className={`text-sm ${stat.change.startsWith('+') ? 'text-green-600' : 'text-red-600'}`}>
                    {stat.change} from yesterday
                  </p>
                </div>
                <div className="text-3xl">{stat.icon}</div>
              </div>
            </div>
          ))}
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          <div className="bg-white rounded-xl p-6 shadow-md">
            <h3 className="text-lg font-semibold mb-4">Quick Actions</h3>
            <div className="grid grid-cols-2 gap-4">
              <button
                onClick={() => navigate('/admin/rooms')}
                className="bg-red-50 hover:bg-red-100 text-red-700 p-4 rounded-lg transition-colors text-center"
              >
                <div className="text-2xl mb-2">🏨</div>
                <div className="font-medium">Add Room</div>
              </button>
              <button
                onClick={() => navigate('/admin/bookings')}
                className="bg-blue-50 hover:bg-blue-100 text-blue-700 p-4 rounded-lg transition-colors text-center"
              >
                <div className="text-2xl mb-2">📋</div>
                <div className="font-medium">View Bookings</div>
              </button>
              <button
                onClick={() => navigate('/admin/users')}
                className="bg-green-50 hover:bg-green-100 text-green-700 p-4 rounded-lg transition-colors text-center"
              >
                <div className="text-2xl mb-2">👥</div>
                <div className="font-medium">Manage Users</div>
              </button>
              <button
                onClick={() => navigate('/admin/analytics')}
                className="bg-purple-50 hover:bg-purple-100 text-purple-700 p-4 rounded-lg transition-colors text-center"
              >
                <div className="text-2xl mb-2">📊</div>
                <div className="font-medium">View Analytics</div>
              </button>
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-md">
            <h3 className="text-lg font-semibold mb-4">Room Status</h3>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Available Rooms</span>
                <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-sm font-medium">2</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Occupied Rooms</span>
                <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-sm font-medium">0</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Maintenance</span>
                <span className="bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full text-sm font-medium">1</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Out of Order</span>
                <span className="bg-red-100 text-red-800 px-2 py-1 rounded-full text-sm font-medium">0</span>
              </div>
            </div>
          </div>
        </div>

        {/* Recent Bookings */}
        <div className="bg-white rounded-xl p-6 shadow-md">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-lg font-semibold">Recent Bookings</h3>
            <Link to="/admin/bookings" className="text-red-500 hover:text-red-600 font-medium">
              View All
            </Link>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-3 px-4 font-medium text-gray-700">Guest</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-700">Room</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-700">Dates</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-700">Status</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-700">Total</th>
                </tr>
              </thead>
              <tbody>
                {recentBookings.map(booking => (
                  <tr key={booking.id} className="border-b border-gray-100">
                    <td className="py-3 px-4">
                      <div>
                        <div className="font-medium text-gray-900">{booking.guestName}</div>
                        <div className="text-sm text-gray-500">{booking.guestEmail}</div>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <div className="font-medium text-gray-900">{booking.room.name}</div>
                      <div className="text-sm text-gray-500">{booking.room.location}</div>
                    </td>
                    <td className="py-3 px-4">
                      <div className="text-sm">
                        <div>{new Date(booking.checkIn).toLocaleDateString()}</div>
                        <div className="text-gray-500">to {new Date(booking.checkOut).toLocaleDateString()}</div>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        booking.status === 'confirmed' ? 'bg-green-100 text-green-800' :
                        booking.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-gray-100 text-gray-800'
                      }`}>
                        {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                      </span>
                    </td>
                    <td className="py-3 px-4 font-medium text-gray-900">${booking.total}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

// Add Room Form Component
const AddRoomForm = ({ onSubmit, onCancel }: { onSubmit: (room: any) => void; onCancel: () => void }) => {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price_per_night: '',
    max_guests: '',
    room_number: '',
    location: '',
    address: '',
    amenities: [],
    images: ['']
  });
  const [isLoading, setIsLoading] = useState(false);

  const availableAmenities = [
    'Private Pool', 'Ocean View', 'Wi-Fi', 'Air Conditioning', 'Room Service',
    'Minibar', 'Balcony', 'King Bed', 'Garden View', 'Kitchen', 'Living Area',
    'Twin Beds', 'Sofa Bed', 'Panoramic View', 'Private Terrace', 'Butler Service',
    'Jacuzzi', 'Wine Cellar', 'Private Elevator', 'Master Suite', 'Dining Room'
  ];

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleAmenityToggle = (amenity: string) => {
    setFormData(prev => ({
      ...prev,
      amenities: prev.amenities.includes(amenity)
        ? prev.amenities.filter(a => a !== amenity)
        : [...prev.amenities, amenity]
    }));
  };

  const handleImageChange = (index: number, value: string) => {
    setFormData(prev => ({
      ...prev,
      images: prev.images.map((img, i) => i === index ? value : img)
    }));
  };

  const addImageField = () => {
    setFormData(prev => ({
      ...prev,
      images: [...prev.images, '']
    }));
  };

  const removeImageField = (index: number) => {
    setFormData(prev => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index)
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));

    const newRoom = {
      ...formData,
      price_per_night: parseFloat(formData.price_per_night),
      max_guests: parseInt(formData.max_guests),
      images: formData.images.filter(img => img.trim() !== ''),
      amenities: formData.amenities
    };

    onSubmit(newRoom);
    setIsLoading(false);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Villa name</label>
          <input
            type="text"
            name="name"
            required
            value={formData.name}
            onChange={handleInputChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500"
            placeholder="e.g., Valley View Deluxe"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Villa code</label>
          <input
            type="text"
            name="room_number"
            required
            value={formData.room_number}
            onChange={handleInputChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500"
            placeholder="e.g., VL004"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Price per Night ($)</label>
          <input
            type="number"
            name="price_per_night"
            required
            min="0"
            step="0.01"
            value={formData.price_per_night}
            onChange={handleInputChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500"
            placeholder="450"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Max Guests</label>
          <input
            type="number"
            name="max_guests"
            required
            min="1"
            value={formData.max_guests}
            onChange={handleInputChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500"
            placeholder="4"
          />
        </div>

        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-1">Area / neighbourhood</label>
          <input
            type="text"
            name="location"
            required
            value={formData.location}
            onChange={handleInputChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500"
            placeholder="e.g., Tiger Valley, Lonavala"
          />
        </div>

        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-1">Street address</label>
          <input
            type="text"
            name="address"
            required
            value={formData.address}
            onChange={handleInputChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500"
            placeholder="Full villa address"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
        <textarea
          name="description"
          required
          rows={3}
          value={formData.description}
          onChange={handleInputChange}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500"
          placeholder="Describe the room features and benefits..."
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Amenities</label>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-2 max-h-40 overflow-y-auto border border-gray-200 rounded-lg p-3">
          {availableAmenities.map(amenity => (
            <label key={amenity} className="flex items-center">
              <input
                type="checkbox"
                checked={formData.amenities.includes(amenity)}
                onChange={() => handleAmenityToggle(amenity)}
                className="mr-2 text-red-500 focus:ring-red-500"
              />
              <span className="text-sm text-gray-700">{amenity}</span>
            </label>
          ))}
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Room Images (URLs)</label>
        <div className="space-y-2">
          {formData.images.map((image, index) => (
            <div key={index} className="flex gap-2">
              <input
                type="url"
                value={image}
                onChange={(e) => handleImageChange(index, e.target.value)}
                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500"
                placeholder="https://images.unsplash.com/photo-..."
              />
              {formData.images.length > 1 && (
                <button
                  type="button"
                  onClick={() => removeImageField(index)}
                  className="px-3 py-2 bg-red-100 text-red-600 rounded-lg hover:bg-red-200"
                >
                  Remove
                </button>
              )}
            </div>
          ))}
          <button
            type="button"
            onClick={addImageField}
            className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200"
          >
            + Add Image URL
          </button>
        </div>
      </div>

      <div className="flex justify-end space-x-4 pt-4 border-t">
        <button
          type="button"
          onClick={onCancel}
          className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={isLoading}
          className="px-6 py-2 bg-red-500 hover:bg-red-600 disabled:bg-red-300 text-white rounded-lg transition-colors flex items-center"
        >
          {isLoading ? (
            <>
              <svg className="animate-spin -ml-1 mr-3 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Adding villa...
            </>
          ) : (
            'Add villa'
          )}
        </button>
      </div>
    </form>
  );
};

// Admin Rooms Management
const AdminRooms = () => {
  const [rooms, setRooms] = useState(demoRooms);
  const [selectedRoom, setSelectedRoom] = useState<any>(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'available': return 'bg-green-100 text-green-800';
      case 'occupied': return 'bg-blue-100 text-blue-800';
      case 'maintenance': return 'bg-yellow-100 text-yellow-800';
      case 'out-of-order': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const updateRoomStatus = (roomId: string, newStatus: string) => {
    setRooms(rooms.map(room => 
      room.id === roomId ? { ...room, status: newStatus } : room
    ));
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <AdminHeader currentPage="rooms" />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Success Message */}
        {successMessage && (
          <div className="mb-6 p-4 bg-green-100 border border-green-400 text-green-700 rounded-lg flex items-center">
            <svg className="h-5 w-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
            {successMessage}
          </div>
        )}

        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Villa management</h1>
            <p className="text-gray-600">Manage multiple villas, locations, and availability</p>
          </div>
          <button 
            onClick={() => setShowAddModal(true)}
            className="bg-red-500 hover:bg-red-600 text-white px-6 py-2 rounded-lg transition-colors"
          >
            Add new villa
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {rooms.map(room => (
            <div key={room.id} className="bg-white rounded-xl overflow-hidden shadow-md">
              <img
                src={room.images[0]}
                alt={room.name}
                className="w-full h-48 object-cover"
              />
              <div className="p-6">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="text-lg font-semibold text-gray-900">{room.name}</h3>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(room.status)}`}>
                    {room.status.charAt(0).toUpperCase() + room.status.slice(1)}
                  </span>
                </div>
                <p className="text-gray-600 text-sm mb-2">{room.location}</p>
                <p className="text-gray-500 text-sm mb-4">{room.description}</p>
                
                <div className="flex justify-between items-center mb-4">
                  <div>
                    <span className="font-bold text-lg">₹{room.price_per_night.toLocaleString('en-IN')}</span>
                    <span className="text-gray-600 text-sm"> / night</span>
                  </div>
                  <div className="text-sm text-gray-500">
                    ⭐ {room.rating} ({room.review_count})
                  </div>
                </div>

                <div className="space-y-2">
                  <select 
                    value={room.status}
                    onChange={(e) => updateRoomStatus(room.id, e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                  >
                    <option value="available">Available</option>
                    <option value="occupied">Occupied</option>
                    <option value="maintenance">Maintenance</option>
                    <option value="out-of-order">Out of Order</option>
                  </select>
                  
                  <div className="flex space-x-2">
                    <button 
                      onClick={() => {setSelectedRoom(room); setShowEditModal(true);}}
                      className="flex-1 bg-blue-500 hover:bg-blue-600 text-white px-3 py-2 rounded-lg text-sm transition-colors"
                    >
                      Edit
                    </button>
                    <button className="flex-1 bg-gray-500 hover:bg-gray-600 text-white px-3 py-2 rounded-lg text-sm transition-colors">
                      View Details
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Add Room Modal */}
        {showAddModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6">
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-xl font-bold text-gray-900">Add new villa</h3>
                  <button 
                    onClick={() => setShowAddModal(false)}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>

                <AddRoomForm 
                  onSubmit={(newRoom) => {
                    const roomWithId = {
                      ...newRoom,
                      id: (rooms.length + 1).toString(),
                      address: newRoom.address || newRoom.location,
                      rating: 0,
                      review_count: 0,
                      status: 'available'
                    };
                    setRooms([...rooms, roomWithId]);
                    setShowAddModal(false);
                    setSuccessMessage(`Villa "${newRoom.name}" has been added successfully!`);
                    setTimeout(() => setSuccessMessage(''), 5000);
                  }}
                  onCancel={() => setShowAddModal(false)}
                />
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

// Admin Bookings Management
const AdminBookings = () => {
  const [bookings, setBookings] = useState(demoAdminBookings);
  const [filterStatus, setFilterStatus] = useState('all');

  const filteredBookings = filterStatus === 'all' 
    ? bookings 
    : bookings.filter(booking => booking.status === filterStatus);

  const updateBookingStatus = (bookingId: string, newStatus: string) => {
    setBookings(bookings.map(booking => 
      booking.id === bookingId ? { ...booking, status: newStatus } : booking
    ));
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed': return 'bg-green-100 text-green-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      case 'completed': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <AdminHeader currentPage="bookings" />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Booking Management</h1>
            <p className="text-gray-600">Manage all resort bookings and reservations</p>
          </div>
          <div className="flex space-x-4">
            <select 
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg"
            >
              <option value="all">All Bookings</option>
              <option value="pending">Pending</option>
              <option value="confirmed">Confirmed</option>
              <option value="completed">Completed</option>
              <option value="cancelled">Cancelled</option>
            </select>
            <button className="bg-red-500 hover:bg-red-600 text-white px-6 py-2 rounded-lg transition-colors">
              Export CSV
            </button>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-md overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="text-left py-3 px-6 font-medium text-gray-700">Booking ID</th>
                  <th className="text-left py-3 px-6 font-medium text-gray-700">Guest</th>
                  <th className="text-left py-3 px-6 font-medium text-gray-700">Room</th>
                  <th className="text-left py-3 px-6 font-medium text-gray-700">Dates</th>
                  <th className="text-left py-3 px-6 font-medium text-gray-700">Guests</th>
                  <th className="text-left py-3 px-6 font-medium text-gray-700">Total</th>
                  <th className="text-left py-3 px-6 font-medium text-gray-700">Status</th>
                  <th className="text-left py-3 px-6 font-medium text-gray-700">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredBookings.map(booking => (
                  <tr key={booking.id} className="border-b border-gray-100">
                    <td className="py-4 px-6">
                      <div className="font-medium text-gray-900">{booking.bookingRef}</div>
                      <div className="text-sm text-gray-500">
                        {new Date(booking.bookedAt).toLocaleDateString()}
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <div>
                        <div className="font-medium text-gray-900">{booking.guestName}</div>
                        <div className="text-sm text-gray-500">{booking.guestEmail}</div>
                        <div className="text-sm text-gray-500">{booking.phone}</div>
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <div className="font-medium text-gray-900">{booking.room.name}</div>
                      <div className="text-sm text-gray-500">{booking.room.location}</div>
                    </td>
                    <td className="py-4 px-6">
                      <div className="text-sm">
                        <div className="font-medium">{new Date(booking.checkIn).toLocaleDateString()}</div>
                        <div className="text-gray-500">to {new Date(booking.checkOut).toLocaleDateString()}</div>
                      </div>
                    </td>
                    <td className="py-4 px-6 text-center">
                      <span className="bg-gray-100 px-2 py-1 rounded-full text-sm">
                        {booking.guests}
                      </span>
                    </td>
                    <td className="py-4 px-6 font-semibold text-gray-900">${booking.total}</td>
                    <td className="py-4 px-6">
                      <select 
                        value={booking.status}
                        onChange={(e) => updateBookingStatus(booking.id, e.target.value)}
                        className={`px-2 py-1 rounded-full text-xs font-medium border-0 ${getStatusColor(booking.status)}`}
                      >
                        <option value="pending">Pending</option>
                        <option value="confirmed">Confirmed</option>
                        <option value="completed">Completed</option>
                        <option value="cancelled">Cancelled</option>
                      </select>
                    </td>
                    <td className="py-4 px-6">
                      <div className="flex space-x-2">
                        <button className="text-blue-600 hover:text-blue-800 text-sm font-medium">
                          View
                        </button>
                        <button className="text-green-600 hover:text-green-800 text-sm font-medium">
                          Edit
                        </button>
                        <button className="text-red-600 hover:text-red-800 text-sm font-medium">
                          Cancel
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

// Admin Users Management
const AdminUsers = () => {
  const [users, setUsers] = useState(demoUsers);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'vip': return 'bg-purple-100 text-purple-800';
      case 'suspended': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <AdminHeader currentPage="users" />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">User Management</h1>
            <p className="text-gray-600">Manage registered users and their accounts</p>
          </div>
          <button className="bg-red-500 hover:bg-red-600 text-white px-6 py-2 rounded-lg transition-colors">
            Add New User
          </button>
        </div>

        <div className="bg-white rounded-xl shadow-md overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="text-left py-3 px-6 font-medium text-gray-700">User</th>
                  <th className="text-left py-3 px-6 font-medium text-gray-700">Contact</th>
                  <th className="text-left py-3 px-6 font-medium text-gray-700">Join Date</th>
                  <th className="text-left py-3 px-6 font-medium text-gray-700">Bookings</th>
                  <th className="text-left py-3 px-6 font-medium text-gray-700">Total Spent</th>
                  <th className="text-left py-3 px-6 font-medium text-gray-700">Status</th>
                  <th className="text-left py-3 px-6 font-medium text-gray-700">Actions</th>
                </tr>
              </thead>
              <tbody>
                {users.map(user => (
                  <tr key={user.id} className="border-b border-gray-100">
                    <td className="py-4 px-6">
                      <div className="flex items-center">
                        <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center mr-3">
                          <span className="text-red-600 font-semibold">
                            {user.name.split(' ').map(n => n[0]).join('')}
                          </span>
                        </div>
                        <div>
                          <div className="font-medium text-gray-900">{user.name}</div>
                          <div className="text-sm text-gray-500">ID: {user.id}</div>
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <div>
                        <div className="text-sm text-gray-900">{user.email}</div>
                        <div className="text-sm text-gray-500">{user.phone}</div>
                      </div>
                    </td>
                    <td className="py-4 px-6 text-sm text-gray-900">
                      {new Date(user.joinDate).toLocaleDateString()}
                    </td>
                    <td className="py-4 px-6 text-center">
                      <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-sm font-medium">
                        {user.totalBookings}
                      </span>
                    </td>
                    <td className="py-4 px-6 font-semibold text-gray-900">
                      ${user.totalSpent.toLocaleString()}
                    </td>
                    <td className="py-4 px-6">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(user.status)}`}>
                        {user.status.charAt(0).toUpperCase() + user.status.slice(1)}
                      </span>
                    </td>
                    <td className="py-4 px-6">
                      <div className="flex space-x-2">
                        <button className="text-blue-600 hover:text-blue-800 text-sm font-medium">
                          View
                        </button>
                        <button className="text-green-600 hover:text-green-800 text-sm font-medium">
                          Edit
                        </button>
                        <button className="text-red-600 hover:text-red-800 text-sm font-medium">
                          Suspend
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

// Admin Analytics
const AdminAnalytics = () => {
  const monthlyRevenue = [
    { month: 'Jan', revenue: 45000, bookings: 28 },
    { month: 'Feb', revenue: 52000, bookings: 32 },
    { month: 'Mar', revenue: 48000, bookings: 30 },
    { month: 'Apr', revenue: 61000, bookings: 38 },
    { month: 'May', revenue: 55000, bookings: 34 },
    { month: 'Jun', revenue: 67000, bookings: 42 },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <AdminHeader currentPage="analytics" />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Analytics Dashboard</h1>
          <p className="text-gray-600">Track your resort's performance and key metrics</p>
        </div>

        {/* Revenue Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-xl p-6 shadow-md">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Revenue</p>
                <p className="text-2xl font-bold text-gray-900">$328,000</p>
                <p className="text-sm text-green-600">+12.5% from last month</p>
              </div>
              <div className="text-3xl">💰</div>
            </div>
          </div>
          
          <div className="bg-white rounded-xl p-6 shadow-md">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Occupancy Rate</p>
                <p className="text-2xl font-bold text-gray-900">87%</p>
                <p className="text-sm text-green-600">+5.2% from last month</p>
              </div>
              <div className="text-3xl">🏨</div>
            </div>
          </div>
          
          <div className="bg-white rounded-xl p-6 shadow-md">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Avg. Daily Rate</p>
                <p className="text-2xl font-bold text-gray-900">$475</p>
                <p className="text-sm text-red-600">-2.1% from last month</p>
              </div>
              <div className="text-3xl">📊</div>
            </div>
          </div>
          
          <div className="bg-white rounded-xl p-6 shadow-md">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Guest Satisfaction</p>
                <p className="text-2xl font-bold text-gray-900">4.8/5</p>
                <p className="text-sm text-green-600">+0.2 from last month</p>
              </div>
              <div className="text-3xl">⭐</div>
            </div>
          </div>
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="bg-white rounded-xl p-6 shadow-md">
            <h3 className="text-lg font-semibold mb-4">Monthly Revenue</h3>
            <div className="space-y-4">
              {monthlyRevenue.map((data, index) => (
                <div key={index} className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-600">{data.month}</span>
                  <div className="flex items-center space-x-4">
                    <div className="w-32 bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-red-500 h-2 rounded-full" 
                        style={{ width: `${(data.revenue / 70000) * 100}%` }}
                      ></div>
                    </div>
                    <span className="text-sm font-semibold text-gray-900">${data.revenue.toLocaleString()}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-md">
            <h3 className="text-lg font-semibold mb-4">Villa performance</h3>
            <div className="space-y-4">
              {demoRooms.map((room, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div>
                    <div className="font-medium text-gray-900">{room.name}</div>
                    <div className="text-sm text-gray-500">{room.location}</div>
                  </div>
                  <div className="text-right">
                    <div className="font-semibold text-gray-900">⭐ {room.rating}</div>
                    <div className="text-sm text-gray-500">{room.review_count} reviews</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// HomePage Component
const HomePage = () => {
  const [searchLocation, setSearchLocation] = useState('');
  const navigate = useNavigate();

  const handleRoomClick = (roomId: string) => {
    navigate(`/villas/${roomId}`);
  };

  return (
    <PublicLayout currentPage="home">
      {/* Hero Section */}
      <div className="relative bg-white overflow-hidden">
        <div className="hero-glow pointer-events-none absolute inset-0" aria-hidden />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 relative">
          <div className="text-center mb-8">
            <h1 className="font-heading text-4xl md:text-6xl font-normal tracking-wide text-gray-900 mb-4 motion-safe:animate-slide-up">
              Escape Into The Hills
            </h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto motion-safe:animate-fade-in [animation-delay:150ms] opacity-0 [animation-fill-mode:forwards]">
              {BRAND_TAGLINE}—browse private villas, each with its own home and hillside setting.
            </p>
          </div>

          {/* Search Bar */}
          <AnimatedSection variant="scale-in" delay={250} className="max-w-4xl mx-auto w-full">
            <div className="search-bar-shell bg-white rounded-2xl md:rounded-full shadow-lg border border-gray-200 p-3 md:p-2 motion-safe:animate-float">
              <div className="flex flex-col md:flex-row md:items-center md:divide-x md:divide-gray-300">
                <div className="flex-1 min-w-0 px-3 py-2 md:px-4 md:py-3 border-b border-gray-100 md:border-b-0">
                  <div className="text-sm font-bold text-gray-900 mb-1">Where</div>
                  <input
                    type="text"
                    placeholder="Search destinations"
                    value={searchLocation}
                    onChange={(e) => setSearchLocation(e.target.value)}
                    className="w-full text-base font-medium text-gray-700 bg-transparent border-0 focus:outline-none placeholder:text-gray-500"
                  />
                </div>
                <div className="flex-1 min-w-0 px-3 py-2 md:px-4 md:py-3 border-b border-gray-100 md:border-b-0">
                  <div className="text-sm font-bold text-gray-900 mb-1">Check in</div>
                  <div className="text-base font-medium text-gray-600">Add dates</div>
                </div>
                <div className="flex-1 min-w-0 px-3 py-2 md:px-4 md:py-3 border-b border-gray-100 md:border-b-0">
                  <div className="text-sm font-bold text-gray-900 mb-1">Check out</div>
                  <div className="text-base font-medium text-gray-600">Add dates</div>
                </div>
                <div className="flex-1 min-w-0 px-3 py-2 md:px-4 md:py-3 flex items-center justify-between gap-3">
                  <div>
                    <div className="text-sm font-bold text-gray-900 mb-1">Who</div>
                    <div className="text-base font-medium text-gray-600">Add guests</div>
                  </div>
                  <button
                    type="button"
                    onClick={() => navigate('/villas')}
                    className="bg-airbnb-red hover:bg-airbnb-red-dark text-white p-3 rounded-full shrink-0 btn-primary-motion"
                    aria-label="Search villas"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          </AnimatedSection>
        </div>
      </div>

      {/* Villas */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <AnimatedSection>
          <h2 className="font-heading text-4xl font-normal tracking-wide text-gray-900 mb-2">Featured villas</h2>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl">
            {BRAND_TAGLINE}. Every card is a separate villa we manage—tap to see location, amenities, and rates.
          </p>
        </AnimatedSection>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {demoRooms.filter((room) => room.status === 'available').map((room, index) => (
            <AnimatedSection key={room.id} delay={index * 120} variant="fade-up">
            <div
              className="room-card bg-white rounded-xl overflow-hidden shadow-md cursor-pointer border border-gray-100 h-full"
              onClick={() => handleRoomClick(room.id)}
            >
              <div className="relative overflow-hidden">
                <img
                  src={room.images[0]}
                  alt={room.name}
                  className="room-card-image w-full h-56 object-cover"
                />
                <span className="villa-card-tag absolute top-3 left-3 rounded-full bg-white/95 px-3 py-1 text-sm font-bold">
                  {room.room_type}
                </span>
              </div>
              <div className="p-5">
                <div className="flex justify-between items-start mb-2 gap-2">
                  <h3 className="font-heading text-lg text-gray-900 leading-snug uppercase tracking-wide">{room.name}</h3>
                  <div className="flex items-center text-base shrink-0">
                    <svg className="w-4 h-4 text-yellow-400 mr-1" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                    <span className="font-semibold">{room.rating}</span>
                  </div>
                </div>
                <p className="text-gray-600 text-base font-medium mb-2">
                  {room.location} · Up to {room.max_guests} guests
                </p>
                <p className="text-gray-500 text-base mb-3 line-clamp-2">{room.description}</p>
                <div className="flex justify-between items-center">
                  <div>
                    <span className="text-lg font-bold villa-card-price">₹{room.price_per_night.toLocaleString('en-IN')}</span>
                    <span className="text-gray-600 text-base"> / night</span>
                  </div>
                  <span className="text-base text-gray-500">{room.review_count} reviews</span>
                </div>
              </div>
            </div>
            </AnimatedSection>
          ))}
        </div>
        <AnimatedSection delay={200} className="text-center mt-10">
          <button
            type="button"
            onClick={() => navigate('/villas')}
            className="inline-flex items-center rounded-full bg-airbnb-red px-6 py-3 text-white font-bold hover:bg-airbnb-red-dark btn-primary-motion"
          >
            View all villas
          </button>
        </AnimatedSection>
      </div>

      {/* Quick Links */}
      <div className="bg-gray-100 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <AnimatedSection variant="fade-in">
            <h2 className="font-heading text-3xl font-normal tracking-wide text-gray-900 mb-8 text-center">
              Explore our stays
            </h2>
          </AnimatedSection>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { name: 'All villas', path: '/villas', image: 'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=400&h=300&fit=crop' },
              { name: 'Facilities', path: '/facilities', image: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=400&h=300&fit=crop' },
              { name: 'About us', path: '/about', image: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=400&h=300&fit=crop' },
              { name: 'Contact', path: '/contact', image: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=400&h=300&fit=crop' },
            ].map((item, index) => (
              <AnimatedSection key={item.name} delay={index * 100} variant="scale-in">
              <Link
                to={item.path}
                className="explore-tile relative rounded-lg overflow-hidden cursor-pointer group block"
              >
                <img
                  src={item.image}
                  alt={item.name}
                  className="explore-tile-image w-full h-32 object-cover transition-transform duration-500 ease-out"
                />
                <div className="absolute inset-0 bg-black/30 group-hover:bg-black/40 transition-colors duration-300 flex items-center justify-center">
                  <span className="explore-tile-label text-white font-bold text-lg transition-all duration-300">
                    {item.name}
                  </span>
                </div>
              </Link>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </div>
      
    </PublicLayout>
  );
};

// Create a client for React Query
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000,
      retry: 1,
    },
  },
});

const LegacyRoomRedirect = () => {
  const { id } = useParams();
  return <Navigate to={id ? `/villas/${id}` : '/villas'} replace />;
};

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Router>
        <ScrollToTop />
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<HomePage />} />
          <Route path="/rooms" element={<Navigate to="/villas" replace />} />
          <Route path="/rooms/:id" element={<LegacyRoomRedirect />} />
          <Route path="/villas" element={<RoomsPage />} />
          <Route path="/villas/:id" element={<RoomDetailPage />} />
          <Route path="/facilities" element={<FacilitiesPage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route path="/booking/:roomId" element={<BookingPage />} />
          <Route path="/bookings" element={<UserBookingsPage />} />
          <Route path="/login" element={<PublicLogin />} />
          
          {/* Admin Routes */}
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="/admin/rooms" element={<AdminRooms />} />
          <Route path="/admin/bookings" element={<AdminBookings />} />
          <Route path="/admin/users" element={<AdminUsers />} />
          <Route path="/admin/analytics" element={<AdminAnalytics />} />
          
          <Route path="*" element={
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
              <div className="text-center">
                <h1 className="text-4xl font-bold text-gray-900 mb-4">404</h1>
                <p className="text-gray-600 mb-6">Page not found</p>
                <Link to="/" className="bg-red-500 hover:bg-red-600 text-white px-6 py-2 rounded-lg transition-colors">
                  Go back home
                </Link>
              </div>
            </div>
          } />
        </Routes>
      </Router>
    </QueryClientProvider>
  );
}

export default App;

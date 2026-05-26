// User Types
export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  phone?: string;
  role: 'user' | 'admin';
  avatar?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface UserProfile extends User {
  preferences?: {
    currency: string;
    language: string;
    notifications: boolean;
  };
}

// Room and Property Types
export interface RoomType {
  id: string;
  name: string;
  description: string;
  pricePerNight: number;
  capacity: number;
  bedrooms: number;
  bathrooms: number;
  amenities: string[];
  images: string[];
  features: string[];
  size: number; // in square feet
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface Room {
  id: string;
  roomTypeId: string;
  roomNumber: string;
  floor: number;
  status: 'available' | 'occupied' | 'maintenance' | 'out_of_order';
  lastCleaned?: Date;
  notes?: string;
  roomType?: RoomType;
}

// Booking Types
export interface Booking {
  id: string;
  userId: string;
  roomId: string;
  roomTypeId: string;
  checkIn: Date;
  checkOut: Date;
  guests: {
    adults: number;
    children: number;
    infants: number;
  };
  totalAmount: number;
  baseAmount: number;
  taxes: number;
  serviceFee: number;
  cleaningFee: number;
  status: 'pending' | 'confirmed' | 'checked_in' | 'checked_out' | 'cancelled' | 'refunded';
  paymentStatus: 'pending' | 'paid' | 'failed' | 'refunded';
  paymentIntent?: string;
  specialRequests?: string;
  guestInfo: {
    name: string;
    email: string;
    phone?: string;
  };
  cancellationReason?: string;
  createdAt: Date;
  updatedAt: Date;
  user?: User;
  room?: Room;
  roomType?: RoomType;
}

export interface BookingCalendarEvent {
  id: string;
  start: Date;
  end: Date;
  title: string;
  status: Booking['status'];
  guestName: string;
}

// Search and Filter Types
export interface SearchFilters {
  checkIn?: Date;
  checkOut?: Date;
  guests: {
    adults: number;
    children: number;
    infants: number;
  };
  priceRange: {
    min: number;
    max: number;
  };
  amenities: string[];
  roomType?: string;
  sortBy: 'price_low' | 'price_high' | 'rating' | 'popularity';
}

export interface SearchResults {
  rooms: RoomType[];
  totalCount: number;
  filters: {
    priceRange: { min: number; max: number };
    amenities: string[];
    roomTypes: string[];
  };
}

// Facility and Amenity Types
export interface Facility {
  id: string;
  name: string;
  description: string;
  category: 'pool' | 'spa' | 'restaurant' | 'bar' | 'gym' | 'business' | 'recreation' | 'other';
  hours?: {
    open: string;
    close: string;
    days: string[];
  };
  images: string[];
  isActive: boolean;
}

// Review and Rating Types
export interface Review {
  id: string;
  bookingId: string;
  userId: string;
  roomTypeId: string;
  rating: number;
  comment: string;
  categories: {
    cleanliness: number;
    accuracy: number;
    checkIn: number;
    communication: number;
    location: number;
    value: number;
  };
  isVerified: boolean;
  helpfulCount: number;
  createdAt: Date;
  user?: Pick<User, 'id' | 'firstName' | 'avatar'>;
}

// Payment Types
export interface PaymentIntent {
  id: string;
  amount: number;
  currency: string;
  status: 'requires_payment_method' | 'requires_confirmation' | 'requires_action' | 'processing' | 'requires_capture' | 'canceled' | 'succeeded';
  clientSecret: string;
}

export interface PaymentMethod {
  id: string;
  type: 'card';
  card: {
    brand: string;
    last4: string;
    expMonth: number;
    expYear: number;
  };
}

// Admin Types
export interface AdminStats {
  totalBookings: number;
  totalRevenue: number;
  occupancyRate: number;
  averageRating: number;
  newUsersThisMonth: number;
  bookingsThisMonth: number;
  revenueThisMonth: number;
  topRoomTypes: Array<{
    name: string;
    bookings: number;
    revenue: number;
  }>;
  monthlyData: Array<{
    month: string;
    revenue: number;
    bookings: number;
    occupancy: number;
  }>;
}

// API Response Types
export interface ApiResponse<T> {
  data: T;
  message?: string;
  success: boolean;
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    pageSize: number;
    total: number;
    totalPages: number;
  };
}

// Form Types
export interface BookingFormData {
  checkIn: Date;
  checkOut: Date;
  guests: {
    adults: number;
    children: number;
    infants: number;
  };
  specialRequests?: string;
  guestInfo: {
    name: string;
    email: string;
    phone?: string;
  };
}

export interface ContactFormData {
  name: string;
  email: string;
  phone?: string;
  subject: string;
  message: string;
}

// Utility Types
export type DateRange = {
  start: Date;
  end: Date;
};

export type LoadingState = 'idle' | 'loading' | 'succeeded' | 'failed';

export interface LoadingResult<T> {
  data: T | null;
  loading: boolean;
  error: string | null;
}

// Navigation Types
export interface NavItem {
  label: string;
  href: string;
  icon?: React.ComponentType<any>;
  children?: NavItem[];
}

// Modal Types
export interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
}

// Error Types
export interface AppError {
  message: string;
  code?: string;
  details?: any;
} 
import type { Room } from '../data/resort';
import type { PropertyForSale } from '../data/propertiesForSale';

export type Facility = {
  id: string;
  name: string;
  description: string;
  image: string;
  hours: string;
};

export type ExploreTile = {
  name: string;
  path: string;
  image: string;
};

export type AboutHighlight = {
  title: string;
  text: string;
};

export type SiteSettings = {
  resortName: string;
  brandTagline: string;
  resortLocation: string;
  resortAddress: string;
  resortPhone: string;
  resortEmail: string;
  heroTitle: string;
  heroSubtitle: string;
  aboutImage: string;
  aboutParagraphs: string[];
  aboutHighlights: AboutHighlight[];
  exploreTiles: ExploreTile[];
  villasPageTitle: string;
  villasPageSubtitle: string;
  facilitiesPageTitle: string;
  facilitiesPageSubtitle: string;
  forSalePageTitle: string;
  forSalePageSubtitle: string;
  contactPageSubtitle: string;
};

export type AdminBooking = {
  id: string;
  roomId: string;
  roomName: string;
  guestName: string;
  guestEmail: string;
  checkIn: string;
  checkOut: string;
  guests: number;
  total: number;
  status: 'confirmed' | 'pending' | 'cancelled' | 'completed';
  bookingRef: string;
  bookedAt: string;
};

export type AdminUser = {
  id: string;
  name: string;
  email: string;
  phone: string;
  joinDate: string;
  totalBookings: number;
  totalSpent: number;
  status: 'active' | 'vip' | 'inactive';
};

export type ContactMessage = {
  id: string;
  name: string;
  email: string;
  phone: string;
  subject: string;
  message: string;
  createdAt: string;
};

export type SiteData = {
  settings: SiteSettings;
  rooms: Room[];
  propertiesForSale: PropertyForSale[];
  facilities: Facility[];
  bookings: AdminBooking[];
  users: AdminUser[];
  contactMessages: ContactMessage[];
};

export type { Room, PropertyForSale };

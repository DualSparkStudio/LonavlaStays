// API utilities for serverless functions

export interface BookingData {
  userId: string;
  roomId: string;
  checkIn: string;
  checkOut: string;
  guests: number;
  totalPrice: number;
}

export interface EmailData {
  type: 'booking-confirmation' | 'booking-cancellation';
  data: {
    bookingId: string;
    guestName: string;
    guestEmail: string;
    roomName?: string;
    checkIn?: string;
    checkOut?: string;
    guests?: number;
    totalPrice?: number;
    roomImage?: string;
    refundAmount?: number;
    cancellationFee?: number;
  };
}

const API_BASE = '/.netlify/functions';

export const api = {
  // Create booking with payment processing
  createBooking: async (booking: BookingData, paymentMethodId: string) => {
    const response = await fetch(`${API_BASE}/create-booking`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        booking,
        paymentMethodId,
      }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to create booking');
    }

    return response.json();
  },

  // Cancel booking with refund processing
  cancelBooking: async (bookingId: string, userId: string) => {
    const response = await fetch(`${API_BASE}/cancel-booking`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        bookingId,
        userId,
      }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to cancel booking');
    }

    return response.json();
  },

  // Send email notifications
  sendEmail: async (emailData: EmailData) => {
    const response = await fetch(`${API_BASE}/send-email`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(emailData),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to send email');
    }

    return response.json();
  },
};

// Helper function to handle API errors
export const handleApiError = (error: unknown): string => {
  if (error instanceof Error) {
    return error.message;
  }
  return 'An unexpected error occurred';
};

// Helper function for local development (fallback to direct calls)
export const isDevelopment = () => {
  return import.meta.env.DEV;
};

// Development fallback functions (for local testing without Netlify)
export const devApi = {
  createBooking: async (booking: BookingData, paymentMethodId: string) => {
    // Simulate booking creation for development
    console.log('Dev mode: Creating booking', { booking, paymentMethodId });
    await new Promise(resolve => setTimeout(resolve, 1000));
    return {
      success: true,
      booking: { ...booking, id: 'dev-booking-' + Date.now() },
    };
  },

  cancelBooking: async (bookingId: string, userId: string) => {
    // Simulate booking cancellation for development
    console.log('Dev mode: Cancelling booking', { bookingId, userId });
    await new Promise(resolve => setTimeout(resolve, 1000));
    return {
      success: true,
      refundAmount: 135,
      cancellationFee: 15,
    };
  },

  sendEmail: async (emailData: EmailData) => {
    // Simulate email sending for development
    console.log('Dev mode: Sending email', emailData);
    await new Promise(resolve => setTimeout(resolve, 500));
    return {
      success: true,
      emailId: 'dev-email-' + Date.now(),
    };
  },
};

// Export the appropriate API based on environment
export const bookingApi = isDevelopment() ? devApi : api; 
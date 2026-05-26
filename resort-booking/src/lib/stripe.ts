import { loadStripe } from '@stripe/stripe-js';

const stripePublishableKey = import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY || 'pk_test_...';

export const stripePromise = loadStripe(stripePublishableKey);

export interface PaymentIntentData {
  amount: number;
  currency: string;
  bookingId: string;
  guestEmail: string;
  metadata: {
    bookingId: string;
    roomId: string;
    checkIn: string;
    checkOut: string;
    guests: number;
  };
}

export interface CreatePaymentIntentResponse {
  clientSecret: string;
  paymentIntentId: string;
}

// Utility function to create payment intent
export const createPaymentIntent = async (data: PaymentIntentData): Promise<CreatePaymentIntentResponse> => {
  // In a real app, this would call your backend API
  // For now, we'll simulate the response
  
  const response = await fetch('/api/create-payment-intent', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    throw new Error('Failed to create payment intent');
  }

  return response.json();
};

// Utility function to confirm payment
export const confirmPayment = async (paymentIntentId: string) => {
  const response = await fetch(`/api/confirm-payment/${paymentIntentId}`, {
    method: 'POST',
  });

  if (!response.ok) {
    throw new Error('Failed to confirm payment');
  }

  return response.json();
};

// Format currency for display
export const formatCurrency = (amount: number, currency: string = 'USD'): string => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
  }).format(amount / 100); // Stripe amounts are in cents
};

// Calculate processing fee (typically 2.9% + 30¢ for Stripe)
export const calculateProcessingFee = (amount: number): number => {
  return Math.round(amount * 0.029 + 30);
};

// Payment method types
export type PaymentMethodType = 'card' | 'apple_pay' | 'google_pay';

export interface PaymentMethodData {
  type: PaymentMethodType;
  card?: {
    brand: string;
    last4: string;
    exp_month: number;
    exp_year: number;
  };
}

// Error handling for Stripe errors
export const handleStripeError = (error: any): string => {
  switch (error.code) {
    case 'card_declined':
      return 'Your card was declined. Please try a different payment method.';
    case 'expired_card':
      return 'Your card has expired. Please use a different card.';
    case 'incorrect_cvc':
      return 'Your card\'s security code is incorrect.';
    case 'processing_error':
      return 'An error occurred while processing your card. Please try again.';
    case 'rate_limit':
      return 'Too many requests. Please try again in a moment.';
    default:
      return error.message || 'An unexpected error occurred. Please try again.';
  }
}; 
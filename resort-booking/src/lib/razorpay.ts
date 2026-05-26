import { RESORT_NAME } from '../data/resort';

export const RAZORPAY_KEY_ID = import.meta.env.VITE_RAZORPAY_KEY_ID as string | undefined;

const CHECKOUT_SCRIPT = 'https://checkout.razorpay.com/v1/checkout.js';

export interface CreateOrderPayload {
  amountInr: number;
  receipt: string;
  notes?: Record<string, string>;
}

export interface CreateOrderResponse {
  keyId: string;
  orderId: string;
  amount: number;
  currency: string;
}

export interface RazorpayCheckoutParams {
  order: CreateOrderResponse;
  description: string;
  prefill: {
    name: string;
    email: string;
    contact: string;
  };
  notes?: Record<string, string>;
}

let scriptPromise: Promise<void> | null = null;

export function loadRazorpayScript(): Promise<void> {
  if (typeof window === 'undefined') {
    return Promise.reject(new Error('Razorpay can only run in the browser'));
  }
  if (window.Razorpay) return Promise.resolve();
  if (scriptPromise) return scriptPromise;

  scriptPromise = new Promise((resolve, reject) => {
    const script = document.createElement('script');
    script.src = CHECKOUT_SCRIPT;
    script.async = true;
    script.onload = () => resolve();
    script.onerror = () => reject(new Error('Failed to load Razorpay checkout'));
    document.body.appendChild(script);
  });

  return scriptPromise;
}

async function parseApiResponse<T>(response: Response): Promise<T> {
  const text = await response.text();

  if (!text.trim()) {
    if (response.status === 404) {
      throw new Error(
        'Payment API not found. Stop the dev server, run `npm run dev` from the resort-booking folder, then try again.',
      );
    }
    throw new Error(`Payment server returned an empty response (${response.status}).`);
  }

  let data: { error?: string } & T;
  try {
    data = JSON.parse(text) as { error?: string } & T;
  } catch {
    throw new Error('Payment server returned an invalid response. Please try again.');
  }

  if (!response.ok) {
    throw new Error(data.error || `Payment request failed (${response.status})`);
  }

  return data;
}

export async function createRazorpayOrder(
  payload: CreateOrderPayload,
): Promise<CreateOrderResponse> {
  const response = await fetch('/api/create-razorpay-order', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });

  return parseApiResponse<CreateOrderResponse>(response);
}

export async function verifyRazorpayPayment(params: {
  orderId: string;
  paymentId: string;
  signature: string;
}): Promise<void> {
  const response = await fetch('/api/verify-razorpay-payment', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(params),
  });

  await parseApiResponse<{ success: boolean }>(response);
}

export async function openRazorpayCheckout(
  params: RazorpayCheckoutParams,
): Promise<RazorpaySuccessResponse> {
  if (!RAZORPAY_KEY_ID && !params.order.keyId) {
    throw new Error('Razorpay key is not configured (VITE_RAZORPAY_KEY_ID)');
  }

  await loadRazorpayScript();

  return new Promise((resolve, reject) => {
    const rzp = new window.Razorpay({
      key: params.order.keyId || RAZORPAY_KEY_ID!,
      amount: params.order.amount,
      currency: params.order.currency,
      name: RESORT_NAME,
      description: params.description,
      order_id: params.order.orderId,
      prefill: params.prefill,
      notes: params.notes,
      theme: { color: '#FF385C' },
      handler: (response) => resolve(response),
      modal: {
        ondismiss: () => reject(new Error('Payment cancelled')),
      },
    });

    rzp.on('payment.failed', (response) => {
      reject(new Error(response.error?.description || 'Payment failed'));
    });

    rzp.open();
  });
}

export function handleRazorpayError(error: unknown): string {
  if (error instanceof Error) return error.message;
  return 'Something went wrong with payment. Please try again.';
}

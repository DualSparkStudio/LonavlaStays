import crypto from 'node:crypto';
import Razorpay from 'razorpay';

export function getRazorpayCredentials() {
  const key_id = process.env.RAZORPAY_KEY_ID || process.env.VITE_RAZORPAY_KEY_ID;
  const key_secret = process.env.RAZORPAY_KEY_SECRET;

  if (!key_id || !key_secret) {
    throw new Error(
      'Razorpay is not configured. Set RAZORPAY_KEY_ID and RAZORPAY_KEY_SECRET in your environment.',
    );
  }

  return { key_id, key_secret };
}

function getClient() {
  const { key_id, key_secret } = getRazorpayCredentials();
  return new Razorpay({ key_id, key_secret });
}

export interface CreateOrderInput {
  /** Total amount in INR (rupees) */
  amountInr: number;
  receipt: string;
  notes?: Record<string, string>;
}

export async function createRazorpayOrder(input: CreateOrderInput) {
  const { key_id } = getRazorpayCredentials();
  const amountPaise = Math.round(input.amountInr * 100);

  if (amountPaise < 100) {
    throw new Error('Amount must be at least ₹1');
  }

  const client = getClient();
  const order = await client.orders.create({
    amount: amountPaise,
    currency: 'INR',
    receipt: input.receipt.slice(0, 40),
    notes: input.notes,
  });

  return {
    keyId: key_id,
    orderId: order.id,
    amount: order.amount,
    currency: order.currency,
  };
}

export function verifyRazorpaySignature(
  orderId: string,
  paymentId: string,
  signature: string,
): boolean {
  const { key_secret } = getRazorpayCredentials();
  const expected = crypto
    .createHmac('sha256', key_secret)
    .update(`${orderId}|${paymentId}`)
    .digest('hex');
  return expected === signature;
}

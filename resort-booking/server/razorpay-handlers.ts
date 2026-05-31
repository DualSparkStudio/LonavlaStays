import crypto from 'node:crypto';
import Razorpay from 'razorpay';

/** Local demo checkout — no Razorpay account required. Never enable on production. */
export function isPaymentDemoMode(): boolean {
  return process.env.PAYMENT_DEMO_MODE === 'true';
}

export function getRazorpayCredentials() {
  if (isPaymentDemoMode()) {
    return { key_id: 'rzp_test_demo', key_secret: 'demo_secret' };
  }

  const key_id = process.env.RAZORPAY_KEY_ID || process.env.VITE_RAZORPAY_KEY_ID;
  const key_secret = process.env.RAZORPAY_KEY_SECRET;

  if (!key_id || !key_secret || key_id.includes('xxxxxxxx') || key_secret.includes('your_')) {
    throw new Error(
      'Razorpay test keys are not configured. Add rzp_test_ keys to .env.local, or set PAYMENT_DEMO_MODE=true for local demo checkout.',
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
  const amountPaise = Math.round(input.amountInr * 100);

  if (amountPaise < 100) {
    throw new Error('Amount must be at least ₹1');
  }

  if (isPaymentDemoMode()) {
    return {
      keyId: 'rzp_test_demo',
      orderId: `order_demo_${Date.now()}`,
      amount: amountPaise,
      currency: 'INR',
    };
  }

  const { key_id } = getRazorpayCredentials();
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
  if (isPaymentDemoMode() && paymentId.startsWith('pay_demo_') && signature === 'demo_signature') {
    return orderId.startsWith('order_demo_');
  }

  const { key_secret } = getRazorpayCredentials();
  const expected = crypto
    .createHmac('sha256', key_secret)
    .update(`${orderId}|${paymentId}`)
    .digest('hex');
  return expected === signature;
}
